import { Request, Response } from "express";
import * as contactService from "../services/contact.service";
import * as clientService from "../services/client.service";
import { logger } from "../utils/logger";

export const getAllContacts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const contacts = await contactService.getAllContacts();
    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    logger.error("Error in getAllContacts controller", error);
    res.status(500).json({
      success: false,
      error: "Erreur serveur"
    });
  }
};

export const getContactById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const contact = await contactService.getContactById(req.params.id);
    if (!contact) {
      res.status(404).json({
        success: false,
        error: "Contact non trouvé"
      });
      return;
    }
    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    logger.error(
      `Error in getContactById controller for id ${req.params.id}`,
      error
    );
    res.status(500).json({
      success: false,
      error: "Erreur serveur"
    });
  }
};

export const createContact = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const contact = await contactService.createContact(req.body);

    // Ajouter le contact au client si un ID client est fourni
    if (contact.client) {
      await clientService.addContactToClient(
        contact.client,
        contact._id.toString()
      );
    }

    res.status(201).json({
      success: true,
      data: contact
    });
  } catch (error) {
    logger.error("Error in createContact controller", error);
    res.status(500).json({
      success: false,
      error: "Erreur serveur"
    });
  }
};

export const updateContact = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const contact = await contactService.updateContact(req.params.id, req.body);
    if (!contact) {
      res.status(404).json({
        success: false,
        error: "Contact non trouvé"
      });
      return;
    }
    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    logger.error(
      `Error in updateContact controller for id ${req.params.id}`,
      error
    );
    res.status(500).json({
      success: false,
      error: "Erreur serveur"
    });
  }
};

export const deleteContact = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const contact = await contactService.deleteContact(req.params.id);
    if (!contact) {
      res.status(404).json({
        success: false,
        error: "Contact non trouvé"
      });
      return;
    }
    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    logger.error(
      `Error in deleteContact controller for id ${req.params.id}`,
      error
    );
    res.status(500).json({
      success: false,
      error: "Erreur serveur"
    });
  }
};

export const getContactsByCompany = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const contacts = await contactService.getContactsByCompany(
      req.params.companyId
    );
    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    logger.error(
      `Error in getContactsByCompany controller for company ${req.params.companyId}`,
      error
    );
    res.status(500).json({
      success: false,
      error: "Erreur serveur"
    });
  }
};

export const getContactsByClient = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const contacts = await contactService.getContactsByClient(
      req.params.clientId
    );
    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    logger.error(
      `Error in getContactsByClient controller for client ${req.params.clientId}`,
      error
    );
    res.status(500).json({
      success: false,
      error: "Erreur serveur"
    });
  }
};
