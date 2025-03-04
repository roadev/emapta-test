import axios from "axios";
import { API_URL } from ".";

const endpoint = `${API_URL}/api/auth`;

export const login = async (email: string, password: string) => {
    const response = await axios.post(`${endpoint}/login`, { email, password });
    localStorage.setItem("token", response.data.token);
    return response.data;
};

export const register = async (email: string, password: string) => {
    const response = await axios.post(`${endpoint}/register`, { email, password });
    return response.data;
};

export const logout = () => {
    localStorage.removeItem("token");
};

export const getAuthToken = () => localStorage.getItem("token");
