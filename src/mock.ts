import { MeetingParticipant, MeetingNotes } from "@/types";

export const availableParticipants: MeetingParticipant[] = [
  {
    id: 1,
    displayName: "Ethan Carter",
    email: "ethan.carter@minutely.app",
    username: "ethan_carter",
  },
  {
    id: 2,
    displayName: "Olivia Bennett",
    email: "olivia.bennett@minutely.app",
    username: "olivia_bennett",
  },
  {
    id: 3,
    displayName: "Liam Parker",
    email: "liam.parker@minutely.app",
    username: "liam_parker",
  },
  {
    id: 4,
    displayName: "Sophia Reed",
    email: "sophia.reed@minutely.app",
    username: "sophia_reed",
  },
  {
    id: 5,
    displayName: "Daniel Ross",
    email: "daniel.ross@minutely.app",
    username: "daniel_ross",
  },
  {
    id: 6,
    displayName: "Chloe Morgan",
    email: "chloe.morgan@minutely.app",
    username: "chloe_morgan",
  },
  {
    id: 7,
    displayName: "James Walker",
    email: "james.walker@minutely.app",
    username: "james_walker",
  },
  {
    id: 8,
    displayName: "Mia Cooper",
    email: "mia.cooper@minutely.app",
    username: "mia_cooper",
  },
];

export const meetingNotes: MeetingNotes[] = [
  {
    id: 1,
    title: "Q2 Product Planning Sync",
    tags: ["Roadmap", "Priorities", "Launch"],
    category: "Leadership",
    meeting: {
      id: 101,
      title: "Q2 Product Planning Sync",
      dateLabel: "Mar 18, 2026",
      timeRange: "10:00 AM - 11:00 AM",
      duration: "60 min",
      location: "Strategy Room",
      organizer: "Ethan Carter",
      participants: [
        availableParticipants[0],
        availableParticipants[1],
        availableParticipants[2],
        availableParticipants[3],
      ],
      summary:
        "Reviewed roadmap sequencing, launch dependencies, and cross-functional ownership for the next release cycle.",
    },
    highlights: [
      "Mobile reminders remain the top customer request.",
      "Engineering capacity is available for one major initiative and two quality-of-life improvements.",
      "Marketing needs final launch messaging by the first week of April.",
    ],
    decisions: [
      "Move meeting templates into the April release scope.",
      "Keep AI summary export behind a feature flag for the beta cohort.",
    ],
    sections: [
      {
        title: "Agenda",
        items: [
          "Review customer feedback themes from the last 30 days.",
          "Finalize Q2 roadmap ordering.",
          "Align launch owners across engineering, design, and marketing.",
        ],
      },
      {
        title: "Discussion Notes",
        items: [
          "The team agreed that reminder workflows will drive the fastest retention gains.",
          "Design requested one extra week for template customization states.",
          "Customer success asked for admin-level summary exports for enterprise accounts.",
        ],
      },
    ],
    actionItems: [
      {
        id: 1,
        title: "Prepare launch messaging draft",
        owner: "Olivia Bennett",
        dueDate: "Apr 03",
        completed: false,
        status: "open",
      },
      {
        id: 2,
        title: "Confirm engineering estimate for meeting templates",
        owner: "Liam Parker",
        dueDate: "Mar 24",
        completed: true,
        status: "completed",
      },
    ],
  },
  {
    id: 2,
    title: "Design Critique: Notes Workspace",
    tags: ["UX", "Review", "Workspace"],
    category: "Internal",
    meeting: {
      id: 102,
      title: "Design Critique: Notes Workspace",
      dateLabel: "Mar 16, 2026",
      timeRange: "2:00 PM - 2:45 PM",
      duration: "45 min",
      location: "Studio Sync",
      organizer: "Sophia Reed",
      participants: [
        availableParticipants[1],
        availableParticipants[3],
        availableParticipants[5],
      ],
      summary:
        "Critiqued the note detail layout, readability hierarchy, and the discoverability of action items.",
    },
    highlights: [
      "The summary block was clear, but action items needed stronger separation.",
      "Dense bullets reduced scan speed on smaller viewports.",
      "Users preferred visible tags over hidden filters.",
    ],
    decisions: [
      "Use a two-column detail layout on desktop.",
      "Keep action items visible near the top of each note card.",
    ],
    sections: [
      {
        title: "Feedback",
        items: [
          "Increase contrast between metadata and content blocks.",
          "Add a lightweight stats rail so the page feels navigable at a glance.",
          "Avoid deep nesting in the note detail presentation.",
        ],
      },
    ],
    actionItems: [
      {
        id: 3,
        title: "Revise note card hierarchy",
        owner: "Sophia Reed",
        dueDate: "Mar 22",
        completed: false,
        status: "open",
      },
      {
        id: 4,
        title: "Validate compact layout with PM team",
        owner: "Chloe Morgan",
        dueDate: "Mar 21",
        completed: false,
        status: "open",
      },
    ],
  },
  {
    id: 3,
    title: "Enterprise Customer Review",
    tags: ["Client", "Feedback", "Enterprise"],
    category: "Client",
    meeting: {
      id: 103,
      title: "Enterprise Customer Review",
      dateLabel: "Mar 14, 2026",
      timeRange: "4:30 PM - 5:15 PM",
      duration: "45 min",
      location: "Client Channel",
      organizer: "Daniel Ross",
      participants: [
        availableParticipants[4],
        availableParticipants[6],
        availableParticipants[7],
      ],
      summary:
        "Captured procurement concerns, rollout blockers, and reporting requests from a pilot enterprise account.",
    },
    highlights: [
      "The client wants SSO support before expanding seats.",
      "Department leads need downloadable weekly summaries.",
      "Adoption is highest in teams with recurring standups.",
    ],
    decisions: [
      "Share a phased rollout plan with the client next week.",
    ],
    sections: [
      {
        title: "Client Requests",
        items: [
          "Support role-based visibility for shared notes.",
          "Allow exports for compliance reviews.",
          "Offer onboarding templates for recurring team rituals.",
        ],
      },
      {
        title: "Risks",
        items: [
          "Procurement may pause expansion until SSO is on the roadmap.",
          "Manual exports are acceptable only as a short-term workaround.",
        ],
      },
    ],
    actionItems: [
      {
        id: 5,
        title: "Draft phased rollout response",
        owner: "Daniel Ross",
        dueDate: "Mar 25",
        completed: false,
        status: "open",
      },
      {
        id: 6,
        title: "Document SSO requirement for sales follow-up",
        owner: "James Walker",
        dueDate: "Mar 20",
        completed: true,
        status: "completed",
      },
    ],
  },
];
