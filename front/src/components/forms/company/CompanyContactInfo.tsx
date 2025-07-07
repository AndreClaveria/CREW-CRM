// /components/form/company/CompanyContactInfo.tsx
import React from "react";
import { companyFormStyles as styles } from "@/styles/components/forms/CompanyFormStyles";

interface CompanyContactInfoProps {
  email: string;
  phone: string;
  website: string;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}

const CompanyContactInfo: React.FC<CompanyContactInfoProps> = ({
  email,
  phone,
  website,
  handleChange,
}) => {
  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>Informations de contact</h2>

      <div style={styles.twoColumnGrid}>
        <div>
          <label style={styles.label}>
            Email <span style={styles.requiredField}>*</span>
          </label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div>
          <label style={styles.label}>Téléphone</label>
          <input
            type="tel"
            name="phone"
            value={phone}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
      </div>

      <div style={styles.formGroupMt}>
        <label style={styles.label}>Site web</label>
        <input
          type="url"
          name="website"
          value={website}
          onChange={handleChange}
          placeholder="https://example.com"
          style={styles.input}
        />
      </div>
    </div>
  );
};

export default CompanyContactInfo;
