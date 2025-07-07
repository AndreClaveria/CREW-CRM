import Contact from "../models/contact.model";
import { IContact, IContactInput } from "../types";
import { logger } from "../utils/logger";

export const getAllContacts = async (): Promise<IContact[]> => {
  try {
    return await Contact.find({ isActive: true }).sort({
      lastName: 1,
      firstName: 1
    });
  } catch (error) {
    logger.error("Error fetching all contacts", error);
    throw error;
  }
};

export const getContactById = async (id: string): Promise<IContact | null> => {
  try {
    return await Contact.findById(id);
  } catch (error) {
    logger.error(`Error fetching contact with id ${id}`, error);
    throw error;
  }
};

// src/services/contact.service.ts
// Modifiez la signature de la fonction createContact
export const createContact = async (
  contactData: IContactInput
): Promise<IContact> => {
  try {
    const newContact = new Contact(contactData);
    return await newContact.save();
  } catch (error) {
    logger.error("Error creating new contact", error);
    throw error;
  }
};

export const updateContact = async (
  id: string,
  contactData: Partial<IContact>
): Promise<IContact | null> => {
  try {
    return await Contact.findByIdAndUpdate(id, contactData, { new: true });
  } catch (error) {
    logger.error(`Error updating contact with id ${id}`, error);
    throw error;
  }
};

export const deleteContact = async (id: string): Promise<IContact | null> => {
  try {
    // Soft delete
    return await Contact.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );
  } catch (error) {
    logger.error(`Error deleting contact with id ${id}`, error);
    throw error;
  }
};

export const getContactsByCompany = async (
  companyId: string
): Promise<IContact[]> => {
  try {
    return await Contact.find({ company: companyId, isActive: true }).sort({
      lastName: 1,
      firstName: 1
    });
  } catch (error) {
    logger.error(`Error fetching contacts for company ${companyId}`, error);
    throw error;
  }
};

export const getContactsByClient = async (
  clientId: string
): Promise<IContact[]> => {
  try {
    return await Contact.find({ client: clientId, isActive: true }).sort({
      lastName: 1,
      firstName: 1
    });
  } catch (error) {
    logger.error(`Error fetching contacts for client ${clientId}`, error);
    throw error;
  }
};

export const getContactsByTeam = async (
  teamId: string
): Promise<IContact[]> => {
  try {
    return await Contact.find({ team: teamId, isActive: true }).sort({
      lastName: 1,
      firstName: 1
    });
  } catch (error) {
    logger.error(`Error fetching contacts for team ${teamId}`, error);
    throw error;
  }
};

export const addOpportunityToContact = async (
  contactId: string,
  opportunityId: string
): Promise<IContact | null> => {
  try {
    return await Contact.findByIdAndUpdate(
      contactId,
      { $addToSet: { opportunities: opportunityId } },
      { new: true }
    );
  } catch (error) {
    logger.error(
      `Error adding opportunity ${opportunityId} to contact ${contactId}`,
      error
    );
    throw error;
  }
};

export const removeOpportunityFromContact = async (
  contactId: string,
  opportunityId: string
): Promise<IContact | null> => {
  try {
    return await Contact.findByIdAndUpdate(
      contactId,
      { $pull: { opportunities: opportunityId } },
      { new: true }
    );
  } catch (error) {
    logger.error(
      `Error removing opportunity ${opportunityId} from contact ${contactId}`,
      error
    );
    throw error;
  }
};
