import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { notFoundMetadata } from '@/lib/not-found-metadata';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return notFoundMetadata(locale);
}

/**
 * Cualquier ruta que no existe dentro de un idioma (`/no-existe`,
 * `/en/no-existe`, `/en/en`…) acaba aquí, para que se pinte la 404 del sitio
 * (`[locale]/not-found.tsx`) en su idioma y no la genérica de Next.
 */
export default async function CatchAll({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  notFound();
}
