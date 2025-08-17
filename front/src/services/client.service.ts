// services/client.service.ts

const API_URL =
  process.env.NEXT_PUBLIC_API_URL_CLIENT || "http://localhost:3001/api/";

export interface Client {
  _id: string;
  name: string;
  description?: string;
  sector?: string;
  address?: {
    street?: string;
    city?: string;
    zipCode?: string;
    country?: string;
  };
  phone?: string;
  email?: string;
  logo?: string;
  company: string; // ID de l'entreprise propriétaire
  team?: string; // ID de l'équipe responsable (optionnel)
  assignedTo?: string; // ID utilisateur responsable (optionnel)
  goodForCustomer?: number; // Indicateur "bonne poire" (0-100)
  contacts?: string[]; // IDs des contacts - gérés par le service contact
  opportunities?: string[]; // IDs des opportunités - gérées par le service opportunité
  isActive?: boolean;

  // Données commerciales
  estimatedBudget?: number; // Budget estimé en €
  companySize?: "1-10" | "11-50" | "51-200" | "200+"; // Taille entreprise
  hasWorkedWithUs?: boolean; // Déjà client ?
  knowsUs?: boolean; // Nous connaît ?

  // Pipeline de vente
  stage?:
    | "prospect"
    | "contacted"
    | "interested"
    | "proposal"
    | "negotiation"
    | "closed_won"
    | "closed_lost";
  lastContactDate?: Date; // Dernier contact avec le client
  urgency?: "low" | "medium" | "high"; // Urgence du besoin

  // Interactions (limitées à 5 max)
  interactions?: {
    date: Date;
    type:
      | "call"
      | "email"
      | "meeting"
      | "demo"
      | "proposal"
      | "follow_up"
      | "other";
    outcome: "positive" | "neutral" | "negative" | "no_response";
    notes?: string; // Limite des notes (200 caractères max)
  }[];

  // Résultats IA (calculés automatiquement)
  aiScore?: number; // Score IA de 0 à 100
  aiRecommendation?: string; // Recommandation d'action
  aiLastAnalysis?: Date; // Date de la dernière analyse IA

  // Timestamps
  createdAt?: Date;
  updatedAt?: Date;
}

// Type pour la création d'un nouveau Client (sans _id)
export interface ClientCreateInput
  extends Omit<Client, "_id" | "createdAt" | "updatedAt"> {
  name: string;
  company: string;
  isActive?: boolean;
}

// Type avec _id optionnel pour les inputs
export type ClientInput = Omit<Client, "_id"> & { _id?: string };
const headers = {
  "Content-Type": "application/json",
};

/**
 * Récupère tous les clients
 */
export const getAllClients = async (): Promise<Client[]> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(`${API_URL}clients`, {
      method: "GET",
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Erreur lors de la récupération des clients"
      );
    }

    const result = await response.json();
    return result.data || [];
  } catch (error: any) {
    console.error("getAllClients error:", error);
    throw error;
  }
};

/**
 * Récupère un client par son ID
 */
export const getClientById = async (id: string): Promise<Client> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(`${API_URL}clients/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error ||
          errorData.message ||
          "Erreur lors de la récupération du client"
      );
    }

    const data = await response.json();

    // Gérer différents formats de réponse possibles
    if (data.success && data.data) {
      return data.data;
    } else if (data._id) {
      // Si la réponse est directement l'objet client
      return data;
    } else if (data.client) {
      // Si la réponse contient un champ client
      return data.client;
    }

    throw new Error("Format de réponse invalide");
  } catch (error: any) {
    console.error(`getClientById error for id ${id}:`, error);
    throw new Error(
      error.message || "Erreur lors de la récupération du client"
    );
  }
};

/**
 * Récupère les clients par entreprise
 */
export const getClientsByCompany = async (
  companyId: string
): Promise<Client[]> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(`${API_URL}clients/company/${companyId}`, {
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
          "Erreur lors de la récupération des clients de l'entreprise"
      );
    }

    const result = await response.json();
    return result.data || [];
  } catch (error: any) {
    console.error(`getClientsByCompany error for company ${companyId}:`, error);
    throw error;
  }
};

/**
 * Récupère les clients par équipe
 */
export const getClientsByTeam = async (teamId: string): Promise<Client[]> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(`${API_URL}clients/team/${teamId}`, {
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
          "Erreur lors de la récupération des clients de l'équipe"
      );
    }

    return await response.json();
  } catch (error: any) {
    console.error(`getClientsByTeam error for team ${teamId}:`, error);
    throw error;
  }
};

/**
 * Crée un nouveau client
 */
export const createClient = async (
  clientData: ClientCreateInput
): Promise<Client> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Non authentifié");
    }

    // Ajouter un log explicite pour voir les données envoyées
    console.log(
      "Données envoyées à l'API (createClient):",
      JSON.stringify(clientData, null, 2)
    );

    const response = await fetch(`${API_URL}/clients`, {
      method: "POST",
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(clientData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Erreur lors de la création du client"
      );
    }

    // Analyser la réponse et vérifier sa structure
    const data = await response.json();
    console.log("Réponse API création client:", data);

    // Vérifier si la réponse contient directement le client ou s'il est dans une propriété
    if (data && data.data && data.data.client) {
      return data.data.client;
    } else if (data && data.client) {
      return data.client;
    } else if (data && data._id) {
      // Si c'est directement l'objet client
      return data;
    }

    // Si la structure est différente
    console.warn("Structure de réponse inattendue:", data);
    return data; // Retourner tel quel, mais cela pourrait causer des problèmes plus tard
  } catch (error: any) {
    console.error("createClient error:", error);
    throw error;
  }
};
/**
 * Met à jour un client
 */
// services/client.service.ts (partie updateClient améliorée)

/**
 * Met à jour un client
 */
export const updateClient = async (
  id: string,
  clientData: Partial<Client>
): Promise<Client> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Non authentifié");
    }

    console.log(`🔄 Mise à jour du client ${id} avec:`, clientData);

    const response = await fetch(`${API_URL}clients/${id}`, {
      method: "PUT",
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(clientData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Erreur lors de la mise à jour du client"
      );
    }

    const data = await response.json();
    console.log("📤 Réponse API mise à jour:", data);

    // ✅ Gérer différents formats de réponse possibles
    if (data.success && data.data) {
      return data.data;
    } else if (data.client) {
      return data.client;
    } else if (data._id) {
      // Si c'est directement l'objet client
      return data;
    } else if (data.updatedClient) {
      return data.updatedClient;
    }

    // Si aucun format reconnu, retourner tel quel
    console.warn("⚠️ Format de réponse inattendu:", data);
    return data;
  } catch (error: any) {
    console.error(`❌ updateClient error for id ${id}:`, error);
    throw error;
  }
};

/**
 * Supprime un client
 */
export const deleteClient = async (id: string): Promise<void> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(`${API_URL}clients/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Erreur lors de la suppression du client"
      );
    }
  } catch (error: any) {
    console.error(`deleteClient error for id ${id}:`, error);
    throw error;
  }
};
