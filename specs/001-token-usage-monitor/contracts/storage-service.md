# Storage Service Contract

**Feature**: 001-token-usage-monitor
**Version**: 1.0.0
**Status**: Final

## Overview

本文档定义了存储服务接口契约。存储服务负责管理IndexedDB中的所有数据操作。

---

## Interface Definition

```typescript
/**
 * 存储服务接口
 * 封装所有数据持久化操作
 */
interface StorageService {
  // ========== PlatformAccount ==========

  /**
   * 创建平台账户
   * @param account - 账户数据（不含id）
   * @returns Promise<PlatformAccount> - 创建的账户（含id）
   */
  createPlatformAccount(
    account: Omit<PlatformAccount, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<PlatformAccount>;

  /**
   * 获取所有平台账户
   * @returns Promise<PlatformAccount[]> - 账户列表
   */
  getAllPlatformAccounts(): Promise<PlatformAccount[]>;

  /**
   * 根据ID获取平台账户
   * @param id - 账户ID
   * @returns Promise<PlatformAccount | null> - 账户或null
   */
  getPlatformAccountById(id: string): Promise<PlatformAccount | null>;

  /**
   * 更新平台账户
   * @param id - 账户ID
   * @param updates - 更新数据
   * @returns Promise<PlatformAccount> - 更新后的账户
   * @throws {NotFoundError} - 账户不存在
   */
  updatePlatformAccount(
    id: string,
    updates: Partial<Omit<PlatformAccount, 'id' | 'createdAt'>>
  ): Promise<PlatformAccount>;

  /**
   * 删除平台账户（级联删除关联数据）
   * @param id - 账户ID
   * @returns Promise<void>
   * @throws {NotFoundError} - 账户不存在
   */
  deletePlatformAccount(id: string): Promise<void>;

  // ========== UsageRecord ==========

  /**
   * 创建使用记录
   * @param record - 记录数据（不含id）
   * @returns Promise<UsageRecord> - 创建的记录（含id）
   */
  createUsageRecord(
    record: Omit<UsageRecord, 'id'>
  ): Promise<UsageRecord>;

  /**
   * 批量创建使用记录
   * @param records - 记录数据数组
   * @returns Promise<UsageRecord[]> - 创建的记录数组
   */
  createUsageRecords(
    records: Array<Omit<UsageRecord, 'id'>>
  ): Promise<UsageRecord[]>;

  /**
   * 获取平台账户的最新使用记录
   * @param platformAccountId - 平台账户ID
   * @returns Promise<UsageRecord | null> - 最新记录或null
   */
  getLatestUsageRecord(platformAccountId: string): Promise<UsageRecord | null>;

  /**
   * 获取平台账户在指定时间范围内的使用记录
   * @param platformAccountId - 平台账户ID
   * @param startTime - 开始时间
   * @param endTime - 结束时间
   * @returns Promise<UsageRecord[]> - 记录列表（按时间升序）
   */
  getUsageRecordsByTimeRange(
    platformAccountId: string,
    startTime: Date,
    endTime: Date
  ): Promise<UsageRecord[]>;

  /**
   * 获取所有平台账户的最新使用记录
   * @returns Promise<Map<string, UsageRecord>> - 账户ID到记录的映射
   */
  getAllLatestUsageRecords(): Promise<Map<string, UsageRecord>>;

  /**
   * 清理过期的使用记录
   * @param retentionDays - 保留天数
   * @returns Promise<number> - 删除的记录数
   */
  cleanupOldUsageRecords(retentionDays: number): Promise<number>;

  // ========== ThresholdConfig ==========

  /**
   * 创建阈值配置
   * @param config - 配置数据（不含id）
   * @returns Promise<ThresholdConfig> - 创建的配置（含id）
   */
  createThresholdConfig(
    config: Omit<ThresholdConfig, 'id'>
  ): Promise<ThresholdConfig>;

  /**
   * 获取平台账户的阈值配置
   * @param platformAccountId - 平台账户ID
   * @returns Promise<ThresholdConfig | null> - 配置或null
   */
  getThresholdConfig(platformAccountId: string): Promise<ThresholdConfig | null>;

  /**
   * 获取所有阈值配置
   * @returns Promise<ThresholdConfig[]> - 配置列表
   */
  getAllThresholdConfigs(): Promise<ThresholdConfig[]>;

  /**
   * 更新阈值配置
   * @param platformAccountId - 平台账户ID
   * @param updates - 更新数据
   * @returns Promise<ThresholdConfig> - 更新后的配置
   * @throws {NotFoundError} - 配置不存在
   */
  updateThresholdConfig(
    platformAccountId: string,
    updates: Partial<Omit<ThresholdConfig, 'id' | 'platformAccountId'>>
  ): Promise<ThresholdConfig>;

  /**
   * 删除阈值配置
   * @param platformAccountId - 平台账户ID
   * @returns Promise<void>
   */
  deleteThresholdConfig(platformAccountId: string): Promise<void>;

  // ========== CredentialData ==========

  /**
   * 创建凭证数据
   * @param credential - 凭证数据（不含id）
   * @returns Promise<CredentialData> - 创建的凭证（含id）
   */
  createCredentialData(
    credential: Omit<CredentialData, 'id' | 'createdAt'>
  ): Promise<CredentialData>;

  /**
   * 获取平台账户的凭证数据
   * @param platformAccountId - 平台账户ID
   * @returns Promise<CredentialData | null> - 凭证或null
   */
  getCredentialData(platformAccountId: string): Promise<CredentialData | null>;

  /**
   * 更新凭证数据
   * @param platformAccountId - 平台账户ID
   * @param updates - 更新数据
   * @returns Promise<CredentialData> - 更新后的凭证
   * @throws {NotFoundError} - 凭证不存在
   */
  updateCredentialData(
    platformAccountId: string,
    updates: Partial<Omit<CredentialData, 'id' | 'platformAccountId' | 'createdAt'>>
  ): Promise<CredentialData>;

  /**
   * 删除凭证数据
   * @param platformAccountId - 平台账户ID
   * @returns Promise<void>
   */
  deleteCredentialData(platformAccountId: string): Promise<void>;

  /**
   * 更新凭证验证状态
   * @param platformAccountId - 平台账户ID
   * @param status - 新状态
   * @returns Promise<CredentialData> - 更新后的凭证
   */
  updateCredentialStatus(
    platformAccountId: string,
    status: CredentialStatus
  ): Promise<CredentialData>;

  // ========== Utility ==========

  /**
   * 清空所有数据（用于测试或重置）
   * @returns Promise<void>
   */
  clearAll(): Promise<void>;

  /**
   * 导出所有数据（JSON格式）
   * @returns Promise<string> - JSON字符串
   */
  exportData(): Promise<string>;

  /**
   * 导入数据（从JSON格式）
   * @param jsonData - JSON字符串
   * @returns Promise<void>
   * @throws {ImportError} - 数据格式无效
   */
  importData(jsonData: string): Promise<void>;

  /**
   * 获取数据库统计信息
   * @returns Promise<DatabaseStats> - 统计信息
   */
  getStats(): Promise<DatabaseStats>;
}

/**
 * 数据库统计信息
 */
interface DatabaseStats {
  platformAccountsCount: number;
  usageRecordsCount: number;
  thresholdConfigsCount: number;
  credentialDataCount: number;
  oldestRecordDate: string | null;
  newestRecordDate: string | null;
  databaseSize: number; // bytes
}
```

