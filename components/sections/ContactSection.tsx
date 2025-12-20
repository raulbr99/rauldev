'use client';

import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Button from '../ui/Button';
import FormInput from '../ui/FormInput';
import ContactInfo from './ContactInfo';
import { useContactForm } from '@/hooks/useContactForm';

export default function ContactSection() {
  const t = useTranslations('contact');
  const {
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
  } = useContactForm();

  return (
    <section id="contacto" className="py-20 px-4 bg-black/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">{t('title')}</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>

          <div className="sr-only">
            {t('seo')}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <ContactInfo />

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <FormInput
              id="name"
              name="name"
              label={t('form.name')}
              type="text"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.name}
              touched={touched.name}
              placeholder={t('form.namePlaceholder')}
              maxLength={50}
            />

            <FormInput
              id="email"
              name="email"
              label={t('form.email')}
              type="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.email}
              touched={touched.email}
              placeholder={t('form.emailPlaceholder')}
              maxLength={100}
            />

            <FormInput
              id="message"
              name="message"
              label={t('form.message')}
              type="textarea"
              value={formData.message}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.message}
              touched={touched.message}
              placeholder={t('form.messagePlaceholder')}
              rows={5}
              maxLength={1000}
              showCharCount
            />

            {submitStatus === 'success' && (
              <div className="flex items-center gap-2 p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 animate-fade-in">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <span>{t('form.success')}</span>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="flex items-center gap-2 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 animate-fade-in">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting || !formValid}
              className={`w-full py-3 px-6 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${isSubmitting || !formValid ? 'opacity-70 cursor-not-allowed' : ''
                }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  {t('form.submitting')}
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  {t('form.submit')}
                </>
              )}
            </Button>

            {!formValid && (touched.name || touched.email || touched.message) && (
              <p className="text-sm text-gray-400 text-center">
                {t('form.fillAllFields')}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
