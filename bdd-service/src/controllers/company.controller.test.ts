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

jest.mock("../services/company.service");
jest.mock("../utils/logger");

import { Request, Response } from "express";
import {
  getAllCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
  getCompaniesByOwner,
  addTeamToCompany,
  removeTeamFromCompany
} from "../controllers/company.controller";
import * as companyService from "../services/company.service";
import { logger } from "../utils/logger";

describe("CompanyController", () => {
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

  describe("getAllCompanies", () => {
    it("should return 200 with companies list when successful", async () => {
      const mockCompanies = [
        { id: 1, name: "Company 1", owner: "owner1" },
        { id: 2, name: "Company 2", owner: "owner2" }
      ];
      (companyService.getAllCompanies as jest.Mock).mockResolvedValue(
        mockCompanies
      );

      await getAllCompanies(mockReq as Request, mockRes as Response);

      expect(companyService.getAllCompanies).toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(mockCompanies);
    });

    it("should return 500 when service throws error", async () => {
      (companyService.getAllCompanies as jest.Mock).mockRejectedValue(
        new Error("DB Error")
      );

      await getAllCompanies(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Erreur lors de la récupération des entreprises"
      });
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("getCompanyById", () => {
    it("should return 200 with company when found", async () => {
      const mockCompany = { id: 1, name: "Test Company", owner: "owner1" };
      (companyService.getCompanyById as jest.Mock).mockResolvedValue(
        mockCompany
      );
      mockReq.params = { id: "1" };

      await getCompanyById(mockReq as Request, mockRes as Response);

      expect(companyService.getCompanyById).toHaveBeenCalledWith("1");
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(mockCompany);
    });

    it("should return 404 when company not found", async () => {
      (companyService.getCompanyById as jest.Mock).mockResolvedValue(null);
      mockReq.params = { id: "999" };

      await getCompanyById(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Entreprise non trouvée"
      });
    });

    it("should return 500 when service throws error", async () => {
      (companyService.getCompanyById as jest.Mock).mockRejectedValue(
        new Error("DB Error")
      );
      mockReq.params = { id: "1" };

      await getCompanyById(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Erreur lors de la récupération de l'entreprise"
      });
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("createCompany", () => {
    it("should create company successfully", async () => {
      const mockCompany = { id: 1, name: "New Company", owner: "owner1" };
      (companyService.createCompany as jest.Mock).mockResolvedValue(
        mockCompany
      );

      mockReq.body = { name: "New Company", owner: "owner1" };

      await createCompany(mockReq as Request, mockRes as Response);

      expect(companyService.createCompany).toHaveBeenCalledWith({
        name: "New Company",
        owner: "owner1"
      });
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(mockCompany);
    });

    it("should return 500 when service throws error", async () => {
      (companyService.createCompany as jest.Mock).mockRejectedValue(
        new Error("DB Error")
      );
      mockReq.body = { name: "New Company" };

      await createCompany(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Erreur lors de la création de l'entreprise"
      });
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("updateCompany", () => {
    it("should update company successfully", async () => {
      const mockUpdatedCompany = {
        id: 1,
        name: "Updated Company",
        owner: "owner1"
      };
      (companyService.updateCompany as jest.Mock).mockResolvedValue(
        mockUpdatedCompany
      );

      mockReq.params = { id: "1" };
      mockReq.body = { name: "Updated Company" };

      await updateCompany(mockReq as Request, mockRes as Response);

      expect(companyService.updateCompany).toHaveBeenCalledWith("1", {
        name: "Updated Company"
      });
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(mockUpdatedCompany);
    });

    it("should return 404 when company not found", async () => {
      (companyService.updateCompany as jest.Mock).mockResolvedValue(null);
      mockReq.params = { id: "999" };
      mockReq.body = { name: "Updated Company" };

      await updateCompany(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Entreprise non trouvée"
      });
    });

    it("should return 500 when service throws error", async () => {
      (companyService.updateCompany as jest.Mock).mockRejectedValue(
        new Error("DB Error")
      );
      mockReq.params = { id: "1" };
      mockReq.body = { name: "Updated Company" };

      await updateCompany(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Erreur lors de la mise à jour de l'entreprise"
      });
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("deleteCompany", () => {
    it("should delete company successfully", async () => {
      const mockDeletedCompany = { id: 1, name: "Deleted Company" };
      (companyService.deleteCompany as jest.Mock).mockResolvedValue(
        mockDeletedCompany
      );
      mockReq.params = { id: "1" };

      await deleteCompany(mockReq as Request, mockRes as Response);

      expect(companyService.deleteCompany).toHaveBeenCalledWith("1");
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Entreprise supprimée avec succès"
      });
    });

    it("should return 404 when company not found", async () => {
      (companyService.deleteCompany as jest.Mock).mockResolvedValue(null);
      mockReq.params = { id: "999" };

      await deleteCompany(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Entreprise non trouvée"
      });
    });

    it("should return 500 when service throws error", async () => {
      (companyService.deleteCompany as jest.Mock).mockRejectedValue(
        new Error("DB Error")
      );
      mockReq.params = { id: "1" };

      await deleteCompany(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Erreur lors de la suppression de l'entreprise"
      });
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("getCompaniesByOwner", () => {
    it("should return companies by owner successfully", async () => {
      const mockCompanies = [
        { id: 1, name: "Company 1", owner: "owner1" },
        { id: 2, name: "Company 2", owner: "owner1" }
      ];
      (companyService.getCompaniesByOwner as jest.Mock).mockResolvedValue(
        mockCompanies
      );
      mockReq.params = { ownerId: "owner1" };

      await getCompaniesByOwner(mockReq as Request, mockRes as Response);

      expect(companyService.getCompaniesByOwner).toHaveBeenCalledWith("owner1");
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(mockCompanies);
    });

    it("should return 500 when service throws error", async () => {
      (companyService.getCompaniesByOwner as jest.Mock).mockRejectedValue(
        new Error("DB Error")
      );
      mockReq.params = { ownerId: "owner1" };

      await getCompaniesByOwner(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        message:
          "Erreur lors de la récupération des entreprises du propriétaire"
      });
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("addTeamToCompany", () => {
    it("should add team to company successfully", async () => {
      const mockUpdatedCompany = {
        id: 1,
        name: "Company 1",
        teams: ["team1", "team2"]
      };
      (companyService.addTeamToCompany as jest.Mock).mockResolvedValue(
        mockUpdatedCompany
      );
      mockReq.params = { companyId: "company1", teamId: "team2" };

      await addTeamToCompany(mockReq as Request, mockRes as Response);

      expect(companyService.addTeamToCompany).toHaveBeenCalledWith(
        "company1",
        "team2"
      );
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(mockUpdatedCompany);
    });

    it("should return 404 when company not found", async () => {
      (companyService.addTeamToCompany as jest.Mock).mockResolvedValue(null);
      mockReq.params = { companyId: "999", teamId: "team1" };

      await addTeamToCompany(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Entreprise non trouvée"
      });
    });

    it("should return 500 when service throws error", async () => {
      (companyService.addTeamToCompany as jest.Mock).mockRejectedValue(
        new Error("DB Error")
      );
      mockReq.params = { companyId: "company1", teamId: "team1" };

      await addTeamToCompany(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Erreur lors de l'ajout de l'équipe à l'entreprise"
      });
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("removeTeamFromCompany", () => {
    it("should remove team from company successfully", async () => {
      const mockUpdatedCompany = {
        id: 1,
        name: "Company 1",
        teams: ["team1"]
      };
      (companyService.removeTeamFromCompany as jest.Mock).mockResolvedValue(
        mockUpdatedCompany
      );
      mockReq.params = { companyId: "company1", teamId: "team2" };

      await removeTeamFromCompany(mockReq as Request, mockRes as Response);

      expect(companyService.removeTeamFromCompany).toHaveBeenCalledWith(
        "company1",
        "team2"
      );
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(mockUpdatedCompany);
    });

    it("should return 404 when company not found", async () => {
      (companyService.removeTeamFromCompany as jest.Mock).mockResolvedValue(
        null
      );
      mockReq.params = { companyId: "999", teamId: "team1" };

      await removeTeamFromCompany(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Entreprise non trouvée"
      });
    });

    it("should return 500 when service throws error", async () => {
      (companyService.removeTeamFromCompany as jest.Mock).mockRejectedValue(
        new Error("DB Error")
      );
      mockReq.params = { companyId: "company1", teamId: "team1" };

      await removeTeamFromCompany(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        message: "Erreur lors du retrait de l'équipe de l'entreprise"
      });
      expect(logger.error).toHaveBeenCalled();
    });
  });
});
