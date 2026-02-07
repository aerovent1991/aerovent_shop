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

export type DroneOptionItem = {
  id: number;
  label: string;
  price: number;
  priceDelta: number;
  isDefault: boolean;
  details?: string | null;
};

export type DroneOptionGroup = {
  code: string;
  label: string;
  required: boolean;
  options: DroneOptionItem[];
};

async function fetchHeroProducts(limit: number = 8): Promise<TransformedDrone[]> {
  const safeLimit = Number.isFinite(limit) ? Math.max(1, Math.floor(limit)) : 8;
  const priceExpr = `
      price
      + COALESCE((SELECT price FROM rx_options WHERE id = rx_default_id), 0)
      + COALESCE((SELECT price FROM vtx_options WHERE id = vtx_default_id), 0)
      + COALESCE((SELECT price FROM camera_options WHERE id = camera_default_id), 0)
      + COALESCE((SELECT price FROM battery_options WHERE id = battery_default_id), 0)
      + COALESCE((SELECT price FROM fiber_spool_options WHERE id = fiber_spool_default_id), 0)
    `;
  const sql = `
    SELECT 
      id,
      'drone' as type,
      model,
      (${priceExpr}) as price,
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

function parseIdArray(value: any): number[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((v) => Number(v)).filter((v) => Number.isFinite(v));
  }
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.map((v) => Number(v)).filter((v) => Number.isFinite(v));
      }
    } catch {
      // fall through to CSV parsing
    }
    return value
      .split(',')
      .map((v) => Number(v.trim()))
      .filter((v) => Number.isFinite(v));
  }
  return [];
}

async function fetchOptionsByIds(
  table: string,
  ids: number[]
): Promise<Array<{ id: number; label: string; price: number; details?: string | null }>> {
  if (!ids.length) return [];
  const placeholders = ids.map(() => '?').join(',');
  const sql = `
    SELECT id, label, price, NULL as details
    FROM ${table}
    WHERE id IN (${placeholders})
    ORDER BY FIELD(id, ${placeholders})
  `;
  const rows = await query(sql, [...ids, ...ids]);
  if (!Array.isArray(rows)) return [];
  return (rows as any[]).map((row) => ({
    id: Number(row.id),
    label: row.label,
    price: Number(row.price) || 0,
    details: row.details ?? null,
  }));
}

async function fetchOptionGroupsForDrone(raw: any): Promise<DroneOptionGroup[]> {
  const groups: DroneOptionGroup[] = [];

  const rxIds = parseIdArray(raw.rx_option_ids);
  const vtxIds = parseIdArray(raw.vtx_option_ids);
  const cameraIds = parseIdArray(raw.camera_option_ids);
  const batteryIds = parseIdArray(raw.battery_option_ids);
  const fiberIds = parseIdArray(raw.fiber_spool_option_ids);

  const [
    rxOptions,
    vtxOptions,
    cameraOptions,
    batteryOptions,
    fiberOptions,
  ] = await Promise.all([
    fetchOptionsByIds('rx_options', rxIds),
    fetchOptionsByIds('vtx_options', vtxIds),
    fetchOptionsByIds('camera_options', cameraIds),
    fetchOptionsByIds('battery_options', batteryIds),
    fetchOptionsByIds('fiber_spool_options', fiberIds),
  ]);

  const rxDefault = Number(raw.rx_default_id);
  const vtxDefault = Number(raw.vtx_default_id);
  const cameraDefault = Number(raw.camera_default_id);
  const batteryDefault = Number(raw.battery_default_id);
  const fiberDefault = Number(raw.fiber_spool_default_id);

  if (rxOptions.length) {
    const base = rxOptions.find((o) => o.id === rxDefault)?.price ?? 0;
    groups.push({
      code: 'rx',
      label: 'Модуль RX*',
      required: true,
      options: rxOptions.map((opt) => ({
        id: opt.id,
        label: opt.label,
        price: opt.price,
        priceDelta: opt.price - base,
        isDefault: opt.id === rxDefault,
      })),
    });
  }

  if (vtxOptions.length) {
    const base = vtxOptions.find((o) => o.id === vtxDefault)?.price ?? 0;
    groups.push({
      code: 'vtx',
      label: 'Модуль VTX*',
      required: true,
      options: vtxOptions.map((opt) => ({
        id: opt.id,
        label: opt.label,
        price: opt.price,
        priceDelta: opt.price - base,
        isDefault: opt.id === vtxDefault,
      })),
    });
  }

  if (cameraOptions.length) {
    const base = cameraOptions.find((o) => o.id === cameraDefault)?.price ?? 0;
    groups.push({
      code: 'camera',
      label: 'Камера*',
      required: true,
      options: cameraOptions.map((opt) => ({
        id: opt.id,
        label: opt.label,
        price: opt.price,
        priceDelta: opt.price - base,
        isDefault: opt.id === cameraDefault,
      })),
    });
  }

  if (batteryOptions.length) {
    const base = batteryOptions.find((o) => o.id === batteryDefault)?.price ?? 0;
    groups.push({
      code: 'battery',
      label: 'Батарея',
      required: false,
      options: batteryOptions.map((opt) => ({
        id: opt.id,
        label: opt.label,
        price: opt.price,
        priceDelta: opt.price - base,
        isDefault: opt.id === batteryDefault,
      })),
    });
  }

  if (fiberOptions.length) {
    const base = fiberOptions.find((o) => o.id === fiberDefault)?.price ?? 0;
    groups.push({
      code: 'fiber_spool',
      label: 'Оптоволоконна котушка',
      required: true,
      options: fiberOptions.map((opt) => ({
        id: opt.id,
        label: opt.label,
        price: opt.price,
        priceDelta: opt.price - base,
        isDefault: opt.id === fiberDefault,
      })),
    });
  }

  return groups;
}

async function fetchUavById(
  id: string
): Promise<{ drone: TransformedDrone; related: RelatedDrone[]; optionGroups: DroneOptionGroup[] } | null> {
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
      created_at AS createdAt,
      rx_option_ids,
      rx_default_id,
      vtx_option_ids,
      vtx_default_id,
      camera_option_ids,
      camera_default_id,
      battery_option_ids,
      battery_default_id,
      fiber_spool_option_ids,
      fiber_spool_default_id
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

  const optionGroups = await fetchOptionGroupsForDrone(raw);
  return { drone, related, optionGroups };
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
