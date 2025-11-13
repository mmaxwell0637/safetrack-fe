import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./auth";

type Role = "customer" | "employee";

type Props = {
  children: ReactNode;          // ← use ReactNode, not JSX.Element
  roles?: Role[];               // roles allowed (optional)
};

export default function ProtectedRoute({ children, roles }: Props) {
  const { user } = useAuth();

  // Not logged in → go to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but role not allowed → send customers to ticket form (or wherever)
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/tickets/new" replace />;
  }

  return <>{children}</>;
}
