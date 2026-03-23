import { Link, useOutlet } from "react-router-dom"
import {
  ArrowRight,
  CalendarDays,
  ClipboardList,
  Clock3,
  MapPin,
  Sparkles,
  Users,
} from "lucide-react"

import { meetingNotes } from "@/mock"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const upcomingMeetings = [
  {
    id: 1,
    title: "Product Planning",
    dateLabel: "Today",
    timeRange: "11:30 AM - 12:15 PM",
    location: "Strategy Room",
    participants: 6,
    status: "Starts in 8 min",
  },
  {
    id: 2,
    title: "Design Critique",
    dateLabel: "Today",
    timeRange: "3:00 PM - 3:30 PM",
    location: "Studio Sync",
    participants: 4,
    status: "Scheduled",
  },
  {
    id: 3,
    title: "Customer Review",
    dateLabel: "Tomorrow",
    timeRange: "9:00 AM - 10:00 AM",
    location: "Client Channel",
    participants: 8,
    status: "Scheduled",
  },
]

export default function MeetingsPage() {
  const outlet = useOutlet()
  const totalActionItems = meetingNotes.reduce(
    (count, note) => count + note.actionItems.length,
    0
  )
  const openActionItems = meetingNotes.reduce(
    (count, note) => count + note.actionItems.filter((item) => !item.completed).length,
    0
  )
  const latestNotes = [...meetingNotes].slice(0, 3)

  return outlet ?? (
    <section className="flex flex-1 flex-col gap-5 p-5">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_360px]">
        <Card className="border border-border/60 bg-card/95 py-0">
          <CardHeader className="border-b border-border/70 bg-gradient-to-r from-background via-primary/5 to-background py-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-3">
                <Badge className="w-fit rounded-full px-3 py-1">Meeting Workspace</Badge>
                <div className="space-y-2">
                  <CardTitle className="text-2xl">Run meetings and keep the follow-up visible.</CardTitle>
                  <CardDescription className="max-w-2xl text-sm leading-6">
                    Start a live room, review generated notes, and keep the next actions moving without
                    bouncing between screens.
                  </CardDescription>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button asChild>
                  <Link to="/meetings/start-meetings">
                    Start a meeting
                    <ArrowRight />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/meetings/meetings-notes">Open notes</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/meetings/calender">View calendar</Link>
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="grid gap-4 px-5 py-5 md:grid-cols-3">
            <div className="rounded-2xl border border-border/70 bg-muted/35 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Upcoming</p>
              <p className="mt-2 text-3xl font-semibold">{upcomingMeetings.length}</p>
              <p className="mt-2 text-sm text-muted-foreground">Meetings queued across today and tomorrow.</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-muted/35 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Open actions</p>
              <p className="mt-2 text-3xl font-semibold">{openActionItems}</p>
              <p className="mt-2 text-sm text-muted-foreground">Follow-ups still pending from recent sessions.</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-muted/35 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Notes ready</p>
              <p className="mt-2 text-3xl font-semibold">{meetingNotes.length}</p>
              <p className="mt-2 text-sm text-muted-foreground">{totalActionItems} total action items tracked in notes.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/60 bg-card/95 py-0">
          <CardHeader className="border-b border-border/70 py-5">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-5 w-5 text-primary" />
              Today at a glance
            </CardTitle>
            <CardDescription>What needs attention before the next handoff.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 px-4 py-4">
            {[
              "Join Product Planning before the room goes live.",
              "Review notes from Design Critique and close open action items.",
              "Check tomorrow's customer meeting against the calendar before sharing invites.",
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

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]">
        <Card className="border border-border/60 bg-card/95 py-0">
          <CardHeader className="border-b border-border/70 py-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle>Upcoming meetings</CardTitle>
                <CardDescription>Fast access to the sessions that are next in line.</CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link to="/meetings/calender">
                  Calendar
                  <ArrowRight />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 px-4 py-4">
            {upcomingMeetings.map((meeting) => (
              <div
                key={meeting.id}
                className="rounded-2xl border border-border/70 bg-background p-4"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-base font-semibold">{meeting.title}</p>
                      <Badge variant={meeting.status === "Starts in 8 min" ? "default" : "outline"}>
                        {meeting.status}
                      </Badge>
                    </div>

                    <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4" />
                        <span>{meeting.dateLabel}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock3 className="h-4 w-4" />
                        <span>{meeting.timeRange}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{meeting.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{meeting.participants} attendees</span>
                      </div>
                    </div>
                  </div>

                  <Button asChild variant="outline" size="sm">
                    <Link to="/meetings/start-meetings">Open room</Link>
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border border-border/60 bg-card/95 py-0">
          <CardHeader className="border-b border-border/70 py-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle>Recent notes</CardTitle>
                <CardDescription>Jump back into decisions and follow-up items.</CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link to="/meetings/meetings-notes">
                  All notes
                  <ArrowRight />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 px-4 py-4">
            {latestNotes.map((note) => (
              <Link
                key={note.id}
                to={`/meetings/meetings-notes/${note.id}`}
                className="block rounded-2xl border border-border/70 bg-background p-4 transition hover:bg-muted/30"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2">
                    <Badge variant="outline">{note.category}</Badge>
                    <div>
                      <p className="font-semibold">{note.title}</p>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        {note.meeting.summary}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="secondary">{note.meeting.dateLabel}</Badge>
                  <Badge variant="secondary">
                    <ClipboardList className="h-3.5 w-3.5" />
                    {note.actionItems.length} action items
                  </Badge>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
