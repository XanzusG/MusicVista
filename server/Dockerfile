# 服务器 Dockerfile
# Express 服务器应用

FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 安装系统依赖
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    curl

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装所有依赖（包括 devDependencies，因为需要构建）
RUN npm ci && npm cache clean --force

# 复制源代码和配置文件
COPY . .

# 构建应用
RUN npm run build

# 删除 devDependencies 减小镜像大小
RUN npm prune --production

# 创建非 root 用户
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# 设置权限
RUN chown -R nodejs:nodejs /app
USER nodejs

# 暴露端口（修改为正确的 3001）
EXPOSE 3001

# 健康检查（使用 curl 检查 /health 端点）
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:3001/health || exit 1

# 启动应用
CMD ["npm", "start"]