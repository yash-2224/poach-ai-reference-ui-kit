import { useRef, useState, type ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { CheckIcon, CopySimpleIcon } from "@phosphor-icons/react";
import { toast } from "sonner";
import { MermaidDiagram } from "./MermaidDiagram";
import { cn } from "@/lib/utils";

/** Copies text and briefly flips the icon to a check. */
export function useCopy() {
  const [copied, setCopied] = useState(false);
  const copy = async (text: string, html?: string) => {
    try {
      if (html && typeof ClipboardItem !== "undefined" && navigator.clipboard.write) {
        await navigator.clipboard.write([
          new ClipboardItem({
            "text/html": new Blob([html], { type: "text/html" }),
            "text/plain": new Blob([text], { type: "text/plain" }),
          }),
        ]);
      } else {
        await navigator.clipboard.writeText(text);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      toast.error("Couldn't copy — your browser blocked it");
    }
  };
  return { copied, copy };
}

function MiniCopy({ onCopy, label, copied }: { onCopy: () => void; label: string; copied: boolean }) {
  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label={label}
      className="flex h-7 cursor-pointer items-center gap-1.5 rounded-lg px-2 text-[11.5px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      {copied ? <CheckIcon weight="bold" className="size-3.5 text-success" /> : <CopySimpleIcon className="size-3.5" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function CodeBlock({ lang, code }: { lang: string; code: string }) {
  const { copied, copy } = useCopy();
  return (
    <div className="my-4 overflow-hidden rounded-xl bg-muted/45 shadow-engraved">
      <div className="flex h-9 items-center justify-between border-b border-border/70 pr-1.5 pl-3.5">
        <span className="text-[11.5px] font-medium text-muted-foreground">{lang || "code"}</span>
        <MiniCopy onCopy={() => copy(code)} label="Copy code" copied={copied} />
      </div>
      <pre className="overflow-x-auto px-3.5 py-3 font-mono text-[12.5px] leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function MermaidBlock({ code }: { code: string }) {
  const { copied, copy } = useCopy();
  return (
    <div className="my-4 overflow-hidden rounded-xl bg-card shadow-engraved">
      <div className="flex h-9 items-center justify-between border-b border-border/70 pr-1.5 pl-3.5">
        <span className="text-[11.5px] font-medium text-muted-foreground">Diagram</span>
        <MiniCopy onCopy={() => copy(code)} label="Copy diagram code" copied={copied} />
      </div>
      <MermaidDiagram code={code} className="p-4" />
    </div>
  );
}

function TableBlock({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLTableElement>(null);
  const { copied, copy } = useCopy();
  const asCsv = () => {
    const rows = Array.from(ref.current?.rows ?? []).map((r) =>
      Array.from(r.cells)
        .map((c) => {
          const s = c.innerText.trim();
          return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
        })
        .join(","),
    );
    return rows.join("\n");
  };
  return (
    <div className="group/table relative my-4">
      <div className="overflow-x-auto rounded-xl bg-card shadow-engraved">
        <table ref={ref} className="w-full border-collapse text-left text-[13px]">
          {children}
        </table>
      </div>
      <div className="absolute -top-3 right-2 opacity-0 transition-opacity group-hover/table:opacity-100 [@media(hover:none)]:opacity-100">
        <div className="rounded-lg bg-popover shadow-float">
          <MiniCopy onCopy={() => copy(asCsv(), ref.current?.outerHTML)} label="Copy table" copied={copied} />
        </div>
      </div>
    </div>
  );
}

const components: Components = {
  p: ({ children }) => <p className="my-3 first:mt-0 last:mb-0">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  del: ({ children }) => <del className="text-muted-foreground">{children}</del>,
  h1: ({ children }) => <h3 className="mt-5 mb-2 text-[19px] font-semibold first:mt-0">{children}</h3>,
  h2: ({ children }) => <h3 className="mt-5 mb-2 text-[17px] font-semibold first:mt-0">{children}</h3>,
  h3: ({ children }) => <h4 className="mt-4 mb-1.5 text-[15.5px] font-semibold first:mt-0">{children}</h4>,
  h4: ({ children }) => <h5 className="mt-4 mb-1.5 text-[14.5px] font-semibold first:mt-0">{children}</h5>,
  ul: ({ children, className }) => (
    <ul className={cn("my-3 space-y-1.5 pl-5", className?.includes("contains-task-list") ? "list-none pl-1" : "list-disc marker:text-muted-foreground")}>
      {children}
    </ul>
  ),
  ol: ({ children }) => <ol className="my-3 list-decimal space-y-1.5 pl-5 marker:font-medium marker:text-muted-foreground">{children}</ol>,
  li: ({ children }) => <li className="pl-1 [&>p]:my-1">{children}</li>,
  input: ({ checked }) => (
    <span
      className={cn(
        "mr-2 inline-grid size-4 translate-y-[3px] place-items-center rounded-[5px] align-baseline",
        checked ? "bg-primary text-primary-foreground" : "bg-card shadow-engraved",
      )}
    >
      {checked && <CheckIcon weight="bold" className="size-2.5" />}
    </span>
  ),
  a: ({ children, href }) => (
    <a href={href} target="_blank" rel="noreferrer" className="font-medium text-primary underline decoration-primary/30 underline-offset-[3px] hover:decoration-primary">
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-3 rounded-r-xl border-l-[3px] border-primary/45 bg-primary-soft/40 py-2 pr-3 pl-4 text-secondary-foreground [&>p]:my-1">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-5 border-border" />,
  table: ({ children }) => <TableBlock>{children}</TableBlock>,
  thead: ({ children }) => <thead className="bg-muted/50 text-[12px] font-semibold text-muted-foreground">{children}</thead>,
  th: ({ children, style }) => <th style={style} className="px-3.5 py-2.5 whitespace-nowrap">{children}</th>,
  td: ({ children, style }) => <td style={style} className="tabular border-t border-border/70 px-3.5 py-2.5">{children}</td>,
  pre: ({ children }) => <>{children}</>,
  code: ({ className, children }) => {
    const raw = String(children ?? "");
    const lang = /language-([\w-]+)/.exec(className ?? "")?.[1] ?? "";
    const block = !!lang || raw.includes("\n");
    if (!block) {
      return <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.88em] text-foreground">{children}</code>;
    }
    const code = raw.replace(/\n$/, "");
    if (lang === "mermaid") return <MermaidBlock code={code} />;
    return <CodeBlock lang={lang} code={code} />;
  },
};

/* ---------- Word-by-word "lens" reveal (while Ava writes) ---------- */

interface HNode {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HNode[];
}

/** Wraps every word (outside code blocks) in `<span class="ava-word">`; new spans fade in from blur via CSS. */
function rehypeWords() {
  const walk = (node: HNode) => {
    if (!node.children) return;
    if (node.type === "element" && (node.tagName === "code" || node.tagName === "pre")) return;
    const out: HNode[] = [];
    for (const c of node.children) {
      if (c.type === "text" && c.value && /\S/.test(c.value)) {
        for (const part of c.value.split(/(\s+)/)) {
          if (!part) continue;
          if (/^\s+$/.test(part)) out.push({ type: "text", value: part });
          else out.push({ type: "element", tagName: "span", properties: { className: ["ava-word"] }, children: [{ type: "text", value: part }] });
        }
      } else {
        walk(c);
        out.push(c);
      }
    }
    node.children = out;
  };
  return (tree: HNode) => walk(tree);
}

/** ChatGPT-style Markdown for Ava: bold, italics, lists, tables, code, quotes, task lists, Mermaid. */
export function AvaMarkdown({ text, className, animateWords = false }: { text: string; className?: string; animateWords?: boolean }) {
  return (
    <div className={cn("ava-prose min-w-0 text-[14.5px] leading-[1.7] [overflow-wrap:anywhere]", className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={animateWords ? [rehypeWords] : []} components={components}>
        {text}
      </ReactMarkdown>
    </div>
  );
}
