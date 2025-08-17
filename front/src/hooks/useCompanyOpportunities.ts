import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  Opportunity,
  getOpportunitiesByCompany,
} from "@/services/opportunity.service";

interface UseCompanyOpportunitiesProps {
  companyId: string;
}

interface UseCompanyOpportunitiesReturn {
  opportunities: Opportunity[];
  error: string | null;
  isLoadingOpportunities: boolean;
  viewMode: "kanban" | "list";
  setViewMode: (mode: "kanban" | "list") => void;
  handleStatusChange: (
    opportunityId: string,
    newStatus: string
  ) => Promise<void>;
  navigateToClientsList: () => void;
}

export const useCompanyOpportunities = ({
  companyId,
}: UseCompanyOpportunitiesProps): UseCompanyOpportunitiesReturn => {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingOpportunities, setIsLoadingOpportunities] = useState(false);
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");

  const navigateToClientsList = () => {
    router.push(`/dashboard/pipeline/clients?company=${companyId}`);
  };

  useEffect(() => {
    const fetchOpportunities = async () => {
      if (!companyId) {
        setError("ID de l'entreprise manquant");
        return;
      }

      setIsLoadingOpportunities(true);
      try {
        const data = await getOpportunitiesByCompany(companyId);
        setOpportunities(data);
      } catch (err: any) {
        console.error("Erreur lors de la récupération des opportunités:", err);
        setError(err.message || "Impossible de charger les opportunités");
      } finally {
        setIsLoadingOpportunities(false);
      }
    };

    if (user) {
      fetchOpportunities();
    }
  }, [companyId, user]);

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

    try {
      setOpportunities((prevOpportunities) =>
        prevOpportunities.map((o) =>
          o._id === opportunityId
            ? { ...o, status: newStatus as Opportunity["status"] }
            : o
        )
      );

      const response = await fetch(`/api/opportunities/${opportunityId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Échec de la mise à jour du statut");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      setError(
        "Échec de la mise à jour du statut. Réessayez ou rafraîchissez la page."
      );

      // Recharger les opportunités en cas d'erreur
      if (companyId) {
        const response = await fetch(`/api/opportunities/company/${companyId}`);
        if (response.ok) {
          const data = await response.json();
          setOpportunities(data);
        }
      }
    }
  };

  return {
    opportunities,
    error,
    isLoadingOpportunities,
    viewMode,
    setViewMode,
    handleStatusChange,
    navigateToClientsList,
  };
};
