import React, { JSX } from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const token = localStorage.getItem("token");

  if (!token) {
    // Not authenticated — redirect to login
    return <Navigate to="/login" replace />;
  }

  // Authenticated — render children components
  return children;
};

export default PrivateRoute;