---

## Error Types

```typescript
/**
 * 存储服务错误基类
 */
class StorageError extends Error {
  constructor(
    message: string,
    public readonly code: string
  ) {
    super(message);
    this.name = 'StorageError';
  }
}

/**
 * 未找到错误
 */
class NotFoundError extends StorageError {
  constructor(entity: string, id: string) {
    super(`${entity} with id '${id}' not found`, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

/**
 * 唯一约束冲突错误
 */
class DuplicateError extends StorageError {
  constructor(entity: string, field: string, value: string) {
    super(`${entity} with ${field} '${value}' already exists`, 'DUPLICATE');
    this.name = 'DuplicateError';
  }
}

/**
 * 验证错误
 */
class ValidationError extends StorageError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

/**
 * 导入错误
 */
class ImportError extends StorageError {
  constructor(message: string) {
    super(message, 'IMPORT_ERROR');
    this.name = 'ImportError';
  }
}
```

---

## Behavior Specifications

### 1. PlatformAccount Operations

**createPlatformAccount()**
- 自动生成UUID作为id
- 自动设置createdAt和updatedAt为当前时间
- 验证platformName是有效的枚举值
- 验证accountLabel在同一平台下唯一
- 抛出DuplicateError如果标签冲突

**updatePlatformAccount()**
- 自动更新updatedAt为当前时间
- 抛出NotFoundError如果账户不存在
- 验证更新后的accountLabel唯一性

**deletePlatformAccount()**
- 级联删除关联的UsageRecord、ThresholdConfig、CredentialData
- 抛出NotFoundError如果账户不存在

### 2. UsageRecord Operations

**createUsageRecord()**
- 自动生成UUID作为id
- 验证platformAccountId存在
- 验证tokensUsed、tokensRemaining、quotaTotal的关系
- 自动按timestamp排序索引

**cleanupOldUsageRecords()**
- 删除timestamp早于保留期的记录
- 每个平台账户至少保留最新一条记录
- 返回实际删除的记录数

### 3. ThresholdConfig Operations

**createThresholdConfig()**
- 自动生成UUID作为id
- 自动设置updatedAt为当前时间
- 验证warningPercent < criticalPercent
- 每个平台账户只能有一个配置（抛出DuplicateError如果已存在）

**updateThresholdConfig()**
- 自动更新updatedAt为当前时间
- 验证warningPercent < criticalPercent

### 4. CredentialData Operations

**createCredentialData()**
- 自动生成UUID作为id
- 自动设置createdAt为当前时间
- encryptedValue必须是加密后的字符串
- 每个平台账户只能有一个凭证

**updateCredentialStatus()**
- 自动设置lastValidated为当前时间（如果状态变为valid或invalid）

