// src/hooks/useTeamForm.ts
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  createTeam,
  updateTeam,
  getTeamById,
  Team,
} from "@/services/team.service";
import { getCompanyById, Company } from "@/services/company.service";
import { getAllUsers, User } from "@/services/user.service";

interface TeamFormData {
  name: string;
  description: string;
  leader: string; // Nous gardons cela comme string car dans le formulaire c'est toujours un ID
  isActive: boolean;
}

interface UseTeamFormProps {
  mode: "create" | "edit";
  companyId: string;
  teamId?: string;
}

interface UseTeamFormReturn {
  formData: TeamFormData;
  company: Company | null;
  users: User[];
  originalTeam: Team | null;
  error: string | null;
  success: string | null;
  isLoadingData: boolean;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  getRoutePrefix: () => string;
}

/**
 * Hook personnalisé pour gérer la logique du formulaire d'équipe
 */
export const useTeamForm = ({
  mode,
  companyId,
  teamId,
}: UseTeamFormProps): UseTeamFormReturn => {
  const router = useRouter();
  const { user, isLoading, setLoadingWithMessage } = useAuth();

  // États pour les données
  const [company, setCompany] = useState<Company | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState<TeamFormData>({
    name: "",
    description: "",
    leader: "",
    isActive: true,
  });
  const [originalTeam, setOriginalTeam] = useState<Team | null>(null);

  // États pour les messages et chargement
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Vérification du rôle de l'utilisateur
  useEffect(() => {
    if (!isLoading && user && !["admin", "manager"].includes(user.role)) {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  // Fonction pour déterminer le préfixe de route selon le rôle
  const getRoutePrefix = () => {
    return user?.role === "admin" ? "admin" : "manager";
  };

  // Chargement des données initiales
  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingData(true);
      try {
        // Chargement des données de l'entreprise
        const companyData = await getCompanyById(companyId);
        setCompany(companyData);

        // Chargement des utilisateurs
        const usersData = await getAllUsers();
        setUsers(usersData);

        // En mode édition, charger les données de l'équipe
        if (mode === "edit" && teamId) {
          const teamData = await getTeamById(teamId);
          setOriginalTeam(teamData);

          // Extraire l'ID du leader quelle que soit sa forme (string ou objet User)
          const leaderId = teamData.leader
            ? typeof teamData.leader === "string"
              ? teamData.leader
              : (teamData.leader as User)._id || ""
            : "";

          setFormData({
            name: teamData.name || "",
            description: teamData.description || "",
            leader: leaderId,
            isActive:
              teamData.isActive !== undefined ? teamData.isActive : true,
          });
        }
      } catch (err: any) {
        console.error("Erreur lors du chargement des données:", err);
        setError("Impossible de charger toutes les données nécessaires.");
      } finally {
        setIsLoadingData(false);
      }
    };

    if (user && ["admin", "manager"].includes(user.role)) {
      fetchData();
    }
  }, [companyId, teamId, user, mode]);

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
    if (!formData.name) {
      setError("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      const actionText = mode === "create" ? "Création" : "Mise à jour";
      setLoadingWithMessage(true, `${actionText} de l'équipe...`);

      const teamData = {
        name: formData.name,
        description: formData.description,
        company: companyId,
        leader: formData.leader || undefined,
        isActive: formData.isActive,
      };

      if (mode === "create") {
        // Ajouter les membres uniquement en mode création
        const createData = {
          ...teamData,
          members: formData.leader ? [formData.leader] : [],
        };
        await createTeam(createData);
        setSuccess("Équipe créée avec succès !");
      } else {
        await updateTeam(teamId!, teamData);
        setSuccess("Équipe mise à jour avec succès !");
      }

      // Redirection après un délai
      setTimeout(() => {
        router.push(
          `/dashboard/${getRoutePrefix()}/manage/company/teams/${companyId}`
        );
      }, 2000);
    } catch (err: any) {
      console.error(
        `Erreur lors de la ${
          mode === "create" ? "création" : "mise à jour"
        } de l'équipe:`,
        err
      );
      setError(
        err.message ||
          `Une erreur est survenue lors de la ${
            mode === "create" ? "création" : "mise à jour"
          } de l'équipe`
      );
    } finally {
      setLoadingWithMessage(false);
    }
  };

  return {
    formData,
    company,
    users,
    originalTeam,
    error,
    success,
    isLoadingData,
    handleChange,
    handleSubmit,
    getRoutePrefix,
  };
};
