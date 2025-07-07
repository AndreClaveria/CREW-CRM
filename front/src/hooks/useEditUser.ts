// src/hooks/useEditUser.ts
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  getUserById,
  updateUser,
  User,
  UpdateUserRequest,
} from "@/services/user.service";

interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phoneNumber: string;
  active: boolean;
  password: string;
  confirmPassword: string;
}

interface UseEditUserProps {
  userId: string;
  redirectPath?: string;
  redirectDelay?: number;
}

interface UseEditUserReturn {
  formData: UserFormData;
  originalUser: User | null;
  error: string | null;
  success: string | null;
  changePassword: boolean;
  isLoading: boolean;
  isLoadingUsers: boolean;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  setChangePassword: (value: boolean) => void;
}

export const useEditUser = ({
  userId,
  redirectPath = "/dashboard/admin/manage/users",
  redirectDelay = 2000,
}: UseEditUserProps): UseEditUserReturn => {
  // État initial du formulaire
  const [formData, setFormData] = useState<UserFormData>({
    firstName: "",
    lastName: "",
    email: "",
    role: "user",
    phoneNumber: "",
    active: true,
    password: "",
    confirmPassword: "",
  });

  const [originalUser, setOriginalUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [changePassword, setChangePassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  const router = useRouter();
  const { user: currentUser, setLoadingWithMessage } = useAuth();

  // Charger les données de l'utilisateur
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;
      setIsLoadingUsers(true);
      try {
        // Note: J'ai gardé ce commentaire comme dans votre code original
        // setLoadingWithMessage(true, "Chargement des informations utilisateur...");
        const userData = await getUserById(userId);
        setOriginalUser(userData);
        setFormData({
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          email: userData.email || "",
          role: userData.role || "user",
          phoneNumber: userData.phoneNumber || "",
          active: userData.active !== undefined ? userData.active : true,
          password: "",
          confirmPassword: "",
        });
      } catch (err: any) {
        console.error(
          "Erreur lors de la récupération des données utilisateur:",
          err
        );
        setError(
          err.message ||
            "Impossible de charger les informations de l'utilisateur"
        );
      } finally {
        // setLoadingWithMessage(false);
        setIsLoadingUsers(false);
      }
    };

    if (currentUser && currentUser.role === "admin") {
      fetchUserData();
    }
  }, [userId, currentUser, setLoadingWithMessage]);

  // Gérer les changements de valeurs des champs du formulaire
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Soumettre le formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation basique
    if (!formData.firstName || !formData.lastName || !formData.email) {
      setError("Veuillez remplir tous les champs obligatoires");
      return;
    }

    if (changePassword && formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      setLoadingWithMessage(true, "Mise à jour du compte utilisateur...");

      // Création de l'objet à envoyer à l'API
      const updateData: UpdateUserRequest = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        role: formData.role,
        phoneNumber: formData.phoneNumber,
        active: formData.active,
      };

      // Ajouter le mot de passe seulement si changePassword est activé
      if (changePassword && formData.password) {
        updateData.password = formData.password;
      }

      await updateUser(userId, updateData);
      setSuccess("Utilisateur mis à jour avec succès");

      // Redirection après un court délai
      setTimeout(() => {
        router.push(redirectPath);
      }, redirectDelay);
    } catch (err: any) {
      console.error("Erreur lors de la mise à jour de l'utilisateur:", err);
      setError(
        err.message ||
          "Une erreur est survenue lors de la mise à jour de l'utilisateur"
      );
    } finally {
      setLoadingWithMessage(false);
    }
  };

  return {
    formData,
    originalUser,
    error,
    success,
    changePassword,
    isLoading,
    isLoadingUsers,
    handleChange,
    handleSubmit,
    setChangePassword,
  };
};
