# Technical Research: Multi-Platform AI Token Usage Monitor

**Feature**: 001-token-usage-monitor
**Date**: 2026-03-03
**Status**: Complete

## Overview

本文档记录了多平台AI Token监控工具的技术选型研究结果。针对每个关键技术决策，我们评估了多个选项并选择了最适合项目需求的方案。

---

## 1. Frontend Framework

### Decision: React 18+ with TypeScript

**Rationale**:
- **生态成熟**: React拥有最大的生态系统，提供丰富的UI组件库和工具链
- **类型安全**: TypeScript结合React提供优秀的开发体验和类型检查
- **学习资源**: 丰富的学习资源和社区支持
- **性能**: React 18的并发特性适合处理多个平台API并发请求的场景
- **未来兼容**: React是最流行的前端框架之一，长期维护有保障

**Alternatives Considered**:
- **Vue 3**: 语法更简洁，但生态规模略小于React，对于中小型个人项目也是不错的选择
- **Svelte**: 编译时框架，运行时性能更好，但生态较小，学习曲线较陡
- **Vanilla JS**: 无框架依赖，但代码量更大，状态管理更复杂

---

## 2. HTTP Client

### Decision: Fetch API with Axios as Fallback

**Rationale**:
- **原生支持**: Fetch API是现代浏览器原生支持的标准，无需额外依赖
- **轻量级**: 对于简单的API调用，fetch API足够使用
- **Promise-based**: 与async/await语法配合良好

**Axios作为备选**用于需要更复杂功能的场景：
- 自动请求取消
- 请求/响应拦截器
- 超时处理
- 更好的错误处理

**Alternatives Considered**:
- **Ky**: 轻量级fetch封装，API更简洁，但生态较小
- **Got**: 主要用于Node.js环境，浏览器端需要额外配置

---

## 3. Chart Library

### Decision: Recharts

**Rationale**:
- **React原生**: Recharts是为React设计的图表库，组件化API更符合React开发模式
- **声明式**: 声明式API使代码更易读和维护
- **基于D3**: 底层使用D3.js，功能强大且性能优秀
- **类型支持**: 对TypeScript支持良好
- **适合场景**: 项目主要需要简单的折线图和柱状图来展示趋势，Recharts完全满足需求

**Alternatives Considered**:
- **Chart.js**: 功能全面，但不是React原生，需要react-chartjs-2封装
- **ECharts**: 功能非常强大，但对于简单场景来说过于重量级
- **D3.js**: 最灵活，但学习曲线陡峭，开发成本高

---

## 4. Data Storage

### Decision: IndexedDB with Dexie.js Wrapper

**Rationale**:
- **存储容量**: IndexedDB支持大容量存储（通常几百MB），适合存储30天的历史数据
- **异步API**: 非阻塞操作，不影响UI响应
- **索引查询**: 支持索引查询，便于按时间、平台等条件筛选数据
- **Dexie.js**: 提供Promise-based API，比原生IndexedDB API更易用

**Storage Schema**:
- `platform_accounts`: 存储平台账户配置
- `usage_records`: 存储历史使用记录
- `threshold_configs`: 存储阈值配置

**Alternatives Considered**:
- **localStorage**: 容量限制（通常5-10MB），不适合存储历史数据
- **SessionStorage**: 数据在会话结束即清除，不符合需求
- **OPFS (Origin Private File System)**: 较新API，浏览器兼容性有限

---

## 5. Build Tool

### Decision: Vite

**Rationale**:
- **开发体验**: 极快的冷启动和热模块替换(HMR)
- **原生支持**: 对TypeScript、React、JSX等开箱即用
- **插件生态**: 丰富的插件系统，易于扩展
- **生产优化**: 自动代码分割、Tree-shaking等优化
- **行业标准**: Vite已成为现代前端构建工具的事实标准

**Alternatives Considered**:
- **Webpack**: 配置复杂，构建速度较慢
- **esbuild**: 极快但功能相对简单，生态较小
- **Rollup**: 主要用于库打包，应用开发配置较繁琐

---

## 6. State Management

### Decision: React Context + Hooks (Zustand可选)

**Rationale**:
- **轻量级**: 对于个人工具项目，Context + Hooks足够使用
- **简单**: 无需引入额外依赖，降低复杂度
- **性能**: React 18的useTransition和自动批处理优化了Context的性能

