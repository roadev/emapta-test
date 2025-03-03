import { createContext } from "react";

interface AuthContextType {
    user: string | null;
    loginUser: (email: string, password: string) => Promise<void>;
    logoutUser: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);