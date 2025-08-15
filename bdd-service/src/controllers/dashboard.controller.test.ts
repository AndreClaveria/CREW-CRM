// MOCKS EN PREMIER
jest.mock("../config", () => ({
  __esModule: true,
  default: {
    jwt: { secret: "test-secret", expiresIn: "6h" },
    logging: { level: "info" },
    database: { mongoUri: "mongodb://test" },
    server: { notification_url: "http://test-url" }
  }
}));

jest.mock("../services/dashboard.service");

import { Request, Response } from "express";
import { getUserDashboard } from "../controllers/dashboard.controller";
import { getUserDashboardData } from "../services/dashboard.service";

describe("DashboardController", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockReq = {
      body: {},
      params: {},
      headers: {}
    };
    mockRes = { status: mockStatus, json: mockJson };

    // Mock console.error pour les tests
    consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    jest.clearAllMocks();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe("getUserDashboard", () => {
    it("should return 401 when no authorization token provided", async () => {
      mockReq.params = { id: "user1" };
      mockReq.headers = {}; // Pas de token

      await getUserDashboard(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(401);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Authentication token required"
      });
      expect(getUserDashboardData).not.toHaveBeenCalled();
    });

    it("should return 401 when authorization header is undefined", async () => {
      mockReq.params = { id: "user1" };
      mockReq.headers = { authorization: undefined };

      await getUserDashboard(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(401);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Authentication token required"
      });
      expect(getUserDashboardData).not.toHaveBeenCalled();
    });

    it("should return 200 with dashboard data when successful", async () => {
      const mockDashboardData = {
        user: { id: "user1", name: "John Doe" },
        stats: { totalClients: 10, totalProjects: 5 },
        recentActivity: []
      };

      (getUserDashboardData as jest.Mock).mockResolvedValue(mockDashboardData);

      mockReq.params = { id: "user1" };
      mockReq.headers = { authorization: "Bearer valid-token" };

      await getUserDashboard(mockReq as Request, mockRes as Response);

      expect(getUserDashboardData).toHaveBeenCalledWith(
        "user1",
        "Bearer valid-token"
      );
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(mockDashboardData);
    });

    it("should return 404 when user not found", async () => {
      (getUserDashboardData as jest.Mock).mockResolvedValue(null);

      mockReq.params = { id: "nonexistent-user" };
      mockReq.headers = { authorization: "Bearer valid-token" };

      await getUserDashboard(mockReq as Request, mockRes as Response);

      expect(getUserDashboardData).toHaveBeenCalledWith(
        "nonexistent-user",
        "Bearer valid-token"
      );
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        message: "User not found"
      });
    });

    it("should return 404 when service returns undefined", async () => {
      (getUserDashboardData as jest.Mock).mockResolvedValue(undefined);

      mockReq.params = { id: "user1" };
      mockReq.headers = { authorization: "Bearer valid-token" };

      await getUserDashboard(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        message: "User not found"
      });
    });

    it("should return 500 when service throws error", async () => {
      (getUserDashboardData as jest.Mock).mockRejectedValue(
        new Error("Database connection failed")
      );

      mockReq.params = { id: "user1" };
      mockReq.headers = { authorization: "Bearer valid-token" };

      await getUserDashboard(mockReq as Request, mockRes as Response);

      expect(getUserDashboardData).toHaveBeenCalledWith(
        "user1",
        "Bearer valid-token"
      );
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Internal server error"
      });
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error fetching user dashboard:",
        expect.any(Error)
      );
    });

    it("should handle service throwing string error", async () => {
      (getUserDashboardData as jest.Mock).mockRejectedValue("String error");

      mockReq.params = { id: "user1" };
      mockReq.headers = { authorization: "Bearer valid-token" };

      await getUserDashboard(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Internal server error"
      });
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error fetching user dashboard:",
        "String error"
      );
    });

    it("should pass different token formats correctly", async () => {
      const mockDashboardData = { user: { id: "user1" } };
      (getUserDashboardData as jest.Mock).mockResolvedValue(mockDashboardData);

      mockReq.params = { id: "user1" };
      mockReq.headers = { authorization: "jwt-token-without-bearer" };

      await getUserDashboard(mockReq as Request, mockRes as Response);

      expect(getUserDashboardData).toHaveBeenCalledWith(
        "user1",
        "jwt-token-without-bearer"
      );
      expect(mockStatus).toHaveBeenCalledWith(200);
    });

    it("should handle empty string token as missing token", async () => {
      mockReq.params = { id: "user1" };
      mockReq.headers = { authorization: "" };

      await getUserDashboard(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(401);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Authentication token required"
      });
      expect(getUserDashboardData).not.toHaveBeenCalled();
    });
  });
});
