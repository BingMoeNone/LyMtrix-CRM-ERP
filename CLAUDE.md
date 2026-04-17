# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**AI驱动的义乌小商户 CRM-ERP 系统** — 面向义乌及周边产业带中小微外贸、电商、小商品生产贸易企业，通过自然语言交互 + AI 全权负责企业的 CRM/ERP 体系。

**开发理念**：以 OpenClaw 为内核（Agent调度、会话管理），核心业务逻辑完全自主开发。

## Target Users

义乌及周边年营收50万-5000万的中小微外贸企业、电商卖家、小商品贸易商
特点：流动性强、成本敏感、操作简单、追求快速使用低投入高回报

## Document Management Rules

> **强制规则**：每次更新、创建、新增任何文档时，必须同步更新全部相关文档。

### 同步要求

| 操作类型 | 必须执行的同步任务 |
|----------|-------------------|
| 创建新文档 | 更新所有相关文档的"相关文档"章节 + CLAUDE.md Key Files |
| 更新现有文档 | 检查并更新关联文档的交叉引用 |
| 新增技术点 | 更新所有受影响文档的相关章节 |

### 同步检查清单

1. **相关文档章节** (`## 相关文档`)
   - 新增文档必须在所有关联文档的相关章节中添加
   - 格式：`- [文档名](路径) — 文档说明`

2. **CLAUDE.md Key Files**
   - 新增重要文档必须在 Key Files 中列出

3. **交叉引用**
   - 章节间引用（如 `[05-four-layer-safety.md](docs/technical/05-four-layer-safety.md)`）需保持一致
   - 文档数量变化时检查是否需要新增章节编号

4. **文档编号**
   - 新增文档使用下一个可用编号（如已有 12 篇，新增为 13）
   - 编号格式：`XX-document-name.md`

### 示例

**创建新文档 `docs/technical/13-new-feature.md` 时，必须同步更新：**

```markdown
# 1. 新增文档的相关文档章节
## 相关文档
- ...existing docs...
- [13-new-feature.md](docs/technical/13-new-feature.md) — 新功能说明

# 2. 新文档内添加相关文档引用
## 相关文档
- [05-four-layer-safety.md](docs/technical/05-four-layer-safety.md) — 六重防护机制详解
- [12-hook-system-design.md](docs/technical/12-hook-system-design.md) — Hook 系统详细设计

# 3. 更新 CLAUDE.md Key Files
## Key Files
- ...existing files...
- [docs/technical/13-new-feature.md](docs/technical/13-new-feature.md) — 新功能说明
```

## Core Principles

| # | 原则 | 说明 |
|---|------|------|
| 1 | 业务优先 | 先跑通MVP，用客户验证需求 |
| 2 | AI权责隔离 | AI仅负责交互/调度，不触碰核心数据 |
| 3 | 分层投票校验 | L0无→L1主1票→L2全3票，按需调用节省成本 |
| 4 | 规则前置 | 所有规则白名单固化，AI无法调用未授权能力 |
| 5 | 人在回路 | 所有写入操作必须用户二次确认 |

## Architecture

### 分层架构

```
多端接入适配层 → 统一API网关 → 自主开发层 → OpenClaw内核层 → 业务引擎 → 数据库
```

### 自主开发层（完全不依赖OpenClaw）

| 模块 | 说明 |
|------|------|
| 分层投票决策器 | L0/L1/L2三级投票 |
| 风险评估引擎 | 四维评估体系 |
| 白名单管理器 | 快速通道控制 |
| 人工确认工作流 | 自定义确认UI |
| 业务规则引擎 | 插件化架构 |
| 审计日志系统 | 全链路追踪 |

### OpenClaw内核层（仅使用基础能力）

| 能力 | 如何使用 |
|------|----------|
| Agent调度 | Agent生命周期管理 |
| Session管理 | 会话状态管理 |
| 流式输出 | 响应展示 |
| MCP协议 | 工具注册基础 |

## Multi-Agent Design

| Agent | Role | Model | Responsibility |
|-------|------|-------|----------------|
| 主Agent | 意图匹配&总调度 | MiniMax M2.7 | 拆解意图、方案分发、投票仲裁 |
| 子Agent1 | 业务规则校验 | MiniMax M2.5 | 校验客户/库存/定价，有一票否决权 |
| 子Agent2 | 安全权限校验 | MiniMax M2.5 | 校验权限/合规，有一票否决权 |

### 分层投票规则

| 等级 | 操作类型 | 通过条件 | 确认 | 说明 |
|------|----------|----------|------|------|
| **L0** | 查询类 | 无需投票 | 无 | 主Agent直接返回 |
| **L1** | 普通创建/修改（<1万） | 主Agent通过 | 无 | 自动执行 |
| **L2** | 重要/高风险（>1万） | 主+任一子Agent通过 | 强确认 | 2票通过 |

