import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, AlertTriangle, Eye, Scale } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/_app/responsible-ai")({
  head: () => ({
    meta: [
      { title: "Responsible AI — AI Workplace" },
      { name: "description", content: "Guidance on responsible use of AI-generated content." },
    ],
  }),
  component: ResponsibleAiPage,
});

function ResponsibleAiPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Responsible AI"
        description="Use AI thoughtfully. Always review, verify, and edit before sharing."
        icon={ShieldCheck}
      />
      <Card className="border-amber-500/40 bg-amber-500/5 p-6">
        <div className="flex gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div>
            <h2 className="text-base font-semibold">AI content may be inaccurate</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              AI-generated content may contain inaccuracies, outdated information, or biased
              language. Always review, edit, and verify AI outputs before using them for business,
              legal, financial, academic, medical, or official purposes.
            </p>
          </div>
        </div>
      </Card>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card className="p-5">
          <Eye className="h-5 w-5 text-primary" />
          <h3 className="mt-3 text-sm font-semibold">Review everything</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Treat every draft as a starting point. Read carefully for factual mistakes, tone
            mismatches, and unclear statements.
          </p>
        </Card>
        <Card className="p-5">
          <Scale className="h-5 w-5 text-primary" />
          <h3 className="mt-3 text-sm font-semibold">Verify high-stakes content</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Legal, medical, financial, HR, and compliance content must be independently verified by
            a qualified expert before use.
          </p>
        </Card>
        <Card className="p-5">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <h3 className="mt-3 text-sm font-semibold">Protect sensitive data</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Avoid entering confidential customer data, secrets, or personal information. Nothing is
            stored on our servers, but AI prompts are sent to the model provider.
          </p>
        </Card>
        <Card className="p-5">
          <AlertTriangle className="h-5 w-5 text-primary" />
          <h3 className="mt-3 text-sm font-semibold">Watch for bias</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            AI reflects patterns in its training data. Check outputs for bias, stereotypes, and
            exclusionary language.
          </p>
        </Card>
      </div>

      <Card className="mt-6 p-6">
        <h3 className="text-sm font-semibold">Your responsibility</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          You are responsible for the content you share and the decisions you make based on
          AI-generated output. This tool assists — it does not replace human judgment, professional
          expertise, or organizational policy.
        </p>
      </Card>
    </div>
  );
}