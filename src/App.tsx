import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import ProtectedRoute from "@/components/protected-routes";
import SignupPage from "./pages/Signup";
import ProtectedLayout from "@/components/protected-layout";
import StartMeetingPage from "@/pages/meetings/start-meeting";
import MeetingNotesPage from "@/pages/meetings/meeting-notes";
import MeetingNoteDetailPage from "@/pages/meetings/meeting-note-detail";
import CalenderPage from "@/pages/meetings/calender";
import MeetingsPage from "@/pages/meetings/meetings";
import ChatPage from "@/pages/chat/chat";
import TeamChatPage from "@/pages/chat/team";
import GroupsChatPage from "@/pages/chat/groups";

export default function App() {
  const isLoggedIn = localStorage.getItem("auth") === "true";
  const defaultDashboardRoute = "/meetings";

  return (
    <Routes>
      <Route
        path="/login"
        element={isLoggedIn ? <Navigate to={defaultDashboardRoute} replace /> : <LoginPage />}
      />

      <Route
        path="/signup"
        element={isLoggedIn ? <Navigate to={defaultDashboardRoute} replace /> : <SignupPage />}
      />

      <Route
        path="/dashboard"
        element={<Navigate to={defaultDashboardRoute} replace />}
      />

      <Route element={<ProtectedRoute />}>
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<Dashboard />}>
            <Route index element={<Navigate to="/meetings" replace />} />
            <Route path="meetings" element={<MeetingsPage />}>
              <Route path="start-meetings" element={<StartMeetingPage />} />
              <Route path="meetings-notes" element={<MeetingNotesPage />}>
                <Route path=":noteId" element={<MeetingNoteDetailPage />} />
              </Route>
              <Route path="calender" element={<CalenderPage />} />
            </Route>
            <Route path="chat" element={<ChatPage />}>
              <Route path="team" element={<TeamChatPage />} />
              <Route path="groups" element={<GroupsChatPage />} />
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
