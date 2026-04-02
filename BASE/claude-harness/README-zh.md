[English](./README.md) | [中文](./README-zh.md)

# Claude Harness

> 解构 Claude Code — 交互式源码分析、深度技术解读与架构探索平台。

**Claude Harness** 是一个开源平台，用于探索和理解 [Claude Code](https://docs.anthropic.com/en/docs/claude-code)（Anthropic 官方 AI 编程代理）的内部实现。通过交互式代码浏览、深度技术文章和模块级分析，将 50 万行 TypeScript 源码转化为可理解的学习资源。

## 为什么做这个项目

Claude Code 是目前最精密的 AI 代理工具之一 — 在工具设计、上下文管理、权限治理和多代理协作方面堪称典范。但仅凭原始源码去理解其架构，门槛极高。

Claude Harness 让这套架构变得可读、可探索：

- **引导式文章** — 结合真实代码引用，逐一解读每个子系统
- **交互式代码浏览器** — 语法高亮 + 全文搜索，随时查阅源码
- **模块可视化** — 揭示代码库的结构关系与规模分布

无论你是在构建自己的 AI 代理、研究工具编排模式，还是单纯好奇 Claude Code 的工作原理 — 这个项目都适合你。

## 数据概览

| 指标 | 数值 |
|------|------|
| 分析源文件数 | **1,902** |
| 代码行数 | **514,587** |
| 映射模块数 | **35** |
| 技术文章 | **31+** |
| 支持语言 | English, 中文, 日本語 |

## 核心功能

### 交互式代码浏览器

浏览完整的 Claude Code 源码目录树，支持文件浏览器导航、[Shiki](https://shiki.matsu.io/) 语法高亮，以及基于 [FlexSearch](https://github.com/nextapps-de/flexsearch) 的客户端即时搜索。

### 深度技术文章

31 篇引导式技术解读，覆盖每个核心子系统：

| # | 文章 | 主题 |
|---|------|------|
| 01 | 架构总览 | 整体结构与设计哲学 |
| 02 | 查询引擎 | 核心推理循环与消息处理 |
| 03 | 工具系统 | ~40 个工具的实现与调度 |
| 04 | 流式执行器 | 实时流式工具执行 |
| 05 | 权限系统 | 信任边界与审批流程 |
| 06 | 上下文管理 | 压缩、窗口化、Token 预算 |
| 07 | 启动性能 | 快速冷启动初始化 |
| 08 | 多代理系统 | 子代理生成与协作 |
| 09 | 记忆系统 | 跨会话持久化上下文 |
| 10 | Bridge 系统 | VS Code & JetBrains IDE 集成 |
| 11 | MCP 集成 | 模型上下文协议服务器 |
| 12 | 插件与技能 | 可扩展的技能加载系统 |
| 13 | 认证系统 | OAuth、API Key 与会话管理 |
| 14 | 终端 UI | 基于 Ink 的响应式终端界面 |
| 15 | 快捷键与 Vim | 键盘快捷方式与 Vim 模式 |
| 16 | 全屏界面 | 全屏 UI 系统 |
| 17 | 状态管理 | 响应式状态与存储 |
| 18 | 遥测系统 | 使用追踪与数据分析 |
| 19 | 配置系统 | 设置、配置文件与默认值 |
| 20 | 功能开关 | 渐进式发布与实验 |
| 21 | 文件操作 | 读取、写入、编辑、搜索 |
| 22 | Bash 工具 | Shell 执行与沙箱隔离 |
| 23 | 搜索系统 | 代码搜索与文件发现 |
| 24 | Web 工具 | 浏览器与网页交互 |
| 25 | LSP 集成 | 语言服务器协议支持 |
| 26 | Buddy 系统 | 结对编程功能 |
| 27 | 输出样式 | 格式化与渲染 |
| 28 | 远程执行 | 远程代理触发器 |
| 29 | 会话管理 | 对话持久化 |
| 30 | API 客户端 | Anthropic API 通信层 |
| 31 | 错误恢复 | 容错与重试策略 |

### 模块浏览器

可视化展示 35 个核心模块的文件数、代码行数与功能描述：

```
utils          564 文件   181K 行   工具函数
components     389 文件    82K 行   Ink UI 组件 (~140 个)
services       130 文件    54K 行   外部服务集成
tools          184 文件    51K 行   代理工具实现 (~40 个)
commands       207 文件    27K 行   斜杠命令 (~50 个)
hooks          104 文件    19K 行   React Hooks
ink             96 文件    20K 行   Ink 渲染器封装
...以及另外 28 个模块
```

### 多语言支持

完整的国际化支持，覆盖英文、中文和日文 — 提供基于 locale 的路由和自动回退机制。

## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | [Next.js 15](https://nextjs.org/) (App Router) |
| UI | [React 19](https://react.dev/) + [Tailwind CSS 4](https://tailwindcss.com/) |
| 代码高亮 | [Shiki](https://shiki.matsu.io/) |
| 搜索 | [FlexSearch](https://github.com/nextapps-de/flexsearch) |
| 文章 | [MDX](https://mdxjs.com/) via next-mdx-remote |
| 国际化 | [next-intl](https://next-intl.dev/) |
| 动画 | [Motion](https://motion.dev/) |
| 图表 | [Mermaid](https://mermaid.js.org/) |
| Monorepo | [Turbo](https://turbo.build/) |
| 部署 | [Vercel](https://vercel.com/) |

## 快速开始

### 环境要求

- **Node.js 22+**（见 `.node-version`）
- **pnpm**（或 npm）

### 安装与运行

```bash
# 克隆仓库
git clone https://github.com/anthropics/claude-harness.git
cd claude-harness

# 安装依赖
pnpm install

# 生成元数据（文件树、模块统计、搜索索引）
pnpm generate

# 启动开发服务器
pnpm dev
```

应用将在 `http://localhost:3000` 可用。

### 生产构建

```bash
pnpm build
```

## 项目结构

```
claude-harness/
├── content/
│   └── articles/
│       ├── en/                    # 英文文章
│       ├── zh/                    # 中文文章（31 篇）
│       └── ja/                    # 日文文章
│
├── packages/
│   ├── claude-code-source/        # Claude Code 源码存档（只读）
│   │   └── src/
│   │       ├── commands/          # ~50 个斜杠命令
│   │       ├── tools/             # ~40 个代理工具
│   │       ├── components/        # ~140 个 Ink UI 组件
│   │       ├── services/          # 外部服务集成
│   │       ├── bridge/            # IDE 集成（VS Code, JetBrains）
│   │       ├── hooks/             # React Hooks
│   │       └── ...               # 共 35 个模块
│   │
│   ├── scripts/                   # 元数据生成管线
│   │   └── src/
│   │       ├── generate-file-tree.ts
│   │       ├── generate-module-stats.ts
│   │       ├── generate-search-index.ts
│   │       └── generate-source-summary.ts
│   │
│   └── web/                       # Next.js Web 应用
│       └── src/
│           ├── app/[locale]/      # 基于 locale 的页面
│           │   ├── articles/      # 文章列表与详情
│           │   ├── code/          # 交互式代码浏览器
│           │   └── modules/       # 模块浏览器
│           ├── components/        # 共享 UI 组件
│           ├── lib/               # 工具函数与数据加载
│           └── i18n/              # 国际化配置
│
├── turbo.json                     # Turbo monorepo 配置
├── vercel.json                    # Vercel 部署配置
└── package.json                   # 根工作区配置
```

## 数据生成管线

`pnpm generate` 命令运行四个脚本，将 Claude Code 源码处理为结构化元数据：

1. **文件树** — 递归扫描源码目录，生成层级 JSON 树（1,902 个条目）
2. **模块统计** — 分析 35 个顶级模块的文件数与代码行数
3. **源码摘要** — 汇总整个代码库的总体数据
4. **搜索索引** — 构建 FlexSearch 全文索引，供客户端搜索使用

这些生成的文件驱动了 Web UI 的代码浏览器、模块浏览器和搜索功能。

## 架构

```
┌─────────────────────────────────────────────────────┐
│                     Web 应用                         │
│  ┌──────────┐  ┌──────────┐  ┌────────┐  ┌───────┐ │
│  │ 技术文章  │  │  代码     │  │ 模块   │  │ 搜索  │ │
│  │  (MDX)   │  │  浏览器   │  │ 浏览器 │  │(Flex) │ │
│  └────┬─────┘  └────┬─────┘  └───┬────┘  └───┬───┘ │
│       │              │            │            │      │
│  ┌────▼──────────────▼────────────▼────────────▼───┐ │
│  │              生成的元数据                         │ │
│  │  file-tree.json · module-stats.json · search idx │ │
│  └────────────────────┬────────────────────────────┘ │
└───────────────────────┼──────────────────────────────┘
                        │
              ┌─────────▼─────────┐
              │    生成脚本         │
              │  (packages/scripts) │
              └─────────┬─────────┘
                        │
              ┌─────────▼─────────┐
              │  Claude Code 源码   │
              │   （只读存档）       │
              │  1,902 文件 · 514K  │
              └───────────────────┘
```

## 参与贡献

欢迎贡献！以下是一些参与方式：

- **撰写文章** — 在 `content/articles/` 中添加新的技术解读
- **翻译** — 帮助扩展英文和日文文章覆盖率
- **改进 UI** — 优化代码浏览器、模块浏览器或搜索体验
- **修复 Bug** — 查看 Issues 中的待处理项

### 撰写文章

文章是 `content/articles/{locale}/` 中的 MDX 文件，每个文件需要包含 frontmatter：

```mdx
---
title: "文章标题"
description: "简要描述"
order: 32
tags: ["标签1", "标签2"]
readTime: "15 min"
---

正文内容...
```

## 相关项目

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) — Anthropic 官方 AI 编程代理
- [Learn Claude Code](https://github.com/shareAI-lab/learn-claude-code) — AI 代理工具编排工程课程

## 许可证

MIT
