# Claude Code — 泄露源码 (2026-03-31)

> 2026年3月31日，Anthropic 的 **Claude Code** CLI 完整源代码通过其 npm 注册表中暴露的 `.map` 文件被泄露。

---

## 泄露经过

[Chaofan Shou](https://x.com/shoucccc) ([@Fried_rice](https://x.com/AskFriedRice)) 发现了这一泄露并在公开平台上发布：

> *"Claude 代码源码通过其 npm 注册表中的 map 文件被泄露了！"*
>
> — @Fried_rice，2026年3月31日

发布包中的 source map 文件包含了完整的、未混淆的 TypeScript 源码的引用，可从 Anthropic 的 R2 存储桶中下载为 zip 压缩包。

---

## 概述

**Claude Code** 是 Anthropic 官方的 CLI 工具，让你可以直接在终端中与 Claude 交互，执行软件工程任务——编辑文件、运行命令、搜索代码库、管理 git 工作流等。

本仓库包含泄露的 `src/` 目录。

| 详情 | 值 |
| ---- | -- |
| **泄露日期** | 2026-03-31 |
| **语言** | TypeScript |
| **运行时** | Bun |
| **终端 UI** | React + Ink (CLI 用 React) |
| **规模** | 约 1,900 个文件，512,000+ 行代码 |

---

## 目录结构

```
src/
├── main.tsx                 # 入口点 (基于 Commander.js 的 CLI 解析器)
├── commands.ts              # 命令注册表
├── tools.ts                 # 工具注册表
├── Tool.ts                  # 工具类型定义
├── QueryEngine.ts           # LLM 查询引擎 (核心 Anthropic API 调用)
├── context.ts               # 系统/用户上下文收集
├── cost-tracker.ts          # Token 费用追踪
│
├── commands/                # 斜杠命令实现 (~50)
├── tools/                   # Agent 工具实现 (~40)
├── components/              # Ink UI 组件 (~140)
├── hooks/                   # React Hooks
├── services/                # 外部服务集成
├── screens/                 # 全屏 UI (Doctor, REPL, Resume)
├── types/                   # TypeScript 类型定义
├── utils/                   # 工具函数
│
├── bridge/                  # IDE 集成桥接 (VS Code, JetBrains)
├── coordinator/             # 多 Agent 协调器
├── plugins/                 # 插件系统
├── skills/                  # 技能系统
├── keybindings/             # 快捷键配置
├── vim/                     # Vim 模式
├── voice/                   # 语音输入
├── remote/                  # 远程会话
├── server/                  # 服务器模式
├── memdir/                  # 记忆目录 (持久化内存)
├── tasks/                   # 任务管理
├── state/                   # 状态管理
├── migrations/              # 配置迁移
├── schemas/                 # 配置模式 (Zod)
├── entrypoints/             # 初始化逻辑
├── ink/                     # Ink 渲染器封装
├── buddy/                   # 伙伴精灵 (彩蛋)
├── native-ts/               # 原生 TypeScript 工具
├── outputStyles/            # 输出样式
├── query/                   # 查询管道
└── upstreamproxy/           # 代理配置
```

---

## 核心架构

### 1. 工具系统 (`src/tools/`)

Claude Code 可调用的每个工具都实现为自包含模块。每个工具定义其输入模式、权限模型和执行逻辑。

| 工具 | 描述 |
| ---- | ---- |
| `BashTool` | Shell 命令执行 |
| `FileReadTool` | 文件读取 (图片、PDF、笔记本) |
| `FileWriteTool` | 文件创建/覆盖 |
| `FileEditTool` | 部分文件修改 (字符串替换) |
| `GlobTool` | 文件模式匹配搜索 |
| `GrepTool` | 基于 ripgrep 的内容搜索 |
| `WebFetchTool` | 获取 URL 内容 |
| `WebSearchTool` | 网络搜索 |
| `AgentTool` | 子 Agent 派生 |
| `SkillTool` | 技能执行 |
| `MCPTool` | MCP 服务器工具调用 |
| `LSPTool` | 语言服务器协议集成 |
| `NotebookEditTool` | Jupyter 笔记本编辑 |
| `TaskCreateTool` / `TaskUpdateTool` | 任务创建和管理 |
| `SendMessageTool` | Agent 间消息传递 |
| `TeamCreateTool` / `TeamDeleteTool` | 团队 Agent 管理 |
| `EnterPlanModeTool` / `ExitPlanModeTool` | 计划模式切换 |
| `EnterWorktreeTool` / `ExitWorktreeTool` | Git worktree 隔离 |
| `ToolSearchTool` | 延迟工具发现 |
| `CronCreateTool` | 定时触发器创建 |
| `RemoteTriggerTool` | 远程触发器 |
| `SleepTool` | 主动模式等待 |
| `SyntheticOutputTool` | 结构化输出生成 |

### 2. 命令系统 (`src/commands/`)

用户面向的斜杠命令，以 `/` 前缀调用。

| 命令 | 描述 |
| ---- | ---- |
| `/commit` | 创建 git 提交 |
| `/review` | 代码审查 |
| `/compact` | 上下文压缩 |
| `/mcp` | MCP 服务器管理 |
| `/config` | 设置管理 |
| `/doctor` | 环境诊断 |
| `/login` / `/logout` | 身份验证 |
| `/memory` | 持久化内存管理 |
| `/skills` | 技能管理 |
| `/tasks` | 任务管理 |
| `/vim` | Vim 模式切换 |
| `/diff` | 查看更改 |
| `/cost` | 查看使用费用 |
| `/theme` | 更改主题 |
| `/context` | 上下文可视化 |
| `/pr_comments` | 查看 PR 评论 |
| `/resume` | 恢复之前的会话 |
| `/share` | 分享会话 |
| `/desktop` | 桌面应用交接 |
| `/mobile` | 移动应用交接 |

### 3. 服务层 (`src/services/`)

| 服务 | 描述 |
| ---- | ---- |
| `api/` | Anthropic API 客户端、文件 API、引导程序 |
| `mcp/` | 模型上下文协议服务器连接和管理 |
| `oauth/` | OAuth 2.0 认证流程 |
| `lsp/` | 语言服务器协议管理器 |
| `analytics/` | 基于 GrowthBook 的功能标志和分析 |
| `plugins/` | 插件加载器 |
| `compact/` | 会话上下文压缩 |
| `policyLimits/` | 组织策略限制 |
| `remoteManagedSettings/` | 远程托管设置 |
| `extractMemories/` | 自动记忆提取 |
| `tokenEstimation.ts` | Token 数量估算 |
| `teamMemorySync/` | 团队记忆同步 |

### 4. 桥接系统 (`src/bridge/`)

连接 IDE 扩展 (VS Code、JetBrains) 与 Claude Code CLI 的双向通信层。

- **`bridgeMain.ts`** — 桥接主循环
- **`bridgeMessaging.ts`** — 消息协议
- **`bridgePermissionCallbacks.ts`** — 权限回调
- **`replBridge.ts`** — REPL 会话桥接
- **`jwtUtils.ts`** — 基于 JWT 的认证
- **`sessionRunner.ts`** — 会话执行管理

### 5. 权限系统 (`src/hooks/toolPermission/`)

在每次工具调用时检查权限。根据配置的权限模式 (`default`、`plan`、`bypassPermissions`、`auto` 等) 提示用户批准/拒绝或自动解析。

### 6. 功能标志

通过 Bun 的 `bun:bundle` 功能标志实现死代码消除：

```typescript
import { feature } from 'bun:bundle'

// 非活动代码在构建时会被完全剥离
const voiceCommand = feature('VOICE_MODE')
  ? require('./commands/voice/index.js').default
  : null
```

Notable flags: `PROACTIVE`, `KAIROS`, `BRIDGE_MODE`, `DAEMON`, `VOICE_MODE`, `AGENT_TRIGGERS`, `MONITOR_TOOL`

---

## 关键文件详解

### `QueryEngine.ts` (~46K 行)

LLM API 调用的核心引擎。处理流式响应、工具调用循环、思考模式、重试逻辑和 Token 计数。

### `Tool.ts` (~29K 行)

定义所有工具的基础类型和接口 — 输入模式、权限模型和进度状态类型。

### `commands.ts` (~25K 行)

管理所有斜杠命令的注册和执行。使用条件导入根据环境加载不同的命令集。

### `main.tsx`

基于 Commander.js 的 CLI 解析器 + React/Ink 渲染器初始化。启动时并行化 MDM 设置、keychain 预取和 GrowthBook 初始化，以加快启动速度。

---

## 技术栈

| 类别 | 技术 |
| ---- | ---- |
| **运行时** | Bun |
| **语言** | TypeScript (严格模式) |
| **终端 UI** | React + Ink |
| **CLI 解析** | Commander.js (extra-typings) |
| **模式验证** | Zod v4 |
| **代码搜索** | ripgrep (通过 GrepTool) |
| **协议** | MCP SDK, LSP |
| **API** | Anthropic SDK |
| **遥测** | OpenTelemetry + gRPC |
| **功能标志** | GrowthBook |
| **认证** | OAuth 2.0, JWT, macOS Keychain |

---

## 值得注意的设计模式

### 并行预取

启动时间通过并行预取 MDM 设置、keychain 读取和 API 预连接进行优化——在重型模块评估开始之前执行。

```typescript
// main.tsx — 在其他导入之前作为副作用触发
startMdmRawRead()
startKeychainPrefetch()
```

### 延迟加载

重型模块 (OpenTelemetry ~400KB, gRPC ~700KB) 通过动态 `import()` 延迟到真正需要时才加载。

### Agent 群体

子 Agent 通过 `AgentTool` 派生，`coordinator/` 处理多 Agent 编排。`TeamCreateTool` 支持团队级并行工作。

### 技能系统

可重用的工作流定义在 `skills/` 中，通过 `SkillTool` 执行。用户可以添加自定义技能。

### 插件架构

内置和第三方插件通过 `plugins/` 子系统加载。

---

## 免责声明

本仓库存档的源码于 **2026年3月31日** 从 Anthropic 的 npm 注册表泄露。所有原始源码均为 **Anthropic** 的财产。
