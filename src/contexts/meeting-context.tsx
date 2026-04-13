import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ActiveMeeting } from '@/types';

type MeetingContextType = {
  activeMeeting: ActiveMeeting | null;
  createMeeting: (meeting: ActiveMeeting) => void;
  endMeeting: (forAll: boolean) => void;
  updateMeeting: (updates: Partial<ActiveMeeting>) => void;
};

const MeetingContext = createContext<MeetingContextType | undefined>(undefined);

export function MeetingProvider({ children }: { children: ReactNode }) {
  const [activeMeeting, setActiveMeeting] = useState<ActiveMeeting | null>(null);

  const createMeeting = (meeting: ActiveMeeting) => {
    setActiveMeeting(meeting);
  };

  const endMeeting = (forAll: boolean) => {
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
  };

  const updateMeeting = (updates: Partial<ActiveMeeting>) => {
    setActiveMeeting((prev) =>
      prev ? { ...prev, ...updates } : null
    );
  };

  return (
    <MeetingContext.Provider value={{ activeMeeting, createMeeting, endMeeting, updateMeeting }}>
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
