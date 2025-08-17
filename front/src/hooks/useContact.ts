import { useState, useEffect } from "react";
import { Contact, getContactsByCompany } from "@/services/contact.service";

interface UseContactProps {
  companyId?: string;
}

interface UseContactReturn {
  contacts: Contact[];
  loading: boolean;
  error: string | null;
}

export const useContact = ({
  companyId,
}: UseContactProps): UseContactReturn => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContacts = async () => {
      if (!companyId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getContactsByCompany(companyId);

        // Gérer différents formats de réponse
        let contactsData: Contact[];
        if (response && typeof response === "object" && "data" in response) {
          contactsData = (response as { data: Contact[] }).data;
        } else if (Array.isArray(response)) {
          contactsData = response as Contact[];
        } else {
          contactsData = [];
        }

        setContacts(contactsData);
        setError(null);
      } catch (err) {
        console.error("Erreur lors de la récupération des contacts:", err);
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue"
        );
        setContacts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [companyId]);

  return { contacts, loading, error };
};
