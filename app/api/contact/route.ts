import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createRateLimiter } from '@/lib/ratelimit';

const TO = 'raulbernariera99@gmail.com';

// Rate limiting duradero (Upstash Redis) con fallback en memoria para local.
const isRateLimited = createRateLimiter({ prefix: 'ratelimit:contact', limit: 3, window: '1 m' });

// El cliente se crea en la primera petición y no al cargar el módulo: el
// constructor de Resend lanza si falta RESEND_API_KEY, y eso tumbaría la ruta
// entera (y el build, si la carga) en vez de responder un error controlado.
let resend: Resend | null = null;
function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  resend ??= new Resend(process.env.RESEND_API_KEY);
  return resend;
}

// Escapa lo que va dentro del HTML del correo (solo el HTML: el asunto y el
// texto plano llevan los valores tal cual, o un «O'Brien» llegaría como «O&#039;Brien»).
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const asText = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
    if (await isRateLimited(ip)) {
      return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
    }

    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'missing_fields' }, { status: 400 });
    }

    // Honeypot: campo oculto que solo rellenan los bots. Si viene con valor,
    // respondemos 200 fingido (sin enviar nada) para no darles pistas.
    if (body?.website) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    // Los errores viajan como códigos estables; el texto lo pone el cliente en
    // el idioma de la página (contact.form.errors.*).
    const name = asText(body?.name);
    const email = asText(body?.email);
    const message = asText(body?.message);
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'missing_fields' }, { status: 400 });
    }

    // Mismos límites que valida el cliente, para que ninguno sea inalcanzable.
    if (name.length > 50 || email.length > 100 || message.length > 1000) {
      return NextResponse.json({ error: 'too_long' }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'invalid_email' }, { status: 400 });
    }

    const client = getResend();
    if (!client) {
      console.error('[contact] Falta RESEND_API_KEY: no se puede enviar el correo');
      return NextResponse.json({ error: 'server_error' }, { status: 500 });
    }

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message);

    // Resend no lanza si el envío falla: devuelve `{ error }`. Hay que mirarlo,
    // o el formulario diría «enviado» con un correo que nunca salió.
    const { error } = await client.emails.send({
      from: 'Contacto Portfolio <onboarding@resend.dev>',
      to: [TO],
      replyTo: email,
      subject: `Nuevo mensaje de contacto de ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
            Nuevo mensaje de contacto
          </h2>

          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e293b; margin-top: 0;">Información del contacto:</h3>
            <p><strong>Nombre:</strong> ${safeName}</p>
            <p><strong>Email:</strong> ${safeEmail}</p>
          </div>

          <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h3 style="color: #1e293b; margin-top: 0;">Mensaje:</h3>
            <p style="line-height: 1.6; color: #475569; white-space: pre-wrap;">${safeMessage}</p>
          </div>

          <div style="margin-top: 30px; padding: 15px; background-color: #dbeafe; border-radius: 8px;">
            <p style="margin: 0; color: #1e40af; font-size: 14px;">
              <strong>Nota:</strong> Este mensaje fue enviado desde tu portfolio web.
            </p>
          </div>
        </div>
      `,
      text: [
        'Nuevo mensaje de contacto',
        '',
        `Nombre: ${name}`,
        `Email: ${email}`,
        '',
        'Mensaje:',
        message,
        '',
        '---',
        'Este mensaje fue enviado desde tu portfolio web.',
      ].join('\n'),
    });

    if (error) {
      console.error('[contact] Resend rechazó el envío:', error);
      return NextResponse.json({ error: 'server_error' }, { status: 502 });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error('[contact] Error enviando email:', error);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
