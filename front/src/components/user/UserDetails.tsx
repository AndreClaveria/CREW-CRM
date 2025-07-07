"use client";

import React, { useState, use, useEffect } from "react";
import { useUserDetails } from "@/hooks/useUserDetails";
import { useAuth } from "@/contexts/AuthContext";
import { useRoleCheck } from "@/hooks/useRoleCheck";
import ActionButton from "@/components/common/ActionButton";
import { userDetailsStyles as styles } from "@/styles/pages/dashboard/admin/userDetailsStyles";
import UserHeader from "./UserHeader";
import UserCompanyCard from "./UserCompanyCard";
import UserTeamsCard from "./UserTeamsCard";
import UserProfileCard from "./UserProfileCard";
import UserEditForm from "./UserEditForm";
import UserActivityCard from "./UserActivityCard";
import { useNavigation } from "@/utils/navigateBack";

interface UserDetailsProps {
  params: Promise<{
    userId: string;
  }>;
}

const UserDetails: React.FC<UserDetailsProps> = ({ params }) => {
  // Extraction de l'ID utilisateur des paramètres
  const unwrappedParams = use(params);
  const { userId } = unwrappedParams;

  const { user: authUser, isLoading: isAuthLoading } = useAuth();
  const {
    user,
    managedCompany,
    userTeams,
    isLoading,
    error,
    updateUserDetails,
    toggleUserStatus,
    navigateToCompany,
    navigateToTeam,
  } = useUserDetails(userId);

  const { navigateBack } = useNavigation();
  // Vérification de l'accès
  const hasAccess = useRoleCheck({
    isLoading: isAuthLoading,
    user: authUser,
    requiredRole: [], // Plus besoin de vérifier les rôles
    redirectPath: "/dashboard",
  });

  // État pour le mode édition
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  // Actualiser les données du formulaire lorsque l'utilisateur est chargé
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
      });
    }
  }, [user]);

  if (isAuthLoading || !authUser || !hasAccess) {
    return null; // Le LoadingOverlay du AuthContext s'affichera
  }

  if (isLoading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        Chargement des informations utilisateur...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px", color: "#d32f2f" }}>
        <h2>Erreur</h2>
        <p>{error}</p>
        <ActionButton
          onClick={() => window.location.reload()}
          variant="secondary"
          size="medium"
        >
          Réessayer
        </ActionButton>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ padding: "20px", color: "#d32f2f" }}>
        <h2>Utilisateur non trouvé</h2>
        <ActionButton onClick={navigateBack} variant="secondary" size="medium">
          Retour à la liste des utilisateurs
        </ActionButton>
      </div>
    );
  }

  // Gestion des modifications du formulaire
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const success = await updateUserDetails(formData);
      if (success) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error saving user:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Formater la date pour l'affichage
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Non disponible";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Fonction pour vérifier si l'utilisateur est leader d'une équipe
  const isTeamLeader = (team: any) => {
    if (!team.leader) return false;

    if (typeof team.leader === "string") {
      return team.leader === userId;
    }

    if (
      typeof team.leader === "object" &&
      team.leader !== null &&
      "_id" in team.leader
    ) {
      return team.leader._id === userId;
    }

    return false;
  };

  // Fonction pour compter les membres d'une équipe
  const countTeamMembers = (team: any) => {
    if (!team.members || !Array.isArray(team.members)) {
      return 0;
    }
    return team.members.length;
  };
  const handleToggleStatus = async (): Promise<void> => {
    await toggleUserStatus(); // Ignore la valeur de retour
  };
  return (
    <div style={styles.container}>
      <UserHeader
        user={user}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        toggleUserStatus={handleToggleStatus}
        navigateBack={navigateBack}
      />
      <div style={styles.contentGrid}>
        {/* Panneau gauche - Informations connexes */}
        <div>
          <UserCompanyCard
            user={user}
            managedCompany={managedCompany}
            navigateToCompany={navigateToCompany}
          />

          <UserTeamsCard
            userTeams={userTeams}
            isTeamLeader={isTeamLeader}
            countTeamMembers={countTeamMembers}
            navigateToTeam={navigateToTeam}
          />
        </div>

        {/* Panneau droit - Informations de l'utilisateur */}
        <div>
          <div style={styles.card}>
            {!isEditing ? (
              <UserProfileCard user={user} formatDate={formatDate} />
            ) : (
              <UserEditForm
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                setIsEditing={setIsEditing}
                isSaving={isSaving}
              />
            )}
          </div>

          {/* Section activité récente */}
          <UserActivityCard />
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
