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
      WHERE id = ?
      LIMIT 1
    `;

    const [result] = await pool.query(sql, [id]);
    if (!Array.isArray(result) || result.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Батарею не знайдено' },
        { status: 404 }
      );
    }

    const battery: any = (result as any[])[0];
    const gallery = battery.gallery ? JSON.parse(battery.gallery) : [];

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
    const [similar] = await pool.query(similarSql, [id]);

    return NextResponse.json(
      {
        success: true,
        data: {
          ...battery,
          price: Number(battery.price),
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
    console.error('API Error /batteries/[id]:', error);
    return NextResponse.json(
      { success: false, error: 'Помилка сервера' },
      { status: 500 }
    );
  }
}
