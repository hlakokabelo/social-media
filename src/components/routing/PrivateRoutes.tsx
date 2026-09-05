import { Outlet, Navigate } from "react-router";
import { useAuth } from "../../context/AuthContext";

const PrivateRoutes = () => {
  const { user } = useAuth();
  return user ? <Navigate to="/" /> : <Outlet />;
};

export default PrivateRoutes;
