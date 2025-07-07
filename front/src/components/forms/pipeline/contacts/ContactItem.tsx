// /components/form/contact/ContactItem.tsx
import React from "react";
import { contactStyles as styles } from "@/styles/components/forms/ContactFormStyles";

export interface ContactFormData {
  firstName: string;
  lastName: string;
  position?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  isPrimary?: boolean;
  notes?: string;
}

interface ContactItemProps {
  contact: ContactFormData;
  index: number;
  handleContactChange: (
    index: number,
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  removeContact: (index: number) => void;
}

const ContactItem: React.FC<ContactItemProps> = ({
  contact,
  index,
  handleContactChange,
  removeContact,
}) => {
  return (
    <div style={styles.contactItem}>
      <div style={styles.contactHeader}>
        <h3 style={styles.contactTitle}>Contact #{index + 1}</h3>
        <button
          type="button"
          onClick={() => removeContact(index)}
          style={styles.deleteButton}
        >
          Supprimer
        </button>
      </div>

      <div style={styles.flexRow}>
        <div style={styles.flexColumn}>
          <label style={styles.label}>
            Prénom <span style={styles.requiredField}>*</span>
          </label>
          <input
            type="text"
            name="firstName"
            value={contact.firstName}
            onChange={(e) => handleContactChange(index, e)}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.flexColumn}>
          <label style={styles.label}>
            Nom <span style={styles.requiredField}>*</span>
          </label>
          <input
            type="text"
            name="lastName"
            value={contact.lastName}
            onChange={(e) => handleContactChange(index, e)}
            required
            style={styles.input}
          />
        </div>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Fonction</label>
        <input
          type="text"
          name="position"
          value={contact.position}
          onChange={(e) => handleContactChange(index, e)}
          style={styles.input}
        />
      </div>

      <div style={styles.flexRow}>
        <div style={styles.flexColumn}>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            name="email"
            value={contact.email}
            onChange={(e) => handleContactChange(index, e)}
            style={styles.input}
          />
        </div>

        <div style={styles.flexColumn}>
          <label style={styles.label}>Téléphone fixe</label>
          <input
            type="tel"
            name="phone"
            value={contact.phone}
            onChange={(e) => handleContactChange(index, e)}
            style={styles.input}
          />
        </div>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Mobile</label>
        <input
          type="tel"
          name="mobile"
          value={contact.mobile}
          onChange={(e) => handleContactChange(index, e)}
          style={styles.input}
        />
      </div>

      <div>
        <label style={styles.checkboxContainer}>
          <input
            type="checkbox"
            name="isPrimary"
            checked={contact.isPrimary}
            onChange={(e) => handleContactChange(index, e)}
            style={styles.checkbox}
          />
          Contact principal
        </label>
      </div>
    </div>
  );
};

export default ContactItem;
