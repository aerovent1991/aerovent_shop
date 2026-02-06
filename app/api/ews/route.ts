import { NextRequest, NextResponse } from 'next/server';
import pool from '@/app/lib/db';

export const revalidate = 300;
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const offset = (page - 1) * limit;
    
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const productionStatus = searchParams.get('productionStatus');
    const search = searchParams.get('search');
    
    const conditions: string[] = [];
    const params: any[] = [];
    
    if (minPrice) {
      conditions.push('price >= ?');
      params.push(parseFloat(minPrice));
    }
    
    if (maxPrice) {
      conditions.push('price <= ?');
      params.push(parseFloat(maxPrice));
    }
    
    if (productionStatus) {
      const statuses = productionStatus.split(',').map((s) => s.trim()).filter(Boolean);
      if (statuses.length === 1) {
        conditions.push('production_status = ?');
        params.push(statuses[0]);
      } else if (statuses.length > 1) {
        conditions.push(`production_status IN (${statuses.map(() => '?').join(',')})`);
        params.push(...statuses);
      }
    }
    
    if (search) {
      conditions.push('(model LIKE ? OR description LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }
    
    const whereClause = conditions.length 
      ? `WHERE ${conditions.join(' AND ')}` 
      : '';
    
    const countSql = `SELECT COUNT(*) as total FROM ews ${whereClause}`;
    const [countResult] = await pool.query(countSql, params);
    const total = (countResult as any[])[0]?.total || 0;
    
    const dataSql = `
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
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    const dataParams = [...params, limit, offset];
    const [ews] = await pool.query(dataSql, dataParams);
    
    const filtersSql = `
      SELECT 
        MIN(price) as minPrice,
        MAX(price) as maxPrice
      FROM ews
    `;
    const [filtersResult] = await pool.query(filtersSql);
    const filters = (filtersResult as any[])[0];
    
    const transformed = (ews as any[]).map(item => ({
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
          priceRange: {
            min: parseFloat(filters.minPrice) || 0,
            max: parseFloat(filters.maxPrice) || 100000
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
    console.error('API Error /ews:', error);
    return NextResponse.json(
      { success: false, error: 'Помилка сервера' },
      { status: 500 }
    );
  }
}
