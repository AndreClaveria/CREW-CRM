import { Router } from "express";
import clientRoutes from "./client.route";
import contactRoutes from "./contact.route";
import dashboardRoutes from "./dashboard.route";
import opportunityRoutes from "./opportunity.route";
import companyRoutes from "./company.route";
import teamRoutes from "./team.route";
const router = Router();

// Add your routes here
router.use("/clients", clientRoutes);
router.use("/companies", companyRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/teams", teamRoutes);
router.use("/contacts", contactRoutes);
router.use("/opportunities", opportunityRoutes);

export default router;
