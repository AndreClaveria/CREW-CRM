// src/hooks/useCompanyForm.ts
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  createCompany,
  updateCompany,
  getCompanyById,
  Company,
} from "@/services/company.service";

interface CompanyFormData {
  name: string;
  description: string;
  street: string;
  city: string;
  zipCode: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  industry: string;
  isActive: boolean;
}

interface UseCompanyFormProps {
  mode: "create" | "edit";
  companyId?: string;
}

interface UseCompanyFormReturn {
  formData: CompanyFormData;
  originalCompany: Company | null;
  error: string | null;
  success: string | null;
  isLoadingCompany: boolean;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  getRoutePrefix: () => string;
}

/**
 * Hook personnalisé pour gérer la logique du formulaire d'entreprise
 */
export const useCompanyForm = ({
  mode,
  companyId,
}: UseCompanyFormProps): UseCompanyFormReturn => {
  const router = useRouter();
  const { user, isLoading, setLoadingWithMessage } = useAuth();

  // États du formulaire
  const [formData, setFormData] = useState<CompanyFormData>({
    name: "",
    description: "",
    street: "",
    city: "",
    zipCode: "",
    country: "France",
    phone: "",
    email: "",
    website: "",
    industry: "",
    isActive: true,
  });
  const [originalCompany, setOriginalCompany] = useState<Company | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoadingCompany, setIsLoadingCompany] = useState(false);

  // Helper pour déterminer le préfixe de route en fonction du rôle de l'utilisateur
  const getRoutePrefix = () => {
    return user?.role === "admin" ? "admin" : "manager";
  };

  // Vérification des droits d'accès
  useEffect(() => {
    if (!isLoading && user && !["admin", "manager"].includes(user.role)) {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  // Charger les données de l'entreprise en mode édition
  useEffect(() => {
    const fetchCompanyData = async () => {
      if (mode !== "edit" || !companyId) return;

      setIsLoadingCompany(true);
      try {
        const companyData = await getCompanyById(companyId);
        setOriginalCompany(companyData);

        // Extraire l'adresse
        const address = companyData.address || {};

        setFormData({
          name: companyData.name || "",
          description: companyData.description || "",
          street: address.street || "",
          city: address.city || "",
          zipCode: address.zipCode || "",
          country: address.country || "France",
          phone: companyData.phone || "",
          email: companyData.email || "",
          website: companyData.website || "",
          industry: companyData.industry || "",
          isActive:
            companyData.isActive !== undefined ? companyData.isActive : true,
        });
      } catch (err: any) {
        console.error(
          "Erreur lors de la récupération des données de l'entreprise:",
          err
        );
        setError(
          err.message ||
            "Impossible de charger les informations de l'entreprise"
        );
      } finally {
        setIsLoadingCompany(false);
      }
    };

    if (user && ["admin", "manager"].includes(user.role)) {
      fetchCompanyData();
    }
  }, [companyId, user, mode]);

  // Gestion des changements dans le formulaire
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation basique
    if (!formData.name || !formData.email) {
      setError("Veuillez remplir tous les champs obligatoires");
      return;
    }
    const routePrefix = getRoutePrefix();

    try {
      const actionText = mode === "create" ? "Création" : "Mise à jour";
      setLoadingWithMessage(true, `${actionText} de l'entreprise...`);

      const companyData = {
        name: formData.name,
        description: formData.description,
        address: {
          street: formData.street,
          city: formData.city,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        phone: formData.phone,
        email: formData.email,
        website: formData.website,
        industry: formData.industry,
        isActive: formData.isActive,
      };

      if (mode === "create") {
        // Ajouter l'owner uniquement en mode création
        const createData = {
          ...companyData,
          owner: user?._id || "",
        };
        await createCompany(createData);
        setSuccess("Entreprise créée avec succès !");
      } else {
        await updateCompany(companyId!, companyData);
        setSuccess("Entreprise mise à jour avec succès !");
      }

      setTimeout(() => {
        router.push(`/dashboard/${routePrefix}/manage/company`);
      }, 2000);
    } catch (err: any) {
      console.error(
        `Erreur lors de la ${
          mode === "create" ? "création" : "mise à jour"
        } de l'entreprise:`,
        err
      );
      setError(
        err.message ||
          `Une erreur est survenue lors de la ${
            mode === "create" ? "création" : "mise à jour"
          } de l'entreprise`
      );
    } finally {
      setLoadingWithMessage(false);
    }
  };

  return {
    formData,
    originalCompany,
    error,
    success,
    isLoadingCompany,
    handleChange,
    handleSubmit,
    getRoutePrefix,
  };
};
