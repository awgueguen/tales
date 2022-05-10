import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  console.log("Private route works!");
  const auth = null;
  return auth ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
