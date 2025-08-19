import { Router } from "express";
import * as dealController from "../controllers/deal.controller";
import {
  authenticateJWT,
  authorizeRoles
} from "../middlewares/auth.middleware";

const router = Router();

router.use(authenticateJWT);

router.get("/", dealController.getAllDeals);
router.get("/company/:companyId", dealController.getDealsByCompany);
router.get("/client/:clientId", dealController.getDealsByClient);
router.get("/status/:status", dealController.getDealsByStatus);
router.get("/:id", dealController.getDealById);

router.post(
  "/",
  authorizeRoles("admin", "manager", "user"),
  dealController.createDeal
);
router.put(
  "/:id",
  authorizeRoles("admin", "manager", "user"),
  dealController.updateDeal
);
router.delete(
  "/:id",
  authorizeRoles("admin", "manager", "user"),
  dealController.deleteDeal
);

export default router;
