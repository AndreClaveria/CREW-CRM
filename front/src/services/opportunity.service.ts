// services/opportunity.service.ts

const API_URL =
  process.env.NEXT_PUBLIC_API_URL_CLIENT ||
  process.env.NEXT_PUBLIC_API_URL_BDD ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:3001/api/";

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

function ensureJsonResponse(response: Response): Promise<any> {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return response.text().then((txt) => {
      throw new Error(
        `Réponse non-JSON de l'API (${response.status}): ${txt.substring(
          0,
          200
        )}`
      );
    });
  }
  return response.json();
}

/**
 * Récupère toutes les opportunités
 */
export const getAllOpportunities = async (): Promise<Opportunity[]> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(`${API_URL}opportunities`, {
      method: "GET",
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(
        errBody || "Erreur lors de la récupération des opportunités"
      );
    }

    const data = await ensureJsonResponse(response);
    return data.data || data || [];
  } catch (error: any) {
    console.error("getAllOpportunities error", error);
    throw error;
  }
};

/**
 * Récupère une opportunité par son ID
 */
export const getOpportunityById = async (id: string): Promise<Opportunity> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(`${API_URL}opportunities/${id}`, {
      method: "GET",
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(
        errBody || "Erreur lors de la récupération de l'opportunité"
      );
    }

    const responseData = await ensureJsonResponse(response);
    if (responseData && typeof responseData === "object") {
      if ("data" in responseData && responseData.data) return responseData.data;
      if ("_id" in responseData) return responseData;
      if ("opportunity" in responseData) return responseData.opportunity;
    }
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

    const url = `${API_URL}opportunities/company/${companyId}`;
    const response = await fetch(url, {
      method: "GET",
      headers: { ...headers, Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(
        errBody ||
          "Erreur lors de la récupération des opportunités de l'entreprise"
      );
    }

    const responseData = await ensureJsonResponse(response);
    if (
      responseData &&
      typeof responseData === "object" &&
      "data" in responseData &&
      Array.isArray(responseData.data)
    ) {
      return responseData.data;
    }
    return Array.isArray(responseData) ? responseData : [];
  } catch (error: any) {
    console.error(
      `getOpportunitiesByCompany error for company ${companyId}:`,
      error
    );
    throw error;
  }
};

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

    const response = await fetch(`${API_URL}opportunities/client/${clientId}`, {
      method: "GET",
      headers: { ...headers, Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(
        errBody || "Erreur lors de la récupération des opportunités du client"
      );
    }

    return await ensureJsonResponse(response);
  } catch (error: any) {
    console.error(
      `getOpportunitiesByClient error for client ${clientId}:`,
      error
    );
    throw error;
  }
};

export const getOpportunitiesByStatus = async (
  status: string
): Promise<Opportunity[]> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Non authentifié");

    const response = await fetch(`${API_URL}opportunities/status/${status}`, {
      method: "GET",
      headers: { ...headers, Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(
        errBody || "Erreur lors de la récupération des opportunités par statut"
      );
    }

    const data = await ensureJsonResponse(response);
    return data.data || data || [];
  } catch (error: any) {
    console.error(
      `getOpportunitiesByStatus error for status ${status}:`,
      error
    );
    throw error;
  }
};

export const createOpportunity = async (
  opportunityData: Partial<Opportunity>
): Promise<Opportunity> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Non authentifié");

    const response = await fetch(`${API_URL}opportunities`, {
      method: "POST",
      headers: { ...headers, Authorization: `Bearer ${token}` },
      body: JSON.stringify(opportunityData),
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(errBody || "Erreur lors de la création de l'opportunité");
    }

    return await ensureJsonResponse(response);
  } catch (error: any) {
    console.error("createOpportunity error:", error);
    throw error;
  }
};

export const updateOpportunity = async (
  id: string,
  opportunityData: Partial<Opportunity>
): Promise<Opportunity> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Non authentifié");

    const response = await fetch(`${API_URL}opportunities/${id}`, {
      method: "PUT",
      headers: { ...headers, Authorization: `Bearer ${token}` },
      body: JSON.stringify(opportunityData),
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(
        errBody || "Erreur lors de la mise à jour de l'opportunité"
      );
    }

    return await ensureJsonResponse(response);
  } catch (error: any) {
    console.error(`updateOpportunity error for id ${id}:`, error);
    throw error;
  }
};

export const deleteOpportunity = async (id: string): Promise<void> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Non authentifié");

    const response = await fetch(`${API_URL}opportunities/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(
        errBody || "Erreur lors de la suppression de l'opportunité"
      );
    }
  } catch (error: any) {
    console.error(`deleteOpportunity error for id ${id}:`, error);
    throw error;
  }
};

export const addContactToOpportunity = async (
  opportunityId: string,
  contactId: string
): Promise<Opportunity> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Non authentifié");

    const response = await fetch(
      `${API_URL}opportunities/${opportunityId}/contacts/${contactId}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(
        errBody || "Erreur lors de l'ajout du contact à l'opportunité"
      );
    }

    return await ensureJsonResponse(response);
  } catch (error: any) {
    console.error(
      `addContactToOpportunity error for opportunity ${opportunityId} and contact ${contactId}:`,
      error
    );
    throw error;
  }
};