---

## Data Validation Rules

### PlatformAccount

| 字段 | 验证规则 |
|------|----------|
| platformName | 必须是 'ark' \| 'zai' \| 'minimax' \| 'claude' |
| accountLabel | 1-50字符，同一平台下唯一 |
| limitType | 'daily' \| 'monthly' \| 'cumulative' |

### UsageRecord

| 字段 | 验证规则 |
|------|----------|
| platformAccountId | 必须引用存在的PlatformAccount |
| tokensUsed | >= 0，<= quotaTotal |
| tokensRemaining | >= 0 |
| quotaTotal | > 0 |
| timestamp | 有效的ISO 8601日期时间 |

### ThresholdConfig

| 字段 | 验证规则 |
|------|----------|
| platformAccountId | 必须引用存在的PlatformAccount |
| warningPercent | 0-100，< criticalPercent |
| criticalPercent | 0-100，> warningPercent |
| notificationsEnabled | boolean |

### CredentialData

| 字段 | 验证规则 |
|------|----------|
| platformAccountId | 必须引用存在的PlatformAccount |
| platformType | 'ark' \| 'zai' \| 'minimax' \| 'claude' |
| encryptedValue | 非空字符串 |
| validityStatus | 'valid' \| 'invalid' \| 'unknown' \| 'expired' |

---

## Implementation Template

```typescript
import Dexie, { Table } from 'dexie';
import {
  StorageService,
  NotFoundError,
  DuplicateError,
  ValidationError,
  ImportError
} from './types';

class TokenMonitorDatabase extends Dexie {
  platformAccounts!: Table<PlatformAccount>;
  usageRecords!: Table<UsageRecord>;
  thresholdConfigs!: Table<ThresholdConfig>;
  credentialData!: Table<CredentialData>;

  constructor() {
    super('TokenMonitorDB');
    this.version(1).stores({
      platformAccounts: 'id, platformName, [platformName+accountLabel]',
      usageRecords: 'id, platformAccountId, [platformAccountId+timestamp], timestamp',
      thresholdConfigs: 'id, platformAccountId',
      credentialData: 'id, platformAccountId'
    });
  }
}

class StorageServiceImpl implements StorageService {
  private db: TokenMonitorDatabase;

  constructor() {
    this.db = new TokenMonitorDatabase();
  }

  // PlatformAccount
  async createPlatformAccount(
    account: Omit<PlatformAccount, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<PlatformAccount> {
    const now = new Date().toISOString();
    const newAccount: PlatformAccount = {
      id: crypto.randomUUID(),
      ...account,
      createdAt: now,
      updatedAt: now
    };

    // Validate uniqueness
    const existing = await this.db.platformAccounts
      .where('[platformName+accountLabel]')
      .equals([account.platformName, account.accountLabel])
      .first();

    if (existing) {
      throw new DuplicateError('PlatformAccount', 'accountLabel', account.accountLabel);
    }

    await this.db.platformAccounts.add(newAccount);
    return newAccount;
  }

  async getAllPlatformAccounts(): Promise<PlatformAccount[]> {
    return await this.db.platformAccounts.toArray();
  }

  async getPlatformAccountById(id: string): Promise<PlatformAccount | null> {
    return await this.db.platformAccounts.get(id) ?? null;
  }

  async updatePlatformAccount(
    id: string,
    updates: Partial<Omit<PlatformAccount, 'id' | 'createdAt'>>
  ): Promise<PlatformAccount> {
    const existing = await this.getPlatformAccountById(id);
    if (!existing) {
      throw new NotFoundError('PlatformAccount', id);
    }

    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    await this.db.platformAccounts.put(updated);
    return updated;
  }

  async deletePlatformAccount(id: string): Promise<void> {
    const existing = await this.getPlatformAccountById(id);
    if (!existing) {
      throw new NotFoundError('PlatformAccount', id);
    }

    // Cascade delete
    await this.db.transaction('rw', [this.db.usageRecords, this.db.thresholdConfigs, this.db.credentialData], async () => {
      await this.db.usageRecords.where('platformAccountId').equals(id).delete();
      await this.db.thresholdConfigs.where('platformAccountId').equals(id).delete();
      await this.db.credentialData.where('platformAccountId').equals(id).delete();
      await this.db.platformAccounts.delete(id);
    });
  }

  // ... 其他方法实现
}

export const storageService = new StorageServiceImpl();
```

---

## Testing Requirements

### Unit Tests

每个方法必须包含以下测试：

1. **成功场景**
   - [ ] 正常操作返回预期结果
   - [ ] 自动字段（id、时间戳）正确生成

2. **错误场景**
   - [ ] NotFoundError在记录不存在时抛出
   - [ ] DuplicateError在唯一约束冲突时抛出
   - [ ] ValidationError在验证失败时抛出

3. **边界条件**
   - [ ] 空列表、null值处理
   - [ ] 大数据量性能测试

### Integration Tests

- [ ] 数据库迁移测试
- [ ] 事务回滚测试
- [ ] 导入/导出功能测试

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-03-03 | 初始版本 |
