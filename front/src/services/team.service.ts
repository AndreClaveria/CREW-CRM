const API_URL =
  process.env.NEXT_PUBLIC_API_URL_BDD || "http://localhost:3002/api/";
import { User } from "./user.service";

export interface Team {
  _id: string;
  name: string;
  description?: string;
  company: string;
  members: string[] | User[];
  leader?: string | User;
  createdAt?: string;
  updatedAt?: string;
  isActive: boolean;
}

const headers = {
  "Content-Type": "application/json",
};

/**
 * Récupère toutes les équipes
 */
export const getAllTeams = async (): Promise<Team[]> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(`${API_URL}teams`, {
      method: "GET",
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Erreur lors de la récupération des équipes"
      );
    }

    return await response.json();
  } catch (error: any) {
    console.error("getAllTeams error:", error);
    throw error;
  }
};

/**
 * Récupère une équipe par son ID
 */
export const getTeamById = async (id: string): Promise<Team> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Non authentifié");
    }

    // Notez le slash ajouté ici entre API_URL et "teams/"
    const response = await fetch(`${API_URL}teams/${id}`, {
      method: "GET",
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Erreur lors de la récupération de l'équipe"
      );
    }

    return await response.json();
  } catch (error: any) {
    console.error(`getTeamById error for id ${id}:`, error);
    throw error;
  }
};

/**
 * Récupère les équipes d'une entreprise
 */
export const getTeamsByCompany = async (companyId: string): Promise<Team[]> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(`${API_URL}teams/company/${companyId}`, {
      method: "GET",
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message ||
          "Erreur lors de la récupération des équipes de l'entreprise"
      );
    }

    return await response.json();
  } catch (error: any) {
    console.error(`getTeamsByCompany error for company ${companyId}:`, error);
    throw error;
  }
};

/**
 * Crée une nouvelle équipe
 */
export const createTeam = async (teamData: Partial<Team>): Promise<Team> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(`${API_URL}teams`, {
      method: "POST",
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(teamData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Erreur lors de la création de l'équipe"
      );
    }

    return await response.json();
  } catch (error: any) {
    console.error("createTeam error:", error);
    throw error;
  }
};

/**
 * Met à jour une équipe
 */
export const updateTeam = async (
  id: string,
  teamData: Partial<Team>
): Promise<Team> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(`${API_URL}teams/${id}`, {
      method: "PUT",
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(teamData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Erreur lors de la mise à jour de l'équipe"
      );
    }

    return await response.json();
  } catch (error: any) {
    console.error(`updateTeam error for id ${id}:`, error);
    throw error;
  }
};

/**
 * Supprime une équipe
 */
export const deleteTeam = async (id: string): Promise<void> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(`${API_URL}teams/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Erreur lors de la suppression de l'équipe"
      );
    }
  } catch (error: any) {
    console.error(`deleteTeam error for id ${id}:`, error);
    throw error;
  }
};

/**
 * Ajoute un membre à une équipe
 */
export const addMemberToTeam = async (
  teamId: string,
  userId: string
): Promise<Team> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(
      `${API_URL}teams/${teamId}/members/${userId}`,
      {
        method: "POST",
        headers: {
          ...headers,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Erreur lors de l'ajout du membre à l'équipe"
      );
    }

    return await response.json();
  } catch (error: any) {
    console.error(
      `addMemberToTeam error for team ${teamId} and user ${userId}:`,
      error
    );
    throw error;
  }
};

/**
 * Retire un membre d'une équipe
 */
export const removeMemberFromTeam = async (
  teamId: string,
  userId: string
): Promise<Team> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(
      `${API_URL}teams/${teamId}/members/${userId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Erreur lors du retrait du membre de l'équipe"
      );
    }

    return await response.json();
  } catch (error: any) {
    console.error(
      `removeMemberFromTeam error for team ${teamId} and user ${userId}:`,
      error
    );
    throw error;
  }
};

/**
 * Définit le leader d'une équipe
 */
export const setTeamLeader = async (
  teamId: string,
  userId: string
): Promise<Team> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(
      `${API_URL}teams/${teamId}/leader/${userId}`,
      {
        method: "PUT",
        headers: {
          ...headers,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message ||
          "Erreur lors de la définition du leader de l'équipe"
      );
    }

    return await response.json();
  } catch (error: any) {
    console.error(
      `setTeamLeader error for team ${teamId} and user ${userId}:`,
      error
    );
    throw error;
  }
};

/**
 * Vérifie si un utilisateur est membre d'une équipe
 */
export const isUserTeamMember = async (
  teamId: string,
  userId: string
): Promise<boolean> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(
      `${API_URL}teams/${teamId}/members/${userId}/check`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message ||
          "Erreur lors de la vérification de l'appartenance à l'équipe"
      );
    }

    const result = await response.json();
    return result.isMember;
  } catch (error: any) {
    console.error(
      `isUserTeamMember error for team ${teamId} and user ${userId}:`,
      error
    );
    throw error;
  }
};
