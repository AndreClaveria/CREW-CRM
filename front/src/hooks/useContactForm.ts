import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  Contact,
  getContactById,
  updateContact,
  createContact,
} from "@/services/contact.service";
import { getClientById } from "@/services/client.service";
import { useNavigation } from "@/hooks/useNavigation";

interface ContactFormData {
  firstName: string;
  lastName: string;
  position?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  isPrimary?: boolean;
  notes?: string;
}

export const useContactForm = (companyId: string, contactId?: string) => {
  const router = useRouter();
  const { user } = useAuth();
  const { navigateToContact } = useNavigation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: "",
    lastName: "",
    position: "",
    email: "",
    phone: "",
    mobile: "",
    isPrimary: false,
    notes: "",
  });

  useEffect(() => {
    const fetchContact = async () => {
      if (!contactId) {
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching contact with ID:", contactId);
        const contact = await getContactById(contactId);
        console.log("Contact data received:", contact);

        if (contact) {
          setFormData({
            firstName: contact.firstName || "",
            lastName: contact.lastName || "",
            position: contact.position || "",
            email: contact.email || "",
            phone: contact.phone || "",
            mobile: contact.mobile || "",
            isPrimary: contact.isPrimary || false,
            notes: contact.notes || "",
          });
          console.log("Form data updated:", formData);
        } else {
          console.log("No contact found with ID:", contactId);
          setError("Contact non trouvé");
        }
      } catch (err) {
        console.error("Error fetching contact:", err);
        setError("Erreur lors du chargement du contact");
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
  }, [contactId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.firstName || !formData.lastName) {
      setError("Le prénom et le nom sont obligatoires");
      return;
    }

    if (!companyId) {
      setError("L'ID de l'entreprise est manquant");
      return;
    }

    try {
      console.log("Préparation des données du contact:", formData);

      const contactData: Partial<Contact> = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        position: formData.position?.trim() || undefined,
        email: formData.email?.trim() || undefined,
        phone: formData.phone?.trim() || undefined,
        mobile: formData.mobile?.trim() || undefined,
        isPrimary: formData.isPrimary || false,
        notes: formData.notes?.trim() || undefined,
        company: companyId,
        isActive: true,
        client: companyId,
      };

      if (contactData.email && !contactData.email.includes("@")) {
        setError("L'adresse email n'est pas valide");
        return;
      }

      console.log("Données du contact à envoyer:", contactData);

      if (contactId) {
        await updateContact(contactId, contactData);
        setSuccess("Contact mis à jour avec succès");
      } else {
        const newContact = await createContact(contactData);
        console.log("Contact créé avec succès:", newContact);
        setSuccess("Contact créé avec succès");
      }

      // Redirection après 2 secondes
      setTimeout(() => {
        navigateToContact("list");
      }, 2000);
    } catch (err: any) {
      console.error("Erreur lors de la manipulation du contact:", err);
      setError(
        err.message ||
          (contactId
            ? "Erreur lors de la mise à jour du contact"
            : "Erreur lors de la création du contact")
      );
    }
  };

  return {
    formData,
    loading,
    error,
    success,
    handleChange,
    handleSubmit,
    isEditMode: !!contactId,
  };
};
