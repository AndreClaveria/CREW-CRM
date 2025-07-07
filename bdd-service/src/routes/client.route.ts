import { Router } from "express";
import * as clientController from "../controllers/client.controller";
import {
  authenticateJWT,
  authorizeRoles
} from "../middlewares/auth.middleware";

const router = Router();

// Routes protégées - Nécessitent une authentification
// Récupérer tous les clients
router.get("/", authenticateJWT, clientController.getAllClients);

// Récupérer un client par ID
router.get("/:id", clientController.getClientById);

// Récupérer les clients par entreprise
router.get(
  "/company/:companyId",
  authenticateJWT,
  clientController.getClientsByCompany
);

// Récupérer les clients par équipe
router.get("/team/:teamId", clientController.getClientsByTeam);

// Routes protégées - Nécessitent des droits de manager ou user
// Créer un nouveau client
router.post(
  "/",
  authenticateJWT,
  authorizeRoles("admin", "manager", "user"),
  clientController.createClient
);

// Mettre à jour un client
router.put(
  "/:id",
  authenticateJWT,
  authorizeRoles("admin", "manager", "user"),
  clientController.updateClient
);

// Routes protégées - Nécessitent des droits d'admin ou manager
// Supprimer un client
router.delete(
  "/:id",
  authenticateJWT,
  authorizeRoles("admin", "manager"),
  clientController.deleteClient
);

export default router;
