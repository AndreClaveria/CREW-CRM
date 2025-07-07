// /components/form/company/CompanyAddressInfo.tsx
import React from "react";
import { companyFormStyles as styles } from "@/styles/components/forms/CompanyFormStyles";

interface CompanyAddressInfoProps {
  street: string;
  city: string;
  zipCode: string;
  country: string;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}

const CompanyAddressInfo: React.FC<CompanyAddressInfoProps> = ({
  street,
  city,
  zipCode,
  country,
  handleChange,
}) => {
  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>Adresse</h2>

      <div style={styles.formGroup}>
        <label style={styles.label}>Rue</label>
        <input
          type="text"
          name="street"
          value={street}
          onChange={handleChange}
          style={styles.input}
        />
      </div>

      <div style={styles.threeColumnGrid}>
        <div>
          <label style={styles.label}>Ville</label>
          <input
            type="text"
            name="city"
            value={city}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div>
          <label style={styles.label}>Code postal</label>
          <input
            type="text"
            name="zipCode"
            value={zipCode}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div>
          <label style={styles.label}>Pays</label>
          <input
            type="text"
            name="country"
            value={country}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
      </div>
    </div>
  );
};

export default CompanyAddressInfo;
