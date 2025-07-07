import { Router } from "express";
import paymentRoutes from "./payment.routes";
const router = Router();

// Add your routes here
router.use("/payments", paymentRoutes);

export default router;
