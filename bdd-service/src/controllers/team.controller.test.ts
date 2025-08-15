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

jest.mock("../services/team.service");
jest.mock("../utils/logger");

import { Request, Response } from "express";
import {
  getAllTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
  getTeamsByCompany,
  addMemberToTeam,
  removeMemberFromTeam,
  setTeamLeader,
  isUserTeamMember
} from "../controllers/team.controller";
import * as teamService from "../services/team.service";
import { logger } from "../utils/logger";

describe("TeamController", () => {
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

  describe("getAllTeams", () => {
    it("should return 200 with teams list when successful", async () => {
      const mockTeams = [
        { id: 1, name: "Team Alpha", company: "company1" },
        { id: 2, name: "Team Beta", company: "company1" }
      ];
      (teamService.getAllTeams as jest.Mock).mockResolvedValue(mockTeams);

      await getAllTeams(mockReq as Request, mockRes as Response);

      expect(teamService.getAllTeams).toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(mockTeams);
    });

    it("should return 500 when service throws error", async () => {
      (teamService.getAllTeams as jest.Mock).mockRejectedValue(
        new Error("DB Error")
      );

      await getAllTeams(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Erreur lors de la récupération des équipes"
      });
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("getTeamById", () => {
    it("should return 200 with team when found", async () => {
      const mockTeam = { id: 1, name: "Team Alpha", company: "company1" };
      (teamService.getTeamById as jest.Mock).mockResolvedValue(mockTeam);
      mockReq.params = { id: "1" };

      await getTeamById(mockReq as Request, mockRes as Response);

      expect(teamService.getTeamById).toHaveBeenCalledWith("1");
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(mockTeam);
    });

    it("should return 404 when team not found", async () => {
      (teamService.getTeamById as jest.Mock).mockResolvedValue(null);
      mockReq.params = { id: "999" };

      await getTeamById(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Équipe non trouvée"
      });
    });

    it("should return 500 when service throws error", async () => {
      (teamService.getTeamById as jest.Mock).mockRejectedValue(
        new Error("DB Error")
      );
      mockReq.params = { id: "1" };

      await getTeamById(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Erreur lors de la récupération de l'équipe"
      });
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("createTeam", () => {
    it("should create team successfully", async () => {
      const mockTeam = { id: 1, name: "New Team", company: "company1" };
      (teamService.createTeam as jest.Mock).mockResolvedValue(mockTeam);

      mockReq.body = { name: "New Team", company: "company1" };

      await createTeam(mockReq as Request, mockRes as Response);

      expect(teamService.createTeam).toHaveBeenCalledWith({
        name: "New Team",
        company: "company1"
      });
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(mockTeam);
    });

    it("should return 500 when service throws error", async () => {
      (teamService.createTeam as jest.Mock).mockRejectedValue(
        new Error("DB Error")
      );
      mockReq.body = { name: "New Team" };

      await createTeam(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Erreur lors de la création de l'équipe"
      });
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("updateTeam", () => {
    it("should update team successfully", async () => {
      const mockUpdatedTeam = {
        id: 1,
        name: "Updated Team",
        company: "company1"
      };
      (teamService.updateTeam as jest.Mock).mockResolvedValue(mockUpdatedTeam);

      mockReq.params = { id: "1" };
      mockReq.body = { name: "Updated Team" };

      await updateTeam(mockReq as Request, mockRes as Response);

      expect(teamService.updateTeam).toHaveBeenCalledWith("1", {
        name: "Updated Team"
      });
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(mockUpdatedTeam);
    });

    it("should return 404 when team not found", async () => {
      (teamService.updateTeam as jest.Mock).mockResolvedValue(null);
      mockReq.params = { id: "999" };
      mockReq.body = { name: "Updated Team" };

      await updateTeam(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Équipe non trouvée"
      });
    });

    it("should return 500 when service throws error", async () => {
      (teamService.updateTeam as jest.Mock).mockRejectedValue(
        new Error("DB Error")
      );
      mockReq.params = { id: "1" };
      mockReq.body = { name: "Updated Team" };

      await updateTeam(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Erreur lors de la mise à jour de l'équipe"
      });
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("deleteTeam", () => {
    it("should delete team successfully", async () => {
      const mockDeletedTeam = { id: 1, name: "Deleted Team" };
      (teamService.deleteTeam as jest.Mock).mockResolvedValue(mockDeletedTeam);
      mockReq.params = { id: "1" };

      await deleteTeam(mockReq as Request, mockRes as Response);

      expect(teamService.deleteTeam).toHaveBeenCalledWith("1");
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Équipe supprimée avec succès"
      });
    });

    it("should return 404 when team not found", async () => {
      (teamService.deleteTeam as jest.Mock).mockResolvedValue(null);
      mockReq.params = { id: "999" };

      await deleteTeam(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Équipe non trouvée"
      });
    });

    it("should return 500 when service throws error", async () => {
      (teamService.deleteTeam as jest.Mock).mockRejectedValue(
        new Error("DB Error")
      );
      mockReq.params = { id: "1" };

      await deleteTeam(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Erreur lors de la suppression de l'équipe"
      });
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("getTeamsByCompany", () => {
    it("should return teams by company successfully", async () => {
      const mockTeams = [
        { id: 1, name: "Team Alpha", company: "company1" },
        { id: 2, name: "Team Beta", company: "company1" }
      ];
      (teamService.getTeamsByCompany as jest.Mock).mockResolvedValue(mockTeams);
      mockReq.params = { companyId: "company1" };

      await getTeamsByCompany(mockReq as Request, mockRes as Response);

      expect(teamService.getTeamsByCompany).toHaveBeenCalledWith("company1");
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(mockTeams);
    });

    it("should return 500 when service throws error", async () => {
      (teamService.getTeamsByCompany as jest.Mock).mockRejectedValue(
        new Error("DB Error")
      );
      mockReq.params = { companyId: "company1" };

      await getTeamsByCompany(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Erreur lors de la récupération des équipes de l'entreprise"
      });
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("addMemberToTeam", () => {
    it("should add member to team successfully", async () => {
      const mockUpdatedTeam = {
        id: 1,
        name: "Team Alpha",
        members: ["user1", "user2"]
      };
      (teamService.addMemberToTeam as jest.Mock).mockResolvedValue(
        mockUpdatedTeam
      );
      mockReq.params = { teamId: "team1", userId: "user2" };

      await addMemberToTeam(mockReq as Request, mockRes as Response);

      expect(teamService.addMemberToTeam).toHaveBeenCalledWith(
        "team1",
        "user2"
      );
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(mockUpdatedTeam);
    });

    it("should return 404 when team not found", async () => {
      (teamService.addMemberToTeam as jest.Mock).mockResolvedValue(null);
      mockReq.params = { teamId: "999", userId: "user1" };

      await addMemberToTeam(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Équipe non trouvée"
      });
    });

    it("should return 500 when service throws error", async () => {
      (teamService.addMemberToTeam as jest.Mock).mockRejectedValue(
        new Error("DB Error")
      );
      mockReq.params = { teamId: "team1", userId: "user1" };

      await addMemberToTeam(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Erreur lors de l'ajout du membre à l'équipe"
      });
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("removeMemberFromTeam", () => {
    it("should remove member from team successfully", async () => {
      const mockUpdatedTeam = {
        id: 1,
        name: "Team Alpha",
        members: ["user1"]
      };
      (teamService.removeMemberFromTeam as jest.Mock).mockResolvedValue(
        mockUpdatedTeam
      );
      mockReq.params = { teamId: "team1", userId: "user2" };

      await removeMemberFromTeam(mockReq as Request, mockRes as Response);

      expect(teamService.removeMemberFromTeam).toHaveBeenCalledWith(
        "team1",
        "user2"
      );
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(mockUpdatedTeam);
    });

    it("should return 404 when team not found", async () => {
      (teamService.removeMemberFromTeam as jest.Mock).mockResolvedValue(null);
      mockReq.params = { teamId: "999", userId: "user1" };

      await removeMemberFromTeam(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Équipe non trouvée"
      });
    });

    it("should return 500 when service throws error", async () => {
      (teamService.removeMemberFromTeam as jest.Mock).mockRejectedValue(
        new Error("DB Error")
      );
      mockReq.params = { teamId: "team1", userId: "user1" };

      await removeMemberFromTeam(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Erreur lors du retrait du membre de l'équipe"
      });
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("setTeamLeader", () => {
    it("should set team leader successfully", async () => {
      const mockUpdatedTeam = {
        id: 1,
        name: "Team Alpha",
        leader: "user1",
        members: ["user1", "user2"]
      };
      (teamService.setTeamLeader as jest.Mock).mockResolvedValue(
        mockUpdatedTeam
      );
      mockReq.params = { teamId: "team1", userId: "user1" };

      await setTeamLeader(mockReq as Request, mockRes as Response);

      expect(teamService.setTeamLeader).toHaveBeenCalledWith("team1", "user1");
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(mockUpdatedTeam);
    });

    it("should return 404 when team not found", async () => {
      (teamService.setTeamLeader as jest.Mock).mockResolvedValue(null);
      mockReq.params = { teamId: "999", userId: "user1" };

      await setTeamLeader(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Équipe non trouvée"
      });
    });

    it("should return 500 when service throws error", async () => {
      (teamService.setTeamLeader as jest.Mock).mockRejectedValue(
        new Error("DB Error")
      );
      mockReq.params = { teamId: "team1", userId: "user1" };

      await setTeamLeader(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Erreur lors de la définition du chef d'équipe"
      });
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("isUserTeamMember", () => {
    it("should return true when user is team member", async () => {
      (teamService.isUserTeamMember as jest.Mock).mockResolvedValue(true);
      mockReq.params = { teamId: "team1", userId: "user1" };

      await isUserTeamMember(mockReq as Request, mockRes as Response);

      expect(teamService.isUserTeamMember).toHaveBeenCalledWith(
        "team1",
        "user1"
      );
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({ isMember: true });
    });

    it("should return false when user is not team member", async () => {
      (teamService.isUserTeamMember as jest.Mock).mockResolvedValue(false);
      mockReq.params = { teamId: "team1", userId: "user999" };

      await isUserTeamMember(mockReq as Request, mockRes as Response);

      expect(teamService.isUserTeamMember).toHaveBeenCalledWith(
        "team1",
        "user999"
      );
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({ isMember: false });
    });

    it("should return 500 when service throws error", async () => {
      (teamService.isUserTeamMember as jest.Mock).mockRejectedValue(
        new Error("DB Error")
      );
      mockReq.params = { teamId: "team1", userId: "user1" };

      await isUserTeamMember(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Erreur lors de la vérification de l'appartenance à l'équipe"
      });
      expect(logger.error).toHaveBeenCalled();
    });
  });
});
