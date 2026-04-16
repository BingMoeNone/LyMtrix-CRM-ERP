# 统一业务引擎设计

> 本文档详细描述统一业务引擎的设计方案，包括核心模块、规则引擎、插件化架构、安全设计。

---

## 1. 背景与设计目标

### 1.1 为什么需要统一业务引擎

当前企业软件中的常见问题：

| 问题 | 描述 |
|------|------|
| 多数据入口 | 前端、API、脚本都可以直接操作数据库，数据安全无法保障 |
| 规则分散 | 业务规则分散在各个模块，难以统一维护和审计 |
| AI失控风险 | AI可能绕过业务逻辑直接操作数据 |

### 1.2 设计目标

```
┌─────────────────────────────────────────────────────────────┐
│                    统一业务引擎三大目标                       │
├─────────────────────────────────────────────────────────────┤
│  1. 单一入口：全系统只有业务引擎可以操作数据库                 │
│                                                             │
│  2. 规则固化：所有业务规则提前定义，不允许动态修改            │
│                                                             │
│  3. 全链路审计：所有操作全程留痕，可追溯可复盘                │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. 引擎核心模块

### 2.1 整体架构

```
┌─────────────────────────────────────────────────────────────┐
│                     统一业务引擎                              │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐    │
│  │                  引擎核心底座                        │    │
│  │  ┌───────────┐ ┌───────────┐ ┌───────────┐        │    │
│  │  │ 统一数据  │ │ 全局权限  │ │ 全链路    │        │    │
│  │  │ 访问模块  │ │ 管控模块  │ │ 审计模块  │        │    │
│  │  └───────────┘ └───────────┘ └───────────┘        │    │
│  └─────────────────────────────────────────────────────┘    │
│                           │                                 │
│                           ▼                                 │
│  ┌─────────────────────────────────────────────────────┐    │
│  │               标准化业务规则引擎                     │    │
│  │  ┌───────────┐ ┌───────────┐ ┌───────────┐        │    │
│  │  │ 客户管理  │ │ 订单履约  │ │ 库存进销  │        │    │
│  │  │  规则集   │ │  规则集   │ │  规则集   │        │    │
│  │  └───────────┘ └───────────┘ └───────────┘        │    │
│  └─────────────────────────────────────────────────────┘    │
│                           │                                 │
│                           ▼                                 │
│  ┌─────────────────────────────────────────────────────┐    │
│  │               行业专属规则插件库                     │    │
│  │  ┌───────────┐ ┌───────────┐ ┌───────────┐        │    │
│  │  │ 外贸报关  │ │ 电商平台  │ │ 小商品    │        │    │
│  │  │  插件     │ │  同步插件  │ │  多SKU插件│        │    │
│  │  └───────────┘ └───────────┘ └───────────┘        │    │
│  └─────────────────────────────────────────────────────┘    │
│                           │                                 │
│                           ▼                                 │
│  ┌─────────────────────────────────────────────────────┐    │
│  │               规则执行与校验器                       │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 引擎核心底座

#### 2.2.1 统一数据访问模块

```typescript
// 统一数据访问接口
interface IDataAccess {
  // 查询操作
  query<T>(entity: string, params: QueryParams): Promise<T[]>;

  // 单条查询
  find<T>(entity: string, id: string): Promise<T | null>;

  // 创建操作
  create<T>(entity: string, data: CreateData<T>): Promise<T>;

  // 更新操作
  update<T>(entity: string, id: string, data: UpdateData<T>): Promise<T>;

  // 删除操作（软删除）
  delete<T>(entity: string, id: string): Promise<void>;
}

// 所有数据库操作必须通过此接口
class UnifiedDataAccess implements IDataAccess {
  async query<T>(entity: string, params: QueryParams): Promise<T[]> {
    // 1. 权限检查
    // 2. 审计日志
    // 3. 执行查询
    // 4. 数据脱敏
    // 5. 返回结果
  }
}
```

