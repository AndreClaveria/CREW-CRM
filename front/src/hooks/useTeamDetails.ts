// src/hooks/useTeamDetails.ts
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getTeamById,
  updateTeam,
  deleteTeam,
  Team,
} from "@/services/team.service";
import { getCompanyById, Company } from "@/services/company.service";
import { getUserById, User } from "@/services/user.service";
import {
  getClientById,
  Client,
  getClientsByCompany,
} from "@/services/client.service";
import { useAuth } from "@/contexts/AuthContext";

interface UseTeamDetailsReturn {
  team: Team | null;
  company: Company | null;
  members: User[];
  clients: Client[];
  isLoading: boolean;
  error: string | null;
  updateTeamDetails: (teamData: Partial<Team>) => Promise<boolean>;
  deleteTeamAndNavigate: () => Promise<boolean>;
  navigateToCompany: () => void;
  navigateToMember: (userId: string) => void;
  navigateToClient: (clientId: string) => void;
  navigateToMembersManagement: () => void;
  navigateToClientsManagement: () => void;
}

export const useTeamDetails = (teamId: string): UseTeamDetailsReturn => {
  const [team, setTeam] = useState<Team | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [members, setMembers] = useState<User[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { user } = useAuth();

  // Base route pour la navigation
  const getBaseRoute = () => {
    return `/dashboard/pipeline`;
  };

  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Récupérer les détails de l'équipe
        const teamData = await getTeamById(teamId);
        if (!teamData) {
          throw new Error("Équipe non trouvée");
        }
        setTeam(teamData);

        // Récupérer les détails de l'entreprise associée
        if (teamData.company) {
          try {
            const companyData = await getCompanyById(teamData.company);
            setCompany(companyData);
          } catch (err) {
            console.error(
              "Erreur lors de la récupération de l'entreprise:",
              err
            );
          }
        }

        // Récupérer les membres de l'équipe
        if (teamData.members && Array.isArray(teamData.members)) {
          try {
            const memberPromises = teamData.members.map(async (memberId) => {
              // Si le membre est déjà un objet User, le retourner directement
              if (typeof memberId !== "string" && memberId._id) {
                return memberId;
              }

              // Sinon, récupérer les détails de l'utilisateur par son ID
              try {
                const memberString =
                  typeof memberId === "string" ? memberId : memberId._id;
                return await getUserById(memberString);
              } catch (memberErr) {
                console.error(
                  `Erreur lors de la récupération du membre ${memberId}:`,
                  memberErr
                );
                return null;
              }
            });

            const membersResults = await Promise.all(memberPromises);
            // Filtrer les membres null (en cas d'erreur dans la récupération)
            setMembers(
              membersResults.filter((member) => member !== null) as User[]
            );
          } catch (err) {
            console.error("Erreur lors de la récupération des membres:", err);
            setMembers([]);
          }
        }

        // Récupérer les clients associés à l'équipe (via la liste des clients de l'entreprise)
        if (teamData.company) {
          try {
            // Récupérer tous les clients de l'entreprise
            const allCompanyClients = await getClientsByCompany(
              teamData.company
            );

            // Filtrer les clients qui ont cette équipe assignée
            const teamClients = allCompanyClients.filter(
              (client) => client.team && client.team === teamId
            );

            setClients(teamClients);
          } catch (err) {
            console.error("Erreur lors de la récupération des clients:", err);
            setClients([]);
          }
        }
      } catch (err) {
        console.error(
          "Erreur lors du chargement des détails de l'équipe:",
          err
        );
        setError("Impossible de charger les détails de l'équipe");
      } finally {
        setIsLoading(false);
      }
    };

    if (teamId) {
      fetchTeamDetails();
    }
  }, [teamId]);

  const updateTeamDetails = async (
    teamData: Partial<Team>
  ): Promise<boolean> => {
    if (!team) return false;

    try {
      setIsLoading(true);
      const updatedTeam = await updateTeam(teamId, teamData);

      if (updatedTeam) {
        setTeam(updatedTeam);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Erreur lors de la mise à jour de l'équipe:", err);
      setError("Impossible de mettre à jour l'équipe");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTeamAndNavigate = async (): Promise<boolean> => {
    if (!team || !company) return false;

    try {
      setIsLoading(true);
      await deleteTeam(teamId);
      router.push(`${getBaseRoute()}/teams?company=${company._id}`);
      return true;
    } catch (err) {
      console.error("Erreur lors de la suppression de l'équipe:", err);
      setError("Impossible de supprimer l'équipe");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToCompany = () => {
    if (company) {
      router.push(`${getBaseRoute()}/company/${company._id}`);
    }
  };

  const navigateToMember = (userId: string) => {
    router.push(`${getBaseRoute()}/user/${userId}`);
  };

  const navigateToClient = (clientId: string) => {
    router.push(`${getBaseRoute()}/client/${clientId}`);
  };

  const navigateToMembersManagement = () => {
    router.push(`${getBaseRoute()}/team/${teamId}/members`);
  };

  const navigateToClientsManagement = () => {
    if (company) {
      router.push(`${getBaseRoute()}/clients?company=${company._id}`);
    }
  };

  return {
    team,
    company,
    members,
    clients,
    isLoading,
    error,
    updateTeamDetails,
    deleteTeamAndNavigate,
    navigateToCompany,
    navigateToMember,
    navigateToClient,
    navigateToMembersManagement,
    navigateToClientsManagement,
  };
};
