// hooks/useContactForm.ts
'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { FormData, FormErrors, validateField, validateAllFields, isFormValid } from '@/utils/formValidation';

interface FormTouched {
  name: boolean;
  email: boolean;
  message: boolean;
  consent: boolean;
}

const EMPTY_FORM: FormData = { name: '', email: '', message: '', consent: false };
const UNTOUCHED: FormTouched = { name: false, email: false, message: false, consent: false };

/** Códigos que devuelve /api/contact, traducidos en contact.form.errors.*  */
const API_ERROR_CODES = ['rate_limited', 'missing_fields', 'too_long', 'invalid_email', 'server_error'];

export function useContactForm() {
  // Las claves que devuelve el validador se resuelven aquí, así el formulario
  // habla el idioma de la página en vez de responder siempre en español.
  const tv = useTranslations('validation');
  const te = useTranslations('contact.form.errors');

  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<FormTouched>(UNTOUCHED);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Honeypot anti-spam: input oculto que solo rellenan los bots.
  const honeypotRef = useRef<HTMLInputElement>(null);

  // Validación en tiempo real (solo sobre los campos ya tocados)
  useEffect(() => {
    const newErrors: FormErrors = {};

    (Object.keys(formData) as (keyof FormData)[]).forEach((key) => {
      if (touched[key as keyof FormTouched]) {
        const errorKey = validateField(key, formData[key]);
        if (errorKey) {
          newErrors[key as keyof FormErrors] = tv(errorKey);
        }
      }
    });

    setErrors(newErrors);
  }, [formData, touched, tv]);

  // Auto-dismiss mensajes
  useEffect(() => {
    if (submitStatus !== 'idle') {
      const timer = setTimeout(() => {
        setSubmitStatus('idle');
        setErrorMessage('');
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({ name: true, email: true, message: true, consent: true });

    const newErrors = validateAllFields(formData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(
        Object.fromEntries(
          Object.entries(newErrors).map(([field, key]) => [field, tv(key as string)])
        ) as FormErrors
      );
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, website: honeypotRef.current?.value ?? '' }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setFormData(EMPTY_FORM);
        setTouched(UNTOUCHED);
        setErrors({});
      } else {
        setSubmitStatus('error');
        // La API devuelve un código estable; el texto lo pone el idioma actual.
        const code = API_ERROR_CODES.includes(data?.error) ? data.error : 'server_error';
        setErrorMessage(te(code));
      }
    } catch {
      setSubmitStatus('error');
      setErrorMessage(te('network'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const formValid = isFormValid(errors, formData);

  return {
    formData,
    errors,
    touched,
    isSubmitting,
    submitStatus,
    errorMessage,
    formValid,
    honeypotRef,
    handleChange,
    handleBlur,
    handleSubmit,
  };
}
