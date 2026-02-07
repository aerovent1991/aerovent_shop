import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getUavByIdCached } from '@/app/lib/data';
import { UavDetailClient } from './UavDetailClient';

export const revalidate = 300;
export const dynamic = 'force-dynamic';

type Params = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const resolvedParams = await params;
  const data = await getUavByIdCached(resolvedParams.id);
  if (!data) {
    return {
      title: 'Дрон не знайдено',
      description: 'Сторінку не знайдено.',
    };
  }

  const title = data.drone.name;
  const description =
    data.drone.description ||
    'Детальні характеристики та опис БПЛА від АЕРО ВЕНТ.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: data.drone.image ? [{ url: data.drone.image }] : undefined,
    },
  };
}

export default async function UAVDetailPage({ params }: Params) {
  const resolvedParams = await params;
  if (!resolvedParams?.id) {
    notFound();
  }

  const data = await getUavByIdCached(resolvedParams.id);

  if (!data) {
    notFound();
  }

  return (
    <UavDetailClient
      drone={data.drone}
      relatedDrones={data.related}
      optionGroups={data.optionGroups}
    />
  );
}
