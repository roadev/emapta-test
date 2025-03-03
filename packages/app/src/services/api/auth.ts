import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

export const login = async (email: string, password: string) => {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    localStorage.setItem("token", response.data.token);
    return response.data;
};

export const register = async (email: string, password: string) => {
    const response = await axios.post(`${API_URL}/register`, { email, password });
    return response.data;
};

export const logout = () => {
    localStorage.removeItem("token");
};

export const getAuthToken = () => localStorage.getItem("token");
