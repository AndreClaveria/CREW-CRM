import { Router } from "express";
import * as opportunityController from "../controllers/opportunity.controller";
import {
  authenticateJWT,
  authorizeRoles
} from "../middlewares/auth.middleware";

const router = Router();

// Toutes les routes protégées par l'authentification JWT
router.use(authenticateJWT);

// Routes publiques pour tous les utilisateurs authentifiés
router.get("/", opportunityController.getAllOpportunities);
router.get(
  "/company/:companyId",
  opportunityController.getOpportunitiesByCompany
);
router.get("/client/:clientId", opportunityController.getOpportunitiesByClient);
router.get("/status/:status", opportunityController.getOpportunitiesByStatus);
router.get("/:id", opportunityController.getOpportunityById);

// Routes protégées pour les rôles spécifiques
router.post(
  "/",
  authorizeRoles("admin", "manager", "user"),
  opportunityController.createOpportunity
);
router.put(
  "/:id",
  authorizeRoles("admin", "manager", "user"),
  opportunityController.updateOpportunity
);
router.delete(
  "/:id",
  authorizeRoles("admin", "manager", "user"),
  opportunityController.deleteOpportunity
);
router.post(
  "/:opportunityId/contacts/:contactId",
  authorizeRoles("admin", "manager", "user"),
  opportunityController.addContactToOpportunity
);

export default router;
