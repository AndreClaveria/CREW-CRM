import { useState, useEffect } from "react";
import {
  getOpportunitiesByCompany,
  Opportunity,
  updateOpportunity,
  deleteOpportunity as deleteOpportunityService,
} from "@/services/opportunity.service";

interface UseOpportunitiesProps {
  companyId?: string;
}

interface UseOpportunitiesReturn {
  opportunities: Opportunity[];
  isLoading: boolean;
  error: string | null;
  refreshOpportunities: () => Promise<void>;
  handleStatusChange: (
    opportunityId: string,
    newStatus: string
  ) => Promise<void>;
  deleteOpportunity: (opportunityId: string) => Promise<void>;
}

export const useOpportunities = ({
  companyId,
}: UseOpportunitiesProps = {}): UseOpportunitiesReturn => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOpportunities = async () => {
    if (!companyId) {
      console.log("Pas d'ID d'entreprise fourni");
      setOpportunities([]);
      return;
    }

    console.log(
      "Tentative de récupération des opportunités pour l'entreprise:",
      companyId
    );
    setIsLoading(true);
    setError(null);

    try {
      const opportunitiesData = await getOpportunitiesByCompany(companyId);
      console.log("Opportunités récupérées:", opportunitiesData);
      setOpportunities(opportunitiesData);
    } catch (err: any) {
      console.error(
        "Erreur détaillée lors du chargement des opportunités:",
        err
      );
      setError(err.message || "Impossible de charger les opportunités");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("useEffect triggered with companyId:", companyId);
    fetchOpportunities();
  }, [companyId]);

  const refreshOpportunities = async () => {
    await fetchOpportunities();
  };

  const handleStatusChange = async (
    opportunityId: string,
    newStatus: string
  ) => {
    // Vérifier que le statut est valide
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

    try {
      // Mise à jour optimiste de l'état local
      setOpportunities((prevOpportunities) =>
        prevOpportunities.map((o) =>
          o._id === opportunityId ? { ...o, status: newStatus } : o
        )
      );

      // Appel API pour mettre à jour le statut
      await updateOpportunity(opportunityId, { status: newStatus });
      console.log(
        `Opportunité ${opportunityId} mise à jour avec statut: ${newStatus}`
      );
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      setError(
        "Échec de la mise à jour du statut. Réessayez ou rafraîchissez la page."
      );

      // Recharger les opportunités en cas d'erreur
      await fetchOpportunities();
    }
  };

  const deleteOpportunity = async (opportunityId: string) => {
    try {
      await deleteOpportunityService(opportunityId);
      setOpportunities((prevOpportunities) =>
        prevOpportunities.filter((opp) => opp._id !== opportunityId)
      );
    } catch (err: any) {
      console.error("Erreur lors de la suppression:", err);
      throw err;
    }
  };

  return {
    opportunities,
    isLoading,
    error,
    refreshOpportunities,
    handleStatusChange,
    deleteOpportunity,
  };
};
