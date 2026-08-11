import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import LegalPage from '@/components/legal/LegalPage';
import { localeUrl } from '@/lib/site';

type Props = { params: Promise<{ locale: string }> };

const UPDATED_AT = '2026-08-11';

const BLOCKS = [
  { title: 'controllerTitle', body: 'controllerBody' },
  { title: 'dataTitle', body: 'dataBody' },
  { title: 'purposeTitle', body: 'purposeBody' },
  { title: 'legalBasisTitle', body: 'legalBasisBody' },
  { title: 'retentionTitle', body: 'retentionBody' },
  { title: 'processorsTitle', body: 'processorsBody' },
  { title: 'analyticsTitle', body: 'analyticsBody' },
  { title: 'chatTitle', body: 'chatBody' },
  { title: 'rightsTitle', body: 'rightsBody' },
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'legal.privacy' });

  return {
    title: t('title'),
    description: t('intro'),
    alternates: { canonical: localeUrl(locale, '/privacidad') },
  };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <LegalPage section="privacy" blocks={BLOCKS} updatedAt={UPDATED_AT} />;
}
