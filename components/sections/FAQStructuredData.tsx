import { getTranslations } from 'next-intl/server';

interface FAQStructuredDataProps {
  locale: 'es' | 'en';
}

export default async function FAQStructuredData({ locale }: FAQStructuredDataProps) {
  const t = await getTranslations({ locale, namespace: 'faq' });
  const items = t.raw('items') as { q: string; a: string }[];

  const baseUrl = 'https://rauldev.dev';

  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${baseUrl}#faq`,
    mainEntity: items.map((item, i) => ({
      '@type': 'Question',
      '@id': `${baseUrl}#faq-${i}`,
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(faqPage).replace(/</g, '\\u003c'),
      }}
    />
  );
}