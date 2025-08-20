import React from "react";
import { dashboardStyles } from "@/styles/pages/dashboard/dashboardStyles";
import { useDashboardData } from "@/hooks/useDashboardData";

const DashboardDebug: React.FC = () => {
  const { data, isLoading, error } = useDashboardData();

  if (isLoading) {
    return (
      <div style={dashboardStyles.welcomeCard}>
        <h3>🔄 Chargement des données...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div style={dashboardStyles.welcomeCard}>
        <h3>❌ Erreur: {error}</h3>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={dashboardStyles.welcomeCard}>
        <h3>⚠️ Aucune donnée disponible</h3>
      </div>
    );
  }

  return (
    <div style={dashboardStyles.welcomeCard}>
      <h2 style={dashboardStyles.sectionTitle}>
        🔍 Debug - Données du Dashboard
      </h2>

      <div style={dashboardStyles.statsGrid}>
        <div style={dashboardStyles.statCard}>
          <h3 style={dashboardStyles.statNumber}>{data.totalClients}</h3>
          <p style={dashboardStyles.statLabel}>Clients</p>
        </div>
        <div style={dashboardStyles.statCard}>
          <h3 style={dashboardStyles.statNumber}>{data.totalContacts}</h3>
          <p style={dashboardStyles.statLabel}>Contacts</p>
        </div>
        <div style={dashboardStyles.statCard}>
          <h3 style={dashboardStyles.statNumber}>{data.totalOpportunities}</h3>
          <p style={dashboardStyles.statLabel}>Opportunités</p>
        </div>
        <div style={dashboardStyles.statCard}>
          <h3 style={dashboardStyles.statNumber}>{data.totalDeals}</h3>
          <p style={dashboardStyles.statLabel}>Deals</p>
        </div>
      </div>

      <div style={{ marginTop: "var(--spacing-big)" }}>
        <h3>📊 Détails des Deals</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "var(--spacing-normal)",
            marginTop: "var(--spacing-normal)",
          }}
        >
          <div
            style={{
              padding: "var(--spacing-normal)",
              backgroundColor: "var(--color-grey-100)",
              borderRadius: "var(--border-small-radius)",
            }}
          >
            <strong>Prospection:</strong> {data.dealsByStatus.prospection}
          </div>
          <div
            style={{
              padding: "var(--spacing-normal)",
              backgroundColor: "var(--color-grey-100)",
              borderRadius: "var(--border-small-radius)",
            }}
          >
            <strong>Qualification:</strong> {data.dealsByStatus.qualification}
          </div>
          <div
            style={{
              padding: "var(--spacing-normal)",
              backgroundColor: "var(--color-grey-100)",
              borderRadius: "var(--border-small-radius)",
            }}
          >
            <strong>Proposition:</strong> {data.dealsByStatus.proposition}
          </div>
          <div
            style={{
              padding: "var(--spacing-normal)",
              backgroundColor: "var(--color-grey-100)",
              borderRadius: "var(--border-small-radius)",
            }}
          >
            <strong>Négociation:</strong> {data.dealsByStatus.negociation}
          </div>
          <div
            style={{
              padding: "var(--spacing-normal)",
              backgroundColor: "var(--color-grey-100)",
              borderRadius: "var(--border-small-radius)",
            }}
          >
            <strong>Signature:</strong> {data.dealsByStatus.signature}
          </div>
          <div
            style={{
              padding: "var(--spacing-normal)",
              backgroundColor: "var(--color-grey-100)",
              borderRadius: "var(--border-small-radius)",
            }}
          >
            <strong>Gagnés:</strong> {data.dealsByStatus.gagne}
          </div>
          <div
            style={{
              padding: "var(--spacing-normal)",
              backgroundColor: "var(--color-grey-100)",
              borderRadius: "var(--border-small-radius)",
            }}
          >
            <strong>Perdus:</strong> {data.dealsByStatus.perdu}
          </div>
        </div>
      </div>

      <div style={{ marginTop: "var(--spacing-big)" }}>
        <h3>💰 Valeurs Financières</h3>
        <div style={dashboardStyles.statsGrid}>
          <div style={dashboardStyles.statCard}>
            <h3 style={dashboardStyles.statNumber}>
              {data.totalDealValue.toLocaleString()}€
            </h3>
            <p style={dashboardStyles.statLabel}>Valeur Totale</p>
          </div>
          <div style={dashboardStyles.statCard}>
            <h3 style={dashboardStyles.statNumber}>
              {data.wonDealValue.toLocaleString()}€
            </h3>
            <p style={dashboardStyles.statLabel}>CA Gagné</p>
          </div>
          <div style={dashboardStyles.statCard}>
            <h3 style={dashboardStyles.statNumber}>
              {data.pendingDealValue.toLocaleString()}€
            </h3>
            <p style={dashboardStyles.statLabel}>CA en Cours</p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: "var(--spacing-big)" }}>
        <h3>📈 Pipeline Commercial</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "var(--spacing-normal)",
            marginTop: "var(--spacing-normal)",
          }}
        >
          {data.pipelineOverview.map((stage, index) => (
            <div
              key={index}
              style={{
                padding: "var(--spacing-normal)",
                backgroundColor: "var(--color-grey-50)",
                borderRadius: "var(--border-small-radius)",
                border: "1px solid var(--color-grey-200)",
              }}
            >
              <h4
                style={{ margin: "0 0 0.5rem 0", color: "var(--color-main)" }}
              >
                {stage.stage}
              </h4>
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  marginBottom: "0.25rem",
                }}
              >
                {stage.count} deals
              </div>
              <div style={{ fontSize: "1rem", color: "var(--color-grey-600)" }}>
                {stage.value.toLocaleString()}€
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          marginTop: "var(--spacing-big)",
          padding: "var(--spacing-normal)",
          backgroundColor: "var(--color-grey-50)",
          borderRadius: "var(--border-small-radius)",
          fontSize: "var(--font-size-small)",
        }}
      >
        <strong>💡 Conseils de débogage :</strong>
        <ul style={{ margin: "0.5rem 0", paddingLeft: "1.5rem" }}>
          <li>Vérifiez la console du navigateur pour les logs détaillés</li>
          <li>Assurez-vous que l'utilisateur a une entreprise associée</li>
          <li>Vérifiez que les services API fonctionnent correctement</li>
          <li>Vérifiez les permissions d'accès aux données</li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardDebug;
