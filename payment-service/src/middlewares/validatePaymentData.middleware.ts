// src/middlewares/validatePaymentData.ts
import { Request, Response, NextFunction } from "express";

export function validatePaymentData(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { amount, currency } = req.body;
  if (!amount || typeof amount !== "number" || amount <= 0 || amount > 999999) {
    return res.status(400).json({
      success: false,
      message: "Montant invalide (entre 1 et 999999)"
    });
  }
  if (!["eur", "usd", "gbp"].includes(currency)) {
    return res
      .status(400)
      .json({ success: false, message: "Devise non supportée" });
  }
  next();
}
