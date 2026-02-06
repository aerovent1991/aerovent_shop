import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';

export async function GET() {
  try {
    const statsSql = `
      SELECT 
        (SELECT COUNT(*) FROM drones WHERE production_status = 'inProduction') as activeDrones,
        (SELECT COUNT(*) FROM ews WHERE production_status = 'inProduction') as activeEws,
        (SELECT COUNT(*) FROM drones) as totalDrones,
        (SELECT COUNT(*) FROM ews) as totalEws,
        (SELECT AVG(price) FROM drones WHERE production_status = 'inProduction') as avgDronePrice,
        (SELECT AVG(price) FROM ews WHERE production_status = 'inProduction') as avgEwsPrice,
        (SELECT COUNT(DISTINCT application) FROM drones) as uniqueApplications
    `;
    
    const [result] = await pool.query(statsSql);
    const stats = (result as any[])[0];
    
    return NextResponse.json({
      success: true,
      data: {
        drones: {
          active: stats.activeDrones,
          total: stats.totalDrones,
          avgPrice: parseFloat(stats.avgDronePrice) || 0
        },
        ews: {
          active: stats.activeEws,
          total: stats.totalEws,
          avgPrice: parseFloat(stats.avgEwsPrice) || 0
        },
        uniqueApplications: stats.uniqueApplications
      }
    });
  } catch (error) {
    console.error('API Error /stats:', error);
    return NextResponse.json(
      { success: false, error: 'Помилка сервера' },
      { status: 500 }
    );
  }
}
