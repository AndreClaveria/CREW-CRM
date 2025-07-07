import Team from "../models/team.model";
import { ITeam } from "../types";
import { logger } from "../utils/logger";

export const getAllTeams = async (): Promise<ITeam[]> => {
  try {
    return await Team.find().sort({ name: 1 });
  } catch (error) {
    logger.error("Error fetching all teams", error);
    throw error;
  }
};

export const getTeamById = async (id: string): Promise<ITeam | null> => {
  try {
    return await Team.findById(id);
  } catch (error) {
    logger.error(`Error fetching team with id ${id}`, error);
    throw error;
  }
};

export const createTeam = async (teamData: ITeam): Promise<ITeam> => {
  try {
    const newTeam = new Team(teamData);
    return await newTeam.save();
  } catch (error) {
    logger.error("Error creating new team", error);
    throw error;
  }
};

export const updateTeam = async (
  id: string,
  teamData: Partial<ITeam>
): Promise<ITeam | null> => {
  try {
    return await Team.findByIdAndUpdate(id, teamData, { new: true });
  } catch (error) {
    logger.error(`Error updating team with id ${id}`, error);
    throw error;
  }
};

export const deleteTeam = async (id: string): Promise<ITeam | null> => {
  try {
    return await Team.findByIdAndDelete(id);
  } catch (error) {
    logger.error(`Error deleting team with id ${id}`, error);
    throw error;
  }
};

export const getTeamsByCompany = async (
  companyId: string
): Promise<ITeam[]> => {
  try {
    return await Team.find({ company: companyId }).sort({ name: 1 });
  } catch (error) {
    logger.error(`Error fetching teams for company ${companyId}`, error);
    throw error;
  }
};

export const addMemberToTeam = async (
  teamId: string,
  userId: string
): Promise<ITeam | null> => {
  try {
    return await Team.findByIdAndUpdate(
      teamId,
      { $addToSet: { members: userId } },
      { new: true }
    );
  } catch (error) {
    logger.error(`Error adding member ${userId} to team ${teamId}`, error);
    throw error;
  }
};

export const removeMemberFromTeam = async (
  teamId: string,
  userId: string
): Promise<ITeam | null> => {
  try {
    return await Team.findByIdAndUpdate(
      teamId,
      { $pull: { members: userId } },
      { new: true }
    );
  } catch (error) {
    logger.error(`Error removing member ${userId} from team ${teamId}`, error);
    throw error;
  }
};

export const setTeamLeader = async (
  teamId: string,
  userId: string
): Promise<ITeam | null> => {
  try {
    return await Team.findByIdAndUpdate(
      teamId,
      { leader: userId },
      { new: true }
    );
  } catch (error) {
    logger.error(`Error setting leader ${userId} for team ${teamId}`, error);
    throw error;
  }
};

export const isUserTeamMember = async (
  teamId: string,
  userId: string
): Promise<boolean> => {
  try {
    const team = await Team.findById(teamId);
    return team ? team.members.includes(userId) : false;
  } catch (error) {
    logger.error(
      `Error checking if user ${userId} is member of team ${teamId}`,
      error
    );
    throw error;
  }
};

export const getTeamsByMember = async (userId: string): Promise<ITeam[]> => {
  try {
    return await Team.find({ members: userId }).sort({ name: 1 });
  } catch (error) {
    logger.error(`Error fetching teams for member ${userId}`, error);
    throw error;
  }
};
