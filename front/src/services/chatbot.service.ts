// src/services/chatbot.service.ts

// Types pour le chatbot frontend
export interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  metadata?: {
    navigationType?: "route" | "feature" | "action";
    suggestedRoute?: string;
    relatedPages?: string[];
  };
}

export interface NavigationContext {
  currentRoute?: string;
  userRole?: string;
  availableFeatures?: string[];
  recentActions?: string[];
}

export interface ChatbotResponse {
  message: string;
  suggestedActions?: {
    label: string;
    route: string;
    description: string;
  }[];
  navigationHelp?: {
    currentLocation: string;
    howToGet: string;
    steps: string[];
  };
  relatedFeatures?: string[];
}

export interface ChatApiResponse {
  sessionId: string;
  response: ChatbotResponse;
  conversation: {
    lastMessage: ChatMessage;
    messageCount: number;
    context: NavigationContext;
  };
  metadata: {
    timestamp: Date;
    processingTime: number;
  };
}

export interface SearchResponse {
  searchTerm: string;
  results: ChatbotResponse;
  timestamp: Date;
}

export interface ContextualHelpResponse {
  route: string;
  help: ChatbotResponse;
  timestamp: Date;
}

// Configuration API
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL_IA || "http://localhost:3005/api/";
const CHATBOT_ENDPOINTS = {
  chat: `${API_BASE_URL}chatbot/chat`,
  help: `${API_BASE_URL}chatbot/help`,
  search: `${API_BASE_URL}chatbot/search`,
  history: `${API_BASE_URL}chatbot/history`,
  reset: `${API_BASE_URL}chatbot/reset`,
  structure: `${API_BASE_URL}chatbot/structure`,
  stats: `${API_BASE_URL}chatbot/stats`,
  health: `${API_BASE_URL}chatbot/health`,
};

class ChatbotService {
  private sessionId: string | null = null;

