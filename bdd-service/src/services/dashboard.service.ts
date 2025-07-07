// services/dashboard.service.ts
import { getTeamsByMember } from "./team.service";
import { getCompanyById, getCompaniesByOwner } from "./company.service";
import { ITeam, ICompany, IUser } from "../types";
import { logger } from "../utils/logger";
import { getUserById } from "../utils/auth/user.service";

interface UserDashboardData {
  user: IUser;
  teams: ITeam[];
  company: ICompany | null;
}

export const getUserDashboardData = async (
  userId: string,
  token: string
): Promise<UserDashboardData | null> => {
  try {
    // 1. Récupérer l'utilisateur via le client d'authentification
    const user = await getUserById(userId, token);
    if (!user) {
      return null;
    }

    // 2. Trouver toutes les équipes dont l'utilisateur est membre
    const teams = await getTeamsByMember(userId);

    // Initialiser company à null
    let company = null;

    // Vérifier si l'utilisateur est un manager ou un admin
    if (user.role === "manager" || user.role === "admin") {
      // Pour les managers et admins, rechercher directement l'entreprise qu'ils gèrent
      const companies = await getCompaniesByOwner(userId);

      // Prendre la première entreprise si elle existe
      if (companies && companies.length > 0) {
        company = companies[0];
      }
    }

    // Si l'entreprise n'est pas trouvée mais que l'utilisateur a des équipes
    // (cas d'un utilisateur normal qui est membre d'équipes)
    if (!company && teams.length > 0) {
      // Prendre la première équipe
      const companyId = teams[0].company.toString();
      company = await getCompanyById(companyId);
    }

    return { user, teams, company };
  } catch (error) {
    logger.error(`Error fetching dashboard data for user ${userId}`, error);
    throw error;
  }
};
