import { Request, Response } from "express";
import * as companyService from "../services/company.service";
import { logger } from "../utils/logger";

export const getAllCompanies = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const companies = await companyService.getAllCompanies();
    res.status(200).json(companies);
  } catch (error) {
    logger.error("Error in getAllCompanies controller", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des entreprises" });
  }
};

export const getCompanyById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const company = await companyService.getCompanyById(req.params.id);
    if (!company) {
      res.status(404).json({ message: "Entreprise non trouvée" });
      return;
    }
    res.status(200).json(company);
  } catch (error) {
    logger.error(
      `Error in getCompanyById controller for id ${req.params.id}`,
      error
    );
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération de l'entreprise" });
  }
};

export const createCompany = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const newCompany = await companyService.createCompany(req.body);
    res.status(201).json(newCompany);
  } catch (error) {
    logger.error("Error in createCompany controller", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la création de l'entreprise" });
  }
};

export const updateCompany = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const updatedCompany = await companyService.updateCompany(
      req.params.id,
      req.body
    );
    if (!updatedCompany) {
      res.status(404).json({ message: "Entreprise non trouvée" });
      return;
    }
    res.status(200).json(updatedCompany);
  } catch (error) {
    logger.error(
      `Error in updateCompany controller for id ${req.params.id}`,
      error
    );
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour de l'entreprise" });
  }
};

export const deleteCompany = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deletedCompany = await companyService.deleteCompany(req.params.id);
    if (!deletedCompany) {
      res.status(404).json({ message: "Entreprise non trouvée" });
      return;
    }
    res.status(200).json({ message: "Entreprise supprimée avec succès" });
  } catch (error) {
    logger.error(
      `Error in deleteCompany controller for id ${req.params.id}`,
      error
    );
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression de l'entreprise" });
  }
};

export const getCompaniesByOwner = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const ownerId = req.params.ownerId;
    const companies = await companyService.getCompaniesByOwner(ownerId);
    res.status(200).json(companies);
  } catch (error) {
    logger.error(
      `Error in getCompaniesByOwner controller for owner ${req.params.ownerId}`,
      error
    );
    res
      .status(500)
      .json({
        message:
          "Erreur lors de la récupération des entreprises du propriétaire"
      });
  }
};

export const addTeamToCompany = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { companyId, teamId } = req.params;
    const updatedCompany = await companyService.addTeamToCompany(
      companyId,
      teamId
    );
    if (!updatedCompany) {
      res.status(404).json({ message: "Entreprise non trouvée" });
      return;
    }
    res.status(200).json(updatedCompany);
  } catch (error) {
    logger.error(
      `Error in addTeamToCompany controller for company ${req.params.companyId} and team ${req.params.teamId}`,
      error
    );
    res
      .status(500)
      .json({ message: "Erreur lors de l'ajout de l'équipe à l'entreprise" });
  }
};

export const removeTeamFromCompany = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { companyId, teamId } = req.params;
    const updatedCompany = await companyService.removeTeamFromCompany(
      companyId,
      teamId
    );
    if (!updatedCompany) {
      res.status(404).json({ message: "Entreprise non trouvée" });
      return;
    }
    res.status(200).json(updatedCompany);
  } catch (error) {
    logger.error(
      `Error in removeTeamFromCompany controller for company ${req.params.companyId} and team ${req.params.teamId}`,
      error
    );
    res
      .status(500)
      .json({ message: "Erreur lors du retrait de l'équipe de l'entreprise" });
  }
};
