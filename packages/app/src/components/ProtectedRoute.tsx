import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const auth = useContext(AuthContext);
    console.log("ProtectedRoute - user state:", auth?.user); // Debug log

    if (!auth?.user) {
        console.log("User not authenticated, redirecting to /login");
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
