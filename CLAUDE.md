# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**AI驱动的义乌小商户 CRM-ERP 系统** — 面向义乌及周边产业带中小微外贸、电商、小商品生产贸易企业，通过自然语言交互 + AI 全权负责企业的 CRM/ERP 体系。

核心设计理念：
- AI 仅负责自然语言交互、流程调度与意图识别，不触碰核心数据操作
- 多 Agent（1主2从）交叉校验，从根源解决 AI 幻觉风险
- 人在回路，所有写入操作必须用户二次确认
- 行业 know-how 固化为标准化规则插件，形成核心壁垒

## Target Users

义乌及周边年营收50万-5000万的中小微外贸企业、电商卖家、小商品贸易商
特点：流动性强、成本敏感、操作简单、追求快速使用低投入高回报

## Core Principles

| # | 原则 | 说明 |
|---|------|------|
| 1 | 业务优先 | 先跑通MVP，用客户验证需求 |
| 2 | AI权责隔离 | AI仅负责交互/调度，不触碰核心数据 |
| 3 | 多Agent校验 | 1主2从架构，3票全部通过才执行，任意1驳回直接终止 |
| 4 | 规则前置 | 所有规则白名单固化，AI无法调用未授权能力 |
| 5 | 人在回路 | 所有写入操作必须用户二次确认 |

## Architecture

```
多端接入适配层 → 统一API网关 → 多Agent协同决策域 → OpenClaw核心调度层
    → MCP工具白名单层 → 业务规则中枢 → 引擎核心底座 → 业务数据库
```

核心分层：
- **多端接入适配层**：PC管理后台（Vue/React）、小程序（uni-app）
- **统一API网关**：请求鉴权、限流、路由（Nginx/Spring Cloud Gateway）
- **多Agent协同决策域**：1主2从架构，豆包Pro-32k/通义千问4
- **OpenClaw调度层**：Agent生命周期管理、工具调用调度、全链路审计
- **MCP工具白名单层**：AI与业务引擎的唯一桥梁，参数前置强校验
- **业务规则中枢**：FastAPI/Spring Boot，插件化规则引擎
- **引擎核心底座**：MyBatis-Plus + MySQL + Redis，唯一可操作数据库入口

## Multi-Agent Design

| Agent | Role | Responsibility |
|-------|------|----------------|
| 主Agent | 意图匹配&总调度 | 拆解自然语言意图、方案分发、投票仲裁、调用MCP工具 |
| 子Agent1 | 业务规则合规 | 校验客户存在、库存充足、定价合规等业务逻辑，有一票否决权 |
| 子Agent2 | 安全权限合规 | 校验操作权限、人工确认需求、数据合规，有一票否决权 |

投票规则：
- **通过**：3个Agent全部通过，无驳回
- **否决**：任意1个Agent提出驳回，直接终止
- **分歧**：3个方案均不一致，最多重新校验2轮，仍分歧交用户决策

## Four-Layer Safety Guard

```
事前防护：多Agent交叉校验 → 过滤99%意图偏差/参数错误
事中防护1：MCP白名单+参数校验 → AI仅能调用白名单工具
事中防护2：业务规则最终校验 → 不符合固定规则直接驳回
事后防护：人工确认+全链路审计 → 写入必须确认，日志可追溯
```

## Tech Stack

- **后端**：OpenClaw（MIT协议）、FastAPI/Spring Boot、MyBatis-Plus
- **数据库**：MySQL 8.0、Redis
- **前端**：Vue/React（PC后台）、uni-app（小程序）
- **AI**：豆包大模型Pro-32k、通义千问4
- **协议**：MCP（模型上下文协议）

## BASE/ 目录说明

- `BASE/claude-harness/` — Claude Code 源码分析平台（用于学习 AI Agent 架构）
- `BASE/cc-notebook/` — Claude Code 学习笔记与分析文档

## Implementation Phases

| 阶段 | 时间 | 核心交付物 |
|------|------|------------|
| 基底搭建 | 第1-2周 | OpenClaw部署、业务引擎底座、3个Agent配置 |
| MVP开发 | 第3-8周 | 客户/订单/库存管理、MCP工具、人工确认流程 |
| 客户内测 | 第9-12周 | 2-3家老客户试用、发票/财务/报关功能 |
| 正式版 | 第13-20周 | 行业插件库、3个行业版本、订阅支付、官网 |
| 正式上线 | 第21-24周 | 开放订阅、首批50家付费客户 |

## 合规要求

- OpenClaw 采用 MIT 协议，需保留原始版权声明
- 严格遵守《个人信息保护法》《数据安全法》
- 所有 AI 操作必须经过四重防护

## Key Files

- [README.md](README.md) — 完整项目文档（含架构图、时间线、核心流程）
- [docs/](docs/) — 产品设计文档和流程图
