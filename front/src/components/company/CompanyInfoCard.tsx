import React from "react";
import { companyDetailsStyles as styles } from "@/styles/pages/dashboard/admin/companyDetailStyles";
import {
  FaBuilding,
  FaEnvelope,
  FaPhone,
  FaGlobe,
  FaMapMarkerAlt,
  FaCalendarAlt,
} from "react-icons/fa";

interface CompanyInfoCardProps {
  company: any;
  formatDate: (dateString?: string) => string;
}

const CompanyInfoCard: React.FC<CompanyInfoCardProps> = ({
  company,
  formatDate,
}) => {
  return (
    <div style={styles.card}>
      <div style={styles.companyHeader}>
        {company.logo ? (
          <img
            src={company.logo}
            alt={`Logo ${company.name}`}
            style={styles.companyLogo}
          />
        ) : (
          <div style={styles.companyLogoPlaceholder}>
            <FaBuilding />
          </div>
        )}
        <div style={styles.companyInfo}>
          <h2 style={styles.companyName}>{company.name}</h2>
          <div style={styles.companyIndustry}>
            {company.industry || "Secteur non spécifié"}
          </div>
          <div style={styles.badgeContainer}>
            <span
              style={{
                ...styles.statusBadge,
                backgroundColor: company.isActive ? "#4caf50" : "#f44336",
              }}
            >
              {company.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </div>

      {company.description && (
        <p style={styles.companyDescription}>{company.description}</p>
      )}

      <div style={styles.divider}></div>

      <div style={styles.detailsGrid}>
        {company.email && (
          <div style={styles.detailItem}>
            <div style={styles.detailLabel}>
              <FaEnvelope />
              Email
            </div>
            <div style={styles.detailValue}>{company.email}</div>
          </div>
        )}

        {company.phone && (
          <div style={styles.detailItem}>
            <div style={styles.detailLabel}>
              <FaPhone />
              Téléphone
            </div>
            <div style={styles.detailValue}>{company.phone}</div>
          </div>
        )}

        {company.website && (
          <div style={styles.detailItem}>
            <div style={styles.detailLabel}>
              <FaGlobe />
              Site web
            </div>
            <div style={styles.detailValue}>
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                {company.website}
              </a>
            </div>
          </div>
        )}

        {company.address && company.address.city && (
          <div style={styles.detailItem}>
            <div style={styles.detailLabel}>
              <FaMapMarkerAlt />
              Adresse
            </div>
            <div style={styles.detailValue}>
              {company.address.city}
              {company.address.country && `, ${company.address.country}`}
            </div>
          </div>
        )}

        {company.createdAt && (
          <div style={styles.detailItem}>
            <div style={styles.detailLabel}>
              <FaCalendarAlt />
              Date de création
            </div>
            <div style={styles.detailValue}>
              {formatDate(company.createdAt)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyInfoCard;
