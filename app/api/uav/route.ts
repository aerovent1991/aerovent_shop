
import pool from '@/app/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export const revalidate = 300;
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Пагінація
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const offset = (page - 1) * limit;
    
    // Фільтри
    const application = searchParams.get('application');
    const connection = searchParams.get('connection');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const minSize = searchParams.get('minSize');
    const maxSize = searchParams.get('maxSize');
    const productionStatus = searchParams.get('productionStatus');
    const search = searchParams.get('search');
    
    // Побудова WHERE
    const conditions: string[] = [];
    const params: any[] = [];

    const priceExpr = `
      price
      + COALESCE((SELECT price FROM rx_options WHERE id = rx_default_id), 0)
      + COALESCE((SELECT price FROM vtx_options WHERE id = vtx_default_id), 0)
      + COALESCE((SELECT price FROM camera_options WHERE id = camera_default_id), 0)
      + COALESCE((SELECT price FROM battery_options WHERE id = battery_default_id), 0)
      + COALESCE((SELECT price FROM fiber_spool_options WHERE id = fiber_spool_default_id), 0)
    `;
    
    if (application) {
      conditions.push('application = ?');
      params.push(application);
    }
    
    if (connection) {
      conditions.push('connection = ?');
      params.push(connection);
    }
    
    if (minPrice) {
      conditions.push(`(${priceExpr}) >= ?`);
      params.push(parseFloat(minPrice));
    }
    
    if (maxPrice) {
      conditions.push(`(${priceExpr}) <= ?`);
      params.push(parseFloat(maxPrice));
    }
    
    if (minSize) {
      conditions.push('size >= ?');
      params.push(parseInt(minSize));
    }
    
    if (maxSize) {
      conditions.push('size <= ?');
      params.push(parseInt(maxSize));
    }
    
    if (productionStatus) {
      conditions.push('production_status = ?');
      params.push(productionStatus);
    }
    
    if (search) {
      conditions.push('(model LIKE ? OR description LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }
    
    const whereClause = conditions.length 
      ? `WHERE ${conditions.join(' AND ')}` 
      : '';
    
    // Загальна кількість
    const countSql = `SELECT COUNT(*) as total FROM drones ${whereClause}`;
    const [countResult] = await pool.query(countSql, params);
    const total = (countResult as any[])[0]?.total || 0;
    
    // Дані з пагінацією
    const dataSql = `
      SELECT 
        id,
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
        created_at as createdAt
      FROM drones 
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    const dataParams = [...params, limit, offset];
    const [drones] = await pool.query(dataSql, dataParams);
    
    // Отримуємо доступні значення для фільтрів
    const filtersSql = `
      SELECT 
        GROUP_CONCAT(DISTINCT application) as applications,
        GROUP_CONCAT(DISTINCT connection) as connections,
        MIN(${priceExpr}) as minPrice,
        MAX(${priceExpr}) as maxPrice,
        MIN(size) as minSize,
        MAX(size) as maxSize
      FROM drones
    `;
    const [filtersResult] = await pool.query(filtersSql);
    const filters = (filtersResult as any[])[0];
    
    // Трансформація
    const transformed = (drones as any[]).map(drone => ({
      ...drone,
      price: parseFloat(drone.price),
      gallery: drone.gallery ? JSON.parse(drone.gallery) : []
    }));
    
    return NextResponse.json(
      {
        success: true,
        data: transformed,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        },
        filters: {
          applications: filters.applications ? filters.applications.split(',') : [],
          connections: filters.connections ? filters.connections.split(',') : [],
          priceRange: {
            min: parseFloat(filters.minPrice) || 0,
            max: parseFloat(filters.maxPrice) || 100000
          },
          sizeRange: {
            min: parseInt(filters.minSize) || 0,
            max: parseInt(filters.maxSize) || 1000
          },
          productionStatuses: ['inProduction', 'discontinued', 'madeToOrder']
        }
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
        }
      }
    );
  } catch (error) {
    console.error('API Error /drones:', error);
    return NextResponse.json(
      { success: false, error: 'Помилка сервера' },
      { status: 500 }
    );
  }
}
