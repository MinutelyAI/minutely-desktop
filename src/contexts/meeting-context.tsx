import React, { createContext, useCallback, useContext, useMemo, useState, ReactNode } from 'react';
import { ActiveMeeting, ScheduledMeeting } from '@/types';

type MeetingContextType = {
  activeMeeting: ActiveMeeting | null;
  scheduledMeetings: ScheduledMeeting[];
  createMeeting: (meeting: ActiveMeeting) => void;
  scheduleMeeting: (meeting: ScheduledMeeting) => void;
  endMeeting: (forAll: boolean) => void;
  updateMeeting: (updates: Partial<ActiveMeeting>) => void;
};

const MeetingContext = createContext<MeetingContextType | undefined>(undefined);

export function MeetingProvider({ children }: { children: ReactNode }) {
  const [activeMeeting, setActiveMeeting] = useState<ActiveMeeting | null>(null);
  const [scheduledMeetings, setScheduledMeetings] = useState<ScheduledMeeting[]>([]);

  const createMeeting = useCallback((meeting: ActiveMeeting) => {
    setActiveMeeting(meeting);
  }, []);

  const scheduleMeeting = useCallback((meeting: ScheduledMeeting) => {
    setScheduledMeetings((current) => [...current, meeting]);
  }, []);

  const endMeeting = useCallback((forAll: boolean) => {
    if (activeMeeting) {
      if (forAll) {
        // End for all participants
        setActiveMeeting(null);
      } else {
        // Just mark current user as left
        // In a real app, this would send a leave event to the backend
        console.log('User left meeting:', activeMeeting.id);
      }
    }
  }, [activeMeeting]);

  const updateMeeting = useCallback((updates: Partial<ActiveMeeting>) => {
    setActiveMeeting((prev) =>
      prev ? { ...prev, ...updates } : null
    );
  }, []);

  const contextValue = useMemo(() => ({
    activeMeeting,
    scheduledMeetings,
    createMeeting,
    scheduleMeeting,
    endMeeting,
    updateMeeting,
  }), [activeMeeting, scheduledMeetings, createMeeting, scheduleMeeting, endMeeting, updateMeeting]);

  return (
    <MeetingContext.Provider value={contextValue}>
      {children}
    </MeetingContext.Provider>
  );
}

export function useMeeting() {
  const context = useContext(MeetingContext);
  if (!context) {
    throw new Error('useMeeting must be used within MeetingProvider');
  }
  return context;
}
