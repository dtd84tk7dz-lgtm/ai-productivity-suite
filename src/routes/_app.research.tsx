import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, Sparkles } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PageHeader } from "@/components/page-header";
import { OutputPanel } from "@/components/output-panel";
import { researchAssist } from "@/lib/ai.functions";
import { useSessionStore } from "@/lib/session-store";

const MODES = [
  "Summary",
  "Key Insights",
  "Recommendations",
  "Action Items",
  "Executive Summary",
  "Important Facts",
  "Key Statistics",
] as const;

export const Route = createFileRoute("/_app/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — AI Workplace" },
      {
        name: "description",
        content: "Summarize topics, articles, and reports. Extract insights and action items.",
      },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<(typeof MODES)[number]>("Summary");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const run = useServerFn(researchAssist);
  const addHistory = useSessionStore((s) => s.addHistory);

  const generate = async () => {
    if (!input.trim()) {
      toast.error("Enter a topic or paste text to analyze.");
      return;
    }
    setLoading(true);
    try {
      const res = await run({ data: { input, mode } });
      setOutput(res.text);
      addHistory({
        type: "Research",
        title: `${mode}: ${input.slice(0, 60)}`,
        content: res.text,
      });
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="AI Research Assistant"
        description="Summarize topics or pasted text. Switch modes to get insights, recommendations, action items, and more."
        icon={BookOpen}
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <Tabs value={mode} onValueChange={(v) => setMode(v as (typeof MODES)[number])}>
            <TabsList className="mb-3 flex h-auto flex-wrap justify-start gap-1 bg-muted/50 p-1">
              {MODES.map((m) => (
                <TabsTrigger key={m} value={m} className="text-xs">
                  {m}
                </TabsTrigger>
              ))}
            </TabsList>
            {MODES.map((m) => (
              <TabsContent key={m} value={m} className="mt-0">
                <div className="text-xs text-muted-foreground mb-2">
                  Enter a topic (e.g. "AI in HR") or paste article/report text.
                </div>
              </TabsContent>
            ))}
          </Tabs>
          <Textarea
            rows={16}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste an article, report, or type a topic..."
            className="font-mono text-sm"
          />
          <div className="mt-4 flex gap-2">
            <Button onClick={generate} disabled={loading}>
              <Sparkles className="mr-1 h-4 w-4" />
              {loading ? "Analyzing..." : `Generate ${mode}`}
            </Button>
            <Button variant="outline" onClick={() => setInput("")} disabled={!input}>
              Clear
            </Button>
          </div>
        </Card>
        <OutputPanel
          value={output}
          onChange={setOutput}
          loading={loading}
          onRegenerate={generate}
          onClear={() => setOutput("")}
          filename={`research-${mode.toLowerCase().replace(/\s+/g, "-")}`}
          emptyHint="Enter content and click Generate."
        />
      </div>
    </div>
  );
}