import { unstable_cache } from 'next/cache';
import { query } from '@/app/lib/db';

type Detector = {
  id: string;
  model: string;
  price: number;
  description: string;
  detailedInfo?: string;
  image?: string;
  gallery?: string[];
};

async function fetchDetectorById(id: string): Promise<{ detector: Detector; similar: Detector[] } | null> {
  if (!id || typeof id !== 'string') return null;

  const sql = `
    SELECT 
      id,
      model,
      price,
      description,
      detailed_info as detailedInfo,
      main_image as image,
      gallery_images as gallery
    FROM drone_detectors
    WHERE id = ?
    LIMIT 1
  `;

  const result = await query(sql, [id]);
  if (!Array.isArray(result) || result.length === 0) return null;

  const raw = result[0] as any;
  const gallery = raw.gallery ? JSON.parse(raw.gallery) : [];
  const detector: Detector = {
    id: raw.id,
    model: raw.model,
    price: Number(raw.price),
    description: raw.description,
    detailedInfo: raw.detailedInfo,
    image: raw.image,
    gallery
  };

  const similarSql = `
    SELECT 
      id,
      model,
      price,
      description,
      main_image as image
    FROM drone_detectors
    WHERE id != ?
    ORDER BY created_at DESC
    LIMIT 4
  `;
  const similarResult = await query(similarSql, [id]);
  const similar: Detector[] = Array.isArray(similarResult)
    ? (similarResult as any[]).map((item) => ({
        id: item.id,
        model: item.model,
        price: Number(item.price),
        description: item.description,
        image: item.image
      }))
    : [];

  return { detector, similar };
}

export const getDroneDetectorByIdCached = (id: string) =>
  unstable_cache(
    async () => fetchDetectorById(id),
    ['detector-by-id', id],
    { revalidate: 300, tags: ['detectors', `detector:${id}`] }
  )();
