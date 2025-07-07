import { Router } from "express";
import * as dashboardController from "../controllers/dashboard.controller";
import {
  authenticateJWT,
  authorizeRoles
} from "../middlewares/auth.middleware";

const router = Router();

router.get(
  "/:id",
  authenticateJWT,
  authorizeRoles("admin", "manager", "user"),
  dashboardController.getUserDashboard
);
export default router;
