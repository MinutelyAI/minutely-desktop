import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import ProtectedRoute from "@/components/protected-routes";
import SignupPage from "./pages/Signup";

export default function App() {
  const isLoggedIn = localStorage.getItem("auth") === "true";
  const defaultDashboardRoute = "/dashboard/meetings"

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={isLoggedIn ? defaultDashboardRoute : "/login"} replace />}
      />

      <Route
        path="/login"
        element={isLoggedIn ? <Navigate to={defaultDashboardRoute} replace /> : <LoginPage />}
      />

      <Route
        path="/signup"
        element={isLoggedIn ? <Navigate to={defaultDashboardRoute} replace /> : <SignupPage />}
      />

      <Route path="/dashboard" element={
        <Navigate to={defaultDashboardRoute} replace /> } />

      <Route
        path="/dashboard/:sectionId"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
