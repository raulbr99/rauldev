import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Rate limiting simple en memoria
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minuto
const MAX_REQUESTS = 3; // máximo 3 requests por minuto

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now - record.lastReset > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, lastReset: now });
    return false;
  }

  if (record.count >= MAX_REQUESTS) {
    return true;
  }

  record.count++;
  return false;
}

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
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Demasiadas solicitudes. Intenta de nuevo en un minuto.' },
        { status: 429 }
      );
    }

    const { name, email, message } = await request.json();

    // Validación básica
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // Validación de longitud
    if (name.length > 100 || email.length > 254 || message.length > 5000) {
      return NextResponse.json(
        { error: 'Los campos exceden la longitud máxima permitida' },
        { status: 400 }
      );
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      );
    }

    // Sanitizar inputs
    const safeName = sanitizeHtml(name.trim());
    const safeEmail = sanitizeHtml(email.trim());
    const safeMessage = sanitizeHtml(message.trim());

    // Enviar email usando Resend
    const data = await resend.emails.send({
      from: 'Contacto Portfolio <onboarding@resend.dev>',
      to: ['raulbernariera99@gmail.com'],
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