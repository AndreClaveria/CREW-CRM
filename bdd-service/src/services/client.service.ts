import Client from "../models/client.model";
import { IClient, IClientInput } from "../types";
import { logger } from "../utils/logger";

export const getAllClients = async (): Promise<IClient[]> => {
  try {
    return await Client.find({ isActive: true }).sort({ name: 1 });
  } catch (error) {
    logger.error("Error fetching all clients", error);
    throw error;
  }
};

export const getClientById = async (id: string): Promise<IClient | null> => {
  try {
    return await Client.findById(id);
  } catch (error) {
    logger.error(`Error fetching client with id ${id}`, error);
    throw error;
  }
};

export const createClient = async (
  clientData: IClientInput
): Promise<IClient> => {
  try {
    const newClient = new Client(clientData);
    return await newClient.save();
  } catch (error) {
    logger.error("Error creating new client", error);
    throw error;
  }
};
export const updateClient = async (
  id: string,
  clientData: Partial<IClient>
): Promise<IClient | null> => {
  try {
    return await Client.findByIdAndUpdate(id, clientData, { new: true });
  } catch (error) {
    logger.error(`Error updating client with id ${id}`, error);
    throw error;
  }
};

export const deleteClient = async (id: string): Promise<IClient | null> => {
  try {
    // Soft delete - conserve l'entrée mais marque comme inactif
    return await Client.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );
  } catch (error) {
    logger.error(`Error deleting client with id ${id}`, error);
    throw error;
  }
};

export const getClientsByCompany = async (
  companyId: string
): Promise<IClient[]> => {
  try {
    return await Client.find({ company: companyId, isActive: true }).sort({
      name: 1
    });
  } catch (error) {
    logger.error(`Error fetching clients for company ${companyId}`, error);
    throw error;
  }
};

export const getClientsByTeam = async (teamId: string): Promise<IClient[]> => {
  try {
    return await Client.find({ team: teamId, isActive: true }).sort({
      name: 1
    });
  } catch (error) {
    logger.error(`Error fetching clients for team ${teamId}`, error);
    throw error;
  }
};

export const addContactToClient = async (
  clientId: string,
  contactId: string
): Promise<IClient | null> => {
  try {
    return await Client.findByIdAndUpdate(
      clientId,
      { $addToSet: { contacts: contactId } },
      { new: true }
    );
  } catch (error) {
    logger.error(
      `Error adding contact ${contactId} to client ${clientId}`,
      error
    );
    throw error;
  }
};

export const removeContactFromClient = async (
  clientId: string,
  contactId: string
): Promise<IClient | null> => {
  try {
    return await Client.findByIdAndUpdate(
      clientId,
      { $pull: { contacts: contactId } },
      { new: true }
    );
  } catch (error) {
    logger.error(
      `Error removing contact ${contactId} from client ${clientId}`,
      error
    );
    throw error;
  }
};

export const addOpportunityToClient = async (
  clientId: string,
  opportunityId: string
): Promise<IClient | null> => {
  try {
    return await Client.findByIdAndUpdate(
      clientId,
      { $addToSet: { opportunities: opportunityId } },
      { new: true }
    );
  } catch (error) {
    logger.error(
      `Error adding opportunity ${opportunityId} to client ${clientId}`,
      error
    );
    throw error;
  }
};

export const removeOpportunityFromClient = async (
  clientId: string,
  opportunityId: string
): Promise<IClient | null> => {
  try {
    return await Client.findByIdAndUpdate(
      clientId,
      { $pull: { opportunities: opportunityId } },
      { new: true }
    );
  } catch (error) {
    logger.error(
      `Error removing opportunity ${opportunityId} from client ${clientId}`,
      error
    );
    throw error;
  }
};
