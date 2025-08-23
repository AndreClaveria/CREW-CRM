import { Request, Response } from "express";
import * as dealService from "../services/deal.service";
import * as clientService from "../services/client.service";
import * as contactService from "../services/contact.service";
import { logger } from "../utils/logger";

export const getAllDeals = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deals = await dealService.getAllDeals();
    res.status(200).json({ success: true, count: deals.length, data: deals });
  } catch (error) {
    logger.error("Error in getAllDeals controller", error);
    res.status(500).json({ success: false, error: "Erreur serveur" });
  }
};

export const getDealById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deal = await dealService.getDealById(req.params.id);
    if (!deal) {
      res.status(404).json({ success: false, error: "Deal non trouvé" });
      return;
    }
    res.status(200).json({ success: true, data: deal });
  } catch (error) {
    logger.error(`Error in getDealById controller for id ${req.params.id}`);
    res.status(500).json({ success: false, error: "Erreur serveur" });
  }
};

export const createDeal = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deal = await dealService.createDeal(req.body);

    if (deal.client) {
      // Réutilisation de la relation opportunités tant qu'on n'a pas de champ dédié côté client/contacts
      await clientService.addOpportunityToClient(
        deal.client,
        deal._id.toString()
      );
    }

    if (deal.contacts && deal.contacts.length > 0) {
      for (const contactId of deal.contacts) {
        await contactService.addOpportunityToContact(
          contactId,
          deal._id.toString()
        );
      }
    }

    res.status(201).json({ success: true, data: deal });
  } catch (error) {
    logger.error("Error in createDeal controller", error);
    res.status(500).json({ success: false, error: "Erreur serveur" });
  }
};

export const updateDeal = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deal = await dealService.updateDeal(req.params.id, req.body);
    if (!deal) {
      res.status(404).json({ success: false, error: "Deal non trouvé" });
      return;
    }
    res.status(200).json({ success: true, data: deal });
  } catch (error) {
    logger.error(
      `Error in updateDeal controller for id ${req.params.id}`,
      error
    );
    res.status(500).json({ success: false, error: "Erreur serveur" });
  }
};

export const deleteDeal = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deal = await dealService.deleteDeal(req.params.id);
    if (!deal) {
      res.status(404).json({ success: false, error: "Deal non trouvé" });
      return;
    }
    res.status(200).json({ success: true, data: deal });
  } catch (error) {
    logger.error(
      `Error in deleteDeal controller for id ${req.params.id}`,
      error
    );
    res.status(500).json({ success: false, error: "Erreur serveur" });
  }
};

export const getDealsByCompany = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deals = await dealService.getDealsByCompany(req.params.companyId);
    res.status(200).json({ success: true, count: deals.length, data: deals });
  } catch (error) {
    logger.error(
      `Error in getDealsByCompany controller for company ${req.params.companyId}`,
      error
    );
    res.status(500).json({ success: false, error: "Erreur serveur" });
  }
};

export const getDealsByClient = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deals = await dealService.getDealsByClient(req.params.clientId);
    res.status(200).json({ success: true, count: deals.length, data: deals });
  } catch (error) {
    logger.error(
      `Error in getDealsByClient controller for client ${req.params.clientId}`,
      error
    );
    res.status(500).json({ success: false, error: "Erreur serveur" });
  }
};

export const getDealsByStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deals = await dealService.getDealsByStatus(req.params.status);
    res.status(200).json({ success: true, count: deals.length, data: deals });
  } catch (error) {
    logger.error(
      `Error in getDealsByStatus controller for status ${req.params.status}`,
      error
    );
    res.status(500).json({ success: false, error: "Erreur serveur" });
  }
};
