# Quick Start Guide: Multi-Platform AI Token Usage Monitor

**Feature**: 001-token-usage-monitor
**Version**: 1.0.0
**Last Updated**: 2026-03-03

## Overview

本文档提供快速上手指南，帮助开发者快速搭建开发环境并运行项目。

---

## Prerequisites

### Required Software

| 软件 | 最低版本 | 推荐版本 | 说明 |
|------|----------|----------|------|
| Node.js | 18.0.0 | 20.x LTS | JavaScript运行时 |
| npm | 9.0.0 | 10.x | 包管理器（或使用 pnpm/yarn） |
| Git | 2.30 | 最新版 | 版本控制 |

### 浏览器要求

| 浏览器 | 最低版本 | 说明 |
|--------|----------|------|
| Chrome | 90+ | 推荐用于开发 |
| Firefox | 88+ | 支持 |
| Safari | 14+ | 支持 |
| Edge | 90+ | 支持 |

---

## Project Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd monitor
```

### 2. Install Dependencies

```bash
npm install
```

**主要依赖**:
- `react` - UI框架
- `react-dom` - React DOM
- `typescript` - TypeScript支持
- `vite` - 构建工具
- `dexie` - IndexedDB ORM
- `recharts` - 图表库
- `tailwindcss` - CSS框架

### 3. Development Server

```bash
npm run dev
```

访问 `http://localhost:5173` 查看应用。

---

## Project Structure

```
monitor/
├── src/
│   ├── components/          # React组件
│   │   ├── dashboard/       # 仪表板组件
│   │   ├── credentials/     # 凭证管理组件
│   │   ├── trends/          # 趋势图组件
│   │   └── common/          # 通用组件
│   ├── services/            # 业务逻辑服务
│   │   ├── platform/        # 平台适配器
│   │   ├── storage/         # 存储服务
│   │   └── crypto/          # 加密服务
│   ├── models/              # 数据类型定义
│   ├── utils/               # 工具函数
│   ├── App.tsx              # 主应用组件
│   └── main.tsx             # 入口文件
├── tests/                   # 测试文件
├── public/                  # 静态资源
└── specs/                   # 规范文档
```

---

## Development Workflow

### 创建新平台适配器

```bash
# 1. 在 src/services/platform/ 下创建新文件
touch src/services/platform/newplatform.ts

# 2. 实现平台接口
# 参考 contracts/platform-adapter.md

# 3. 注册平台
# 编辑 src/services/platform/index.ts
```

**模板**:

```typescript
import { PlatformAdapter, UsageData, LimitType, CredentialFormat } from './types';

class NewPlatformAdapter implements PlatformAdapter {
  readonly name = 'newplatform';

  getDisplayName(): string {
    return 'New Platform';
  }

  getLogoUrl(): string {
    return '/logos/newplatform.svg';
  }

  async validateCredentials(credentials: string): Promise<boolean> {
    // 实现凭证验证逻辑
    const response = await fetch('https://api.newplatform.com/verify', {
      headers: { 'Authorization': `Bearer ${credentials}` }
    });
    return response.ok;
  }

  async fetchUsage(credentials: string): Promise<UsageData> {
    // 实现获取使用数据逻辑
    const response = await fetch('https://api.newplatform.com/usage', {
      headers: { 'Authorization': `Bearer ${credentials}` }
    });
    const data = await response.json();

    return {
      tokensUsed: data.used,
      quotaTotal: data.total,
      tokensRemaining: data.remaining,
      timestamp: new Date().toISOString()
    };
  }

  getLimitType(): LimitType {
    return 'monthly';
  }

  getCredentialFormat(): CredentialFormat {
    return {
      type: 'api_key',
      label: 'API Key',
      placeholder: 'sk-xxxxxxxxxxxxxxxx',
      helpUrl: 'https://newplatform.com/docs/api-keys'
    };
  }

  async supportsDirectBrowserCall(): Promise<boolean> {
    // 测试CORS支持
    try {
      await fetch('https://api.newplatform.com/usage', { method: 'HEAD', mode: 'cors' });
      return true;
    } catch {
      return false;
    }
  }
}

export default new NewPlatformAdapter();
```

### 添加新的UI组件

```bash
# 1. 创建组件目录
mkdir -p src/components/newfeature

# 2. 创建组件文件
touch src/components/newfeature/NewFeature.tsx
touch src/components/newfeature/NewFeature.test.tsx
```

**组件模板**:

```typescript
import React from 'react';

interface NewFeatureProps {
  // 定义props
}

export const NewFeature: React.FC<NewFeatureProps> = (props) => {
  return (
    <div className="new-feature">
      {/* 组件内容 */}
    </div>
  );
};

export default NewFeature;
```

---

## Testing

### 运行所有测试

```bash
npm run test
```

### 运行特定测试

```bash
npm run test -- platform/ark.test.ts
```

### 测试覆盖率

```bash
npm run test:coverage
```

### E2E测试

```bash
npm run test:e2e
```

---

## Building for Production

### 构建

```bash
npm run build
```

构建产物在 `dist/` 目录。

### 预览构建结果

```bash
npm run preview
```

---

## Environment Variables

创建 `.env.local` 文件（可选）:

```bash
# API配置
VITE_API_TIMEOUT=10000
VITE_FETCH_INTERVAL=300000

# 存储配置
VITE_RETENTION_DAYS=90

# 开发模式
VITE_DEBUG=true
```

---

## Troubleshooting

### 问题：无法连接到平台API

**可能原因**:
- CORS限制
- 凭证无效
- 网络问题

**解决方案**:
1. 检查平台是否支持CORS
2. 验证API凭证是否正确
3. 查看浏览器控制台错误信息

### 问题：数据未保存

**可能原因**:
- IndexedDB被禁用
- 浏览器隐私模式

**解决方案**:
1. 确认浏览器支持IndexedDB
2. 退出隐私模式
3. 检查存储配额

### 问题：图表不显示

**可能原因**:
- 无历史数据
- 时间范围设置不当

**解决方案**:
1. 确认已有usage records
2. 调整时间范围筛选

---

## Development Tips

1. **使用React DevTools**: 安装浏览器扩展调试React组件
2. **使用Dexie DevTools**: 查看IndexedDB数据
3. **启用详细日志**: 设置 `VITE_DEBUG=true`
4. **热重载**: Vite支持HMR，修改代码自动刷新

---

## Next Steps

- 阅读 [数据模型文档](./data-model.md)
- 查看 [平台适配器契约](./contracts/platform-adapter.md)
- 了解 [存储服务契约](./contracts/storage-service.md)

---

## Resources

- [React文档](https://react.dev)
- [TypeScript文档](https://www.typescriptlang.org/docs)
- [Vite文档](https://vitejs.dev)
- [Dexie.js文档](https://dexie.org)
- [Recharts文档](https://recharts.org)
- [Tailwind CSS文档](https://tailwindcss.com)
