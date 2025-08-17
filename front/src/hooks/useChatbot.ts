// src/hooks/useChatbot.ts

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import chatbotService, {
  ChatMessage,
  NavigationContext,
  ChatbotResponse,
  ChatApiResponse,
} from "@/services/chatbot.service";

export interface UseChatbotState {
  messages: ChatMessage[];
  isLoading: boolean;
  isOpen: boolean;
  context: NavigationContext;
  error: string | null;
  sessionId: string | null;
  quickSuggestions: string[];
}

export interface UseChatbotActions {
  sendMessage: (message: string) => Promise<void>;
  toggleChat: () => void;
  openChat: () => void;
  closeChat: () => void;
  clearMessages: () => void;
  resetSession: () => Promise<void>;
  getContextualHelp: () => Promise<void>;
  searchFeatures: (term: string) => Promise<void>;
  handleSuggestedAction: (route: string) => void;
  setError: (error: string | null) => void;
}

export interface UseChatbotReturn extends UseChatbotState, UseChatbotActions {
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export const useChatbot = (): UseChatbotReturn => {
  const router = useRouter();

  // État du chatbot
  const [state, setState] = useState<UseChatbotState>({
    messages: [],
    isLoading: false,
    isOpen: false,
    context: {},
    error: null,
    sessionId: null,
    quickSuggestions: [],
  });

  // Référence pour éviter les re-renders inutiles
  const lastRouteRef = useRef<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll automatique vers le bas
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Mettre à jour le contexte selon la route actuelle
  const updateContext = useCallback(() => {
    if (typeof window !== "undefined") {
      const currentRoute = window.location.pathname;

      if (currentRoute !== lastRouteRef.current) {
        lastRouteRef.current = currentRoute;

        setState((prev) => ({
          ...prev,
          context: {
            ...prev.context,
            currentRoute,
            // Vous pouvez ajouter d'autres informations contextuelles ici
            userRole: "user", // À adapter selon votre système d'auth
            availableFeatures: [], // À remplir selon les permissions
          },
          quickSuggestions: chatbotService.getQuickSuggestions(currentRoute),
        }));
      }
    }
  }, []);

  // Initialisation
  useEffect(() => {
    updateContext();

    // Récupérer le session ID
    const sessionId = chatbotService.getCurrentSessionId();
    setState((prev) => ({ ...prev, sessionId }));

    // Charger l'historique existant si disponible
    const loadHistory = async () => {
      try {
        if (sessionId) {
          const history = await chatbotService.getConversationHistory();
          setState((prev) => ({
            ...prev,
            messages: history.messages,
            context: { ...prev.context, ...history.context },
          }));
        }
      } catch (error) {
        // Historique non trouvé, c'est normal pour une nouvelle session
        console.log("Nouvelle session de chat");
      }
    };

    loadHistory();
  }, [updateContext]);

  // Mettre à jour le contexte quand la route change
  useEffect(() => {
    updateContext();
  }, [updateContext]);

  // Scroll automatique quand de nouveaux messages arrivent
  useEffect(() => {
    if (state.messages.length > 0) {
      setTimeout(scrollToBottom, 100);
    }
  }, [state.messages.length, scrollToBottom]);

  // Actions du chatbot
  const sendMessage = useCallback(
    async (message: string) => {
      if (!message.trim() || state.isLoading) return;

      // Ajouter le message utilisateur immédiatement
      const userMessage: ChatMessage = {
        id: `user_${Date.now()}`,
        content: message.trim(),
        role: "user",
        timestamp: new Date(),
      };

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, userMessage],
        isLoading: true,
        error: null,
      }));

      try {
        // Envoyer le message au backend
        const response: ChatApiResponse = await chatbotService.sendMessage(
          message,
          state.context,
          state.messages
        );

        // Ajouter la réponse de l'assistant
        const assistantMessage: ChatMessage = {
          id: `assistant_${Date.now()}`,
          content: response.response.message,
          role: "assistant",
          timestamp: new Date(),
          metadata: {
            navigationType: response.response.suggestedActions?.length
              ? "route"
              : "feature",
            suggestedRoute: response.response.suggestedActions?.[0]?.route,
            relatedPages:
              response.response.suggestedActions?.map(
                (action) => action.route
              ) || [],
          },
        };

        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, assistantMessage],
          isLoading: false,
          sessionId: response.sessionId,
          context: { ...prev.context, ...response.conversation.context },
        }));

        // Stocker la réponse complète pour les actions suggérées
        setState((prev) => ({
          ...prev,
          lastResponse: response.response,
        }));
      } catch (error) {
        console.error("Erreur lors de l'envoi du message:", error);

        setState((prev) => ({
          ...prev,
          isLoading: false,
          error:
            error instanceof Error ? error.message : "Erreur de communication",
        }));

        // Ajouter un message d'erreur
        const errorMessage: ChatMessage = {
          id: `error_${Date.now()}`,
          content:
            "Désolé, je n'ai pas pu traiter votre demande. Veuillez réessayer.",
          role: "assistant",
          timestamp: new Date(),
        };

        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, errorMessage],
        }));
      }
    },
    [state.context, state.messages, state.isLoading]
  );

  // Gestion de l'ouverture/fermeture
  const toggleChat = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: !prev.isOpen }));
  }, []);

  const openChat = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: true }));
  }, []);

  const closeChat = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  // Nettoyer les messages
  const clearMessages = useCallback(() => {
    setState((prev) => ({
      ...prev,
      messages: [],
      error: null,
    }));
  }, []);

  // Réinitialiser la session
  const resetSession = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      await chatbotService.resetSession();

      setState((prev) => ({
        ...prev,
        messages: [],
        isLoading: false,
        error: null,
        sessionId: chatbotService.getCurrentSessionId(),
      }));
    } catch (error) {
      console.error("Erreur lors de la réinitialisation:", error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Erreur lors de la réinitialisation",
      }));
    }
  }, []);

  // Obtenir l'aide contextuelle
  const getContextualHelp = useCallback(async () => {
    if (!state.context.currentRoute) return;

    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      const helpResponse = await chatbotService.getContextualHelp(
        state.context.currentRoute,
        state.context.userRole
      );

      // Ajouter la réponse d'aide comme message
      const helpMessage: ChatMessage = {
        id: `help_${Date.now()}`,
        content: helpResponse.help.message,
        role: "assistant",
        timestamp: new Date(),
        metadata: {
          navigationType: "feature",
          relatedPages:
            helpResponse.help.suggestedActions?.map((action) => action.route) ||
            [],
        },
      };

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, helpMessage],
        isLoading: false,
        lastResponse: helpResponse.help,
      }));
    } catch (error) {
      console.error("Erreur lors de la récupération de l'aide:", error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Erreur lors de la récupération de l'aide",
      }));
    }
  }, [state.context]);

  // Rechercher des fonctionnalités
  const searchFeatures = useCallback(async (term: string) => {
    if (!term.trim()) return;

    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      const searchResponse = await chatbotService.searchFeatures(term);

      // Ajouter la question de recherche
      const searchQuery: ChatMessage = {
        id: `search_query_${Date.now()}`,
        content: `Recherche : "${term}"`,
        role: "user",
        timestamp: new Date(),
      };

      // Ajouter les résultats de recherche
      const searchResults: ChatMessage = {
        id: `search_results_${Date.now()}`,
        content: searchResponse.results.message,
        role: "assistant",
        timestamp: new Date(),
        metadata: {
          navigationType: "route",
          relatedPages:
            searchResponse.results.suggestedActions?.map(
              (action) => action.route
            ) || [],
        },
      };

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, searchQuery, searchResults],
        isLoading: false,
        lastResponse: searchResponse.results,
      }));
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Erreur lors de la recherche",
      }));
    }
  }, []);

  // Gérer les actions suggérées (navigation)
  const handleSuggestedAction = useCallback(
    (route: string) => {
      if (route.startsWith("http")) {
        // Lien externe
        window.open(route, "_blank");
      } else {
        // Navigation interne avec Next.js
        router.push(route);
        // Fermer le chat après navigation (optionnel)
        // closeChat();
      }

      // Enregistrer l'action dans l'historique
      setState((prev) => ({
        ...prev,
        context: {
          ...prev.context,
          recentActions: [
            `Navigation vers ${route}`,
            ...(prev.context.recentActions || []).slice(0, 4),
          ],
        },
      }));
    },
    [router]
  );

  // Setter pour les erreurs
  const setError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, error }));
  }, []);

  return {
    // État
    messages: state.messages,
    isLoading: state.isLoading,
    isOpen: state.isOpen,
    context: state.context,
    error: state.error,
    sessionId: state.sessionId,
    quickSuggestions: state.quickSuggestions,

    // Actions
    sendMessage,
    toggleChat,
    openChat,
    closeChat,
    clearMessages,
    resetSession,
    getContextualHelp,
    searchFeatures,
    handleSuggestedAction,
    setError,

    // Référence pour le scroll
    messagesEndRef,
  };
};
