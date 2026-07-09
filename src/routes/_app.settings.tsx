import { createFileRoute } from "@tanstack/react-router";
import { Settings as SettingsIcon, RotateCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/page-header";
import { usePreferences, useSessionStore } from "@/lib/session-store";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({
    meta: [
      { title: "Settings — AI Workplace" },
      { name: "description", content: "Application preferences." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const prefs = usePreferences();
  const clearHistory = useSessionStore((s) => s.clearHistory);

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Settings"
        description="Application preferences only. No account or profile settings."
        icon={SettingsIcon}
      />
      <Card className="p-6">
        <Row label="Theme" desc="Choose light, dark, or match your OS.">
          <Select value={prefs.theme} onValueChange={(v) => prefs.setPref("theme", v as never)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </Row>
        <Separator className="my-5" />
        <Row label="AI response length" desc="Default length for generated content.">
          <Select
            value={prefs.responseLength}
            onValueChange={(v) => prefs.setPref("responseLength", v as never)}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Short">Short</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Long">Long</SelectItem>
            </SelectContent>
          </Select>
        </Row>
        <Separator className="my-5" />
        <Row
          label="Creativity level"
          desc={`Higher values produce more varied output. (${prefs.creativity.toFixed(2)})`}
        >
          <div className="w-52">
            <Slider
              value={[prefs.creativity]}
              min={0}
              max={1}
              step={0.05}
              onValueChange={(v) => prefs.setPref("creativity", v[0])}
            />
          </div>
        </Row>
        <Separator className="my-5" />
        <Row label="Language" desc="Preferred output language.">
          <Select value={prefs.language} onValueChange={(v) => prefs.setPref("language", v)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["English", "Spanish", "French", "German", "Portuguese", "Italian", "Japanese"].map(
                (l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
        </Row>
        <Separator className="my-5" />
        <Row label="Default email tone" desc="Applied when opening the Email Generator.">
          <Select
            value={prefs.defaultEmailTone}
            onValueChange={(v) => prefs.setPref("defaultEmailTone", v as never)}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Formal">Formal</SelectItem>
              <SelectItem value="Friendly">Friendly</SelectItem>
              <SelectItem value="Persuasive">Persuasive</SelectItem>
            </SelectContent>
          </Select>
        </Row>
        <Separator className="my-5" />
        <Row label="Animations" desc="Toggle interface animations.">
          <Switch
            checked={prefs.animations}
            onCheckedChange={(v) => prefs.setPref("animations", v)}
          />
        </Row>
      </Card>

      <Card className="mt-6 p-6">
        <h3 className="text-sm font-semibold">Session</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage session data and preferences.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => {
              clearHistory();
              toast.success("Session cleared");
            }}
          >
            <Trash2 className="mr-1 h-4 w-4" /> Clear session
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              prefs.reset();
              toast.success("Preferences reset");
            }}
          >
            <RotateCcw className="mr-1 h-4 w-4" /> Reset preferences
          </Button>
        </div>
      </Card>
    </div>
  );
}

function Row({
  label,
  desc,
  children,
}: {
  label: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="min-w-0">
        <div className="text-sm font-medium">{label}</div>
        {desc && <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>}
      </div>
      {children}
    </div>
  );
}