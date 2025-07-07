// src/hooks/useMail.ts
import { useState, useEffect } from "react";
import {
  getAllEmails,
  getEmailsByUser,
  getEmailById,
  sendEmail,
  markEmailAsRead,
  deleteEmail,
  getEmailStats,
  getEmailStatsByUser,
  getEmailConversation,
  getEmailReplies,
  getEmailByTrackingId,
  testEmailConnection,
  Email,
  EmailCreateInput,
  EmailFilters,
  EmailStatsFilters,
  EmailListResponse,
  ConversationResponse,
} from "@/services/email.service";

interface UseEmailProps {
  userId?: string;
  emailId?: string;
}

interface UseEmailReturn {
  emails: Email[];
  email: Email | null;
  stats: any;
  conversation: ConversationResponse["data"] | null;
  pagination: EmailListResponse["pagination"] | null;
  isLoading: boolean;
  isSending: boolean;
  error: string | null;

  // Actions de chargement
  loadAllEmails: (filters?: EmailFilters) => Promise<void>;
  loadEmailsByUser: (
    userId: string,
    filters?: Omit<EmailFilters, "userId">
  ) => Promise<void>;
  loadEmail: (emailId: string) => Promise<void>;
  loadStats: (filters?: EmailStatsFilters) => Promise<void>;
  loadStatsByUser: (
    userId: string,
    filters?: Omit<EmailStatsFilters, "userId">
  ) => Promise<void>;
  loadConversation: (emailId: string) => Promise<void>;
  loadReplies: (emailId: string) => Promise<Email[]>;

  // Actions d'envoi et gestion
  sendNewEmail: (emailData: EmailCreateInput) => Promise<Email | null>;
  markAsRead: (emailId: string, isRead?: boolean) => Promise<boolean>;
  deleteEmailById: (emailId: string, permanent?: boolean) => Promise<boolean>;

  // Actions de recherche
  searchEmails: (searchParams: {
    query?: string;
    userId?: string;
    status?: string;
    dateRange?: { from: Date; to: Date };
    page?: number;
    limit?: number;
  }) => Promise<void>;

  // Utilitaires
  getEmailByTracking: (trackingId: string) => Promise<Email | null>;
  testConnection: () => Promise<boolean>;
  resetError: () => void;
  setEmail: (email: Email | null) => void;
}

