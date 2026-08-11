import { describe, it, expect } from 'vitest';
import { validateField, validateAllFields, isFormValid } from '@/utils/formValidation';

describe('validateField — nombre', () => {
  // El regex anterior (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/) rechazaba estos nombres y
  // bloqueaba el formulario de contacto a media Europa. Esta es la regresión
  // que estos casos protegen.
  it.each([
    'Raúl Berná',
    'Müller',
    'Nguyễn Văn A',
    "O'Brien",
    'Jean-Pierre',
    'Åsa Ivanović',
    'Güell',
    'J. R. R. Tolkien',
    '李伟',
    'Владимир',
  ])('acepta %s', (nombre) => {
    expect(validateField('name', nombre)).toBeUndefined();
  });

  it.each([
    ['vacío', '', 'name.required'],
    ['solo espacios', '   ', 'name.required'],
    ['una letra', 'R', 'name.minLength'],
    ['con dígitos', 'Raul123', 'name.lettersOnly'],
    ['con markup', '<script>', 'name.lettersOnly'],
    ['un email', 'a@b.com', 'name.lettersOnly'],
  ])('rechaza %s', (_caso, valor, clave) => {
    expect(validateField('name', valor)).toBe(clave);
  });

  it('rechaza por encima de 50 caracteres', () => {
    expect(validateField('name', 'a'.repeat(51))).toBe('name.maxLength');
  });
});

describe('validateField — email y mensaje', () => {
  it('acepta un email válido y rechaza uno sin dominio', () => {
    expect(validateField('email', 'raul@example.com')).toBeUndefined();
    expect(validateField('email', 'noesunemail')).toBe('email.invalid');
    expect(validateField('email', '')).toBe('email.required');
  });

  it('exige al menos 10 caracteres de mensaje', () => {
    expect(validateField('message', 'corto')).toBe('message.minLength');
    expect(validateField('message', 'Hola, tengo una vacante para ti')).toBeUndefined();
  });
});

describe('consentimiento RGPD', () => {
  it('es obligatorio marcarlo', () => {
    expect(validateField('consent', false)).toBe('consent.required');
    expect(validateField('consent', true)).toBeUndefined();
  });

  it('un formulario sin consentimiento no es válido aunque el resto esté bien', () => {
    const datos = {
      name: 'Raúl Berná',
      email: 'raul@example.com',
      message: 'Hola, tengo una vacante para ti',
      consent: false,
    };
    expect(validateAllFields(datos)).toEqual({ consent: 'consent.required' });
    expect(isFormValid({}, datos)).toBe(false);
    expect(isFormValid({}, { ...datos, consent: true })).toBe(true);
  });
});

describe('validateField — devuelve claves de traducción, no texto', () => {
  it('nunca devuelve una frase en español', () => {
    const clave = validateField('name', '');
    expect(clave).toBe('name.required');
    expect(clave).not.toMatch(/\s/);
  });
});
