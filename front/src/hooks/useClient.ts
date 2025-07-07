// src/hooks/useClient.ts
import { useState, useEffect } from "react";
import {
  getClientsByCompany,
  getClientsByTeam,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
  Client,
  ClientCreateInput,
} from "@/services/client.service";

interface UseClientProps {
  companyId?: string;
  teamId?: string;
  clientId?: string;
}

interface UseClientReturn {
  clients: Client[];
  client: Client | null;
  isLoading: boolean;
  error: string | null;
  loadClients: (companyId: string) => Promise<void>;
  loadClientsByTeam: (teamId: string) => Promise<void>;
  loadClient: (clientId: string) => Promise<void>;
  createNewClient: (clientData: ClientCreateInput) => Promise<Client | null>;
  updateClientData: (
    clientId: string,
    clientData: Partial<Client>
  ) => Promise<boolean>;
  deleteClientById: (clientId: string) => Promise<boolean>;
  resetError: () => void;
  setClient: (client: Client | null) => void; // ✅ NOUVELLE FONCTION AJOUTÉE
}

export const useClient = ({
  companyId,
  teamId,
  clientId,
}: UseClientProps = {}): UseClientReturn => {
  const [clients, setClients] = useState<Client[]>([]);
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour réinitialiser les erreurs
  const resetError = () => setError(null);

  // ✅ FONCTION POUR MISE À JOUR DIRECTE DU CLIENT
  const setClientDirectly = (newClient: Client | null) => {
    setClient(newClient);
  };

  // Charger tous les clients d'une entreprise
  const loadClients = async (companyId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const clientsData = await getClientsByCompany(companyId);

      // Vérifier que clientsData est bien un tableau
      if (Array.isArray(clientsData)) {
        setClients(clientsData);
      } else {
        console.error(
          "Les données reçues ne sont pas un tableau:",
          clientsData
        );
        setClients([]); // Initialiser avec un tableau vide
        setError(
          "Format de données incorrect. Veuillez contacter l'administrateur."
        );
      }
    } catch (err: any) {
      console.error(
        `Erreur lors du chargement des clients pour l'entreprise ${companyId}:`,
        err
      );
      setError(err.message || "Impossible de charger les clients");
      setClients([]); // Initialiser avec un tableau vide en cas d'erreur
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les clients d'une équipe
  const loadClientsByTeam = async (teamId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const clientsData = await getClientsByTeam(teamId);
      setClients(Array.isArray(clientsData) ? clientsData : []);
    } catch (err: any) {
      console.error(
        `Erreur lors du chargement des clients pour l'équipe ${teamId}:`,
        err
      );
      setError(err.message || "Impossible de charger les clients de l'équipe");
      setClients([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Charger un client spécifique
  const loadClient = async (clientId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const clientData = await getClientById(clientId);
      setClient(clientData);
    } catch (err: any) {
      console.error(`Erreur lors du chargement du client ${clientId}:`, err);
      setError(err.message || "Impossible de charger les données du client");
      setClient(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Créer un nouveau client
  const createNewClient = async (
    clientData: ClientCreateInput
  ): Promise<Client | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const newClient = await createClient(clientData);

      // Mettre à jour la liste locale des clients
      setClients((prev) => [...prev, newClient]);

      return newClient;
    } catch (err: any) {
      console.error("Erreur lors de la création du client:", err);
      setError(err.message || "Impossible de créer le client");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Mettre à jour un client
  const updateClientData = async (
    clientId: string,
    clientData: Partial<Client>
  ): Promise<boolean> => {
    // ✅ NE PAS METTRE setIsLoading(true) pour éviter le flicker
    setError(null);

    try {
      console.log(`🔄 Mise à jour du client ${clientId} avec:`, clientData);

      const updatedClient = await updateClient(clientId, clientData);

      // ✅ AMÉLIORATION : Mettre à jour les données locales CORRECTEMENT
      setClient((prev) => {
        if (prev && prev._id === clientId) {
          // Merger les nouvelles données avec les anciennes au lieu de remplacer
          const merged = { ...prev, ...updatedClient };
          console.log("✅ Client mis à jour dans le state:", merged);
          return merged;
        }
        return prev;
      });

      setClients((prev) =>
        prev.map((c) => {
          if (c._id === clientId) {
            // Même chose pour la liste des clients
            return { ...c, ...updatedClient };
          }
          return c;
        })
      );

      console.log("✅ Mise à jour réussie dans useClient");
      return true;
    } catch (err: any) {
      console.error(
        `❌ Erreur lors de la mise à jour du client ${clientId}:`,
        err
      );
      setError(err.message || "Impossible de mettre à jour le client");
      return false;
    }
    // ✅ PAS DE setIsLoading(false) ici pour éviter les re-renders inutiles
  };

  // Supprimer un client
  const deleteClientById = async (clientId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await deleteClient(clientId);

      // Mettre à jour les données locales
      setClients((prev) => prev.filter((c) => c._id !== clientId));
      if (client && client._id === clientId) {
        setClient(null);
      }

      return true;
    } catch (err: any) {
      console.error(
        `Erreur lors de la suppression du client ${clientId}:`,
        err
      );
      setError(err.message || "Impossible de supprimer le client");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Effet pour charger les données initiales
  useEffect(() => {
    if (clientId) {
      loadClient(clientId);
    } else if (companyId) {
      loadClients(companyId);
    } else if (teamId) {
      loadClientsByTeam(teamId);
    }
  }, [clientId, companyId, teamId]);

  return {
    clients,
    client,
    isLoading,
    error,
    loadClients,
    loadClientsByTeam,
    loadClient,
    createNewClient,
    updateClientData,
    deleteClientById,
    resetError,
    setClient: setClientDirectly, // ✅ EXPOSER LA FONCTION setClient
  };
};
