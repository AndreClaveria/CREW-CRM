import { Request, Response } from "express";
import * as teamService from "../services/team.service";
import { logger } from "../utils/logger";

export const getAllTeams = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const teams = await teamService.getAllTeams();
    res.status(200).json(teams);
  } catch (error) {
    logger.error("Error in getAllTeams controller", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des équipes" });
  }
};

export const getTeamById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const team = await teamService.getTeamById(req.params.id);
    if (!team) {
      res.status(404).json({ message: "Équipe non trouvée" });
      return;
    }
    res.status(200).json(team);
  } catch (error) {
    logger.error(
      `Error in getTeamById controller for id ${req.params.id}`,
      error
    );
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération de l'équipe" });
  }
};

export const createTeam = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const newTeam = await teamService.createTeam(req.body);
    res.status(201).json(newTeam);
  } catch (error) {
    logger.error("Error in createTeam controller", error);
    res.status(500).json({ message: "Erreur lors de la création de l'équipe" });
  }
};

export const updateTeam = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const updatedTeam = await teamService.updateTeam(req.params.id, req.body);
    if (!updatedTeam) {
      res.status(404).json({ message: "Équipe non trouvée" });
      return;
    }
    res.status(200).json(updatedTeam);
  } catch (error) {
    logger.error(
      `Error in updateTeam controller for id ${req.params.id}`,
      error
    );
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour de l'équipe" });
  }
};

export const deleteTeam = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deletedTeam = await teamService.deleteTeam(req.params.id);
    if (!deletedTeam) {
      res.status(404).json({ message: "Équipe non trouvée" });
      return;
    }
    res.status(200).json({ message: "Équipe supprimée avec succès" });
  } catch (error) {
    logger.error(
      `Error in deleteTeam controller for id ${req.params.id}`,
      error
    );
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression de l'équipe" });
  }
};

export const getTeamsByCompany = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const companyId = req.params.companyId;
    const teams = await teamService.getTeamsByCompany(companyId);
    res.status(200).json(teams);
  } catch (error) {
    logger.error(
      `Error in getTeamsByCompany controller for company ${req.params.companyId}`,
      error
    );
    res.status(500).json({
      message: "Erreur lors de la récupération des équipes de l'entreprise"
    });
  }
};

export const addMemberToTeam = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { teamId, userId } = req.params;
    const updatedTeam = await teamService.addMemberToTeam(teamId, userId);
    if (!updatedTeam) {
      res.status(404).json({ message: "Équipe non trouvée" });
      return;
    }
    res.status(200).json(updatedTeam);
  } catch (error) {
    logger.error(
      `Error in addMemberToTeam controller for team ${req.params.teamId} and user ${req.params.userId}`,
      error
    );
    res
      .status(500)
      .json({ message: "Erreur lors de l'ajout du membre à l'équipe" });
  }
};

export const removeMemberFromTeam = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { teamId, userId } = req.params;
    const updatedTeam = await teamService.removeMemberFromTeam(teamId, userId);
    if (!updatedTeam) {
      res.status(404).json({ message: "Équipe non trouvée" });
      return;
    }
    res.status(200).json(updatedTeam);
  } catch (error) {
    logger.error(
      `Error in removeMemberFromTeam controller for team ${req.params.teamId} and user ${req.params.userId}`,
      error
    );
    res
      .status(500)
      .json({ message: "Erreur lors du retrait du membre de l'équipe" });
  }
};

export const setTeamLeader = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { teamId, userId } = req.params;
    const updatedTeam = await teamService.setTeamLeader(teamId, userId);
    if (!updatedTeam) {
      res.status(404).json({ message: "Équipe non trouvée" });
      return;
    }
    res.status(200).json(updatedTeam);
  } catch (error) {
    logger.error(
      `Error in setTeamLeader controller for team ${req.params.teamId} and user ${req.params.userId}`,
      error
    );
    res
      .status(500)
      .json({ message: "Erreur lors de la définition du chef d'équipe" });
  }
};

export const isUserTeamMember = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { teamId, userId } = req.params;
    const isMember = await teamService.isUserTeamMember(teamId, userId);
    res.status(200).json({ isMember });
  } catch (error) {
    logger.error(
      `Error in isUserTeamMember controller for team ${req.params.teamId} and user ${req.params.userId}`,
      error
    );
    res.status(500).json({
      message: "Erreur lors de la vérification de l'appartenance à l'équipe"
    });
  }
};
