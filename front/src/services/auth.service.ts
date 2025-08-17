// services/auth.service.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api/";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    active: boolean;
  };
}

export interface EmailConfirmationResponse {
  success: boolean;
  message?: string;
}

export const login = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_URL}auth/login-register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Erreur lors de la connexion. Veuillez vérifier vos identifiants."
      );
    }

    // Stocker explicitement les informations d'authentification
    if (typeof window !== "undefined") {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    return data;
  } catch (error: any) {
    throw error instanceof Error
      ? error
      : new Error(
          "Erreur lors de la connexion. Veuillez vérifier vos identifiants."
        );
  }
};

export const logout = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("theme");
};

export const isAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false;

  const token = localStorage.getItem("token");
  return !!token;
};

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;

  try {
    const token = localStorage.getItem("token");

    if (!token || token === "undefined" || token === "null") {
      console.warn("Token non valide ou non trouvé dans le localStorage");
      return null;
    }

    return token;
  } catch (error) {
    console.error("Erreur lors de la récupération du token:", error);
    return null;
  }
};

/**
 * Fonction pour demander le renvoi d'un email de confirmation
 * @param email - L'adresse email de l'utilisateur
 * @returns Une promesse résolue avec la réponse du serveur
 */
export const resendConfirmationEmail = async (
  email: string
): Promise<EmailConfirmationResponse> => {
  try {
    const response = await fetch(`${API_URL}auth/resend-confirmation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Impossible d'envoyer l'email de confirmation."
      );
    }

    return data;
  } catch (error: any) {
    throw error instanceof Error
      ? error
      : new Error("Une erreur s'est produite. Veuillez réessayer.");
  }
};

/**
 * Fonction pour vérifier un email avec un token
 * @param token - Le token de vérification
 * @returns Une promesse résolue avec la réponse du serveur
 */
export const verifyEmail = async (
  token: string
): Promise<EmailConfirmationResponse> => {
  try {
    const response = await fetch(`${API_URL}auth/verify-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Une erreur est survenue lors de la vérification."
      );
    }

    return data;
  } catch (error: any) {
    throw error instanceof Error
      ? error
      : new Error(
          "Une erreur s'est produite lors de la vérification de votre email."
        );
  }
};

/**
 * Vérifie si le profil de l'utilisateur est complet
 * @returns Boolean indiquant si le profil est complet
 */
export const isProfileComplete = (): boolean => {
  if (typeof window === "undefined") return false;

  try {
    const userStr = localStorage.getItem("user");
    if (!userStr) return false;

    const user = JSON.parse(userStr);
    return !!(user.firstName && user.lastName);
  } catch (error) {
    console.error("Erreur lors de la vérification du profil:", error);
    return false;
  }
};

/**
 * Récupère les données de l'utilisateur actuel depuis le localStorage
 * @returns Les données de l'utilisateur ou null
 */
export const getCurrentUser = () => {
  if (typeof window === "undefined") return null;

  try {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;

    return JSON.parse(userStr);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error);
    return null;
  }
};
