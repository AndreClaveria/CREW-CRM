// hooks/useUserUpdate.ts
import { useState } from "react";
import { UpdateUserRequest } from "@/services/user.service";

interface UseUserUpdateProps {
  updateUserData: (userId: string, data: UpdateUserRequest) => Promise<any>;
  onUserUpdate?: (updatedUser: any) => void;
}

export const useUserUpdate = ({
  updateUserData,
  onUserUpdate,
}: UseUserUpdateProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateUser = async (userId: string, data: UpdateUserRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const updatedUser = await updateUserData(userId, data);

      if (onUserUpdate) {
        onUserUpdate(updatedUser);
      }

      return updatedUser;
    } catch (err: any) {
      const errorMessage =
        err.message || "Erreur lors de la mise à jour des informations.";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateUser,
    isLoading,
    error,
  };
};
