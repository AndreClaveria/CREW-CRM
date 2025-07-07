// src/hooks/useAssignedUsers.ts
import { useState, useEffect } from "react";
import { getUserById, User } from "@/services/user.service";
import { Client } from "@/services/client.service";

interface UseAssignedUsersProps {
  clients: Client[];
}

interface UseAssignedUsersReturn {
  assignedUsers: { [key: string]: User };
  loading: boolean;
  getAssignedUserName: (client: Client) => string;
}

/**
 * Hook pour gérer le chargement et l'accès aux utilisateurs assignés aux clients
 */
export const useAssignedUsers = ({
  clients,
}: UseAssignedUsersProps): UseAssignedUsersReturn => {
  const [assignedUsers, setAssignedUsers] = useState<{ [key: string]: User }>(
    {}
  );
  const [loading, setLoading] = useState<boolean>(false);

  // Chargement des utilisateurs assignés
  useEffect(() => {
    const fetchAssignedUsers = async () => {
      if (!clients || clients.length === 0) return;

      setLoading(true);
      const userMap: { [key: string]: User } = {};

      // Création d'un ensemble pour éviter les doublons
      const userIds = new Set<string>();

      // Collecte des IDs uniques des utilisateurs assignés
      clients.forEach((client) => {
        if (client.assignedTo) {
          userIds.add(client.assignedTo);
        }
      });

      // Récupération des détails pour chaque utilisateur
      try {
        const promises = Array.from(userIds).map(async (userId) => {
          try {
            const userData = await getUserById(userId);
            userMap[userId] = userData;
          } catch (error) {
            console.error(
              `Erreur lors de la récupération de l'utilisateur ${userId}:`,
              error
            );
          }
        });

        await Promise.all(promises);
        setAssignedUsers(userMap);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des utilisateurs:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedUsers();
  }, [clients]);

  // Fonction pour obtenir le nom de l'utilisateur assigné
  const getAssignedUserName = (client: Client): string => {
    if (!client.assignedTo) return "Non assigné";

    if (assignedUsers[client.assignedTo]) {
      return `${assignedUsers[client.assignedTo].firstName} ${
        assignedUsers[client.assignedTo].lastName
      }`;
    }

    return "Chargement...";
  };

  return {
    assignedUsers,
    loading,
    getAssignedUserName,
  };
};
