import { useMemo, useState } from "react"
import {
  ArrowUpRight,
  Bot,
  CircleDot,
  Paperclip,
  Phone,
  Search,
  SendHorizonal,
  Sparkles,
  Star,
  Video,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

type Message = {
  id: number
  author: string
  role: "me" | "member" | "ai"
  text: string
  time: string
}

type TeamChannel = {
  id: number
  name: string
  topic: string
  status: "Live now" | "Heads up" | "Review"
  unreadCount: number
  activeMembers: string[]
  pinned: string[]
  messages: Message[]
}

const teamChannels: TeamChannel[] = [
  {
    id: 1,
    name: "Product Design",
    topic: "Launch prep, blockers, and quick decisions for this week.",
    status: "Live now",
    unreadCount: 4,
    activeMembers: ["SR", "EC", "CM", "LP"],
    pinned: [
      "Figma handoff closes today at 5:30 PM.",
      "QA walk-through starts tomorrow at 10:00 AM.",
    ],
    messages: [
      {
        id: 1,
        author: "Sophia Reed",
        role: "member",
        text: "Hero section is approved. I only need final copy for the onboarding empty state before I publish the build notes.",
        time: "09:12",
      },
      {
        id: 2,
        author: "Ethan Carter",
        role: "member",
        text: "Copy is locked. I sent the revised version to content and tagged engineering on the spacing issue in mobile.",
        time: "09:16",
      },
      {
        id: 3,
        author: "Minutely AI",
        role: "ai",
        text: "Summary: hero approved, onboarding empty-state copy pending final publish, mobile spacing issue assigned to engineering.",
        time: "09:18",
      },
      {
        id: 4,
        author: "You",
        role: "me",
        text: "I’ll update the release checklist after standup and post the QA owner list here.",
        time: "09:20",
      },
    ],
  },
  {
    id: 2,
    name: "Engineering",
    topic: "Shipping notes, hotfixes, and release readiness.",
    status: "Heads up",
    unreadCount: 2,
    activeMembers: ["LP", "DR", "JW"],
    pinned: [
      "Staging freeze starts at 2:00 PM.",
      "Regression checklist must be signed off before merge.",
    ],
    messages: [
      {
        id: 1,
        author: "Liam Parker",
        role: "member",
        text: "Calendar drag issue is fixed. I’m watching memory usage during long sessions before I mark it done.",
        time: "08:42",
      },
      {
        id: 2,
        author: "Daniel Ross",
        role: "member",
        text: "Please keep release notes short. Support only needs visible user-facing changes and known caveats.",
        time: "08:45",
      },
    ],
  },
  {
    id: 3,
    name: "Customer Success",
    topic: "Pilot feedback, onboarding asks, and renewal risk.",
    status: "Review",
    unreadCount: 0,
    activeMembers: ["MC", "JB", "DR"],
    pinned: [
      "Enterprise rollout update due Friday.",
    ],
    messages: [
      {
        id: 1,
        author: "Mia Cooper",
        role: "member",
        text: "The pilot team likes recurring notes, but they still want a cleaner export for weekly reviews.",
        time: "Yesterday",
      },
    ],
  },
]

const statusTone = {
  "Live now": "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300",
  "Heads up": "bg-amber-500/12 text-amber-700 dark:text-amber-300",
  Review: "bg-sky-500/12 text-sky-700 dark:text-sky-300",
} as const

export default function TeamChatPage() {
  const [selectedChannelId, setSelectedChannelId] = useState(teamChannels[0].id)
  const [composerText, setComposerText] = useState("")

  const selectedChannel = useMemo(
    () => teamChannels.find((channel) => channel.id === selectedChannelId) ?? teamChannels[0],
    [selectedChannelId]
  )

  const activePeople = selectedChannel.activeMembers

  return (
    <section className="flex flex-1 flex-col p-4 pt-0">
      <div className="grid flex-1 gap-4 xl:grid-cols-[320px_minmax(0,1fr)_320px]">
        <Card className="border border-border/60 bg-card/95 py-0">
          <CardHeader className="border-b border-border/70 bg-gradient-to-br from-primary/8 via-background to-background py-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle>Team Chat</CardTitle>
                <CardDescription>
                  Keep launches moving without leaving the workspace.
                </CardDescription>
              </div>
              <Badge className="rounded-full px-2.5">7 online</Badge>
            </div>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input className="pl-9" placeholder="Search channels, people, or updates" />
            </div>
          </CardHeader>

          <CardContent className="flex flex-1 flex-col gap-3 px-3 py-3">
            {teamChannels.map((channel) => {
              const isActive = channel.id === selectedChannel.id

              return (
                <button
                  key={channel.id}
                  type="button"
                  onClick={() => setSelectedChannelId(channel.id)}
                  className={cn(
                    "rounded-2xl border px-4 py-4 text-left transition-all",
                    isActive
                      ? "border-primary/30 bg-primary/8 shadow-sm"
                      : "border-transparent bg-muted/40 hover:border-border hover:bg-muted/70"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold">{channel.name}</p>
                        <span
                          className={cn(
                            "inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium",
                            statusTone[channel.status]
                          )}
                        >
                          {channel.status}
                        </span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {channel.topic}
                      </p>
                    </div>

                    {channel.unreadCount > 0 && (
                      <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-xs font-semibold text-primary-foreground">
                        {channel.unreadCount}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <AvatarGroup>
                      {channel.activeMembers.slice(0, 3).map((member) => (
                        <Avatar key={member} size="sm">
                          <AvatarFallback className="bg-primary/10 font-medium text-primary">
                            {member}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {channel.activeMembers.length > 3 && (
                        <AvatarGroupCount>+{channel.activeMembers.length - 3}</AvatarGroupCount>
                      )}
                    </AvatarGroup>
                    <p className="text-xs text-muted-foreground">
                      {channel.messages[channel.messages.length - 1]?.time}
                    </p>
                  </div>
                </button>
              )
            })}
          </CardContent>
        </Card>

        <Card className="min-h-[70vh] border border-border/60 bg-card/95 py-0">
          <CardHeader className="border-b border-border/70 bg-gradient-to-r from-background via-primary/5 to-background py-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CardTitle>{selectedChannel.name}</CardTitle>
                  <CircleDot className="h-4 w-4 fill-emerald-500 text-emerald-500" />
                </div>
                <CardDescription className="max-w-2xl text-sm">
                  {selectedChannel.topic}
                </CardDescription>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button variant="outline" size="sm">
                  <Phone />
                  Call
                </Button>
                <Button variant="outline" size="sm">
                  <Video />
                  Huddle
                </Button>
                <Button size="sm">
                  <Sparkles />
                  AI Recap
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex flex-1 flex-col gap-4 px-4 py-4">
            <div className="rounded-2xl border border-primary/15 bg-primary/6 p-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Star className="h-4 w-4 text-primary" />
                Pinned in this channel
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedChannel.pinned.map((item) => (
                  <Badge
                    key={item}
                    variant="outline"
                    className="h-auto rounded-full px-3 py-1.5 text-left text-xs text-foreground"
                  >
                    {item}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-3">
              {selectedChannel.messages.map((message) => {
                const isMe = message.role === "me"
                const isAi = message.role === "ai"

                return (
                  <div
                    key={message.id}
                    className={cn("flex", isMe ? "justify-end" : "justify-start")}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] rounded-3xl px-4 py-3 shadow-sm",
                        isMe && "bg-primary text-primary-foreground",
                        !isMe && !isAi && "bg-muted/70 text-foreground",
                        isAi && "border border-primary/20 bg-primary/8 text-foreground"
                      )}
                    >
                      <div className="mb-1 flex items-center gap-2 text-xs">
                        {isAi && <Bot className="h-3.5 w-3.5" />}
                        <span className={cn("font-medium", isMe && "text-primary-foreground")}>
                          {message.author}
                        </span>
                        <span className={cn("opacity-70", isMe && "text-primary-foreground/80")}>
                          {message.time}
                        </span>
                      </div>
                      <p className="text-sm leading-6">{message.text}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="rounded-3xl border border-border/70 bg-background p-3 shadow-sm">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Bot className="h-4 w-4 text-primary" />
                  AI can turn this thread into meeting notes or action items.
                </div>
                <Button variant="ghost" size="sm">
                  <ArrowUpRight />
                  Expand
                </Button>
              </div>

              <Textarea
                value={composerText}
                onChange={(event) => setComposerText(event.target.value)}
                placeholder="Write an update, ask a question, or drop a quick decision..."
                className="min-h-28 border-0 bg-transparent px-0 py-0 shadow-none focus-visible:ring-0"
              />

              <div className="mt-3 flex flex-col gap-3 border-t border-border/70 pt-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Paperclip />
                    Attach
                  </Button>
                  <Button variant="outline" size="sm">
                    <Sparkles />
                    Suggest reply
                  </Button>
                </div>
                <Button size="sm" disabled={composerText.trim().length === 0}>
                  <SendHorizonal />
                  Send update
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          <Card className="border border-border/60 bg-card/95 py-0">
            <CardHeader className="border-b border-border/70 py-5">
              <CardTitle>Channel Pulse</CardTitle>
              <CardDescription>
                Quick signals for people, urgency, and next decisions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-4 py-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-muted/60 p-4">
                  <p className="text-xs text-muted-foreground">Open threads</p>
                  <p className="mt-2 text-2xl font-semibold">12</p>
                </div>
                <div className="rounded-2xl bg-muted/60 p-4">
                  <p className="text-xs text-muted-foreground">Action items</p>
                  <p className="mt-2 text-2xl font-semibold">5</p>
                </div>
              </div>

              <div className="rounded-2xl border border-border/70 p-4">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  Active now
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {activePeople.map((member) => (
                    <Badge key={member} variant="outline" className="rounded-full px-2.5">
                      {member}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/60 bg-card/95 py-0">
            <CardHeader className="border-b border-border/70 py-5">
              <CardTitle>Today</CardTitle>
              <CardDescription>
                Work flowing out of this chat thread.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 px-4 py-4">
              {[
                "QA owner list to be posted after standup.",
                "Design handoff closes before the staging freeze.",
                "AI recap should convert thread decisions into note bullets.",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-border/70 bg-muted/35 p-3 text-sm leading-6"
                >
                  {item}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
