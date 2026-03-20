export type StartMeetingSheetProps = {
  meetingTitle: string;
  onMeetingTitleChange: (value: string) => void;
  quickNote: string;
  onQuickNoteChange: (value: string) => void;
  micEnabled: boolean;
  onMicEnabledChange: (value: boolean) => void;
  videoEnabled: boolean;
  onVideoEnabledChange: (value: boolean) => void;
  AITranscriptionEnabled: boolean;
  onAITranscriptionEnabledChange: (value: boolean) => void;
  AINotesEnabled: boolean;
  onAINotesEnabledChange: (value: boolean) => void;
  isScheduled: boolean;
  onIsScheduledChange: (value: boolean) => void;
  scheduledDate: string;
  onScheduledDateChange: (value: string) => void;
  scheduledTime: string;
  onScheduledTimeChange: (value: string) => void;
  participants: MeetingParticipant[];

  open: boolean;
  onOpenChange: (open: boolean) => void;
};


export type Nav = {
  title: string
  url?: string
  icon: React.ComponentType
  isActive?: boolean
  items?: {
    title: string
    url: string
  }[]
}

export type User = {
  name: string
  email: string
  avatar: string
}

export type MeetingParticipant = {
  id: number
  displayName: string
  email: string
  username: string
}
