import { unstable_cache } from 'next/cache';
import { query } from './db';
import {
  transformDroneData,
  transformDronesArray,
  type DroneFromDB,
  type TransformedDrone,
} from './drone-utils';
import type { EWS } from '@/app/data/interface';

export type RelatedDrone = {
  id: string;
  model: string;
  price: number;
  size: number;
  application: string;
  connection: string;
  specsRange?: string;
  flightTime?: string;
  payload?: string;
  image?: string;
};

async function fetchHeroProducts(limit: number = 8): Promise<TransformedDrone[]> {
  const safeLimit = Number.isFinite(limit) ? Math.max(1, Math.floor(limit)) : 8;
  const sql = `
    SELECT 
      id,
      'drone' as type,
      model,
      price,
      production_status as productionStatus,
      size,
      application,
      connection,
      specs_range as specsRange,
      flight_time as flightTime,
      max_speed as maxSpeed,
      payload,
      camera,
      max_altitude as maxAltitude,
      operational_range as operationalRange,
      battery,
      description,
      detailed_info as detailedInfo,
      main_image as image,
      gallery_images as gallery,
      created_at
    FROM drones 
    WHERE main_image IS NOT NULL 
      AND main_image != '' 
      AND production_status = 'inProduction'
    
    UNION ALL
    
    SELECT 
      id,
      'ews' as type,
      model,
      price,
      production_status as productionStatus,
      NULL as size,
      NULL as application,
      NULL as connection,
      NULL as specsRange,
      NULL as flightTime,
      NULL as maxSpeed,
      NULL as payload,
      NULL as camera,
      NULL as maxAltitude,
      NULL as operationalRange,
      NULL as battery,
      description,
      detailed_info as detailedInfo,
      main_image as image,
      gallery_images as gallery,
      created_at
    FROM ews 
    WHERE main_image IS NOT NULL 
      AND main_image != '' 
      AND production_status = 'inProduction'
    
    UNION ALL
    
    SELECT 
      id,
      'detector' as type,
      model,
      price,
      production_status as productionStatus,
      NULL as size,
      'detector' as application,
      NULL as connection,
      NULL as specsRange,
      NULL as flightTime,
      NULL as maxSpeed,
      NULL as payload,
      NULL as camera,
      NULL as maxAltitude,
      NULL as operationalRange,
      NULL as battery,
      description,
      detailed_info as detailedInfo,
      main_image as image,
      gallery_images as gallery,
      created_at
    FROM drone_detectors 
    WHERE main_image IS NOT NULL 
      AND main_image != '' 
      AND production_status = 'inProduction'
    
    ORDER BY created_at DESC 
    LIMIT ${safeLimit}
  `;

  const products = await query(sql);
  const normalized = (products as any[]).map((product) => ({
    ...product,
    price: parseFloat(product.price),
    gallery: product.gallery ? JSON.parse(product.gallery) : [],
    url: `/${
      product.type === 'drone'
        ? 'uav'
        : product.type === 'detector'
        ? 'drone_detectors'
        : 'electronic_warfare_systems'
    }/${product.id}`,
  })) as DroneFromDB[];

  return transformDronesArray(normalized);
}

export const getHeroProductsCached = unstable_cache(
  async () => fetchHeroProducts(12),
  ['hero-products'],
  { revalidate: 300, tags: ['products'] }
);

async function fetchUavById(id: string): Promise<{ drone: TransformedDrone; related: RelatedDrone[] } | null> {
  if (!id || typeof id !== 'string') {
    return null;
  }

  const sql = `
    SELECT 
      id,
      model,
      price,
      production_status AS productionStatus,
      size,
      application,
      connection,
      specs_range AS specsRange,
      flight_time AS flightTime,
      max_speed AS maxSpeed,
      payload,
      camera,
      max_altitude AS maxAltitude,
      operational_range AS operationalRange,
      battery,
      description,
      detailed_info AS detailedInfo,
      main_image AS image,
      gallery_images AS gallery,
      created_at AS createdAt
    FROM drones
    WHERE id = ?
    LIMIT 1
  `;

  const result = await query(sql, [id]);
  if (!Array.isArray(result) || result.length === 0) return null;

  const raw = result[0] as any;
  let gallery: string[] = [];
  if (Array.isArray(raw.gallery)) {
    gallery = raw.gallery;
  } else if (typeof raw.gallery === 'string' && raw.gallery.trim() !== '') {
    try {
      gallery = JSON.parse(raw.gallery);
    } catch {
      gallery = [];
    }
  }

  const drone = transformDroneData({
    ...raw,
    price: Number(raw.price),
    gallery,
  });

  let related: RelatedDrone[] = [];
  if (raw.application) {
    const similarSql = `
      SELECT 
        id,
        model,
        price,
        size,
        application,
        connection,
        specs_range AS specsRange,
        flight_time AS flightTime,
        payload,
        main_image AS image
      FROM drones
      WHERE application = ?
        AND id != ?
        AND production_status = 'inProduction'
      ORDER BY created_at DESC
      LIMIT 4
    `;

    const similarResult = await query(similarSql, [raw.application, id]);
    related = Array.isArray(similarResult)
      ? (similarResult as any[]).map((item) => ({
          ...item,
          price: Number(item.price),
          size: Number(item.size) || 0,
          application: item.application || '',
          connection: item.connection || '',
        }))
      : [];
  }

  return { drone, related };
}

export const getUavByIdCached = (id: string) =>
  unstable_cache(
    async () => fetchUavById(id),
    ['uav-by-id', id],
    { revalidate: 300, tags: ['uav', `uav:${id}`] }
  )();

async function fetchEwsById(id: string): Promise<{ ews: EWS; similar: EWS[] } | null> {
  if (!id || typeof id !== 'string') {
    return null;
  }

  const sql = `
    SELECT 
      id,
      model,
      price,
      production_status as productionStatus,
      description,
      detailed_info as detailedInfo,
      main_image as image,
      gallery_images as gallery,
      created_at as createdAt
    FROM ews 
    WHERE id = ?
    LIMIT 1
  `;

  const result = await query(sql, [id]);
  if (!Array.isArray(result) || result.length === 0) return null;

  const raw = result[0] as any;
  let gallery: string[] = [];
  if (Array.isArray(raw.gallery)) {
    gallery = raw.gallery;
  } else if (typeof raw.gallery === 'string' && raw.gallery.trim() !== '') {
    try {
      gallery = JSON.parse(raw.gallery);
    } catch {
      gallery = [];
    }
  }

  const ews: EWS = {
    id: raw.id,
    model: raw.model,
    price: Number(raw.price),
    productionStatus: raw.productionStatus,
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
      production_status as productionStatus,
      description,
      detailed_info as detailedInfo,
      main_image as image,
      gallery_images as gallery
    FROM ews 
    WHERE id != ? 
      AND production_status = 'inProduction'
    ORDER BY RAND()
    LIMIT 4
  `;

  const similarResult = await query(similarSql, [id]);
  const similar: EWS[] = Array.isArray(similarResult)
    ? (similarResult as any[]).map((item) => ({
        id: item.id,
        model: item.model,
        price: Number(item.price),
        productionStatus: item.productionStatus,
        description: item.description,
        detailedInfo: item.detailedInfo,
        image: item.image,
        gallery: item.gallery ? JSON.parse(item.gallery) : []
      }))
    : [];

  return { ews, similar };
}

export const getEwsByIdCached = (id: string) =>
  unstable_cache(
    async () => fetchEwsById(id),
    ['ews-by-id', id],
    { revalidate: 300, tags: ['ews', `ews:${id}`] }
  )();