#### 2.2.2 全局权限管控模块

```typescript
// 权限检查
class PermissionController {
  async check(userId: string, operation: Operation): Promise<boolean> {
    // 1. 获取用户角色
    const roles = await this.getUserRoles(userId);

    // 2. 获取操作要求的权限
    const required = this.getRequiredPermission(operation);

    // 3. 权限匹配
    return this.matchRoles(roles, required);
  }

  // 数据级权限
  async checkDataAccess(userId: string, entity: string, recordId: string): Promise<boolean> {
    // 检查用户是否有权访问该条数据
    // 例如：只能查看自己公司的客户数据
  }
}
```

#### 2.2.3 全链路审计模块

```typescript
// 审计日志
interface AuditLog {
  id: string;
  timestamp: Date;
  userId: string;
  operation: string;
  entity: string;
  entityId: string;
  before: object | null;  // 变更前数据
  after: object | null;   // 变更后数据
  ip: string;
  userAgent: string;
  result: 'success' | 'failure';
  errorMessage?: string;
}

// 审计日志不可篡改
class AuditLogger {
  async log(entry: AuditLog): Promise<void> {
    // 写入单独的审计数据库（追加写入，不可修改）
    await this.auditDb.insert(entry);
  }
}
```

---

## 3. 标准化业务规则引擎

### 3.1 规则定义格式

```json
{
  "rule_id": "customer.create.validation",
  "name": "客户创建校验规则",
  "description": "创建客户时必须满足的校验条件",
  "entity": "customer",
  "operation": "create",
  "conditions": [
    {
      "field": "name",
      "operator": "required",
      "message": "客户名称不能为空"
    },
    {
      "field": "phone",
      "operator": "pattern",
      "value": "^1[3-9]\\d{9}$",
      "message": "手机号格式不正确"
    },
    {
      "field": "credit_limit",
      "operator": "range",
      "min": 0,
      "max": 10000000,
      "message": "信用额度必须在0-1000万之间"
    }
  ],
  "error_level": "reject"  // reject | warn
}
```

### 3.2 规则执行器

```typescript
// 规则执行器
class RuleExecutor {
  async execute(ruleId: string, context: RuleContext): Promise<RuleResult> {
    const rule = await this.ruleRegistry.get(ruleId);

    // 1. 加载规则
    // 2. 评估条件
    // 3. 返回结果
    return this.evaluate(rule, context);
  }

  // 批量执行规则
  async executeBatch(ruleIds: string[], context: RuleContext): Promise<RuleResult[]> {
    return Promise.all(ruleIds.map(id => this.execute(id, context)));
  }
}
```

### 3.3 核心规则集

#### 客户管理规则

| 规则ID | 说明 | 触发条件 |
|--------|------|----------|
| `customer.create.validation` | 创建客户校验 | 创建客户时 |
| `customer.exists.validation` | 客户存在校验 | 查询客户相关操作时 |
| `customer.update.validation` | 更新客户校验 | 更新客户时 |
| `customer.delete.validation` | 删除客户校验 | 删除客户时 |

#### 订单管理规则

| 规则ID | 说明 | 触发条件 |
|--------|------|----------|
| `order.create.validation` | 创建订单校验 | 创建订单时 |
| `order.customer_validation` | 订单客户校验 | 客户是否存在、状态是否正常 |
| `order.inventory_validation` | 订单库存校验 | 库存是否充足 |
| `order.price_validation` | 订单价格校验 | 价格是否符合定价规则 |
| `order.update.validation` | 更新订单校验 | 更新订单状态时 |

#### 库存管理规则

| 规则ID | 说明 | 触发条件 |
|--------|------|----------|
| `inventory.check.validation` | 库存查询校验 | 查询库存时 |
| `inventory.reserve.validation` | 库存预留校验 | 预留库存时 |
| `inventory.reserve_execute` | 库存预留执行 | 确认预留时 |
| `inventory.release.validation` | 库存释放校验 | 释放库存时 |

