import { Navigate } from "react-router-dom";

type Props = {
  children: React.ReactNode;
  allowedRole: string;
};

const ProtectedRoute = ({
  children,
  allowedRole,
}: Props) => {
  const token = localStorage.getItem("token");

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  if (!token) {
    return <Navigate to="/" />;
  }

  if (user?.role !== allowedRole) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;