import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { verifyUser } from "./auth"; // Import authentication check function

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const user = await verifyUser();
      setIsAuthenticated(!!user);
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) return <p>Loading...</p>; // Show loading state

  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
