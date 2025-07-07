import { Router } from "express";
import * as contactController from "../controllers/contact.controller";
import {
  authenticateJWT,
  authorizeRoles
} from "../middlewares/auth.middleware";

const router = Router();

// Routes protégées - Nécessitent une authentification
// Récupérer tous les contacts
router.get("/", authenticateJWT, contactController.getAllContacts);

// Récupérer un contact par ID
router.get("/:id", authenticateJWT, contactController.getContactById);

// Récupérer les contacts par entreprise
router.get(
  "/company/:companyId",
  authenticateJWT,
  contactController.getContactsByCompany
);

// Récupérer les contacts par client
router.get(
  "/client/:clientId",
  authenticateJWT,
  contactController.getContactsByClient
);

// Routes protégées - Nécessitent des droits de manager ou user
// Créer un nouveau contact
router.post(
  "/",
  authenticateJWT,
  authorizeRoles("admin", "manager", "user"),
  contactController.createContact
);

// Mettre à jour un contact
router.put(
  "/:id",
  authenticateJWT,
  authorizeRoles("admin", "manager", "user"),
  contactController.updateContact
);

// Routes protégées - Nécessitent des droits d'admin ou manager
// Supprimer un contact
router.delete(
  "/:id",
  authenticateJWT,
  authorizeRoles("admin", "manager"),
  contactController.deleteContact
);

export default router;
