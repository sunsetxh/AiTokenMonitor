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

### 构建生产版本

```bash
npm run build
```

## 技术栈

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Dexie.js (IndexedDB)
- Recharts

## 项目结构

```
src/
├── components/     # React 组件
├── services/      # 业务逻辑
├── models/        # 类型定义
├── utils/        # 工具函数
└── contexts/     # React Context
```

## License

MIT
