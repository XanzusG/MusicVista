#!/usr/bin/env node

/**
 * 数据库连接测试脚本
 * 使用纯JavaScript，不需要编译
 */

const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

// 加载环境变量
dotenv.config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
  host: process.env.DB_HOST || 'db.fwxgwomgrppfdwvnjcpe.supabase.co',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'postgres',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '6okVb5Vrk7Lmu2cg',
  ssl: { rejectUnauthorized: false }
});

async function testDatabase() {
  console.log('===========================================');
  console.log('  MusicVista 数据库连接测试');
  console.log('===========================================\n');

  try {
    // 测试连接
    console.log('1. 测试数据库连接...');
    await pool.query('SELECT NOW()');
    console.log('   ✓ 连接成功\n');

    // 获取表列表
    console.log('2. 获取表列表...');
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    console.log(`   ✓ 找到 ${tables.rows.length} 个表:`);
    tables.rows.forEach(row => console.log(`      - ${row.table_name}`));
    console.log('');

    // 检查关键表的数据
    console.log('3. 检查数据量...');
    const checks = [
      'artists',
      'albums',
      'tracks',
      'genre',
      'artist_genre',
      'track_genre'
    ];

    for (const tableName of checks) {
      try {
        const result = await pool.query(`SELECT COUNT(*) as count FROM ${tableName}`);
        console.log(`   ${tableName}: ${result.rows[0].count} 条记录`);
      } catch (err) {
        console.log(`   ${tableName}: 表不存在`);
      }
    }
    console.log('');

    // 测试艺术家查询
    console.log('4. 测试艺术家查询...');
    const artists = await pool.query('SELECT id, name, popularity FROM artists LIMIT 3');
    console.log(`   ✓ 查询成功，找到 ${artists.rows.length} 个艺术家:`);
    artists.rows.forEach(row => {
      console.log(`      - ${row.name} (ID: ${row.id}, 人气: ${row.popularity})`);
    });
    console.log('');

    // 测试专辑查询
    console.log('5. 测试专辑查询...');
    const albums = await pool.query(`
      SELECT al.id, al.name, a.name as artist_name, al.popularity 
      FROM albums al
      JOIN artists a ON al.artist_id = a.id
      LIMIT 3
    `);
    console.log(`   ✓ 查询成功，找到 ${albums.rows.length} 个专辑:`);
    albums.rows.forEach(row => {
      console.log(`      - ${row.name} by ${row.artist_name} (ID: ${row.id})`);
    });
    console.log('');

    // 测试歌曲查询
    console.log('6. 测试歌曲查询...');
    const tracks = await pool.query(`
      SELECT t.id, t.name, a.name as artist_name, t.popularity 
      FROM tracks t
      JOIN albums al ON t.album_id = al.id
      JOIN artists a ON al.artist_id = a.id
      LIMIT 3
    `);
    console.log(`   ✓ 查询成功，找到 ${tracks.rows.length} 首歌曲:`);
    tracks.rows.forEach(row => {
      console.log(`      - ${row.name} by ${row.artist_name} (ID: ${row.id})`);
    });
    console.log('');

    console.log('===========================================');
    console.log('  ✓ 所有测试通过！');
    console.log('===========================================\n');

  } catch (error) {
    console.error('\n❌ 错误:', error.message);
    console.error('完整错误:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

testDatabase();
