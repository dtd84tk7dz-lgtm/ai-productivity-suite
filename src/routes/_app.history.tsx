import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { History, Copy, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PageHeader } from "@/components/page-header";
import { useSessionStore, type HistoryEntry } from "@/lib/session-store";
import ReactMarkdown from "react-markdown";

export const Route = createFileRoute("/_app/history")({
  head: () => ({
    meta: [
      { title: "Session History — AI Workplace" },
      { name: "description", content: "AI outputs generated during this browser session." },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const { history, removeHistory, clearHistory } = useSessionStore();
  const [viewing, setViewing] = useState<HistoryEntry | null>(null);

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="History"
        description="Session-only history. Nothing is saved permanently — clearing your browser session removes everything."
        icon={History}
        actions={
          <Button
            variant="outline"
            onClick={() => {
              clearHistory();
              toast.success("Session history cleared");
            }}
            disabled={history.length === 0}
          >
            <Trash2 className="mr-1 h-4 w-4" /> Clear session history
          </Button>
        }
      />
      <Card className="divide-y p-0">
        {history.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">
            No history yet. Generate content from any AI tool to see it here.
          </div>
        ) : (
          history.map((h) => (
            <div key={h.id} className="flex items-start justify-between gap-4 p-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-primary">
                    {h.type}
                  </span>
                  <span className="truncate text-sm font-medium">{h.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(h.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                  {h.content.slice(0, 240)}
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button size="sm" variant="ghost" onClick={() => setViewing(h)}>
                  <Eye className="mr-1 h-3.5 w-3.5" /> View
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    navigator.clipboard.writeText(h.content);
                    toast.success("Copied");
                  }}
                >
                  <Copy className="mr-1 h-3.5 w-3.5" /> Copy
                </Button>
                <Button size="sm" variant="ghost" onClick={() => removeHistory(h.id)}>
                  <Trash2 className="mr-1 h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))
        )}
      </Card>
      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>{viewing?.title}</DialogTitle>
          </DialogHeader>
          {viewing && (
            <article className="prose prose-sm prose-ai max-w-none">
              <ReactMarkdown>{viewing.content}</ReactMarkdown>
            </article>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}