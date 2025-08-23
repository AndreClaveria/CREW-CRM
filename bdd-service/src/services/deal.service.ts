import Deal from "../models/deal.model";
import { IDeal, IDealInput } from "../types";
import { logger } from "../utils/logger";

export const getAllDeals = async (): Promise<IDeal[]> => {
  try {
    return await Deal.find({ isActive: true }).sort({ expectedClosingDate: 1 });
  } catch (error) {
    logger.error("Error fetching all deals", error);
    throw error;
  }
};

export const getDealById = async (id: string): Promise<IDeal | null> => {
  try {
    return await Deal.findById(id);
  } catch (error) {
    logger.error(`Error fetching deal with id ${id}`, error);
    throw error;
  }
};

export const createDeal = async (dealData: IDealInput): Promise<IDeal> => {
  try {
    const newDeal = new Deal(dealData);
    return await newDeal.save();
  } catch (error) {
    logger.error("Error creating new deal", error);
    throw error;
  }
};

export const updateDeal = async (
  id: string,
  dealData: Partial<IDeal>
): Promise<IDeal | null> => {
  try {
    return await Deal.findByIdAndUpdate(id, dealData, { new: true });
  } catch (error) {
    logger.error(`Error updating deal with id ${id}`, error);
    throw error;
  }
};

export const deleteDeal = async (id: string): Promise<IDeal | null> => {
  try {
    return await Deal.findByIdAndUpdate(id, { isActive: false }, { new: true });
  } catch (error) {
    logger.error(`Error deleting deal with id ${id}`, error);
    throw error;
  }
};

export const getDealsByCompany = async (
  companyId: string
): Promise<IDeal[]> => {
  try {
    return await Deal.find({ company: companyId, isActive: true }).sort({
      expectedClosingDate: 1
    });
  } catch (error) {
    logger.error(`Error fetching deals for company ${companyId}`, error);
    throw error;
  }
};

export const getDealsByClient = async (clientId: string): Promise<IDeal[]> => {
  try {
    return await Deal.find({ client: clientId, isActive: true }).sort({
      expectedClosingDate: 1
    });
  } catch (error) {
    logger.error(`Error fetching deals for client ${clientId}`, error);
    throw error;
  }
};

export const getDealsByStatus = async (status: string): Promise<IDeal[]> => {
  try {
    return await Deal.find({ status, isActive: true }).sort({
      expectedClosingDate: 1
    });
  } catch (error) {
    logger.error(`Error fetching deals with status ${status}`, error);
    throw error;
  }
};
