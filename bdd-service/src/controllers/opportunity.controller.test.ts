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

jest.mock("../services/opportunity.service");
jest.mock("../services/client.service");
jest.mock("../services/contact.service");
jest.mock("../utils/logger");

import { Request, Response } from "express";
import {
  getAllOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
  getOpportunitiesByCompany,
  getOpportunitiesByClient,
  getOpportunitiesByStatus,
  addContactToOpportunity
} from "../controllers/opportunity.controller";
import * as opportunityService from "../services/opportunity.service";
import * as clientService from "../services/client.service";
import * as contactService from "../services/contact.service";
import { logger } from "../utils/logger";

describe("OpportunityController", () => {
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

  describe("getAllOpportunities", () => {
    it("should return 200 with opportunities list when successful", async () => {
      const mockOpportunities = [
        { id: 1, title: "Opportunity 1", status: "open" },
        { id: 2, title: "Opportunity 2", status: "closed" }
      ];
      (opportunityService.getAllOpportunities as jest.Mock).mockResolvedValue(
        mockOpportunities
      );

      await getAllOpportunities(mockReq as Request, mockRes as Response);

      expect(opportunityService.getAllOpportunities).toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        count: 2,
        data: mockOpportunities
      });
    });

    it("should return 500 when service throws error", async () => {
      (opportunityService.getAllOpportunities as jest.Mock).mockRejectedValue(
        new Error("DB Error")
      );

      await getAllOpportunities(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: "Erreur serveur"
      });
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("getOpportunityById", () => {
    it("should return 200 with opportunity when found", async () => {
      const mockOpportunity = {
        id: 1,
        title: "Test Opportunity",
        status: "open"
      };
      (opportunityService.getOpportunityById as jest.Mock).mockResolvedValue(
        mockOpportunity
      );
      mockReq.params = { id: "1" };

      await getOpportunityById(mockReq as Request, mockRes as Response);

      expect(opportunityService.getOpportunityById).toHaveBeenCalledWith("1");
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: mockOpportunity
      });
    });

    it("should return 404 when opportunity not found", async () => {
      (opportunityService.getOpportunityById as jest.Mock).mockResolvedValue(
        null
      );
      mockReq.params = { id: "999" };

      await getOpportunityById(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: "Opportunité non trouvée"
      });
    });

    it("should return 500 when service throws error", async () => {
      (opportunityService.getOpportunityById as jest.Mock).mockRejectedValue(
        new Error("DB Error")
      );
      mockReq.params = { id: "1" };

      await getOpportunityById(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: "Erreur serveur"
      });
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("createOpportunity", () => {
    it("should create opportunity without client or contacts", async () => {
      const mockOpportunity = {
        _id: "opp1",
        title: "Test Opportunity",
        client: null,
        contacts: []
      };
      (opportunityService.createOpportunity as jest.Mock).mockResolvedValue(
        mockOpportunity
      );

      mockReq.body = { title: "Test Opportunity" };

      await createOpportunity(mockReq as Request, mockRes as Response);

      expect(opportunityService.createOpportunity).toHaveBeenCalledWith(
        mockReq.body
      );
      expect(clientService.addOpportunityToClient).not.toHaveBeenCalled();
      expect(contactService.addOpportunityToContact).not.toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: mockOpportunity
      });
    });

    it("should create opportunity and add to client when client provided", async () => {
      const mockOpportunity = {
        _id: "opp1",
        title: "Test Opportunity",
        client: "client1",
        contacts: []
      };
      (opportunityService.createOpportunity as jest.Mock).mockResolvedValue(
        mockOpportunity
      );
      (clientService.addOpportunityToClient as jest.Mock).mockResolvedValue(
        true
      );

      mockReq.body = { title: "Test Opportunity", client: "client1" };

      await createOpportunity(mockReq as Request, mockRes as Response);

      expect(clientService.addOpportunityToClient).toHaveBeenCalledWith(
        "client1",
        "opp1"
      );
      expect(contactService.addOpportunityToContact).not.toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(201);
    });

    it("should create opportunity and add to contacts when contacts provided", async () => {
      const mockOpportunity = {
        _id: "opp1",
        title: "Test Opportunity",
        client: null,
        contacts: ["contact1", "contact2"]
      };
      (opportunityService.createOpportunity as jest.Mock).mockResolvedValue(
        mockOpportunity
      );
      (contactService.addOpportunityToContact as jest.Mock).mockResolvedValue(
        true
      );

      mockReq.body = {
        title: "Test Opportunity",
        contacts: ["contact1", "contact2"]
      };

      await createOpportunity(mockReq as Request, mockRes as Response);

      expect(contactService.addOpportunityToContact).toHaveBeenCalledTimes(2);
      expect(contactService.addOpportunityToContact).toHaveBeenCalledWith(
        "contact1",
        "opp1"
      );
      expect(contactService.addOpportunityToContact).toHaveBeenCalledWith(
        "contact2",
        "opp1"
      );
      expect(clientService.addOpportunityToClient).not.toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(201);
    });

    it("should create opportunity with both client and contacts", async () => {
      const mockOpportunity = {
        _id: "opp1",
        title: "Test Opportunity",
        client: "client1",
        contacts: ["contact1", "contact2"]
      };
      (opportunityService.createOpportunity as jest.Mock).mockResolvedValue(
        mockOpportunity
      );
      (clientService.addOpportunityToClient as jest.Mock).mockResolvedValue(
        true
      );
      (contactService.addOpportunityToContact as jest.Mock).mockResolvedValue(
        true
      );

      mockReq.body = {
        title: "Test Opportunity",
        client: "client1",
        contacts: ["contact1", "contact2"]
      };

      await createOpportunity(mockReq as Request, mockRes as Response);

      expect(clientService.addOpportunityToClient).toHaveBeenCalledWith(
        "client1",
        "opp1"
      );
      expect(contactService.addOpportunityToContact).toHaveBeenCalledTimes(2);
      expect(mockStatus).toHaveBeenCalledWith(201);
    });

    it("should return 500 when service throws error", async () => {
      (opportunityService.createOpportunity as jest.Mock).mockRejectedValue(
        new Error("DB Error")
      );
      mockReq.body = { title: "Test Opportunity" };

      await createOpportunity(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: "Erreur serveur"
      });
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("updateOpportunity", () => {
    it("should update opportunity successfully", async () => {
      const mockUpdatedOpportunity = { id: 1, title: "Updated Opportunity" };
      (opportunityService.updateOpportunity as jest.Mock).mockResolvedValue(
        mockUpdatedOpportunity
      );

      mockReq.params = { id: "1" };
      mockReq.body = { title: "Updated Opportunity" };

      await updateOpportunity(mockReq as Request, mockRes as Response);

      expect(opportunityService.updateOpportunity).toHaveBeenCalledWith("1", {
        title: "Updated Opportunity"
      });
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: mockUpdatedOpportunity
      });
    });

    it("should return 404 when opportunity not found", async () => {
      (opportunityService.updateOpportunity as jest.Mock).mockResolvedValue(
        null
      );
      mockReq.params = { id: "999" };
      mockReq.body = { title: "Updated Opportunity" };

      await updateOpportunity(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: "Opportunité non trouvée"
      });
    });

    it("should return 500 when service throws error", async () => {
      (opportunityService.updateOpportunity as jest.Mock).mockRejectedValue(
        new Error("DB Error")
      );
      mockReq.params = { id: "1" };
      mockReq.body = { title: "Updated Opportunity" };

      await updateOpportunity(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: "Erreur serveur"
      });
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("deleteOpportunity", () => {
    it("should delete opportunity successfully", async () => {
      const mockDeletedOpportunity = { id: 1, title: "Deleted Opportunity" };
      (opportunityService.deleteOpportunity as jest.Mock).mockResolvedValue(
        mockDeletedOpportunity
      );
      mockReq.params = { id: "1" };

      await deleteOpportunity(mockReq as Request, mockRes as Response);

      expect(opportunityService.deleteOpportunity).toHaveBeenCalledWith("1");
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: mockDeletedOpportunity
      });
    });

    it("should return 404 when opportunity not found", async () => {
      (opportunityService.deleteOpportunity as jest.Mock).mockResolvedValue(
        null
      );
      mockReq.params = { id: "999" };

      await deleteOpportunity(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: "Opportunité non trouvée"
      });
    });

    it("should return 500 when service throws error", async () => {
      (opportunityService.deleteOpportunity as jest.Mock).mockRejectedValue(
        new Error("DB Error")
      );
      mockReq.params = { id: "1" };

      await deleteOpportunity(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: "Erreur serveur"
      });
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("getOpportunitiesByCompany", () => {
    it("should return opportunities by company successfully", async () => {
      const mockOpportunities = [
        { id: 1, title: "Opp 1", company: "company1" }
      ];
      (
        opportunityService.getOpportunitiesByCompany as jest.Mock
      ).mockResolvedValue(mockOpportunities);
      mockReq.params = { companyId: "company1" };

      await getOpportunitiesByCompany(mockReq as Request, mockRes as Response);

      expect(opportunityService.getOpportunitiesByCompany).toHaveBeenCalledWith(
        "company1"
      );
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        count: 1,
        data: mockOpportunities
      });
    });

    it("should return 500 when service throws error", async () => {
      (
        opportunityService.getOpportunitiesByCompany as jest.Mock
      ).mockRejectedValue(new Error("DB Error"));
      mockReq.params = { companyId: "company1" };

      await getOpportunitiesByCompany(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: "Erreur serveur"
      });
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("getOpportunitiesByClient", () => {
    it("should return opportunities by client successfully", async () => {
      const mockOpportunities = [{ id: 1, title: "Opp 1", client: "client1" }];
      (
        opportunityService.getOpportunitiesByClient as jest.Mock
      ).mockResolvedValue(mockOpportunities);
      mockReq.params = { clientId: "client1" };

      await getOpportunitiesByClient(mockReq as Request, mockRes as Response);

      expect(opportunityService.getOpportunitiesByClient).toHaveBeenCalledWith(
        "client1"
      );
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        count: 1,
        data: mockOpportunities
      });
    });

    it("should return 500 when service throws error", async () => {
      (
        opportunityService.getOpportunitiesByClient as jest.Mock
      ).mockRejectedValue(new Error("DB Error"));
      mockReq.params = { clientId: "client1" };

      await getOpportunitiesByClient(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: "Erreur serveur"
      });
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("getOpportunitiesByStatus", () => {
    it("should return opportunities by status successfully", async () => {
      const mockOpportunities = [{ id: 1, title: "Opp 1", status: "open" }];
      (
        opportunityService.getOpportunitiesByStatus as jest.Mock
      ).mockResolvedValue(mockOpportunities);
      mockReq.params = { status: "open" };

      await getOpportunitiesByStatus(mockReq as Request, mockRes as Response);

      expect(opportunityService.getOpportunitiesByStatus).toHaveBeenCalledWith(
        "open"
      );
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        count: 1,
        data: mockOpportunities
      });
    });

    it("should return 500 when service throws error", async () => {
      (
        opportunityService.getOpportunitiesByStatus as jest.Mock
      ).mockRejectedValue(new Error("DB Error"));
      mockReq.params = { status: "open" };

      await getOpportunitiesByStatus(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: "Erreur serveur"
      });
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("addContactToOpportunity", () => {
    it("should add contact to opportunity successfully", async () => {
      const mockOpportunity = {
        id: 1,
        title: "Opp 1",
        contacts: ["contact1", "contact2"]
      };
      (
        opportunityService.addContactToOpportunity as jest.Mock
      ).mockResolvedValue(mockOpportunity);
      (contactService.addOpportunityToContact as jest.Mock).mockResolvedValue(
        true
      );

      mockReq.params = { opportunityId: "opp1", contactId: "contact2" };

      await addContactToOpportunity(mockReq as Request, mockRes as Response);

      expect(opportunityService.addContactToOpportunity).toHaveBeenCalledWith(
        "opp1",
        "contact2"
      );
      expect(contactService.addOpportunityToContact).toHaveBeenCalledWith(
        "contact2",
        "opp1"
      );
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: mockOpportunity
      });
    });

    it("should return 404 when opportunity not found", async () => {
      (
        opportunityService.addContactToOpportunity as jest.Mock
      ).mockResolvedValue(null);
      mockReq.params = { opportunityId: "999", contactId: "contact1" };

      await addContactToOpportunity(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: "Opportunité non trouvée"
      });
      expect(contactService.addOpportunityToContact).not.toHaveBeenCalled();
    });

    it("should return 500 when service throws error", async () => {
      (
        opportunityService.addContactToOpportunity as jest.Mock
      ).mockRejectedValue(new Error("DB Error"));
      mockReq.params = { opportunityId: "opp1", contactId: "contact1" };

      await addContactToOpportunity(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: "Erreur serveur"
      });
      expect(logger.error).toHaveBeenCalled();
    });
  });
});