export const useEmail = ({
  userId,
  emailId,
}: UseEmailProps = {}): UseEmailReturn => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [email, setEmail] = useState<Email | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [conversation, setConversation] = useState<
    ConversationResponse["data"] | null
  >(null);
  const [pagination, setPagination] = useState<
    EmailListResponse["pagination"] | null
  >(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour réinitialiser les erreurs
  const resetError = () => setError(null);

  // Fonction pour mise à jour directe de l'email
  const setEmailDirectly = (newEmail: Email | null) => {
    setEmail(newEmail);
  };

  // ============================================
  // ACTIONS DE CHARGEMENT
  // ============================================

  // Charger tous les emails (historique général)
  const loadAllEmails = async (filters: EmailFilters = {}): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getAllEmails(filters);

      if (Array.isArray(response.data)) {
        setEmails(response.data);
        setPagination(response.pagination || null);
      } else {
        console.error(
          "Les données reçues ne sont pas un tableau:",
          response.data
        );
        setEmails([]);
        setPagination(null);
        setError(
          "Format de données incorrect. Veuillez contacter l'administrateur."
        );
      }
    } catch (err: any) {
      console.error(
        "Erreur lors du chargement de l'historique des emails:",
        err
      );
      setError(err.message || "Impossible de charger les emails");
      setEmails([]);
      setPagination(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les emails d'un utilisateur
  const loadEmailsByUser = async (
    userId: string,
    filters: Omit<EmailFilters, "userId"> = {}
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getEmailsByUser(userId, filters);
      setEmails(Array.isArray(response.data) ? response.data : []);
      setPagination(response.pagination || null);
    } catch (err: any) {
      console.error(
        `Erreur lors du chargement des emails pour l'utilisateur ${userId}:`,
        err
      );
      setError(
        err.message || "Impossible de charger les emails de l'utilisateur"
      );
      setEmails([]);
      setPagination(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Charger un email spécifique
  const loadEmail = async (emailId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const emailData = await getEmailById(emailId);
      setEmail(emailData);
    } catch (err: any) {
      console.error(`Erreur lors du chargement de l'email ${emailId}:`, err);
      setError(err.message || "Impossible de charger les données de l'email");
      setEmail(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les statistiques générales
  const loadStats = async (filters: EmailStatsFilters = {}): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const statsData = await getEmailStats(filters);
      setStats(statsData);
    } catch (err: any) {
      console.error("Erreur lors du chargement des statistiques:", err);
      setError(err.message || "Impossible de charger les statistiques");
      setStats(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les statistiques d'un utilisateur
  const loadStatsByUser = async (
    userId: string,
    filters: Omit<EmailStatsFilters, "userId"> = {}
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const statsData = await getEmailStatsByUser(userId, filters);
      setStats(statsData);
    } catch (err: any) {
      console.error(
        `Erreur lors du chargement des statistiques pour l'utilisateur ${userId}:`,
        err
      );
      setError(err.message || "Impossible de charger les statistiques");
      setStats(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Charger une conversation
  const loadConversation = async (emailId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const conversationData = await getEmailConversation(emailId);
      setConversation(conversationData);
    } catch (err: any) {
      console.error(
        `Erreur lors du chargement de la conversation ${emailId}:`,
        err
      );
      setError(err.message || "Impossible de charger la conversation");
      setConversation(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les réponses d'un email
  const loadReplies = async (emailId: string): Promise<Email[]> => {
    setError(null);

    try {
      const replies = await getEmailReplies(emailId);
      return replies;
    } catch (err: any) {
      console.error(`Erreur lors du chargement des réponses ${emailId}:`, err);
      setError(err.message || "Impossible de charger les réponses");
      return [];
    }
  };

  // ============================================
  // ACTIONS D'ENVOI ET GESTION
  // ============================================

  // Envoyer un nouvel email
  const sendNewEmail = async (
    emailData: EmailCreateInput
  ): Promise<Email | null> => {
    setIsSending(true);
    setError(null);

    try {
      const newEmail = await sendEmail(emailData);

      // Mettre à jour la liste locale des emails
      setEmails((prev) => [newEmail, ...prev]);

      return newEmail;
    } catch (err: any) {
      console.error("Erreur lors de l'envoi de l'email:", err);
      setError(err.message || "Impossible d'envoyer l'email");
      return null;
    } finally {
      setIsSending(false);
    }
  };

  // Marquer comme lu/non lu
  const markAsRead = async (
    emailId: string,
    isRead: boolean = true
  ): Promise<boolean> => {
    setError(null);

    try {
      const updatedEmail = await markEmailAsRead(emailId, isRead);

      // Mettre à jour localement
      setEmails((prev) =>
        prev.map((e) => (e._id === emailId ? { ...e, isRead } : e))
      );

      if (email && email._id === emailId) {
        setEmail((prev) => (prev ? { ...prev, isRead } : null));
      }

      return true;
    } catch (err: any) {
      console.error(
        `Erreur lors de la mise à jour du statut de lecture ${emailId}:`,
        err
      );
      setError(
        err.message || "Impossible de mettre à jour le statut de lecture"
      );
      return false;
    }
  };

  // Supprimer un email
  const deleteEmailById = async (
    emailId: string,
    permanent: boolean = false
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await deleteEmail(emailId, permanent);

      // Mettre à jour les données locales
      setEmails((prev) => prev.filter((e) => e._id !== emailId));
      if (email && email._id === emailId) {
        setEmail(null);
      }

      return true;
    } catch (err: any) {
      console.error(
        `Erreur lors de la suppression de l'email ${emailId}:`,
        err
      );
      setError(err.message || "Impossible de supprimer l'email");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // ACTIONS DE RECHERCHE
  // ============================================

  // Rechercher des emails avec filtres
  const searchEmails = async (searchParams: {
    query?: string;
    userId?: string;
    status?: string;
    dateRange?: { from: Date; to: Date };
    page?: number;
    limit?: number;
  }): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const filters: EmailFilters = {
        page: searchParams.page || 1,
        limit: searchParams.limit || 10,
      };

      if (searchParams.userId) filters.userId = searchParams.userId;
      if (searchParams.status) filters.status = searchParams.status;

      if (searchParams.dateRange) {
        filters.dateFrom = formatDateForFilter(searchParams.dateRange.from);
        filters.dateTo = formatDateForFilter(searchParams.dateRange.to);
      }

      let response;
      if (searchParams.userId) {
        response = await getEmailsByUser(searchParams.userId, filters);
      } else {
        response = await getAllEmails(filters);
      }

      setEmails(response.data || []);
      setPagination(response.pagination || null);
    } catch (err: any) {
      console.error("Erreur lors de la recherche d'emails:", err);
      setError(err.message || "Impossible de rechercher les emails");
      setEmails([]);
      setPagination(null);
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // UTILITAIRES
  // ============================================

  // Récupérer un email par tracking ID
  const getEmailByTracking = async (
    trackingId: string
  ): Promise<Email | null> => {
    setError(null);

    try {
      const emailData = await getEmailByTrackingId(trackingId);
      return emailData;
    } catch (err: any) {
      console.error(
        `Erreur lors de la récupération par tracking ID ${trackingId}:`,
        err
      );
      setError(err.message || "Impossible de trouver l'email");
      return null;
    }
  };

  // Tester la connexion SMTP
  const testConnection = async (): Promise<boolean> => {
    setError(null);

    try {
      const result = await testEmailConnection();
      return result;
    } catch (err: any) {
      console.error("Erreur lors du test de connexion:", err);
      setError(err.message || "Échec du test de connexion");
      return false;
    }
  };

  // Fonction utilitaire pour formater les dates
  const formatDateForFilter = (date: Date): string => {
    return date.toISOString().split("T")[0];
  };

  // ============================================
  // EFFETS
  // ============================================

  // Chargement initial basé sur les props
  useEffect(() => {
    if (emailId) {
      loadEmail(emailId);
    } else if (userId) {
      loadEmailsByUser(userId);
    }
  }, [emailId, userId]);

  return {
    // États
    emails,
    email,
    stats,
    conversation,
    pagination,
    isLoading,
    isSending,
    error,

    // Actions de chargement
    loadAllEmails,
    loadEmailsByUser,
    loadEmail,
    loadStats,
    loadStatsByUser,
    loadConversation,
    loadReplies,

    // Actions d'envoi et gestion
    sendNewEmail,
    markAsRead,
    deleteEmailById,

    // Actions de recherche
    searchEmails,

    // Utilitaires
    getEmailByTracking,
    testConnection,
    resetError,
    setEmail: setEmailDirectly,
  };
};
