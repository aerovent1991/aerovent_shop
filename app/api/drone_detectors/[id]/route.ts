import { NextRequest, NextResponse } from 'next/server';
import pool from '@/app/lib/db';

export const revalidate = 300;

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Invalid id' },
        { status: 400 }
      );
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
      FROM drone_detectors
      WHERE id = ?
      LIMIT 1
    `;

    const [result] = await pool.query(sql, [id]);
    if (!Array.isArray(result) || result.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Детектор не знайдено' },
        { status: 404 }
      );
    }

    const detector: any = (result as any[])[0];
    const gallery = detector.gallery ? JSON.parse(detector.gallery) : [];

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
    const [similar] = await pool.query(similarSql, [id]);

    return NextResponse.json(
      {
        success: true,
        data: {
          ...detector,
          price: Number(detector.price),
          gallery,
          similar: (similar as any[]).map((item) => ({
            ...item,
            price: Number(item.price),
          }))
        }
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
        }
      }
    );
  } catch (error) {
    console.error('API Error /drone_detectors/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Помилка сервера' },
      { status: 500 }
    );
  }
}
