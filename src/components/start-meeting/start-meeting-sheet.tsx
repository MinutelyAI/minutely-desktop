import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { StartMeetingSheetProps } from "@/types";
import { Toggle } from "../ui/toggle";
import { useState } from "react";
import {
  MicrophoneIcon as Microphone,
  MicrophoneSlashIcon as MicrophoneOff,
  VideoCameraIcon as Video,
  VideoCameraSlashIcon as VideoOff,
  SubtitlesIcon as AITranscription,
  SubtitlesSlashIcon as AITranscriptionOff,
  PencilSimpleSlashIcon as AINotesOff,
  PencilSimpleIcon as AINotes,
} from "@phosphor-icons/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Separator } from "../ui/separator";

export default function StartMeetingSheet({ open, onOpenChange }: StartMeetingSheetProps) {
  const [video, setVideo] = useState(true);
  const [mic, setMic] = useState(true);
  const [transcript, setAITranscription] = useState(true);
  const [notes, setAINotes] = useState(true);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Start Meeting</SheetTitle>
          <SheetDescription>
            Review the meeting details before starting now.
          </SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          <div className="grid gap-3">
            <Label htmlFor="start-meeting-title">Meeting title</Label>
            <Input id="start-meeting-title" placeholder="Enter meeting title" />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="start-meeting-notes">Quick note</Label>
            <Input id="start-meeting-notes" placeholder="Agenda or context" />
          </div>
          <Separator />
          <Label>Meeting Settings</Label>

          <TooltipProvider>
            <div className="flex items-center gap-3">
              <Tooltip>
                <TooltipTrigger>
                  <Toggle variant="outline" pressed={mic} onPressedChange={setMic}>
                    {mic ? <Microphone /> : <MicrophoneOff />}
                  </Toggle>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{mic ? "Turn microphone off" : "Turn microphone on"}</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <Toggle variant="outline" pressed={video} onPressedChange={setVideo}>
                    {video ? <Video /> : <VideoOff />}
                  </Toggle>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{video ? "Turn video off" : "Turn video on"}</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <Toggle
                    variant="outline"
                    pressed={transcript}
                    onPressedChange={setAITranscription}
                  >
                    {transcript ? <AITranscription /> : <AITranscriptionOff />}
                  </Toggle>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{transcript ? "Disable AI transcription" : "Enable AI transcription"}</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger >
                  <Toggle variant="outline" pressed={notes} onPressedChange={setAINotes}>
                    {notes ? <AINotes /> : <AINotesOff />}
                  </Toggle>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{notes ? "Disable AI notes" : "Enable AI notes"}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>
        <SheetFooter>
          <Button type="button">Start Now</Button>
          <SheetClose render={<Button variant="outline">Cancel</Button>} />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
