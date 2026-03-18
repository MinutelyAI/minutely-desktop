import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import {
  MicrophoneIcon as Microphone,
  MicrophoneSlashIcon as MicrophoneOff,
  VideoCameraIcon as Video,
  VideoCameraSlashIcon as VideoOff,
  SubtitlesIcon as AITranscription,
  SubtitlesSlashIcon as AITranscriptionOff,
  UsersIcon,
  PencilSimpleSlashIcon as AINotesOff,
} from "@phosphor-icons/react";
import { PencilSimpleIcon as AINotes, UsersThreeIcon } from "@phosphor-icons/react/dist/ssr";
import { CalendarPlusIcon } from "lucide-react";
import StartMeetingSheet from "@/components/start-meeting/start-meeting-sheet";
import JoinMeetingSheet from "@/components/start-meeting/join-meeting-sheet";
import ScheduleLaterSheet from "@/components/start-meeting/schedule-later-sheet";
import InviteParticipantsSheet from "@/components/start-meeting/invite-participants-sheet";

export default function StartMeetingPage() {
  const [meetingTitle, setMeetingTitle] = useState("");
  const [video, setVideo] = useState(true);
  const [mic, setMic] = useState(true);
  const [transcript, setAITranscription] = useState(true);
  const [notes, setAINotes] = useState(true);

  const [openStartMeeting, setOpenStartMeeting] = useState(false);
  const [openJoinMeeting, setOpenJoinMeeting] = useState(false);
  const [openScheduleLater, setOpenScheduleLater] = useState(false);
  const [openInviteParticipants, setOpenInviteParticipants] = useState(false);

  return (
    <section className="grid grid-cols-1 gap-4 p-20 md:grid-cols-2 items-stretch">
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle>Meeting Setup</CardTitle>
          <CardDescription>
            Configure your meeting details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label>Meeting Title</Label>
          <Input
            placeholder="Enter meeting title..."
            onChange={(e) => setMeetingTitle(e.target.value)}
          />

          <Label>Meeting Settings</Label>

          <div className="grid grid-cols-2 gap-2 w-full">
            <Toggle
              variant="outline"
              pressed={mic}
              onPressedChange={setMic}
            >
              {mic ? <Microphone /> : <MicrophoneOff />}
              Microphone
            </Toggle>

            <Toggle
              variant="outline"
              pressed={video}
              onPressedChange={setVideo}
            >
              {video ? <Video /> : <VideoOff />}
              Video
            </Toggle>
          </div>

          <div className="grid grid-cols-2 gap-2 w-full">
            <Toggle
              variant="outline"
              pressed={transcript}
              onPressedChange={setAITranscription}
            >
              {transcript ? <AITranscription /> : <AITranscriptionOff />}
              AI Transcription
            </Toggle>

            <Toggle
              variant="outline"
              pressed={notes}
              onPressedChange={setAINotes}
            >
              {notes ? <AINotes /> : <AINotesOff />}
              AI Notes
            </Toggle>
          </div>

          <Button className="w-full" onClick={() => setOpenStartMeeting(true)}>
            <Video />
            Start Meeting Now
          </Button>
        </CardContent>
      </Card>

      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle>Quick Action</CardTitle>
          <CardDescription>
            Join or schedule meetings
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-0 pb-0">
          <div className="flex flex-col gap-4">
            <Button variant="outline" className="w-full justify-start" onClick={() => setOpenJoinMeeting(true)}>
              <UsersThreeIcon />
              Join Meeting with Code
            </Button>

            <Button variant="outline" className="w-full justify-start" onClick={() => setOpenScheduleLater(true)}>
              <CalendarPlusIcon />
              Schedule for Later
            </Button>

            <Button variant="outline" className="w-full justify-start" onClick={() => setOpenInviteParticipants(true)}>
              <UsersIcon />
              Invite Participants
            </Button>
          </div>
        </CardContent>
      </Card>

      <StartMeetingSheet open={openStartMeeting} onOpenChange={setOpenStartMeeting}
        meetingTitle={meetingTitle}
        micEnabled={mic} videoEnabled={video} AINotesEnabled={notes} AITranscriptionEnabled={transcript}
      />
      <JoinMeetingSheet open={openJoinMeeting} onOpenChange={setOpenJoinMeeting} />
      <ScheduleLaterSheet open={openScheduleLater} onOpenChange={setOpenScheduleLater} />
      <InviteParticipantsSheet open={openInviteParticipants} onOpenChange={setOpenInviteParticipants} />
    </section>
  )
}
