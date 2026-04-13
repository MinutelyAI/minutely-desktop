import { Link, useOutlet } from "react-router-dom"
import { useState } from "react"
import {
  ArrowRight,
  CalendarDays,
  ClipboardList,
  Clock3,
  MapPin,
  Sparkles,
  Users,
  X,
} from "lucide-react"

import { meetingNotes } from "@/mock"
import { useMeeting } from "@/contexts/meeting-context"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
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
  const { scheduleMeeting } = useMeeting()

  const [scheduleTitle, setScheduleTitle] = useState("")
  const [scheduleDescription, setScheduleDescription] = useState("")
  const [scheduleDate, setScheduleDate] = useState("")
  const [scheduleTime, setScheduleTime] = useState("")
  const [inviteeEmail, setInviteeEmail] = useState("")
  const [invitees, setInvitees] = useState<string[]>([])
  const [scheduleError, setScheduleError] = useState("")
  const [scheduleSuccess, setScheduleSuccess] = useState("")

  const totalActionItems = meetingNotes.reduce(
    (count, note) => count + note.actionItems.length,
    0
  )
  const openActionItems = meetingNotes.reduce(
    (count, note) => count + note.actionItems.filter((item) => !item.completed).length,
    0
  )
  const addInvitee = () => {
    const email = inviteeEmail.trim().toLowerCase()

    if (!email) {
      setScheduleError("Enter an invitee email before adding.")
      return
    }

    if (!email.includes("@")) {
      setScheduleError("Enter a valid email address.")
      return
    }

    if (invitees.includes(email)) {
      setScheduleError("That invitee has already been added.")
      return
    }

    setInvitees((current) => [...current, email])
    setInviteeEmail("")
    setScheduleError("")
  }

  const removeInvitee = (email: string) => {
    setInvitees((current) => current.filter((item) => item !== email))
    setScheduleError("")
  }

  const handleScheduleMeeting = () => {
    if (!scheduleTitle.trim() || !scheduleDescription.trim() || !scheduleDate || !scheduleTime) {
      setScheduleError("Please complete title, description, date, and time.")
      setScheduleSuccess("")
      return
    }

    if (invitees.length === 0) {
      setScheduleError("Add at least one invitee before scheduling.")
      setScheduleSuccess("")
      return
    }

    const scheduledAt = new Date(`${scheduleDate}T${scheduleTime}`)

    scheduleMeeting({
      id: Date.now(),
      title: scheduleTitle.trim(),
      category: "Internal",
      scheduledAt,
      meeting: {
        id: Date.now(),
        title: scheduleTitle.trim(),
        dateLabel: scheduledAt.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          weekday: "short",
        }),
        timeRange: scheduledAt.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        }),
        duration: "30 min",
        location: "Virtual",
        organizer: "You",
        participants: invitees.map((email, index) => ({
          id: Date.now() + index,
          displayName: email.split("@")[0],
          email,
          username: email.split("@")[0],
        })),
        summary: scheduleDescription.trim(),
      },
    })

    setScheduleSuccess("Meeting scheduled successfully.")
    setScheduleError("")
    setScheduleTitle("")
    setScheduleDescription("")
    setScheduleDate("")
    setScheduleTime("")
    setInvitees([])
  }

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
                    Start instant meeting
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

            <Separator />

            <div className="space-y-4">
              <div>
                <CardTitle className="text-base">Schedule meeting</CardTitle>
                <CardDescription>Book a meeting time that appears on the calendar.</CardDescription>
              </div>

              <div className="grid gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="schedule-title">Title</Label>
                  <Input
                    id="schedule-title"
                    placeholder="Meeting title"
                    value={scheduleTitle}
                    onChange={(e) => setScheduleTitle(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="schedule-description">Description</Label>
                  <Textarea
                    id="schedule-description"
                    placeholder="Meeting description"
                    value={scheduleDescription}
                    onChange={(e) => setScheduleDescription(e.target.value)}
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="schedule-date">Date</Label>
                    <Input
                      id="schedule-date"
                      type="date"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="schedule-time">Time</Label>
                    <Input
                      id="schedule-time"
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="invitee-email">Invitees</Label>
                  <div className="flex gap-2">
                    <Input
                      id="invitee-email"
                      placeholder="Enter invitee email"
                      value={inviteeEmail}
                      onChange={(e) => setInviteeEmail(e.target.value)}
                    />
                    <Button type="button" onClick={addInvitee}>
                      Add
                    </Button>
                  </div>
                  {invitees.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {invitees.map((email) => (
                        <span
                          key={email}
                          className="inline-flex items-center rounded-full border border-border/70 bg-background px-3 py-1 text-sm"
                        >
                          {email}
                          <button
                            type="button"
                            className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full hover:bg-muted"
                            onClick={() => removeInvitee(email)}
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {scheduleError && (
                  <p className="text-sm text-destructive">{scheduleError}</p>
                )}
                {scheduleSuccess && (
                  <p className="text-sm text-success">{scheduleSuccess}</p>
                )}

                <Button onClick={handleScheduleMeeting}>Schedule meeting</Button>
              </div>
            </div>
          </CardContent>
        </Card>

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
