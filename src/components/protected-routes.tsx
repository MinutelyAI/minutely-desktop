import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const isLoggedIn = localStorage.getItem("auth") === "true";

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
}
