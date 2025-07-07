// src/hooks/useContactClients.ts
import { useState, useEffect } from "react";
import { Contact } from "@/services/contact.service";
import { getClientById, Client } from "@/services/client.service";

interface UseContactClientsReturn {
  clients: { [key: string]: Client };
  loading: boolean;
  getClientName: (contact: Contact) => string;
}

/**
 * Hook pour gérer le chargement et l'accès aux clients associés aux contacts
 */
export const useContactClients = (
  contacts: Contact[]
): UseContactClientsReturn => {
  const [clients, setClients] = useState<{ [key: string]: Client }>({});
  const [loading, setLoading] = useState<boolean>(false);

  // Chargement des clients
  useEffect(() => {
    const fetchClients = async () => {
      if (!contacts || contacts.length === 0) return;

      setLoading(true);
      const clientMap: { [key: string]: Client } = {};

      // Création d'un ensemble pour éviter les doublons
      const clientIds = new Set<string>();

      // Collecte des IDs uniques des clients
      contacts.forEach((contact) => {
        if (contact.client) {
          clientIds.add(contact.client);
        }
      });

      // Récupération des détails pour chaque client
      try {
        const promises = Array.from(clientIds).map(async (clientId) => {
          try {
            const clientData = await getClientById(clientId);
            clientMap[clientId] = clientData;
          } catch (error) {
            console.error(
              `Erreur lors de la récupération du client ${clientId}:`,
              error
            );
          }
        });

        await Promise.all(promises);
        setClients(clientMap);
      } catch (error) {
        console.error("Erreur lors de la récupération des clients:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [contacts]);

  // Fonction pour obtenir le nom du client
  const getClientName = (contact: Contact): string => {
    if (!contact.client) return "Non associé";

    if (clients[contact.client]) {
      return clients[contact.client].name;
    }

    return "Chargement...";
  };

  return {
    clients,
    loading,
    getClientName,
  };
};