### 决策结果

- **通过**：对应等级的投票通过
- **否决**：任意1个Agent提出驳回，直接终止
- **分歧**：方案不一致，最多重新校验2轮，仍分歧交用户决策

## Safety Guard

### 六重防护体系（含 Hook 机制）

```
第1重：Pre-Processing Hooks → 输入清洗、频率控制、恶意检测
第2重：多Agent交叉校验 → 过滤99%意图偏差/参数错误
第3重：Pre-Agent Hooks → 风险等级确认、权限检查
第4重：Stop Hooks → 危险模式检测、敏感数据、规则校验
第5重：人工确认 → 用户二次确认
第6重：Tool/Post-Execution Hooks → 参数验证、结果验证、审计
```

### 核心防护原则

| # | 原则 | 说明 |
|---|------|------|
| 1 | 业务优先 | 先跑通MVP，用客户验证需求 |
| 2 | AI权责隔离 | AI仅负责交互/调度，不触碰核心数据 |
| 3 | 分层投票校验 | L0无→L1主1票→L2全3票，按需调用节省成本 |
| 4 | Hooks拦截 | 危险模式实时检测，阻止于执行前 |
| 5 | 规则前置 | 所有规则白名单固化，AI无法调用未授权能力 |
| 6 | 人在回路 | 所有写入操作必须用户二次确认 |

> **Hook 系统设计详见**：[docs/technical/12-hook-system-design.md](docs/technical/12-hook-system-design.md)

## Tech Stack

| 类别 | 技术 | 说明 |
|------|------|------|
| **内核** | OpenClaw（MIT） | Agent调度、会话管理 |
| **自主开发** | Java/Go/FastAPI | 业务引擎、规则引擎 |
| **数据库** | MySQL 8.0、Redis | 数据存储、缓存 |
| **前端** | Vue/React（PC）、uni-app（小程序） | 用户界面 |
| **AI** | MiniMax M2.7（主）、MiniMax M2.5（子） | 大模型调用 |
| **协议** | MCP | 工具标准化接口 |

## OpenClaw内核定制

### 开发理念

- OpenClaw 仅作为 Agent 调度内核
- 核心业务逻辑完全不依赖 OpenClaw
- 通过标准化接口隔离 OpenClaw 版本升级影响
- 如有需要可替换为其他 Agent 框架

### 不依赖OpenClaw的模块

| 模块 | 开发方式 | 原因 |
|------|----------|------|
| 统一业务引擎 | 完全自主 | 核心壁垒，自主控制 |
| 分层投票决策器 | 完全自主 | 不满足分层需求 |
| 风险评估引擎 | 完全自主 | 业务逻辑自主 |
| 审计日志系统 | 完全自主 | 与OpenClaw平行 |

## BASE/ 目录说明

- `BASE/claude-harness/` — Claude Code 源码分析平台（用于学习 AI Agent 架构）
- `BASE/cc-notebook/` — Claude Code 学习笔记与分析文档

## Implementation Phases

| 阶段 | 时间 | 核心交付物 |
|------|------|------------|
| 内核验证 | 第1-2周 | OpenClaw部署验证、版本锁定 |
| 核心模块开发 | 第3-6周 | 分层投票器、风险引擎、白名单、确认工作流 |
| 集成联调 | 第7-8周 | 与OpenClaw集成、全流程联调 |
| 业务层开发 | 第9-12周 | 业务规则、MCP工具、前端UI、客户内测 |
| 正式版 | 第13-20周 | 行业插件库、3个行业版本 |
| 正式上线 | 第21-24周 | 首批50家付费客户 |

## 合规要求

- OpenClaw 采用 MIT 协议，需保留原始版权声明
- 严格遵守《个人信息保护法》《数据安全法》
- 所有 AI 操作必须经过四重防护

## Git Branching Strategy

开发新功能时必须遵循以下规则：

| 分支 | 用途 | 命名规则 |
|------|------|----------|
| `main` | 生产环境分支 | - |
| `develop` | 开发集成分支 | - |
| `feature/*` | 功能开发分支 | `feature/功能名称` |

**开发流程：**
1. 从 `develop` 创建 `feature/xxx` 分支
2. 在 feature 分支上完成全部开发工作
3. 功能未完成前 **禁止合并** 到 `develop`
4. 功能完成后合并回 `develop`

**示例：**
```bash
# 创建功能分支
git checkout -b feature/customer-management develop

# 开发完成后合并
git checkout develop
git merge --no-ff feature/customer-management
```

## Key Files

- [README.md](README.md) — 完整项目文档
- [docs/technical/02-openclaw-development.md](docs/technical/02-openclaw-development.md) — OpenClaw内核定制方案
- [docs/technical/04-business-engine.md](docs/technical/04-business-engine.md) — 统一业务引擎设计
