import { Request, Response } from "express";
import * as clientService from "../services/client.service";
import * as contactService from "../services/contact.service";
import { IClientInput, IContactInput } from "../types";
import { logger } from "../utils/logger";

export const getAllClients = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const clients = await clientService.getAllClients();
    res.status(200).json({
      success: true,
      count: clients.length,
      data: clients
    });
  } catch (error) {
    logger.error("Error in getAllClients controller", error);
    res.status(500).json({
      success: false,
      error: "Erreur serveur"
    });
  }
};

export const getClientById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const client = await clientService.getClientById(req.params.id);
    if (!client) {
      res.status(404).json({
        success: false,
        error: "Client non trouvé"
      });
      return;
    }
    res.status(200).json({
      success: true,
      data: client
    });
  } catch (error) {
    logger.error(
      `Error in getClientById controller for id ${req.params.id}`,
      error
    );
    res.status(500).json({
      success: false,
      error: "Erreur serveur"
    });
  }
};

export const createClient = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { contacts, ...clientData } = req.body;

    if (!clientData.name || !clientData.company) {
      res.status(400).json({
        success: false,
        message: "Les champs nom et entreprise sont obligatoires"
      });
      return;
    }

    logger.info(`Création d'un nouveau client: ${clientData.name}`);

    const client = await clientService.createClient(clientData as IClientInput);

    const createdContacts = [];

    if (contacts && Array.isArray(contacts) && contacts.length > 0) {
      logger.info(
        `Création de ${contacts.length} contacts pour le client ${client._id}`
      );

      for (const contactData of contacts) {
        try {
          // Ajouter les références nécessaires
          const completeContactData: IContactInput = {
            ...contactData,
            client: client._id.toString(),
            company: client.company
          };

          // Créer le contact
          const contact =
            await contactService.createContact(completeContactData);
          createdContacts.push(contact);

          // Ajouter l'ID du contact au client
          await clientService.addContactToClient(
            client._id.toString(),
            contact._id.toString()
          );

          logger.info(
            `Contact créé avec succès: ${contact.firstName} ${contact.lastName}`
          );
        } catch (contactError) {
          logger.error(
            `Erreur lors de la création d'un contact pour le client ${client._id}:`,
            contactError
          );
          // On continue même en cas d'erreur sur un contact pour ne pas bloquer la création des autres
        }
      }
    }

    // Récupérer le client mis à jour avec tous les contacts
    const updatedClient = await clientService.getClientById(
      client._id.toString()
    );

    res.status(201).json({
      success: true,
      data: {
        client: updatedClient,
        contacts: createdContacts,
        contactsCount: createdContacts.length
      },
      message: `Client créé avec succès${createdContacts.length > 0 ? ` avec ${createdContacts.length} contacts` : ""}`
    });
  } catch (error) {
    logger.error("Erreur lors de la création du client:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création du client",
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

export const updateClient = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Extraire les contacts du body
    const { contacts, ...clientData } = req.body;

    console.log("Données client reçues pour mise à jour:", clientData);
    console.log("Contacts reçus pour mise à jour:", contacts);

    // Mettre à jour le client
    const client = await clientService.updateClient(req.params.id, clientData);
    if (!client) {
      res.status(404).json({
        success: false,
        error: "Client non trouvé"
      });
      return;
    }

    // Tableau pour stocker les contacts créés ou mis à jour
    const updatedContacts = [];

    // Gérer les contacts si présents
    if (contacts && Array.isArray(contacts) && contacts.length > 0) {
      logger.info(
        `Mise à jour de ${contacts.length} contacts pour le client ${client._id}`
      );

      // Récupérer les contacts existants du client pour pouvoir les comparer
      const existingContacts = await contactService.getContactsByClient(
        client._id.toString()
      );
      const existingContactMap = new Map();
      existingContacts.forEach((contact) => {
        if (contact._id) {
          existingContactMap.set(contact._id.toString(), contact);
        }
      });

      console.log(`${existingContacts.length} contacts existants trouvés`);

      // Traiter chaque contact du tableau reçu
      for (const contactData of contacts) {
        try {
          // Compléter les données du contact avec les références nécessaires
          const completeContactData = {
            ...contactData,
            client: client._id.toString(),
            company: client.company
          };

          let contact;

          // Si le contact a un ID, c'est une mise à jour
          if (
            contactData._id &&
            existingContactMap.has(contactData._id.toString())
          ) {
            logger.info(`Mise à jour du contact existant: ${contactData._id}`);
            contact = await contactService.updateContact(
              contactData._id.toString(),
              completeContactData
            );

            // Marquer comme traité en le supprimant de la map
            existingContactMap.delete(contactData._id.toString());
          } else {
            // Sinon c'est une création
            logger.info(
              `Création d'un nouveau contact pour le client ${client._id}`
            );
            contact = await contactService.createContact(completeContactData);

            // Ajouter l'ID du nouveau contact au client
            await clientService.addContactToClient(
              client._id.toString(),
              contact._id.toString()
            );
          }

          updatedContacts.push(contact);
        } catch (contactError) {
          logger.error(
            `Erreur lors du traitement d'un contact pour le client ${client._id}:`,
            contactError
          );
          // On continue même en cas d'erreur sur un contact pour ne pas bloquer les autres
        }
      }

      // Option: Désactiver les contacts qui n'ont plus été envoyés
      if (existingContactMap.size > 0) {
        logger.info(
          `${existingContactMap.size} contacts n'ont pas été inclus dans la mise à jour.`
        );

        for (const [contactId, contact] of existingContactMap.entries()) {
          try {
            logger.info(`Désactivation du contact: ${contactId}`);
            await contactService.updateContact(contactId, { isActive: false });
          } catch (updateError) {
            logger.error(
              `Erreur lors de la désactivation du contact ${contactId}:`,
              updateError
            );
          }
        }
      }
    }

    // Récupérer le client mis à jour avec toutes ses relations
    const updatedClient = await clientService.getClientById(
      client._id.toString()
    );

    res.status(200).json({
      success: true,
      data: {
        client: updatedClient,
        contacts: updatedContacts,
        contactsCount: updatedContacts.length
      },
      message: `Client mis à jour avec succès${updatedContacts.length > 0 ? ` avec ${updatedContacts.length} contacts` : ""}`
    });
  } catch (error) {
    logger.error(
      `Error in updateClient controller for id ${req.params.id}`,
      error
    );
    res.status(500).json({
      success: false,
      error: "Erreur serveur"
    });
  }
};

