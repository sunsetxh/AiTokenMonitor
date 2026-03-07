#!/bin/bash
# AI Token Monitor 一键部署脚本

set -e

echo "=== AI Token Monitor 部署脚本 ==="

# 1. 构建前端
echo "[1/4] 构建前端..."
npm run build

# 2. 复制前端文件到 server/dist
echo "[2/4] 复制前端文件..."
cp -r dist/* server/dist/

# 3. 创建部署包
echo "[3/4] 创建部署包..."
DEPLOY_DIR="deploy-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$DEPLOY_DIR"

# 复制必要文件
cp -r server/dist "$DEPLOY_DIR/server"
cp server/package.json "$DEPLOY_DIR/"

# 创建数据库目录
mkdir -p "$DEPLOY_DIR/server/data"

# 创建启动脚本
cat > "$DEPLOY_DIR/start.sh" << 'SCRIPT'
#!/bin/bash
cd "$(dirname "$0")"
export NODE_ENV=production
export PORT=3001
export DB_PATH="$(pwd)/server/data/monitor.db"
node server/dist/index.js
SCRIPT
chmod +x "$DEPLOY_DIR/start.sh"

# 创建 tar.gz 包
DEPLOY_FILE="ai-token-monitor-deploy.tar.gz"
tar --exclude='*.map' --exclude='.git' -czf "$DEPLOY_FILE" "$DEPLOY_DIR"
rm -rf "$DEPLOY_DIR"

echo "=== 部署完成 ==="
echo "部署包: $DEPLOY_FILE"
echo ""
echo "使用方法:"
echo "  1. 解压: tar xzf $DEPLOY_FILE"
echo "  2. 进入目录: cd deploy-YYYYMMDD-XXXXXX"
echo "  3. 安装依赖: npm install && cd server && npm install"
echo "  4. 启动: ./start.sh"
echo ""
echo "或直接运行:"
echo "  NODE_ENV=production PORT=3001 node server/dist/index.js"
