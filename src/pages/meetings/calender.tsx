import { useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  UserRound,
  Users,
} from "lucide-react";
import { meetingNotes } from "@/mock";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { MeetingNotes } from "@/types";
import { BellAlertIcon } from "@heroicons/react/24/outline";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const reminderOptions = ["10 minutes", "30 minutes", "1 hour", "1 day"];

const scheduledMeetings = meetingNotes
  .map((note) => ({
    ...note,
    scheduledAt: new Date(note.meeting.dateLabel),
  }))
  .sort((left, right) => left.scheduledAt.getTime() - right.scheduledAt.getTime());

function getInitialMonth() {
  const firstScheduledMeeting = scheduledMeetings[0];
  if (!firstScheduledMeeting) {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  }

  return new Date(
    firstScheduledMeeting.scheduledAt.getFullYear(),
    firstScheduledMeeting.scheduledAt.getMonth(),
    1
  );
}

function isSameMonth(date: Date, month: Date) {
  return (
    date.getFullYear() === month.getFullYear() &&
    date.getMonth() === month.getMonth()
  );
}

function isSameDay(left: Date, right: Date) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

function buildCalendarDays(month: Date) {
  const firstDayOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
  const lastDayOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  const leadingDays = firstDayOfMonth.getDay();
  const trailingDays = 6 - lastDayOfMonth.getDay();
  const calendarStart = new Date(month.getFullYear(), month.getMonth(), 1 - leadingDays);
  const calendarEnd = new Date(
    month.getFullYear(),
    month.getMonth(),
    lastDayOfMonth.getDate() + trailingDays
  );

  const days: Date[] = [];

  for (
    let cursor = new Date(calendarStart);
    cursor <= calendarEnd;
    cursor.setDate(cursor.getDate() + 1)
  ) {
    days.push(new Date(cursor));
  }

  return days;
}

