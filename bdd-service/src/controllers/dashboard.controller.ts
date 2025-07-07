// controllers/dashboard.controller.ts
import { Request, Response } from "express";
import { getUserDashboardData } from "../services/dashboard.service";

export const getUserDashboard = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const token = req.headers.authorization;

    if (!token) {
      res.status(401).json({ message: "Authentication token required" });
      return;
    }

    const dashboardData = await getUserDashboardData(userId, token);
    if (!dashboardData) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(dashboardData);
  } catch (error) {
    console.error("Error fetching user dashboard:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
