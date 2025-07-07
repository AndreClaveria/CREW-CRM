// src/hooks/useContactManagement.ts
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getContactsByClient, Contact } from "@/services/contact.service";
import { getClientById, Client } from "@/services/client.service";

interface UseContactManagementProps {
  clientId: string;
}

interface UseContactManagementReturn {
  contacts: Contact[];
  client: Client | null;
  error: string | null;
  isLoadingContacts: boolean;
  handleStatusChange: (contactId: string, newStatus: boolean) => void;
  navigateToClientsList: (companyId?: string) => void;
  navigateToAddContact: (companyId?: string, clientId?: string) => void;
}

export const useContactManagement = ({
  clientId,
}: UseContactManagementProps): UseContactManagementReturn => {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [client, setClient] = useState<Client | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);

  // Fonctions de navigation
  const navigateToClientsList = (companyId?: string) => {
    const routePrefix = user?.role === "admin" ? "admin" : "manager";
    const targetCompanyId = companyId || client?.company;
    router.push(
      `/dashboard/${routePrefix}/manage/company/clients/${targetCompanyId}`
    );
  };

  const navigateToAddContact = (
    companyId?: string,
    targetClientId?: string
  ) => {
    const routePrefix = user?.role === "admin" ? "admin" : "manager";
    const targetCompanyId = companyId || client?.company;
    const clientIdToUse = targetClientId || clientId;
    router.push(
      `/dashboard/${routePrefix}/manage/company/clients/${targetCompanyId}/edit/${clientIdToUse}?step=4`
    );
  };

  // Vérification de rôle (admin ou manager)
  useEffect(() => {
    if (!isLoading && user && !["admin", "manager"].includes(user.role)) {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  // Chargement des données du client et des contacts
  useEffect(() => {
    const fetchClientDetails = async () => {
      try {
        const clientData = await getClientById(clientId);
        setClient(clientData);
      } catch (err: any) {
        console.error("Erreur lors de la récupération du client:", err);
        setError("Impossible de charger les détails du client.");
      }
    };

    const fetchContacts = async () => {
      setIsLoadingContacts(true);
      try {
        console.log(
          "Début de la récupération des contacts pour le client:",
          clientId
        );
        const response = await getContactsByClient(clientId);
        console.log("Réponse reçue pour les contacts:", response);

        // Extraction des contacts de la réponse selon sa structure
        let contactsData;
        if (
          response &&
          typeof response === "object" &&
          "data" in response &&
          Array.isArray(response.data)
        ) {
          contactsData = response.data;
          console.log("Contacts extraits de la structure d'API:", contactsData);
        } else if (Array.isArray(response)) {
          contactsData = response;
          console.log(
            "Contacts directement reçus comme tableau:",
            contactsData
          );
        } else {
          console.error("Format de réponse non reconnu:", response);
          contactsData = [];
        }

        setContacts(contactsData);
      } catch (err: any) {
        console.error("Erreur lors de la récupération des contacts:", err);
        setError(
          err.message ||
            "Impossible de charger les contacts. Veuillez réessayer."
        );
        setContacts([]); // Initialiser avec un tableau vide en cas d'erreur
      } finally {
        setIsLoadingContacts(false);
      }
    };

    if (user && ["admin", "manager"].includes(user.role)) {
      fetchClientDetails();
      fetchContacts();
    }
  }, [clientId, user]);

  // Gestionnaire pour le changement de statut d'un contact
  const handleStatusChange = (contactId: string, newStatus: boolean) => {
    setContacts((prevContacts) =>
      prevContacts.map((c) =>
        c._id === contactId ? { ...c, isActive: newStatus } : c
      )
    );
  };

  return {
    contacts,
    client,
    error,
    isLoadingContacts,
    handleStatusChange,
    navigateToClientsList,
    navigateToAddContact,
  };
};
