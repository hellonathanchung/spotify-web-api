import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";

export default function RequireAuth() {
  const { isAuthenticated } = useAuthContext();

  if (isAuthenticated) {
    return <Outlet />;
  }
  return <Navigate replace to="/login" />;
}
