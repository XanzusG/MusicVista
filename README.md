# 🎵 MusicVista

**MusicVista** is a comprehensive music data visualization and exploration platform built with modern web technologies. It provides users with insights into artists, albums, tracks, and music trends through interactive visualizations and advanced search capabilities.

**GitHub Repository:** [https://github.com/abbyzhou02/Music-Explorer](https://github.com/abbyzhou02/Music-Explorer)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

- 🎨 **Interactive Music Data Visualization** - Explore music data through charts, graphs, and word clouds
- 🔍 **Advanced Search & Filtering** - Search for artists, albums, and tracks with multiple filters
- 📊 **Artist Analytics** - View detailed artist profiles with popularity metrics and collaboration networks
- 🎵 **Album & Track Discovery** - Browse albums and tracks with rich metadata
- 🌐 **Genre & Trend Analysis** - Explore music genres and trends over time
- 📱 **Responsive Design** - Seamless experience across desktop and mobile devices
- 🎯 **Million Song Dataset** - Powered by comprehensive music metadata

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Chart.js & Recharts** - Data visualization
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **TypeScript** - Type-safe backend code
- **PostgreSQL** - Relational database
- **JWT** - Authentication & authorization
- **Bcrypt** - Password hashing
- **Helmet** - Security middleware
- **Morgan** - HTTP request logger

---

## 📦 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** >= 16.0.0 (recommend v18 or v20)
- **npm** >= 8.0.0
- **PostgreSQL** >= 12.0
- **Git** (for cloning the repository)

Check your versions:
```bash
node --version
npm --version
psql --version
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/abbyzhou02/Music-Explorer.git
cd Music-Explorer
```

### 2. Backend Setup

#### Step 1: Navigate to Server Directory
```bash
cd server
```

#### Step 2: Install Dependencies
```bash
npm install
```

#### Step 3: Configure Environment Variables

Create a `.env` file in the `server` directory:

```bash
cp .env.example .env
```

Edit `.env` and fill in your actual database connection values:

```env
# Server Configuration
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173

# PostgreSQL Database (connect to existing database)
DB_HOST=your-rds-endpoint.rds.amazonaws.com
DB_PORT=5432
DB_NAME=millionsongsubset
DB_USER=postgres
DB_PASSWORD=your_db_password

# CORS Configuration
CORS_ORIGINS=http://localhost:5173

# Logging
LOG_LEVEL=info
```

**Note:** This project connects to an existing PostgreSQL database (Million Song Subset). Make sure you have access to the database and update the connection details above.

---

### 3. Frontend Setup

#### Step 1: Navigate to Client Directory
```bash
cd ../client
```

#### Step 2: Install Dependencies

If you encounter peer dependency issues, use:
```bash
npm install --legacy-peer-deps
```

Or simply:
```bash
npm install
```

#### Step 3: Configure Environment Variables

Create a `.env` file in the `client` directory:

```bash
# Create .env file
touch .env
```

Add the following content:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3001/api

# Application Settings
VITE_APP_NAME=MusicVista
VITE_APP_VERSION=1.0.0

# Development Settings
VITE_DEBUG=true
VITE_LOG_LEVEL=debug
```

---

## 🎬 Running the Application

### Run Backend and Frontend Separately

**Terminal 1 - Start Backend Server:**
```bash
cd server
npm run dev
```

Backend will run at: `http://localhost:3001`

**Terminal 2 - Start Frontend Dev Server:**
```bash
cd client
npm run dev
```

Frontend will run at: `http://localhost:5173`

**Open your browser and visit:** `http://localhost:5173`



---

## 🏗️ Project Structure

```
Music-Explorer/
├── client/                      # Frontend React application
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/               # Page components
│   │   ├── lib/                 # API clients and utilities
│   │   ├── hooks/               # Custom React hooks
│   │   ├── contexts/            # React contexts
│   │   ├── assets/              # Static assets
│   │   └── main.tsx             # Application entry point
│   ├── public/                  # Public static files
│   ├── .env                     # Environment variables (local)
│   ├── .npmrc                   # NPM configuration
│   ├── package.json             # Frontend dependencies
│   ├── vite.config.ts           # Vite configuration
│   ├── tailwind.config.js       # Tailwind CSS configuration
│   └── tsconfig.json            # TypeScript configuration
│
├── server/                      # Backend Express API
│   ├── src/
│   │   ├── routes/              # API route handlers
│   │   ├── controllers/         # Business logic
│   │   ├── middleware/          # Express middleware
│   │   ├── database/            # Database connection & queries
│   │   ├── utils/               # Utility functions
│   │   └── server.ts            # Server entry point
│   ├── tests/                   # Test files
│   ├── dist/                    # Compiled JavaScript (generated)
│   ├── .env                     # Environment variables (local)
│   ├── package.json             # Backend dependencies
│   ├── tsconfig.json            # TypeScript configuration
│   └── render.yaml              # Render deployment config
│
├── .gitignore                   # Git ignore rules
├── DEPLOYMENT.md                # Deployment documentation
└── README.md                    # This file
```

---

## 📡 API Documentation

### Base URL
```
http://localhost:3001/api
```

### Key Endpoints

#### Artists
```
GET    /api/artists/trending                        # Get trending artists
GET    /api/artists/search                          # Search artists
GET    /api/artists/count                           # Get total artist count
GET    /api/artists/genres/count                    # Get genre count
GET    /api/artists/genre-distribution              # Get genre distribution across all artists
GET    /api/artists/emotion-distribution            # Get emotion distribution across all artists
GET    /api/artists/:id                             # Get artist details
GET    /api/artists/:id/collaborators               # Get artist collaborators
GET    /api/artists/:id/tracks                      # Get artist's tracks
GET    /api/artists/:id/tracks/count                # Get artist's track count
GET    /api/artists/:id/albums                      # Get artist's albums
GET    /api/artists/:id/albums/count                # Get artist's album count
GET    /api/artists/:id/genre-distribution          # Get genre distribution for specific artist
GET    /api/artists/:id/emotion-distribution        # Get emotion distribution for specific artist
```

#### Albums
```
GET    /api/albums                              # Get all albums (paginated)
GET    /api/albums/recent                       # Get recent albums
GET    /api/albums/search                       # Search albums
GET    /api/albums/count                        # Get total album count
GET    /api/albums/search/type-distribution     # Get album type distribution from search
GET    /api/albums/:id                          # Get album details
GET    /api/albums/:id/tracks                   # Get album tracks
```

#### Tracks
```
GET    /api/tracks                              # Get all tracks (paginated)
GET    /api/tracks/search                       # Search tracks
GET    /api/tracks/count                        # Get total track count
GET    /api/tracks/artist/:id                   # Get tracks by artist ID
GET    /api/tracks/:id                          # Get track details
GET    /api/tracks/:id/lyrics                   # Get track lyrics
GET    /api/tracks/:id/similar                  # Get similar tracks
```

#### Insights
```
GET    /api/insights/love-distribution          # Get love-related word distribution
GET    /api/insights/pop-words                  # Get popular words in lyrics
GET    /api/insights/artist-popularity-growth   # Get artist popularity growth trends
GET    /api/insights/artist-emotion-variety     # Get artist emotion variety analysis
```

### Response Format

All API responses follow this format:

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message",
  "statusCode": 400
}
```

---

## 🔧 Development

### Backend Development

**Run in development mode with hot reload:**
```bash
cd server
npm run dev
```

**Run tests:**
```bash
npm test                  # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # With coverage report
```

**Build for production:**
```bash
npm run build:prod
```

### Frontend Development

**Run development server:**
```bash
cd client
npm run dev
```

**Build for production:**
```bash
npm run build:prod
```

**Preview production build:**
```bash
npm run preview
```

**Lint code:**
```bash
npm run lint
```

### Common Development Tasks

**Clean and reinstall dependencies:**
```bash
# Backend
cd server
npm run clean
npm install

