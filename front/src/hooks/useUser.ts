// src/hooks/useUser.ts
import { useState, useEffect } from "react";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  User,
  UserCreateInput,
} from "@/services/user.service";

interface UseUserProps {
  userId?: string;
  loadAll?: boolean;
}

interface UseUserReturn {
  users: User[];
  user: User | null;
  isLoading: boolean;
  error: string | null;
  loadUsers: () => Promise<void>;
  loadUser: (userId: string) => Promise<void>;
  createNewUser: (userData: UserCreateInput) => Promise<User | null>;
  updateUserData: (userId: string, userData: Partial<User>) => Promise<boolean>;
  deleteUserById: (userId: string) => Promise<boolean>;
  resetError: () => void;
}

export const useUser = ({
  userId,
  loadAll = false,
}: UseUserProps = {}): UseUserReturn => {
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour réinitialiser les erreurs
  const resetError = () => setError(null);

  // Charger tous les utilisateurs
  const loadUsers = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Début de la récupération des utilisateurs");
      const usersData = await getAllUsers();
      console.log("Utilisateurs récupérés:", usersData);

      if (Array.isArray(usersData)) {
        setUsers(usersData);
      } else {
        console.error(
          "Les données d'utilisateurs reçues ne sont pas un tableau:",
          usersData
        );
        setUsers([]);
        setError(
          "Format de données incorrect. Veuillez contacter l'administrateur."
        );
      }
    } catch (err: any) {
      console.error("Erreur lors du chargement des utilisateurs:", err);
      setError(err.message || "Impossible de charger les utilisateurs");
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Charger un utilisateur spécifique
  const loadUser = async (userId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const userData = await getUserById(userId);
      setUser(userData);
    } catch (err: any) {
      console.error(
        `Erreur lors du chargement de l'utilisateur ${userId}:`,
        err
      );
      setError(
        err.message || "Impossible de charger les données de l'utilisateur"
      );
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Créer un nouvel utilisateur
  const createNewUser = async (
    userData: UserCreateInput
  ): Promise<User | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const newUser = await createUser(userData);

      // Mettre à jour la liste locale des utilisateurs
      setUsers((prev) => [...prev, newUser]);

      return newUser;
    } catch (err: any) {
      console.error("Erreur lors de la création de l'utilisateur:", err);
      setError(err.message || "Impossible de créer l'utilisateur");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Mettre à jour un utilisateur
  const updateUserData = async (
    userId: string,
    userData: Partial<User>
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const updatedUser = await updateUser(userId, userData);

      // Mettre à jour les données locales
      setUser((prev) => (prev && prev._id === userId ? updatedUser : prev));
      setUsers((prev) => prev.map((u) => (u._id === userId ? updatedUser : u)));

      return true;
    } catch (err: any) {
      console.error(
        `Erreur lors de la mise à jour de l'utilisateur ${userId}:`,
        err
      );
      setError(err.message || "Impossible de mettre à jour l'utilisateur");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Supprimer un utilisateur
  const deleteUserById = async (userId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await deleteUser(userId);

      // Mettre à jour les données locales
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      if (user && user._id === userId) {
        setUser(null);
      }

      return true;
    } catch (err: any) {
      console.error(
        `Erreur lors de la suppression de l'utilisateur ${userId}:`,
        err
      );
      setError(err.message || "Impossible de supprimer l'utilisateur");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Chargement initial si nécessaire
  useEffect(() => {
    if (userId) {
      loadUser(userId);
    } else if (loadAll) {
      loadUsers();
    }
  }, [userId, loadAll]);

  return {
    users,
    user,
    isLoading,
    error,
    loadUsers,
    loadUser,
    createNewUser,
    updateUserData,
    deleteUserById,
    resetError,
  };
};
