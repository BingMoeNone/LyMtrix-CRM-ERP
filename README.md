# 义乌小商户 AI 驱动 CRM-ERP 系统

> 通过自然语言交互 + AI 全权负责企业的 CRM/ERP 体系，专为义乌产业带中小微外贸、电商、小商品生产企业打造。

---

## 项目文档导航

### 技术文档

| 文档 | 说明 |
|------|------|
| [docs/technical/01-multi-agent-design.md](docs/technical/01-multi-agent-design.md) | Multi-Agent 协同决策系统设计（1主2从架构、投票规则） |
| [docs/technical/02-openclaw-development.md](docs/technical/02-openclaw-development.md) | OpenClaw 二次开发方案 |
| [docs/technical/03-mcp-tool-whitelist.md](docs/technical/03-mcp-tool-whitelist.md) | MCP 工具白名单体系 |
| [docs/technical/04-business-engine.md](docs/technical/04-business-engine.md) | 统一业务引擎设计 |
| [docs/technical/05-four-layer-safety.md](docs/technical/05-four-layer-safety.md) | 四重防护机制详解 |
| [docs/technical/06-system-architecture.md](docs/technical/06-system-architecture.md) | 整体技术架构设计 |
| [docs/technical/07-data-flow-design.md](docs/technical/07-data-flow-design.md) | 核心请求全流程设计 |

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
| 2 | 多Agent校验 | 1主2从架构，3票全部通过才执行，任意1驳回直接终止 |
| 3 | MCP白名单 | 工具与规则一对一映射，AI只能调用白名单工具 |
| 4 | 人在回路 | 所有写入操作必须用户二次确认 |

## 技术架构

```
多端接入适配层 → 统一API网关 → 多Agent协同决策域 → OpenClaw核心调度层
    → MCP工具白名单层 → 业务规则中枢 → 引擎核心底座 → 业务数据库
```

## 落地计划

| 阶段 | 时间 | 核心交付物 |
|------|------|------------|
| 基底搭建 | 第1-2周 | OpenClaw部署、3个Agent配置 |
| MVP开发 | 第3-8周 | 客户/订单/库存管理 |
| 客户内测 | 第9-12周 | 2-3家老客户试用 |
| 正式版 | 第13-20周 | 行业插件库、3个行业版本 |
| 正式上线 | 第21-24周 | 首批50家付费客户 |

---

*本项目基于 OpenClaw（MIT协议）二次开发，保留原始版权声明。*