# Frontend
cd client
npm run clean
npm install --legacy-peer-deps
```

**Check TypeScript types:**
```bash
# Backend
cd server
npm run test:types:src

# Frontend
cd client
npx tsc --noEmit
```

---

## 🧪 Testing

### Backend Tests

The server uses **Jest** for testing.

```bash
cd server

# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test types
npm run test:unit          # Unit tests only
npm run test:integration   # Integration tests only

# Watch mode for development
npm run test:watch
```

---

## 🐳 Docker Support

Both frontend and backend have Docker support.

### Backend Docker

```bash
cd server

# Build image
npm run docker:build

# Run container
npm run docker:run

# Or use Docker Compose
npm run docker:compose
```

### Frontend Docker

```bash
cd client

# Build image
npm run docker:build

# Run container
npm run docker:run
```

---

## 🌍 Environment Variables Reference

### Backend Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment mode | `development` | Yes |
| `PORT` | Server port | `3001` | Yes |
| `DB_HOST` | Database host | `localhost` | Yes |
| `DB_PORT` | Database port | `5432` | Yes |
| `DB_NAME` | Database name | `millionsongsubset` | Yes |
| `DB_USER` | Database user | - | Yes |
| `DB_PASSWORD` | Database password | - | Yes |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` | Yes |
| `CORS_ORIGINS` | Allowed CORS origins | - | Yes |
| `LOG_LEVEL` | Logging level | `info` | No |

### Frontend Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_API_BASE_URL` | Backend API URL | - | Yes |
| `VITE_APP_NAME` | Application name | `MusicVista` | No |
| `VITE_APP_VERSION` | App version | `1.0.0` | No |
| `VITE_DEBUG` | Debug mode | `false` | No |
| `VITE_LOG_LEVEL` | Log level | `warn` | No |

---

## 📝 Available Scripts

### Backend Scripts

```bash
npm run dev              # Start development server with hot reload
npm run build            # Build TypeScript to JavaScript
npm run start            # Start production server
npm run clean            # Remove build files
npm test                 # Run tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage
```

### Frontend Scripts

```bash
npm run dev              # Start Vite dev server
npm run build            # Build for production
npm run build:prod       # Build with production env
npm run preview          # Preview production build
npm run lint             # Lint code with ESLint
npm run clean            # Clean node_modules and build files
```

---

## 🔒 Security Notes

1. **Never commit `.env` files** with real credentials to version control
2. **Keep database credentials secure** and use read-only access when possible
3. **Enable HTTPS** in production environments
4. **Keep dependencies updated** regularly
5. **Use environment-specific configurations** for different deployment stages

---

## 🚀 Deployment

For deployment instructions to Render (backend) and Vercel (frontend), please see:
- [DEPLOYMENT.md](./DEPLOYMENT.md)
- Backend: [server/render.yaml](./server/render.yaml)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👥 Team

**MusicVista Team** - University of Pennsylvania CIS4500 Project

---

## 🙏 Acknowledgments

- Million Song Dataset for music data
- Radix UI for accessible components
- React and TypeScript communities

---

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Contact the development team

---

**Happy Coding! 🎵✨**
