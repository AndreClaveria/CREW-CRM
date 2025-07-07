// /components/forms/opportunities/OpportunityContactsSection.tsx
import React, { useState } from "react";
import { opportunityFormStyles as styles } from "@/styles/components/forms/OpportunityFormStyles";
import { Contact } from "@/services/contact.service";

interface OpportunityContactsSectionProps {
  availableContacts: Contact[];
  selectedContactIds: string[];
  onContactSelection: (contactId: string, isSelected: boolean) => void;
}

const OpportunityContactsSection: React.FC<OpportunityContactsSectionProps> = ({
  availableContacts,
  selectedContactIds,
  onContactSelection,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrer les contacts en fonction de la recherche
  const filteredContacts = searchTerm
    ? availableContacts.filter(
        (contact) =>
          `${contact.firstName} ${contact.lastName}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (contact.email &&
            contact.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (contact.position &&
            contact.position.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : availableContacts;

  return (
    <div style={styles.sectionContainer}>
      <h3 style={styles.subSectionTitle}>Contacts associés</h3>

      {availableContacts.length === 0 ? (
        <div style={styles.emptyState}>
          <p>Aucun contact disponible pour ce client.</p>
        </div>
      ) : (
        <>
          <div style={styles.formGroup}>
            <label htmlFor="contact-search" style={styles.label}>
              Rechercher un contact
            </label>
            <input
              type="text"
              id="contact-search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.input}
              placeholder="Rechercher par nom, email ou poste..."
            />
          </div>

          <div style={styles.contactsContainer}>
            {filteredContacts.length === 0 ? (
              <p style={styles.noResults}>
                Aucun contact ne correspond à votre recherche
              </p>
            ) : (
              filteredContacts.map((contact) => {
                const isSelected = selectedContactIds.includes(contact._id);
                return (
                  <div
                    key={contact._id}
                    style={{
                      ...styles.contactCard,
                      ...(isSelected ? styles.contactCardSelected : {}),
                    }}
                    onClick={() => onContactSelection(contact._id, !isSelected)}
                  >
                    <div style={styles.contactCheckbox}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}} // Handled by the onClick of the div
                        style={styles.checkbox}
                      />
                    </div>
                    <div style={styles.contactInfo}>
                      <div style={styles.contactName}>
                        {contact.firstName} {contact.lastName}
                      </div>
                      {contact.position && (
                        <div style={styles.contactPosition}>
                          {contact.position}
                        </div>
                      )}
                      {contact.email && (
                        <div style={styles.contactEmail}>{contact.email}</div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div style={styles.selectedSummary}>
            {selectedContactIds.length} contact
            {selectedContactIds.length !== 1 ? "s" : ""} sélectionné
            {selectedContactIds.length !== 1 ? "s" : ""}
          </div>
        </>
      )}
    </div>
  );
};

export default OpportunityContactsSection;
