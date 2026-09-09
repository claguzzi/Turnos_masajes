import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const isAdmin = localStorage.getItem("adminToken");

  if (!isAdmin) {
    return <Navigate to="/adminlogin" replace />;
  }

  return children;
}
