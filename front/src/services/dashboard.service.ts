import { getToken } from "./auth.service";

// api/dashboard.ts
const API_URL =
  process.env.NEXT_PUBLIC_API_URL_CLIENT || "http://localhost:3001/api/";

export const fetchUserDashboard = async () => {
  const token = getToken();

  if (!token) {
    throw new Error("Authentication required");
  }
  const userId = getUserIdFromToken(token);

  const response = await fetch(`${API_URL}dashboard/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  return await response.json();
};

const getUserIdFromToken = (token: string): string => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    // Extraire l'userId en fonction de la structure de votre token
    const payload = JSON.parse(jsonPayload);
    return payload.userId; // D'après votre token, la clé est 'userId'
  } catch (error) {
    console.error("Failed to extract userId from token:", error);
    throw new Error("Invalid token format");
  }
};
