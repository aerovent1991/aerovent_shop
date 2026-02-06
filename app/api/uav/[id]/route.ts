import { NextRequest, NextResponse } from 'next/server';
import pool from '@/app/lib/db';

// export const dynamic = 'force-dynamic';
// export const fetchCache = 'force-no-store';
export const revalidate = 300;

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // 🔥 ОЦЕ КЛЮЧОВИЙ ФІКС
    const { id } = await context.params;

    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Invalid or missing ID' },
        { status: 400 }
      );
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

    const [result] = await pool.query(sql, [id]);

    if (!Array.isArray(result) || result.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Дрон не знайдено' },
        { status: 404 }
      );
    }

    const drone: any = result[0];

    // 🖼️ Безпечна галерея
    let gallery: string[] = [];

    if (Array.isArray(drone.gallery)) {
      gallery = drone.gallery;
    } else if (typeof drone.gallery === 'string' && drone.gallery.trim() !== '') {
      try {
        gallery = JSON.parse(drone.gallery);
      } catch {
        gallery = [];
      }
    }

    // 🔗 Similar
    const similarSql = `
      SELECT 
        id,
        model,
        price,
        application,
        connection,
        main_image AS image
      FROM drones
      WHERE application = ?
        AND id != ?
        AND production_status = 'inProduction'
      ORDER BY created_at DESC
      LIMIT 4
    `;

    const [similarResult] = await pool.query(similarSql, [
      drone.application,
      id,
    ]);

    const similar = Array.isArray(similarResult)
      ? similarResult.map((item: any) => ({
          ...item,
          price: Number(item.price),
        }))
      : [];

    return NextResponse.json(
      {
        success: true,
        data: {
          ...drone,
          price: Number(drone.price),
          gallery,
          similar,
        },
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
        }
      }
    );
  } catch (error: any) {
    console.error('API Error /api/uav/[id]:', error);

    return NextResponse.json(
      { success: false, error: 'Помилка сервера' },
      { status: 500 }
    );
  }
}
