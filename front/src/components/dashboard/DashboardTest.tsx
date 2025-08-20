import React from "react";
import { dashboardStyles } from "@/styles/pages/dashboard/dashboardStyles";

const DashboardTest: React.FC = () => {
  return (
    <div style={dashboardStyles.container}>
      <div style={dashboardStyles.welcomeCard}>
        <h1 style={dashboardStyles.welcomeTitle}>Test du Nouveau Design</h1>
        <p style={dashboardStyles.welcomeText}>
          Vérification des nouveaux styles et composants
        </p>
      </div>

      <div style={dashboardStyles.statsSection}>
        <h2 style={dashboardStyles.sectionTitle}>Section Statistiques</h2>
        <div style={dashboardStyles.statsGrid}>
          <div style={dashboardStyles.statCard}>
            <h3 style={dashboardStyles.statNumber}>4</h3>
            <p style={dashboardStyles.statLabel}>Clients</p>
          </div>
          <div style={dashboardStyles.statCard}>
            <h3 style={dashboardStyles.statNumber}>3</h3>
            <p style={dashboardStyles.statLabel}>Contacts</p>
          </div>
        </div>
      </div>

      <div style={dashboardStyles.chartsSection}>
        <h2 style={dashboardStyles.sectionTitle}>Section Graphiques</h2>
        <p>Contenu des graphiques</p>
      </div>

      <div style={dashboardStyles.dealsSection}>
        <h2 style={dashboardStyles.sectionTitle}>Section Deals</h2>
        <div style={dashboardStyles.dealsGrid}>
          <div style={dashboardStyles.dealCard}>
            <h3 style={dashboardStyles.dealValue}>15,000€</h3>
            <p style={dashboardStyles.dealLabel}>Valeur Totale</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTest;
