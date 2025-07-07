// src/hooks/useTeamTable.ts
import { useState, useEffect } from "react";
import { Team } from "@/services/team.service";
import { getUserById, User } from "@/services/user.service";
import { useAuth } from "@/contexts/AuthContext";

interface UseTeamTableProps {
  teams: Team[];
}

interface UseTeamTableReturn {
  teamLeaders: { [key: string]: User };
  loadingLeaders: boolean;
  getLeaderName: (team: Team) => string;
  formatDate: (dateString?: string) => string;
  getRoutePrefix: () => string;
}

/**
 * Hook personnalisé pour gérer la logique des tableaux d'équipes
 */
export const useTeamTable = ({
  teams,
}: UseTeamTableProps): UseTeamTableReturn => {
  const { user } = useAuth();
  const [teamLeaders, setTeamLeaders] = useState<{ [key: string]: User }>({});
  const [loadingLeaders, setLoadingLeaders] = useState(false);

  // Détermination du préfixe de route basé sur le rôle
  const getRoutePrefix = () => {
    return user?.role === "admin" ? "admin" : "manager";
  };

  // Chargement des leaders au montage du composant
  useEffect(() => {
    const fetchLeaderDetails = async () => {
      if (!teams || teams.length === 0) return;

      setLoadingLeaders(true);
      const leaderMap: { [key: string]: User } = {};

      // Création d'un ensemble pour éviter les doublons
      const leaderIds = new Set<string>();

      // Collecte des IDs uniques de leaders
      teams.forEach((team) => {
        if (team.leader) {
          const leaderId =
            typeof team.leader === "object" ? team.leader._id : team.leader;
          if (leaderId) {
            leaderIds.add(leaderId);
          }
        }
      });

      // Récupération des détails pour chaque leader
      try {
        const promises = Array.from(leaderIds).map(async (leaderId) => {
          try {
            const leaderData = await getUserById(leaderId);
            leaderMap[leaderId] = leaderData;
          } catch (error) {
            console.error(
              `Erreur lors de la récupération du leader ${leaderId}:`,
              error
            );
          }
        });

        await Promise.all(promises);
        setTeamLeaders(leaderMap);
      } catch (error) {
        console.error("Erreur lors de la récupération des leaders:", error);
      } finally {
        setLoadingLeaders(false);
      }
    };

    fetchLeaderDetails();
  }, [teams]);

  // Formatage de la date de création
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Non disponible";
    const date = new Date(dateString);
    return date.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Fonction pour obtenir le nom du leader
  const getLeaderName = (team: Team) => {
    // Si le leader est déjà un objet User complet
    if (
      team.leader &&
      typeof team.leader === "object" &&
      team.leader.firstName
    ) {
      return `${team.leader.firstName} ${team.leader.lastName}`;
    }

    // Si le leader est un ID et que nous avons récupéré ses détails
    const leaderId =
      typeof team.leader === "string"
        ? team.leader
        : team.leader && "_id" in team.leader
        ? team.leader._id
        : "";

    if (leaderId && teamLeaders[leaderId]) {
      return `${teamLeaders[leaderId].firstName} ${teamLeaders[leaderId].lastName}`;
    }

    return "Non assigné";
  };

  return {
    teamLeaders,
    loadingLeaders,
    getLeaderName,
    formatDate,
    getRoutePrefix,
  };
};
