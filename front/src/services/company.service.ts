// services/company.service.ts

const API_URL =
  process.env.NEXT_PUBLIC_API_URL_BDD || "http://localhost:3002/api";

export interface Company {
  _id: string;
  name: string;
  description?: string;
  address?: {
    street?: string;
    city?: string;
    zipCode?: string;
    country?: string;
  };
  phone?: string;
  email?: string;
  website?: string;
  industry?: string;
  logo?: string;
  owner: string;
  teams?: string[];
  createdAt?: string;
  updatedAt?: string;
  isActive: boolean;
}

const headers = {
  "Content-Type": "application/json",
};

/**
 * Récupère toutes les entreprises
 */
export const getAllCompanies = async (): Promise<Company[]> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(`${API_URL}companies`, {
      method: "GET",
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Erreur lors de la récupération des entreprises"
      );
    }

    return await response.json();
  } catch (error: any) {
    console.error("getAllCompanies error:", error);
    throw error;
  }
};

/**
 * Récupère une entreprise par son ID
 */
export const getCompanyById = async (id: string): Promise<Company> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(`${API_URL}companies/${id}`, {
      method: "GET",
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Erreur lors de la récupération de l'entreprise"
      );
    }

    return await response.json();
  } catch (error: any) {
    console.error(`getCompanyById error for id ${id}:`, error);
    throw error;
  }
};

/**
 * Récupère les entreprises par propriétaire
 */
export const getCompaniesByOwner = async (
  ownerId: string
): Promise<Company[]> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(`${API_URL}companies/owner/${ownerId}`, {
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
          "Erreur lors de la récupération des entreprises du propriétaire"
      );
    }

    return await response.json();
  } catch (error: any) {
    console.error(`getCompaniesByOwner error for owner ${ownerId}:`, error);
    throw error;
  }
};

/**
 * Crée une nouvelle entreprise
 */
export const createCompany = async (
  companyData: Partial<Company>
): Promise<Company> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(`${API_URL}companies`, {
      method: "POST",
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(companyData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Erreur lors de la création de l'entreprise"
      );
    }

    return await response.json();
  } catch (error: any) {
    console.error("createCompany error:", error);
    throw error;
  }
};

/**
 * Met à jour une entreprise
 */
export const updateCompany = async (
  id: string,
  companyData: Partial<Company>
): Promise<Company> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(`${API_URL}companies/${id}`, {
      method: "PUT",
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(companyData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Erreur lors de la mise à jour de l'entreprise"
      );
    }

    return await response.json();
  } catch (error: any) {
    console.error(`updateCompany error for id ${id}:`, error);
    throw error;
  }
};

/**
 * Supprime une entreprise
 */
export const deleteCompany = async (id: string): Promise<void> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(`${API_URL}companies/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Erreur lors de la suppression de l'entreprise"
      );
    }
  } catch (error: any) {
    console.error(`deleteCompany error for id ${id}:`, error);
    throw error;
  }
};

/**
 * Ajoute une équipe à une entreprise
 */
export const addTeamToCompany = async (
  companyId: string,
  teamId: string
): Promise<Company> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(
      `${API_URL}companies/${companyId}/teams/${teamId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Erreur lors de l'ajout de l'équipe à l'entreprise"
      );
    }

    return await response.json();
  } catch (error: any) {
    console.error(
      `addTeamToCompany error for company ${companyId} and team ${teamId}:`,
      error
    );
    throw error;
  }
};

/**
 * Retire une équipe d'une entreprise
 */
export const removeTeamFromCompany = async (
  companyId: string,
  teamId: string
): Promise<Company> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(
      `${API_URL}companies/${companyId}/teams/${teamId}`,
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
        errorData.message ||
          "Erreur lors du retrait de l'équipe de l'entreprise"
      );
    }

    return await response.json();
  } catch (error: any) {
    console.error(
      `removeTeamFromCompany error for company ${companyId} and team ${teamId}:`,
      error
    );
    throw error;
  }
};
