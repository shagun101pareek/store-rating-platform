import { Navigate } from "react-router-dom";

type Props = {
  children: React.ReactNode;
};

const AuthenticatedRoute = ({ children }: Props) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" />;
  }

  return children;
};

export default AuthenticatedRoute;