  constructor() {
    // Récupérer ou créer un session ID
    if (typeof window !== "undefined") {
      this.sessionId =
        localStorage.getItem("chatbot_session_id") || this.generateSessionId();
      localStorage.setItem("chatbot_session_id", this.sessionId);
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Gestion des erreurs HTTP
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `HTTP ${response.status}: ${response.statusText}`
      );
    }
    return response.json();
  }

  // Envoyer un message au chatbot
  async sendMessage(
    message: string,
    context?: NavigationContext,
    conversationHistory?: ChatMessage[]
  ): Promise<ChatApiResponse> {
    try {
      const response = await fetch(CHATBOT_ENDPOINTS.chat, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message.trim(),
          sessionId: this.sessionId,
          context: context || {},
          conversationHistory: conversationHistory || [],
        }),
      });

      const data = await this.handleResponse<ChatApiResponse>(response);

      // Mettre à jour le session ID si changé
      if (data.sessionId && data.sessionId !== this.sessionId) {
        this.sessionId = data.sessionId;
        if (typeof window !== "undefined") {
          localStorage.setItem("chatbot_session_id", this.sessionId);
        }
      }

      return data;
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      throw error;
    }
  }

  // Obtenir l'aide contextuelle pour la page actuelle
  async getContextualHelp(
    currentRoute: string,
    userRole?: string
  ): Promise<ContextualHelpResponse> {
    try {
      const response = await fetch(CHATBOT_ENDPOINTS.help, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentRoute,
          userRole,
          sessionId: this.sessionId,
        }),
      });

      return this.handleResponse<ContextualHelpResponse>(response);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération de l'aide contextuelle:",
        error
      );
      throw error;
    }
  }

  // Rechercher des fonctionnalités
  async searchFeatures(searchTerm: string): Promise<SearchResponse> {
    try {
      const response = await fetch(CHATBOT_ENDPOINTS.search, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          searchTerm: searchTerm.trim(),
          sessionId: this.sessionId,
        }),
      });

      return this.handleResponse<SearchResponse>(response);
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
      throw error;
    }
  }

  // Obtenir l'historique de conversation
  async getConversationHistory(): Promise<{
    sessionId: string;
    messages: ChatMessage[];
    context: NavigationContext;
    lastActivity: Date;
    messageCount: number;
  }> {
    if (!this.sessionId) {
      throw new Error("Aucune session active");
    }

    try {
      const response = await fetch(
        `${CHATBOT_ENDPOINTS.history}/${this.sessionId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return this.handleResponse(response);
    } catch (error) {
      console.error("Erreur lors de la récupération de l'historique:", error);
      throw error;
    }
  }

  // Réinitialiser la session de conversation
  async resetSession(): Promise<void> {
    if (!this.sessionId) {
      return;
    }

    try {
      const response = await fetch(
        `${CHATBOT_ENDPOINTS.reset}/${this.sessionId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      await this.handleResponse(response);

      // Créer une nouvelle session
      this.sessionId = this.generateSessionId();
      if (typeof window !== "undefined") {
        localStorage.setItem("chatbot_session_id", this.sessionId);
      }
    } catch (error) {
      console.error("Erreur lors de la réinitialisation:", error);
      throw error;
    }
  }

  // Obtenir la structure CRM disponible
  async getCRMStructure(): Promise<any> {
    try {
      const response = await fetch(CHATBOT_ENDPOINTS.structure, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error("Erreur lors de la récupération de la structure:", error);
      throw error;
    }
  }

  // Obtenir les statistiques du chatbot
  async getStats(): Promise<{
    totalSessions: number;
    activeSessions: number;
    totalMessages: number;
    averageMessagesPerSession: number;
    timestamp: Date;
  }> {
    try {
      const response = await fetch(CHATBOT_ENDPOINTS.stats, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error("Erreur lors de la récupération des stats:", error);
      throw error;
    }
  }

  // Vérifier l'état de santé du service
  async healthCheck(): Promise<any> {
    try {
      const response = await fetch(CHATBOT_ENDPOINTS.health, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error("Erreur lors du health check:", error);
      throw error;
    }
  }

  // Utilitaires
  getCurrentSessionId(): string | null {
    return this.sessionId;
  }

  // Suggestions rapides basées sur la route actuelle
  getQuickSuggestions(currentRoute: string): string[] {
    const suggestions: Record<string, string[]> = {
      "/dashboard": [
        "Comment ajouter un client ?",
        "Où voir mes opportunités ?",
        "Accéder à la messagerie",
        "Voir les métriques",
      ],
      "/dashboard/pipeline": [
        "Ajouter une opportunité",
        "Voir mes clients",
        "Gérer les contacts",
        "Statut du pipeline",
      ],
      "/dashboard/clients": [
        "Ajouter un nouveau client",
        "Modifier un client",
        "Historique client",
        "Voir les opportunités",
      ],
      "/dashboard/opportunities": [
        "Créer une opportunité",
        "Voir le pipeline",
        "Suivi des deals",
        "Prévisions de vente",
      ],
      "/dashboard/contacts": [
        "Ajouter un contact",
        "Gérer les groupes",
        "Voir l'annuaire",
        "Envoyer un message",
      ],
      "/dashboard/mail": [
        "Composer un email",
        "Voir les templates",
        "Campagnes email",
        "Statistiques d'ouverture",
      ],
    };

    // Recherche exacte d'abord
    if (suggestions[currentRoute]) {
      return suggestions[currentRoute];
    }

    // Recherche approximative
    for (const [route, routeSuggestions] of Object.entries(suggestions)) {
      if (currentRoute.startsWith(route)) {
        return routeSuggestions;
      }
    }

    // Suggestions par défaut
    return [
      "Où sont mes clients ?",
      "Page des opportunités",
      "Accéder au pipeline",
      "Voir la messagerie",
    ];
  }

  // Parser les actions suggérées en liens Next.js
  parseNavigationActions(actions: ChatbotResponse["suggestedActions"]) {
    if (!actions) return [];

    return actions.map((action) => ({
      ...action,
      href: action.route,
      // Détecter si c'est un lien externe ou interne
      isExternal: action.route.startsWith("http"),
      // Ajouter des paramètres de tracking si nécessaire
      trackingParams: {
        source: "chatbot",
        action: "navigation",
        target: action.route,
      },
    }));
  }
}

// Instance singleton
const chatbotService = new ChatbotService();
export default chatbotService;
