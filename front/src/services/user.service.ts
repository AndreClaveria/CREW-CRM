// services/user.service.ts

import { getToken } from "./auth.service";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api";

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  active: boolean;
  role: string;
  provider?: string;
  phoneNumber?: string;
  lastLogin?: string;
  companyId?: string;
  teams?: string[]; // IDs des équipes auxquelles l'utilisateur appartient
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  active?: boolean;
  phoneNumber?: string;
  password?: string;
}

export interface UserCreateInput {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  active: boolean;
  provider?: string;
  phoneNumber?: string;
  lastLogin?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Récupère l'utilisateur stocké dans le localStorage
 */
export const getStoredUser = (): User | null => {
  if (typeof window === "undefined") return null;

  try {
    const userStr = localStorage.getItem("user");
    if (!userStr || userStr === "undefined" || userStr === "null") {
      console.warn(
        "Données utilisateur non valides ou non trouvées dans localStorage"
      );
      return null;
    }

    const parsedUser = JSON.parse(userStr);

    // Vérification basique de la structure de l'objet utilisateur
    if (!parsedUser || typeof parsedUser !== "object" || !parsedUser._id) {
      console.warn("Structure de données utilisateur invalide:", parsedUser);
      return null;
    }

    return parsedUser;
  } catch (e) {
    console.error("Erreur lors de la récupération des données utilisateur:", e);
    return null;
  }
};

/**
 * Récupère un utilisateur par son ID
 */
export const getUserById = async (userId: string): Promise<User> => {
  const token = getToken();

  if (!token) {
    throw new Error("Vous devez être connecté pour effectuer cette action");
  }

  try {
    const response = await fetch(`${API_URL}users/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Erreur lors de la récupération de l'utilisateur"
      );
    }

    return data;
  } catch (error: any) {
    throw error instanceof Error
      ? error
      : new Error("Erreur lors de la récupération de l'utilisateur");
  }
};

export const verifyPassword = async (
  email: string,
  password: string
): Promise<boolean> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}auth/verify-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.valid === true;
  } catch (error) {
    console.error("Erreur lors de la vérification du mot de passe:", error);
    return false;
  }
};

/**
 * Met à jour les informations d'un utilisateur
 */
export const updateUser = async (
  userId: string,
  userData: UpdateUserRequest
): Promise<User> => {
  // Vérifier et récupérer le token
  const token = getToken();

  if (!token) {
    console.error(
      "Token non disponible lors de la tentative de mise à jour de l'utilisateur"
    );

    // Tentative de récupérer le token directement du localStorage (solution de secours)
    let backupToken = null;
    if (typeof window !== "undefined") {
      backupToken = localStorage.getItem("token");
    }

    if (!backupToken) {
      throw new Error("Vous devez être connecté pour effectuer cette action");
    }

    console.log("Token récupéré directement du localStorage");

    // Utiliser le token de secours
    try {
      const response = await fetch(`${API_URL}users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${backupToken}`,
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Erreur lors de la mise à jour de l'utilisateur"
        );
      }

      // Mettre à jour l'utilisateur dans le localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(data));
      }

      return data;
    } catch (error: any) {
      throw error instanceof Error
        ? error
        : new Error("Erreur lors de la mise à jour de l'utilisateur");
    }
  }

  // Chemin normal avec token valide
  try {
    const response = await fetch(`${API_URL}users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Erreur lors de la mise à jour de l'utilisateur"
      );
    }

    // Mettre à jour l'utilisateur dans le localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(data));
    }

    return data;
  } catch (error: any) {
    throw error instanceof Error
      ? error
      : new Error("Erreur lors de la mise à jour de l'utilisateur");
  }
};

/**
 * Change le mot de passe d'un utilisateur
 */
export const changePassword = async (
  userId: string,
  passwordData: ChangePasswordRequest
): Promise<void> => {
  const token = getToken();

  if (!token) {
    throw new Error("Vous devez être connecté pour effectuer cette action");
  }

  try {
    const response = await fetch(`${API_URL}users/${userId}/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(passwordData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Erreur lors du changement de mot de passe"
      );
    }
  } catch (error: any) {
    throw error instanceof Error
      ? error
      : new Error("Erreur lors du changement de mot de passe");
  }
};

/**
 * Récupère tous les utilisateurs (réservé aux managers et admins)
 */
export const getAllUsers = async (): Promise<User[]> => {
  const token = getToken();

  if (!token) {
    throw new Error("Vous devez être connecté pour effectuer cette action");
  }

  try {
    const response = await fetch(`${API_URL}users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Erreur lors de la récupération des utilisateurs"
      );
    }

    return data;
  } catch (error: any) {
    throw error instanceof Error
      ? error
      : new Error("Erreur lors de la récupération des utilisateurs");
  }
};

/**
 * Supprime un utilisateur (réservé aux admins)
 */
export const deleteUser = async (userId: string): Promise<void> => {
  const token = getToken();

  if (!token) {
    throw new Error("Vous devez être connecté pour effectuer cette action");
  }

  try {
    const response = await fetch(`${API_URL}users/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Erreur lors de la suppression de l'utilisateur"
      );
    }
  } catch (error: any) {
    throw error instanceof Error
      ? error
      : new Error("Erreur lors de la suppression de l'utilisateur");
  }
};

/**
 * Crée un nouvel utilisateur (réservé aux admins)
 */
export const createUser = async (
  userData: UpdateUserRequest
): Promise<User> => {
  const token = getToken();

  if (!token) {
    throw new Error("Vous devez être connecté pour effectuer cette action");
  }

  try {
    const response = await fetch(`${API_URL}users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Erreur lors de la création de l'utilisateur"
      );
    }

    return data;
  } catch (error: any) {
    throw error instanceof Error
      ? error
      : new Error("Erreur lors de la création de l'utilisateur");
  }
};
