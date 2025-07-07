// services/opportunity.service.ts

const API_URL =
  process.env.NEXT_PUBLIC_API_URL_CLIENT || "http://localhost:3001/api";

export interface Product {
  name: string;
  price: number;
  quantity: number;
}

export interface Opportunity {
  _id: string;
  title: string;
  description?: string;
  value: number;
  status: "lead" | "qualified" | "proposition" | "negotiation" | "won" | "lost";
  probability?: number; // 0-100, défaut 20
  expectedClosingDate?: string;
  company: string; // Référence à l'entreprise propriétaire
  client: string; // ID du client
  contacts?: string[]; // IDs des contacts
  team?: string; // Équipe responsable
  assignedTo?: string; // ID utilisateur responsable
  notes?: string;
  products?: Product[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const headers = {
  "Content-Type": "application/json",
};

/**
 * Récupère toutes les opportunités
 */
export const getAllOpportunities = async (): Promise<Opportunity[]> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(`${API_URL}/opportunities`, {
      method: "GET",
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Erreur lors de la récupération des opportunités"
      );
    }

    return await response.json();
  } catch (error: any) {
    console.error("getAllOpportunities error:", error);
    throw error;
  }
};

/**
 * Récupère une opportunité par son ID
 */
// Dans opportunity.service.ts
export const getOpportunityById = async (id: string): Promise<Opportunity> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(`${API_URL}/opportunities/${id}`, {
      method: "GET",
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Erreur lors de la récupération de l'opportunité"
      );
    }

    // Récupérer les données et les examiner
    const responseData = await response.json();
    console.log("Réponse brute de getOpportunityById:", responseData);

    // Gérer les différentes structures de réponse possibles
    if (responseData && typeof responseData === "object") {
      // Si la réponse est { success: true, data: {...} }
      if ("data" in responseData && responseData.data) {
        console.log(
          "Format de réponse avec structure { success, data }",
          responseData.data
        );
        return responseData.data;
      }
      // Si la réponse est directement l'objet d'opportunité avec un _id
      else if ("_id" in responseData) {
        console.log("Format de réponse: objet direct avec _id", responseData);
        return responseData;
      }
      // Autres structures possibles
      else if ("opportunity" in responseData) {
        console.log(
          "Format de réponse avec structure { opportunity }",
          responseData.opportunity
        );
        return responseData.opportunity;
      }
    }

    // Si la structure n'est pas reconnue mais contient des données, retourner tel quel
    console.warn(
      "Structure de réponse non reconnue dans getOpportunityById:",
      responseData
    );
    return responseData;
  } catch (error: any) {
    console.error(`getOpportunityById error for id ${id}:`, error);
    throw error;
  }
};

/**
 * Récupère les opportunités par entreprise
 */
export const getOpportunitiesByCompany = async (
  companyId: string
): Promise<Opportunity[]> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Non authentifié");
    }

    const url = `${API_URL}/opportunities/company/${companyId}`;
    console.log("URL de l'API pour les opportunités:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Statut de la réponse:", response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erreur de l'API:", errorData);
      throw new Error(
        errorData.message ||
          "Erreur lors de la récupération des opportunités de l'entreprise"
      );
    }

    const responseData = await response.json();
    console.log("Données reçues de l'API:", responseData);

    // Extraire les opportunités du format de réponse
    if (responseData && typeof responseData === "object") {
      if ("data" in responseData && Array.isArray(responseData.data)) {
        return responseData.data;
      }
    }

    // Si la structure n'est pas celle attendue, retourner un tableau vide
    console.warn("Format de réponse inattendu:", responseData);
    return [];
  } catch (error: any) {
    console.error(
      `getOpportunitiesByCompany error for company ${companyId}:`,
      error
    );
    throw error;
  }
};

/**
 * Récupère les opportunités par client
 */
// services/opportunity.service.ts
// Modifiez la fonction pour gérer correctement le type de retour

export const getOpportunitiesByClient = async (
  clientId: string
): Promise<
  Opportunity[] | { success: boolean; count: number; data: Opportunity[] }
> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(
      `${API_URL}/opportunities/client/${clientId}`,
      {
        method: "GET",
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
          "Erreur lors de la récupération des opportunités du client"
      );
    }

    // Récupérer la réponse
    const responseData = await response.json();

    // Retourner les données dans le format approprié
    return responseData;
  } catch (error: any) {
    console.error(
      `getOpportunitiesByClient error for client ${clientId}:`,
      error
    );
    throw error;
  }
};
/**
 * Récupère les opportunités par statut
 */
export const getOpportunitiesByStatus = async (
  status: string
): Promise<Opportunity[]> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(`${API_URL}/opportunities/status/${status}`, {
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
          "Erreur lors de la récupération des opportunités par statut"
      );
    }

    return await response.json();
  } catch (error: any) {
    console.error(
      `getOpportunitiesByStatus error for status ${status}:`,
      error
    );
    throw error;
  }
};

/**
 * Crée une nouvelle opportunité
 */
export const createOpportunity = async (
  opportunityData: Partial<Opportunity>
): Promise<Opportunity> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(`${API_URL}/opportunities`, {
      method: "POST",
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(opportunityData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Erreur lors de la création de l'opportunité"
      );
    }

    return await response.json();
  } catch (error: any) {
    console.error("createOpportunity error:", error);
    throw error;
  }
};

/**
 * Met à jour une opportunité
 */
export const updateOpportunity = async (
  id: string,
  opportunityData: Partial<Opportunity>
): Promise<Opportunity> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(`${API_URL}/opportunities/${id}`, {
      method: "PUT",
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(opportunityData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Erreur lors de la mise à jour de l'opportunité"
      );
    }

    return await response.json();
  } catch (error: any) {
    console.error(`updateOpportunity error for id ${id}:`, error);
    throw error;
  }
};

/**
 * Supprime une opportunité
 */
export const deleteOpportunity = async (id: string): Promise<void> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(`${API_URL}/opportunities/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Erreur lors de la suppression de l'opportunité"
      );
    }
  } catch (error: any) {
    console.error(`deleteOpportunity error for id ${id}:`, error);
    throw error;
  }
};

/**
 * Ajoute un contact à une opportunité
 */
export const addContactToOpportunity = async (
  opportunityId: string,
  contactId: string
): Promise<Opportunity> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(
      `${API_URL}/opportunities/${opportunityId}/contacts/${contactId}`,
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
        errorData.message || "Erreur lors de l'ajout du contact à l'opportunité"
      );
    }

    return await response.json();
  } catch (error: any) {
    console.error(
      `addContactToOpportunity error for opportunity ${opportunityId} and contact ${contactId}:`,
      error
    );
    throw error;
  }
};
