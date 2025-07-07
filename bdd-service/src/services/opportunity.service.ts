import Opportunity from "../models/opportunity.model";
import { IOpportunity, IOpportunityInput } from "../types";
import { logger } from "../utils/logger";

export const getAllOpportunities = async (): Promise<IOpportunity[]> => {
  try {
    return await Opportunity.find({ isActive: true }).sort({
      expectedClosingDate: 1
    });
  } catch (error) {
    logger.error("Error fetching all opportunities", error);
    throw error;
  }
};

export const getOpportunityById = async (
  id: string
): Promise<IOpportunity | null> => {
  try {
    return await Opportunity.findById(id);
  } catch (error) {
    logger.error(`Error fetching opportunity with id ${id}`, error);
    throw error;
  }
};

// src/services/opportunity.service.ts
// Modifiez la signature de la fonction createOpportunity
export const createOpportunity = async (
  opportunityData: IOpportunityInput
): Promise<IOpportunity> => {
  try {
    const newOpportunity = new Opportunity(opportunityData);
    return await newOpportunity.save();
  } catch (error) {
    logger.error("Error creating new opportunity", error);
    throw error;
  }
};

export const updateOpportunity = async (
  id: string,
  opportunityData: Partial<IOpportunity>
): Promise<IOpportunity | null> => {
  try {
    return await Opportunity.findByIdAndUpdate(id, opportunityData, {
      new: true
    });
  } catch (error) {
    logger.error(`Error updating opportunity with id ${id}`, error);
    throw error;
  }
};

export const deleteOpportunity = async (
  id: string
): Promise<IOpportunity | null> => {
  try {
    // Soft delete
    return await Opportunity.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );
  } catch (error) {
    logger.error(`Error deleting opportunity with id ${id}`, error);
    throw error;
  }
};

export const getOpportunitiesByCompany = async (
  companyId: string
): Promise<IOpportunity[]> => {
  try {
    return await Opportunity.find({ company: companyId, isActive: true }).sort({
      expectedClosingDate: 1
    });
  } catch (error) {
    logger.error(
      `Error fetching opportunities for company ${companyId}`,
      error
    );
    throw error;
  }
};

export const getOpportunitiesByClient = async (
  clientId: string
): Promise<IOpportunity[]> => {
  try {
    return await Opportunity.find({ client: clientId, isActive: true }).sort({
      expectedClosingDate: 1
    });
  } catch (error) {
    logger.error(`Error fetching opportunities for client ${clientId}`, error);
    throw error;
  }
};

export const getOpportunitiesByTeam = async (
  teamId: string
): Promise<IOpportunity[]> => {
  try {
    return await Opportunity.find({ team: teamId, isActive: true }).sort({
      expectedClosingDate: 1
    });
  } catch (error) {
    logger.error(`Error fetching opportunities for team ${teamId}`, error);
    throw error;
  }
};

export const getOpportunitiesByStatus = async (
  status: string
): Promise<IOpportunity[]> => {
  try {
    return await Opportunity.find({ status, isActive: true }).sort({
      expectedClosingDate: 1
    });
  } catch (error) {
    logger.error(`Error fetching opportunities with status ${status}`, error);
    throw error;
  }
};

export const addContactToOpportunity = async (
  opportunityId: string,
  contactId: string
): Promise<IOpportunity | null> => {
  try {
    return await Opportunity.findByIdAndUpdate(
      opportunityId,
      { $addToSet: { contacts: contactId } },
      { new: true }
    );
  } catch (error) {
    logger.error(
      `Error adding contact ${contactId} to opportunity ${opportunityId}`,
      error
    );
    throw error;
  }
};

export const removeContactFromOpportunity = async (
  opportunityId: string,
  contactId: string
): Promise<IOpportunity | null> => {
  try {
    return await Opportunity.findByIdAndUpdate(
      opportunityId,
      { $pull: { contacts: contactId } },
      { new: true }
    );
  } catch (error) {
    logger.error(
      `Error removing contact ${contactId} from opportunity ${opportunityId}`,
      error
    );
    throw error;
  }
};
