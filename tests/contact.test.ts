import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

/**
 * Resend no lanza cuando el envío falla: devuelve `{ data: null, error }`. La
 * ruta tiene que mirar ese `error`; si no, el formulario dice «enviado» y el
 * correo no sale nunca.
 */

const sendMock = vi.fn();

vi.mock('resend', () => ({
  Resend: class {
    emails = { send: sendMock };
  },
}));

vi.mock('@/lib/ratelimit', () => ({
  createRateLimiter: () => async () => false,
}));

const valid = { name: "Ana O'Brien", email: 'ana@example.com', message: 'Hola, me gustó el artículo.', website: '' };

function post(body: unknown) {
  return new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

async function call(body: unknown) {
  const { POST } = await import('@/app/api/contact/route');
  // La ruta solo usa la API estándar de Request (headers y json).
  const res = await POST(post(body) as never);
  return { status: res.status, json: await res.json() };
}

describe('/api/contact', () => {
  beforeEach(() => {
    process.env.RESEND_API_KEY = 're_test';
    sendMock.mockReset();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('si Resend devuelve un error, responde error y no «enviado»', async () => {
    sendMock.mockResolvedValue({ data: null, error: { name: 'validation_error', message: 'bad', statusCode: 422 } });
    const { status, json } = await call(valid);
    expect(status).toBe(502);
    expect(json).toEqual({ error: 'server_error' });
  });

  it('si Resend acepta el correo, responde 200 sin devolver datos internos', async () => {
    sendMock.mockResolvedValue({ data: { id: 'abc' }, error: null });
    const { status, json } = await call(valid);
    expect(status).toBe(200);
    expect(json).not.toHaveProperty('data');
  });

  it('el texto plano y el asunto llevan el nombre tal cual; solo el HTML va escapado', async () => {
    sendMock.mockResolvedValue({ data: { id: 'abc' }, error: null });
    await call(valid);
    const sent = sendMock.mock.calls[0][0];
    expect(sent.subject).toContain("Ana O'Brien");
    expect(sent.text).toContain("Ana O'Brien");
    expect(sent.html).toContain('Ana O&#039;Brien');
  });

  it('un cuerpo que no es JSON es un 400, no un 500', async () => {
    const { status, json } = await call('no es json');
    expect(status).toBe(400);
    expect(json).toEqual({ error: 'missing_fields' });
  });

  it('campos que no son texto cuentan como que faltan', async () => {
    const { status, json } = await call({ ...valid, name: 42 });
    expect(status).toBe(400);
    expect(json).toEqual({ error: 'missing_fields' });
  });

  it('sin RESEND_API_KEY responde server_error en vez de romper al cargar la ruta', async () => {
    delete process.env.RESEND_API_KEY;
    vi.resetModules();
    const { status, json } = await call(valid);
    expect(status).toBe(500);
    expect(json).toEqual({ error: 'server_error' });
    expect(sendMock).not.toHaveBeenCalled();
  });
});
