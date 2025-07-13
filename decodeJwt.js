import { jwtDecode } from "jwt-decode";
export const decodeToken = (token) => {
  try {
    if (!token) return null; // Ensure token exists

    const decoded = jwtDecode(token);

    // Check if token is expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTime) {
      console.warn("Token has expired");
      return null;
    }

    return decoded;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};