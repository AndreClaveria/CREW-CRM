// src/hooks/useCompanyDetails.ts
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getCompanyById,
  updateCompany,
  Company,
} from "@/services/company.service";
import { getTeamsByCompany, Team } from "@/services/team.service";
import { getUserById, User } from "@/services/user.service";
import { getClientsByCompany, Client } from "@/services/client.service";
import { useAuth } from "@/contexts/AuthContext";

interface UseCompanyDetailsReturn {
  company: Company | null;
  manager: User | null;
  teams: Team[];
  clients: Client[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (items: number) => void;
  paginatedClients: Client[];
  updateCompanyDetails: (companyData: Partial<Company>) => Promise<boolean>;
  navigateToTeam: (teamId: string) => void;
  navigateToClient: (clientId: string) => void;
  navigateToManager: (managerId: string) => void;
  navigateToTeamsManagement: () => void;
  navigateToClientsManagement: () => void;
}

export const useCompanyDetails = (
  companyId: string
): UseCompanyDetailsReturn => {
  const [company, setCompany] = useState<Company | null>(null);
  const [manager, setManager] = useState<User | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const router = useRouter();
  const { user } = useAuth();

  // Base route pour la navigation
  const getBaseRoute = () => {
    return `/dashboard/pipeline`;
  };

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Récupérer les détails de l'entreprise
        const companyData = await getCompanyById(companyId);
        if (!companyData) {
          throw new Error("Entreprise non trouvée");
        }
        setCompany(companyData);

        // Récupérer les informations du manager
        if (companyData.owner) {
          try {
            const managerData = await getUserById(companyData.owner);
            setManager(managerData || null);
          } catch (managerError) {
            console.error(
              "Erreur lors de la récupération du manager:",
              managerError
            );
          }
        }

        // Récupérer les équipes de l'entreprise
        try {
          const companyTeams = await getTeamsByCompany(companyId);
          setTeams(Array.isArray(companyTeams) ? companyTeams : []);
        } catch (teamsError) {
          console.error(
            "Erreur lors de la récupération des équipes:",
            teamsError
          );
          setTeams([]);
        }

        // Récupérer les clients de l'entreprise
        try {
          let companyClients: Client[] = [];

          try {
            companyClients = await getClientsByCompany(companyId);

            if (!Array.isArray(companyClients)) {
              if (companyClients && typeof companyClients === "object") {
                const possibleArrayProps = Object.keys(companyClients).find(
                  (key) => Array.isArray((companyClients as any)[key])
                );

                if (possibleArrayProps) {
                  companyClients = (companyClients as any)[possibleArrayProps];
                } else {
                  companyClients = [];
                }
              } else {
                companyClients = [];
              }
            }
          } catch (err) {
            console.error("Erreur lors de la récupération des clients:", err);
            companyClients = [];
          }

          setClients(companyClients);
        } catch (clientsError) {
          console.error(
            "Erreur lors de la récupération des clients:",
            clientsError
          );
          setClients([]);
        }
      } catch (err) {
        console.error("Error fetching company details:", err);
        setError("Impossible de charger les détails de l'entreprise");
      } finally {
        setIsLoading(false);
      }
    };

    if (companyId) {
      fetchCompanyDetails();
    }
  }, [companyId]);

  // Calculer les clients paginés
  const safeClients = Array.isArray(clients) ? clients : [];
  const paginatedClients = safeClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculer le nombre total de pages
  const totalPages = Math.max(1, Math.ceil(safeClients.length / itemsPerPage));

  const updateCompanyDetails = async (
    companyData: Partial<Company>
  ): Promise<boolean> => {
    if (!company) return false;

    try {
      setIsLoading(true);
      const updatedCompany = await updateCompany(companyId, companyData);

      if (updatedCompany) {
        setCompany(updatedCompany);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error updating company:", err);
      setError("Impossible de mettre à jour l'entreprise");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToTeam = (teamId: string) => {
    router.push(`${getBaseRoute()}/team/${teamId}`);
  };

  const navigateToClient = (clientId: string) => {
    router.push(`${getBaseRoute()}/client/${clientId}`);
  };

  const navigateToManager = (managerId: string) => {
    router.push(`${getBaseRoute()}/user/${managerId}`);
  };

  const navigateToTeamsManagement = () => {
    router.push(`${getBaseRoute()}/teams?company=${companyId}`);
  };

  const navigateToClientsManagement = () => {
    router.push(`${getBaseRoute()}/clients?company=${companyId}`);
  };

  return {
    company,
    manager,
    teams,
    clients: safeClients,
    isLoading,
    error,
    currentPage,
    totalPages,
    itemsPerPage,
    setCurrentPage,
    setItemsPerPage,
    paginatedClients,
    updateCompanyDetails,
    navigateToTeam,
    navigateToClient,
    navigateToManager,
    navigateToTeamsManagement,
    navigateToClientsManagement,
  };
};
