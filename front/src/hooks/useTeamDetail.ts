// src/hooks/useTeamDetail.ts
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getTeamById, Team } from "@/services/team.service";
import { getClientsByTeam, Client } from "@/services/client.service";
import { getUserById, User } from "@/services/user.service";

interface UseTeamDetailProps {
  teamId: string;
}

interface UseTeamDetailReturn {
  team: Team | null;
  clients: Client[];
  members: { [key: string]: User };
  loading: boolean;
  error: string | null;
  formatDate: (dateString?: string) => string;
  getScoreColor: (score: number) => string;
  navigateToClientDetail: (clientId: string) => void;
}

export const useTeamDetail = ({
  teamId,
}: UseTeamDetailProps): UseTeamDetailReturn => {
  const router = useRouter();
  const [team, setTeam] = useState<Team | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [members, setMembers] = useState<{ [key: string]: User }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigateToClientDetail = (clientId: string) => {
    router.push(`/dashboard/client/${clientId}`);
  };

  // Formater une date en français
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (e) {
      console.error("Erreur de formatage de date:", e);
      return dateString;
    }
  };

  // Fonction pour déterminer la couleur du score client
  const getScoreColor = (score: number): string => {
    if (score < 30) return "#ef4444"; // Rouge
    if (score < 50) return "#f97316"; // Orange
    if (score < 70) return "#facc15"; // Jaune
    if (score < 90) return "#84cc16"; // Vert clair
    return "#22c55e"; // Vert
  };

  // Chargement des données de l'équipe, des membres et des clients
  useEffect(() => {
    const loadTeamData = async () => {
      try {
        setLoading(true);
        console.log("Chargement des données pour l'équipe:", teamId);

        // Charger les données de l'équipe
        const teamData = await getTeamById(teamId);
        console.log("Données de l'équipe reçues:", teamData);
        setTeam(teamData);

        // Charger les informations des membres
        if (teamData.members && Array.isArray(teamData.members)) {
          const memberMap: { [key: string]: User } = {};
          const memberPromises = teamData.members.map(async (memberId) => {
            const id = typeof memberId === "string" ? memberId : memberId._id;
            try {
              const userData = await getUserById(id);
              memberMap[id] = userData;
            } catch (error) {
              console.error(
                `Erreur lors de la récupération de l'utilisateur ${id}:`,
                error
              );
            }
          });

          // Ajouter un appel supplémentaire pour le leader si nécessaire
          if (
            teamData.leader &&
            typeof teamData.leader === "string" &&
            !memberMap[teamData.leader]
          ) {
            memberPromises.push(
              (async () => {
                try {
                  const leaderData = await getUserById(
                    teamData.leader as string
                  );
                  memberMap[teamData.leader as string] = leaderData;
                } catch (error) {
                  console.error(
                    `Erreur lors de la récupération du leader ${teamData.leader}:`,
                    error
                  );
                }
              })()
            );
          }

          // Attendre que tous les appels API soient terminés
          await Promise.all(memberPromises);
          setMembers(memberMap);
        }

        // Récupérer les clients associés à cette équipe
        const clientsData = await getClientsByTeam(teamId);
        console.log("Clients associés reçus:", clientsData);

        if (clientsData && clientsData && Array.isArray(clientsData)) {
          setClients(clientsData);
        } else if (Array.isArray(clientsData)) {
          setClients(clientsData);
        } else if (clientsData && typeof clientsData === "object") {
          // Chercher une propriété qui contient un tableau
          const possibleArrayProps = Object.keys(clientsData).find((key) =>
            Array.isArray(clientsData[key])
          );
          if (possibleArrayProps) {
            setClients(clientsData[possibleArrayProps]);
          } else {
            setClients([]);
          }
        } else {
          setClients([]);
        }
      } catch (err: any) {
        console.error("Error loading team data:", err);
        setError(
          `Impossible de charger les données de l'équipe: ${err.message}`
        );
      } finally {
        setLoading(false);
      }
    };

    if (teamId) {
      loadTeamData();
    }
  }, [teamId]);

  return {
    team,
    clients,
    members,
    loading,
    error,
    formatDate,
    getScoreColor,
    navigateToClientDetail,
  };
};
