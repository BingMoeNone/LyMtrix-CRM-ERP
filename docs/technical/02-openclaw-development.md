# OpenClaw 二次开发方案

> 本文档详细描述基于 OpenClaw 开源框架的二次开发方案，包括架构集成、插件开发、安全配置。

---

## 1. 背景与开源合规

### 1.1 OpenClaw 简介

OpenClaw 是一个用于构建 AI Agent 的开源框架，采用 MIT 许可证，完全支持：
- 闭源商用
- 二次开发
- 分发销售

### 1.2 合规要求

使用 OpenClaw 只需遵守 MIT 协议的基本要求：

| 要求 | 说明 |
|------|------|
| **保留版权声明** | 在产品"关于"页面、用户手册中包含 OpenClaw 原始版权声明 |
| **不得冒用名义** | 不能声称产品为 OpenClaw 官方版本 |
| **许可证全文** | 在安装包随附的版权文档中包含 MIT 许可证全文 |

### 1.3 为什么选择 OpenClaw

| 考量 | 分析 |
|------|------|
| **协议风险** | MIT 是最宽松的开源协议，无传染性，适合商业化 |
| **功能匹配** | 原生支持多Agent、工具调用、Human-in-the-Loop |
| **社区活跃度** | 需要评估当前社区状态和文档完整性 |
| **学习成本** | 需要评估团队对框架的熟悉程度 |

---

## 2. 二次开发核心内容

### 2.1 四大开发模块

```
┌─────────────────────────────────────────────────────────────┐
│                  OpenClaw 二次开发四大模块                    │
├─────────────────────────────────────────────────────────────┤
│  1. 多Agent调度模块定制                                      │
│     → 基于原生能力，开发投票仲裁、并行校验、分歧处理逻辑      │
│                                                             │
│  2. 业务引擎对接模块                                         │
│     → 开发自定义Skill适配器，对接统一业务引擎API              │
│                                                             │
│  3. 审批流模块定制                                           │
│     → 基于原生Human-in-the-Loop，定制写入操作审批流程         │
│                                                             │
│  4. 全链路审计模块                                           │
│     → 打通OpenClaw日志与业务引擎审计系统                     │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 多Agent调度模块定制

#### 2.2.1 投票仲裁器开发

```typescript
// 伪代码：自定义投票仲裁器
class BusinessVotingArbiter {
  async vote( proposals: AgentProposal[] ): Promise<VoteResult> {
    // 1. 检查是否有任意一票否决
    const rejections = proposals.filter(p => p.isRejected);
    if (rejections.length > 0) {
      return { decision: 'REJECT', reason: rejections[0].reason };
    }

    // 2. 检查是否全部一致通过
    const agreements = this.findAgreements(proposals);
    if (agreements.length === 3) {
      return { decision: 'APPROVE', agreedProposal: agreements[0] };
    }

    // 3. 进入分歧处理流程
    return { decision: 'DIVERGE', rounds: 1 };
  }

  async handleDivergence(proposals: AgentProposal[]): Promise<VoteResult> {
    // 最多重新分发校验2轮
    // 仍分歧则交用户决策
  }
}
```

#### 2.2.2 并行校验实现

```typescript
// 并行分发方案给子Agent
async function distributeToSubAgents(proposal: AgentProposal) {
  const [result1, result2] = await Promise.all([
    subAgent1.validate(proposal),  // 业务规则校验
    subAgent2.validate(proposal)  // 安全权限校验
  ]);

  return { result1, result2 };
}
```

### 2.3 业务引擎对接模块

#### 2.3.1 自定义 Skill 适配器

```typescript
// 业务引擎适配器 Skill
class BusinessEngineSkill implements Skill {
  name = 'business_engine';
  description = '执行业务规则校验和数据操作';

  async execute(params: BusinessEngineParams) {
    // 1. 参数预处理
    const validatedParams = this.validateParams(params);

    // 2. 调用业务引擎API
    const result = await businessEngineClient.execute(validatedParams);

    // 3. 结果转换
    return this.formatResult(result);
  }

