import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export const AdminRoute = ({ children }) => {
  const { role } = useSelector((state) => state.userSlice.value);
  console.log(role)

  if (role === 1) {
    // return <Navigate to={"/"} />;
  }
  return children;
};
