import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { MicrophoneIcon as Microphone, MicrophoneSlashIcon as MicrophoneOff, UsersIcon, VideoCameraIcon as Video, VideoCameraSlashIcon as VideoOff } from "@phosphor-icons/react";
import { UsersThreeIcon } from "@phosphor-icons/react/dist/ssr";
import { CalendarPlusIcon } from "lucide-react";

export default function StartMeetingPage() {
  const [video, setVideo] = useState(true);
  const [mic, setMic] = useState(true);

  return (
    <section className="grid p-20 md:grid-cols-2">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Meeting Setup</CardTitle>
          <CardDescription>
            Configure your meeting details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label>Meeting Title</Label>
          <Input placeholder="Enter meeting title..." />

          <Label>Meeting Settings</Label>

          <div className="grid grid-cols-2 gap-2 w-full">
            <Toggle variant="outline" onClick={() => setMic(!mic)}>
              {mic ? <Microphone /> : <MicrophoneOff />}
              Microphone
            </Toggle>
            <Toggle variant="outline" onClick={() => setVideo(!video)}>
              {video ? <Video /> : <VideoOff />}
              Video
            </Toggle>
          </div>

          <Button className="w-full">
            <Video />
            Start Meeting Now
          </Button>
        </CardContent>
      </Card>

      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Quick Action</CardTitle>
          <CardDescription>
            Join or schedule meetings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full">
            <UsersThreeIcon />
            Join Meeting with Code
          </Button>
          <Button variant="outline" className="w-full">
            <CalendarPlusIcon />
            Schedule for Later
          </Button>
          <Button variant="outline" className="w-full">
            <UsersIcon />
            Invite Participants
          </Button>
        </CardContent>
      </Card>
    </section>
  )
}
