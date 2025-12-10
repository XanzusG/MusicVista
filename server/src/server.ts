import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';

// 路由导入
// import authRoutes from './routes/auth';
// import userRoutes from './routes/users';
// import likeRoutes from './routes/likes';
// import lyricRoutes from './routes/lyrics';
// import socialRoutes from './routes/social';
// import musicRoutes from './routes/music';
import artistRoutes from './routes/artists';
import albumRoutes from './routes/albums';
import trackRoutes from './routes/tracks';
import insightRoutes from './routes/insights';
// import genreRoutes from './routes/genres';

// 中间件导入
import { errorHandler, notFoundHandler, requestLogger } from './middleware/errorHandler';

// 加载环境变量
dotenv.config();

class MusicVistaServer {
  private app: Application;
  private port: string | number;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3001;
    
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddleware(): void {
    // 安全中间件
    this.app.use(helmet({
      crossOriginEmbedderPolicy: false, // 允许跨域嵌入
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
    }));

    // CORS配置
    this.app.use(cors({
      origin: process.env.FRONTEND_URL || [
        'http://localhost:3000',
        'http://localhost:5173',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:5173',
        'https://musicvista.space.minimaxi.com'
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: [
        'Content-Type', 
        'Authorization', 
        'X-Requested-With',
        'Accept',
        'Origin',
        'Access-Control-Request-Method',
        'Access-Control-Request-Headers'
      ],
      exposedHeaders: ['X-Total-Count', 'X-Page-Count']
    }));

    // 请求解析中间件
    this.app.use(express.json({ 
      limit: '10mb',
      strict: true
    }));
    this.app.use(express.urlencoded({ 
      extended: true, 
      limit: '10mb' 
    }));

    // 静态文件服务（用于提供上传的文件等）
    this.app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

    // 日志中间件
    if (process.env.NODE_ENV !== 'test') {
      this.app.use(requestLogger);
      this.app.use(morgan('combined'));
    }

    // 基本健康检查路由
    this.app.get('/health', (req: Request, res: Response) => {
      res.json({
        success: true,
        message: 'MusicVista API服务器运行正常',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        uptime: process.uptime()
      });
    });
  }

  private initializeRoutes(): void {
    // API路由
    // this.app.use('/api/auth', authRoutes);
    // this.app.use('/api/users', userRoutes);
    // this.app.use('/api/likes', likeRoutes);
    // this.app.use('/api/lyrics', lyricRoutes);
    // this.app.use('/api/social', socialRoutes);
    // this.app.use('/api/music', musicRoutes);
    this.app.use('/api/artists', artistRoutes);
    this.app.use('/api/albums', albumRoutes);
    this.app.use('/api/tracks', trackRoutes);
    this.app.use('/api/insights', insightRoutes);
    // this.app.use('/api/genres', genreRoutes);

    // API信息路由
    this.app.get('/api', (req: Request, res: Response) => {
      res.json({
        success: true,
        message: 'MusicVista API服务',
        version: '1.0.0',
        documentation: 'API文档可以在 /api/docs 查看',
        endpoints: {
          auth: '/api/auth',
          users: '/api/users',
          likes: '/api/likes',
          lyrics: '/api/lyrics',
          social: '/api/social',
          music: '/api/music',
          artists: '/api/artists',
          albums: '/api/albums',
          tracks: '/api/tracks',
          genres: '/api/genres'
        },
        timestamp: new Date().toISOString()
      });
    });

    // 处理未匹配路由（404）
    this.app.use('*', notFoundHandler);
  }

  private initializeErrorHandling(): void {
    // 全局错误处理中间件
    this.app.use(errorHandler);
  }

  public listen(): void {
    this.app.listen(this.port, () => {
      console.log(`
╔══════════════════════════════════════════════════════════╗
║                    MusicVista API Server                  ║
╠══════════════════════════════════════════════════════════╣
║  🚀 Server running on: http://localhost:${this.port}          ║
║  🌍 Environment: ${process.env.NODE_ENV || 'development'}                     ║
║  📊 Health check: http://localhost:${this.port}/health       ║
║  📖 API docs: http://localhost:${this.port}/api              ║
╠══════════════════════════════════════════════════════════╣
║  📡 API Endpoints:                                        ║
║  ├─ 🔐 /api/auth        (认证相关)                       ║
║  ├─ 👤 /api/users       (用户管理)                       ║
║  ├─ ❤️  /api/likes      (收藏功能)                       ║
║  ├─ 📝 /api/lyrics      (歌词搜索)                       ║
║  ├─ 🎵 /api/music       (音乐分析)                       ║
║  ├─ 🎤 /api/artists     (艺术家)                         ║
║  ├─ 💿 /api/albums      (专辑)                           ║
║  ├─ 🎶 /api/tracks      (歌曲)                           ║
║  └─ 🔗 /api/social      (社交登录)                       ║
╚══════════════════════════════════════════════════════════╝
      `);
    });
  }

  public getApp(): Application {
    return this.app;
  }
}

// 错误处理
process.on('uncaughtException', (error: Error) => {
  console.error('未捕获的异常:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  console.error('未处理的Promise拒绝:', reason);
  process.exit(1);
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('收到SIGTERM信号，正在优雅关闭服务器...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('收到SIGINT信号，正在优雅关闭服务器...');
  process.exit(0);
});

// 启动服务器（仅在非测试环境中）
if (require.main === module) {
  const server = new MusicVistaServer();
  server.listen();
}

export default MusicVistaServer;