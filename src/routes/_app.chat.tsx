import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { Copy, RefreshCw, Send, Trash2, MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/page-header";
import { useSessionStore } from "@/lib/session-store";

type Msg = { id: string; role: "user" | "assistant"; content: string; ts: number };

const SUGGESTIONS = [
  "Write a professional email",
  "Summarize this report",
  "Create meeting notes",
  "Draft a proposal",
  "Plan my workday",
  "Generate a project plan",
];

export const Route = createFileRoute("/_app/chat")({
  head: () => ({
    meta: [
      { title: "AI Chatbot — AI Workplace" },
      { name: "description", content: "Chat with an AI assistant for workplace tasks." },
    ],
  }),
  component: ChatPage,
});

function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const addHistory = useSessionStore((s) => s.addHistory);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Msg = { id: crypto.randomUUID(), role: "user", content: text, ts: Date.now() };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);
    const assistantId = crypto.randomUUID();
    setMessages((m) => [...m, { id: assistantId, role: "assistant", content: "", ts: Date.now() }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.map(({ role, content }) => ({ role, content })),
        }),
      });
      if (!res.ok || !res.body) throw new Error(await res.text());
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((m) =>
          m.map((msg) => (msg.id === assistantId ? { ...msg, content: acc } : msg)),
        );
      }
      if (acc) {
        addHistory({ type: "Chat", title: text.slice(0, 60), content: acc });
      }
    } catch (e) {
      toast.error((e as Error).message || "Chat request failed");
      setMessages((m) => m.filter((msg) => msg.id !== assistantId));
    } finally {
      setLoading(false);
    }
  };

  const regenerate = async () => {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUser) return;
    setMessages((m) => {
      // drop last assistant if present
      const copy = [...m];
      if (copy[copy.length - 1]?.role === "assistant") copy.pop();
      return copy;
    });
    await send(lastUser.content);
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-4xl flex-col">
      <PageHeader
        title="AI Chatbot"
        description="Ask anything workplace-related. Get concise, markdown-formatted answers."
        icon={MessageSquare}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={regenerate} disabled={loading || messages.length === 0}>
              <RefreshCw className="mr-1 h-3.5 w-3.5" /> Regenerate
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMessages([])}
              disabled={messages.length === 0}
            >
              <Trash2 className="mr-1 h-3.5 w-3.5" /> Clear
            </Button>
          </>
        }
      />
      <Card className="flex min-h-0 flex-1 flex-col overflow-hidden p-0">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-lg font-semibold">How can I help you today?</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Pick a suggestion or type your own question.
              </p>
              <div className="mt-6 grid w-full max-w-xl gap-2 sm:grid-cols-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-lg border bg-background p-3 text-left text-sm transition hover:border-primary/50 hover:bg-accent/40"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((m) => (
                <div key={m.id} className={m.role === "user" ? "flex justify-end" : ""}>
                  {m.role === "user" ? (
                    <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground shadow-sm">
                      {m.content}
                    </div>
                  ) : (
                    <div className="max-w-[95%]">
                      <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="grid h-5 w-5 place-items-center rounded bg-gradient-to-br from-primary to-primary/70 text-[10px] font-bold text-primary-foreground">
                          A
                        </div>
                        Assistant · {new Date(m.ts).toLocaleTimeString()}
                      </div>
                      {m.content ? (
                        <>
                          <article className="prose prose-sm prose-ai max-w-none">
                            <ReactMarkdown>{m.content}</ReactMarkdown>
                          </article>
                          <div className="mt-2 flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2 text-xs"
                              onClick={() => {
                                navigator.clipboard.writeText(m.content);
                                toast.success("Copied");
                              }}
                            >
                              <Copy className="mr-1 h-3 w-3" /> Copy
                            </Button>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <span className="h-2 w-2 animate-bounce rounded-full bg-primary" style={{ animationDelay: "0ms" }} />
                          <span className="h-2 w-2 animate-bounce rounded-full bg-primary" style={{ animationDelay: "120ms" }} />
                          <span className="h-2 w-2 animate-bounce rounded-full bg-primary" style={{ animationDelay: "240ms" }} />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="border-t bg-background/60 p-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-end gap-2"
          >
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message the AI assistant..."
              rows={1}
              className="max-h-40 min-h-[44px] resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
            />
            <Button type="submit" size="icon" disabled={loading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}