import { convertToModelMessages, streamText, type UIMessage } from 'ai';
import { buildSystemPrompt } from '@/lib/raul-context';
import { createRateLimiter } from '@/lib/ratelimit';

// Permite respuestas en streaming hasta 30s
export const maxDuration = 30;

const MODEL = 'anthropic/claude-haiku-4.5';
const MAX_MESSAGES = 24;
/** Tope de caracteres por mensaje (el input del widget corta a 500). */
const MAX_TEXT_PER_MESSAGE = 4_000;
/** Tope de caracteres del historial completo (anti-abuso de tokens). */
const MAX_TOTAL_TEXT = 24_000;

const isLimited = createRateLimiter({ prefix: 'ratelimit:chat', limit: 15, window: '1 m' });

type TextPart = { type: 'text'; text: string };

/**
 * Acepta solo mensajes user/assistant con partes de texto. Cualquier otra
 * parte (ficheros, tool calls…) o campo se descarta antes de llegar al modelo.
 */
function sanitizeMessages(input: unknown): UIMessage[] | null {
  if (!Array.isArray(input) || input.length === 0) return null;

  const messages: UIMessage[] = [];
  let total = 0;

  for (const raw of input.slice(-MAX_MESSAGES)) {
    if (!raw || typeof raw !== 'object') return null;
    const { id, role, parts } = raw as Partial<UIMessage>;
    if ((role !== 'user' && role !== 'assistant') || !Array.isArray(parts)) return null;

    const textParts = parts
      .filter((p): p is TextPart => !!p && p.type === 'text' && typeof (p as TextPart).text === 'string')
      .map((p) => ({ type: 'text' as const, text: p.text.slice(0, MAX_TEXT_PER_MESSAGE) }));
    if (textParts.length === 0) continue;

    total += textParts.reduce((n, p) => n + p.text.length, 0);
    if (total > MAX_TOTAL_TEXT) return null;

    messages.push({ id: typeof id === 'string' ? id : crypto.randomUUID(), role, parts: textParts });
  }

  // El modelo necesita que el último turno sea de la persona.
  return messages.length > 0 && messages[messages.length - 1].role === 'user' ? messages : null;
}

export async function POST(req: Request) {
  try {
    // Rate limiting por IP (el endpoint de IA cuesta tokens). El código
    // 'rate_limited' lo traduce el widget.
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
    if (await isLimited(ip)) {
      return Response.json({ error: 'rate_limited' }, { status: 429 });
    }

    let body: { messages?: unknown; locale?: unknown };
    try {
      body = await req.json();
    } catch {
      return Response.json({ error: 'invalid_request' }, { status: 400 });
    }

    const messages = sanitizeMessages(body.messages);
    if (!messages) {
      return Response.json({ error: 'invalid_messages' }, { status: 400 });
    }
    const locale = body.locale === 'en' ? 'en' : 'es';

    const result = streamText({
      model: MODEL,
      system: buildSystemPrompt(locale),
      messages: await convertToModelMessages(messages),
      // Respuestas estables y ceñidas a los datos: es un asistente factual,
      // no creativo. El tope de salida mantiene las respuestas breves.
      temperature: 0.4,
      maxOutputTokens: 700,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Error en /api/chat:', error);
    return Response.json({ error: 'server_error' }, { status: 500 });
  }
}
