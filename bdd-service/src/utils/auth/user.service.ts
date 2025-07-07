// utils/api-clients/auth-client.ts
import { IUser } from "../../types";
import { logger } from "../logger";
import config from "../../config";

const AUTH_SERVICE_URL = config.server.auth_service_url;

export const getUserById = async (
  userId: string,
  token: string
): Promise<IUser | null> => {
  try {
    const authHeader = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

    const response = await fetch(`${AUTH_SERVICE_URL}/users/${userId}`, {
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      // Logging détaillé pour le débogage
      const responseText = await response.text();
      console.log(
        `Response from auth service: ${response.status} - ${responseText}`
      );

      if (response.status === 404) {
        return null;
      }
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    logger.error(
      `Error fetching user with id ${userId} from auth service`,
      error
    );
    throw error;
  }
};

export const validateToken = async (token: string): Promise<boolean> => {
  try {
    const response = await fetch(`${AUTH_SERVICE_URL}/auth/validate-token`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    return response.ok;
  } catch (error) {
    return false;
  }
};
