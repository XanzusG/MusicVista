// 简单的API服务器测试脚本
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './database/connection';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 健康检查
app.get('/health', (req, res) => {
  res.json({ success: true, message: '服务器运行正常' });
});

// 测试数据库连接
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) as count FROM artists');
    res.json({ success: true, artistCount: result.rows[0].count });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 测试艺术家API
app.get('/test-artists', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, popularity FROM artists LIMIT 5');
    res.json({ success: true, data: result.rows });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`测试服务器运行在 http://localhost:${PORT}`);
  console.log(`健康检查: http://localhost:${PORT}/health`);
  console.log(`数据库测试: http://localhost:${PORT}/test-db`);
  console.log(`艺术家测试: http://localhost:${PORT}/test-artists`);
});
