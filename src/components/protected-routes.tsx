import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const isLoggedIn = localStorage.getItem("auth") === "true";
  const token = localStorage.getItem("token");

  return isLoggedIn && Boolean(token) ? <Outlet /> : <Navigate to="/login" replace />;
}
