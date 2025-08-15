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

jest.mock("../services/client.service");
jest.mock("../services/contact.service");
jest.mock("../utils/logger");

import { Request, Response } from "express";
import {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
  getClientsByCompany,
  getClientsByTeam
} from "../controllers/client.controller";
import * as clientService from "../services/client.service";
import * as contactService from "../services/contact.service";
import { logger } from "../utils/logger";

describe("ClientController", () => {
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

  describe("getAllClients", () => {
    it("should return 200 with clients list when successful", async () => {
      const mockClients = [
        { id: 1, name: "Client 1", company: "Company 1" },
        { id: 2, name: "Client 2", company: "Company 2" }
      ];
      (clientService.getAllClients as jest.Mock).mockResolvedValue(mockClients);

      await getAllClients(mockReq as Request, mockRes as Response);

      expect(clientService.getAllClients).toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        count: 2,
        data: mockClients
      });
    });

    it("should return 500 when service throws error", async () => {
      (clientService.getAllClients as jest.Mock).mockRejectedValue(
        new Error("DB Error")
      );

      await getAllClients(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: "Erreur serveur"
      });
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("getClientById", () => {
    it("should return 200 with client when found", async () => {
      const mockClient = {
        id: 1,
        name: "Test Client",
        company: "Test Company"
      };
      (clientService.getClientById as jest.Mock).mockResolvedValue(mockClient);
      mockReq.params = { id: "1" };

      await getClientById(mockReq as Request, mockRes as Response);

      expect(clientService.getClientById).toHaveBeenCalledWith("1");
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: mockClient
      });
    });

    it("should return 404 when client not found", async () => {
      (clientService.getClientById as jest.Mock).mockResolvedValue(null);
      mockReq.params = { id: "999" };

      await getClientById(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: "Client non trouvé"
      });
    });

    it("should return 500 when service throws error", async () => {
      (clientService.getClientById as jest.Mock).mockRejectedValue(
        new Error("DB Error")
      );
      mockReq.params = { id: "1" };

      await getClientById(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: "Erreur serveur"
      });
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("createClient", () => {
    it("should return 400 when name is missing", async () => {
      mockReq.body = { company: "Test Company" };

      await createClient(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: "Les champs nom et entreprise sont obligatoires"
      });
    });

    it("should return 400 when company is missing", async () => {
      mockReq.body = { name: "Test Client" };

      await createClient(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: "Les champs nom et entreprise sont obligatoires"
      });
    });

    it("should create client successfully without contacts", async () => {
      const mockClient = {
        _id: "client1",
        name: "Test Client",
        company: "Test Company"
      };
      (clientService.createClient as jest.Mock).mockResolvedValue(mockClient);
      (clientService.getClientById as jest.Mock).mockResolvedValue(mockClient);

      mockReq.body = { name: "Test Client", company: "Test Company" };

      await createClient(mockReq as Request, mockRes as Response);

      expect(clientService.createClient).toHaveBeenCalledWith({
        name: "Test Client",
        company: "Test Company"
      });
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: {
          client: mockClient,
          contacts: [],
          contactsCount: 0
        },
        message: "Client créé avec succès"
      });
    });

    it("should create client successfully with contacts", async () => {
      const mockClient = {
        _id: "client1",
        name: "Test Client",
        company: "Test Company"
      };
      const mockContact = {
        _id: "contact1",
        firstName: "John",
        lastName: "Doe"
      };

      (clientService.createClient as jest.Mock).mockResolvedValue(mockClient);
      (contactService.createContact as jest.Mock).mockResolvedValue(
        mockContact
      );
      (clientService.addContactToClient as jest.Mock).mockResolvedValue(true);
      (clientService.getClientById as jest.Mock).mockResolvedValue(mockClient);

      mockReq.body = {
        name: "Test Client",
        company: "Test Company",
        contacts: [
          { firstName: "John", lastName: "Doe", email: "john@test.com" }
        ]
      };

      await createClient(mockReq as Request, mockRes as Response);

      expect(contactService.createContact).toHaveBeenCalledWith({
        firstName: "John",
        lastName: "Doe",
        email: "john@test.com",
        client: "client1",
        company: "Test Company"
      });
      expect(clientService.addContactToClient).toHaveBeenCalledWith(
        "client1",
        "contact1"
      );
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: {
          client: mockClient,
          contacts: [mockContact],
          contactsCount: 1
        },
        message: "Client créé avec succès avec 1 contacts"
      });
    });

    it("should continue creating other contacts when one contact creation fails", async () => {
      const mockClient = {
        _id: "client1",
        name: "Test Client",
        company: "Test Company"
      };
      const mockContact2 = {
        _id: "contact2",
        firstName: "Jane",
        lastName: "Doe"
      };

      (clientService.createClient as jest.Mock).mockResolvedValue(mockClient);
      (contactService.createContact as jest.Mock)
        .mockRejectedValueOnce(new Error("Contact creation failed"))
        .mockResolvedValueOnce(mockContact2);
      (clientService.addContactToClient as jest.Mock).mockResolvedValue(true);
      (clientService.getClientById as jest.Mock).mockResolvedValue(mockClient);

      mockReq.body = {
        name: "Test Client",
        company: "Test Company",
        contacts: [
          { firstName: "John", lastName: "Doe", email: "john@test.com" },
          { firstName: "Jane", lastName: "Doe", email: "jane@test.com" }
        ]
      };

      await createClient(mockReq as Request, mockRes as Response);

      expect(contactService.createContact).toHaveBeenCalledTimes(2);
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: {
          client: mockClient,
          contacts: [mockContact2],
          contactsCount: 1
        },
        message: "Client créé avec succès avec 1 contacts"
      });
    });

    it("should return 500 when client creation fails", async () => {
      (clientService.createClient as jest.Mock).mockRejectedValue(
        new Error("DB Error")
      );
      mockReq.body = { name: "Test Client", company: "Test Company" };

      await createClient(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        message: "Erreur lors de la création du client",
        error: "DB Error"
      });
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("updateClient", () => {
    it("should return 404 when client not found", async () => {
      (clientService.updateClient as jest.Mock).mockResolvedValue(null);
      mockReq.params = { id: "999" };
      mockReq.body = { name: "Updated Client" };

      await updateClient(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: "Client non trouvé"
      });
    });

    it("should update client successfully without contacts", async () => {
      const mockClient = {
        _id: "client1",
        name: "Updated Client",
        company: "Test Company"
      };
      (clientService.updateClient as jest.Mock).mockResolvedValue(mockClient);
      (clientService.getClientById as jest.Mock).mockResolvedValue(mockClient);

      mockReq.params = { id: "client1" };
      mockReq.body = { name: "Updated Client", company: "Test Company" };

      await updateClient(mockReq as Request, mockRes as Response);

      expect(clientService.updateClient).toHaveBeenCalledWith("client1", {
        name: "Updated Client",
        company: "Test Company"
      });
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: {
          client: mockClient,
          contacts: [],
          contactsCount: 0
        },
        message: "Client mis à jour avec succès"
      });
    });

    it("should update client and create new contact", async () => {
      const mockClient = {
        _id: "client1",
        name: "Updated Client",
        company: "Test Company"
      };
      const mockNewContact = {
        _id: "contact2",
        firstName: "New",
        lastName: "Contact"
      };

      (clientService.updateClient as jest.Mock).mockResolvedValue(mockClient);
      (contactService.getContactsByClient as jest.Mock).mockResolvedValue([]);
      (contactService.createContact as jest.Mock).mockResolvedValue(
        mockNewContact
      );
      (clientService.addContactToClient as jest.Mock).mockResolvedValue(true);
      (clientService.getClientById as jest.Mock).mockResolvedValue(mockClient);

      mockReq.params = { id: "client1" };
      mockReq.body = {
        name: "Updated Client",
        company: "Test Company",
        contacts: [
          { firstName: "New", lastName: "Contact", email: "new@test.com" }
        ]
      };

      await updateClient(mockReq as Request, mockRes as Response);

      expect(contactService.createContact).toHaveBeenCalledWith({
        firstName: "New",
        lastName: "Contact",
        email: "new@test.com",
        client: "client1",
        company: "Test Company"
      });
      expect(clientService.addContactToClient).toHaveBeenCalledWith(
        "client1",
        "contact2"
      );
      expect(mockStatus).toHaveBeenCalledWith(200);
    });

    it("should update existing contact", async () => {
      const mockClient = {
        _id: "client1",
        name: "Updated Client",
        company: "Test Company"
      };
      const existingContact = {
        _id: "contact1",
        firstName: "Existing",
        lastName: "Contact"
      };
      const updatedContact = {
        _id: "contact1",
        firstName: "Updated",
        lastName: "Contact"
      };

      (clientService.updateClient as jest.Mock).mockResolvedValue(mockClient);
      (contactService.getContactsByClient as jest.Mock).mockResolvedValue([
        existingContact
      ]);
      (contactService.updateContact as jest.Mock).mockResolvedValue(
        updatedContact
      );
      (clientService.getClientById as jest.Mock).mockResolvedValue(mockClient);

      mockReq.params = { id: "client1" };
      mockReq.body = {
        name: "Updated Client",
        company: "Test Company",
        contacts: [
          { _id: "contact1", firstName: "Updated", lastName: "Contact" }
        ]
      };

      await updateClient(mockReq as Request, mockRes as Response);

      expect(contactService.updateContact).toHaveBeenCalledWith("contact1", {
        _id: "contact1",
        firstName: "Updated",
        lastName: "Contact",
        client: "client1",
        company: "Test Company"
      });
      expect(mockStatus).toHaveBeenCalledWith(200);
    });

    it("should return 500 when update fails", async () => {
      (clientService.updateClient as jest.Mock).mockRejectedValue(
        new Error("DB Error")
      );
      mockReq.params = { id: "client1" };
      mockReq.body = { name: "Updated Client" };

      await updateClient(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: "Erreur serveur"
      });
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("deleteClient", () => {
    it("should delete client successfully", async () => {
      const mockClient = { id: 1, name: "Deleted Client" };
      (clientService.deleteClient as jest.Mock).mockResolvedValue(mockClient);
      mockReq.params = { id: "1" };

      await deleteClient(mockReq as Request, mockRes as Response);

      expect(clientService.deleteClient).toHaveBeenCalledWith("1");
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: mockClient
      });
    });

    it("should return 404 when client not found", async () => {
      (clientService.deleteClient as jest.Mock).mockResolvedValue(null);
      mockReq.params = { id: "999" };

      await deleteClient(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: "Client non trouvé"
      });
    });

    it("should return 500 when deletion fails", async () => {
      (clientService.deleteClient as jest.Mock).mockRejectedValue(
        new Error("DB Error")
      );
      mockReq.params = { id: "1" };

      await deleteClient(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: "Erreur serveur"
      });
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("getClientsByCompany", () => {
    it("should return clients by company successfully", async () => {
      const mockClients = [{ id: 1, name: "Client 1", company: "Company 1" }];
      (clientService.getClientsByCompany as jest.Mock).mockResolvedValue(
        mockClients
      );
      mockReq.params = { companyId: "company1" };

      await getClientsByCompany(mockReq as Request, mockRes as Response);

      expect(clientService.getClientsByCompany).toHaveBeenCalledWith(
        "company1"
      );
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        count: 1,
        data: mockClients
      });
    });

    it("should return 500 when service throws error", async () => {
      (clientService.getClientsByCompany as jest.Mock).mockRejectedValue(
        new Error("DB Error")
      );
      mockReq.params = { companyId: "company1" };

      await getClientsByCompany(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: "Erreur serveur"
      });
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("getClientsByTeam", () => {
    it("should return clients by team successfully", async () => {
      const mockClients = [{ id: 1, name: "Client 1", team: "Team 1" }];
      (clientService.getClientsByTeam as jest.Mock).mockResolvedValue(
        mockClients
      );
      mockReq.params = { teamId: "team1" };

      await getClientsByTeam(mockReq as Request, mockRes as Response);

      expect(clientService.getClientsByTeam).toHaveBeenCalledWith("team1");
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        count: 1,
        data: mockClients
      });
    });

    it("should return 500 when service throws error", async () => {
      (clientService.getClientsByTeam as jest.Mock).mockRejectedValue(
        new Error("DB Error")
      );
      mockReq.params = { teamId: "team1" };

      await getClientsByTeam(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: "Erreur serveur"
      });
      expect(logger.error).toHaveBeenCalled();
    });
  });
});
