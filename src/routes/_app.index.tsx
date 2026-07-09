import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Mail,
  BookOpen,
  MessageSquare,
  Wand2,
  ArrowRight,
  Sparkles,
  Clock,
  Activity,
  Zap,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSessionStore } from "@/lib/session-store";

export const Route = createFileRoute("/_app/")({
  head: () => ({
    meta: [
      { title: "Dashboard — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Your AI productivity dashboard: quick actions, session stats, and recent activity.",
      },
    ],
  }),
  component: Dashboard,
});

const quickActions = [
  {
    title: "Smart Email Generator",
    desc: "Craft professional emails in seconds",
    icon: Mail,
    href: "/email" as const,
    color: "from-blue-500 to-indigo-500",
  },
  {
    title: "AI Research Assistant",
    desc: "Summarize topics and extract insights",
    icon: BookOpen,
    href: "/research" as const,
    color: "from-cyan-500 to-blue-500",
  },
  {
    title: "AI Chatbot",
    desc: "Chat with an AI for anything workplace",
    icon: MessageSquare,
    href: "/chat" as const,
    color: "from-violet-500 to-purple-500",
  },
  {
    title: "Smart AI Generator",
    desc: "Generate reports, proposals, plans and more",
    icon: Wand2,
    href: "/generator" as const,
    color: "from-sky-500 to-blue-600",
  },
];

function Dashboard() {
  const { history, sessionStart } = useSessionStore();
  const toolsUsed = new Set(history.map((h) => h.type)).size;
  const minutes = Math.max(1, Math.round((Date.now() - sessionStart) / 60000));

  return (
    <div className="mx-auto max-w-7xl">
      {/* Welcome hero */}
      <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/10 via-background to-background p-6 md:p-10 shadow-sm">
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Powered by AI · No signup required
          </div>
          <h1 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">
            Welcome to AI Workplace Productivity Assistant
          </h1>
          <p className="mt-3 max-w-2xl text-sm md:text-base text-muted-foreground">
            Help professionals improve productivity by generating professional content, conducting
            research, and assisting with workplace tasks using AI. Draft emails, summarize reports,
            create documents, and chat with an intelligent assistant — all in one place.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Button asChild>
              <Link to="/chat">
                Start chatting <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/email">Write an email</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard icon={Activity} label="Items generated" value={history.length} />
        <StatCard icon={Zap} label="Tools used" value={toolsUsed} />
        <StatCard icon={Clock} label="Session length" value={`${minutes} min`} />
      </section>

      {/* Quick actions */}
      <section className="mt-8">
        <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((a) => (
            <Link key={a.title} to={a.href} className="group">
              <Card className="h-full p-5 transition hover:shadow-md hover:border-primary/40 hover:-translate-y-0.5">
                <div
                  className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${a.color} text-white shadow-sm`}
                >
                  <a.icon className="h-5 w-5" />
                </div>
                <div className="mt-4 text-sm font-semibold">{a.title}</div>
                <p className="mt-1 text-xs text-muted-foreground">{a.desc}</p>
                <div className="mt-4 inline-flex items-center text-xs font-medium text-primary opacity-0 transition group-hover:opacity-100">
                  Open <ArrowRight className="ml-1 h-3 w-3" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent activity */}
      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent activity</h2>
          <Button asChild variant="ghost" size="sm">
            <Link to="/history">View all</Link>
          </Button>
        </div>
        <Card className="divide-y overflow-hidden p-0">
          {history.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No activity yet in this session. Try a Quick Action above.
            </div>
          ) : (
            history.slice(0, 5).map((h) => (
              <div key={h.id} className="flex items-center justify-between p-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-primary">
                      {h.type}
                    </span>
                    <span className="truncate text-sm font-medium">{h.title}</span>
                  </div>
                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {h.content.slice(0, 140)}
                  </p>
                </div>
                <div className="ml-4 shrink-0 text-xs text-muted-foreground">
                  {new Date(h.createdAt).toLocaleTimeString()}
                </div>
              </div>
            ))
          )}
        </Card>
      </section>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number | string;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="text-2xl font-semibold">{value}</div>
        </div>
      </div>
    </Card>
  );
}