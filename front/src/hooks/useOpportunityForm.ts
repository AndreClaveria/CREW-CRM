// src/hooks/useOpportunityForm.ts
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  createOpportunity,
  updateOpportunity,
  getOpportunityById,
  Opportunity,
  Product,
} from "@/services/opportunity.service";
import { getClientById, Client } from "@/services/client.service";
import { getCompanyById, Company } from "@/services/company.service";
import { getAllUsers, User, getUserById } from "@/services/user.service";
import { getContactsByClient, Contact } from "@/services/contact.service";
import { fetchUserDashboard } from "@/services/dashboard.service";
import { DashboardData } from "./useUserDashboard";
import { getTeamById, Team } from "@/services/team.service";

// Interface pour les produits dans le formulaire
export interface ProductFormData {
  id?: string;
  name: string;
  price: number;
  quantity: number;
}

// Interface pour les données du formulaire
interface OpportunityFormData {
  title: string;
  description: string;
  value: number;
  status: "lead" | "qualified" | "proposition" | "negotiation" | "won" | "lost";
  probability: number;
  expectedClosingDate: string;
  assignedTo: string;
  notes: string;
  isActive: boolean;
}

interface UseOpportunityFormProps {
  mode: "create" | "edit";
  companyId?: string;
  clientId: string;
  opportunityId?: string;
}

interface UseOpportunityFormReturn {
  // États des données
  formData: OpportunityFormData;
  products: ProductFormData[];
  company: Company | null;
  client: Client | null;
  users: User[];
  availableContacts: Contact[];
  selectedContacts: string[];
  originalOpportunity: Opportunity | null;
  currentUserTeamId: string | null;

  // États du chargement et des erreurs
  dataLoading: boolean;
  error: string | null;
  success: string | null;

  // États de la progression
  currentStep: number;
  totalSteps: number;
  steps: Array<{ number: number; label: string }>;
  progressPercentage: number;

  // Handlers pour les données du formulaire
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;

