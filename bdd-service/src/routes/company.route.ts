import { Router } from "express";
import * as companyController from "../controllers/company.controller";
import {
  authenticateJWT,
  authorizeRoles
} from "../middlewares/auth.middleware";

const router = Router();

// Routes publiques
// Aucune

// Routes protégées - Nécessitent une authentification
// Récupérer toutes les entreprises
router.get("/", authenticateJWT, companyController.getAllCompanies);

// Récupérer une entreprise par ID
router.get("/:id", authenticateJWT, companyController.getCompanyById);

// Récupérer les entreprises par propriétaire
router.get(
  "/owner/:ownerId",
  authenticateJWT,
  companyController.getCompaniesByOwner
);

// Routes protégées - Nécessitent des droits de manager ou admin
// Créer une nouvelle entreprise

router.post(
  "/",
  authenticateJWT,
  authorizeRoles("admin", "manager"),
  companyController.createCompany
);

// Mettre à jour une entreprise
router.put(
  "/:id",
  authenticateJWT,
  authorizeRoles("admin", "manager"),
  companyController.updateCompany
);

// Ajouter une équipe à une entreprise
router.post(
  "/:companyId/teams/:teamId",
  authenticateJWT,
  authorizeRoles("admin", "manager"),
  companyController.addTeamToCompany
);

// Retirer une équipe d'une entreprise
router.delete(
  "/:companyId/teams/:teamId",
  authenticateJWT,
  authorizeRoles("admin", "manager"),
  companyController.removeTeamFromCompany
);

// Routes protégées - Nécessitent des droits d'admin
// Supprimer une entreprise
router.delete(
  "/:id",
  authenticateJWT,
  authorizeRoles("admin"),
  companyController.deleteCompany
);

export default router;
