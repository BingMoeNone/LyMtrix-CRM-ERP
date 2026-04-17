# 义乌小商户 AI 驱动 CRM-ERP 系统

> 通过自然语言交互 + AI 全权负责企业的 CRM/ERP 体系，专为义乌产业带中小微外贸、电商、小商品生产企业打造。

---

## 项目文档导航

### 技术文档

| 文档 | 说明 |
|------|------|
| [docs/technical/01-multi-agent-design.md](docs/technical/01-multi-agent-design.md) | Multi-Agent 协同决策系统（分层投票、模型分配） |
| [docs/technical/02-openclaw-development.md](docs/technical/02-openclaw-development.md) | OpenClaw 内核定制方案（以OpenClaw为内核，核心逻辑自主开发） |
| [docs/technical/03-mcp-tool-whitelist.md](docs/technical/03-mcp-tool-whitelist.md) | MCP 工具白名单体系 |
| [docs/technical/04-business-engine.md](docs/technical/04-business-engine.md) | 统一业务引擎设计（核心壁垒，完全自主开发） |
| [docs/technical/05-four-layer-safety.md](docs/technical/05-four-layer-safety.md) | 四重防护机制详解 |
| [docs/technical/06-system-architecture.md](docs/technical/06-system-architecture.md) | 整体技术架构设计 |
| [docs/technical/07-data-flow-design.md](docs/technical/07-data-flow-design.md) | 核心请求全流程设计 |
| [docs/technical/08-risk-classification.md](docs/technical/08-risk-classification.md) | 3档风险分级体系（L0查询/L1普通/L2重要） |
| [docs/technical/09-fast-path.md](docs/technical/09-fast-path.md) | 快速通道与白名单机制 |
| [docs/technical/10-dynamic-risk.md](docs/technical/10-dynamic-risk.md) | 动态风险评估体系 |
| [docs/technical/11-fallback.md](docs/technical/11-fallback.md) | 多级兜底策略（M2.7→M2.5→豆包→规则引擎） |

### 商业文档

| 文档 | 说明 |
|------|------|
| [docs/business/01-market-positioning.md](docs/business/01-market-positioning.md) | 市场定位与竞争分析 |
| [docs/business/02-pricing-strategy.md](docs/business/02-pricing-strategy.md) | 定价策略与商业模式 |
| [docs/business/03-customer-validation.md](docs/business/03-customer-validation.md) | 客户验证与需求调研方案 |
| [docs/business/04-industry-barriers.md](docs/business/04-industry-barriers.md) | 行业 Know-how 壁垒分析 |

### 合规文档

| 文档 | 说明 |
|------|------|
| [docs/compliance/01-open-source-compliance.md](docs/compliance/01-open-source-compliance.md) | 开源协议合规方案（MIT协议） |
| [docs/compliance/02-data-security.md](docs/compliance/02-data-security.md) | 数据安全与合规体系 |

---

## 核心设计理念

| # | 原则 | 说明 |
|---|------|------|
| 1 | AI权责隔离 | AI仅负责交互/调度，不触碰核心数据 |
| 2 | 分层投票校验 | 1主2从架构，L0无投票→L1主1票→L2全3票，按需调用节省成本 |
| 3 | MCP白名单 | 工具与规则一对一映射，AI只能调用白名单工具 |
| 4 | 人在回路 | 所有写入操作必须用户二次确认 |

---

## 核心技术架构

### 开发理念

```
┌─────────────────────────────────────────────────────────────┐
│                  OpenClaw 内核定制开发架构                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  【自主开发层】核心逻辑完全不依赖OpenClaw                    │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  业务层：风险分级层、业务规则层、人工确认层          │  │
│  │  决策层：分层投票层、动态风险层、白名单层          │  │
│  │  接入层：API适配层、协议转换层、展示层              │  │
│  └─────────────────────────────────────────────────────┘  │
│                           ▲                                │
│                           │ 深度定制                        │
│                           │                                │
│  【OpenClaw 内核层】仅使用其Agent调度、Session管理能力     │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  Agent生命周期管理 | 工具调用调度 | 会话管理        │  │
│  │  MCP协议支持 | Human-in-the-Loop | 日志审计        │  │
│  └─────────────────────────────────────────────────────┘  │
│                           ▲                                │
│                           │ 使用                           │
│                           │                                │
│  【模型层】MiniMax M2.7（主Agent）、MiniMax M2.5（子Agent）│
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 技术分层

```
多端接入适配层 → 统一API网关 → 自主开发层 → OpenClaw内核层 → 业务引擎 → 数据库

