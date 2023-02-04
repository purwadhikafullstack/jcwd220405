import { Navigate } from "react-router-dom";

export const ProtectingRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to={"/"} />;
  } else {
    return children;
  }
};
