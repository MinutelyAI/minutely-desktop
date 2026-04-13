import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
} from "@/components/ui/avatar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MicrophoneIcon as Microphone,
  MicrophoneSlashIcon as MicrophoneOff,
  VideoCameraIcon as Video,
  VideoCameraSlashIcon as VideoOff,
  SubtitlesIcon as AITranscription,
  SubtitlesSlashIcon as AITranscriptionOff,
  PencilSimpleSlashIcon as AINotesOff,
  ArrowRightIcon as ArrowRight,
  PencilSimpleIcon as AINotes,
} from "@phosphor-icons/react/dist/ssr";
import StartMeetingSheet from "@/components/start-meeting/start-meeting-sheet";
import { Separator } from "@/components/ui/separator";
import {
  CalendarClock,
  Clock,
  MapPin,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { MeetingParticipant, ActiveMeeting } from "@/types";
import { availableParticipants } from "@/mock";
import { UserIcon } from "@phosphor-icons/react";
import { generateMeetingCode, generateMeetingId, isValidMeetingCode, parseMeetingCode } from "@/lib/meeting-utils";
import { useMeeting } from "@/contexts/meeting-context";


export default function StartMeetingPage() {
  const navigate = useNavigate();
  const { createMeeting } = useMeeting();

  const [meetingTitle, setMeetingTitle] = useState("");
  const [quickNote, setQuickNote] = useState("");
  const [video, setVideo] = useState(true);
  const [mic, setMic] = useState(true);
  const [transcript, setAITranscription] = useState(true);
  const [notes, setAINotes] = useState(true);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [participantEmail, setParticipantEmail] = useState("");
  const [participantError, setParticipantError] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState<MeetingParticipant[]>([]);
  const [meetingCode, setMeetingCode] = useState("");
  const [joinError, setJoinError] = useState("");

  const [openStartMeeting, setOpenStartMeeting] = useState(false);
  const upcomingMeetings = [
    {
      id: 1,
      title: "Product Planning",
      time: "Today, 11:30 AM",
      duration: "45 min",
      room: "Strategy Room",
      attendees: 6,
      status: "Live in 8 min",
      joinable: true,
    },
    {
      id: 2,
      title: "Design Critique",
      time: "Today, 3:00 PM",
      duration: "30 min",
      room: "Studio Sync",
      attendees: 4,
      status: "Scheduled",
      joinable: false,
    },
    {
      id: 3,
      title: "Customer Review",
      time: "Tomorrow, 9:00 AM",
      duration: "60 min",
      room: "Client Channel",
      attendees: 8,
      status: "Scheduled",
      joinable: false,
    },
  ];
  const activeTools = [
    mic ? "Microphone on" : "Microphone off",
    video ? "Camera on" : "Camera off",
    transcript ? "AI transcription ready" : "AI transcription off",
    notes ? "AI notes ready" : "AI notes off",
  ];

  const addParticipantByEmail = () => {
    const normalizedEmail = participantEmail.trim().toLowerCase();

    if (!normalizedEmail) {
      setParticipantError("Enter an email address to add a participant.");
      return;
    }

    const matchedParticipant = availableParticipants.find(
      (participant) => participant.email.toLowerCase() === normalizedEmail
    );

    if (!matchedParticipant) {
      setParticipantError("No user found with that email address.");
      return;
    }

    if (selectedParticipants.some((participant) => participant.id === matchedParticipant.id)) {
      setParticipantError("That participant is already added.");
      return;
    }

    setSelectedParticipants((current) => [...current, matchedParticipant]);
    setParticipantEmail("");
    setParticipantError("");
  };

  const removeParticipant = (participantId: number) => {
    setSelectedParticipants((current) =>
      current.filter((participant) => participant.id !== participantId)
    );
    setParticipantError("");
  };

  const handleCreateMeeting = () => {
    if (!meetingTitle.trim()) {
      alert("Please enter a meeting title");
      return;
    }

    const meetingCode = generateMeetingCode();
    const meetingId = generateMeetingId();

    const newMeeting: ActiveMeeting = {
      id: meetingId,
      code: meetingCode,
      title: meetingTitle,
      hostId: 1, // TODO: Replace with actual user ID from auth
      participants: selectedParticipants,
      settings: {
        microphone: mic,
        video: video,
        aiTranscription: transcript,
        aiNotes: notes,
      },
      quickNote: quickNote,
      startTime: new Date(),
      isScheduled: isScheduled,
      scheduledStartTime: isScheduled && scheduledDate && scheduledTime
        ? new Date(`${scheduledDate}T${scheduledTime}`)
        : undefined,
      status: "active",
    };

    createMeeting(newMeeting);
    setOpenStartMeeting(false);
    navigate("/meetings/active-meeting");
  };

  const handleJoinMeeting = () => {
    const normalizedCode = meetingCode.trim().toUpperCase();

    if (!normalizedCode) {
      setJoinError("Please enter a meeting code");
      return;
    }

    if (!isValidMeetingCode(normalizedCode)) {
      setJoinError("Invalid meeting code format. Use format ABC-DEF or ABCDEF");
      return;
    }

    // TODO: In a real app, validate the code against backend
    // For now, just navigate to active meeting
    // The backend should verify the code exists and add the user as a participant
    navigate("/meetings/active-meeting");
  };

  return (
    <section className="px-20">

      <div className="flex justify-center pb-5">
        <div className="w-full max-w-2xl grid grid-cols-7 gap-2">
          <Input type="text" placeholder="Enter meeting code..." className="col-span-5" value={meetingCode} onChange={(e) => {
            setMeetingCode(e.target.value);
            if (joinError) setJoinError("");
          }} />
          <Button variant="default" className="col-span-2" onClick={handleJoinMeeting}>
            Join
          </Button>
        </div>
      </div>

      {joinError && (
        <div className="flex justify-center pb-3">
          <div className="w-full max-w-2xl">
            <p className="text-sm text-destructive">{joinError}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4  md:grid-cols-2 items-stretch">
        <Card className="w-full h-full">
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle>Meeting Setup</CardTitle>
                <CardDescription>
                  Configure your meeting details
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Meeting Title</Label>
              <Input placeholder="Enter meeting title..." value={meetingTitle} onChange={(e) => setMeetingTitle(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Quick Note</Label>
              <Textarea
                placeholder="Add agenda, goals, or context for this session..."
                value={quickNote}
                onChange={(e) => setQuickNote(e.target.value)}
              />
            </div>

            <Separator />

            <Label>Meeting Settings</Label>

            <div className="grid grid-cols-4 gap-2 w-full">
              <Toggle variant="outline" pressed={mic} onPressedChange={setMic} >
                {mic ? <Microphone /> : <MicrophoneOff />} Microphone
              </Toggle>
              <Toggle variant="outline" pressed={video} onPressedChange={setVideo} >
                {video ? <Video /> : <VideoOff />} Video
              </Toggle>
              <Toggle variant="outline" pressed={transcript} onPressedChange={setAITranscription} >
                {transcript ? <AITranscription /> : <AITranscriptionOff />} AI Transcription
              </Toggle>
              <Toggle variant="outline" pressed={notes} onPressedChange={setAINotes} >
                {notes ? <AINotes /> : <AINotesOff />} AI Notes
              </Toggle>
            </div>

            <div className="grid gap-3 rounded-xl border bg-muted/20 p-4">
              <div className="flex items-center justify-between gap-3">
                <Label className="text-sm">Schedule</Label>
                <Toggle variant="outline" pressed={isScheduled} onPressedChange={setIsScheduled} >
                  <CalendarClock className="h-4 w-4" />
                  {isScheduled ? "StartNow" : "Schedule"}
                </Toggle>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="meeting-date">Date</Label>
                  <Input id="meeting-date" disabled={isScheduled} type="date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meeting-time">Time</Label>
                  <Input id="meeting-time" disabled={isScheduled} type="time" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="grid gap-3 rounded-xl border bg-muted/20 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <Label className="text-sm">Participants</Label>
                </div>
              </div>

              <div className="grid gap-3">
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Enter participant email"
                    value={participantEmail}
                    onChange={(e) => {
                      setParticipantEmail(e.target.value);
                      if (participantError) {
                        setParticipantError("");
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addParticipantByEmail();
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={addParticipantByEmail}>
                    Add
                  </Button>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <AvatarGroup>
                    {selectedParticipants.map((participant) => (
                      <Avatar key={participant.id}>
                        <AvatarFallback>
                          {participant.displayName
                            .split(" ")
                            .map((part) => part[0])
                            .join("")
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {selectedParticipants.length === 0 && (
                      <Avatar>
                        <AvatarFallback>0</AvatarFallback>
                      </Avatar>
                    )}
                  </AvatarGroup>

                  <div className="flex items-center gap-1 text-right text-sm text-muted-foreground">
                    <span>{selectedParticipants.length} Participants</span>
                    <UserIcon />
                  </div>
                </div>

                {participantError && (
                  <p className="text-sm text-destructive">{participantError}</p>
                )}

                {selectedParticipants.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedParticipants.map((participant) => (
                      <div
                        key={participant.id}
                        className="flex items-center gap-2 rounded-full border bg-background pl-3 pr-1 py-1 text-sm"
                      >
                        <span>{participant.displayName}</span>
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => removeParticipant(participant.id)}
                        >
                          <X className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No participants added yet.
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-xl border p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                Ready To Start
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-lg bg-muted/40 p-3">
                  <div className="mb-1 flex items-center gap-2 text-sm font-medium">
                    <CalendarClock className="h-4 w-4" />
                    Start Time
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {!isScheduled
                      ? scheduledDate && scheduledTime
                        ? `${scheduledDate} at ${scheduledTime}`
                        : "Schedule date and time before confirming."
                      : "This meeting starts immediately when you confirm from the sheet."}
                  </p>
                </div>

                <div className="rounded-lg bg-muted/40 p-3">
                  <div className="mb-1 flex items-center gap-2 text-sm font-medium">
                    <Users className="h-4 w-4" />
                    Attendees
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {selectedParticipants.length} participant{selectedParticipants.length === 1 ? "" : "s"} added for this meeting.
                  </p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {activeTools.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border px-3 py-1 text-xs text-muted-foreground"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <Separator className="mt-6" />

            <Button className="w-full" onClick={handleCreateMeeting}>
              Start Meeting Now
              <ArrowRight />
            </Button>
          </CardContent>
        </Card>

        <Card className="w-full h-full">
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle>Upcoming Meetings</CardTitle>
                <CardDescription>
                  Your upcoming sessions and quick join options
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 pt-0">
            <div className="rounded-xl border bg-muted/20 p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <Label className="text-sm">Next Up</Label>
                  <p className="text-sm text-muted-foreground">
                    Your nearest meeting is ready to review.
                  </p>
                </div>
                <span className="rounded-full border px-3 py-1 text-xs text-muted-foreground">
                  {upcomingMeetings[0].status}
                </span>
              </div>

              <div className="rounded-xl border bg-background p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{upcomingMeetings[0].title}</p>
                    <p className="text-sm text-muted-foreground">
                      {upcomingMeetings[0].time} · {upcomingMeetings[0].duration}
                    </p>
                  </div>
                  <Button size="sm">
                    Join
                  </Button>
                </div>

                <div className="mt-3 grid gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{upcomingMeetings[0].room}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{upcomingMeetings[0].attendees} attendees invited</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <Label className="text-sm">Upcoming Meeting</Label>
                </div>
                <span className="rounded-full border px-3 py-1 text-xs text-muted-foreground">
                  {upcomingMeetings.length} meetings
                </span>
              </div>

              <div className="space-y-3">
                {upcomingMeetings.map((meeting) => (
                  <div key={meeting.id} className="rounded-lg border p-3 transition hover:bg-muted/40" >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">{meeting.title}</p>
                        <div className="mt-1 flex flex-wrap gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {meeting.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {meeting.attendees} people
                          </span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant={meeting.joinable ? "default" : "outline"}
                      >
                        {meeting.joinable ? "Join" : "View"}
                      </Button>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                        {meeting.duration}
                      </span>
                      <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                        {meeting.room}
                      </span>
                      <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                        {meeting.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </CardContent>
        </Card>

        <StartMeetingSheet
          open={openStartMeeting}
          onOpenChange={setOpenStartMeeting}
          meetingTitle={meetingTitle}
          onMeetingTitleChange={setMeetingTitle}
          quickNote={quickNote}
          onQuickNoteChange={setQuickNote}
          micEnabled={mic}
          onMicEnabledChange={setMic}
          videoEnabled={video}
          onVideoEnabledChange={setVideo}
          AINotesEnabled={notes}
          onAINotesEnabledChange={setAINotes}
          AITranscriptionEnabled={transcript}
          onAITranscriptionEnabledChange={setAITranscription}
          isScheduled={isScheduled}
          onIsScheduledChange={setIsScheduled}
          scheduledDate={scheduledDate}
          onScheduledDateChange={setScheduledDate}
          scheduledTime={scheduledTime}
          onScheduledTimeChange={setScheduledTime}
          participants={selectedParticipants}
        />

      </div>
    </section>
  )
}
