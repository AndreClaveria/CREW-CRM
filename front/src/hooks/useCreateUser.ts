// src/hooks/useCreateUser.ts
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { createUser, UpdateUserRequest } from "@/services/user.service";

interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  active: boolean;
}

interface UseCreateUserProps {
  redirectPath?: string;
  redirectDelay?: number;
}

interface UseCreateUserReturn {
  formData: UserFormData;
  error: string | null;
  success: string | null;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  resetForm: () => void;
}

export const useCreateUser = ({
  redirectPath = "/dashboard/users",
  redirectDelay = 2000,
}: UseCreateUserProps = {}): UseCreateUserReturn => {
  // État initial du formulaire
  const [formData, setFormData] = useState<UserFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    active: true,
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const router = useRouter();
  const { setLoadingWithMessage } = useAuth();

  // Réinitialiser le formulaire
  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
      active: true,
    });
    setError(null);
    setSuccess(null);
  };

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

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      setLoadingWithMessage(true, "Création du compte utilisateur...");

      const userData: UpdateUserRequest = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        active: formData.active,
      };

      const newUser = await createUser(userData);
      setSuccess("Utilisateur créé avec succès");

      // Réinitialiser le formulaire
      resetForm();

      // Redirection après un court délai
      setTimeout(() => {
        router.push(redirectPath);
      }, redirectDelay);
    } catch (err: any) {
      console.error("Erreur lors de la création de l'utilisateur:", err);
      setError(
        err.message ||
          "Une erreur est survenue lors de la création de l'utilisateur"
      );
    } finally {
      setLoadingWithMessage(false);
    }
  };

  return {
    formData,
    error,
    success,
    handleChange,
    handleSubmit,
    resetForm,
  };
};
