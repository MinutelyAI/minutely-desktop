import { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import LoginPage from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import ProtectedRoute from "@/components/protected-routes";
import SignupPage from "./pages/Signup";
import ProtectedLayout from "@/components/protected-layout";
import StartMeetingPage from "@/pages/meetings/start-meeting";
import MeetingNotesPage from "@/pages/meetings/meeting-notes";
import MeetingNoteDetailPage from "@/pages/meetings/meeting-note-detail";
import CalenderPage from "@/pages/meetings/calender";
import MeetingsDashboard from "@/pages/meetings/meetings";
import MeetingsLayout from "@/pages/meetings/layout";
import ActiveMeetingPage from "@/pages/meetings/active-meeting";
import ChatPage from "@/pages/chat/chat";
import TeamChatPage from "@/pages/chat/team";
import GroupsChatPage from "@/pages/chat/groups";
import { MeetingProvider } from "@/contexts/meeting-context";
import JoinMeetingPage from "@/pages/meetings/join-meeting";
import SettingsPage from "@/pages/misc/settings";
import ArchivePage from "@/pages/misc/archive";
import TrashPage from "@/pages/misc/trash";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/contexts/theme-context";

const GuestRoute = ({ children }: { children: React.ReactNode }) => {
  const isLoggedIn =
    localStorage.getItem("auth") === "true" &&
    Boolean(localStorage.getItem("token"));
  if (isLoggedIn) {
    return <Navigate to="/meetings" replace />;
  }
  return children;
};

export default function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleUnauthorized = () => {
      navigate("/login", { replace: true });
    };
    window.addEventListener("unauthorized_api_call", handleUnauthorized);
    return () =>
      window.removeEventListener("unauthorized_api_call", handleUnauthorized);
  }, [navigate]);

  return (
    <ThemeProvider>
      <MeetingProvider>
        <Toaster position="bottom-right" richColors />
        <Routes>
          <Route path="/join/:meetingId" element={<JoinMeetingPage />} />

          <Route
            path="/login"
            element={
              <GuestRoute>
                <LoginPage />
              </GuestRoute>
            }
          />

          <Route
            path="/signup"
            element={
              <GuestRoute>
                <SignupPage />
              </GuestRoute>
            }
          />

          <Route path="/dashboard" element={<Navigate to="/meetings" replace />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<ProtectedLayout />}>
              <Route path="/" element={<Dashboard />}>
                <Route index element={<Navigate to="/meetings" replace />} />
                <Route path="meetings" element={<MeetingsLayout />}>
                  <Route index element={<MeetingsDashboard />} />
                  <Route path="start-meetings" element={<StartMeetingPage />} />
                  <Route path="active-meeting" element={<ActiveMeetingPage />} />
                  <Route path="meetings-notes" element={<MeetingNotesPage />}>
                    <Route path=":noteId" element={<MeetingNoteDetailPage />} />
                  </Route>
                  <Route path="calender" element={<CalenderPage />} />
                </Route>
                <Route path="chat" element={<ChatPage />}>
                  <Route path="team" element={<TeamChatPage />} />
                  <Route path="groups" element={<GroupsChatPage />} />
                </Route>
                <Route path="settings" element={<SettingsPage />} />
                <Route path="archive" element={<ArchivePage />} />
                <Route path="trash" element={<TrashPage />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </MeetingProvider>
    </ThemeProvider>
  );
}
