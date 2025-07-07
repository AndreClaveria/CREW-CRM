import { useState, useEffect } from "react";
import { getContactById } from "@/services/contact.service";
import { Contact } from "@/types/index";

interface UseContactDetailsProps {
  contactId: string;
}

interface UseContactDetailsReturn {
  contact: Contact | null;
  loading: boolean;
  error: string | null;
}

export const useContactDetails = ({
  contactId,
}: UseContactDetailsProps): UseContactDetailsReturn => {
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContactDetails = async () => {
      if (!contactId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const contactData = await getContactById(contactId);
        if (!contactData.client) {
          throw new Error("Le contact n'a pas de client associé.");
        }
        setContact(contactData as Contact);
        setError(null);
      } catch (err) {
        console.error("Erreur lors de la récupération du contact:", err);
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue"
        );
        setContact(null);
      } finally {
        setLoading(false);
      }
    };

    fetchContactDetails();
  }, [contactId]);

  return { contact, loading, error };
};
