// services/contact.service.ts

const API_URL =
  process.env.NEXT_PUBLIC_API_URL_CLIENT || "http://localhost:3001/api";

export interface Contact {
  _id: string;
  firstName: string;
  lastName: string;
  position?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  company: string; // Référence à l'entreprise propriétaire
  client?: string; // ID du client associé
  team?: string; // Équipe responsable
  assignedTo?: string; // ID utilisateur responsable
  isPrimary?: boolean;
  notes?: string;
  lastContactDate?: string;
  opportunities?: string[]; // IDs des opportunités liées
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}
const headers = {
  "Content-Type": "application/json",
};

/**
 * Récupère tous les contacts
 */
export const getAllContacts = async (): Promise<Contact[]> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(`${API_URL}/contacts`, {
      method: "GET",
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Erreur lors de la récupération des contacts"
      );
    }

    const result = await response.json();
    return result.data || [];
  } catch (error: any) {
    console.error("getAllContacts error:", error);
    throw error;
  }
};

/**
 * Récupère un contact par son ID
 */
export const getContactById = async (id: string): Promise<Contact> => {
  try {
    console.log("getContactById called with ID:", id);
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(`${API_URL}/contacts/${id}`, {
      method: "GET",
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("API Response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error response:", errorData);
      throw new Error(
        errorData.message || "Erreur lors de la récupération du contact"
      );
    }

    const data = await response.json();
    console.log("API Response data:", data);

    // Vérifier si la réponse contient les données dans data.data
    if (data.success && data.data) {
      return data.data;
    }

    throw new Error("Format de réponse invalide");
  } catch (error: any) {
    console.error(`getContactById error for id ${id}:`, error);
    throw error;
  }
};

/**
 * Récupère les contacts par client
 */
// Dans contact.service.ts, assurons-nous que getContactsByClient gère correctement tous les formats de réponse
export const getContactsByClient = async (
  clientId: string
): Promise<Contact[] | any> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Non authentifié");
    }

    console.log(`Appel API pour récupérer les contacts du client ${clientId}`);
    const response = await fetch(`${API_URL}/contacts/client/${clientId}`, {
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
          "Erreur lors de la récupération des contacts du client"
      );
    }

    // Récupérer la réponse et l'examiner
    const responseData = await response.json();
    console.log("Réponse brute de l'API pour les contacts:", responseData);

    // Vérifier le format de la réponse et extraire les contacts
    if (
      responseData &&
      typeof responseData === "object" &&
      "data" in responseData &&
      Array.isArray(responseData.data)
    ) {
      console.log("Format de réponse avec structure { success, data }");
      return responseData; // Retourner toute la structure
    } else if (Array.isArray(responseData)) {
      console.log("Format de réponse: tableau direct");
      return responseData; // Retourner directement le tableau
    } else {
      console.warn("Format de réponse inattendu:", responseData);
      return []; // Retourner un tableau vide par défaut
    }
  } catch (error: any) {
    console.error(`getContactsByClient error for client ${clientId}:`, error);
    throw error;
  }
};
/**
 * Récupère les contacts par entreprise
 */
export const getContactsByCompany = async (
  companyId: string
): Promise<Contact[]> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(`${API_URL}/contacts/company/${companyId}`, {
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
          "Erreur lors de la récupération des contacts de l'entreprise"
      );
    }

    const result = await response.json();
    return result.data || [];
  } catch (error: any) {
    console.error(
      `getContactsByCompany error for company ${companyId}:`,
      error
    );
    throw error;
  }
};

/**
 * Crée un nouveau contact
 */
export const createContact = async (
  contactData: Partial<Contact>
): Promise<Contact> => {
  try {
    console.log("Données du contact à créer:", contactData);
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(`${API_URL}/contacts`, {
      method: "POST",
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(contactData),
    });

    console.log("Statut de la réponse:", response.status);
    const responseData = await response.json();
    console.log("Réponse complète de l'API:", responseData);

    if (!response.ok) {
      // Si l'API renvoie un message d'erreur détaillé
      if (responseData.error) {
        throw new Error(responseData.error);
      }
      // Si l'API renvoie un message dans data
      if (responseData.data && responseData.data.message) {
        throw new Error(responseData.data.message);
      }
      // Si l'API renvoie un message direct
      if (responseData.message) {
        throw new Error(responseData.message);
      }
      // Message d'erreur par défaut avec le statut
      throw new Error(
        `Erreur lors de la création du contact (${response.status})`
      );
    }

    // Vérifier si la réponse contient les données dans data.data
    if (responseData.success && responseData.data) {
      return responseData.data;
    }

    // Si la réponse est directement le contact
    if (responseData._id) {
      return responseData;
    }

    console.error("Format de réponse inattendu:", responseData);
    throw new Error("Format de réponse invalide");
  } catch (error: any) {
    console.error("Erreur détaillée lors de la création du contact:", error);
    if (error.message) {
      throw new Error(error.message);
    }
    throw new Error("Erreur lors de la création du contact");
  }
};

/**
 * Met à jour un contact
 */
export const updateContact = async (
  id: string,
  contactData: Partial<Contact>
): Promise<Contact> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(`${API_URL}/contacts/${id}`, {
      method: "PUT",
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(contactData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Erreur lors de la mise à jour du contact"
      );
    }

    return await response.json();
  } catch (error: any) {
    console.error(`updateContact error for id ${id}:`, error);
    throw error;
  }
};

/**
 * Supprime un contact
 */
export const deleteContact = async (id: string): Promise<void> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(`${API_URL}/contacts/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Erreur lors de la suppression du contact"
      );
    }
  } catch (error: any) {
    console.error(`deleteContact error for id ${id}:`, error);
    throw error;
  }
};
