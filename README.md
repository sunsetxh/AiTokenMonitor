# AI Token Monitor

多平台 AI Token 使用量监控工具。

## 功能特性

- **统一仪表板**: 实时查看所有平台的 API Token 使用情况
- **凭证管理**: 安全存储和加密管理各平台 API 凭证
- **阈值警告**: 可配置的使用量阈值提醒
- **趋势分析**: 历史使用数据可视化分析

## 支持平台

- Zai
- MiniMax

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173

### 运行生产版本

```bash
# 构建前端
npm run build

# 启动服务（从项目根目录）
NODE_ENV=production PORT=3001 node server/dist/index.js
```

服务将在 http://localhost:3001 运行

### 部署到服务器

#### 方式一：使用部署脚本（一键）

```bash
# 运行部署脚本
./scripts/deploy.sh

# 部署包会生成 ai-token-monitor-deploy.tar.gz
```

#### 方式二：手动部署

1. 复制项目到服务器
2. 安装依赖：`npm install && cd server && npm install`
3. 构建：`npm run build`
4. 启动服务：
   ```bash
   NODE_ENV=production PORT=3001 nohup node server/dist/index.js > app.log 2>&1 &
   ```

## 技术栈

- React 18 + TypeScript
- Vite
- Tailwind CSS
- SQLite (better-sqlite3)
- Recharts

## 项目结构

```
src/
├── components/     # React 组件
├── services/      # 业务逻辑
├── models/        # 类型定义
├── utils/        # 工具函数
└── contexts/     # React Context

server/
├── src/          # Express 后端源码
└── dist/         # 编译后的后端代码

scripts/
└── deploy.sh     # 一键部署脚本
```

## License

MIT
