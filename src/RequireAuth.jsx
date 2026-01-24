import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function RequireAuth({ children }) {
  const location = useLocation();
  const authed = localStorage.getItem("auth") === "1";

  if (!authed) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
