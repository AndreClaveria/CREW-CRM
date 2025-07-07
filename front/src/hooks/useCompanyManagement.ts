// src/hooks/useCompanyManagement.ts
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  getCompaniesByOwner,
  getCompanyById,
  Company,
} from "@/services/company.service";
import { getTeamsByCompany, Team } from "@/services/team.service";
import { getClientsByCompany, Client } from "@/services/client.service";
import { getRoutePrefix } from "@/utils/getRoutePrefix";

interface UseCompanyManagementReturn {
  company: Company | null;
  teams: Team[];
  clients: Client[];
  error: string | null;
  isLoadingData: boolean;
  navigateToEditCompany: (companyId: string) => void;
  navigateToCreateCompany: () => void;
  navigateToTeamDetails: (teamId: string) => void;
  navigateToClientDetails: (clientId: string) => void;
  navigateToTeamsManagement: (companyId: string) => void;
  navigateToClientsManagement: (companyId: string) => void;
}

export const useCompanyManagement = (): UseCompanyManagementReturn => {
  const router = useRouter();
  const { user, isLoading: isLoadingAuth } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Déterminer le préfixe de route en fonction du rôle de l'utilisateur
  const routePrefix = getRoutePrefix(user?.role);

  // Fonctions de navigation
  const navigateToEditCompany = (companyId: string) => {
    router.push(`/dashboard/${routePrefix}/manage/company/edit/${companyId}`);
  };

  const navigateToCreateCompany = () => {
    router.push(`/dashboard/${routePrefix}/manage/company/new`);
  };

  const navigateToTeamDetails = (teamId: string) => {
    router.push(`/dashboard/team/${teamId}`);
  };

  const navigateToClientDetails = (clientId: string) => {
    router.push(`/dashboard/${routePrefix}/client/${clientId}`);
  };

  const navigateToTeamsManagement = (companyId: string) => {
    router.push(`/dashboard/${routePrefix}/manage/company/teams/${companyId}`);
  };

  const navigateToClientsManagement = (companyId: string) => {
    router.push(
      `/dashboard/${routePrefix}/manage/company/clients/${companyId}`
    );
  };

  // Vérification de rôle (admin ou manager)
  useEffect(() => {
    if (!isLoadingAuth && user && !["admin", "manager"].includes(user.role)) {
      router.push("/dashboard");
    }
  }, [user, isLoadingAuth, router]);

  // Chargement des données de l'entreprise, des équipes et des clients
  useEffect(() => {
    const fetchCompanyData = async () => {
      if (!user || !user._id) return;

      setIsLoadingData(true);
      try {
        // Récupérer l'entreprise du manager
        const companiesData = await getCompaniesByOwner(user._id);

        if (companiesData.length === 0) {
          // Pas d'entreprise, on ne charge pas les autres données
          setCompany(null);
          setIsLoadingData(false);
          return;
        }

        // Récupérer les détails de la première entreprise
        const companyId = companiesData[0]._id;
        const companyDetails = await getCompanyById(companyId);
        setCompany(companyDetails);

        // Récupérer les équipes de l'entreprise
        const teamsData = await getTeamsByCompany(companyId);
        setTeams(teamsData);

        // Récupérer les clients de l'entreprise
        const clientsData = await getClientsByCompany(companyId);
        setClients(clientsData);

        setError(null);
      } catch (err: any) {
        console.error("Erreur lors de la récupération des données:", err);
        setError(
          err.message ||
            "Impossible de charger les données. Veuillez réessayer."
        );
      } finally {
        setIsLoadingData(false);
      }
    };

    if (user && ["admin", "manager"].includes(user.role) && !isLoadingData) {
      fetchCompanyData();
    }
  }, [user]);

  return {
    company,
    teams,
    clients,
    error,
    isLoadingData,
    navigateToEditCompany,
    navigateToCreateCompany,
    navigateToTeamDetails,
    navigateToClientDetails,
    navigateToTeamsManagement,
    navigateToClientsManagement,
  };
};
