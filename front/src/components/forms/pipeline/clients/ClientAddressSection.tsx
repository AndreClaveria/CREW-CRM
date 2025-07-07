// /components/form/client/ClientAddressSection.tsx
import React from "react";
import { clientFormStyles as styles } from "@/styles/components/forms/ClientFormStyles";

interface ClientAddressSectionProps {
  address: {
    street: string;
    city: string;
    zipCode: string;
    country: string;
  };
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}

const ClientAddressSection: React.FC<ClientAddressSectionProps> = ({
  address,
  handleChange,
}) => {
  return (
    <div style={styles.formGroup}>
      <h3 style={styles.subsectionTitle}>Adresse</h3>

      <div style={styles.formGroup}>
        <label style={styles.label}>Rue</label>
        <input
          type="text"
          name="address.street"
          value={address.street}
          onChange={handleChange}
          style={styles.input}
        />
      </div>

      <div style={styles.flexRow}>
        <div style={styles.flexColumn}>
          <label style={styles.label}>Ville</label>
          <input
            type="text"
            name="address.city"
            value={address.city}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div style={styles.flexColumn}>
          <label style={styles.label}>Code postal</label>
          <input
            type="text"
            name="address.zipCode"
            value={address.zipCode}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
      </div>

      <div>
        <label style={styles.label}>Pays</label>
        <input
          type="text"
          name="address.country"
          value={address.country}
          onChange={handleChange}
          style={styles.input}
        />
      </div>
    </div>
  );
};

export default ClientAddressSection;
