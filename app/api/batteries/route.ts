import { NextRequest, NextResponse } from 'next/server';
import pool from '@/app/lib/db';

export const revalidate = 300;
export const dynamic = 'force-dynamic';

const buildInClause = (values: string[]) => {
  const placeholders = values.map(() => '?').join(',');
  return { clause: `IN (${placeholders})`, values };
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const offset = (page - 1) * limit;

    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const manufacturer = searchParams.get('manufacturer');
    const batteryType = searchParams.get('batteryType');
    const configuration = searchParams.get('configuration');

    const conditions: string[] = [];
    const params: any[] = [];

    if (search) {
      conditions.push('(model LIKE ? OR description LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    if (minPrice) {
      conditions.push('price >= ?');
      params.push(parseFloat(minPrice));
    }
    if (maxPrice) {
      conditions.push('price <= ?');
      params.push(parseFloat(maxPrice));
    }

    if (manufacturer) {
      const list = manufacturer.split(',').map((s) => s.trim()).filter(Boolean);
      if (list.length > 0) {
        const { clause, values } = buildInClause(list);
        conditions.push(`manufacturer ${clause}`);
        params.push(...values);
      }
    }

    if (batteryType) {
      const list = batteryType.split(',').map((s) => s.trim()).filter(Boolean);
      if (list.length > 0) {
        const { clause, values } = buildInClause(list);
        conditions.push(`battery_type ${clause}`);
        params.push(...values);
      }
    }

    if (configuration) {
      const list = configuration.split(',').map((s) => s.trim()).filter(Boolean);
      if (list.length > 0) {
        const { clause, values } = buildInClause(list);
        conditions.push(`configuration ${clause}`);
        params.push(...values);
      }
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const countSql = `SELECT COUNT(*) as total FROM batteries ${whereClause}`;
    const [countResult] = await pool.query(countSql, params);
    const total = (countResult as any[])[0]?.total || 0;

    const dataSql = `
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
        gallery_images as gallery,
        created_at as createdAt
      FROM batteries
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;
    const dataParams = [...params, limit, offset];
    const [items] = await pool.query(dataSql, dataParams);

    const filtersSql = `
      SELECT 
        GROUP_CONCAT(DISTINCT manufacturer) as manufacturers,
        GROUP_CONCAT(DISTINCT battery_type) as batteryTypes,
        GROUP_CONCAT(DISTINCT configuration) as configurations,
        MIN(price) as minPrice,
        MAX(price) as maxPrice
      FROM batteries
    `;
    const [filtersResult] = await pool.query(filtersSql);
    const filters = (filtersResult as any[])[0];

    const transformed = (items as any[]).map((item) => ({
      ...item,
      price: parseFloat(item.price),
      gallery: item.gallery ? JSON.parse(item.gallery) : []
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
          manufacturers: filters.manufacturers ? filters.manufacturers.split(',') : [],
          batteryTypes: filters.batteryTypes ? filters.batteryTypes.split(',') : [],
          configurations: filters.configurations ? filters.configurations.split(',') : [],
          priceRange: {
            min: parseFloat(filters.minPrice) || 0,
            max: parseFloat(filters.maxPrice) || 100000
          }
        }
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
        }
      }
    );
  } catch (error) {
    console.error('API Error /batteries:', error);
    return NextResponse.json(
      { success: false, error: 'Помилка сервера' },
      { status: 500 }
    );
  }
}
