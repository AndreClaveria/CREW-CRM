// src/hooks/useUserDashboard.ts
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchUserDashboard } from "@/services/dashboard.service";
import { Team } from "@/services/team.service";
import { User } from "@/services/user.service";
import { Company } from "@/services/company.service";
import { getRoutePrefix } from "@/utils/getRoutePrefix";

export interface DashboardData {
  user: User;
  teams: Team[];
  company: Company | null;
}

interface UseUserDashboardProps {
  userType?: "user" | "manager" | "admin"; // Permet de spécifier le type d'utilisateur
}

interface UseUserDashboardReturn {
  dashboardData: DashboardData | null;
  loading: boolean;
  error: string | null;
  navigateToTeam: (teamId: string) => void;
  navigateToCompanyManagement?: () => void; // Optionnel, uniquement pour les managers et admins
}

export const useUserDashboard = ({
  userType = "user",
}: UseUserDashboardProps = {}): UseUserDashboardReturn => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Déterminer le préfixe de route en fonction du type d'utilisateur
  const routePrefix = getRoutePrefix(userType);

  // Chargement des données du tableau de bord
  useEffect(() => {
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

    loadDashboard();
  }, []);

  // Navigation vers la page d'une équipe
  const navigateToTeam = (teamId: string) => {
    router.push(`/dashboard/user/team/${teamId}`);
  };

  // Navigation vers la gestion d'entreprise (uniquement pour les managers et admins)
  const navigateToCompanyManagement = () => {
    if (
      (userType === "manager" || userType === "admin") &&
      dashboardData?.company
    ) {
      router.push(`/dashboard/${routePrefix}/manage/company`);
    } else if (userType === "manager" || userType === "admin") {
      router.push(`/dashboard/${routePrefix}/manage/company/new`);
    }
  };

  // Retourne différentes fonctions selon le type d'utilisateur
  const isManagerOrAdmin = userType === "manager" || userType === "admin";

  return isManagerOrAdmin
    ? {
        dashboardData,
        loading,
        error,
        navigateToTeam,
        navigateToCompanyManagement,
      }
    : {
        dashboardData,
        loading,
        error,
        navigateToTeam,
      };
};
