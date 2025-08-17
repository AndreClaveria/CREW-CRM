import React from "react";
import { clientDetailsStyles as styles } from "@/styles/pages/dashboard/admin/clientDetailsStyles";
import {
  FaBuilding,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
} from "react-icons/fa";

interface ClientInfoCardProps {
  client: any;
  formatDate: (dateString?: string) => string;
}

const ClientInfoCard: React.FC<ClientInfoCardProps> = ({
  client,
  formatDate,
}) => {
  // Obtenir la couleur en fonction du score "bonne poire"
  const getScoreColor = (score: number) => {
    if (score >= 80) return "#f44336"; // Rouge - très "bonne poire"
    if (score >= 60) return "#ff9800"; // Orange
    if (score >= 40) return "#ffc107"; // Jaune
    if (score >= 20) return "#8bc34a"; // Vert clair
    return "#4caf50"; // Vert - pas "bonne poire"
  };

  // Obtenir la description du score "bonne poire"
  const getScoreDescription = (score: number) => {
    if (score >= 80)
      return "Client très demandeur et chronophage, attention aux négociations.";
    if (score >= 60)
      return "Client qui peut céder facilement face à certaines requêtes.";
    if (score >= 40)
      return "Client dans la moyenne, équilibré dans les négociations.";
    if (score >= 20)
      return "Client qui négocie fermement mais raisonnablement.";
    return "Client très rigoureux dans les négociations, ne fait pas de concessions.";
  };

  return (
    <div style={styles.card}>
      <div style={styles.clientHeader}>
        {client.logo ? (
          <img
            src={client.logo}
            alt={`Logo ${client.name}`}
            style={styles.clientLogo}
          />
        ) : (
          <div style={styles.clientLogoPlaceholder}>
            <FaBuilding />
          </div>
        )}
        <div style={styles.clientInfo}>
          <h2 style={styles.clientName}>{client.name}</h2>
          <div style={styles.clientSector}>
            {client.sector || "Secteur non spécifié"}
          </div>
          <div style={styles.badgeContainer}>
            <span
              style={{
                ...styles.statusBadge,
                backgroundColor: client.isActive ? "#4caf50" : "#f44336",
              }}
            >
              {client.isActive ? "Actif" : "Inactif"}
            </span>
          </div>
        </div>
      </div>

      {client.description && (
        <p style={styles.clientDescription}>{client.description}</p>
      )}

      <div style={styles.divider}></div>

      <div style={styles.detailsGrid}>
        {client.email && (
          <div style={styles.detailItem}>
            <div style={styles.detailLabel}>
              <FaEnvelope />
              Email
            </div>
            <div style={styles.detailValue}>{client.email}</div>
          </div>
        )}

        {client.phone && (
          <div style={styles.detailItem}>
            <div style={styles.detailLabel}>
              <FaPhone />
              Téléphone
            </div>
            <div style={styles.detailValue}>{client.phone}</div>
          </div>
        )}

        {client.address && client.address.city && (
          <div style={styles.detailItem}>
            <div style={styles.detailLabel}>
              <FaMapMarkerAlt />
              Adresse
            </div>
            <div style={styles.detailValue}>
              {client.address.street && `${client.address.street}, `}
              {client.address.city}
              {client.address.zipCode && ` ${client.address.zipCode}`}
              {client.address.country && `, ${client.address.country}`}
            </div>
          </div>
        )}

        {client.createdAt && (
          <div style={styles.detailItem}>
            <div style={styles.detailLabel}>
              <FaCalendarAlt />
              Date de création
            </div>
            <div style={styles.detailValue}>{formatDate(client.createdAt)}</div>
          </div>
        )}
      </div>

      {/* Indicateur "Bonne Poire" */}
      {typeof client.goodForCustomer === "number" && (
        <div style={styles.scoreContainer}>
          <div style={styles.scoreLabel}>Indicateur Bonne Poire</div>
          <div
            style={{
              ...styles.scoreValue,
              color: getScoreColor(client.goodForCustomer),
            }}
          >
            {client.goodForCustomer}/100
          </div>
          <div style={styles.progressBarContainer}>
            <div
              style={{
                ...styles.progressBar,
                width: `${client.goodForCustomer}%`,
                backgroundColor: getScoreColor(client.goodForCustomer),
              }}
            ></div>
          </div>
          <div style={styles.scoreDescription}>
            {getScoreDescription(client.goodForCustomer)}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientInfoCard;
