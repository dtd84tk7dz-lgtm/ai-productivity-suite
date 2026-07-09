import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Wand2, Sparkles } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/page-header";
import { OutputPanel } from "@/components/output-panel";
import { generateDocument } from "@/lib/ai.functions";
import { useSessionStore } from "@/lib/session-store";

const TYPES = [
  "Professional Email",
  "Report",
  "Business Proposal",
  "Meeting Notes",
  "Meeting Agenda",
  "Project Plan",
  "SOP",
  "Policy Document",
  "Checklist",
  "Business Letter",
  "Training Material",
  "Presentation Outline",
  "Executive Summary",
  "Custom Document",
];

const TEMPLATES: Record<string, string> = {
  "Project Plan": "Include objectives, scope, milestones, timeline, risks, and stakeholders.",
  "Meeting Notes": "Include date, attendees, agenda, decisions, action items with owners.",
  "Business Proposal": "Include executive summary, problem, solution, pricing, timeline, and next steps.",
  Report: "Include background, methodology, findings, analysis, and recommendations.",
  SOP: "Include purpose, scope, responsibilities, step-by-step procedure, and references.",
};

export const Route = createFileRoute("/_app/generator")({
  head: () => ({
    meta: [
      { title: "Smart AI Generator — AI Workplace" },
      {
        name: "description",
        content: "Generate workplace documents: proposals, reports, plans, SOPs, and more.",
      },
    ],
  }),
  component: GeneratorPage,
});

function GeneratorPage() {
  const [form, setForm] = useState({
    type: "Report",
    topic: "",
    audience: "",
    tone: "Professional",
    length: "Medium" as "Short" | "Medium" | "Long" | "Detailed",
    context: "",
    instructions: "",
  });
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const gen = useServerFn(generateDocument);
  const addHistory = useSessionStore((s) => s.addHistory);

  const update = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const applyTemplate = () => {
    const tmpl = TEMPLATES[form.type];
    if (tmpl) update("instructions", tmpl);
    else toast.info("No template for this type — add your own instructions.");
  };

  const generate = async () => {
    if (!form.topic.trim()) {
      toast.error("Add a topic first.");
      return;
    }
    setLoading(true);
    try {
      const res = await gen({ data: form });
      setOutput(res.text);
      addHistory({ type: "Document", title: `${form.type}: ${form.topic}`, content: res.text });
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Smart AI Generator"
        description="Create polished workplace documents. Customize type, tone, audience, length, and instructions."
        icon={Wand2}
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <div className="grid gap-4">
            <div className="grid gap-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Document type</Label>
              <Select value={form.type} onValueChange={(v) => update("type", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  {TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Topic</Label>
              <Input
                value={form.topic}
                onChange={(e) => update("topic", e.target.value)}
                placeholder="e.g. Migration to a new CRM"
              />
            </div>
            <div className="grid gap-1.5 sm:grid-cols-2 sm:gap-4">
              <div className="grid gap-1.5">
                <Label className="text-xs font-medium text-muted-foreground">Audience</Label>
                <Input
                  value={form.audience}
                  onChange={(e) => update("audience", e.target.value)}
                  placeholder="Executives, engineering team..."
                />
              </div>
              <div className="grid gap-1.5">
                <Label className="text-xs font-medium text-muted-foreground">Tone</Label>
                <Input
                  value={form.tone}
                  onChange={(e) => update("tone", e.target.value)}
                  placeholder="Professional"
                />
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Length</Label>
              <Select
                value={form.length}
                onValueChange={(v) => update("length", v as typeof form.length)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(["Short", "Medium", "Long", "Detailed"] as const).map((l) => (
                    <SelectItem key={l} value={l}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Context</Label>
              <Textarea
                rows={3}
                value={form.context}
                onChange={(e) => update("context", e.target.value)}
                placeholder="Any relevant background."
              />
            </div>
            <div className="grid gap-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium text-muted-foreground">
                  Additional instructions
                </Label>
                <Button size="sm" variant="ghost" onClick={applyTemplate} className="h-7 text-xs">
                  Use template
                </Button>
              </div>
              <Textarea
                rows={3}
                value={form.instructions}
                onChange={(e) => update("instructions", e.target.value)}
                placeholder="Sections to include, formatting rules, etc."
              />
            </div>
            <Button onClick={generate} disabled={loading}>
              <Sparkles className="mr-1 h-4 w-4" />
              {loading ? "Generating..." : "Generate document"}
            </Button>
          </div>
        </Card>
        <OutputPanel
          value={output}
          onChange={setOutput}
          loading={loading}
          onRegenerate={generate}
          onClear={() => setOutput("")}
          filename={form.type.toLowerCase().replace(/\s+/g, "-")}
          emptyHint="Pick a document type, add a topic, and click Generate."
        />
      </div>
    </div>
  );
}