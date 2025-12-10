# MusicVista API Server

MusicVista项目的后端API服务器，基于Node.js + Express + TypeScript构建。

## 🚀 快速开始

### 环境要求
- Node.js >= 16.0.0
- npm 或 yarn

### 安装依赖

```bash
cd musicvista/server
npm install
```

### 配置环境变量

```bash
cp .env.example .env
# 编辑 .env 文件，配置你的环境变量
```

### 启动开发服务器

```bash
# 开发模式（支持热重载）
npm run dev

# 生产模式
npm run build
npm start
```

服务器将在 http://localhost:3001 启动。

## 📁 项目结构

```
server/
├── src/
│   ├── controllers/        # 控制器
│   │   ├── authController.ts
│   │   ├── userController.ts
│   │   ├── likeController.ts
│   │   └── lyricController.ts
│   ├── middleware/         # 中间件
│   │   ├── auth.ts
│   │   └── errorHandler.ts
│   ├── models/             # 数据模型
│   │   ├── database.ts
│   │   └── types.ts
│   ├── routes/             # 路由
│   │   ├── auth.ts
│   │   ├── users.ts
│   │   ├── likes.ts
│   │   ├── lyrics.ts
│   │   └── social.ts
│   ├── types/              # 类型定义
│   │   └── index.ts
│   ├── utils/              # 工具函数
│   │   └── auth.ts
│   └── server.ts           # 主服务器文件
├── data/                   # 模拟数据
│   ├── users.json
│   ├── likes.json
│   └── lyrics.json
├── package.json
├── tsconfig.json
└── .env.example
```

## 🛠️ API端点

### 认证相关 (`/api/auth`)
- `POST /auth/register` - 用户注册
- `POST /auth/login` - 用户登录
- `POST /auth/logout` - 用户登出
- `POST /auth/refresh` - 刷新访问令牌
- `GET /auth/me` - 获取当前用户信息
- `POST /auth/social-login` - 社交登录

### 用户管理 (`/api/users`)
- `GET /users` - 获取用户列表（支持分页和搜索）
- `GET /users/:id` - 获取用户详情
- `PUT /users/:id` - 更新用户资料
- `DELETE /users/:id` - 停用用户账户
- `GET /users/search` - 搜索用户
- `GET /users/stats` - 获取用户统计

### 收藏功能 (`/api/likes`)
- `GET /likes/my` - 获取我的收藏列表
- `POST /likes` - 收藏歌曲/专辑/艺术家
- `DELETE /likes/:trackId` - 取消收藏
- `POST /likes/toggle` - 切换收藏状态
- `GET /likes/check/:trackId` - 检查是否已收藏
- `GET /likes/user/:userId` - 获取指定用户的收藏
- `GET /likes/stats` - 获取收藏统计

### 歌词搜索 (`/api/lyrics`)
- `GET /lyrics/search` - 搜索歌词
- `POST /lyrics/search/advanced` - 高级歌词搜索
- `GET /lyrics/:id` - 获取歌词详情
- `GET /lyrics/track/:trackId` - 获取歌曲的歌词
- `GET /lyrics/popular` - 获取热门歌词
- `POST /lyrics` - 添加歌词（需要认证）
- `PUT /lyrics/:id` - 更新歌词（需要认证和管理员权限）
- `DELETE /lyrics/:id` - 删除歌词（需要认证和管理员权限）
- `PATCH /lyrics/:id/verify` - 验证歌词（需要认证和管理员权限）
- `GET /lyrics/stats` - 获取歌词统计

### 社交登录 (`/api/social`)
- `GET /social/google` - Google登录入口
- `GET /social/google/callback` - Google登录回调
- `GET /social/facebook` - Facebook登录入口
- `GET /social/facebook/callback` - Facebook登录回调
- `GET /social/github` - GitHub登录入口
- `GET /social/github/callback` - GitHub登录回调
- `POST /social/login` - 直接社交登录

## 🔐 认证

API使用JWT（JSON Web Tokens）进行认证。

### 访问令牌
- 有效期：15分钟
- 用途：访问需要认证的API端点
- 格式：`Authorization: Bearer <access_token>`

### 刷新令牌
- 有效期：7天
- 用途：刷新访问令牌
- 使用方式：调用 `/auth/refresh` 端点

### 使用示例

```javascript
// 登录
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const { data } = await response.json();
const { accessToken, refreshToken } = data;

// 访问需要认证的API
const protectedResponse = await fetch('/api/users/me', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});
```

## 📊 数据存储

本项目使用模拟数据，无需真实数据库连接：

- **用户数据** (`data/users.json`) - 包含3个测试用户
  - 用户1: `demo@musicvista.com` / 密码: `123456`
  - 用户2: `musiclover@example.com` / 密码: `123456`
  - 用户3: `rockfan@email.com` / 密码: `123456`

- **收藏数据** (`data/likes.json`) - 收藏记录
- **歌词数据** (`data/lyrics.json`) - 歌词信息和内容

## 🔧 开发脚本

```bash
# 开发模式（支持热重载）
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 清理构建文件
npm run clean
```

## 🌐 跨域配置

API支持以下跨域来源：
- `http://localhost:3000`
- `http://localhost:5173`
- `http://127.0.0.1:3000`
- `http://127.0.0.1:5173`
- `https://musicvista.space.minimaxi.com`

可以通过设置 `FRONTEND_URL` 环境变量来添加其他来源。

## 🛡️ 安全特性

- **Helmet** - 设置安全HTTP头
- **CORS** - 跨域资源共享控制
- **输入验证** - 使用express-validator进行输入验证
- **密码哈希** - 使用bcryptjs哈希密码
- **JWT认证** - 安全的令牌认证机制
- **错误处理** - 统一的错误处理和响应格式

## 📝 API响应格式

所有API响应都遵循统一的格式：

### 成功响应
```json
{
  "success": true,
  "message": "操作成功",
  "data": {
    // 具体数据
  }
}
```

### 错误响应
```json
{
  "success": false,
  "message": "错误信息",
  "error": {
    "code": "ERROR_CODE",
    "details": "详细错误信息"
  }
}
```

### 分页响应
```json
{
  "success": true,
  "message": "获取成功",
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

## 🚨 注意事项

1. **开发环境**：本项目使用模拟数据，适合开发测试使用
2. **生产环境**：部署到生产环境前需要：
   - 配置真实数据库
   - 更换所有默认密钥
   - 配置社交登录应用
   - 启用HTTPS
   - 设置适当的CORS策略
3. **密码安全**：所有用户密码都经过哈希处理
4. **API限制**：没有实现速率限制，生产环境建议添加

## 📞 技术支持

如有问题，请查看：
- API文档：http://localhost:3001/api
- 健康检查：http://localhost:3001/health
- 源代码注释和类型定义