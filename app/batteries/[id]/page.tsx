import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getBatteryByIdCached } from '@/app/lib/data_batteries';
import { BatteryDetailClient } from './pageClient';

export const revalidate = 300;
export const dynamic = 'force-dynamic';

type Params = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const resolvedParams = await params;
  const data = await getBatteryByIdCached(resolvedParams.id);
  if (!data) {
    return { title: 'Батарею не знайдено', description: 'Сторінку не знайдено.' };
  }

  const title = data.battery.model;
  const description =
    data.battery.description || 'Акумулятори для БПЛА та систем звʼязку.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: data.battery.image ? [{ url: data.battery.image }] : undefined,
    },
  };
}

export default async function BatteryDetailPage({ params }: Params) {
  const resolvedParams = await params;
  if (!resolvedParams?.id) notFound();

  const data = await getBatteryByIdCached(resolvedParams.id);
  if (!data) notFound();

  return <BatteryDetailClient battery={data.battery} similar={data.similar} />;
}
