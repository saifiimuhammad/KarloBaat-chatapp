import type { FC, ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";

interface ProtectRouteProps {
  user: unknown;
  redirect?: string;
  children?: ReactNode;
}

const ProtectRoute: FC<ProtectRouteProps> = ({
  children,
  user,
  redirect = "/login",
}) => {
  if (!user) return <Navigate to={redirect} replace />;

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectRoute;
