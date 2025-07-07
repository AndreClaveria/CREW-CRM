// src/hooks/useProfileSetup.ts
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  updateUser,
  getStoredUser,
  verifyPassword,
} from "@/services/user.service";

interface ProfileFormData {
  firstName: string;
  lastName: string;
  currentPassword: string;
  password: string;
  confirmPassword: string;
}

interface UseProfileSetupReturn {
  formData: ProfileFormData;
  loading: boolean;
  error: string;
  passwordRequired: boolean;
  captchaVerified: boolean;
  setCaptchaVerified: (value: boolean) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

/**
 * Hook personnalisé pour gérer la logique du formulaire de configuration de profil
 */
export const useProfileSetup = (): UseProfileSetupReturn => {
  const router = useRouter();
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: "",
    lastName: "",
    currentPassword: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [passwordRequired, setPasswordRequired] = useState(true);

  // Vérifier si l'utilisateur s'est connecté via Google
  useEffect(() => {
    const checkUserSource = () => {
      const userData = getStoredUser();
      console.log("userData", userData);

      if (userData && userData.provider === "google") {
        setPasswordRequired(false);
      }
    };

    checkUserSource();
  }, []);

  // Gestion des changements dans les champs du formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Fonction pour mettre à jour le profil utilisateur
  const updateUserProfile = async (userId: string) => {
    // Préparation des données à mettre à jour
    const updateData: any = {
      firstName: formData.firstName,
      lastName: formData.lastName,
    };

    if (formData.password) {
      updateData.password = formData.password;
    }

    await updateUser(userId, updateData);

    setFormData((prev) => ({
      ...prev,
      currentPassword: "",
      password: "",
      confirmPassword: "",
    }));

    router.push("/dashboard");
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Vérifications des champs obligatoires
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError("Le prénom et le nom sont requis");
      return;
    }

    // Vérification du mot de passe actuel (sauf pour les connexions OAuth)
    if (passwordRequired && !formData.currentPassword) {
      setError(
        "Veuillez entrer votre mot de passe actuel pour confirmer votre identité"
      );
      return;
    }

    // Vérification de la correspondance des nouveaux mots de passe
    if (formData.password && formData.password !== formData.confirmPassword) {
      setError("Les nouveaux mots de passe ne correspondent pas");
      return;
    }

    try {
      setLoading(true);

      // Récupérer les données utilisateur
      const userData = getStoredUser();

      if (!userData) {
        // Gérer le cas où l'utilisateur n'est pas dans le localStorage
        if (typeof window !== "undefined") {
          const userStr = localStorage.getItem("user");
          if (!userStr) {
            setError(
              "Session utilisateur non trouvée. Veuillez vous reconnecter."
            );
            router.push("/auth");
            return;
          }

          try {
            const parsedUser = JSON.parse(userStr);

            // Vérifier le mot de passe actuel si requis
            if (passwordRequired) {
              const isPasswordValid = await verifyPassword(
                parsedUser.email,
                formData.currentPassword
              );
              if (!isPasswordValid) {
                setError("Mot de passe actuel incorrect");
                setLoading(false);
                return;
              }
            }

            await updateUserProfile(parsedUser._id);
            return;
          } catch (parseError) {
            console.error(
              "Erreur de parsing des données utilisateur:",
              parseError
            );
            setError(
              "Erreur avec vos données de session. Veuillez vous reconnecter."
            );
            router.push("/auth");
            return;
          }
        } else {
          // Côté serveur, redirection vers la page d'authentification
          setError(
            "Session utilisateur non trouvée. Veuillez vous reconnecter."
          );
          router.push("/auth");
          return;
        }
      }

      // Vérifier le mot de passe actuel si requis
      if (passwordRequired) {
        const isPasswordValid = await verifyPassword(
          userData.email,
          formData.currentPassword
        );
        if (!isPasswordValid) {
          setError("Mot de passe actuel incorrect");
          setLoading(false);
          return;
        }
      }

      await updateUserProfile(userData._id);
    } catch (err: any) {
      console.error("Erreur lors de la mise à jour du profil:", err);
      setError(err.message || "Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    error,
    passwordRequired,
    captchaVerified,
    setCaptchaVerified,
    handleChange,
    handleSubmit,
  };
};
