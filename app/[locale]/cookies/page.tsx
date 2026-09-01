import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import LegalPage from '@/components/legal/LegalPage';
import { alternatesFor } from '@/lib/site';

type Props = { params: Promise<{ locale: string }> };

const UPDATED_AT = '2026-08-11';

const BLOCKS = [
  { title: 'ownTitle', body: 'ownBody' },
  { title: 'thirdTitle', body: 'thirdBody' },
  { title: 'manageTitle', body: 'manageBody' },
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'legal.cookies' });

  return {
    title: t('title'),
    description: t('intro'),
    alternates: alternatesFor(locale, '/cookies'),
  };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <LegalPage section="cookies" blocks={BLOCKS} updatedAt={UPDATED_AT} />;
}