  // Handlers pour les produits
  addProduct: () => void;
  removeProduct: (index: number) => void;
  handleProductChange: (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;

  // Handlers pour les contacts
  handleContactSelection: (contactId: string, isSelected: boolean) => void;

  // Navigation
  nextStep: () => void;
  prevStep: () => void;

  // Soumission
  handleSubmit: (e: React.FormEvent) => Promise<void>;

  // Helpers
  findUserById: (id: string) => string;
  calculateProductsTotal: () => number;
}

export const useOpportunityForm = ({
  mode,
  companyId,
  clientId,
  opportunityId,
}: UseOpportunityFormProps): UseOpportunityFormReturn => {
  const router = useRouter();
  const { user, isLoading, setLoadingWithMessage } = useAuth();

  // États des données
  const [company, setCompany] = useState<Company | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [availableContacts, setAvailableContacts] = useState<Contact[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [originalOpportunity, setOriginalOpportunity] =
    useState<Opportunity | null>(null);
  const [currentUserTeamId, setCurrentUserTeamId] = useState<string | null>(
    null
  );

  // Données du formulaire
  const [formData, setFormData] = useState<OpportunityFormData>({
    title: "",
    description: "",
    value: 0,
    status: "lead",
    probability: 20,
    expectedClosingDate: "",
    assignedTo: "",
    notes: "",
    isActive: true,
  });

  // État pour les produits
  const [products, setProducts] = useState<ProductFormData[]>([]);

  // Messages d'erreur et de succès
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // État pour la gestion des étapes
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  // Définition des étapes
  const steps = [
    { number: 1, label: "Informations" },
    { number: 2, label: "Valorisation" },
    { number: 3, label: "Attribution" },
    { number: 4, label: "Produits" },
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

        // Récupération des données du tableau de bord pour obtenir l'ID de l'équipe de l'utilisateur connecté
        const dashboardData: DashboardData = await fetchUserDashboard();
        let userTeamId: string | null = null;
        if (dashboardData.teams && dashboardData.teams.length > 0) {
          userTeamId = dashboardData.teams[0]._id;
          setCurrentUserTeamId(userTeamId);

          // Récupérer les membres de cette équipe
          try {
            const teamData = await getTeamById(userTeamId);
            let teamMembers: User[] = [];

            if (teamData.members && Array.isArray(teamData.members)) {
              if (typeof teamData.members[0] === "string") {
                // Si les membres sont des IDs
                // Récupérer les détails complets pour chaque membre ID
                const memberPromises = teamData.members.map(
                  async (memberId) => {
                    try {
                      return await getUserById(memberId as string);
                    } catch (memberErr) {
                      console.error(
                        `Erreur lors de la récupération du membre ${memberId}:`,
                        memberErr
                      );
                      return null; // Retourner null en cas d'erreur
                    }
                  }
                );
                // Filtrer les membres null et s'assurer qu'ils sont de type User
                teamMembers = (await Promise.all(memberPromises)).filter(
                  (member) => member !== null
                ) as User[];
              } else {
                // Si les membres sont déjà des objets User
                // S'assurer qu'ils sont bien de type User[] (bien que l'API doive le garantir)
                teamMembers = teamData.members as User[];
              }
            }
            if (isMounted) setUsers(teamMembers); // Mettre à jour l'état 'users' avec les membres de l'équipe
          } catch (teamErr) {
            console.error(
              `Erreur lors de la récupération de l'équipe ${userTeamId}:`,
              teamErr
            );
            if (isMounted) setUsers([]); // Aucune équipe ou erreur, pas de membres
          }
        } else {
          setCurrentUserTeamId(null); // Aucune équipe trouvée pour l'utilisateur
          if (isMounted) setUsers([]); // Aucun membre si pas d'équipe
        }

        // Récupération des détails de l'entreprise (si companyId est fourni)
        if (companyId) {
          const companyData = await getCompanyById(companyId);
          if (isMounted) setCompany(companyData);
        }

        // Récupération des détails du client
        const clientData = await getClientById(clientId);
        if (isMounted) setClient(clientData);

        // Si companyId n'est pas fourni mais que le client a une entreprise
        if (!companyId && clientData?.company) {
          const companyData = await getCompanyById(clientData.company);
          if (isMounted) setCompany(companyData);
        }

        // Récupération des contacts du client
        const contactsResponse = await getContactsByClient(clientId);
        let clientContacts: Contact[] = [];

        if (Array.isArray(contactsResponse)) {
          clientContacts = contactsResponse;
        } else if (
          contactsResponse &&
          typeof contactsResponse === "object" &&
          "data" in contactsResponse
        ) {
          clientContacts = contactsResponse.data || [];
        }

        if (isMounted) setAvailableContacts(clientContacts);

        if (mode === "edit" && opportunityId) {
          try {
            const opportunityData = await getOpportunityById(opportunityId);

            if (isMounted) {
              if (!opportunityData) {
                setError("Impossible de charger les détails de l'opportunité.");
                return;
              }

              setOriginalOpportunity(opportunityData);

              const assignedToId = opportunityData.assignedTo
                ? typeof opportunityData.assignedTo === "object" &&
                  opportunityData.assignedTo
                  ? opportunityData.assignedTo
                  : opportunityData.assignedTo
                : "";

              setFormData({
                title: opportunityData.title || "",
                description: opportunityData.description || "",
                value:
                  typeof opportunityData.value === "number"
                    ? opportunityData.value
                    : 0,
                status:
                  opportunityData.status &&
                  [
                    "lead",
                    "qualified",
                    "proposition",
                    "negotiation",
                    "won",
                    "lost",
                  ].includes(opportunityData.status)
                    ? (opportunityData.status as any)
                    : "lead",
                probability:
                  typeof opportunityData.probability === "number"
                    ? opportunityData.probability
                    : 20,
                expectedClosingDate: opportunityData.expectedClosingDate
                  ? new Date(opportunityData.expectedClosingDate)
                      .toISOString()
                      .split("T")[0]
                  : "",
                assignedTo: assignedToId || "",
                notes: opportunityData.notes || "",
                isActive:
                  opportunityData.isActive !== undefined
                    ? opportunityData.isActive
                    : true,
              });

              if (
                opportunityData.products &&
                Array.isArray(opportunityData.products)
              ) {
                setProducts(
                  opportunityData.products.map((product: Product) => ({
                    name: product.name || "",
                    price:
                      typeof product.price === "number" ? product.price : 0,
                    quantity:
                      typeof product.quantity === "number"
                        ? product.quantity
                        : 1,
                  }))
                );
              }

              if (
                opportunityData.contacts &&
                Array.isArray(opportunityData.contacts)
              ) {
                setSelectedContacts(opportunityData.contacts);
              }
            }
          } catch (err) {
            console.error("Erreur lors du chargement de l'opportunité:", err);
            if (isMounted) {
              setError("Impossible de charger les détails de l'opportunité.");
            }
          }
        }
        if (isMounted) setError(null);
      } catch (err: any) {
        console.error("Erreur lors de la récupération des données:", err);
        if (isMounted)
          setError("Impossible de charger les données nécessaires.");
      } finally {
        if (isMounted) setDataLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [companyId, clientId, opportunityId, user, mode]);

  // Navigation entre les étapes
  const nextStep = () => {
    if (currentStep === 1 && !formData.title) {
      setError("Le titre de l'opportunité est obligatoire");
      return;
    }

    if (currentStep === 2 && formData.value <= 0) {
      setError("La valeur de l'opportunité doit être supérieure à 0");
      return;
    }

    setError(null);
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Gestion des changements des champs du formulaire
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "number") {
      setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Gestion des produits
  const addProduct = () => {
    setProducts([
      ...products,
      {
        name: "",
        price: 0,
        quantity: 1,
      },
    ]);
  };

  const removeProduct = (index: number) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const handleProductChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type } = e.target;
    const newProducts = [...products];

    if (type === "number") {
      newProducts[index] = {
        ...newProducts[index],
        [name]:
          name === "quantity"
            ? Math.max(1, parseInt(value) || 0)
            : parseFloat(value) || 0,
      };
    } else {
      newProducts[index] = { ...newProducts[index], [name]: value };
    }

    setProducts(newProducts);
  };

  // Gestion des contacts
  const handleContactSelection = (contactId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedContacts([...selectedContacts, contactId]);
    } else {
      setSelectedContacts(selectedContacts.filter((id) => id !== contactId));
    }
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.title) {
      setError("Le titre de l'opportunité est obligatoire");
      return;
    }

