import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// 数据库连接配置
const poolConfig: PoolConfig = {
  // 使用单独的连接参数而不是connectionString，以避免SSL配置冲突
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  // 连接池配置
  max: 20, // 最大连接数
  idleTimeoutMillis: 30000, // 空闲连接超时时间
  connectionTimeoutMillis: 100000, // 连接超时时间
  // SSL配置 - AWS RDS需要SSL，但允许自签名证书
  ssl: {
    rejectUnauthorized: false // 允许自签名证书
  }
};

// 创建连接池
export const pool = new Pool(poolConfig);

// 测试连接
pool.on('connect', () => {
  console.log('Database connected successfully');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// 优雅关闭
process.on('SIGINT', async () => {
  await pool.end();
  console.log('Database pool has ended');
  process.exit(0);
});

export default pool;
