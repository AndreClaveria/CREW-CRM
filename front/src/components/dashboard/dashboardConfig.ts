// Configuration des dashboards
export const DASHBOARD_CONFIG = {
  // Règles pour déterminer le rôle de l'utilisateur
  roleRules: {
    manager: {
      emailPatterns: ["admin", "manager", "chef", "directeur"],
      firstNamePatterns: ["Admin", "Manager", "Chef", "Directeur"],
      defaultRole: "manager",
    },
    user: {
      emailPatterns: [],
      firstNamePatterns: [],
      defaultRole: "user",
    },
  },

  // Données par défaut pour les dashboards
  defaultData: {
    user: {
      stats: [
        { label: "Opportunités", value: 0, icon: "💼" },
        { label: "Deals", value: 0, icon: "💰" },
        { label: "Contacts", value: 0, icon: "👤" },
        { label: "Tâches", value: 0, icon: "✅" },
      ],
      performance: [
        { label: "Janvier", value: 0, maxValue: 10, color: "#3b82f6" },
        { label: "Février", value: 0, maxValue: 10, color: "#10b981" },
        { label: "Mars", value: 0, maxValue: 10, color: "#f59e0b" },
        { label: "Avril", value: 0, maxValue: 10, color: "#ef4444" },
      ],
    },
    manager: {
      stats: [
        { label: "Membres d'équipe", value: 0, icon: "👥" },
        { label: "CA Total", value: "0€", icon: "💵" },
        { label: "Deals Actifs", value: 0, icon: "🎯" },
        { label: "Taux de conversion", value: "0%", icon: "📈" },
      ],
      teamPerformance: [
        { label: "Équipe A", value: 0, maxValue: 15, color: "#10b981" },
        { label: "Équipe B", value: 0, maxValue: 15, color: "#3b82f6" },
        { label: "Équipe C", value: 0, maxValue: 15, color: "#f59e0b" },
      ],
    },
  },
};

// Fonction utilitaire pour déterminer le rôle
export const determineUserRole = (user: any): "user" | "manager" => {
  if (!user) {
    console.log("🔍 determineUserRole: Pas d'utilisateur");
    return "user";
  }

  const { email, firstName, role } = user;

  console.log("🔍 determineUserRole - Email:", email);
  console.log("🔍 determineUserRole - FirstName:", firstName);
  console.log("🔍 determineUserRole - Role:", role);

  // Si l'utilisateur a un rôle défini, l'utiliser en priorité
  if (role) {
    if (role === "admin" || role === "manager") {
      console.log(
        "🔍 determineUserRole - Rôle détecté:",
        role,
        "→ ManagerDashboard"
      );
      return "manager";
    } else if (role === "user") {
      console.log(
        "🔍 determineUserRole - Rôle détecté:",
        role,
        "→ UserDashboard"
      );
      return "user";
    }
  }

  // Fallback : vérifier les patterns pour manager (ancienne logique)
  const managerPatterns = DASHBOARD_CONFIG.roleRules.manager;

  const isManagerByEmail = managerPatterns.emailPatterns.some((pattern) => {
    const matches = email?.toLowerCase().includes(pattern.toLowerCase());
    console.log(`🔍 Vérification email pattern "${pattern}": ${matches}`);
    return matches;
  });

  const isManagerByName = managerPatterns.firstNamePatterns.some((pattern) => {
    const matches = firstName === pattern;
    console.log(`🔍 Vérification firstName pattern "${pattern}": ${matches}`);
    return matches;
  });

  const finalRole = isManagerByEmail || isManagerByName ? "manager" : "user";
  console.log("🔍 determineUserRole - Rôle final (fallback):", finalRole);
  console.log("🔍 determineUserRole - isManagerByEmail:", isManagerByEmail);
  console.log("🔍 determineUserRole - isManagerByName:", isManagerByName);

  return finalRole;
};

// Fonction pour obtenir les données par défaut selon le rôle
export const getDefaultData = (role: "user" | "manager") => {
  return DASHBOARD_CONFIG.defaultData[role];
};
