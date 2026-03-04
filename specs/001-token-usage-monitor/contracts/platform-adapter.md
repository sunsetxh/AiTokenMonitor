# Platform Adapter Contract

**Feature**: 001-token-usage-monitor
**Version**: 1.0.0
**Status**: Final

## Overview

本文档定义了平台适配器接口契约。所有平台集成（Ark、Zai、MiniMax、Claude）必须实现此接口。

---

## Interface Definition

```typescript
/**
 * 平台适配器接口
 * 所有平台API集成必须实现此接口
 */
interface PlatformAdapter {
  /**
   * 平台名称（唯一标识符）
   */
  readonly name: PlatformType;

  /**
   * 获取平台显示名称（用于UI展示）
   */
  getDisplayName(): string;

  /**
   * 获取平台Logo URL
   */
  getLogoUrl(): string;

  /**
   * 验证API凭证是否有效
   * @param credentials - API凭证（已解密）
   * @returns Promise<boolean> - 凭证是否有效
   * @throws {ValidationError} - 凭证格式无效
   * @throws {NetworkError} - 网络请求失败
   */
  validateCredentials(credentials: string): Promise<boolean>;

  /**
   * 获取当前token使用情况
   * @param credentials - API凭证（已解密）
   * @returns Promise<UsageData> - 使用数据
   * @throws {AuthenticationError} - 认证失败
   * @throws {NetworkError} - 网络请求失败
   * @throws {RateLimitError} - 请求被限流
   */
  fetchUsage(credentials: string): Promise<UsageData>;

  /**
   * 获取配额限制类型
   * @returns LimitType - 限制类型
   */
  getLimitType(): LimitType;

  /**
   * 获取凭证格式要求
   * @returns CredentialFormat - 凭证格式描述
   */
  getCredentialFormat(): CredentialFormat;

  /**
   * 检查平台是否支持浏览器直接调用（CORS检查）
   * @returns Promise<boolean> - 是否支持
   */
  supportsDirectBrowserCall(): Promise<boolean>;
}

/**
 * 使用数据
 */
interface UsageData {
  /**
   * 已使用的token数量
   */
  tokensUsed: number;

  /**
   * 总配额
   */
  quotaTotal: number;

  /**
   * 剩余token数量
   */
  tokensRemaining: number;

  /**
   * 数据获取时间戳
   */
  timestamp: string;

  /**
   * 原始响应数据（用于调试）
   */
  rawResponse?: unknown;
}

/**
 * 凭证格式描述
 */
interface CredentialFormat {
  /**
   * 凭证类型
   */
  type: 'api_key' | 'bearer_token' | 'oauth' | 'basic_auth';

  /**
   * 凭证字段名称（UI展示）
   */
  label: string;

  /**
   * 输入提示
   */
  placeholder: string;

  /**
   * 是否需要额外参数（如：organization ID）
   */
  additionalFields?: Array<{
    key: string;
    label: string;
    placeholder: string;
    required: boolean;
  }>;

  /**
   * 凭证格式说明（Markdown）
   */
  description?: string;

  /**
   * 获取凭证的帮助链接
   */
  helpUrl?: string;
}

/**
 * 配额限制类型
 */
type LimitType = 'daily' | 'monthly' | 'cumulative';

/**
 * 平台类型
 */
type PlatformType = 'ark' | 'zai' | 'minimax' | 'claude';
```

---

## Error Types

```typescript
/**
 * 平台适配器错误基类
 */
class PlatformAdapterError extends Error {
  constructor(
    message: string,
    public readonly platform: PlatformType,
    public readonly code: string
  ) {
    super(message);
    this.name = 'PlatformAdapterError';
  }
}

/**
 * 认证错误 - 凭证无效或过期
 */
class AuthenticationError extends PlatformAdapterError {
  constructor(platform: PlatformType, message: string = '认证失败，请检查凭证') {
    super(message, platform, 'AUTH_FAILED');
    this.name = 'AuthenticationError';
  }
}

/**
 * 网络错误 - 请求失败
 */
class NetworkError extends PlatformAdapterError {
  constructor(
    platform: PlatformType,
    public readonly originalError: Error
  ) {
    super(`网络请求失败: ${originalError.message}`, platform, 'NETWORK_ERROR');
    this.name = 'NetworkError';
  }
}

/**
 * 限流错误 - 请求过于频繁
 */
class RateLimitError extends PlatformAdapterError {
  constructor(
    platform: PlatformType,
    public readonly retryAfter?: number
  ) {
    super(
      `请求过于频繁${retryAfter ? `，请在 ${retryAfter} 秒后重试` : ''}`,
      platform,
      'RATE_LIMITED'
    );
    this.name = 'RateLimitError';
  }
}

/**
 * 验证错误 - 凭证格式无效
 */
class ValidationError extends PlatformAdapterError {
  constructor(platform: PlatformType, message: string) {
    super(message, platform, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

/**
 * 响应解析错误 - API响应格式不符合预期
 */
class ParseError extends PlatformAdapterError {
  constructor(
    platform: PlatformType,
    public readonly rawResponse: string
  ) {
    super('API响应解析失败', platform, 'PARSE_ERROR');
    this.name = 'ParseError';
  }
}
```

---

## Behavior Specifications

### 1. validateCredentials()

**行为要求**:
- 必须发送一个轻量级的API请求来验证凭证
- 请求失败时应抛出适当的错误类型
- 不应消耗大量token配额

**成功条件**:
- 返回 `true` - 凭证有效
- 返回 `false` - 凭证无效（但不抛出错误）

