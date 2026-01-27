import { Navigate } from "react-router-dom";

export default function SuccessRoute({ children }) {
  const isSuccess = localStorage.getItem("isSuccess");

  // Si no existe el flag → fuera
  if (!isSuccess) {
    return <Navigate to="/home" replace />;
  }

  // Limpia el flag apenas se valida
  localStorage.removeItem("isSuccess");

  return children;
}