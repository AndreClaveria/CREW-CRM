import React from "react";
import { dashboardStyles } from "@/styles/pages/dashboard/dashboardStyles";
import QuickStats from "./QuickStats";
import DashboardLoading from "./DashboardLoading";
import DashboardError from "./DashboardError";
import { useDashboardData } from "@/hooks/useDashboardData";

const UserDashboard: React.FC = () => {
  const { data, isLoading, error } = useDashboardData();

  if (isLoading) {
    return <DashboardLoading />;
  }

  if (error || !data) {
    return <DashboardError error={error || "Données non disponibles"} />;
  }

  // Statistiques utilisateur basées sur les vraies données
  const userStats = [
    {
      label: "Contacts",
      value: data.totalContacts,
      icon: "👤",
      color: "#10b981",
    },
    {
      label: "Clients",
      value: data.totalClients,
      icon: "👥",
      color: "#3b82f6",
    },
    {
      label: "Opportunités",
      value: data.totalOpportunities,
      icon: "💼",
      color: "#f59e0b",
    },
  ];

  return (
    <div style={dashboardStyles.dashboardGrid}>
      {/* Statistiques principales */}
      <div style={dashboardStyles.statsSection}>
        <h2 style={dashboardStyles.sectionTitle}>Vue d&apos;Ensemble</h2>
        <QuickStats stats={userStats} />
      </div>

      {/* Activité récente */}
      <div style={dashboardStyles.activitySection}>
        <h2 style={dashboardStyles.sectionTitle}>Activité Récente</h2>
        <div style={dashboardStyles.activityTable}>
          <div style={dashboardStyles.tableHeader}>
            <span>Type</span>
            <span>Message</span>
            <span>Heure</span>
          </div>
          {data.recentActivity.map((activity, index) => (
            <div key={index} style={dashboardStyles.tableRow}>
              <span style={dashboardStyles.activityType}>
                {activity.type === "opportunity" && "💼 Opportunité"}
                {activity.type === "contact" && "👤 Contact"}
                {activity.type === "deal" && "💰 Deal"}
                {activity.type === "client" && "🏢 Client"}
              </span>
              <span style={dashboardStyles.activityMessage}>
                {activity.message}
              </span>
              <span style={dashboardStyles.activityTime}>{activity.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Prochaines actions */}
      <div style={dashboardStyles.actionsSection}>
        <h2 style={dashboardStyles.sectionTitle}>Prochaines Actions</h2>
        <div style={dashboardStyles.actionsTable}>
          <div style={dashboardStyles.tableHeader}>
            <span>Priorité</span>
            <span>Action</span>
            <span>Date</span>
          </div>
          {[
            {
              priority: "high" as const,
              action: "Appeler le client Jean Dupont",
              date: "Aujourd&apos;hui",
            },
            {
              priority: "medium" as const,
              action: "Préparer la présentation pour la réunion",
              date: "Demain",
            },
            {
              priority: "low" as const,
              action: "Mettre à jour la base de données clients",
              date: "Cette semaine",
            },
          ].map((action, index) => (
            <div key={index} style={dashboardStyles.tableRow}>
              <span style={dashboardStyles.priorityBadge}>
                {action.priority === "high"
                  ? "🔴 Urgent"
                  : action.priority === "medium"
                  ? "🟡 Moyen"
                  : "🟢 Faible"}
              </span>
              <span style={dashboardStyles.actionText}>{action.action}</span>
              <span style={dashboardStyles.actionDate}>{action.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
