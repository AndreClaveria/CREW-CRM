import { Router } from "express";
import { PaymentController } from "../controllers/paymentController";
import {
  authenticateJWT,
  authorizeRoles
} from "../middlewares/authenticateToken.middleware";
import { validatePaymentData } from "../middlewares/validatePaymentData.middleware";

const router = Router();
const paymentController = new PaymentController();

router.use(authenticateJWT);
router.post(
  "/create-payment-session",
  validatePaymentData,
  paymentController.createPaymentSession.bind(paymentController)
);
router.post(
  "/create-payment-intent",
  validatePaymentData,
  paymentController.createPaymentIntent.bind(paymentController)
);
router.post(
  "/refund",

  paymentController.createRefund.bind(paymentController)
);
router.post(
  "/webhook",
  paymentController.handleWebhook.bind(paymentController)
);
router.get(
  "/customer/:customerId/payments",

  paymentController.getCustomerPayments.bind(paymentController)
);

export default router;
