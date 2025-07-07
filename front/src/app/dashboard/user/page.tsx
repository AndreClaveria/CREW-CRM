"use client";

import { useUserDashboard } from "@/hooks/useUserDashboard";
import { dashboardStyles } from "@/styles/pages/dashboard/user/userDashboardStyles";
import {
  FaBuilding,
  FaUsers,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaInfoCircle,
} from "react-icons/fa";

export default function UserDashboard() {
  const { dashboardData, loading, error, navigateToTeam } = useUserDashboard();

  if (loading) {
    return (
      <div style={dashboardStyles.loadingSpinner}>
        Chargement de vos informations...
      </div>
    );
  }

  if (error) {
    return <div style={dashboardStyles.errorMessage}>{error}</div>;
  }

  if (!dashboardData) {
    return (
      <div style={dashboardStyles.errorMessage}>Aucune donnée disponible</div>
    );
  }

  const { user, teams, company } = dashboardData;

  return (
    <div style={dashboardStyles.container}>
      <div style={dashboardStyles.section}>
        <h2 style={dashboardStyles.sectionTitle}>
          <FaUser style={dashboardStyles.sectionIcon} />
          Profil Utilisateur
        </h2>
        <div style={dashboardStyles.userInfoCard}>
          <div style={dashboardStyles.avatar}>
            {user.firstName.charAt(0)}
            {user.lastName.charAt(0)}
          </div>
          <h2 style={dashboardStyles.userName}>
            {user.firstName} {user.lastName}
          </h2>
          <div style={dashboardStyles.infoItem}>
            <FaEnvelope style={dashboardStyles.infoIcon} />
            <span>{user.email}</span>
          </div>
          <div style={dashboardStyles.infoItem}>
            <FaUser style={dashboardStyles.infoIcon} />
            <span>Rôle: {user.role}</span>
          </div>
        </div>
      </div>

      {company ? (
        <div style={dashboardStyles.section}>
          <h2 style={dashboardStyles.sectionTitle}>
            <FaBuilding style={dashboardStyles.sectionIcon} />
            Votre Entreprise
          </h2>
          <div style={dashboardStyles.companyCard}>
            <h2 style={dashboardStyles.companyTitle}>{company.name}</h2>
            {company.description && (
              <p style={dashboardStyles.companyDescription}>
                {company.description}
              </p>
            )}

            <div style={dashboardStyles.companyDetails}>
              {company.address && (
                <div style={dashboardStyles.infoItem}>
                  <strong>Adresse:</strong> {company.address.city}
                </div>
              )}
              {company.email && (
                <div style={dashboardStyles.infoItem}>
                  <FaEnvelope style={dashboardStyles.infoIcon} />
                  <span>{company.email}</span>
                </div>
              )}
              {company.phone && (
                <div style={dashboardStyles.infoItem}>
                  <FaPhone style={dashboardStyles.infoIcon} />
                  <span>{company.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div style={dashboardStyles.section}>
          <h2 style={dashboardStyles.sectionTitle}>
            <FaInfoCircle style={dashboardStyles.sectionIcon} />
            Statut
          </h2>
          <div style={dashboardStyles.noCompanyMessage}>
            <FaInfoCircle style={dashboardStyles.noCompanyIcon} />
            <p>Attendez que votre Manager vous mette dans une équipe</p>
          </div>
        </div>
      )}

      {teams.length > 0 && (
        <div style={dashboardStyles.section}>
          <h2 style={dashboardStyles.sectionTitle}>
            <FaUsers style={dashboardStyles.sectionIcon} />
            Vos Équipes
          </h2>
          <div style={dashboardStyles.teamGrid}>
            {teams.map((team) => (
              <div key={team._id} style={dashboardStyles.teamCard}>
                <h3 style={dashboardStyles.teamTitle}>{team.name}</h3>
                {team.description && (
                  <p style={dashboardStyles.teamDescription}>
                    {team.description}
                  </p>
                )}
                <div style={dashboardStyles.teamMeta}>
                  <div style={dashboardStyles.infoItem}>
                    <strong>Nombre de membres:</strong> {team.members.length}
                  </div>
                  {team.leader === user._id && (
                    <div style={dashboardStyles.leaderBadge}>
                      Vous êtes le leader de cette équipe
                    </div>
                  )}
                </div>
                <button
                  onClick={() => navigateToTeam(team._id)}
                  style={dashboardStyles.viewDetailsBtn}
                >
                  Voir les détails
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
