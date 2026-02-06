import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getDroneDetectorByIdCached } from '@/app/lib/data_detectors';
import { DroneDetectorDetailClient } from './pageClient';

export const revalidate = 300;
export const dynamic = 'force-dynamic';

type Params = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const resolvedParams = await params;
  const data = await getDroneDetectorByIdCached(resolvedParams.id);
  if (!data) {
    return {
      title: 'Детектор не знайдено',
      description: 'Сторінку не знайдено.',
    };
  }

  const title = data.detector.model;
  const description =
    data.detector.description ||
    'Детектор дронів для захисту та моніторингу.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: data.detector.image ? [{ url: data.detector.image }] : undefined,
    },
  };
}

export default async function DroneDetectorDetailPage({ params }: Params) {
  const resolvedParams = await params;
  if (!resolvedParams?.id) {
    notFound();
  }

  const data = await getDroneDetectorByIdCached(resolvedParams.id);
  if (!data) {
    notFound();
  }

  return <DroneDetectorDetailClient detector={data.detector} similar={data.similar} />;
}
