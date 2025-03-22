import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000", // Backend server URL
  withCredentials: true, // Required for authentication
});

export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const loginUser = async (userData) => {
    const response = await api.post("/auth/login", userData);
    return response.data;
  };


export default api;
