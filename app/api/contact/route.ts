import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createRateLimiter } from '@/lib/ratelimit';

const resend = new Resend(process.env.RESEND_API_KEY);

// Rate limiting duradero (Upstash Redis) con fallback en memoria para local.
const isRateLimited = createRateLimiter({ prefix: 'ratelimit:contact', limit: 3, window: '1 m' });

// Sanitizar HTML para prevenir XSS
function sanitizeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
    if (await isRateLimited(ip)) {
      return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
    }

    const { name, email, message, website } = await request.json();

    // Honeypot: campo oculto que solo rellenan los bots. Si viene con valor,
    // respondemos 200 fingido (sin enviar nada) para no darles pistas.
    if (website) {
      return NextResponse.json(
        { message: 'Email enviado correctamente' },
        { status: 200 }
      );
    }

    // Los errores viajan como códigos estables; el texto lo pone el cliente en
    // el idioma de la página (contact.form.errors.*).
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'missing_fields' }, { status: 400 });
    }

    // Mismos límites que valida el cliente, para que ninguno sea inalcanzable.
    if (name.length > 50 || email.length > 100 || message.length > 1000) {
      return NextResponse.json({ error: 'too_long' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'invalid_email' }, { status: 400 });
    }

    // Sanitizar inputs
    const safeName = sanitizeHtml(name.trim());
    const safeEmail = sanitizeHtml(email.trim());
    const safeMessage = sanitizeHtml(message.trim());

    // Enviar email usando Resend
    const data = await resend.emails.send({
      from: 'Contacto Portfolio <onboarding@resend.dev>',
      to: ['raulbernariera99@gmail.com'],
      replyTo: email.trim(),
      subject: `Nuevo mensaje de contacto de ${safeName}`,
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
            <p style="line-height: 1.6; color: #475569;">${safeMessage}</p>
          </div>

          <div style="margin-top: 30px; padding: 15px; background-color: #dbeafe; border-radius: 8px;">
            <p style="margin: 0; color: #1e40af; font-size: 14px;">
              <strong>Nota:</strong> Este mensaje fue enviado desde tu portfolio web.
            </p>
          </div>
        </div>
      `,
      text: `
        Nuevo mensaje de contacto

        Nombre: ${safeName}
        Email: ${safeEmail}

        Mensaje:
        ${safeMessage}

        ---
        Este mensaje fue enviado desde tu portfolio web.
      `,
    });

    return NextResponse.json(
      { 
        message: 'Email enviado correctamente',
        data: data 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error enviando email:', error);
    
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}