import { NextRequest, NextResponse } from 'next/server';
import pool from '@/app/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const eventType = (body?.eventType ?? '').toString().trim();
    const visitorId = (body?.visitorId ?? '').toString().trim();

    if (!eventType || !visitorId) {
      return NextResponse.json(
        { success: false, error: 'Missing eventType or visitorId' },
        { status: 400 }
      );
    }

    if (eventType !== 'session_start') {
      return NextResponse.json({ success: true });
    }

    const sql = `
      INSERT INTO site_visits (visitor_id, first_seen, last_seen, visit_count)
      VALUES (?, NOW(), NOW(), 1)
      ON DUPLICATE KEY UPDATE
        last_seen = NOW(),
        visit_count = visit_count + 1
    `;

    await pool.query(sql, [visitorId]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Error /track:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
