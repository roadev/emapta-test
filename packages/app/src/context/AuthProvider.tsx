import React, { useState, useEffect } from "react";
import { login, logout, getAuthToken } from "../services/api/auth";
import { AuthContext } from "./AuthContext";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = getAuthToken();
        console.log("Checking token:", token);
        if (token) {
            console.log("User authenticated");
            setUser("Authenticated");
        }
        setLoading(false);
    }, []);

    const loginUser = async (email: string, password: string) => {
        await login(email, password);
        console.log("User logged in, setting state...");
        setUser("Authenticated");
    };

    const logoutUser = () => {
        logout();
        console.log("User logged out");
        setUser(null);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
};
