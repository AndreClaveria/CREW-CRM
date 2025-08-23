import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getAllClients } from "@/services/client.service";
import { getAllContacts } from "@/services/contact.service";
import { getAllOpportunities } from "@/services/opportunity.service";
import { getDealsByCompany, getAllDeals } from "@/services/deal.service";

export interface DashboardData {
  // Statistiques générales
  totalClients: number;
  totalContacts: number;
  totalOpportunities: number;
  totalDeals: number;

  // Données des deals
  dealsByStatus: {
    prospection: number;
    qualification: number;
    proposition: number;
    negociation: number;
    signature: number;
    perdu: number;
    gagne: number;
  };

  // Valeur totale des deals
  totalDealValue: number;
  wonDealValue: number;
  pendingDealValue: number;

  // Performance mensuelle (opportunités créées par mois)
  monthlyOpportunities: Array<{
    month: string;
    count: number;
    maxValue: number;
  }>;

  // Activité récente
  recentActivity: Array<{
    type: "client" | "contact" | "opportunity" | "deal";
    message: string;
    time: string;
    id: string;
  }>;

  // Prochaines actions (deals avec dates de fermeture proches)
  upcomingActions: Array<{
    priority: "high" | "medium" | "low";
    action: string;
    date: string;
    dealId: string;
  }>;

  // Données pour les managers
  teamPerformance?: Array<{
    name: string;
    deals: number;
    revenue: number;
    status: "excellent" | "bon" | "moyen";
  }>;

  // Pipeline commercial
  pipelineOverview: Array<{
    stage: string;
    count: number;
    value: number;
  }>;
}

