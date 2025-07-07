// hooks/useTeamAccess.ts
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getRoutePrefix } from "@/utils/getRoutePrefix";

interface UseTeamAccessProps {
  companyId: string;
  teamId: string;
}

export const useTeamAccess = ({ companyId, teamId }: UseTeamAccessProps) => {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  // Vérification des accès et redirection si nécessaire
  useEffect(() => {
    if (!isLoading && user) {
      if (!["admin", "manager"].includes(user.role)) {
        router.push("/dashboard");
      }
    }
  }, [user, isLoading, router]);

  // Utilisation de la fonction getRoutePrefix importée
  const routePrefix = getRoutePrefix(user?.role);

  const navigateToTeamsList = () => {
    router.push(`/dashboard/${routePrefix}/manage/company/teams/${companyId}`);
  };

  const navigateToDashboard = () => {
    router.push("/dashboard");
  };

  const hasValidAccess =
    !isLoading && user && ["admin", "manager"].includes(user.role);
  const hasValidParams = Boolean(companyId && teamId);

  return {
    user,
    isLoading,
    hasValidAccess,
    hasValidParams,
    routePrefix,
    navigateToTeamsList,
    navigateToDashboard,
  };
};
