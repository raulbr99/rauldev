import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import LegalPage from '@/components/legal/LegalPage';
import LegalStructuredData from '@/components/legal/StructuredData';
import { SITE_URL, SITE_OWNER, localeUrl, alternatesFor } from '@/lib/site';

type Props = { params: Promise<{ locale: string }> };

const UPDATED_AT = '2026-09-03';

const BLOCKS = [
  { title: 'ownTitle', body: 'ownBody' },
  { title: 'thirdTitle', body: 'thirdBody' },
  { title: 'manageTitle', body: 'manageBody' },
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isSpanish = locale === 'es';
  const t = await getTranslations({ locale, namespace: 'legal.cookies' });
  const pageUrl = localeUrl(locale, '/cookies');
  const ogImageAlt = isSpanish
    ? `${SITE_OWNER} — Política de cookies`
    : `${SITE_OWNER} — Cookie policy`;

  return {
    metadataBase: new URL(SITE_URL),
    title: t('title'),
    description: t('metaDescription'),
    authors: [{ name: SITE_OWNER, url: SITE_URL }],
    robots: { index: true, follow: true },
    openGraph: {
      type: 'website',
      locale: isSpanish ? 'es_ES' : 'en_US',
      alternateLocale: isSpanish ? ['en_US'] : ['es_ES'],
      url: pageUrl,
      siteName: `${SITE_OWNER} — Portfolio`,
      title: t('title'),
      description: t('metaDescription'),
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
      description: t('metaDescription'),
      creator: '@raulbr99',
      images: [{ url: `${SITE_URL}/og-image.jpg`, alt: ogImageAlt }],
    },
    alternates: alternatesFor(locale, '/cookies'),
  };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const legalLocale = locale as 'es' | 'en';

  return (
    <>
      <LegalStructuredData section="cookies" locale={legalLocale} />
      <LegalPage section="cookies" blocks={BLOCKS} updatedAt={UPDATED_AT} />
    </>
  );
}
