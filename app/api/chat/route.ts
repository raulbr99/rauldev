import { convertToModelMessages, streamText, type UIMessage } from 'ai';
import { buildSystemPrompt } from '@/lib/raul-context';
import { createRateLimiter } from '@/lib/ratelimit';

// Permite respuestas en streaming hasta 30s
export const maxDuration = 30;

const MODEL = 'anthropic/claude-haiku-4.5';
const MAX_MESSAGES = 24;

const isLimited = createRateLimiter({ prefix: 'ratelimit:chat', limit: 15, window: '1 m' });

export async function POST(req: Request) {
  // Rate limiting por IP (el endpoint de IA cuesta tokens)
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (await isLimited(ip)) {
    return Response.json(
      { error: 'Demasiados mensajes. Espera un momento e inténtalo de nuevo.' },
      { status: 429 }
    );
  }

  let messages: UIMessage[];
  try {
    ({ messages } = await req.json());
  } catch {
    return Response.json({ error: 'Petición inválida' }, { status: 400 });
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: 'No hay mensajes' }, { status: 400 });
  }
  // Corta conversaciones excesivamente largas (anti-abuso de tokens)
  if (messages.length > MAX_MESSAGES) {
    messages = messages.slice(-MAX_MESSAGES);
  }

  const result = streamText({
    model: MODEL,
    system: buildSystemPrompt(),
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
