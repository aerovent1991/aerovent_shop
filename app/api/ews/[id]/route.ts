import { NextRequest, NextResponse } from 'next/server';
import pool from '@/app/lib/db';

export const revalidate = 300;

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

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
    `;

    const [result] = await pool.query(sql, [id]);

    if ((result as any[]).length === 0) {
      return NextResponse.json(
        { success: false, error: 'Система не знайдена' },
        { status: 404 }
      );
    }

    const ews = (result as any[])[0];

    const similarSql = `
      SELECT 
        id,
        model,
        price,
        main_image as image
      FROM ews 
      WHERE id != ? 
        AND production_status = 'inProduction'
      ORDER BY RAND()
      LIMIT 4
    `;

    const [similar] = await pool.query(similarSql, [id]);

    const transformedEws = {
      ...ews,
      price: parseFloat(ews.price),
      gallery: ews.gallery ? JSON.parse(ews.gallery) : [],
      similar: (similar as any[]).map(item => ({
        ...item,
        price: parseFloat(item.price)
      }))
    };

    return NextResponse.json(
      {
        success: true,
        data: transformedEws
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
        }
      }
    );
  } catch (error) {
    console.error('API Error /ews/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Помилка сервера' },
      { status: 500 }
    );
  }
}