export default function CalenderPage() {
  const [displayMonth, setDisplayMonth] = useState(getInitialMonth);
  const [selectedMeeting, setSelectedMeeting] = useState<(MeetingNotes | (ScheduledMeeting & { type: 'scheduled' })) | null>(null);
  const [reminderOffset, setReminderOffset] = useState("30 minutes");
  const [reminderNote, setReminderNote] = useState("");

  const calendarDays = buildCalendarDays(displayMonth);
  const visibleMeetings = scheduledMeetings.filter((note) =>
    isSameMonth(note.scheduledAt, displayMonth)
  );

  const resetReminderDialog = () => {
    setReminderOffset("30 minutes");
    setReminderNote("");
  };

  return (
    <>
      <section className="flex flex-1 flex-col gap-6 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

          <div className="flex items-center gap-2 self-start lg:self-auto">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() =>
                setDisplayMonth(
                  new Date(displayMonth.getFullYear(), displayMonth.getMonth() - 1, 1)
                )
              }
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="min-w-40 text-center text-sm font-medium">
              {displayMonth.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </div>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() =>
                setDisplayMonth(
                  new Date(displayMonth.getFullYear(), displayMonth.getMonth() + 1, 1)
                )
              }
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(300px,0.8fr)]">
          <div className="overflow-hidden rounded-3xl border bg-background">
            <div className="grid grid-cols-7 border-b bg-muted/30">
              {weekdayLabels.map((label) => (
                <div
                  key={label}
                  className="px-4 py-3 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground"
                >
                  {label}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-7">
              {calendarDays.map((day) => {
                const dayMeetings = scheduledMeetings.filter((meeting) =>
                  isSameDay(meeting.scheduledAt, day)
                );
                const isCurrentMonth = isSameMonth(day, displayMonth);
                const isToday = isSameDay(day, new Date());

                return (
                  <div
                    key={day.toISOString()}
                    className={`min-h-36 border-b p-3 sm:border-r ${isCurrentMonth ? "bg-background" : "bg-muted/15"
                      }`}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm ${isToday
                          ? "bg-primary text-primary-foreground"
                          : isCurrentMonth
                            ? "text-foreground"
                            : "text-muted-foreground"
                          }`}
                      >
                        {day.getDate()}
                      </span>
                      {dayMeetings.length > 0 && (
                        <span className="text-xs text-muted-foreground">
                          {dayMeetings.length} meeting{dayMeetings.length === 1 ? "" : "s"}
                        </span>
                      )}
                    </div>

                    <div className="space-y-2">
                      {dayMeetings.map((meeting) => (
                        <button
                          key={meeting.id}
                          type="button"
                          className="w-full rounded-2xl border bg-muted/30 px-3 py-2 text-left transition hover:border-primary/30 hover:bg-primary/5"
                          onClick={() => setSelectedMeeting(meeting)}
                        >
                          <p className="truncate text-sm font-medium">{meeting.title}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {meeting.meeting.timeRange}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-5 rounded-3xl border bg-muted/10 p-5">
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                This month
              </p>
              <CardTitle>{visibleMeetings.length} scheduled meetings</CardTitle>
            </div>

            <Separator />

            <div className="space-y-4">
              {visibleMeetings.length > 0 ? (
                visibleMeetings.map((meeting) => (
                  <button
                    key={meeting.id}
                    type="button"
                    className="w-full space-y-2 rounded-2xl border bg-background px-4 py-3 text-left transition hover:border-primary/30 hover:bg-primary/5"
                    onClick={() => setSelectedMeeting(meeting)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">{meeting.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {meeting.meeting.dateLabel}
                        </p>
                      </div>
                      <Badge variant="outline">{meeting.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {meeting.meeting.timeRange}
                    </p>
                  </button>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No meetings are scheduled for this month.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <Sheet
        open={selectedMeeting !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedMeeting(null);
          }
        }}
      >
        <SheetContent className="sm:max-w-lg">
          {selectedMeeting && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-2">
                  <Badge>{selectedMeeting.category}</Badge>
                  <Badge variant="outline">{selectedMeeting.meeting.duration}</Badge>
                </div>
                <SheetTitle>{selectedMeeting.title}</SheetTitle>
                <SheetDescription>
                  {selectedMeeting.meeting.summary}
                </SheetDescription>
              </SheetHeader>

              <div className="grid gap-6 px-6 pb-6">
                <div className="grid gap-4">
                  <div className="flex items-start gap-3">
                    <CalendarDays className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{selectedMeeting.meeting.dateLabel}</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedMeeting.meeting.timeRange}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock3 className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Duration</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedMeeting.meeting.duration}
                      </p>
                    </div>
                  </div>


                  <div className="flex items-start gap-3">
                    <UserRound className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Organizer</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedMeeting.meeting.organizer}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium">Participants</p>
                  </div>

                  <div className="space-y-1 space-x-1">
                    {selectedMeeting.meeting.participants.map((participant) => (
                      <Button key={participant.id} variant="outline">
                        <p className="text-sm text-foreground">
                          @{participant.username}
                        </p>
                      </Button>
                    ))}
                  </div>

                </div>
                <Separator />
                <div className="flex items-center gap-3">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="secondary">
                        <BellAlertIcon className="h-4 w-4" />
                        Set a reminder
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Set meeting reminder</DialogTitle>
                        <DialogDescription>
                          Get notified before for {selectedMeeting.title}
                        </DialogDescription>
                      </DialogHeader>

                      <div className="grid gap-5">
                        <div className="grid gap-3">
                          <Label>Remind me</Label>
                          <div className="flex flex-wrap gap-2">
                            {reminderOptions.map((option) => (
                              <Toggle
                                key={option}
                                variant="outline"
                                pressed={reminderOffset === option}
                                onPressedChange={(pressed) => {
                                  if (pressed) {
                                    setReminderOffset(option);
                                  }
                                }}
                              >
                                {option}
                              </Toggle>
                            ))}
                          </div>
                        </div>


                      </div>

                      <DialogFooter>
                        <DialogClose asChild>
                          <Button type="button" variant="outline" onClick={resetReminderDialog}>
                            Cancel
                          </Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button type="button" onClick={resetReminderDialog}>
                            Save reminder
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
