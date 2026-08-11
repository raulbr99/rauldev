// utils/formValidation.ts

export interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
  consent?: string;
}

export interface FormData {
  name: string;
  email: string;
  message: string;
  consent: boolean;
}

/**
 * Devuelve la CLAVE de traducción del error (p. ej. "name.required"), no el
 * texto. Quien la consume la pasa por next-intl, de modo que el formulario
 * habla el idioma de la página en vez de responder siempre en español.
 */
export const validateField = (
  name: string,
  value: string | boolean
): string | undefined => {
  switch (name) {
    case 'name': {
      const v = String(value);
      if (!v.trim()) return 'name.required';
      if (v.trim().length < 2) return 'name.minLength';
      if (v.length > 50) return 'name.maxLength';
      // Letras de cualquier alfabeto (\p{L}), marcas diacríticas (\p{M}) y los
      // separadores habituales en nombres compuestos: Müller, Nguyễn, O'Brien,
      // Jean-Pierre, Ivanović… Solo excluye dígitos y símbolos.
      if (!/^[\p{L}\p{M}\s'’\-.]+$/u.test(v)) return 'name.lettersOnly';
      return undefined;
    }

    case 'email': {
      const v = String(value);
      if (!v.trim()) return 'email.required';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'email.invalid';
      if (v.length > 100) return 'email.maxLength';
      return undefined;
    }

    case 'message': {
      const v = String(value);
      if (!v.trim()) return 'message.required';
      if (v.trim().length < 10) return 'message.minLength';
      if (v.length > 1000) return 'message.maxLength';
      return undefined;
    }

    case 'consent':
      return value === true ? undefined : 'consent.required';

    default:
      return undefined;
  }
};

export const validateAllFields = (formData: FormData): FormErrors => {
  const errors: FormErrors = {};

  (Object.keys(formData) as (keyof FormData)[]).forEach((key) => {
    const error = validateField(key, formData[key]);
    if (error) {
      errors[key as keyof FormErrors] = error;
    }
  });

  return errors;
};

export const isFormValid = (errors: FormErrors, formData: FormData): boolean => {
  return (
    Object.keys(errors).length === 0 &&
    formData.name.trim() !== '' &&
    formData.email.trim() !== '' &&
    formData.message.trim() !== '' &&
    formData.consent === true
  );
};
