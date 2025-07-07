import { Router } from "express";
import * as teamController from "../controllers/team.controller";
import {
  authenticateJWT,
  authorizeRoles
} from "../middlewares/auth.middleware";

const router = Router();


// Routes protégées - Nécessitent une authentification
// Récupérer toutes les équipes
router.get("/", authenticateJWT, teamController.getAllTeams);

// Récupérer une équipe par ID
router.get("/:id", authenticateJWT, teamController.getTeamById);

// Récupérer les équipes d'une entreprise
router.get(
  "/company/:companyId",
  authenticateJWT,
  teamController.getTeamsByCompany
);

// Vérifier si un utilisateur est membre d'une équipe
router.get(
  "/:teamId/members/:userId/check",
  authenticateJWT,
  teamController.isUserTeamMember
);

// Routes protégées - Nécessitent des droits de manager ou admin
// Créer une nouvelle équipe
router.post(
  "/",
  authenticateJWT,
  authorizeRoles("admin", "manager"),
  teamController.createTeam
);

// Mettre à jour une équipe
router.put(
  "/:id",
  authenticateJWT,
  authorizeRoles("admin", "manager"),
  teamController.updateTeam
);

// Ajouter un membre à une équipe
router.post(
  "/:teamId/members/:userId",
  authenticateJWT,
  authorizeRoles("admin", "manager"),
  teamController.addMemberToTeam
);

// Définir le leader d'une équipe
router.put(
  "/:teamId/leader/:userId",
  authenticateJWT,
  authorizeRoles("admin", "manager"),
  teamController.setTeamLeader
);

// Retirer un membre d'une équipe
router.delete(
  "/:teamId/members/:userId",
  authenticateJWT,
  authorizeRoles("admin", "manager"),
  teamController.removeMemberFromTeam
);

// Routes protégées - Nécessitent des droits d'admin
// Supprimer une équipe
router.delete(
  "/:id",
  authenticateJWT,
  authorizeRoles("admin"),
  teamController.deleteTeam
);

export default router;
