// src/hooks/useClientForm.ts
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  createClient,
  updateClient,
  getClientById,
  Client,
} from "@/services/client.service";
import { getCompanyById, Company } from "@/services/company.service";
import { getAllUsers, User } from "@/services/user.service";
import { getTeamsByCompany, Team } from "@/services/team.service";
import { getContactsByClient } from "@/services/contact.service";
import { ContactFormData } from "@/components/forms/pipeline/contacts/type";

interface ClientFormData {
  name: string;
  description: string;
  sector: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    zipCode: string;
    country: string;
  };
  assignedTo: string;
  team: string;
  goodForCustomer: number;
  isActive: boolean;
}

interface UseClientFormProps {
  mode: "create" | "edit";
  companyId: string;
  clientId?: string;
}

interface UseClientFormReturn {
  // État et statut
  formData: ClientFormData;
  contacts: ContactFormData[];
  company: Company | null;
  users: User[];
  teams: Team[];
  originalClient: Client | null;
  error: string | null;
  success: string | null;
  dataLoading: boolean;

  // Gestion des étapes
  currentStep: number;
  totalSteps: number;
  steps: Array<{ number: number; label: string }>;
  progressPercentage: number;
  nextStep: () => void;
  prevStep: () => void;

  // Gestion des données
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;

