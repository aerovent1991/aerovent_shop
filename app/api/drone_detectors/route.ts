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

    const search = searchParams.get('search');

    const conditions: string[] = [];
    const params: any[] = [];

    if (search) {
      conditions.push('(model LIKE ? OR description LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const countSql = `SELECT COUNT(*) as total FROM drone_detectors ${whereClause}`;
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
      FROM drone_detectors
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;
    const dataParams = [...params, limit, offset];
    const [detectors] = await pool.query(dataSql, dataParams);

    const transformed = (detectors as any[]).map((item) => ({
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
        }
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
        }
      }
    );
  } catch (error) {
    console.error('API Error /drone_detectors:', error);
    return NextResponse.json(
      { success: false, error: 'Помилка сервера' },
      { status: 500 }
    );
  }
}
