import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMeeting } from '@/contexts/meeting-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarGroup } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { formatMeetingCode } from '@/lib/meeting-utils';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Share2,
  LogOut,
  X,
  Copy,
  Check,
} from 'lucide-react';
import {
  Microphone,
  MicrophoneSlashIcon as MicrophoneOff,
  VideoCameraIcon as VideoIcon,
  VideoCameraSlashIcon as VideoOffIcon,
} from '@phosphor-icons/react';

export default function ActiveMeetingPage() {
  const { activeMeeting, endMeeting } = useMeeting();
  const navigate = useNavigate();
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [endType, setEndType] = useState<'leave' | 'endForAll'>('leave');
  const [copied, setCopied] = useState(false);

  if (!activeMeeting) {
    return (
      <div className="flex h-full items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>No Active Meeting</CardTitle>
            <CardDescription>
              There is no active meeting. Start one to begin.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => navigate('/meetings/start-meetings')}>
              Start a Meeting
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formattedCode = formatMeetingCode(activeMeeting.code);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(formattedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEndMeeting = () => {
    endMeeting(endType === 'endForAll');
    setShowEndDialog(false);
    navigate('/meetings');
  };

  return (
    <section className="flex h-full flex-col p-5">
      {/* Meeting Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{activeMeeting.title || 'Instant Meeting'}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Meeting Code: <span className="font-mono font-semibold">{formattedCode}</span>
          </p>
        </div>
        <Badge variant="default" className="h-fit">
          LIVE
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Meeting Area */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Meeting Room</CardTitle>
            <CardDescription>
              Your meeting is active with {activeMeeting.participants.length} participant{activeMeeting.participants.length !== 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Video Area Placeholder */}
            <div className="flex h-80 items-center justify-center rounded-lg bg-muted">
              <div className="text-center">
                <VideoIcon className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                <p className="text-muted-foreground">Video stream will appear here</p>
              </div>
            </div>

            {/* Meeting Controls */}
            <div className="space-y-4">
              <Label className="text-sm font-medium">Meeting Controls</Label>
              <div className="grid grid-cols-4 gap-2">
                <Button
                  variant={activeMeeting.settings.microphone ? 'default' : 'secondary'}
                  size="lg"
                  className="h-16 flex-col"
                >
                  {activeMeeting.settings.microphone ? (
                    <>
                      <Mic className="mb-2 h-6 w-6" />
                      <span className="text-xs">Mic On</span>
                    </>
                  ) : (
                    <>
                      <MicOff className="mb-2 h-6 w-6" />
                      <span className="text-xs">Mic Off</span>
                    </>
                  )}
                </Button>

                <Button
                  variant={activeMeeting.settings.video ? 'default' : 'secondary'}
                  size="lg"
                  className="h-16 flex-col"
                >
                  {activeMeeting.settings.video ? (
                    <>
                      <Video className="mb-2 h-6 w-6" />
                      <span className="text-xs">Camera On</span>
                    </>
                  ) : (
                    <>
                      <VideoOff className="mb-2 h-6 w-6" />
                      <span className="text-xs">Camera Off</span>
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="h-16 flex-col"
                  onClick={handleCopyCode}
                >
                  {copied ? (
                    <>
                      <Check className="mb-2 h-6 w-6" />
                      <span className="text-xs">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="mb-2 h-6 w-6" />
                      <span className="text-xs">Copy Code</span>
                    </>
                  )}
                </Button>

                <Button
                  variant="destructive"
                  size="lg"
                  className="h-16 flex-col"
                  onClick={() => {
                    setEndType('leave');
                    setShowEndDialog(true);
                  }}
                >
                  <LogOut className="mb-2 h-6 w-6" />
                  <span className="text-xs">Leave</span>
                </Button>
              </div>
            </div>

            {/* Quick Note */}
            {activeMeeting.quickNote && (
              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-sm font-medium">Quick Note</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {activeMeeting.quickNote}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Meeting Code Share Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Share Meeting</CardTitle>
              <CardDescription>
                Share this code to invite others
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border-2 border-dashed border-primary/50 bg-primary/5 p-4">
                <p className="text-center font-mono text-2xl font-bold">
                  {formattedCode}
                </p>
              </div>
              <Button
                className="w-full"
                onClick={handleCopyCode}
                variant={copied ? 'secondary' : 'default'}
              >
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Code
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Participants Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Participants</CardTitle>
              <CardDescription>
                {activeMeeting.participants.length} attendee{activeMeeting.participants.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <AvatarGroup>
                {activeMeeting.participants.slice(0, 5).map((participant) => (
                  <Avatar key={participant.id} title={participant.displayName}>
                    <AvatarFallback>
                      {participant.displayName
                        .split(' ')
                        .map((part) => part[0])
                        .join('')
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {activeMeeting.participants.length > 5 && (
                  <Avatar>
                    <AvatarFallback>
                      +{activeMeeting.participants.length - 5}
                    </AvatarFallback>
                  </Avatar>
                )}
              </AvatarGroup>
              <div className="space-y-2">
                {activeMeeting.participants.slice(0, 3).map((participant) => (
                  <div key={participant.id} className="text-sm">
                    <p className="font-medium">{participant.displayName}</p>
                    <p className="text-xs text-muted-foreground">
                      {participant.email}
                    </p>
                  </div>
                ))}
                {activeMeeting.participants.length > 3 && (
                  <p className="text-xs text-muted-foreground">
                    +{activeMeeting.participants.length - 3} more
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Meeting Settings Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">AI Transcription</span>
                <Badge variant={activeMeeting.settings.aiTranscription ? 'default' : 'secondary'}>
                  {activeMeeting.settings.aiTranscription ? 'On' : 'Off'}
                </Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">AI Notes</span>
                <Badge variant={activeMeeting.settings.aiNotes ? 'default' : 'secondary'}>
                  {activeMeeting.settings.aiNotes ? 'On' : 'Off'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* End Meeting Button */}
          <Button
            variant="destructive"
            className="w-full"
            onClick={() => {
              setEndType('endForAll');
              setShowEndDialog(true);
            }}
          >
            <X className="mr-2 h-4 w-4" />
            End Meeting for All
          </Button>
        </div>
      </div>

      {/* End Meeting Dialog */}
      <Dialog open={showEndDialog} onOpenChange={setShowEndDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {endType === 'leave' ? 'Leave Meeting' : 'End Meeting for All'}
            </DialogTitle>
            <DialogDescription>
              {endType === 'leave'
                ? 'You will leave the meeting, but other participants can continue.'
                : 'All participants will be disconnected from this meeting. This action cannot be undone.'}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowEndDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleEndMeeting}
            >
              {endType === 'leave' ? 'Leave Meeting' : 'End for All'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
