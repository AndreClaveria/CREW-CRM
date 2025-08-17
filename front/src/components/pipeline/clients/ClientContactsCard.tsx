import React from "react";
import { clientDetailsStyles as styles } from "@/styles/pages/dashboard/admin/clientDetailsStyles";
import {
  FaUserTie,
  FaPlus,
  FaExclamationTriangle,
  FaStar,
  FaEnvelope,
} from "react-icons/fa";
import ActionButton from "@/components/common/ActionButton";

interface ClientContactsCardProps {
  contacts: any[];
  navigateToContact: (contactId: string) => void;
  navigateToContactsManagement: () => void;
  navigateToMailPage: (contactEmail?: string) => void; // Nouveau prop pour la navigation vers la page d’e-mail
}

const ClientContactsCard: React.FC<ClientContactsCardProps> = ({
  contacts,
  navigateToContact,
  navigateToContactsManagement,
  navigateToMailPage,
}) => {
  // Styles supplémentaires pour les actions de contact

  return (
    <div style={styles.card}>
      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>
          <FaUserTie style={styles.sectionIcon} />
          Contacts
        </h2>
        <div>
          <ActionButton
            onClick={navigateToContactsManagement}
            variant="primary"
            size="small"
          >
            <FaPlus style={{ marginRight: "8px" }} />
            Ajouter un contact
          </ActionButton>
        </div>
      </div>

      {contacts.length > 0 ? (
        <div style={styles.contactsContainer}>
          {contacts.map((contact) => (
            <div key={contact._id} style={styles.contactCard}>
              <div
                style={{ ...styles.contactCard, cursor: "pointer" }}
                onClick={() => navigateToContact(contact._id)}
              >
                <div style={styles.contactAvatar}>
                  {contact.firstName?.charAt(0) || ""}
                  {contact.lastName?.charAt(0) || ""}
                </div>
                <div style={styles.contactInfo}>
                  <div style={styles.contactName}>
                    {contact.firstName} {contact.lastName}
                    {contact.isPrimary && (
                      <FaStar
                        style={{
                          marginLeft: "0.5rem",
                          color: "#ffc107",
                          fontSize: "0.875rem",
                        }}
                        title="Contact principal"
                      />
                    )}
                  </div>
                  {contact.position && (
                    <div style={styles.contactPosition}>{contact.position}</div>
                  )}
                  {contact.email && (
                    <div style={styles.contactEmail}>{contact.email}</div>
                  )}
                </div>
              </div>

              {contact.email && (
                <div style={styles.contactActionStyles}>
                  <ActionButton
                    onClick={() => {
                      navigateToMailPage(contact.email);
                    }}
                    variant="secondary"
                    size="small"
                  >
                    <FaEnvelope style={{ marginRight: "8px" }} />
                    Envoyer un e-mail
                  </ActionButton>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.noDataCard}>
          <FaExclamationTriangle style={styles.noDataIcon} />
          <div style={styles.noDataText}>
            Aucun contact n’a été ajouté pour ce client.
          </div>
          <ActionButton
            onClick={navigateToContactsManagement}
            variant="primary"
            size="medium"
          >
            <FaPlus style={{ marginRight: "8px" }} />
            Ajouter un contact
          </ActionButton>
        </div>
      )}
    </div>
  );
};

export default ClientContactsCard;
