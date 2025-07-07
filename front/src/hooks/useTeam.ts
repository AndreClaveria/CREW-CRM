// src/hooks/useTeam.ts
import { useState, useEffect } from "react";
import {
  getTeamsByCompany,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
  addMemberToTeam,
  removeMemberFromTeam,
  setTeamLeader,
  Team,
} from "@/services/team.service";

interface UseTeamProps {
  companyId?: string;
  teamId?: string;
}

interface UseTeamReturn {
  teams: Team[];
  team: Team | null;
  isLoading: boolean;
  error: string | null;
  loadTeams: (companyId: string) => Promise<void>;
  loadTeam: (teamId: string) => Promise<void>;
  createNewTeam: (teamData: Partial<Team>) => Promise<Team | null>;
  updateTeamData: (teamId: string, teamData: Partial<Team>) => Promise<boolean>;
  deleteTeamById: (teamId: string) => Promise<boolean>;
  addMember: (teamId: string, userId: string) => Promise<boolean>;
  removeMember: (teamId: string, userId: string) => Promise<boolean>;
  setLeader: (teamId: string, userId: string) => Promise<boolean>;
  resetError: () => void;
}

export const useTeam = ({
  companyId,
  teamId,
}: UseTeamProps = {}): UseTeamReturn => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [team, setTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour réinitialiser les erreurs
  const resetError = () => setError(null);

  // Charger toutes les équipes d'une entreprise
  const loadTeams = async (companyId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log(
        "Début de la récupération des équipes pour l'entreprise:",
        companyId
      );
      const teamsData = await getTeamsByCompany(companyId);
      console.log("Équipes récupérées:", teamsData);

      if (Array.isArray(teamsData)) {
        setTeams(teamsData);
      } else {
        console.error(
          "Les données d'équipe reçues ne sont pas un tableau:",
          teamsData
        );
        setTeams([]);
        setError(
          "Format de données incorrect. Veuillez contacter l'administrateur."
        );
      }
    } catch (err: any) {
      console.error(
        `Erreur lors du chargement des équipes pour l'entreprise ${companyId}:`,
        err
      );
      setError(err.message || "Impossible de charger les équipes");
      setTeams([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Charger une équipe spécifique
  const loadTeam = async (teamId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const teamData = await getTeamById(teamId);
      setTeam(teamData);
    } catch (err: any) {
      console.error(`Erreur lors du chargement de l'équipe ${teamId}:`, err);
      setError(err.message || "Impossible de charger les données de l'équipe");
      setTeam(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Créer une nouvelle équipe
  const createNewTeam = async (
    teamData: Partial<Team>
  ): Promise<Team | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const newTeam = await createTeam(teamData);

      // Mettre à jour la liste locale des équipes
      setTeams((prev) => [...prev, newTeam]);

      return newTeam;
    } catch (err: any) {
      console.error("Erreur lors de la création de l'équipe:", err);
      setError(err.message || "Impossible de créer l'équipe");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Mettre à jour une équipe
  const updateTeamData = async (
    teamId: string,
    teamData: Partial<Team>
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const updatedTeam = await updateTeam(teamId, teamData);

      // Mettre à jour les données locales
      setTeam((prev) => (prev && prev._id === teamId ? updatedTeam : prev));
      setTeams((prev) => prev.map((t) => (t._id === teamId ? updatedTeam : t)));

      return true;
    } catch (err: any) {
      console.error(
        `Erreur lors de la mise à jour de l'équipe ${teamId}:`,
        err
      );
      setError(err.message || "Impossible de mettre à jour l'équipe");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Supprimer une équipe
  const deleteTeamById = async (teamId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await deleteTeam(teamId);

      // Mettre à jour les données locales
      setTeams((prev) => prev.filter((t) => t._id !== teamId));
      if (team && team._id === teamId) {
        setTeam(null);
      }

      return true;
    } catch (err: any) {
      console.error(
        `Erreur lors de la suppression de l'équipe ${teamId}:`,
        err
      );
      setError(err.message || "Impossible de supprimer l'équipe");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Ajouter un membre à l'équipe
  const addMember = async (
    teamId: string,
    userId: string
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const updatedTeam = await addMemberToTeam(teamId, userId);

      // Mettre à jour les données locales
      setTeam((prev) => (prev && prev._id === teamId ? updatedTeam : prev));
      setTeams((prev) => prev.map((t) => (t._id === teamId ? updatedTeam : t)));

      return true;
    } catch (err: any) {
      console.error(
        `Erreur lors de l'ajout du membre ${userId} à l'équipe ${teamId}:`,
        err
      );
      setError(err.message || "Impossible d'ajouter le membre à l'équipe");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Retirer un membre de l'équipe
  const removeMember = async (
    teamId: string,
    userId: string
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const updatedTeam = await removeMemberFromTeam(teamId, userId);

      // Mettre à jour les données locales
      setTeam((prev) => (prev && prev._id === teamId ? updatedTeam : prev));
      setTeams((prev) => prev.map((t) => (t._id === teamId ? updatedTeam : t)));

      return true;
    } catch (err: any) {
      console.error(
        `Erreur lors du retrait du membre ${userId} de l'équipe ${teamId}:`,
        err
      );
      setError(err.message || "Impossible de retirer le membre de l'équipe");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Définir le leader de l'équipe
  const setLeader = async (
    teamId: string,
    userId: string
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const updatedTeam = await setTeamLeader(teamId, userId);

      // Mettre à jour les données locales
      setTeam((prev) => (prev && prev._id === teamId ? updatedTeam : prev));
      setTeams((prev) => prev.map((t) => (t._id === teamId ? updatedTeam : t)));

      return true;
    } catch (err: any) {
      console.error(
        `Erreur lors de la définition du leader ${userId} pour l'équipe ${teamId}:`,
        err
      );
      setError(err.message || "Impossible de définir le leader de l'équipe");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Chargement initial si l'ID de l'entreprise ou de l'équipe est fourni
  useEffect(() => {
    if (companyId) {
      loadTeams(companyId);
    }

    if (teamId) {
      loadTeam(teamId);
    }
  }, [companyId, teamId]);

  return {
    teams,
    team,
    isLoading,
    error,
    loadTeams,
    loadTeam,
    createNewTeam,
    updateTeamData,
    deleteTeamById,
    addMember,
    removeMember,
    setLeader,
    resetError,
  };
};
