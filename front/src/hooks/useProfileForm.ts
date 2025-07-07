// hooks/useProfileForm.ts
import { useState, useEffect } from "react";
import { UpdateUserRequest } from "@/services/user.service";

interface UseProfileFormProps {
  initialData: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    phone?: string;
  };
  onSubmit: (data: UpdateUserRequest) => Promise<any>;
  onSuccess?: (updatedData: any) => void;
}

export const useProfileForm = ({
  initialData,
  onSubmit,
  onSuccess,
}: UseProfileFormProps) => {
  const [formData, setFormData] = useState<UpdateUserRequest>({
    firstName: initialData.firstName,
    lastName: initialData.lastName,
    email: initialData.email,
    phoneNumber: initialData.phoneNumber || initialData.phone || "",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormData({
      firstName: initialData.firstName,
      lastName: initialData.lastName,
      email: initialData.email,
      phoneNumber: initialData.phoneNumber || initialData.phone || "",
    });
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const validateForm = (): boolean => {
    setError(null);

    if (!formData.firstName || !formData.lastName || !formData.email) {
      setError("Les champs Nom, Prénom et Email sont obligatoires.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Veuillez saisir une adresse email valide.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      const dataToUpdate: UpdateUserRequest = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber || undefined,
      };

      const updatedData = await onSubmit(dataToUpdate);

      setFormData({
        firstName: updatedData.firstName,
        lastName: updatedData.lastName,
        email: updatedData.email,
        phoneNumber: updatedData.phoneNumber || "",
      });

      if (onSuccess) {
        onSuccess(updatedData);
      }

      setSuccess("Vos informations ont été mises à jour avec succès.");
    } catch (error: any) {
      setError(
        error.message || "Erreur lors de la mise à jour des informations."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    error,
    success,
    isSubmitting,
    handleChange,
    handleSubmit,
  };
};