  // Gestion des contacts
  addContact: () => void;
  removeContact: (index: number) => void;
  handleContactChange: (
    index: number,
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;

  // Soumission
  handleSubmit: (e: React.FormEvent) => Promise<void>;

  // Helpers
  findUserById: (id: string) => string;
  findTeamById: (id: string) => string;
}

/**
 * Hook personnalisé pour gérer la logique du formulaire client
 */
export const useClientForm = ({
  mode,
  companyId,
  clientId,
}: UseClientFormProps): UseClientFormReturn => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading, setLoadingWithMessage } = useAuth();
  const stepParam = searchParams.get("step");
  const initialStep = stepParam ? parseInt(stepParam) : 1;
  const [currentStep, setCurrentStep] = useState(
    initialStep > 0 && initialStep <= 5 ? initialStep : 1
  );

  // États généraux
  const [company, setCompany] = useState<Company | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [originalClient, setOriginalClient] = useState<Client | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // État du formulaire
  const [formData, setFormData] = useState<ClientFormData>({
    name: "",
    description: "",
    sector: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      zipCode: "",
      country: "",
    },
    assignedTo: "",
    team: "",
    goodForCustomer: 50,
    isActive: true,
  });

  // État des contacts
  const [contacts, setContacts] = useState<ContactFormData[]>([]);

  // État pour la gestion des étapes
  const totalSteps = 5;

  // Définition des étapes
  const steps = [
    { number: 1, label: "Informations" },
    { number: 2, label: "Coordonnées & Adresse" },
    { number: 3, label: "Attribution" },
    { number: 4, label: "Contacts" },
    { number: 5, label: "Récapitulatif" },
  ];

  // Calcul du pourcentage de progression
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  // Vérification de l'authentification
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  // Chargement des données initiales
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!user) {
        return;
      }

      try {
        setDataLoading(true);

        // Récupération des détails de l'entreprise
        const companyData = await getCompanyById(companyId);
        if (isMounted) setCompany(companyData);

        // Récupération des utilisateurs
        const usersData = await getAllUsers();
        if (isMounted) setUsers(usersData);

        // Récupération des équipes de l'entreprise
        const teamsData = await getTeamsByCompany(companyId);
        if (isMounted) setTeams(teamsData);

        // En mode édition, charger les données du client
        if (mode === "edit" && clientId) {
          const clientData = await getClientById(clientId);

          if (isMounted) {
            setOriginalClient(clientData);

            // Vérifier et extraire correctement les valeurs des propriétés
            const assignedToId =
              typeof clientData.assignedTo === "object" && clientData.assignedTo
                ? clientData.assignedTo
                : clientData.assignedTo;

            const teamId =
              typeof clientData.team === "object" && clientData.team
                ? clientData.team
                : clientData.team;

            // Mise à jour du formulaire avec les données du client
            setFormData({
              name: clientData.name || "",
              description: clientData.description || "",
              sector: clientData.sector || "",
              email: clientData.email || "",
              phone: clientData.phone || "",
              address: {
                street: clientData.address?.street || "",
                city: clientData.address?.city || "",
                zipCode: clientData.address?.zipCode || "",
                country: clientData.address?.country || "",
              },
              assignedTo: assignedToId || "",
              team: teamId || "",
              goodForCustomer: clientData.goodForCustomer || 50,
              isActive:
                clientData.isActive !== undefined ? clientData.isActive : true,
            });

            // Chargement des contacts du client
            try {
              const contactsData = await getContactsByClient(clientId);

              if (
                contactsData &&
                typeof contactsData === "object" &&
                "data" in contactsData &&
                Array.isArray(contactsData.data)
              ) {
                if (isMounted) {
                  setContacts(
                    contactsData.data.map((contact: any) => ({
                      firstName: contact.firstName || "",
                      lastName: contact.lastName || "",
                      email: contact.email || "",
                      phone: contact.phone || "",
                      position: contact.position || "",
                      isMainContact: contact.isMainContact || false,
                    }))
                  );
                }
              } else if (Array.isArray(contactsData)) {
                if (isMounted) {
                  setContacts(
                    contactsData.map((contact: any) => ({
                      firstName: contact.firstName || "",
                      lastName: contact.lastName || "",
                      email: contact.email || "",
                      phone: contact.phone || "",
                      position: contact.position || "",
                      isMainContact: contact.isMainContact || false,
                    }))
                  );
                }
              }
            } catch (err) {
              console.error("Erreur lors du chargement des contacts:", err);
              if (isMounted) {
                setContacts([]);
              }
            }
          }
        }
      } catch (err) {
        console.error("Erreur lors du chargement des données:", err);
        if (isMounted) {
          setError("Impossible de charger les données nécessaires");
        }
      } finally {
        if (isMounted) {
          setDataLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [mode, companyId, clientId, user]);

  // Navigation entre les étapes
  const nextStep = () => {
    // Validation de l'étape actuelle avant de passer à la suivante
    if (currentStep === 1 && !formData.name) {
      setError("Le nom du client est obligatoire");
      return;
    }

    setError(null);
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Gestion des changements des champs du formulaire client
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name.includes(".")) {
      // Gestion des champs imbriqués (comme address.street)
      const [parent, child] = name.split(".");
      setFormData((prev) => {
        // Utiliser une assertion de type pour indiquer à TypeScript que
        // prev[parent] est un objet Record<string, any>
        const parentObj = prev[parent as keyof typeof prev] as Record<
          string,
          any
        >;

        return {
          ...prev,
          [parent]: {
            ...parentObj,
            [child]: value,
          },
        };
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Gestion des contacts
  const addContact = () => {
    setContacts([
      ...contacts,
      {
        firstName: "",
        lastName: "",
        position: "",
        email: "",
        phone: "",
        mobile: "",
        isPrimary: false,
        notes: "",
      },
    ]);
  };

  const removeContact = (index: number) => {
    setContacts(contacts.filter((_, i) => i !== index));
  };

  const handleContactChange = (
    index: number,
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const newContacts = [...contacts];

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      newContacts[index] = { ...newContacts[index], [name]: checked };
    } else {
      newContacts[index] = { ...newContacts[index], [name]: value };
    }

    setContacts(newContacts);
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation finale
    if (!formData.name) {
      setError("Le nom du client est obligatoire");
      return;
    }

    try {
      const actionText = mode === "create" ? "Création" : "Mise à jour";
      setLoadingWithMessage(true, `${actionText} du client...`);

      // Filtrer les contacts valides
      const validContacts = contacts
        .filter((c) => c.firstName && c.lastName)
        .map((c) => ({
          _id: c._id, // Conserver l'ID pour les contacts existants
          firstName: c.firstName,
          lastName: c.lastName,
          position: c.position || undefined,
          email: c.email || undefined,
          phone: c.phone || undefined,
          mobile: c.mobile || undefined,
          isPrimary: c.isPrimary || false,
          notes: c.notes || undefined,
        }));

      // Préparer des données client épurées
      const clientData = {
        name: formData.name,
        description: formData.description || undefined,
        sector: formData.sector || undefined,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        address:
          formData.address.street ||
          formData.address.city ||
          formData.address.zipCode ||
          formData.address.country
            ? {
                street: formData.address.street || undefined,
                city: formData.address.city || undefined,
                zipCode: formData.address.zipCode || undefined,
                country: formData.address.country || undefined,
              }
            : undefined,
        company: companyId,
        team: formData.team || undefined,
        assignedTo: formData.assignedTo || undefined,
        goodForCustomer: formData.goodForCustomer,
        isActive: formData.isActive,
      };

      let clientResponse;

      if (mode === "create") {
        // Ajouter les contacts au payload pour la création du client
        const clientWithContacts = {
          ...clientData,
          contacts: validContacts.length > 0 ? validContacts : undefined,
        };

        // Créer le client avec les contacts en une seule requête
        clientResponse = await createClient(clientWithContacts as any);
        setSuccess(`Client ${clientResponse.name} créé avec succès !`);
      } else {
        // Ajouter les contacts au payload pour la mise à jour du client
        const clientWithContacts = {
          ...clientData,
          contacts: validContacts.length > 0 ? validContacts : undefined,
        };

        // Mettre à jour le client avec les contacts en une seule requête
        clientResponse = await updateClient(
          clientId!,
          clientWithContacts as any
        );
        setSuccess(`Client ${clientResponse.name} mis à jour avec succès !`);
      }

      setTimeout(() => {
        router.push(`/dashboard/pipeline/clients?company=${companyId}`);
      }, 2000);
    } catch (err: any) {
      console.error(
        `Erreur lors de la ${
          mode === "create" ? "création" : "mise à jour"
        } du client:`,
        err
      );
      setError(
        err.message ||
          `Une erreur est survenue lors de la ${
            mode === "create" ? "création" : "mise à jour"
          } du client`
      );
    } finally {
      setLoadingWithMessage(false);
    }
  };

  // Helpers
  const findUserById = (id: string) => {
    return users.find((u) => u._id === id)?.firstName || "Non assigné";
  };

  const findTeamById = (id: string) => {
    return teams.find((t) => t._id === id)?.name || "Aucune équipe";
  };

  return {
    // État et statut
    formData,
    contacts,
    company,
    users,
    teams,
    originalClient,
    error,
    success,
    dataLoading,

    // Gestion des étapes
    currentStep,
    totalSteps,
    steps,
    progressPercentage,
    nextStep,
    prevStep,

    // Gestion des données
    handleChange,

    // Gestion des contacts
    addContact,
    removeContact,
    handleContactChange,

    // Soumission
    handleSubmit,

    // Helpers
    findUserById,
    findTeamById,
  };
};
