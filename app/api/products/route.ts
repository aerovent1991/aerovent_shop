import { NextRequest, NextResponse } from 'next/server';
import pool from '@/app/lib/db';

export const revalidate = 300;
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '12';
    const type = searchParams.get('type');

    let sql: string;
    let params: any[] = [];

    if (type === 'drone') {
      sql = `
        SELECT 
          id,
          'drone' as type,
          model,
          price,
          production_status as productionStatus,
          size,
          application,
          connection,
          specs_range as specsRange,           -- ДОДАВ СПЕЦИФІКАЦІЇ
          flight_time as flightTime,           -- ДОДАВ
          max_speed as maxSpeed,              -- ДОДАВ
          payload,                            -- ДОДАВ
          camera,                             -- ДОДАВ
          max_altitude as maxAltitude,        -- ДОДАВ
          operational_range as operationalRange, -- ДОДАВ
          battery,                            -- ДОДАВ
          description,
          detailed_info as detailedInfo,      -- ДОДАВ
          main_image as image,
          gallery_images as gallery
        FROM drones 
        WHERE main_image IS NOT NULL 
          AND main_image != '' 
          AND production_status = 'inProduction'
        ORDER BY created_at DESC 
        LIMIT ?
      `;
      params = [parseInt(limit)];
    } 
    else if (type === 'ews') {
      sql = `
        SELECT 
          id,
          'ews' as type,
          model,
          price,
          production_status as productionStatus,
          description,
          detailed_info as detailedInfo,      -- ДОДАВ
          main_image as image,
          gallery_images as gallery
        FROM ews 
        WHERE main_image IS NOT NULL 
          AND main_image != '' 
          AND production_status = 'inProduction'
        ORDER BY created_at DESC 
        LIMIT ?
      `;
      params = [parseInt(limit)];
    } 
    else {
      sql = `
        SELECT 
          id,
          'drone' as type,
          model,
          price,
          production_status as productionStatus,
          size,
          application,
          connection,
          specs_range as specsRange,           -- ДОДАВ
          flight_time as flightTime,           -- ДОДАВ
          max_speed as maxSpeed,              -- ДОДАВ
          payload,                            -- ДОДАВ
          camera,                             -- ДОДАВ
          max_altitude as maxAltitude,        -- ДОДАВ
          operational_range as operationalRange, -- ДОДАВ
          battery,                            -- ДОДАВ
          description,
          detailed_info as detailedInfo,      -- ДОДАВ
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
          NULL as specsRange,                 -- ДОДАВ NULL для сумісності
          NULL as flightTime,
          NULL as maxSpeed,
          NULL as payload,
          NULL as camera,
          NULL as maxAltitude,
          NULL as operationalRange,
          NULL as battery,
          description,
          detailed_info as detailedInfo,      -- ДОДАВ
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
        LIMIT ?
      `;
      params = [parseInt(limit)];
    }

    const [products] = await pool.query(sql, params);

    const transformed = (products as any[]).map(product => ({
      ...product,
      price: parseFloat(product.price),
      gallery: product.gallery ? JSON.parse(product.gallery) : [],
      url: `/${
        product.type === 'drone'
          ? 'uav'
          : product.type === 'detector'
          ? 'drone_detectors'
          : 'electronic_warfare_systems'
      }/${product.id}`
    }));

    return NextResponse.json(
      {
        success: true,
        data: transformed
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
        }
      }
    );
  } catch (error) {
    console.error('API Error /products:', error);
    return NextResponse.json(
      { success: false, error: 'Помилка сервера' },
      { status: 500 }
    );
  }
}
