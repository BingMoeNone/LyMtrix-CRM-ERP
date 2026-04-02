[English](./README.md) | [中文](./README-zh.md)

# Claude Harness

> Deconstructing Claude Code — interactive source code analysis, guided walkthroughs, and deep architectural exploration.

**Claude Harness** is an open-source platform for exploring and understanding the internals of [Claude Code](https://docs.anthropic.com/en/docs/claude-code), Anthropic's official AI coding agent. Through interactive code browsing, in-depth technical articles, and module-level analysis, it transforms 500K+ lines of TypeScript into an accessible learning experience.

## Why This Project Exists

Claude Code is one of the most sophisticated AI agent harnesses ever built — a masterclass in tool design, context management, permission governance, and multi-agent coordination. But understanding its architecture from raw source alone is daunting.

Claude Harness makes that architecture legible. It provides:

- **Guided articles** that walk through each subsystem with real code references
- **Interactive code browser** with syntax highlighting and full-text search
- **Module visualizations** that reveal the structural relationships in the codebase

Whether you're building your own AI agent, studying harness engineering patterns, or simply curious about how Claude Code works under the hood — this project is for you.

## At a Glance

| Metric | Value |
|--------|-------|
| Source Files Analyzed | **1,902** |
| Lines of Code | **514,587** |
| Modules Mapped | **35** |
| Technical Articles | **31+** |
| Languages | English, 中文, 日本語 |

## Key Features

### Interactive Code Browser

Browse the full Claude Code source tree with a file explorer, syntax highlighting powered by [Shiki](https://shiki.matsu.io/), and instant client-side search via [FlexSearch](https://github.com/nextapps-de/flexsearch).

### In-Depth Technical Articles

31 guided walkthroughs covering every major subsystem:

| # | Article | Topic |
|---|---------|-------|
| 01 | Architecture Overview | High-level structure and design philosophy |
| 02 | Query Engine | Core inference loop and message handling |
| 03 | Tool System | ~40 tool implementations and dispatch |
| 04 | Streaming & Execution | Real-time streaming tool executor |
| 05 | Permission System | Trust boundaries and approval workflows |
| 06 | Context Management | Compression, windowing, token budgets |
| 07 | Startup Performance | Fast cold-start initialization |
| 08 | Multi-Agent System | Subagent spawning and coordination |
| 09 | Memory System | Persistent context across sessions |
| 10 | Bridge System | VS Code & JetBrains IDE integration |
| 11 | MCP Integration | Model Context Protocol servers |
| 12 | Plugins & Skills | Extensible skill loading system |
| 13 | Authentication | OAuth, API keys, and session management |
| 14 | Terminal UI | Ink-based reactive terminal interface |
| 15 | Keybindings & Vim | Keyboard shortcuts and vim mode |
| 16 | Screens | Full-screen UI system |
| 17 | State Management | Reactive state and stores |
| 18 | Telemetry | Usage tracking and analytics |
| 19 | Config System | Settings, profiles, and defaults |
| 20 | Feature Flags | Gradual rollout and experimentation |
| 21 | File Operations | Read, write, edit, glob, grep |
| 22 | Bash Tool | Shell execution and sandboxing |
| 23 | Search System | Code search and file discovery |
| 24 | Web Tools | Browser and web interaction |
| 25 | LSP Integration | Language Server Protocol support |
| 26 | Buddy System | Pair programming features |
| 27 | Output Styles | Formatting and rendering |
| 28 | Remote Execution | Remote agent triggers |
| 29 | Session Management | Conversation persistence |
| 30 | API Client | Anthropic API communication layer |
| 31 | Error Recovery | Resilience and retry strategies |

### Module Explorer

Visualize the 35 major modules with file counts, line counts, and descriptions:

```
utils          564 files   181K lines   Utility functions
components     389 files    82K lines   Ink UI components (~140)
services       130 files    54K lines   External service integrations
tools          184 files    51K lines   Agent tool implementations (~40)
commands       207 files    27K lines   Slash commands (~50)
hooks          104 files    19K lines   React hooks
ink             96 files    20K lines   Ink renderer wrapper
...and 28 more
```

### Multi-Language Support

Full internationalization with English, Chinese (中文), and Japanese (日本語) — with locale-aware routing and automatic fallback.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 15](https://nextjs.org/) (App Router) |
| UI | [React 19](https://react.dev/) + [Tailwind CSS 4](https://tailwindcss.com/) |
| Code Highlighting | [Shiki](https://shiki.matsu.io/) |
| Search | [FlexSearch](https://github.com/nextapps-de/flexsearch) |
| Articles | [MDX](https://mdxjs.com/) via next-mdx-remote |
| i18n | [next-intl](https://next-intl.dev/) |
| Animations | [Motion](https://motion.dev/) |
| Diagrams | [Mermaid](https://mermaid.js.org/) |
| Monorepo | [Turbo](https://turbo.build/) |
| Deployment | [Vercel](https://vercel.com/) |

## Getting Started

### Prerequisites

- **Node.js 22+** (see `.node-version`)
- **pnpm** (or npm)

### Installation

```bash
# Clone the repository
git clone https://github.com/anthropics/claude-harness.git
cd claude-harness

# Install dependencies
pnpm install

# Generate metadata (file tree, module stats, search index)
pnpm generate

# Start development server
pnpm dev
```

The app will be available at `http://localhost:3000`.

### Build for Production

```bash
pnpm build
```

## Project Structure

```
claude-harness/
├── content/
│   └── articles/
│       ├── en/                    # English articles
│       ├── zh/                    # Chinese articles (31 guides)
│       └── ja/                    # Japanese articles
│
├── packages/
│   ├── claude-code-source/        # Claude Code source archive (read-only)
│   │   └── src/
│   │       ├── commands/          # ~50 slash commands
│   │       ├── tools/             # ~40 agent tools
│   │       ├── components/        # ~140 Ink UI components
│   │       ├── services/          # External integrations
│   │       ├── bridge/            # IDE integration (VS Code, JetBrains)
│   │       ├── hooks/             # React hooks
│   │       └── ...               # 35 modules total
│   │
│   ├── scripts/                   # Metadata generation pipeline
│   │   └── src/
│   │       ├── generate-file-tree.ts
│   │       ├── generate-module-stats.ts
│   │       ├── generate-search-index.ts
│   │       └── generate-source-summary.ts
│   │
│   └── web/                       # Next.js web application
│       └── src/
│           ├── app/[locale]/      # Locale-aware pages
│           │   ├── articles/      # Article list & detail
│           │   ├── code/          # Interactive code browser
│           │   └── modules/       # Module explorer
│           ├── components/        # Shared UI components
│           ├── lib/               # Utilities & data loading
│           └── i18n/              # Internationalization config
│
├── turbo.json                     # Turbo monorepo config
├── vercel.json                    # Vercel deployment config
└── package.json                   # Root workspace config
```

## Data Generation Pipeline

The `pnpm generate` command runs four scripts that process the Claude Code source into structured metadata:

1. **File Tree** — Recursively scans the source directory into a hierarchical JSON tree (1,902 entries)
2. **Module Stats** — Analyzes 35 top-level modules with file/line counts
3. **Source Summary** — Aggregates totals across the entire codebase
4. **Search Index** — Builds a full-text FlexSearch index for client-side search

These generated files power the web UI's code browser, module explorer, and search functionality.

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Web Application                    │
│  ┌──────────┐  ┌──────────┐  ┌────────┐  ┌───────┐ │
│  │ Articles  │  │   Code   │  │Modules │  │Search │ │
│  │  (MDX)   │  │ Browser  │  │Explorer│  │(Flex) │ │
│  └────┬─────┘  └────┬─────┘  └───┬────┘  └───┬───┘ │
│       │              │            │            │      │
│  ┌────▼──────────────▼────────────▼────────────▼───┐ │
│  │              Generated Metadata                  │ │
│  │  file-tree.json · module-stats.json · search idx │ │
│  └────────────────────┬────────────────────────────┘ │
└───────────────────────┼──────────────────────────────┘
                        │
              ┌─────────▼─────────┐
              │  Generation Scripts │
              │  (packages/scripts) │
              └─────────┬─────────┘
                        │
              ┌─────────▼─────────┐
              │  Claude Code Source │
              │  (read-only archive)│
              │  1,902 files · 514K │
              └───────────────────┘
```

## Contributing

Contributions are welcome! Here are some ways to help:

- **Add articles** — Write new technical walkthroughs in `content/articles/`
- **Translate** — Help expand English and Japanese article coverage
- **Improve UI** — Enhance the code browser, module explorer, or search experience
- **Fix bugs** — Check the Issues tab for open items

### Writing Articles

Articles are MDX files in `content/articles/{locale}/`. Each file needs frontmatter:

```mdx
---
title: "Your Article Title"
description: "Brief description"
order: 32
tags: ["tag1", "tag2"]
readTime: "15 min"
---

Your content here...
```

## Related Projects

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) — Anthropic's official AI coding agent
- [Learn Claude Code](https://github.com/shareAI-lab/learn-claude-code) — Harness engineering course with hands-on sessions

## License

MIT
