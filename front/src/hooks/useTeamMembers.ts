// hooks/useTeamMembers.ts
import { useState, useEffect } from "react";
import {
  getTeamById,
  addMemberToTeam,
  removeMemberFromTeam,
  Team,
} from "@/services/team.service";
import { getCompanyById, Company } from "@/services/company.service";
import { getAllUsers, User } from "@/services/user.service";

interface UseTeamMembersProps {
  companyId: string;
  teamId: string;
  setLoadingWithMessage: (loading: boolean, message?: string) => void;
}

export const useTeamMembers = ({
  companyId,
  teamId,
  setLoadingWithMessage,
}: UseTeamMembersProps) => {
  const [company, setCompany] = useState<Company | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Fonction pour vérifier si les paramètres sont valides
  const areParamsValid = () => {
    if (!companyId) {
      setError("ID de l'entreprise manquant");
      return false;
    }
    if (!teamId) {
      setError("ID de l'équipe manquant");
      return false;
    }
    return true;
  };

  // Chargement des données initiales
  const loadTeamData = async () => {
    if (!areParamsValid()) return;

    setIsLoadingData(true);
    try {
      // Récupérer les données de l'entreprise
      const companyData = await getCompanyById(companyId);
      setCompany(companyData);

      // Récupérer les données de l'équipe
      const teamData = await getTeamById(teamId);
      setTeam(teamData);

      // Récupérer tous les utilisateurs
      const usersData = await getAllUsers();

      // Si les membres de l'équipe sont des IDs, récupérer les objets User correspondants
      let memberIds: string[] = [];
      if (teamData.members) {
        if (typeof teamData.members[0] === "string") {
          memberIds = teamData.members as string[];
        } else {
          memberIds = (teamData.members as User[]).map((member) => member._id);
        }
      }

      // Filtrer les utilisateurs qui sont membres
      const teamMembersArray = usersData.filter((user) =>
        memberIds.includes(user._id)
      );
      setTeamMembers(teamMembersArray);

      // Filtrer les utilisateurs qui ne sont pas déjà membres
      const availableUsersArray = usersData.filter(
        (user) => !memberIds.includes(user._id)
      );
      setAvailableUsers(availableUsersArray);

      setError(null);
    } catch (err: any) {
      console.error("Erreur lors de la récupération des données:", err);
      setError(`Impossible de charger les données nécessaires: ${err.message}`);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleAddMember = async () => {
    if (!selectedUserId) {
      setError("Veuillez sélectionner un utilisateur à ajouter.");
      return;
    }

    if (!teamId) {
      setError("ID de l'équipe manquant");
      return;
    }

    setLoadingWithMessage(true, "Ajout du membre à l'équipe...");
    try {
      await addMemberToTeam(teamId, selectedUserId);

      // Mettre à jour les listes d'utilisateurs
      const selectedUser = availableUsers.find((u) => u._id === selectedUserId);
      if (selectedUser) {
        setTeamMembers([...teamMembers, selectedUser]);
        setAvailableUsers(
          availableUsers.filter((u) => u._id !== selectedUserId)
        );
      }

      setSelectedUserId("");
      setSuccess("Membre ajouté avec succès");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error("Erreur lors de l'ajout du membre:", err);
      setError("Une erreur est survenue lors de l'ajout du membre");
    } finally {
      setLoadingWithMessage(false);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!teamId) {
      setError("ID de l'équipe manquant");
      return;
    }

    setLoadingWithMessage(true, "Retrait du membre de l'équipe...");
    try {
      await removeMemberFromTeam(teamId, userId);

      // Mettre à jour les listes d'utilisateurs
      const removedUser = teamMembers.find((u) => u._id === userId);
      if (removedUser) {
        setAvailableUsers([...availableUsers, removedUser]);
        setTeamMembers(teamMembers.filter((u) => u._id !== userId));
      }

      setSuccess("Membre retiré avec succès");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error("Erreur lors du retrait du membre:", err);
      setError("Une erreur est survenue lors du retrait du membre");
    } finally {
      setLoadingWithMessage(false);
    }
  };

  return {
    company,
    team,
    availableUsers,
    teamMembers,
    selectedUserId,
    setSelectedUserId,
    error,
    success,
    isLoadingData,
    loadTeamData,
    handleAddMember,
    handleRemoveMember,
    areParamsValid,
  };
};