    if (formData.value <= 0) {
      setError("La valeur de l'opportunité doit être supérieure à 0");
      return;
    }

    const effectiveCompanyId = companyId || client?.company;
    if (!effectiveCompanyId) {
      setError("ID de l'entreprise manquant");
      return;
    }

    try {
      const actionText = mode === "create" ? "Création" : "Mise à jour";
      setLoadingWithMessage(true, `${actionText} de l'opportunité...`);

      const validProducts = products
        .filter((p) => p.name && p.price > 0 && p.quantity > 0)
        .map((p) => ({
          name: p.name,
          price: p.price,
          quantity: p.quantity,
        }));

      const opportunityData = {
        title: formData.title,
        description: formData.description || undefined,
        value: formData.value,
        status: formData.status,
        probability: formData.probability,
        expectedClosingDate: formData.expectedClosingDate || undefined,
        company: effectiveCompanyId,
        client: clientId,
        contacts: selectedContacts.length > 0 ? selectedContacts : undefined,
        assignedTo: formData.assignedTo || undefined,
        notes: formData.notes || undefined,
        products: validProducts.length > 0 ? validProducts : undefined,
        isActive: formData.isActive,
      };

      let opportunityResponse;

      if (mode === "create") {
        opportunityResponse = await createOpportunity(opportunityData);
        setSuccess(
          `Opportunité "${opportunityResponse.title}" créée avec succès !`
        );
      } else {
        opportunityResponse = await updateOpportunity(
          opportunityId!,
          opportunityData
        );
        setSuccess(
          `Opportunité "${opportunityResponse.title}" mise à jour avec succès !`
        );
      }

      setTimeout(() => {
        router.push(`/dashboard/pipeline/clients/opportunity/${clientId}`);
      }, 2000);
    } catch (err: any) {
      console.error(
        `Erreur lors de la ${
          mode === "create" ? "création" : "mise à jour"
        } de l'opportunité:`,
        err
      );
      setError(
        err.message ||
          `Une erreur est survenue lors de la ${
            mode === "create" ? "création" : "mise à jour"
          } de l'opportunité.`
      );
    } finally {
      setLoadingWithMessage(false);
    }
  };

  // Fonctions helpers
  const findUserById = (id: string) => {
    return users.find((u) => u._id === id)?.firstName || "Non assigné";
  };

  const calculateProductsTotal = () => {
    return products.reduce(
      (sum, product) => sum + product.price * product.quantity,
      0
    );
  };

  return {
    formData,
    products,
    company,
    client,
    users,
    availableContacts,
    selectedContacts,
    originalOpportunity,
    dataLoading,
    error,
    success,
    currentStep,
    totalSteps,
    steps,
    progressPercentage,
    handleChange,
    addProduct,
    removeProduct,
    handleProductChange,
    handleContactSelection,
    nextStep,
    prevStep,
    handleSubmit,
    findUserById,
    calculateProductsTotal,
    currentUserTeamId,
  };
};
