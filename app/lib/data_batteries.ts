import { unstable_cache } from 'next/cache';
import { query } from '@/app/lib/db';

type Battery = {
  id: string;
  model: string;
  price: number;
  manufacturer: string;
  batteryType: string;
  configuration: string;
  fullConfiguration: string;
  capacity: number;
  description: string;
  detailedInfo?: string;
  image?: string;
  gallery?: string[];
};

async function fetchBatteryById(id: string): Promise<{ battery: Battery; similar: Battery[] } | null> {
  if (!id || typeof id !== 'string') return null;

  const sql = `
    SELECT 
      id,
      model,
      price,
      manufacturer,
      battery_type as batteryType,
      configuration,
      full_configuration as fullConfiguration,
      capacity,
      description,
      detailed_info as detailedInfo,
      main_image as image,
      gallery_images as gallery
    FROM batteries
    WHERE id = ?
    LIMIT 1
  `;

  const result = await query(sql, [id]);
  if (!Array.isArray(result) || result.length === 0) return null;

  const raw = result[0] as any;
  const gallery = raw.gallery ? JSON.parse(raw.gallery) : [];
  const battery: Battery = {
    id: raw.id,
    model: raw.model,
    price: Number(raw.price),
    manufacturer: raw.manufacturer,
    batteryType: raw.batteryType,
    configuration: raw.configuration,
    fullConfiguration: raw.fullConfiguration,
    capacity: Number(raw.capacity),
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
      manufacturer,
      battery_type as batteryType,
      configuration,
      description,
      main_image as image
    FROM batteries
    WHERE id != ?
    ORDER BY created_at DESC
    LIMIT 4
  `;
  const similarResult = await query(similarSql, [id]);
  const similar: Battery[] = Array.isArray(similarResult)
    ? (similarResult as any[]).map((item) => ({
        id: item.id,
        model: item.model,
        price: Number(item.price),
        manufacturer: item.manufacturer,
        batteryType: item.batteryType,
        configuration: item.configuration,
        fullConfiguration: '',
        capacity: 0,
        description: item.description,
        image: item.image
      }))
    : [];

  return { battery, similar };
}

export const getBatteryByIdCached = (id: string) =>
  unstable_cache(
    async () => fetchBatteryById(id),
    ['battery-by-id', id],
    { revalidate: 300, tags: ['batteries', `battery:${id}`] }
  )();
