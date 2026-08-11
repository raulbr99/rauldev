import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import LegalPage from '@/components/legal/LegalPage';
import { localeUrl } from '@/lib/site';

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
  const t = await getTranslations({ locale, namespace: 'legal.notice' });

  return {
    title: t('title'),
    description: t('intro'),
    alternates: { canonical: localeUrl(locale, '/aviso-legal') },
  };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <LegalPage section="notice" blocks={BLOCKS} updatedAt={UPDATED_AT} />;
}
