import fs from 'fs';
import mysql from 'mysql2/promise';

const dbPort = Number(process.env.DB_PORT || 3306);
const useSsl = process.env.DB_SSL === 'true';
const sslCaPath = process.env.DB_SSL_CA;

const sslConfig = useSsl
  ? {
      rejectUnauthorized: false,
      ca: sslCaPath ? fs.readFileSync(sslCaPath, 'utf8') : undefined,
    }
  : undefined;

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number.isFinite(dbPort) ? dbPort : 3306,
  ssl: sslConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
  

export async function query(sql: string, params?: any[]) {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export { pool };
export default pool;