**如需更复杂的状态管理**，可考虑Zustand：
- 更简洁的API
- 更好的性能（不触发不必要的重渲染）
- 内置DevTools

**Alternatives Considered**:
- **Redux**: 对于此项目过于复杂，样板代码多
- **MobX**: 学习曲线较陡，响应式范式可能与React理念冲突
- **Recoil**: Facebook实验性项目，长期维护不确定性

---

## 7. CSS Framework

### Decision: Tailwind CSS

**Rationale**:
- **快速开发**: Utility-first CSS大幅加快UI开发速度
- **一致性**: 设计系统一致性更好
- **按需生成**: 只打包使用的CSS，生产体积小
- **深色模式**: 内置深色模式支持，适合长时间监控使用

**Alternatives Considered**:
- **CSS Modules**: 需要手写更多CSS，开发速度较慢
- **Styled Components**: 运行时CSS生成，有性能开销
- **Bootstrap**: 预设样式过于固定，定制性差

---

## 8. Platform API Integration Strategy

### Decision: Adapter Pattern with Base Interface

**Rationale**:
- **统一接口**: 定义统一的平台接口，便于扩展新平台
- **隔离变化**: 各平台API差异被封装在各自adapter中
- **易于测试**: 可以mock接口进行单元测试

**Base Interface**:
```typescript
interface PlatformAdapter {
  name: string;
  fetchUsage(credentials: CredentialData): Promise<UsageData>;
  validateCredentials(credentials: CredentialData): Promise<boolean>;
  getLimitType(): LimitType; // daily/monthly/cumulative
}
```

**Platform-specific Implementation**:
- `ArkAdapter`: Ark平台API集成
- `ZaiAdapter`: Zai平台API集成
- `MiniMaxAdapter`: MiniMax平台API集成
- `ClaudeAdapter`: Claude平台API集成

**CORS Consideration**:
- 如果平台API不支持浏览器跨域请求，可能需要：
  1. 使用代理服务器
  2. 浏览器扩展
  3. 本地开发服务器（不推荐生产使用）

---

## 9. Security Considerations

### Decision: Browser Native Crypto API for Credential Encryption

**Rationale**:
- **本地加密**: API密钥在存储前使用用户提供的密码或浏览器生成的密钥加密
- **零知识**: 服务器端（如果有）不接触明文凭证
- **Web Crypto API**: 浏览器原生加密API，性能好且安全

**Alternatives Considered**:
- **明文存储**: 不安全，风险高
- **第三方加密库**: 增加依赖，原生API足够使用

---

## 10. Testing Strategy

### Decision: Vitest + React Testing Library + Playwright

**Rationale**:
- **Vitest**: 与Vite深度集成，快速且兼容Jest API
- **React Testing Library**: 测试用户行为而非实现细节
- **Playwright**: 端到端测试，确保关键流程可用

**Alternatives Considered**:
- **Jest**: 配置较复杂，与Vite集成不如Vitest
- **Cypress**: 更成熟但比Playwright重

---

## Summary

| Category | Choice | Key Benefits |
|----------|--------|--------------|
| Frontend Framework | React 18 + TypeScript | 成熟生态，类型安全 |
| HTTP Client | Fetch API + Axios | 原生支持，功能全面 |
| Chart Library | Recharts | React原生，声明式API |
| Storage | IndexedDB + Dexie.js | 大容量，结构化查询 |
| Build Tool | Vite | 快速开发体验 |
| State Management | React Context + Hooks | 轻量简单 |
| CSS Framework | Tailwind CSS | 快速UI开发 |
| Platform Integration | Adapter Pattern | 易扩展，隔离变化 |
| Security | Web Crypto API | 浏览器原生加密 |
| Testing | Vitest + RTL + Playwright | 全面测试覆盖 |

---

## Open Questions for Implementation

1. **CORS问题**: 需要确认各平台API是否支持浏览器跨域请求，如果不支持需要解决方案
2. **API文档**: 需要获取各平台（Ark、Zai、MiniMax、Claude）的API文档来了解如何查询token使用情况
3. **认证方式**: 需要确认各平台的认证方式（API Key、OAuth、Bearer Token等）