export const useDashboardData = () => {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        setError(null);

        // Récupérer toutes les données en parallèle
        const [clients, contacts, opportunities, deals] = await Promise.all([
          getAllClients().catch((err) => {
            console.error("❌ Erreur getAllClients:", err);
            return [];
          }),
          getAllContacts().catch((err) => {
            console.error("❌ Erreur getAllContacts:", err);
            return [];
          }),
          getAllOpportunities().catch((err) => {
            console.error("❌ Erreur getAllOpportunities:", err);
            return [];
          }),
          // Utiliser directement getAllDeals pour éviter les problèmes de filtrage par entreprise
          getAllDeals().catch((err) => {
            console.error("❌ Erreur getAllDeals:", err);
            return [];
          }),
        ]);

        // Vérifier et normaliser les données
        const normalizedClients = Array.isArray(clients) ? clients : [];
        const normalizedContacts = Array.isArray(contacts) ? contacts : [];
        const normalizedOpportunities = Array.isArray(opportunities) ? opportunities : [];
        const normalizedDeals = Array.isArray(deals) ? deals : [];

        // Calculer les statistiques des deals
        const dealsByStatus = {
          prospection: normalizedDeals.filter((d) => d.status === "prospection")
            .length,
          qualification: normalizedDeals.filter(
            (d) => d.status === "qualification"
          ).length,
          proposition: normalizedDeals.filter((d) => d.status === "proposition")
            .length,
          negociation: normalizedDeals.filter((d) => d.status === "negociation")
            .length,
          signature: normalizedDeals.filter((d) => d.status === "signature")
            .length,
          perdu: normalizedDeals.filter((d) => d.status === "perdu").length,
          gagne: normalizedDeals.filter((d) => d.status === "gagne").length,
        };

        // Calculer les valeurs des deals
        const totalDealValue = normalizedDeals.reduce(
          (sum, deal) => sum + (deal.value || 0),
          0
        );
        const wonDealValue = normalizedDeals
          .filter((d) => d.status === "gagne")
          .reduce((sum, deal) => sum + (deal.value || 0), 0);
        const pendingDealValue = normalizedDeals
          .filter((d) => !["perdu", "gagne"].includes(d.status))
          .reduce((sum, deal) => sum + (deal.value || 0), 0);

        // Calculer les opportunités par mois (6 derniers mois)
        const now = new Date();
        const monthlyOpportunities = Array.from({ length: 6 }, (_, i) => {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const monthName = date.toLocaleDateString("fr-FR", { month: "long" });
          const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
          const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

          const count = normalizedOpportunities.filter((opp) => {
            const oppDate = new Date(opp.createdAt || "");
            return oppDate >= monthStart && oppDate <= monthEnd;
          }).length;

          return {
            month: monthName,
            count,
            maxValue: Math.max(
              ...Array.from({ length: 6 }, (_, j) => {
                const jDate = new Date(
                  now.getFullYear(),
                  now.getMonth() - j,
                  1
                );
                const jMonthStart = new Date(
                  jDate.getFullYear(),
                  jDate.getMonth(),
                  1
                );
                const jMonthEnd = new Date(
                  jDate.getFullYear(),
                  jDate.getMonth() + 1,
                  0
                );
                return normalizedOpportunities.filter((opp) => {
                  const oppDate = new Date(opp.createdAt || "");
                  return oppDate >= jMonthStart && oppDate <= jMonthEnd;
                }).length;
              })
            ),
          };
        }).reverse();

        // Créer l'activité récente
        const recentActivity = [
          ...normalizedClients.slice(0, 2).map((client) => ({
            type: "client" as const,
            message: `Client mis à jour: ${client.name}`,
            time: "Il y a 2h",
            id: client._id,
          })),
          ...normalizedContacts.slice(0, 1).map((contact) => ({
            type: "contact" as const,
            message: `Contact mis à jour: ${contact.firstName} ${contact.lastName}`,
            time: "Il y a 4h",
            id: contact._id,
          })),
          ...normalizedOpportunities.slice(0, 1).map((opp) => ({
            type: "opportunity" as const,
            message: `Nouvelle opportunité: ${opp.title}`,
            time: "Il y a 1j",
            id: opp._id,
          })),
        ];

        // Créer les prochaines actions basées sur les deals
        const upcomingActions = normalizedDeals
          .filter(
            (deal) =>
              deal.expectedClosingDate &&
              deal.status !== "gagne" &&
              deal.status !== "perdu"
          )
          .sort(
            (a, b) =>
              new Date(a.expectedClosingDate || "").getTime() -
              new Date(b.expectedClosingDate || "").getTime()
          )
          .slice(0, 3)
          .map((deal) => {
            const closingDate = new Date(deal.expectedClosingDate || "");
            const daysUntilClosing = Math.ceil(
              (closingDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
            );

            let priority: "high" | "medium" | "low" = "low";
            if (daysUntilClosing <= 3) priority = "high";
            else if (daysUntilClosing <= 7) priority = "medium";

            let dateText = "";
            if (daysUntilClosing < 0) dateText = "En retard";
            else if (daysUntilClosing === 0) dateText = "Aujourd'hui";
            else if (daysUntilClosing === 1) dateText = "Demain";
            else dateText = `Dans ${daysUntilClosing} jours`;

            return {
              priority,
              action: `Deal: ${deal.title} - ${deal.status}`,
              date: dateText,
              dealId: deal._id,
            };
          });

        // Pipeline commercial
        const pipelineOverview = [
          {
            stage: "Prospection",
            count: dealsByStatus.prospection,
            value: normalizedDeals
              .filter((d) => d.status === "prospection")
              .reduce((sum, deal) => sum + (deal.value || 0), 0),
          },
          {
            stage: "Qualification",
            count: dealsByStatus.qualification,
            value: normalizedDeals
              .filter((d) => d.status === "qualification")
              .reduce((sum, deal) => sum + (deal.value || 0), 0),
          },
          {
            stage: "Proposition",
            count: dealsByStatus.proposition,
            value: normalizedDeals
              .filter((d) => d.status === "proposition")
              .reduce((sum, deal) => sum + (deal.value || 0), 0),
          },
          {
            stage: "Négociation",
            count: dealsByStatus.negociation,
            value: normalizedDeals
              .filter((d) => d.status === "negociation")
              .reduce((sum, deal) => sum + (deal.value || 0), 0),
          },
          {
            stage: "Signature",
            count: dealsByStatus.signature,
            value: normalizedDeals
              .filter((d) => d.status === "signature")
              .reduce((sum, deal) => sum + (deal.value || 0), 0),
          },
        ];

        const dashboardData: DashboardData = {
          totalClients: normalizedClients.length,
          totalContacts: normalizedContacts.length,
          totalOpportunities: normalizedOpportunities.length,
          totalDeals: normalizedDeals.length,
          dealsByStatus,
          totalDealValue,
          wonDealValue,
          pendingDealValue,
          monthlyOpportunities,
          recentActivity,
          upcomingActions,
          pipelineOverview,
        };

        setData(dashboardData);
      } catch (err: any) {
        console.error(
          "❌ Erreur lors du chargement des données du dashboard:",
          err
        );
        setError(
          err.message || "Impossible de charger les données du dashboard"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  return { data, isLoading, error };
};
