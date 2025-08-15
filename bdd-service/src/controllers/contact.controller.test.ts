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

jest.mock("../services/contact.service");
jest.mock("../services/client.service");
jest.mock("../utils/logger");

import { Request, Response } from "express";
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
  getContactsByCompany,
  getContactsByClient
} from "../controllers/contact.controller";
import * as contactService from "../services/contact.service";
import * as clientService from "../services/client.service";
import { logger } from "../utils/logger";

describe("ContactController", () => {
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

  describe("getAllContacts", () => {
    it("should return 200 with contacts list when successful", async () => {
      const mockContacts = [
        { id: 1, firstName: "John", lastName: "Doe", email: "john@test.com" },
        { id: 2, firstName: "Jane", lastName: "Smith", email: "jane@test.com" }
      ];
      (contactService.getAllContacts as jest.Mock).mockResolvedValue(
        mockContacts
      );

      await getAllContacts(mockReq as Request, mockRes as Response);

      expect(contactService.getAllContacts).toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        count: 2,
        data: mockContacts
      });
    });

    it("should return 500 when service throws error", async () => {
      (contactService.getAllContacts as jest.Mock).mockRejectedValue(
        new Error("DB Error")
      );

      await getAllContacts(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: "Erreur serveur"
      });
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("getContactById", () => {
    it("should return 200 with contact when found", async () => {
      const mockContact = {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "john@test.com"
      };
      (contactService.getContactById as jest.Mock).mockResolvedValue(
        mockContact
      );
      mockReq.params = { id: "1" };

      await getContactById(mockReq as Request, mockRes as Response);

      expect(contactService.getContactById).toHaveBeenCalledWith("1");
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: mockContact
      });
    });

    it("should return 404 when contact not found", async () => {
      (contactService.getContactById as jest.Mock).mockResolvedValue(null);
      mockReq.params = { id: "999" };

      await getContactById(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: "Contact non trouvé"
      });
    });

    it("should return 500 when service throws error", async () => {
      (contactService.getContactById as jest.Mock).mockRejectedValue(
        new Error("DB Error")
      );
      mockReq.params = { id: "1" };

      await getContactById(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: "Erreur serveur"
      });
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("createContact", () => {
    it("should create contact successfully without client", async () => {
      const mockContact = {
        _id: "contact1",
        firstName: "John",
        lastName: "Doe",
        email: "john@test.com",
        client: null
      };
      (contactService.createContact as jest.Mock).mockResolvedValue(
        mockContact
      );

      mockReq.body = {
        firstName: "John",
        lastName: "Doe",
        email: "john@test.com"
      };

      await createContact(mockReq as Request, mockRes as Response);

      expect(contactService.createContact).toHaveBeenCalledWith(mockReq.body);
      expect(clientService.addContactToClient).not.toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: mockContact
      });
    });

    it("should create contact and add to client when client ID provided", async () => {
      const mockContact = {
        _id: "contact1",
        firstName: "John",
        lastName: "Doe",
        email: "john@test.com",
        client: "client1"
      };
      (contactService.createContact as jest.Mock).mockResolvedValue(
        mockContact
      );
      (clientService.addContactToClient as jest.Mock).mockResolvedValue(true);

      mockReq.body = {
        firstName: "John",
        lastName: "Doe",
        email: "john@test.com",
        client: "client1"
      };

      await createContact(mockReq as Request, mockRes as Response);

      expect(contactService.createContact).toHaveBeenCalledWith(mockReq.body);
      expect(clientService.addContactToClient).toHaveBeenCalledWith(
        "client1",
        "contact1"
      );
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: mockContact
      });
    });

    it("should return 500 when service throws error", async () => {
      (contactService.createContact as jest.Mock).mockRejectedValue(
        new Error("DB Error")
      );
      mockReq.body = { firstName: "John", lastName: "Doe" };

      await createContact(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: "Erreur serveur"
      });
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("updateContact", () => {
    it("should update contact successfully", async () => {
      const mockUpdatedContact = {
        id: 1,
        firstName: "John Updated",
        lastName: "Doe",
        email: "john.updated@test.com"
      };
      (contactService.updateContact as jest.Mock).mockResolvedValue(
        mockUpdatedContact
      );

      mockReq.params = { id: "1" };
      mockReq.body = {
        firstName: "John Updated",
        email: "john.updated@test.com"
      };

      await updateContact(mockReq as Request, mockRes as Response);

      expect(contactService.updateContact).toHaveBeenCalledWith("1", {
        firstName: "John Updated",
        email: "john.updated@test.com"
      });
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: mockUpdatedContact
      });
    });

    it("should return 404 when contact not found", async () => {
      (contactService.updateContact as jest.Mock).mockResolvedValue(null);
      mockReq.params = { id: "999" };
      mockReq.body = { firstName: "John Updated" };

      await updateContact(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: "Contact non trouvé"
      });
    });

    it("should return 500 when service throws error", async () => {
      (contactService.updateContact as jest.Mock).mockRejectedValue(
        new Error("DB Error")
      );
      mockReq.params = { id: "1" };
      mockReq.body = { firstName: "John Updated" };

      await updateContact(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: "Erreur serveur"
      });
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("deleteContact", () => {
    it("should delete contact successfully", async () => {
      const mockDeletedContact = { id: 1, firstName: "John", lastName: "Doe" };
      (contactService.deleteContact as jest.Mock).mockResolvedValue(
        mockDeletedContact
      );
      mockReq.params = { id: "1" };

      await deleteContact(mockReq as Request, mockRes as Response);

      expect(contactService.deleteContact).toHaveBeenCalledWith("1");
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: mockDeletedContact
      });
    });

    it("should return 404 when contact not found", async () => {
      (contactService.deleteContact as jest.Mock).mockResolvedValue(null);
      mockReq.params = { id: "999" };

      await deleteContact(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: "Contact non trouvé"
      });
    });

    it("should return 500 when service throws error", async () => {
      (contactService.deleteContact as jest.Mock).mockRejectedValue(
        new Error("DB Error")
      );
      mockReq.params = { id: "1" };

      await deleteContact(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: "Erreur serveur"
      });
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("getContactsByCompany", () => {
    it("should return contacts by company successfully", async () => {
      const mockContacts = [
        { id: 1, firstName: "John", lastName: "Doe", company: "company1" },
        { id: 2, firstName: "Jane", lastName: "Smith", company: "company1" }
      ];
      (contactService.getContactsByCompany as jest.Mock).mockResolvedValue(
        mockContacts
      );
      mockReq.params = { companyId: "company1" };

      await getContactsByCompany(mockReq as Request, mockRes as Response);

      expect(contactService.getContactsByCompany).toHaveBeenCalledWith(
        "company1"
      );
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        count: 2,
        data: mockContacts
      });
    });

    it("should return 500 when service throws error", async () => {
      (contactService.getContactsByCompany as jest.Mock).mockRejectedValue(
        new Error("DB Error")
      );
      mockReq.params = { companyId: "company1" };

      await getContactsByCompany(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: "Erreur serveur"
      });
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("getContactsByClient", () => {
    it("should return contacts by client successfully", async () => {
      const mockContacts = [
        { id: 1, firstName: "John", lastName: "Doe", client: "client1" },
        { id: 2, firstName: "Jane", lastName: "Smith", client: "client1" }
      ];
      (contactService.getContactsByClient as jest.Mock).mockResolvedValue(
        mockContacts
      );
      mockReq.params = { clientId: "client1" };

      await getContactsByClient(mockReq as Request, mockRes as Response);

      expect(contactService.getContactsByClient).toHaveBeenCalledWith(
        "client1"
      );
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        count: 2,
        data: mockContacts
      });
    });

    it("should return 500 when service throws error", async () => {
      (contactService.getContactsByClient as jest.Mock).mockRejectedValue(
        new Error("DB Error")
      );
      mockReq.params = { clientId: "client1" };

      await getContactsByClient(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: "Erreur serveur"
      });
      expect(logger.error).toHaveBeenCalled();
    });
  });
});
