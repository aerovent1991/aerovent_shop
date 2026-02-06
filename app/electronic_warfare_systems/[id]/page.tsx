import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getEwsByIdCached } from '@/app/lib/data';
import { EwsDetailClient } from './EwsDetailClient';

export const revalidate = 300;
export const dynamic = 'force-dynamic';

type Params = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const resolvedParams = await params;
  const data = await getEwsByIdCached(resolvedParams.id);
  if (!data) {
    return {
      title: 'Система не знайдена',
      description: 'Сторінку не знайдено.',
    };
  }

  const title = data.ews.model;
  const description =
    data.ews.description ||
    'Детальні характеристики та опис РЕБ системи від АЕРО ВЕНТ.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: data.ews.image ? [{ url: data.ews.image }] : undefined,
    },
  };
}

export default async function EwsDetailPage({ params }: Params) {
  const resolvedParams = await params;
  if (!resolvedParams?.id) {
    notFound();
  }

  const data = await getEwsByIdCached(resolvedParams.id);
  if (!data) {
    notFound();
  }

  return <EwsDetailClient ews={data.ews} similar={data.similar} />;
}
