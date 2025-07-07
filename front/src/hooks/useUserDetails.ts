// src/hooks/useUserDetails.ts
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserById, updateUser, User } from "@/services/user.service";
import { getAllCompanies, Company } from "@/services/company.service";
import { getAllTeams, Team } from "@/services/team.service";
import { useAuth } from "@/contexts/AuthContext";
import { getRoutePrefix } from "@/utils/getRoutePrefix";

interface UseUserDetailsReturn {
  user: User | null;
  managedCompany: Company | null;
  userTeams: Team[];
  isLoading: boolean;
  error: string | null;
  updateUserDetails: (userData: Partial<User>) => Promise<boolean>;
  toggleUserStatus: () => Promise<boolean>;
  navigateToCompany: (companyId: string) => void;
  navigateToTeam: (teamId: string) => void;
}

export const useUserDetails = (userId: string): UseUserDetailsReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [managedCompany, setManagedCompany] = useState<Company | null>(null);
  const [userTeams, setUserTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user: currentUser } = useAuth();

  // Utiliser getRoutePrefix pour déterminer le préfixe de route
  const routePrefix = getRoutePrefix(currentUser?.role);

  // Déterminer la structure de route selon le rôle
  const getBaseRoute = () => {
    if (routePrefix === "user") {
      return `/dashboard/user/users`;
    } else {
      return `/dashboard/${routePrefix}`;
    }
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Récupérer les détails de l'utilisateur
        const userData = await getUserById(userId);
        if (!userData) {
          throw new Error("Utilisateur non trouvé");
        }
        setUser(userData);

        // Récupérer toutes les entreprises et les équipes
        const [allCompanies, allTeams] = await Promise.all([
          getAllCompanies(),
          getAllTeams(),
        ]);

        // Trouver l'entreprise dont cet utilisateur est propriétaire (si c'est un manager)
        if (userData.role === "manager" || userData.role === "admin") {
          const foundCompany = allCompanies.find(
            (company) => company.owner === userId
          );
          setManagedCompany(foundCompany || null);
        }

        // Trouver les équipes dont l'utilisateur est membre
        const teamsWithUser = allTeams.filter((team) => {
          // Vérifie si l'équipe a un tableau de membres
          if (!Array.isArray(team.members)) {
            return false;
          }

          // Parcourt chaque membre pour vérifier s'il correspond à notre utilisateur
          return team.members.some((member) => {
            // Si le membre est un objet avec un _id
            if (
              typeof member === "object" &&
              member !== null &&
              "_id" in member
            ) {
              return (member as { _id: string })._id === userId;
            }
            // Si le membre est une chaîne (ID)
            return member === userId;
          });
        });

        setUserTeams(teamsWithUser);
      } catch (err) {
        console.error("Error fetching user details:", err);
        setError("Impossible de charger les détails de l'utilisateur");
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchUserDetails();
    }
  }, [userId]);

  const updateUserDetails = async (
    userData: Partial<User>
  ): Promise<boolean> => {
    if (!user) return false;

    try {
      setIsLoading(true);
      const updatedUser = await updateUser(userId, userData);

      if (updatedUser) {
        setUser(updatedUser);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error updating user:", err);
      setError("Impossible de mettre à jour l'utilisateur");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const toggleUserStatus = async (): Promise<boolean> => {
    if (!user) return false;

    try {
      setIsLoading(true);

      // Inverser le statut actif
      const success = await updateUser(userId, {
        active: !user.active,
      });

      if (success) {
        setUser({ ...user, active: !user.active });
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error toggling user status:", err);
      setError("Impossible de modifier le statut de l'utilisateur");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToCompany = (companyId: string) => {
    const baseRoute = getBaseRoute();
    if (routePrefix === "user") {
      router.push(`/dashboard/user/company/${companyId}`);
    } else {
      router.push(`${baseRoute}/manage/company/${companyId}`);
    }
  };

  const navigateToTeam = (teamId: string, companyId?: string) => {
    const baseRoute = getBaseRoute();
    if (routePrefix === "user") {
      router.push(`/dashboard/user/team/${teamId}`);
    } else {
      router.push(`${baseRoute}/manage/company/teams/${companyId}/${teamId}`);
    }
  };

  return {
    user,
    managedCompany,
    userTeams,
    isLoading,
    error,
    updateUserDetails,
    toggleUserStatus,
    navigateToCompany,
    navigateToTeam,
  };
};
