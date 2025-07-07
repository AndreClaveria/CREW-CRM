import { Request, Response } from "express";
import * as opportunityService from "../services/opportunity.service";
import * as clientService from "../services/client.service";
import * as contactService from "../services/contact.service";
import { logger } from "../utils/logger";

export const getAllOpportunities = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const opportunities = await opportunityService.getAllOpportunities();
    res.status(200).json({
      success: true,
      count: opportunities.length,
      data: opportunities
    });
  } catch (error) {
    logger.error("Error in getAllOpportunities controller", error);
    res.status(500).json({
      success: false,
      error: "Erreur serveur"
    });
  }
};

export const getOpportunityById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const opportunity = await opportunityService.getOpportunityById(
      req.params.id
    );
    if (!opportunity) {
      res.status(404).json({
        success: false,
        error: "Opportunité non trouvée"
      });
      return;
    }
    res.status(200).json({
      success: true,
      data: opportunity
    });
  } catch (error) {
    logger.error(
      `Error in getOpportunityById controller for id ${req.params.id}`,
      error
    );
    res.status(500).json({
      success: false,
      error: "Erreur serveur"
    });
  }
};

export const createOpportunity = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const opportunity = await opportunityService.createOpportunity(req.body);

    // Ajouter l'opportunité au client
    if (opportunity.client) {
      await clientService.addOpportunityToClient(
        opportunity.client,
        opportunity._id.toString()
      );
    }

    // Ajouter l'opportunité aux contacts
    if (opportunity.contacts && opportunity.contacts.length > 0) {
      for (const contactId of opportunity.contacts) {
        await contactService.addOpportunityToContact(
          contactId,
          opportunity._id.toString()
        );
      }
    }

    res.status(201).json({
      success: true,
      data: opportunity
    });
  } catch (error) {
    logger.error("Error in createOpportunity controller", error);
    res.status(500).json({
      success: false,
      error: "Erreur serveur"
    });
  }
};

export const updateOpportunity = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const opportunity = await opportunityService.updateOpportunity(
      req.params.id,
      req.body
    );
    if (!opportunity) {
      res.status(404).json({
        success: false,
        error: "Opportunité non trouvée"
      });
      return;
    }
    res.status(200).json({
      success: true,
      data: opportunity
    });
  } catch (error) {
    logger.error(
      `Error in updateOpportunity controller for id ${req.params.id}`,
      error
    );
    res.status(500).json({
      success: false,
      error: "Erreur serveur"
    });
  }
};

export const deleteOpportunity = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const opportunity = await opportunityService.deleteOpportunity(
      req.params.id
    );
    if (!opportunity) {
      res.status(404).json({
        success: false,
        error: "Opportunité non trouvée"
      });
      return;
    }
    res.status(200).json({
      success: true,
      data: opportunity
    });
  } catch (error) {
    logger.error(
      `Error in deleteOpportunity controller for id ${req.params.id}`,
      error
    );
    res.status(500).json({
      success: false,
      error: "Erreur serveur"
    });
  }
};

export const getOpportunitiesByCompany = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const opportunities = await opportunityService.getOpportunitiesByCompany(
      req.params.companyId
    );
    res.status(200).json({
      success: true,
      count: opportunities.length,
      data: opportunities
    });
  } catch (error) {
    logger.error(
      `Error in getOpportunitiesByCompany controller for company ${req.params.companyId}`,
      error
    );
    res.status(500).json({
      success: false,
      error: "Erreur serveur"
    });
  }
};

export const getOpportunitiesByClient = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const opportunities = await opportunityService.getOpportunitiesByClient(
      req.params.clientId
    );
    res.status(200).json({
      success: true,
      count: opportunities.length,
      data: opportunities
    });
  } catch (error) {
    logger.error(
      `Error in getOpportunitiesByClient controller for client ${req.params.clientId}`,
      error
    );
    res.status(500).json({
      success: false,
      error: "Erreur serveur"
    });
  }
};

export const getOpportunitiesByStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const opportunities = await opportunityService.getOpportunitiesByStatus(
      req.params.status
    );
    res.status(200).json({
      success: true,
      count: opportunities.length,
      data: opportunities
    });
  } catch (error) {
    logger.error(
      `Error in getOpportunitiesByStatus controller for status ${req.params.status}`,
      error
    );
    res.status(500).json({
      success: false,
      error: "Erreur serveur"
    });
  }
};

export const addContactToOpportunity = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { opportunityId, contactId } = req.params;

    // Ajouter le contact à l'opportunité
    const opportunity = await opportunityService.addContactToOpportunity(
      opportunityId,
      contactId
    );
    if (!opportunity) {
      res.status(404).json({
        success: false,
        error: "Opportunité non trouvée"
      });
      return;
    }

    // Ajouter l'opportunité au contact
    await contactService.addOpportunityToContact(contactId, opportunityId);

    res.status(200).json({
      success: true,
      data: opportunity
    });
  } catch (error) {
    logger.error(
      `Error in addContactToOpportunity controller for opportunity ${req.params.opportunityId} and contact ${req.params.contactId}`,
      error
    );
    res.status(500).json({
      success: false,
      error: "Erreur serveur"
    });
  }
};
