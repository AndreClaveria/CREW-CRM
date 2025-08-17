// services/email.service.ts

const API_URL =
  process.env.NEXT_PUBLIC_API_URL_NOTIFICATION || "http://localhost:3003/api/";

// ============================================
// INTERFACES ET TYPES CORRIGÉS
// ============================================

export interface Email {
  _id: string;
  fromUserId: string;
  fromCompanyId?: string;
  toContactId?: string;
  subject: string;
  body: string;
  htmlBody?: string;
  status: "sent" | "pending" | "failed" | "read" | "unread";
  sentAt: string;
  trackingId: string;
  messageId?: string;
  isRead?: boolean;
  template?: string;
  templateType?: string;
  metadata?: any;

  // Timestamps
  createdAt?: Date;
  updatedAt?: Date;

  // Propriétés supplémentaires de l'API
  toEmail?: string;
  ccEmails?: string[];
  bccEmails?: string[];
  emailProvider?: string;
  isReply?: boolean;
  hasReply?: boolean;
  replyCount?: number;
  lastReplyAt?: string;
  replyToEmailId?: string;
  forwardFromEmailId?: string;
  userInfo?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
}

// ✅ INTERFACE CORRIGÉE selon ce que votre backend attend réellement
export interface EmailCreateInput {
  fromUserId: string;
  fromCompanyId: string;
  toContactId: string;
  subject: string;
  body: string;
  htmlBody?: string;
  ccEmails?: string[];
  bccEmails?: string[];
  replyToEmailId?: string;
  forwardFromEmailId?: string;
  template?: string;
  templateType?: string;
}

// Type pour les filtres de recherche
export interface EmailFilters {
  userId?: string;
  companyId?: string;
  contactId?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

// Type pour les statistiques
export interface EmailStatsFilters {
  userId?: string;
  companyId?: string;
  dateFrom?: string;
  dateTo?: string;
}

// Types de réponse
export interface EmailResponse {
  success: boolean;
  message: string;
  data?: Email;
  error?: string;
}

export interface EmailListResponse {
  success: boolean;
  message: string;
  data: Email[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface EmailStatsResponse {
  success: boolean;
  data: {
    totalEmails: number;
    sentEmails: number;
    failedEmails: number;
    pendingEmails: number;
    successRate: string;
    failureRate: string;
  };
}

export interface ConversationResponse {
  success: boolean;
  data: {
    originalEmailId: string;
    conversationLength: number;
    conversation: Email[];
    summary: {
      totalMessages: number;
      originalEmail: number;
      replies: number;
      lastActivity: string;
    };
  };
}

// ============================================
// UTILITAIRES
// ============================================

const headers = {
  "Content-Type": "application/json",
};

const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;

  try {
    const token = localStorage.getItem("token");
    if (!token || token === "undefined" || token === "null") {
      return null;
    }
    return token;
  } catch (error) {
    console.error("Erreur lors de la récupération du token:", error);
    return null;
  }
};

const buildQueryParams = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, value.toString());
    }
  });

  return searchParams.toString();
};

// ============================================
// FONCTIONS PRINCIPALES
// ============================================

/**
 * Récupère l'historique général des emails
 */
export const getAllEmails = async (
  filters: EmailFilters = {}
): Promise<EmailListResponse> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Non authentifié");
    }

    const queryParams = buildQueryParams(filters);
    const endpoint = queryParams
      ? `email/history?${queryParams}`
      : `email/history`;

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "GET",
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Erreur lors de la récupération des emails"
      );
    }

    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("getAllEmails error:", error);
    throw error;
  }
};

/**
 * Récupère un email par son ID
 */
export const getEmailById = async (id: string): Promise<Email> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(`${API_URL}email/${id}/details`, {
      method: "GET",
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error ||
          errorData.message ||
          "Erreur lors de la récupération de l'email"
      );
    }

    const data = await response.json();

    // Gérer différents formats de réponse possibles
    if (data.success && data.data) {
      return data.data;
    } else if (data._id) {
      return data;
    } else if (data.email) {
      return data.email;
    }

    throw new Error("Format de réponse invalide");
  } catch (error: any) {
    console.error(`getEmailById error for id ${id}:`, error);
    throw new Error(
      error.message || "Erreur lors de la récupération de l'email"
    );
  }
};

/**
 * Récupère les emails par utilisateur
 */
export const getEmailsByUser = async (
  userId: string,
  filters: Omit<EmailFilters, "userId"> = {}
): Promise<EmailListResponse> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Non authentifié");
    }

    const queryParams = buildQueryParams(filters);
    const endpoint = queryParams
      ? `email/user/${userId}/history?${queryParams}`
      : `email/user/${userId}/history`;

    const response = await fetch(`${API_URL}${endpoint}`, {
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
          "Erreur lors de la récupération des emails de l'utilisateur"
      );
    }

    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error(`getEmailsByUser error for user ${userId}:`, error);
    throw error;
  }
};

/**
 * ✅ FONCTION CORRIGÉE - Envoie un nouvel email
 */
export const sendEmail = async (
  emailData: EmailCreateInput
): Promise<Email> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Non authentifié");
    }

    console.log(
      "Données envoyées à l'API (sendEmail):",
      JSON.stringify(emailData, null, 2)
    );

    const response = await fetch(`${API_URL}email/send`, {
      method: "POST",
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erreur réponse serveur:", errorText);

      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        throw new Error(`Erreur serveur: ${response.status} - ${errorText}`);
      }

      throw new Error(
        errorData.message ||
          errorData.error ||
          "Erreur lors de l'envoi de l'email"
      );
    }

    const data = await response.json();
    console.log("Réponse API envoi email:", data);

    // Vérifier si la réponse contient l'email
    if (data && data.data && data.data.email) {
      return data.data.email;
    } else if (data && data.email) {
      return data.email;
    } else if (data && data._id) {
      return data;
    } else if (data && data.success && data.data) {
      return data.data;
    }

    console.warn("Structure de réponse inattendue:", data);
    return data;
  } catch (error: any) {
    console.error("sendEmail error:", error);
    throw error;
  }
};

