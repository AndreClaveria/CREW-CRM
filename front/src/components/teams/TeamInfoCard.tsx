// components/team/TeamInfoCard.tsx
import React from "react";
import { teamDetailsStyles as styles } from "@/styles/pages/dashboard/admin/teamDetailsStyles";
import {
  FaUsers,
  FaBuilding,
  FaCrown,
  FaCalendarAlt,
  FaBriefcase,
} from "react-icons/fa";
import { Team } from "@/services/team.service";
import { Company } from "@/services/company.service";
import { User } from "@/services/user.service";

interface TeamInfoCardProps {
  team: Team;
  company: Company | null;
  teamLeader: User | null;
  teamMembers: User[];
  teamClients: any[];
  navigateToCompany: () => void;
  navigateToMember: (memberId: string) => void;
}

const TeamInfoCard: React.FC<TeamInfoCardProps> = ({
  team,
  company,
  teamLeader,
  teamMembers,
  teamClients,
  navigateToCompany,
  navigateToMember,
}) => {
  // Formater la date pour l'affichage
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Non disponible";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div style={styles.card}>
      <div style={styles.teamHeader}>
        <div style={styles.teamAvatar}>
          <FaUsers />
        </div>
        <div style={styles.teamInfo}>
          <h2 style={styles.teamName}>{team.name}</h2>
          <div style={styles.badgeContainer}>
            <span
              style={{
                ...styles.statusBadge,
                backgroundColor: team.isActive ? "#4caf50" : "#f44336",
              }}
            >
              {team.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </div>

      {team.description && (
        <p style={styles.teamDescription}>{team.description}</p>
      )}

      <div style={styles.divider}></div>

      <div style={styles.detailsGrid}>
        {company && (
          <div style={styles.detailItem}>
            <div style={styles.detailLabel}>
              <FaBuilding />
              Entreprise
            </div>
            <div
              style={{
                ...styles.detailValue,
                cursor: "pointer",
                color: "#1976d2",
              }}
              onClick={navigateToCompany}
            >
              {company.name}
            </div>
          </div>
        )}

        {teamLeader && (
          <div style={styles.detailItem}>
            <div style={styles.detailLabel}>
              <FaCrown />
              Responsable d’équipe
            </div>
            <div
              style={{
                ...styles.detailValue,
                cursor: "pointer",
                color: "#1976d2",
              }}
              onClick={() => navigateToMember(teamLeader._id)}
            >
              {teamLeader.firstName} {teamLeader.lastName}
            </div>
          </div>
        )}

        {team.createdAt && (
          <div style={styles.detailItem}>
            <div style={styles.detailLabel}>
              <FaCalendarAlt />
              Date de création
            </div>
            <div style={styles.detailValue}>{formatDate(team.createdAt)}</div>
          </div>
        )}

        <div style={styles.detailItem}>
          <div style={styles.detailLabel}>
            <FaUsers />
            Membres
          </div>
          <div style={styles.detailValue}>
            {teamMembers.length} membre
            {teamMembers.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div style={styles.statsContainer}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            <FaUsers />
          </div>
          <div style={styles.statValue}>{teamMembers.length}</div>
          <div style={styles.statLabel}>Membres</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            <FaBriefcase />
          </div>
          <div style={styles.statValue}>{teamClients.length}</div>
          <div style={styles.statLabel}>Clients</div>
        </div>
      </div>
    </div>
  );
};

export default TeamInfoCard;
