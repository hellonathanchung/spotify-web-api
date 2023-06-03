import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";

export const RequireAuth = () => {
  const { isAuthenticated } = useAuthContext();

  if (isAuthenticated) {
    return <Outlet />;
  }
  return <Navigate replace to="/login" />;
};
