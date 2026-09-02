import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import LegalPage from '@/components/legal/LegalPage';
import LegalStructuredData from '@/components/legal/StructuredData';
import { SITE_URL, SITE_OWNER, localeUrl, alternatesFor } from '@/lib/site';

type Props = { params: Promise<{ locale: string }> };

const UPDATED_AT = '2026-08-11';

const BLOCKS = [
  { title: 'ownerTitle', body: 'ownerBody' },
  { title: 'purposeTitle', body: 'purposeBody' },
  { title: 'termsTitle', body: 'termsBody' },
  { title: 'ipTitle', body: 'ipBody' },
  { title: 'lawTitle', body: 'lawBody' },
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isSpanish = locale === 'es';
  const t = await getTranslations({ locale, namespace: 'legal.notice' });
  const pageUrl = localeUrl(locale, '/aviso-legal');
  const ogImageAlt = isSpanish
    ? `${SITE_OWNER} — Aviso legal`
    : `${SITE_OWNER} — Legal notice`;

  return {
    metadataBase: new URL(SITE_URL),
    title: t('title'),
    description: t('intro'),
    authors: [{ name: SITE_OWNER, url: SITE_URL }],
    robots: { index: true, follow: true },
    openGraph: {
      type: 'website',
      locale: isSpanish ? 'es_ES' : 'en_US',
      alternateLocale: isSpanish ? ['en_US'] : ['es_ES'],
      url: pageUrl,
      siteName: `${SITE_OWNER} — Portfolio`,
      title: t('title'),
      description: t('intro'),
      images: [
        {
          url: `${SITE_URL}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: ogImageAlt,
          type: 'image/jpeg',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('intro'),
      creator: '@raulbr99',
      images: [{ url: `${SITE_URL}/og-image.jpg`, alt: ogImageAlt }],
    },
    alternates: alternatesFor(locale, '/aviso-legal'),
  };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const legalLocale = locale as 'es' | 'en';

  return (
    <>
      <LegalStructuredData section="notice" locale={legalLocale} />
      <LegalPage section="notice" blocks={BLOCKS} updatedAt={UPDATED_AT} />
    </>
  );
}
