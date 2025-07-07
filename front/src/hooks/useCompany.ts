// src/hooks/useCompany.ts
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  getCompaniesByOwner,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  Company,
} from "@/services/company.service";

interface UseCompanyProps {
  userId?: string;
  companyId?: string;
  loadAll?: boolean; // Option pour charger toutes les entreprises (admin)
}

interface UseCompanyReturn {
  company: Company | null;
  companies: Company[];
  isLoading: boolean;
  error: string | null;
  loadCompany: (id: string) => Promise<void>;
  loadUserCompanies: (userId: string) => Promise<void>;
  loadAllCompanies: () => Promise<void>;
  updateCompanyData: (id: string, data: Partial<Company>) => Promise<boolean>;
}

export const useCompany = ({
  userId,
  companyId,
  loadAll = false,
}: UseCompanyProps = {}): UseCompanyReturn => {
  const { user } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Charger une entreprise spécifique par ID
  const loadCompany = async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const companyData = await getCompanyById(id);
      setCompany(companyData);
    } catch (err: any) {
      console.error(`Erreur lors du chargement de l'entreprise ${id}:`, err);
      setError(
        err.message || "Impossible de charger les données de l'entreprise"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les entreprises d'un utilisateur
  const loadUserCompanies = async (userId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const companiesData = await getCompaniesByOwner(userId);
      setCompanies(companiesData);

      // Si des entreprises sont trouvées et qu'aucune entreprise spécifique n'est chargée
      if (companiesData.length > 0 && !company) {
        await loadCompany(companiesData[0]._id);
      }
    } catch (err: any) {
      console.error(
        `Erreur lors du chargement des entreprises de l'utilisateur ${userId}:`,
        err
      );
      setError(err.message || "Impossible de charger les entreprises");
    } finally {
      setIsLoading(false);
    }
  };

  // Charger toutes les entreprises (pour l'admin)
  const loadAllCompanies = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const companiesData = await getAllCompanies();
      setCompanies(companiesData);
    } catch (err: any) {
      console.error(
        "Erreur lors du chargement de toutes les entreprises:",
        err
      );
      setError(err.message || "Impossible de charger les entreprises");
    } finally {
      setIsLoading(false);
    }
  };

  // Mettre à jour les données d'une entreprise
  const updateCompanyData = async (
    id: string,
    data: Partial<Company>
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const updatedCompany = await updateCompany(id, data);

      // Mettre à jour les données locales
      setCompany((prev) => (prev && prev._id === id ? updatedCompany : prev));
      setCompanies((prev) =>
        prev.map((c) => (c._id === id ? updatedCompany : c))
      );

      return true;
    } catch (err: any) {
      console.error(
        `Erreur lors de la mise à jour de l'entreprise ${id}:`,
        err
      );
      setError(err.message || "Impossible de mettre à jour l'entreprise");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les données au montage
  useEffect(() => {
    if (companyId) {
      loadCompany(companyId);
    } else if (userId) {
      loadUserCompanies(userId);
    } else if (loadAll) {
      loadAllCompanies();
    } else if (user) {
      // Si aucun ID n'est fourni mais que l'utilisateur est connecté
      if (user.role === "admin") {
        loadAllCompanies();
      } else if (user.role === "manager" && user._id) {
        loadUserCompanies(user._id);
      }
    }
  }, [companyId, userId, loadAll, user]);

  return {
    company,
    companies,
    isLoading,
    error,
    loadCompany,
    loadUserCompanies,
    loadAllCompanies,
    updateCompanyData,
  };
};
