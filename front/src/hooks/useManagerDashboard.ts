// src/hooks/useManagerDashboard.ts
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchUserDashboard } from "@/services/dashboard.service";
import { Team } from "@/services/team.service";
import { User } from "@/services/user.service";
import { Company } from "@/services/company.service";
import { useAuth } from "@/contexts/AuthContext";
import { getRoutePrefix } from "@/utils/getRoutePrefix";

export interface DashboardData {
  user: User;
  teams: Team[];
  company: Company | null;
}

interface UseManagerDashboardReturn {
  dashboardData: DashboardData | null;
  loading: boolean;
  error: string | null;
  handleCompanyAction: () => void;
  navigateToTeam: (teamId: string, companyId?: string) => void;
  handleTeamAction: (companyId?: string) => void;
  refreshDashboard: () => Promise<void>;
}

export const useManagerDashboard = (): UseManagerDashboardReturn => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  // Utiliser getRoutePrefix pour déterminer le préfixe de route
  const routePrefix = getRoutePrefix(user?.role);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const data = await fetchUserDashboard();
      setDashboardData(data);
    } catch (err) {
      console.error("Error loading dashboard:", err);
      setError("Impossible de charger les données du tableau de bord");
    } finally {
      setLoading(false);
    }
  };

  // Chargement des données du tableau de bord
  useEffect(() => {
    loadDashboard();
  }, []);

  // Fonction pour rafraîchir manuellement les données du dashboard
  const refreshDashboard = async () => {
    await loadDashboard();
  };

  // Gestion de l'action sur l'entreprise (créer ou gérer)
  const handleCompanyAction = () => {
    if (dashboardData?.company) {
      router.push(`/dashboard/${routePrefix}/manage/company`);
    } else {
      router.push(`/dashboard/${routePrefix}/manage/company/new`);
    }
  };

  // Assurer que companyId est toujours disponible en utilisant soit le paramètre, soit la valeur depuis dashboardData
  const navigateToTeam = (teamId: string, companyId?: string) => {
    // Utiliser companyId si fourni, sinon prendre celui du dashboardData
    const effectiveCompanyId = companyId || dashboardData?.company?._id;

    if (!effectiveCompanyId) {
      console.error("Impossible de naviguer: ID de l'entreprise manquant");
      return;
    }

    if (routePrefix === "user") {
      router.push(`/dashboard/user/teams/${teamId}`);
    } else {
      router.push(
        `/dashboard/${routePrefix}/manage/company/teams/${effectiveCompanyId}/${teamId}`
      );
    }
  };

  const handleTeamAction = (companyId?: string) => {
    // Utiliser companyId si fourni, sinon prendre celui du dashboardData
    const effectiveCompanyId = companyId || dashboardData?.company?._id;

    if (!effectiveCompanyId) {
      console.error("Impossible de naviguer: ID de l'entreprise manquant");
      return;
    }

    if (routePrefix === "user") {
      router.push(`/dashboard/user/teams`);
    } else {
      router.push(
        `/dashboard/${routePrefix}/manage/company/teams/${effectiveCompanyId}`
      );
    }
  };

  return {
    dashboardData,
    loading,
    error,
    handleCompanyAction,
    handleTeamAction,
    navigateToTeam,
    refreshDashboard,
  };
};
