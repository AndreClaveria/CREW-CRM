import Company from "../models/company.model";
import { ICompany } from "../types";
import { logger } from "../utils/logger";

export const getAllCompanies = async (): Promise<ICompany[]> => {
  try {
    return await Company.find().sort({ name: 1 });
  } catch (error) {
    logger.error("Error fetching all companies", error);
    throw error;
  }
};

export const getCompanyById = async (id: string): Promise<ICompany | null> => {
  try {
    return await Company.findById(id);
  } catch (error) {
    logger.error(`Error fetching company with id ${id}`, error);
    throw error;
  }
};

export const createCompany = async (
  companyData: ICompany
): Promise<ICompany> => {
  try {
    const newCompany = new Company(companyData);
    return await newCompany.save();
  } catch (error) {
    logger.error("Error creating new company", error);
    throw error;
  }
};

export const updateCompany = async (
  id: string,
  companyData: Partial<ICompany>
): Promise<ICompany | null> => {
  try {
    return await Company.findByIdAndUpdate(id, companyData, { new: true });
  } catch (error) {
    logger.error(`Error updating company with id ${id}`, error);
    throw error;
  }
};

export const deleteCompany = async (id: string): Promise<ICompany | null> => {
  try {
    return await Company.findByIdAndDelete(id);
  } catch (error) {
    logger.error(`Error deleting company with id ${id}`, error);
    throw error;
  }
};

export const getCompaniesByOwner = async (
  ownerId: string
): Promise<ICompany[]> => {
  try {
    return await Company.find({ owner: ownerId }).sort({ name: 1 });
  } catch (error) {
    logger.error(`Error fetching companies for owner ${ownerId}`, error);
    throw error;
  }
};

export const addTeamToCompany = async (
  companyId: string,
  teamId: string
): Promise<ICompany | null> => {
  try {
    return await Company.findByIdAndUpdate(
      companyId,
      { $addToSet: { teams: teamId } },
      { new: true }
    );
  } catch (error) {
    logger.error(`Error adding team ${teamId} to company ${companyId}`, error);
    throw error;
  }
};

export const removeTeamFromCompany = async (
  companyId: string,
  teamId: string
): Promise<ICompany | null> => {
  try {
    return await Company.findByIdAndUpdate(
      companyId,
      { $pull: { teams: teamId } },
      { new: true }
    );
  } catch (error) {
    logger.error(
      `Error removing team ${teamId} from company ${companyId}`,
      error
    );
    throw error;
  }
};
