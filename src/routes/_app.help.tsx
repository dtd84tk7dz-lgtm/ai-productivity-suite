import { createFileRoute } from "@tanstack/react-router";
import { HelpCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/_app/help")({
  head: () => ({
    meta: [
      { title: "Help — AI Workplace" },
      { name: "description", content: "How to use every feature of the AI Workplace assistant." },
    ],
  }),
  component: HelpPage,
});

const features = [
  {
    title: "Smart Email Generator",
    body: "Fill in recipient, subject, purpose, context, and key points. Choose a tone (Formal, Friendly, Persuasive) and click Generate. Use Rewrite, Improve, Expand, Shorten, and Correct Grammar to refine the output. Edit the result inline, then Copy, Download, or Print.",
  },
  {
    title: "AI Research Assistant",
    body: "Enter a topic or paste article/report text, then choose a mode: Summary, Key Insights, Recommendations, Action Items, Executive Summary, Important Facts, or Key Statistics. Switch modes to generate different views on the same input.",
  },
  {
    title: "AI Chatbot",
    body: "Ask anything workplace-related. Click a suggested prompt or type your own. Press Enter to send, Shift+Enter for a newline. Use Regenerate to try again, Clear to start over.",
  },
  {
    title: "Smart AI Generator",
    body: "Pick a document type (report, proposal, plan, SOP, etc.), enter a topic, customize audience, tone, and length, then Generate. Use 'Use template' for suggested instructions.",
  },
  {
    title: "History",
    body: "Every generation from the current session is stored locally in your browser. Nothing is uploaded. Clear session history any time.",
  },
  {
    title: "Settings",
    body: "Toggle theme, tune AI response length, creativity, default email tone, animations, and language.",
  },
];

const faqs = [
  {
    q: "Do I need to sign up or log in?",
    a: "No. The app requires no account, no email, no login.",
  },
  {
    q: "Is my data saved?",
    a: "Only in your browser session. Nothing is stored on our servers. Closing the browser session clears everything.",
  },
  {
    q: "Can I edit AI outputs?",
    a: "Yes. Every output panel has an Edit button — you can freely modify content before copying, downloading, or printing.",
  },
  {
    q: "How do I get better results?",
    a: "Give the AI clear context: audience, tone, key points, and any specific instructions. The more focused the input, the better the output.",
  },
  {
    q: "What if I hit a rate limit?",
    a: "Wait a few seconds and try again. If you see a credits error, add credits from your Lovable workspace.",
  },
];

const tips = [
  "Start every prompt with the outcome you want, then add constraints.",
  "Use the tone and length controls to match the audience.",
  "Chain tools: research a topic, then feed the summary into the document generator.",
  "Edit and refine — AI drafts are starting points, not final copy.",
];

function HelpPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="Help" description="Get the most out of every AI tool." icon={HelpCircle} />

      <Card className="p-6">
        <h2 className="text-lg font-semibold">Quick start</h2>
        <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>Pick a tool from the sidebar (Email, Research, Chat, Generator).</li>
          <li>Fill in the context — the more specific, the better the output.</li>
          <li>Click Generate. Edit inline, then Copy, Download, or Print.</li>
          <li>Session outputs appear on the History page.</li>
        </ol>
      </Card>

      <Card className="mt-6 p-6">
        <h2 className="text-lg font-semibold">Features</h2>
        <Accordion type="single" collapsible className="mt-2">
          {features.map((f) => (
            <AccordionItem key={f.title} value={f.title}>
              <AccordionTrigger className="text-sm font-medium">{f.title}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{f.body}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Card>

      <Card className="mt-6 p-6">
        <h2 className="text-lg font-semibold">FAQ</h2>
        <Accordion type="single" collapsible className="mt-2">
          {faqs.map((f) => (
            <AccordionItem key={f.q} value={f.q}>
              <AccordionTrigger className="text-sm font-medium">{f.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Card>

      <Card className="mt-6 p-6">
        <h2 className="text-lg font-semibold">Productivity tips</h2>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          {tips.map((t) => (
            <li key={t} className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              {t}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}