  // 权限边界：只能调用白名单内的业务规则
  static readonly ALLOWED_OPERATIONS = [
    'customer.query',
    'customer.create',
    'order.create',
    'order.query',
    'inventory.query',
    'inventory.reserve',
    // ... 白名单内操作
  ];
}
```

#### 2.3.2 工具调用拦截

```typescript
// OpenClaw 工具调用拦截器
class BusinessEngineToolInterceptor implements ToolInterceptor {
  async intercept(toolCall: ToolCall): Promise<ToolResult> {
    // 1. 检查是否在白名单内
    if (!BusinessEngineSkill.ALLOWED_OPERATIONS.includes(toolCall.operation)) {
      throw new UnauthorizedOperationError(toolCall.operation);
    }

    // 2. 参数强校验
    const validated = this.validateParameters(toolCall);

    // 3. 调用业务引擎
    return await businessEngineClient.execute(validated);
  }
}
```

### 2.4 审批流模块定制

#### 2.4.1 人工确认触发流程

```
┌─────────────────────────────────────────────────────────────┐
│                  人工确认流程                                 │
├─────────────────────────────────────────────────────────────┤
│  1. 方案投票通过                                             │
│         │                                                   │
│         ▼                                                   │
│  2. 主Agent触发 Human-in-the-Loop                            │
│         │                                                   │
│         ▼                                                   │
│  3. OpenClaw 暂停执行，等待用户确认                          │
│         │                                                   │
│         ▼                                                   │
│  4. 用户在管理后台点击"确认"或"驳回"                         │
│         │                                                   │
│    ┌────┴────┐                                              │
│    ▼         ▼                                              │
│  确认      驳回                                              │
│    │         │                                              │
│    ▼         ▼                                              │
│ 执行方案  终止执行                                           │
│    │         │                                              │
│    ▼         ▼                                              │
│ 返回结果  返回原因                                           │
└─────────────────────────────────────────────────────────────┘
```

#### 2.4.2 审批超时处理

| 配置项 | 默认值 | 说明 |
|--------|--------|------|
| 确认超时时间 | 24小时 | 超时后发送提醒 |
| 超时提醒 | 12小时 | 提醒一次 |
| 超时后操作 | 方案失效 | 需要重新发起 |

### 2.5 全链路审计模块

#### 2.5.1 日志对接方案

```typescript
// OpenClaw 日志 → 业务引擎审计系统
class AuditLogBridge {
  async bridge(log: OpenClawLogEntry) {
    // 1. 格式化日志
    const auditEntry = {
      timestamp: log.timestamp,
      agent: log.agent,
      operation: log.operation,
      parameters: log.parameters,
      result: log.result,
      sessionId: log.sessionId,
      userId: log.userId,
    };

    // 2. 发送到业务引擎审计系统
    await auditService.log(auditEntry);
  }
}
```

#### 2.5.2 审计日志内容

| 字段 | 说明 |
|------|------|
| timestamp | 操作时间戳 |
| agent | 涉及的Agent |
| operation | 操作类型 |
| parameters | 输入参数（脱敏后） |
| result | 执行结果 |
| sessionId | 会话ID |
| userId | 用户ID |
| approvalStatus | 人工确认状态 |

---

## 3. 安全配置

### 3.1 模型配置

```yaml
# 模型配置
model:
  provider: " volcengine "  # 或其他合规大模型
  temperature: 0.1          # 降低创造性幻觉
  max_tokens: 8192
  top_p: 0.9
```

### 3.2 沙盒模式配置

```yaml
# 安全配置
sandbox:
  enabled: true
  # 禁止的操作
  blocked_operations:
    - direct_sql       # 禁止直接执行SQL
    - system_command   # 禁止系统命令
    - file_write       # 禁止文件写入
    - network_request  # 禁止外部网络请求（白名单除外）
```

### 3.3 权限最小化配置

```yaml
# 每个Agent仅开放完成其职责所需的最小白名单工具
agents:
  main_agent:
    allowed_tools:
      - business_engine_query
      - business_engine_execute
      - human_approval_trigger

  sub_agent_1:
    allowed_tools:
      - business_rule_validator
      - approval_vote

  sub_agent_2:
    allowed_tools:
      - security_validator
      - approval_vote
```

---

## 4. 实施计划

### 4.1 第1-2周：环境搭建

| 任务 | 负责人 | 交付物 |
|------|--------|--------|
| OpenClaw 环境部署 | | 运行环境的OpenClaw实例 |
| 框架源码学习 | | 核心模块分析文档 |
| 二次开发架构设计 | | 技术方案文档 |
| 合规版权声明 | | 版权文档 |

### 4.2 第3-4周：核心模块开发

| 任务 | 负责人 | 交付物 |
|------|--------|--------|
| 投票仲裁器开发 | | BusinessVotingArbiter组件 |
| 业务引擎适配器 | | BusinessEngineSkill |
| 工具调用拦截器 | | ToolInterceptor |
| 审计日志桥接 | | AuditLogBridge |

### 4.3 第5-6周：集成测试

| 任务 | 负责人 | 交付物 |
|------|--------|--------|
| 多Agent联调 | | 完整的投票+校验流程 |
| 人工确认流程 | | 审批流集成 |
| 安全配置验证 | | 沙盒模式测试报告 |

---

## 5. 风险与缓解

| 风险 | 概率 | 影响 | 缓解措施 |
|------|------|------|----------|
| OpenClaw 文档不足 | 中 | 中 | 预留学习时间，参考源码 |
| 多Agent性能问题 | 中 | 中 | 并行优化，缓存策略 |
| 框架版本升级 | 低 | 中 | 锁定版本，做好回归测试 |
| 合规遗漏 | 低 | 高 | 法律顾问审查版权声明 |

---

## 6. 结论

基于 OpenClaw 二次开发是本项目的技术基底选择。其优势在于：

1. **协议安全**：MIT协议对商业化友好
2. **功能匹配**：原生支持多Agent、工具调用、Human-in-the-Loop
3. **插件化开发**：无需修改框架核心，通过Skill和Interceptor扩展

但需要注意：
- 框架学习曲线
- 社区支持的持续性
- 与业务引擎的集成复杂度

---

## 相关文档

- [01-multi-agent-design.md](01-multi-agent-design.md) — Multi-Agent 协同决策系统设计
- [03-mcp-tool-whitelist.md](03-mcp-tool-whitelist.md) — MCP 工具白名单体系
- [04-business-engine.md](04-business-engine.md) — 统一业务引擎设计
- [../compliance/01-open-source-compliance.md](../compliance/01-open-source-compliance.md) — 开源协议合规方案
