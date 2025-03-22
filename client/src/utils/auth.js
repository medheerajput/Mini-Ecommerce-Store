import api from "../api/api"; // Import Axios instance

export const verifyUser = async () => {
  try {
    const response = await api.get("/auth/me"); // Verify user from backend
    return response.data; // Return user data if authenticated
  } catch (error) {
    return null; // Return null if not authenticated
  }
};