---

## 4. 行业专属规则插件库

### 4.1 插件架构

```
┌─────────────────────────────────────────────────────────────┐
│                    插件化架构                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    │
│   │   核心引擎   │◄──►│  插件接口   │◄──►│  行业插件   │    │
│   │  (不可修改) │    │  (标准契约) │    │  (可扩展)   │    │
│   └─────────────┘    └─────────────┘    └─────────────┘    │
│                                             │               │
│                           ┌─────────────────┼───────────┐  │
│                           ▼                 ▼           ▼  │
│                    ┌───────────┐    ┌───────────┐ ┌─────┐│
│                    │ 外贸报关  │    │ 电商同步  │ │小商品││
│                    │   插件    │    │   插件    │ │多SKU ││
│                    └───────────┘    └───────────┘ └─────┘│
└─────────────────────────────────────────────────────────────┘
```

### 4.2 插件接口定义

```typescript
// 行业插件接口
interface IndustryPlugin {
  // 插件标识
  pluginId: string;
  pluginName: string;
  version: string;

  // 行业专属规则
  rules: BusinessRule[];

  // 生命周期钩子
  beforeExecute?(context: RuleContext): Promise<void>;
  afterExecute?(context: RuleContext, result: RuleResult): Promise<void>;

  // 插件初始化
  initialize(config: PluginConfig): Promise<void>;
}

// 插件注册
class PluginRegistry {
  register(plugin: IndustryPlugin): void;
  unregister(pluginId: string): void;
  getPlugin(pluginId: string): IndustryPlugin | null;
  getAllRules(): BusinessRule[];
}
```

### 4.3 行业插件示例

#### 外贸报关插件

```json
{
  "pluginId": "foreign_trade_customs",
  "pluginName": "外贸报关规则插件",
  "version": "1.0.0",
  "rules": [
    {
      "rule_id": "customs.declaration_validation",
      "name": "报关单校验",
      "conditions": [
        { "field": "customs_code", "operator": "required" },
        { "field": "hs_code", "operator": "required" },
        { "field": "declared_value", "operator": "min", "value": 0 }
      ]
    },
    {
      "rule_id": "customs.license_validation",
      "name": "进出口许可证校验",
      "conditions": [
        { "field": "license_required", "operator": "equals", "value": true },
        { "field": "license_number", "operator": "required" }
      ]
    }
  ]
}
```

#### 小商品多SKU插件

```json
{
  "pluginId": "commodity_multi_sku",
  "pluginName": "小商品多SKU规则插件",
  "version": "1.0.0",
  "rules": [
    {
      "rule_id": "sku.variant_validation",
      "name": "SKU变体校验",
      "conditions": [
        { "field": "parent_sku", "operator": "required" },
        { "field": "variant_attributes", "operator": "required" },
        { "field": "variant_price", "operator": "range", "min": 0.01 }
      ]
    },
    {
      "rule_id": "sku.stock_aggregation",
      "name": "库存聚合计算",
      "description": "自动计算父SKU总库存"
    }
  ]
}
```

---

## 5. 规则执行与校验器

### 5.1 校验器架构

```
请求进入
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│  1. 规则匹配                                                 │
│     → 根据操作类型匹配对应的规则集                            │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│  2. 规则排序                                                 │
│     → 按优先级排序，确保执行顺序                              │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│  3. 逐条执行                                                 │
│     → 条件评估，返回校验结果                                  │
└─────────────────────────────────────────────────────────────┘
    │
    ├──────────────────┬──────────────────┐
    ▼                  ▼                  ▼
┌─────────┐      ┌─────────┐      ┌─────────┐
│  通过   │      │  拒绝   │      │  警告   │
└────┬────┘      └────┬────┘      └────┬────┘
     │                │                │
     ▼                ▼                ▼
  继续执行         终止执行        记录警告
                                   但继续执行
```