export const deleteClient = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const client = await clientService.deleteClient(req.params.id);
    if (!client) {
      res.status(404).json({
        success: false,
        error: "Client non trouvé"
      });
      return;
    }
    res.status(200).json({
      success: true,
      data: client
    });
  } catch (error) {
    logger.error(
      `Error in deleteClient controller for id ${req.params.id}`,
      error
    );
    res.status(500).json({
      success: false,
      error: "Erreur serveur"
    });
  }
};

export const getClientsByCompany = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const clients = await clientService.getClientsByCompany(
      req.params.companyId
    );
    res.status(200).json({
      success: true,
      count: clients.length,
      data: clients
    });
  } catch (error) {
    logger.error(
      `Error in getClientsByCompany controller for company ${req.params.companyId}`,
      error
    );
    res.status(500).json({
      success: false,
      error: "Erreur serveur"
    });
  }
};

export const getClientsByTeam = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const clients = await clientService.getClientsByTeam(req.params.teamId);
    res.status(200).json({
      success: true,
      count: clients.length,
      data: clients
    });
  } catch (error) {
    logger.error(
      `Error in getClientsByTeam controller for team ${req.params.teamId}`,
      error
    );
    res.status(500).json({
      success: false,
      error: "Erreur serveur"
    });
  }
};
