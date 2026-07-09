import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Sparkles } from "lucide-react";
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
import { generateEmail, transformText } from "@/lib/ai.functions";
import { useSessionStore, usePreferences } from "@/lib/session-store";

export const Route = createFileRoute("/_app/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — AI Workplace" },
      {
        name: "description",
        content: "Generate polished professional emails with editable output.",
      },
    ],
  }),
  component: EmailPage,
});

const TRANSFORMS = ["Rewrite", "Improve", "Expand", "Shorten", "Correct Grammar"] as const;

function EmailPage() {
  const defaultTone = usePreferences((s) => s.defaultEmailTone);
  const responseLength = usePreferences((s) => s.responseLength);
  const addHistory = useSessionStore((s) => s.addHistory);
  const [form, setForm] = useState({
    recipient: "",
    subject: "",
    purpose: "",
    context: "",
    keyPoints: "",
    instructions: "",
    tone: defaultTone as "Formal" | "Friendly" | "Persuasive",
  });
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const gen = useServerFn(generateEmail);
  const transform = useServerFn(transformText);

  const update = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const generate = async () => {
    if (!form.purpose && !form.subject && !form.keyPoints) {
      toast.error("Add a purpose, subject, or key points first.");
      return;
    }
    setLoading(true);
    try {
      const res = await gen({ data: { ...form, length: responseLength } });
      setOutput(res.text);
      addHistory({
        type: "Email",
        title: form.subject || form.purpose || "Untitled email",
        content: res.text,
      });
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const runTransform = async (action: (typeof TRANSFORMS)[number]) => {
    if (!output) return;
    setLoading(true);
    try {
      const res = await transform({ data: { text: output, action } });
      setOutput(res.text);
      toast.success(`${action} applied`);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Smart Email Generator"
        description="Generate professional emails. Refine tone, expand, shorten, or correct grammar with one click."
        icon={Mail}
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <div className="grid gap-4">
            <Field label="Recipient">
              <Input
                value={form.recipient}
                onChange={(e) => update("recipient", e.target.value)}
                placeholder="e.g. Marketing team"
              />
            </Field>
            <Field label="Subject">
              <Input
                value={form.subject}
                onChange={(e) => update("subject", e.target.value)}
                placeholder="Q4 campaign kickoff"
              />
            </Field>
            <Field label="Purpose">
              <Input
                value={form.purpose}
                onChange={(e) => update("purpose", e.target.value)}
                placeholder="Announce project timeline"
              />
            </Field>
            <Field label="Context">
              <Textarea
                rows={3}
                value={form.context}
                onChange={(e) => update("context", e.target.value)}
                placeholder="Any background the AI should know."
              />
            </Field>
            <Field label="Key points">
              <Textarea
                rows={3}
                value={form.keyPoints}
                onChange={(e) => update("keyPoints", e.target.value)}
                placeholder="- Kickoff Friday&#10;- Budget approved&#10;- Need feedback by Monday"
              />
            </Field>
            <Field label="Additional instructions">
              <Textarea
                rows={2}
                value={form.instructions}
                onChange={(e) => update("instructions", e.target.value)}
                placeholder="Keep it concise, add a call to action."
              />
            </Field>
            <Field label="Tone">
              <Select
                value={form.tone}
                onValueChange={(v) => update("tone", v as typeof form.tone)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Formal">Formal</SelectItem>
                  <SelectItem value="Friendly">Friendly</SelectItem>
                  <SelectItem value="Persuasive">Persuasive</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <div className="flex flex-wrap gap-2 pt-2">
              <Button onClick={generate} disabled={loading}>
                <Sparkles className="mr-1 h-4 w-4" />
                {loading ? "Generating..." : "Generate"}
              </Button>
              {TRANSFORMS.map((t) => (
                <Button
                  key={t}
                  variant="outline"
                  size="sm"
                  onClick={() => runTransform(t)}
                  disabled={loading || !output}
                >
                  {t}
                </Button>
              ))}
            </div>
          </div>
        </Card>
        <OutputPanel
          value={output}
          onChange={setOutput}
          loading={loading}
          onRegenerate={generate}
          onClear={() => setOutput("")}
          filename="email"
          emptyHint="Fill out the details and click Generate to draft an email."
        />
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}