### 5.2 校验结果处理

| 结果类型 | 处理方式 |
|----------|----------|
| **通过** | 继续执行下一个规则或操作 |
| **拒绝** | 终止操作，返回拒绝原因 |
| **警告** | 记录警告，继续执行（可配置为拒绝） |

---

## 6. 设计原则详解

### 6.1 单一入口原则

```
所有数据操作入口 = 业务引擎
无任何旁路可以绕过业务引擎直接操作数据库

┌─────────────────────────────────────────────────────────────┐
│                          数据库                              │
│                    (只有业务引擎可写)                         │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │
         ┌────────────────────┼────────────────────┐
         │                    │                    │
         ▼                    ▼                    ▼
   ┌───────────┐        ┌───────────┐        ┌───────────┐
   │  规则引擎  │        │  审计模块  │        │  权限模块  │
   └───────────┘        └───────────┘        └───────────┘
         │                    │                    │
         └────────────────────┼────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   业务引擎      │
                    └─────────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         │                    │                    │
         ▼                    ▼                    ▼
   ┌───────────┐        ┌───────────┐        ┌───────────┐
   │  前端API   │        │  AI Agent  │        │  定时任务  │
   └───────────┘        └───────────┘        └───────────┘
```

### 6.2 规则固化原则

| 规则类型 | 可修改性 | 说明 |
|----------|----------|------|
| 核心规则 | 不可修改 | 客户存在、库存充足等基本校验 |
| 行业规则 | 可通过插件扩展 | 新增行业专属规则 |
| 阈值规则 | 可配置 | 金额限制、数量限制等 |
| 临时规则 | 需审批 | 特殊时期的临时规则 |

### 6.3 插件化扩展原则

新增行业场景或业务规则时：
1. 开发新的插件模块
2. 实现标准插件接口
3. 注册到插件注册表
4. 无需修改引擎核心

---

## 7. 性能考量

### 7.1 缓存策略

| 数据类型 | 缓存策略 | TTL |
|----------|----------|-----|
| 规则定义 | 本地缓存 | 10分钟 |
| 客户基础信息 | Redis缓存 | 5分钟 |
| 权限数据 | Redis缓存 | 1分钟 |

### 7.2 异步处理

对于耗时较长的规则校验（如外部数据源验证），采用异步处理：

```typescript
// 异步规则执行
async function executeAsync(ruleId: string, context: RuleContext): Promise<string> {
  // 返回任务ID
  const taskId = await ruleTaskQueue.enqueue(ruleId, context);

  // 触发回调或轮询
  return taskId;
}
```

---

## 8. 风险与缓解

| 风险 | 概率 | 影响 | 缓解措施 |
|------|------|------|----------|
| 规则冲突 | 中 | 高 | 规则优先级机制，明确覆盖逻辑 |
| 规则遗漏 | 中 | 高 | 上线前充分测试，持续迭代 |
| 性能瓶颈 | 低 | 中 | 缓存优化，异步处理 |
| 插件故障 | 低 | 高 | 插件隔离，故障降级 |

---

## 9. 结论

统一业务引擎是整个系统的核心壁垒。通过：

1. **单一入口**：彻底杜绝数据旁路操作
2. **规则固化**：所有规则提前定义，100%可控
3. **插件化扩展**：新行业新规则无需修改核心
4. **全链路审计**：所有操作可追溯可复盘

这套设计可以确保 AI 无法绕过业务逻辑直接操作数据，是四重防护体系的最后一道防线。

---

## 相关文档

- [01-multi-agent-design.md](01-multi-agent-design.md) — Multi-Agent 协同决策系统设计
- [03-mcp-tool-whitelist.md](03-mcp-tool-whitelist.md) — MCP 工具白名单体系
- [05-four-layer-safety.md](05-four-layer-safety.md) — 四重防护机制详解
