// utils/formValidation.ts

export interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export interface FormData {
  name: string;
  email: string;
  message: string;
}

export const validateField = (name: string, value: string): string | undefined => {
  switch (name) {
    case 'name':
      if (!value.trim()) {
        return 'El nombre es requerido';
      }
      if (value.trim().length < 2) {
        return 'El nombre debe tener al menos 2 caracteres';
      }
      if (value.length > 50) {
        return 'El nombre no puede exceder 50 caracteres';
      }
      if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
        return 'El nombre solo puede contener letras';
      }
      return undefined;

    case 'email':
      if (!value.trim()) {
        return 'El email es requerido';
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Por favor, introduce un email válido';
      }
      if (value.length > 100) {
        return 'El email no puede exceder 100 caracteres';
      }
      return undefined;

    case 'message':
      if (!value.trim()) {
        return 'El mensaje es requerido';
      }
      if (value.trim().length < 10) {
        return 'El mensaje debe tener al menos 10 caracteres';
      }
      if (value.length > 1000) {
        return 'El mensaje no puede exceder 1000 caracteres';
      }
      return undefined;

    default:
      return undefined;
  }
};

export const validateAllFields = (formData: FormData): FormErrors => {
  const errors: FormErrors = {};
  
  Object.keys(formData).forEach((key) => {
    const error = validateField(key, formData[key as keyof FormData]);
    if (error) {
      errors[key as keyof FormErrors] = error;
    }
  });

  return errors;
};

export const isFormValid = (errors: FormErrors, formData: FormData): boolean => {
  return Object.keys(errors).length === 0 && 
    formData.name.trim() !== '' && 
    formData.email.trim() !== '' && 
    formData.message.trim() !== '';
};