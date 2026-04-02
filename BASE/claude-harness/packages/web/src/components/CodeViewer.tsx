import { codeToHtml } from "shiki";

interface CodeViewerProps {
  code: string;
  filename: string;
}

function getLang(filename: string): string {
  const ext = filename.split(".").pop() || "";
  const map: Record<string, string> = {
    ts: "typescript",
    tsx: "tsx",
    js: "javascript",
    jsx: "jsx",
    json: "json",
    css: "css",
    md: "markdown",
    mdx: "mdx",
    yaml: "yaml",
    yml: "yaml",
  };
  return map[ext] || "text";
}

export async function CodeViewer({ code, filename }: CodeViewerProps) {
  const html = await codeToHtml(code, {
    lang: getLang(filename),
    theme: "github-dark",
  });

  return (
    <div className="overflow-x-auto rounded-lg text-sm">
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
