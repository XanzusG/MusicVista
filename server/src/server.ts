import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';

// Route imports
import artistRoutes from './routes/artists';
import albumRoutes from './routes/albums';
import trackRoutes from './routes/tracks';
import insightRoutes from './routes/insights';

// Middleware imports
import { errorHandler, notFoundHandler, requestLogger } from './middleware/errorHandler';

// Load environment variables
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
    // Security middleware
    this.app.use(helmet({
      crossOriginEmbedderPolicy: false, // Allow cross-origin embedding
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
    }));

    // CORS configuration
    this.app.use(cors({
      origin: process.env.FRONTEND_URL || [
        'http://localhost:5173',
        'http://127.0.0.1:5173'
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

    // Request parsing middleware
    this.app.use(express.json({ 
      limit: '10mb',
      strict: true
    }));
    this.app.use(express.urlencoded({ 
      extended: true, 
      limit: '10mb' 
    }));

    // Static file service (for serving uploaded files, etc.)
    this.app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

    // Logging middleware
    if (process.env.NODE_ENV !== 'test') {
      this.app.use(requestLogger);
      this.app.use(morgan('combined'));
    }

    // Basic health check route
    this.app.get('/health', (req: Request, res: Response) => {
      res.json({
        success: true,
        message: 'MusicVista API server is running normally',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        uptime: process.uptime()
      });
    });
  }

  private initializeRoutes(): void {
    // API routes
    this.app.use('/api/artists', artistRoutes);
    this.app.use('/api/albums', albumRoutes);
    this.app.use('/api/tracks', trackRoutes);
    this.app.use('/api/insights', insightRoutes);

    // API information route
    this.app.get('/api', (req: Request, res: Response) => {
      res.json({
        success: true,
        message: 'MusicVista API Service',
        version: '1.0.0',
        endpoints: {
          artists: '/api/artists',
          albums: '/api/albums',
          tracks: '/api/tracks',
          insights: '/api/insights'
        },
        timestamp: new Date().toISOString()
      });
    });

    // Handle unmatched routes (404)
    this.app.use('*', notFoundHandler);
  }

  private initializeErrorHandling(): void {
    // Global error handling middleware
    this.app.use(errorHandler);
  }

  public listen(): void {
    this.app.listen(this.port, () => {
      console.log(`
╔══════════════════════════════════════════════════════════╗
║                    MusicVista API Server                 ║
╠══════════════════════════════════════════════════════════╣
║  🚀 Server running on: http://localhost:${this.port}             ║
║  🌍 Environment: ${process.env.NODE_ENV || 'development'}                             ║
║  📊 Health check: http://localhost:${this.port}/health           ║
║  📖 API docs: http://localhost:${this.port}/api                  ║
╠══════════════════════════════════════════════════════════╣
║  📡 API Endpoints:                                       ║
║  ├─ 🎤 /api/artists     (Artists)                        ║
║  ├─ 💿 /api/albums      (Albums)                         ║
║  ├─ 🎶 /api/tracks      (Tracks)                         ║
║  └─ 📊 /api/insights    (Insights)                       ║
╚══════════════════════════════════════════════════════════╝
      `);
    });
  }

  public getApp(): Application {
    return this.app;
  }
}

// Error handling
process.on('uncaughtException', (error: Error) => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  console.error('Unhandled Promise rejection:', reason);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: gracefully shutting down server...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: gracefully shutting down server...');
  process.exit(0);
});

// Start server (only in non-test environments)
if (require.main === module) {
  const server = new MusicVistaServer();
  server.listen();
}

export default MusicVistaServer;