/**
 * Marque un email comme lu/non lu
 */
export const markEmailAsRead = async (
  emailId: string,
  isRead: boolean = true
): Promise<Email> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(`${API_URL}email/${emailId}/read`, {
      method: "PATCH",
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ isRead }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message ||
          "Erreur lors de la mise à jour du statut de lecture"
      );
    }

    const data = await response.json();
    return data.data || data.email || data;
  } catch (error: any) {
    console.error(`markEmailAsRead error for email ${emailId}:`, error);
    throw error;
  }
};

/**
 * Supprime un email
 */
export const deleteEmail = async (
  id: string,
  permanent: boolean = false
): Promise<{ success: boolean; message?: string }> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Non authentifié");
    }

    const queryParams = permanent ? "?permanent=true" : "";
    const response = await fetch(`${API_URL}email/${id}${queryParams}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Erreur lors de la suppression de l'email"
      );
    }

    const result = await response.json();
    return { success: true, message: result.message };
  } catch (error: any) {
    console.error(`deleteEmail error for id ${id}:`, error);
    throw error;
  }
};

/**
 * Récupère les statistiques d'emails
 */
export const getEmailStats = async (
  filters: EmailStatsFilters = {}
): Promise<EmailStatsResponse["data"]> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Non authentifié");
    }

    const queryParams = buildQueryParams(filters);
    const endpoint = queryParams ? `email/stats?${queryParams}` : "email/stats";

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "GET",
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Erreur lors de la récupération des statistiques"
      );
    }

    const result = await response.json();
    return result.data;
  } catch (error: any) {
    console.error("getEmailStats error:", error);
    throw error;
  }
};

/**
 * Récupère les statistiques d'emails par utilisateur
 */
export const getEmailStatsByUser = async (
  userId: string,
  filters: Omit<EmailStatsFilters, "userId"> = {}
): Promise<EmailStatsResponse["data"]> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Non authentifié");
    }

    const queryParams = buildQueryParams(filters);
    const endpoint = queryParams
      ? `email/user/${userId}/stats?${queryParams}`
      : `email/user/${userId}/stats`;

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "GET",
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Erreur lors de la récupération des statistiques"
      );
    }

    const result = await response.json();
    return result.data;
  } catch (error: any) {
    console.error("getEmailStatsByUser error:", error);
    throw error;
  }
};

/**
 * Récupère la conversation d'un email
 */
export const getEmailConversation = async (
  emailId: string
): Promise<ConversationResponse["data"]> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(`${API_URL}email/${emailId}/conversation`, {
      method: "GET",
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Erreur lors de la récupération de la conversation"
      );
    }

    const result = await response.json();
    return result.data;
  } catch (error: any) {
    console.error(`getEmailConversation error for email ${emailId}:`, error);
    throw error;
  }
};

/**
 * Récupère les réponses d'un email
 */
export const getEmailReplies = async (emailId: string): Promise<Email[]> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(`${API_URL}email/${emailId}/replies`, {
      method: "GET",
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Erreur lors de la récupération des réponses"
      );
    }

    const result = await response.json();
    return result.data || [];
  } catch (error: any) {
    console.error(`getEmailReplies error for email ${emailId}:`, error);
    throw error;
  }
};

/**
 * Récupère un email par tracking ID
 */
export const getEmailByTrackingId = async (
  trackingId: string
): Promise<Email> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(`${API_URL}email/tracking/${trackingId}`, {
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
          "Erreur lors de la récupération de l'email par tracking ID"
      );
    }

    const result = await response.json();
    return result.data || result.email || result;
  } catch (error: any) {
    console.error(
      `getEmailByTrackingId error for tracking ${trackingId}:`,
      error
    );
    throw error;
  }
};

/**
 * Teste la connexion SMTP
 */
export const testEmailConnection = async (): Promise<boolean> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Non authentifié");
    }

    const response = await fetch(`${API_URL}email/test-connection`, {
      method: "GET",
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erreur lors du test de connexion");
    }

    return true;
  } catch (error: any) {
    console.error("testEmailConnection error:", error);
    throw error;
  }
};

// ============================================
// FONCTIONS UTILITAIRES
// ============================================

/**
 * Formate une date pour les filtres
 */
export const formatDateForFilter = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

/**
 * ✅ FONCTION CORRIGÉE - Valide les données d'email avant envoi
 */
export const validateEmailData = (emailData: EmailCreateInput): string[] => {
  const errors: string[] = [];

  if (!emailData.fromUserId)
    errors.push("L'ID utilisateur expéditeur est requis");
  if (!emailData.fromCompanyId)
    errors.push("L'ID de l'entreprise expéditrice est requis");
  if (!emailData.toContactId)
    errors.push("L'ID du contact destinataire est requis");
  if (!emailData.subject) errors.push("Le sujet est requis");
  if (!emailData.body) errors.push("Le corps du message est requis");

  if (emailData.subject && emailData.subject.length > 200) {
    errors.push("Le sujet ne peut pas dépasser 200 caractères");
  }

  if (emailData.body && emailData.body.length > 10000) {
    errors.push("Le corps du message ne peut pas dépasser 10 000 caractères");
  }

  return errors;
};
