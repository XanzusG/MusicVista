import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Database connection configuration
const poolConfig: PoolConfig = {
  // Use separate connection parameters instead of connectionString to avoid SSL configuration conflicts
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  // Connection pool configuration
  max: 20, // Maximum number of connections
  idleTimeoutMillis: 30000, // Idle connection timeout
  connectionTimeoutMillis: 100000, // Connection timeout
  // SSL configuration - AWS RDS requires SSL but allows self-signed certificates
  ssl: {
    rejectUnauthorized: false // Allow self-signed certificates
  }
};

// Create connection pool
export const pool = new Pool(poolConfig);

// Test connection
pool.on('connect', () => {
  console.log('Database connected successfully');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await pool.end();
  console.log('Database pool has ended');
  process.exit(0);
});

export default pool;
