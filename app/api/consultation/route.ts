import { NextRequest, NextResponse } from 'next/server';
import pool from '@/app/lib/db';

type ContactMethod = 'phone' | 'signal' | 'viber' | 'whatsapp';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = (body?.name ?? '').toString().trim();
    const phone = (body?.phone ?? '').toString().trim();
    const question = (body?.question ?? '').toString().trim();
    const contactMethod = (body?.contactMethod ?? '').toString().trim() as ContactMethod;

    if (!name || !phone || !question) {
      return NextResponse.json(
        { success: false, error: 'Заповніть усі обовʼязкові поля' },
        { status: 400 }
      );
    }

    const cleanedPhone = phone.replace(/\s+/g, '');
    if (!/^\+380\d{9}$/.test(cleanedPhone)) {
      return NextResponse.json(
        { success: false, error: 'Невірний формат телефону. Приклад: +380XXXXXXXXX' },
        { status: 400 }
      );
    }

    const allowed: ContactMethod[] = ['phone', 'signal', 'viber', 'whatsapp'];
    if (!allowed.includes(contactMethod)) {
      return NextResponse.json(
        { success: false, error: 'Невірний спосіб звʼязку' },
        { status: 400 }
      );
    }

    const sql = `
      INSERT INTO consultation_requests
        (name, phone, question, contact_method, status, created_at)
      VALUES
        (?, ?, ?, ?, 'new', NOW())
    `;

    await pool.query(sql, [name, cleanedPhone, question, contactMethod]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Error /consultation:', error);
    return NextResponse.json(
      { success: false, error: 'Помилка сервера' },
      { status: 500 }
    );
  }
}