**错误处理**:
| 错误类型 | 抛出条件 |
|----------|----------|
| ValidationError | 凭证格式不符合要求 |
| NetworkError | 网络连接失败 |
| AuthenticationError | 服务器返回401/403 |
| RateLimitError | 服务器返回429 |

### 2. fetchUsage()

**行为要求**:
- 必须返回完整的token使用信息
- 必须包含获取数据的时间戳
- 响应时间应在10秒内完成

**成功条件**:
- 返回 `UsageData` 对象
- `tokensUsed + tokensRemaining ≈ quotaTotal` (允许小的舍入误差)

**错误处理**:
| 错误类型 | 抛出条件 |
|----------|----------|
| AuthenticationError | 凭证已失效 |
| NetworkError | 网络连接失败 |
| RateLimitError | 请求被限流 |
| ParseError | 响应格式无法解析 |

### 3. getLimitType()

**行为要求**:
- 返回平台配额重置类型
- 返回值必须是 `LimitType` 之一

**平台预期**:
| 平台 | 预期类型 | 说明 |
|------|----------|------|
| Ark | 待确认 | 需查看API文档 |
| Zai | 待确认 | 需查看API文档 |
| MiniMax | 待确认 | 需查看API文档 |
| Claude | monthly | Claude API按月重置 |

### 4. getCredentialFormat()

**行为要求**:
- 返回凭证的UI展示格式信息
- 必须包含凭证类型、标签、占位符

**平台预期**:
| 平台 | 凭证类型 | 说明 |
|------|----------|------|
| Ark | api_key | API Key |
| Zai | api_key | API Key |
| MiniMax | api_key | API Key + Group ID |
| Claude | api_key | API Key (sk-ant-...) |

### 5. supportsDirectBrowserCall()

**行为要求**:
- 检查平台API是否支持CORS
- 返回 `true` 表示可从浏览器直接调用
- 返回 `false` 表示需要代理服务器

---

## Implementation Checklist

每个平台适配器实现必须满足：

- [ ] 实现 `PlatformAdapter` 接口的所有方法
- [ ] 导出适配器类和错误类型
- [ ] 包含单元测试（覆盖率 > 80%）
- [ ] 包含集成测试（使用测试凭证或mock）
- [ ] 提供API文档链接
- [ ] 提供测试/演示凭证获取说明

---

## Example Implementation Template

```typescript
import {
  PlatformAdapter,
  UsageData,
  LimitType,
  CredentialFormat,
  AuthenticationError,
  NetworkError,
  RateLimitError,
  ParseError
} from './types';

class ExampleAdapter implements PlatformAdapter {
  readonly name: PlatformType = 'example';

  getDisplayName(): string {
    return 'Example Platform';
  }

  getLogoUrl(): string {
    return '/logos/example.svg';
  }

  async validateCredentials(credentials: string): Promise<boolean> {
    try {
      const response = await fetch('https://api.example.com/verify', {
        headers: { 'Authorization': `Bearer ${credentials}` }
      });
      return response.ok;
    } catch (error) {
      if (error instanceof TypeError) {
        throw new NetworkError(this.name, error);
      }
      throw error;
    }
  }

  async fetchUsage(credentials: string): Promise<UsageData> {
    try {
      const response = await fetch('https://api.example.com/usage', {
        headers: { 'Authorization': `Bearer ${credentials}` }
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new AuthenticationError(this.name);
        }
        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After');
          throw new RateLimitError(this.name, retryAfter ? parseInt(retryAfter) : undefined);
        }
        throw new NetworkError(this.name, new Error(`HTTP ${response.status}`));
      }

      const data = await response.json();

      // Validate response structure
      if (typeof data.used !== 'number' || typeof data.total !== 'number') {
        throw new ParseError(this.name, JSON.stringify(data));
      }

      return {
        tokensUsed: data.used,
        quotaTotal: data.total,
        tokensRemaining: data.remaining,
        timestamp: new Date().toISOString(),
        rawResponse: data
      };
    } catch (error) {
      if (error instanceof PlatformAdapterError) {
        throw error;
      }
      throw new NetworkError(this.name, error as Error);
    }
  }

  getLimitType(): LimitType {
    return 'monthly';
  }

  getCredentialFormat(): CredentialFormat {
    return {
      type: 'api_key',
      label: 'API Key',
      placeholder: 'sk-xxxxxxxxxxxxxxxx',
      description: '在平台控制台获取API Key',
      helpUrl: 'https://example.com/docs/api-keys'
    };
  }

  async supportsDirectBrowserCall(): Promise<boolean> {
    try {
      const response = await fetch('https://api.example.com/usage', {
        method: 'HEAD',
        mode: 'cors'
      });
      return true;
    } catch {
      return false;
    }
  }
}

export default ExampleAdapter;
```

---

## Testing Requirements

### Unit Tests

每个适配器必须包含以下测试：

1. **validateCredentials()**
   - [ ] 有效凭证返回 `true`
   - [ ] 无效凭证返回 `false` 或抛出 `AuthenticationError`
   - [ ] 网络错误抛出 `NetworkError`

2. **fetchUsage()**
   - [ ] 正常响应返回正确的 `UsageData`
   - [ ] 401/403 抛出 `AuthenticationError`
   - [ ] 429 抛出 `RateLimitError`
   - [ ] 网络错误抛出 `NetworkError`
   - [ ] 格式错误抛出 `ParseError`

3. **getLimitType()**
   - [ ] 返回有效的 `LimitType` 值

4. **getCredentialFormat()**
   - [ ] 返回有效的 `CredentialFormat` 对象

### Integration Tests

- [ ] 使用真实凭证（或测试环境）进行端到端测试
- [ ] 验证响应数据准确性
- [ ] 测试限流场景

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-03-03 | 初始版本 |
