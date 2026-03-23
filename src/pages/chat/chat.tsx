import { Link, useOutlet } from "react-router-dom"
import {
  ArrowRight,
  Bot,
  MessageSquare,
  MessagesSquare,
  Sparkles,
  Users,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const chatSections = [
  {
    title: "Team chat",
    href: "/chat/team",
    icon: MessageSquare,
    description:
      "Follow live delivery work, keep context in-thread, and turn updates into notes or action items.",
    stats: ["7 online", "3 active channels", "AI recap ready"],
  },
  {
    title: "Groups",
    href: "/chat/groups",
    icon: Users,
    description:
      "Organize recurring conversations by function, project, or customer motion instead of burying them in one feed.",
    stats: ["4 shared spaces", "2 pending reviews", "1 launch room live"],
  },
]

const recentThreads = [
  {
    title: "Product Design",
    label: "Live now",
    preview: "Hero approved, onboarding copy locked, QA owner list pending after standup.",
    href: "/chat/team",
  },
  {
    title: "Launch Crew",
    label: "Needs review",
    preview: "Release notes draft is ready, but support caveats still need sign-off before staging freeze.",
    href: "/chat/groups",
  },
  {
    title: "Customer Success",
    label: "Quiet",
    preview: "Pilot feedback is stable. Export formatting remains the only recurring enterprise ask.",
    href: "/chat/team",
  },
]

export default function ChatPage() {
  const outlet = useOutlet()

  return outlet ?? (
    <section className="flex flex-1 flex-col gap-5 p-5">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_340px]">
        <Card className="border border-border/60 bg-card/95 py-0">
          <CardHeader className="border-b border-border/70 bg-gradient-to-r from-background via-primary/5 to-background py-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-3">
                <Badge className="w-fit rounded-full px-3 py-1">Chat Workspace</Badge>
                <div className="space-y-2">
                  <CardTitle className="text-2xl">Keep discussion close to the work.</CardTitle>
                  <CardDescription className="max-w-2xl text-sm leading-6">
                    Use team threads for fast decisions, group spaces for longer-running coordination,
                    and let AI pull structure out of noisy updates when needed.
                  </CardDescription>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button asChild>
                  <Link to="/chat/team">
                    Open team chat
                    <ArrowRight />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/chat/groups">Browse groups</Link>
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="grid gap-4 px-5 py-5 md:grid-cols-3">
            <div className="rounded-2xl border border-border/70 bg-muted/35 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Unread updates</p>
              <p className="mt-2 text-3xl font-semibold">6</p>
              <p className="mt-2 text-sm text-muted-foreground">Across active team and group spaces.</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-muted/35 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Live spaces</p>
              <p className="mt-2 text-3xl font-semibold">4</p>
              <p className="mt-2 text-sm text-muted-foreground">Threads with current delivery work moving through them.</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-muted/35 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">AI assists</p>
              <p className="mt-2 text-3xl font-semibold">3</p>
              <p className="mt-2 text-sm text-muted-foreground">Summaries and reply helpers available in active chat flows.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/60 bg-card/95 py-0">
          <CardHeader className="border-b border-border/70 py-5">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-5 w-5 text-primary" />
              Recommended next step
            </CardTitle>
            <CardDescription>Start where the most active discussion is already happening.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-4 py-4">
            <div className="rounded-2xl border border-primary/20 bg-primary/6 p-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Bot className="h-4 w-4 text-primary" />
                Team chat is the current coordination hub.
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Product Design and Engineering both have active updates. This is the fastest place to
                convert discussion into a recap or next actions.
              </p>
            </div>
            <Button asChild className="w-full">
              <Link to="/chat/team">
                Go to active thread
                <ArrowRight />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="grid gap-4 md:grid-cols-2">
          {chatSections.map((section) => (
            <Card key={section.title} className="border border-border/60 bg-card/95 py-0">
              <CardHeader className="border-b border-border/70 py-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <section.icon className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">{section.title}</CardTitle>
                    </div>
                    <CardDescription className="text-sm leading-6">
                      {section.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 px-4 py-4">
                <div className="flex flex-wrap gap-2">
                  {section.stats.map((stat) => (
                    <Badge key={stat} variant="outline" className="rounded-full px-2.5">
                      {stat}
                    </Badge>
                  ))}
                </div>
                <Button asChild variant="outline" className="w-full">
                  <Link to={section.href}>
                    Open {section.title.toLowerCase()}
                    <ArrowRight />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border border-border/60 bg-card/95 py-0">
          <CardHeader className="border-b border-border/70 py-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle>Recent threads</CardTitle>
                <CardDescription>Where the last meaningful updates landed.</CardDescription>
              </div>
              <MessagesSquare className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3 px-4 py-4">
            {recentThreads.map((thread) => (
              <Link
                key={thread.title}
                to={thread.href}
                className="block rounded-2xl border border-border/70 bg-background p-4 transition hover:bg-muted/30"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold">{thread.title}</p>
                      <Badge variant="secondary">{thread.label}</Badge>
                    </div>
                    <p className="text-sm leading-6 text-muted-foreground">{thread.preview}</p>
                  </div>
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
