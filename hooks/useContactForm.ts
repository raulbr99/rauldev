// hooks/useContactForm.ts
'use client';

import { useState, useEffect } from 'react';
import { FormData, FormErrors, validateField, validateAllFields, isFormValid } from '@/utils/formValidation';

interface FormTouched {
  name: boolean;
  email: boolean;
  message: boolean;
}

export function useContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<FormTouched>({
    name: false,
    email: false,
    message: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Validación en tiempo real
  useEffect(() => {
    const newErrors: FormErrors = {};
    
    Object.keys(formData).forEach((key) => {
      if (touched[key as keyof FormTouched]) {
        const error = validateField(key, formData[key as keyof FormData]);
        if (error) {
          newErrors[key as keyof FormErrors] = error;
        }
      }
    });

    setErrors(newErrors);
  }, [formData, touched]);

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
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Marcar todos como touched
    setTouched({ name: true, email: true, message: true });

    // Validar
    const newErrors = validateAllFields(formData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' });
        setTouched({ name: false, email: false, message: false });
        setErrors({});
      } else {
        setSubmitStatus('error');
        setErrorMessage(data.error || 'Error al enviar el mensaje');
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage('Error de conexión. Por favor, inténtalo de nuevo.');
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
    handleChange,
    handleBlur,
    handleSubmit
  };
}