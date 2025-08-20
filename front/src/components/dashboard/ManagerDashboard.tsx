import React from "react";
import { dashboardStyles } from "@/styles/pages/dashboard/dashboardStyles";
import QuickStats from "./QuickStats";
import SimpleChart from "./SimpleChart";
import DashboardLoading from "./DashboardLoading";
import DashboardError from "./DashboardError";
import { useDashboardData } from "@/hooks/useDashboardData";

const ManagerDashboard: React.FC = () => {
  const { data, isLoading, error } = useDashboardData();

  if (isLoading) {
    return <DashboardLoading />;
  }

  if (error || !data) {
    return <DashboardError error={error || "Données non disponibles"} />;
  }

  // Statistiques manager basées sur les vraies données
  const managerStats = [
    {
      label: "Total Clients",
      value: data.totalClients,
      icon: "👥",
      color: "#3b82f6",
    },
    {
      label: "CA Total",
      value: `${(data.totalDealValue / 1000).toFixed(1)}k€`,
      icon: "💵",
      color: "#10b981",
    },
    {
      label: "Deals Actifs",
      value: data.totalDeals,
      icon: "🎯",
      color: "#f59e0b",
    },
    {
      label: "Taux de Conversion",
      value: `${
        data.totalDeals > 0
          ? Math.round((data.dealsByStatus.gagne / data.totalDeals) * 100)
          : 0
      }%`,
      icon: "📈",
      color: "#8b5cf6",
    },
  ];

  // Données de performance des deals par statut
  const dealsPerformanceData = [
    {
      label: "Prospection",
      value: data.dealsByStatus.prospection,
      maxValue: Math.max(...Object.values(data.dealsByStatus)),
      color: "#3b82f6",
    },
    {
      label: "Qualification",
      value: data.dealsByStatus.qualification,
      maxValue: Math.max(...Object.values(data.dealsByStatus)),
      color: "#10b981",
    },
    {
      label: "Proposition",
      value: data.dealsByStatus.proposition,
      maxValue: Math.max(...Object.values(data.dealsByStatus)),
      color: "#f59e0b",
    },
    {
      label: "Négociation",
      value: data.dealsByStatus.negociation,
      maxValue: Math.max(...Object.values(data.dealsByStatus)),
      color: "#ef4444",
    },
    {
      label: "Signature",
      value: data.dealsByStatus.signature,
      maxValue: Math.max(...Object.values(data.dealsByStatus)),
      color: "#8b5cf6",
    },
  ];

  // Données du pipeline commercial
  const pipelineData = data.pipelineOverview.map((stage) => ({
    label: stage.stage,
    value: stage.count,
    maxValue: Math.max(...data.pipelineOverview.map((s) => s.count)),
    color:
      stage.stage === "Prospection"
        ? "#3b82f6"
        : stage.stage === "Qualification"
        ? "#10b981"
        : stage.stage === "Proposition"
        ? "#f59e0b"
        : stage.stage === "Négociation"
        ? "#ef4444"
        : "#8b5cf6",
  }));

  // Performance de l'équipe (simulée pour l'instant, à adapter selon vos besoins)
  const teamPerformance = [
    {
      name: "Équipe Commerciale",
      deals: data.totalDeals,
      revenue: data.totalDealValue,
      status: "excellent" as const,
    },
    {
      name: "Équipe Marketing",
      deals: Math.floor(data.totalDeals * 0.3),
      revenue: Math.floor(data.totalDealValue * 0.2),
      status: "bon" as const,
    },
    {
      name: "Équipe Support",
      deals: Math.floor(data.totalDeals * 0.1),
      revenue: Math.floor(data.totalDealValue * 0.1),
      status: "moyen" as const,
    },
  ];

  return (
    <div style={dashboardStyles.dashboardGrid}>
      {/* Statistiques de l'équipe */}
      <div style={dashboardStyles.statsSection}>
        <h2 style={dashboardStyles.sectionTitle}>Vue d'Ensemble de l'Équipe</h2>
        <QuickStats stats={managerStats} />
      </div>

      {/* Performance de l'équipe */}
      <div style={dashboardStyles.teamSection}>
        <h2 style={dashboardStyles.sectionTitle}>Performance de l'Équipe</h2>
        <div style={dashboardStyles.teamTable}>
          <div style={dashboardStyles.tableHeader}>
            <span>Équipe</span>
            <span>Deals</span>
            <span>CA</span>
            <span>Statut</span>
          </div>
          {teamPerformance.map((member, index) => (
            <div key={index} style={dashboardStyles.tableRow}>
              <span style={dashboardStyles.memberName}>{member.name}</span>
              <span>{member.deals}</span>
              <span>{member.revenue.toLocaleString()}€</span>
              <span
                style={{
                  ...dashboardStyles.statusBadge,
                  backgroundColor:
                    member.status === "excellent"
                      ? "#10b981"
                      : member.status === "bon"
                      ? "#3b82f6"
                      : "#f59e0b",
                }}
              >
                {member.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Graphiques de performance */}
      <div style={dashboardStyles.chartsSection}>
        <h2 style={dashboardStyles.sectionTitle}>Analyses et Graphiques</h2>
        <div style={dashboardStyles.chartsGrid}>
          <SimpleChart
            title="Performance des Deals par Statut"
            data={dealsPerformanceData}
          />
          <SimpleChart title="Pipeline Commercial" data={pipelineData} />
        </div>
      </div>

      {/* Vue d'ensemble du pipeline */}
      <div style={dashboardStyles.pipelineSection}>
        <h2 style={dashboardStyles.sectionTitle}>Vue d'Ensemble du Pipeline</h2>
        <div style={dashboardStyles.pipelineGrid}>
          {data.pipelineOverview.map((stage, index) => (
            <div key={index} style={dashboardStyles.pipelineCard}>
              <h4 style={dashboardStyles.pipelineStage}>{stage.stage}</h4>
              <div style={dashboardStyles.pipelineStats}>
                <div style={dashboardStyles.pipelineStat}>
                  <span style={dashboardStyles.pipelineNumber}>
                    {stage.count}
                  </span>
                  <span style={dashboardStyles.pipelineLabel}>
                    Opportunités
                  </span>
                </div>
                <div style={dashboardStyles.pipelineStat}>
                  <span style={dashboardStyles.pipelineNumber}>
                    {stage.value.toLocaleString()}€
                  </span>
                  <span style={dashboardStyles.pipelineLabel}>Valeur</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alertes et notifications basées sur les vraies données */}
      <div style={dashboardStyles.alertsSection}>
        <h2 style={dashboardStyles.sectionTitle}>Alertes et Notifications</h2>
        <div style={dashboardStyles.alertsTable}>
          <div style={dashboardStyles.tableHeader}>
            <span>Type</span>
            <span>Message</span>
            <span>Détails</span>
          </div>
          {data.upcomingActions.filter((action) => action.priority === "high")
            .length > 0 && (
            <div style={dashboardStyles.tableRow}>
              <span style={dashboardStyles.alertType}>⚠️ Urgent</span>
              <span>
                {
                  data.upcomingActions.filter(
                    (action) => action.priority === "high"
                  ).length
                }{" "}
                deals urgents nécessitent votre attention
              </span>
              <span style={dashboardStyles.alertDetails}>
                Action immédiate requise
              </span>
            </div>
          )}
          <div style={dashboardStyles.tableRow}>
            <span style={dashboardStyles.alertType}>📊 Pipeline</span>
            <span>
              Pipeline:{" "}
              {data.pipelineOverview.filter((s) => s.count > 0).length}/
              {data.pipelineOverview.length} étapes actives
            </span>
            <span style={dashboardStyles.alertDetails}>
              {Math.round(
                (data.pipelineOverview.filter((s) => s.count > 0).length /
                  data.pipelineOverview.length) *
                  100
              )}
              % d'activité
            </span>
          </div>
          {data.dealsByStatus.prospection > 0 && (
            <div style={dashboardStyles.tableRow}>
              <span style={dashboardStyles.alertType}>🎯 Prospection</span>
              <span>
                {data.dealsByStatus.prospection} prospects en prospection
              </span>
              <span style={dashboardStyles.alertDetails}>
                Valeur potentielle:{" "}
                {data.pipelineOverview
                  .find((s) => s.stage === "Prospection")
                  ?.value.toLocaleString()}
                €
              </span>
            </div>
          )}
          <div style={dashboardStyles.tableRow}>
            <span style={dashboardStyles.alertType}>💰 Financier</span>
            <span>CA en cours vs CA gagné</span>
            <span style={dashboardStyles.alertDetails}>
              {data.pendingDealValue.toLocaleString()}€ |{" "}
              {data.wonDealValue.toLocaleString()}€
            </span>
          </div>
        </div>
      </div>

      {/* Résumé financier détaillé */}
      <div style={dashboardStyles.financialSection}>
        <h2 style={dashboardStyles.sectionTitle}>Résumé Financier</h2>
        <div style={dashboardStyles.financialGrid}>
          <div style={dashboardStyles.financialCard}>
            <h3 style={dashboardStyles.financialValue}>
              {data.totalDealValue.toLocaleString()}€
            </h3>
            <p style={dashboardStyles.financialLabel}>Valeur Totale Pipeline</p>
          </div>
          <div style={dashboardStyles.financialCard}>
            <h3 style={dashboardStyles.financialValue}>
              {data.wonDealValue.toLocaleString()}€
            </h3>
            <p style={dashboardStyles.financialLabel}>CA Réalisé</p>
          </div>
          <div style={dashboardStyles.financialCard}>
            <h3 style={dashboardStyles.financialValue}>
              {data.pendingDealValue.toLocaleString()}€
            </h3>
            <p style={dashboardStyles.financialLabel}>CA en Cours</p>
          </div>
          <div style={dashboardStyles.financialCard}>
            <h3 style={dashboardStyles.financialValue}>
              {data.totalDeals > 0
                ? Math.round((data.dealsByStatus.gagne / data.totalDeals) * 100)
                : 0}
              %
            </h3>
            <p style={dashboardStyles.financialLabel}>Taux de Conversion</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
