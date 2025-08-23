import { useEffect, useState } from "react";
import {
  Deal,
  DealStatus,
  getDealsByCompany,
  updateDeal,
  deleteDeal as deleteDealService,
} from "@/services/deal.service";

interface UseDealsProps {
  companyId?: string;
}

interface UseDealsReturn {
  deals: Deal[];
  isLoading: boolean;
  error: string | null;
  refreshDeals: () => Promise<void>;
  handleStatusChange: (dealId: string, newStatus: DealStatus) => Promise<void>;
  deleteDeal: (dealId: string) => Promise<void>;
}

export const useDeals = ({ companyId }: UseDealsProps = {}): UseDealsReturn => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDeals = async () => {
    if (!companyId) {
      setDeals([]);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await getDealsByCompany(companyId);
      setDeals(data);
    } catch (err: any) {
      setError(err.message || "Impossible de charger les deals");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId]);

  const refreshDeals = async () => {
    await fetchDeals();
  };

  const allowed: DealStatus[] = [
    "prospection",
    "qualification",
    "proposition",
    "negociation",
    "signature",
    "perdu",
    "gagne",
  ];

  const handleStatusChange = async (dealId: string, newStatus: DealStatus) => {
    if (!allowed.includes(newStatus)) return;
    try {
      setDeals((prev) =>
        prev.map((d) => (d._id === dealId ? { ...d, status: newStatus } : d))
      );
      await updateDeal(dealId, { status: newStatus });
    } catch (err) {
      setError("Échec de la mise à jour du statut. Réessayez.");
      await fetchDeals();
    }
  };

  const deleteDeal = async (dealId: string) => {
    await deleteDealService(dealId);
    setDeals((prev) => prev.filter((d) => d._id !== dealId));
  };

  return {
    deals,
    isLoading,
    error,
    refreshDeals,
    handleStatusChange,
    deleteDeal,
  };
};
