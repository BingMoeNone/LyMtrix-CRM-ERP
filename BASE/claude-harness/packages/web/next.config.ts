import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { resolve } from "path";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  transpilePackages: ["@claude-harness/source"],
  outputFileTracingRoot: resolve(__dirname, "../../"),
  outputFileTracingIncludes: {
    "/[locale]/articles/[slug]": ["../../content/articles/**/*.mdx"],
    "/[locale]/articles": ["../../content/articles/**/*.mdx"],
    "/[locale]/code": ["../../packages/claude-code-source/src/**/*"],
  },
  serverExternalPackages: ["shiki"],
};

export default withNextIntl(nextConfig);
