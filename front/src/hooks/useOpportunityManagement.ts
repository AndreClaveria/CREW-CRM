// src/hooks/useOpportunityManagement.ts
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  getOpportunitiesByClient,
  Opportunity,
  updateOpportunity,
  deleteOpportunity as deleteOpportunityService,
} from "@/services/opportunity.service";
import { getClientById, Client } from "@/services/client.service";

// Types de statut valides pour une opportunité
type OpportunityStatus =
  | "lead"
  | "qualified"
  | "proposition"
  | "negotiation"
  | "won"
  | "lost";

interface UseOpportunityManagementProps {
  clientId: string;
  companyId?: string;
}

interface UseOpportunityManagementReturn {
  opportunities: Opportunity[];
  client: Client | null;
  error: string | null;
  isLoadingOpportunities: boolean;
  viewMode: "kanban" | "list";
  setViewMode: (mode: "kanban" | "list") => void;
  handleStatusChange: (
    opportunityId: string,
    newStatus: string
  ) => Promise<void>;
  navigateToClientsList: () => void;
  navigateToAddOpportunity: () => void;
  navigateToEditOpportunity: (opportunityId: string) => void;
  deleteOpportunity: (opportunityId: string) => Promise<void>;
}

export const useOpportunityManagement = ({
  clientId,
  companyId,
}: UseOpportunityManagementProps): UseOpportunityManagementReturn => {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [client, setClient] = useState<Client | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingOpportunities, setIsLoadingOpportunities] = useState(false);
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");

  // Fonction pour récupérer les opportunités
  const fetchOpportunities = async () => {
    setIsLoadingOpportunities(true);
    try {
      const response = await getOpportunitiesByClient(clientId);
      let opportunitiesData: Opportunity[] = [];

      if (
        response &&
        typeof response === "object" &&
        "data" in response &&
        Array.isArray(response.data)
      ) {
        opportunitiesData = response.data;
      } else if (Array.isArray(response)) {
        opportunitiesData = response;
      }

      setOpportunities(opportunitiesData);
    } catch (err: any) {
      console.error("Erreur lors de la récupération des opportunités:", err);
      setError(
        err.message ||
          "Impossible de charger les opportunités. Veuillez réessayer."
      );
      setOpportunities([]);
    } finally {
      setIsLoadingOpportunities(false);
    }
  };

  // Fonctions de navigation
  const navigateToClientsList = () => {
    const effectiveCompanyId = companyId || client?.company;
    if (!effectiveCompanyId) {
      console.error("ID de l'entreprise manquant pour la navigation");
      return;
    }
    router.push(`/dashboard/pipeline/clients?company=${effectiveCompanyId}`);
  };

  const navigateToAddOpportunity = () => {
    router.push(`/dashboard/pipeline/clients/opportunity/${clientId}/add`);
  };

  const navigateToEditOpportunity = (opportunityId: string) => {
    router.push(
      `/dashboard/pipeline/clients/opportunity/${clientId}/edit/${opportunityId}`
    );
  };

  // Vérification de l'authentification
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  // Chargement des données du client et des opportunités
  useEffect(() => {
    const fetchClientDetails = async () => {
      try {
        const clientData = await getClientById(clientId);
        setClient(clientData);
      } catch (err: any) {
        console.error("Erreur lors de la récupération du client:", err);
        setError("Impossible de charger les détails du client.");
      }
    };

    if (user) {
      fetchClientDetails();
      fetchOpportunities();
    }
  }, [clientId, companyId, user]);

  // Gestionnaire pour changer le statut d'une opportunité
  const handleStatusChange = async (
    opportunityId: string,
    newStatus: string
  ) => {
    if (
      ![
        "lead",
        "qualified",
        "proposition",
        "negotiation",
        "won",
        "lost",
      ].includes(newStatus)
    ) {
      console.error(`Statut invalide: ${newStatus}`);
      return;
    }

    const validStatus = newStatus as OpportunityStatus;

    try {
      setOpportunities((prevOpportunities) =>
        prevOpportunities.map((o) =>
          o._id === opportunityId ? { ...o, status: validStatus } : o
        )
      );

      await updateOpportunity(opportunityId, { status: validStatus });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      setError(
        "Échec de la mise à jour du statut. Réessayez ou rafraîchissez la page."
      );

      await fetchOpportunities();
    }
  };

  const deleteOpportunity = async (opportunityId: string) => {
    try {
      await deleteOpportunityService(opportunityId);
      setOpportunities((prevOpportunities) =>
        prevOpportunities.filter((opp) => opp._id !== opportunityId)
      );
      navigateToClientsList();
    } catch (err: any) {
      console.error("Erreur lors de la suppression:", err);
      throw err;
    }
  };

  return {
    opportunities,
    client,
    error,
    isLoadingOpportunities,
    viewMode,
    setViewMode,
    handleStatusChange,
    navigateToClientsList,
    navigateToAddOpportunity,
    navigateToEditOpportunity,
    deleteOpportunity,
  };
};
