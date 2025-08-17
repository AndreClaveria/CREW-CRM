import React from "react";
import { companyFormStyles as styles } from "@/styles/components/forms/CompanyFormStyles";

interface CompanyGeneralInfoProps {
  name: string;
  industry: string;
  description: string;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}

const CompanyGeneralInfo: React.FC<CompanyGeneralInfoProps> = ({
  name,
  industry,
  description,
  handleChange,
}) => {
  // Liste des secteurs d'activité en France selon la nomenclature NAF/APE simplifiée
  const industriesList = [
    { value: "", label: "Sélectionnez un secteur" },
    { value: "agriculture", label: "Agriculture, sylviculture et pêche" },
    { value: "extractive", label: "Industries extractives" },
    { value: "manufacturing", label: "Industrie manufacturière" },
    {
      value: "energy",
      label: "Production et distribution d'électricité, de gaz",
    },
    {
      value: "water",
      label: "Production et distribution d'eau, assainissement",
    },
    { value: "construction", label: "Construction" },
    {
      value: "retail",
      label: "Commerce, réparation d'automobiles et de motocycles",
    },
    { value: "transport", label: "Transports et entreposage" },
    { value: "hospitality", label: "Hébergement et restauration" },
    { value: "information", label: "Information et communication" },
    { value: "finance", label: "Activités financières et d'assurance" },
    { value: "realestate", label: "Activités immobilières" },
    {
      value: "scientific",
      label: "Activités spécialisées, scientifiques et techniques",
    },
    {
      value: "admin",
      label: "Activités de services administratifs et de soutien",
    },
    { value: "publicadmin", label: "Administration publique" },
    { value: "education", label: "Enseignement" },
    { value: "health", label: "Santé humaine et action sociale" },
    { value: "arts", label: "Arts, spectacles et activités récréatives" },
    { value: "other", label: "Autres activités de services" },
    {
      value: "household",
      label: "Activités des ménages en tant qu'employeurs",
    },
    { value: "extraterritorial", label: "Activités extra-territoriales" },
  ];

  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>Informations générales</h2>

      <div style={styles.twoColumnGrid}>
        <div>
          <label style={styles.label}>
            Nom de l’entreprise <span style={styles.requiredField}>*</span>
          </label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div>
          <label style={styles.label}>
            Secteur d’activité <span style={styles.requiredField}>*</span>
          </label>
          <select
            name="industry"
            value={industry}
            onChange={handleChange}
            required
            style={styles.select}
          >
            {industriesList.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div style={styles.helperText}>
            Sélectionnez le secteur principal d’activité de votre entreprise
          </div>
        </div>
      </div>

      <div style={styles.formGroupMt}>
        <label style={styles.label}>Description</label>
        <textarea
          name="description"
          value={description}
          onChange={handleChange}
          rows={4}
          style={styles.textarea}
          placeholder="Décrivez brièvement l'activité de votre entreprise..."
        />
      </div>
    </div>
  );
};

export default CompanyGeneralInfo;
