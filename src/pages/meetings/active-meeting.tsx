import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMeeting } from '@/contexts/meeting-context';
import { useMediaStream, useParticipantStreams } from '@/hooks/use-media-stream';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarGroup } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { formatMeetingCode } from '@/lib/meeting-utils';
import { VideoGrid } from '@/components/video-grid';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  LogOut,
  X,
  Copy,
  Check,
  AlertCircle,
} from 'lucide-react';

export default function ActiveMeetingPage() {
  const { activeMeeting, endMeeting } = useMeeting();
  const navigate = useNavigate();
  
  // Media stream management
  const mediaStream = useMediaStream({
    audio: activeMeeting?.settings.microphone ?? true,
    video: activeMeeting?.settings.video ?? true,
  });
  
  const { participantStreams } = useParticipantStreams();
  
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [endType, setEndType] = useState<'leave' | 'endForAll'>('leave');
  const [copied, setCopied] = useState(false);
  
  // Track local mic/video state
  const [micEnabled, setMicEnabled] = useState(mediaStream.isAudioEnabled);
  const [videoEnabled, setVideoEnabled] = useState(mediaStream.isVideoEnabled);
  
  // Simulate adding participant streams (in a real app, this would come from backend)
  const remoteParticipants = activeMeeting?.participants.map((p) => ({
    id: `participant-${p.id}`,
    displayName: p.displayName,
    stream: new MediaStream(), // Placeholder stream
    audioEnabled: true,
    videoEnabled: true,
  })) || [];
  
  useEffect(() => {
    setMicEnabled(mediaStream.isAudioEnabled);
  }, [mediaStream.isAudioEnabled]);
  
  useEffect(() => {
    setVideoEnabled(mediaStream.isVideoEnabled);
  }, [mediaStream.isVideoEnabled]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mediaStream.stopStream();
    };
  }, []);

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

  const handleToggleMic = () => {
    mediaStream.toggleAudio();
    setMicEnabled(!micEnabled);
  };

  const handleToggleVideo = () => {
    mediaStream.toggleVideo();
    setVideoEnabled(!videoEnabled);
  };

  const handleEndMeeting = () => {
    mediaStream.stopStream();
    endMeeting(endType === 'endForAll');
    setShowEndDialog(false);
    navigate('/meetings');
  };

  return (
    <section className="flex h-full flex-col gap-4 p-5">
      {/* Meeting Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{activeMeeting.title || 'Instant Meeting'}</h1>
          <p className="text-sm text-muted-foreground">
            Code: <span className="font-mono font-semibold">{formattedCode}</span>
          </p>
        </div>
        <Badge variant="default" className="h-fit">
          LIVE
        </Badge>
      </div>

      {/* Media Stream Error Display */}
      {mediaStream.error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/5 p-3">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <p className="text-sm text-destructive">
            {mediaStream.error}
          </p>
        </div>
      )}

      {/* Main Video Grid */}
      <Card className="flex-1 overflow-hidden">
        <CardContent className="h-full p-4">
          {mediaStream.isLoading ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">Requesting camera and microphone access...</p>
            </div>
          ) : (
            <VideoGrid
              localStream={mediaStream.stream}
              localDisplayName="You"
              localAudioEnabled={micEnabled}
              localVideoEnabled={videoEnabled}
              remoteStreams={remoteParticipants}
            />
          )}
        </CardContent>
      </Card>

      {/* Meeting Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex gap-2">
              <Button
                variant={micEnabled ? 'default' : 'secondary'}
                size="lg"
                className="h-14 w-14 rounded-full p-0"
                onClick={handleToggleMic}
                title={micEnabled ? 'Mute microphone' : 'Unmute microphone'}
              >
                {micEnabled ? (
                  <Mic className="h-6 w-6" />
                ) : (
                  <MicOff className="h-6 w-6" />
                )}
              </Button>

              <Button
                variant={videoEnabled ? 'default' : 'secondary'}
                size="lg"
                className="h-14 w-14 rounded-full p-0"
                onClick={handleToggleVideo}
                title={videoEnabled ? 'Turn off camera' : 'Turn on camera'}
              >
                {videoEnabled ? (
                  <Video className="h-6 w-6" />
                ) : (
                  <VideoOff className="h-6 w-6" />
                )}
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="h-14 w-14 rounded-full p-0"
                onClick={handleCopyCode}
                title="Copy meeting code"
              >
                {copied ? (
                  <Check className="h-6 w-6 text-green-600" />
                ) : (
                  <Copy className="h-6 w-6" />
                )}
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setEndType('leave');
                  setShowEndDialog(true);
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Leave Meeting
              </Button>

              <Button
                variant="destructive"
                onClick={() => {
                  setEndType('endForAll');
                  setShowEndDialog(true);
                }}
              >
                <X className="mr-2 h-4 w-4" />
                End for All
              </Button>
            </div>
          </div>

          {/* Control Indicators */}
          <div className="mt-4 flex flex-wrap gap-2 border-t pt-4">
            <Badge variant={micEnabled ? 'default' : 'secondary'}>
              {micEnabled ? '🎤 Microphone On' : '🎤 Microphone Off'}
            </Badge>
            <Badge variant={videoEnabled ? 'default' : 'secondary'}>
              {videoEnabled ? '📹 Camera On' : '📹 Camera Off'}
            </Badge>
            <Badge variant="secondary">
              👥 {activeMeeting.participants.length + 1} Participants
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Side Info Panel */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Meeting Code Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Share Meeting</CardTitle>
            <CardDescription>Invite others to join</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg border-2 border-dashed border-primary/50 bg-primary/5 p-4 text-center">
              <p className="font-mono text-xl font-bold">{formattedCode}</p>
            </div>
            <Button className="w-full" onClick={handleCopyCode} variant={copied ? 'secondary' : 'default'}>
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
            <CardTitle className="text-base">Participants ({activeMeeting.participants.length + 1})</CardTitle>
            <CardDescription>People in this meeting</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-lg border p-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">Y</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">You</p>
                  <p className="text-xs text-muted-foreground">Host</p>
                </div>
                <Badge variant="secondary" className="text-xs">Online</Badge>
              </div>

              {activeMeeting.participants.map((participant) => (
                <div key={participant.id} className="flex items-center gap-3 rounded-lg border p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {participant.displayName
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{participant.displayName}</p>
                    <p className="text-xs text-muted-foreground truncate">{participant.email}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">Online</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
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

          {endType === 'endForAll' && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/5 p-3">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <p className="text-sm text-destructive">
                This will end the meeting for all {activeMeeting.participants.length + 1} participants.
              </p>
            </div>
          )}

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
