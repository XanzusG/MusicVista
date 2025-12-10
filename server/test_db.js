const { Client } = require('pg');

const client = new Client({
  host: 'db.fwxgwomgrppfdwvnjcpe.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: '6okVb5Vrk7Lmu2cg',
  ssl: { rejectUnauthorized: false }
});

async function testDatabase() {
  try {
    await client.connect();
    console.log('✓ 数据库连接成功\n');
    
    // 获取所有表
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('=== 数据库表列表 ===');
    tables.rows.forEach(row => console.log(`  - ${row.table_name}`));
    console.log('');
    
    // 检查关键表的数据量
    const checks = [
      { table: 'artists', query: 'SELECT COUNT(*) as count FROM artists' },
      { table: 'albums', query: 'SELECT COUNT(*) as count FROM albums' },
      { table: 'tracks', query: 'SELECT COUNT(*) as count FROM tracks' },
      { table: 'genre', query: 'SELECT COUNT(*) as count FROM genre' },
    ];
    
    console.log('=== 数据统计 ===');
    for (const check of checks) {
      try {
        const result = await client.query(check.query);
        console.log(`  ${check.table}: ${result.rows[0].count} 条记录`);
      } catch (err) {
        console.log(`  ${check.table}: 表不存在或查询失败`);
      }
    }
    console.log('');
    
    // 测试一个简单的查询
    console.log('=== 测试查询 ===');
    const testQuery = await client.query('SELECT id, name, popularity FROM artists LIMIT 3');
    console.log('前3个艺术家:');
    testQuery.rows.forEach(row => console.log(`  - ${row.name} (ID: ${row.id}, 人气: ${row.popularity})`));
    
  } catch (error) {
    console.error('❌ 错误:', error.message);
  } finally {
    await client.end();
  }
}

testDatabase();
