import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Copy, Download, Printer, RefreshCw, Trash2, Pencil, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export function OutputPanel({
  value,
  onChange,
  loading,
  onRegenerate,
  onClear,
  filename = "output",
  emptyHint = "Your generated content will appear here.",
}: {
  value: string;
  onChange: (v: string) => void;
  loading?: boolean;
  onRegenerate?: () => void;
  onClear?: () => void;
  filename?: string;
  emptyHint?: string;
}) {
  const [editing, setEditing] = useState(false);
  useEffect(() => {
    if (!value) setEditing(false);
  }, [value]);

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    toast.success("Copied to clipboard");
  };
  const download = () => {
    const blob = new Blob([value], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };
  const print = () => {
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(
      `<pre style="font-family:ui-sans-serif,system-ui;padding:2rem;white-space:pre-wrap">${value.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c] as string))}</pre>`,
    );
    w.document.close();
    w.print();
  };

  return (
    <div className="flex h-full flex-col rounded-xl border bg-card shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b p-3">
        <div className="text-sm font-medium">Output</div>
        <div className="flex flex-wrap items-center gap-1">
          <Button size="sm" variant="ghost" onClick={() => setEditing((e) => !e)} disabled={!value}>
            {editing ? <Check className="mr-1 h-3.5 w-3.5" /> : <Pencil className="mr-1 h-3.5 w-3.5" />}
            {editing ? "Done" : "Edit"}
          </Button>
          <Button size="sm" variant="ghost" onClick={copy} disabled={!value}>
            <Copy className="mr-1 h-3.5 w-3.5" /> Copy
          </Button>
          <Button size="sm" variant="ghost" onClick={download} disabled={!value}>
            <Download className="mr-1 h-3.5 w-3.5" /> Download
          </Button>
          <Button size="sm" variant="ghost" onClick={print} disabled={!value}>
            <Printer className="mr-1 h-3.5 w-3.5" /> Print
          </Button>
          {onRegenerate && (
            <Button size="sm" variant="ghost" onClick={onRegenerate} disabled={loading || !value}>
              <RefreshCw className="mr-1 h-3.5 w-3.5" /> Regenerate
            </Button>
          )}
          {onClear && (
            <Button size="sm" variant="ghost" onClick={onClear} disabled={!value}>
              <Trash2 className="mr-1 h-3.5 w-3.5" /> Clear
            </Button>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4">
        {loading && !value ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ) : editing ? (
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="min-h-[420px] font-mono text-sm"
          />
        ) : value ? (
          <article className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap [&_h1]:mt-0">
            <ReactMarkdown>{value}</ReactMarkdown>
          </article>
        ) : (
          <div className="grid h-full min-h-[280px] place-items-center text-center text-sm text-muted-foreground">
            {emptyHint}
          </div>
        )}
      </div>
    </div>
  );
}