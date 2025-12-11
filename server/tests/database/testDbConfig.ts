import { Pool } from 'pg';

// 测试数据库配置
export const testDbConfig = {
  host: process.env.TEST_DB_HOST || 'localhost',
  port: parseInt(process.env.TEST_DB_PORT || '5432'),
  database: process.env.TEST_DB_NAME || 'musicvista_test',
  user: process.env.TEST_DB_USER || 'test_user',
  password: process.env.TEST_DB_PASSWORD || 'test_password',
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

// 创建测试数据库连接池
export const testPool = new Pool(testDbConfig);

// 测试数据清理函数
export async function cleanTestData() {
  const tables = [
    'users',
    'tracks',
    'albums',
    'artists',
    'user_likes',
    'user_history'
  ];

  for (const table of tables) {
    try {
      await testPool.query(`TRUNCATE TABLE ${table} CASCADE`);
    } catch (error) {
      console.warn(`Failed to truncate table ${table}:`, error);
    }
  }
}

// 创建测试数据
export async function createTestData() {
  // 创建测试艺术家
  await testPool.query(`
    INSERT INTO artists (id, name, popularity, followers) VALUES
    ('1', 'Test Artist 1', 85, 10000),
    ('2', 'Test Artist 2', 75, 5000),
    ('3', 'Test Artist 3', 90, 20000)
  `);

  // 创建测试专辑
  await testPool.query(`
    INSERT INTO albums (id, name, artist_id, release_date) VALUES
    ('1', 'Test Album 1', '1', '2023-01-01'),
    ('2', 'Test Album 2', '2', '2023-02-01')
  `);

  // 创建测试歌曲
  await testPool.query(`
    INSERT INTO tracks (id, name, artist_id, album_id, duration_ms, popularity) VALUES
    ('1', 'Test Track 1', '1', '1', 180000, 80),
    ('2', 'Test Track 2', '1', '1', 210000, 75),
    ('3', 'Test Track 3', '2', '2', 200000, 70)
  `);
}

// 关闭测试数据库连接
export async function closeTestDb() {
  await testPool.end();
}