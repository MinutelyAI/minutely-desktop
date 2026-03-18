export type StartMeetingSheetProps = {
  meetingTitle: string;
  micEnabled: boolean;
  videoEnabled: boolean;
  AITranscriptionEnabled: boolean;
  AINotesEnabled: boolean;

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