自主开发层包含：
├── 分层投票决策器（自主开发）
├── 风险评估引擎（自主开发）
├── 白名单管理器（自主开发）
├── 人工确认工作流（自主开发）
├── 业务规则引擎（自主开发）
└── 审计日志系统（自主开发）
```

---

## 核心自主开发模块

### 七大自主模块

| 模块 | 开发方式 | 说明 |
|------|----------|------|
| **统一业务引擎** | 完全自主开发 | 系统核心壁垒，唯一数据库操作入口 |
| **分层投票决策器** | 完全自主开发 | L0/L1/L2三级投票，不依赖OpenClaw |
| **风险评估引擎** | 完全自主开发 | 四维评估体系，可配置可插拔 |
| **白名单管理器** | 完全自主开发 | 快速通道控制，独立于OpenClaw |
| **人工确认工作流** | 完全自主开发 | 自定义确认UI，不依赖OpenClaw |
| **业务规则引擎** | 完全自主开发 | 插件化架构，独立部署 |
| **审计日志系统** | 完全自主开发 | 全链路追踪，与OpenClaw平行 |

### OpenClaw仅使用的模块

| 能力 | 如何使用 |
|------|----------|
| Agent调度 | 使用其Agent生命周期管理能力 |
| Session管理 | 使用其会话状态管理能力 |
| 流式输出 | 使用其响应展示能力 |
| MCP协议 | 作为工具注册基础协议 |

---

## 分层投票机制

### 风险分级（3档）

| 等级 | 操作类型 | 金额阈值 | 通过条件 | 确认 | 延迟目标 |
|------|----------|----------|----------|------|----------|
| **L0** | 查询类 | 无金额 | 无需投票 | 无 | <1s |
| **L1** | 普通创建/修改 | <1万 | 主Agent通过 | 无 | <2s |
| **L2** | 重要/高风险 | >1万 | 主+子Agent通过（2票） | 强确认 | <3s |

### Agent模型分配

| Agent | 职责 | 模型 | 调用场景 |
|--------|------|------|----------|
| 主Agent | 意图理解+总调度 | MiniMax M2.7 | L0/L1/L2都调用 |
| 子Agent1 | 业务规则校验 | MiniMax M2.5 | L1/L2调用 |
| 子Agent2 | 安全权限校验 | MiniMax M2.5 | 仅L2调用 |

---

## 落地计划

| 阶段 | 时间 | 核心交付物 |
|------|------|------------|
| 内核验证 | 第1-2周 | 验证OpenClaw内核能力，锁定版本 |
| 核心模块开发 | 第3-6周 | 分层投票器、风险引擎、白名单、确认工作流 |
| 集成联调 | 第7-8周 | 与OpenClaw集成、全流程联调 |
| 业务层开发 | 第9-12周 | 业务规则、MCP工具、前端UI、客户内测 |
| 正式版 | 第13-20周 | 行业插件库、3个行业版本 |
| 正式上线 | 第21-24周 | 首批50家付费客户 |

---

## 与"二次开发"的区别

| 维度 | 二次开发 | 内核定制（我们的方式） |
|------|----------|------------------------|
| **定位** | 在OpenClaw基础上扩展 | 以OpenClaw为底层内核 |
| **业务逻辑** | 尽量用OpenClaw原生能力 | **核心逻辑完全自主实现** |
| **核心模块** | 依赖OpenClaw | **完全不依赖OpenClaw** |
| **绑定程度** | 强依赖 | **弱依赖，可替换** |

**如果未来OpenClaw不满足需求，只需重写IAgentKernel接口实现，可切换到其他方案。**

---

*本项目以OpenClaw为内核（MIT协议），核心业务逻辑自主开发。保留OpenClaw原始版权声明。*
