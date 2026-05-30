'use client';

import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import FormInput from '../ui/FormInput';
import ContactInfo from './ContactInfo';
import SectionHeading from '../ui/SectionHeading';
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
    honeypotRef,
    handleChange,
    handleBlur,
    handleSubmit
  } = useContactForm();

  return (
    <section id="contacto" className="py-20 px-4 bg-black/20">
      <div className="max-w-7xl mx-auto">
        <SectionHeading number="05" label="CONTACT" title={t('title')} subtitle={t('subtitle')} />
        <div className="sr-only">{t('seo')}</div>

        <div className="grid md:grid-cols-2 gap-12">
          <ContactInfo />

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* Honeypot anti-spam: oculto para humanos, tentador para bots */}
            <input
              ref={honeypotRef}
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute left-[-9999px] top-[-9999px] h-0 w-0 opacity-0"
            />
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
              <div className="flex items-center gap-2 p-4 bg-green-500/20 border border-green-500/30 text-green-300 animate-fade-in">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <span>{t('form.success')}</span>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="flex items-center gap-2 p-4 bg-red-500/20 border border-red-500/30 text-red-300 animate-fade-in">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !formValid}
              className={`flex w-full items-center justify-center gap-2 bg-cyan-400 px-6 py-4 font-mono text-sm font-medium uppercase tracking-wider text-slate-950 transition-colors hover:bg-cyan-300 ${isSubmitting || !formValid ? 'cursor-not-allowed opacity-50' : ''
                }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></div>
                  {t('form.submitting')}
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  {t('form.submit')}
                </>
              )}
            </button>

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
