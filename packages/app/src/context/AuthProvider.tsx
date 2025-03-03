import React, { useState, useEffect } from "react";
import { login, logout, getAuthToken } from "../services/api/auth";
import { AuthContext } from "./AuthContext";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<string | null>(null);

    useEffect(() => {
        const token = getAuthToken();
        if (token) {
            setUser("Authenticated");
        }
    }, []);

    const loginUser = async (email: string, password: string) => {
        await login(email, password);
        setUser("Authenticated");
    };

    const logoutUser = () => {
        logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
};