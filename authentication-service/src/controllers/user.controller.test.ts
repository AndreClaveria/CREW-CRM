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

jest.mock("../services/user.service");
jest.mock("../utils/logger");
jest.mock("../utils/password.utils");

import { Request, Response } from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  createUser,
  deleteUser,
  changePassword
} from "../controllers/user.controller";
import * as userService from "../services/user.service";
import { logger } from "../utils/logger";
import { comparePassword } from "../utils/password.utils";

describe("UserController", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockReq = { body: {}, params: {}, query: {} };
    mockRes = { status: mockStatus, json: mockJson };
    jest.clearAllMocks();
  });

  describe("getAllUsers", () => {
    it("should return 200 with users list when successful", async () => {
      const mockUsers = [
        { id: 1, email: "user1@test.com" },
        { id: 2, email: "user2@test.com" }
      ];
      (userService.getAllUsers as jest.Mock).mockResolvedValue(mockUsers);

      await getAllUsers(mockReq as Request, mockRes as Response);

      expect(userService.getAllUsers).toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(mockUsers);
    });

    it("should return 500 when service throws error", async () => {
      (userService.getAllUsers as jest.Mock).mockRejectedValue(
        new Error("DB Error")
      );

      await getAllUsers(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Erreur lors de la récupération des utilisateurs"
      });
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("getUserById", () => {
    it("should return 200 with user when found", async () => {
      const mockUser = { id: 1, email: "test@email.com" };
      (userService.getUserById as jest.Mock).mockResolvedValue(mockUser);
      mockReq.params = { id: "1" };

      await getUserById(mockReq as Request, mockRes as Response);

      expect(userService.getUserById).toHaveBeenCalledWith("1");
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(mockUser);
    });

    it("should return 404 when user not found", async () => {
      (userService.getUserById as jest.Mock).mockResolvedValue(null);
      mockReq.params = { id: "999" };

      await getUserById(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Utilisateur non trouvé"
      });
    });

    it("should return 500 when service throws error", async () => {
      (userService.getUserById as jest.Mock).mockRejectedValue(
        new Error("DB Error")
      );
      mockReq.params = { id: "1" };

      await getUserById(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Erreur lors de la récupération de l'utilisateur"
      });
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("updateUser", () => {
    it("should return 200 with updated user when successful", async () => {
      const mockUpdatedUser = { id: 1, email: "updated@email.com" };
      (userService.updateUser as jest.Mock).mockResolvedValue(mockUpdatedUser);
      mockReq.params = { id: "1" };
      mockReq.body = { email: "updated@email.com" };

      await updateUser(mockReq as Request, mockRes as Response);

      expect(userService.updateUser).toHaveBeenCalledWith("1", {
        email: "updated@email.com"
      });
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(mockUpdatedUser);
    });

    it("should return 404 when user not found", async () => {
      (userService.updateUser as jest.Mock).mockResolvedValue(null);
      mockReq.params = { id: "999" };
      mockReq.body = { email: "test@email.com" };

      await updateUser(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Utilisateur non trouvé"
      });
    });

    it("should return 500 when service throws error", async () => {
      (userService.updateUser as jest.Mock).mockRejectedValue(
        new Error("DB Error")
      );
      mockReq.params = { id: "1" };
      mockReq.body = { email: "test@email.com" };

      await updateUser(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Erreur lors de la mise à jour de l'utilisateur"
      });
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("createUser", () => {
    it("should return 201 with new user when successful", async () => {
      const mockNewUser = { id: 1, email: "new@email.com" };
      (userService.createUser as jest.Mock).mockResolvedValue(mockNewUser);
      mockReq.body = { email: "new@email.com", password: "password123" };

      await createUser(mockReq as Request, mockRes as Response);

      expect(userService.createUser).toHaveBeenCalledWith(mockReq.body);
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(mockNewUser);
    });

    it("should return 500 when service throws error", async () => {
      (userService.createUser as jest.Mock).mockRejectedValue(
        new Error("DB Error")
      );
      mockReq.body = { email: "new@email.com" };

      await createUser(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Erreur lors de la création de l'utilisateur"
      });
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("deleteUser", () => {
    it("should return 200 when user deleted successfully", async () => {
      const mockDeletedUser = { id: 1, email: "deleted@email.com" };
      (userService.deleteUser as jest.Mock).mockResolvedValue(mockDeletedUser);
      mockReq.params = { id: "1" };

      await deleteUser(mockReq as Request, mockRes as Response);

      expect(userService.deleteUser).toHaveBeenCalledWith("1");
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Utilisateur supprimé avec succès"
      });
    });

    it("should return 404 when user not found", async () => {
      (userService.deleteUser as jest.Mock).mockResolvedValue(null);
      mockReq.params = { id: "999" };

      await deleteUser(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Utilisateur non trouvé"
      });
    });

    it("should return 500 when service throws error", async () => {
      (userService.deleteUser as jest.Mock).mockRejectedValue(
        new Error("DB Error")
      );
      mockReq.params = { id: "1" };

      await deleteUser(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Erreur lors de la suppression de l'utilisateur"
      });
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("changePassword", () => {
    it("should return 400 when currentPassword is missing", async () => {
      mockReq.body = { newPassword: "newpass123" };
      mockReq.params = { id: "1" };

      await changePassword(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Mot de passe actuel et nouveau mot de passe requis"
      });
    });

    it("should return 400 when newPassword is missing", async () => {
      mockReq.body = { currentPassword: "oldpass123" };
      mockReq.params = { id: "1" };

      await changePassword(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Mot de passe actuel et nouveau mot de passe requis"
      });
    });

    it("should return 404 when user not found", async () => {
      (userService.getUserById as jest.Mock).mockResolvedValue(null);
      mockReq.body = { currentPassword: "oldpass", newPassword: "newpass" };
      mockReq.params = { id: "999" };

      await changePassword(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Utilisateur non trouvé"
      });
    });

    it("should return 401 when current password is incorrect", async () => {
      const mockUser = { id: 1, email: "test@email.com" };
      const mockUserWithPassword = {
        id: 1,
        email: "test@email.com",
        password: "hashedpass"
      };

      (userService.getUserById as jest.Mock).mockResolvedValue(mockUser);
      (userService.getUserByEmail as jest.Mock).mockResolvedValue(
        mockUserWithPassword
      );
      (comparePassword as jest.Mock).mockResolvedValue(false);

      mockReq.body = { currentPassword: "wrongpass", newPassword: "newpass" };
      mockReq.params = { id: "1" };

      await changePassword(mockReq as Request, mockRes as Response);

      expect(comparePassword).toHaveBeenCalledWith("wrongpass", "hashedpass");
      expect(mockStatus).toHaveBeenCalledWith(401);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Mot de passe actuel incorrect"
      });
    });

    it("should return 200 when password changed successfully", async () => {
      const mockUser = { id: 1, email: "test@email.com" };
      const mockUserWithPassword = {
        id: 1,
        email: "test@email.com",
        password: "hashedpass"
      };

      (userService.getUserById as jest.Mock).mockResolvedValue(mockUser);
      (userService.getUserByEmail as jest.Mock).mockResolvedValue(
        mockUserWithPassword
      );
      (comparePassword as jest.Mock).mockResolvedValue(true);
      (userService.updatePassword as jest.Mock).mockResolvedValue(true);

      mockReq.body = { currentPassword: "correctpass", newPassword: "newpass" };
      mockReq.params = { id: "1" };

      await changePassword(mockReq as Request, mockRes as Response);

      expect(userService.updatePassword).toHaveBeenCalledWith("1", "newpass");
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Mot de passe changé avec succès"
      });
    });

    it("should return 500 when updatePassword fails", async () => {
      const mockUser = { id: 1, email: "test@email.com" };
      const mockUserWithPassword = {
        id: 1,
        email: "test@email.com",
        password: "hashedpass"
      };

      (userService.getUserById as jest.Mock).mockResolvedValue(mockUser);
      (userService.getUserByEmail as jest.Mock).mockResolvedValue(
        mockUserWithPassword
      );
      (comparePassword as jest.Mock).mockResolvedValue(true);
      (userService.updatePassword as jest.Mock).mockResolvedValue(false);

      mockReq.body = { currentPassword: "correctpass", newPassword: "newpass" };
      mockReq.params = { id: "1" };

      await changePassword(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Erreur lors du changement de mot de passe"
      });
    });

    it("should return 500 when service throws error", async () => {
      (userService.getUserById as jest.Mock).mockRejectedValue(
        new Error("DB Error")
      );
      mockReq.body = { currentPassword: "correctpass", newPassword: "newpass" };
      mockReq.params = { id: "1" };

      await changePassword(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Erreur lors du changement de mot de passe"
      });
      expect(logger.error).toHaveBeenCalled();
    });
  });
});
