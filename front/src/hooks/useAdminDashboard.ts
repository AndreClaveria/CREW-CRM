// src/hooks/useAdminDashboard.ts
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAllUsers, User } from "@/services/user.service";
import { getAllCompanies, Company } from "@/services/company.service";

interface UseAdminDashboardReturn {
  users: User[];
  companies: Company[];
  isLoadingData: boolean;
  error: string | null;
  navigateToUserDetails: (userId: string) => void;
  navigateToCompanyDetails: (companyId: string) => void;
  navigateToUserManagement: () => void;
  navigateToCompanyManagement: () => void;
  navigateToSystemHealth: () => void;
}

export const useAdminDashboard = (): UseAdminDashboardReturn => {
  const [users, setUsers] = useState<User[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingData(true);
        // Récupérer les utilisateurs et les entreprises en parallèle
        const [usersData, companiesData] = await Promise.all([
          getAllUsers(),
          getAllCompanies(),
        ]);

        setUsers(usersData);
        setCompanies(companiesData);
        setError(null);
      } catch (err) {
        console.error("Error loading admin dashboard data:", err);
        setError(
          "Impossible de charger les données du tableau de bord administrateur"
        );
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, []);

  // Fonctions de navigation
  const navigateToUserDetails = (userId: string) => {
    router.push(`/dashboard/admin/manage/users/${userId}`);
  };

  const navigateToCompanyDetails = (companyId: string) => {
    router.push(`/dashboard/admin/manage/company/${companyId}`);
  };

  const navigateToUserManagement = () => {
    router.push("/dashboard/admin/manage/users");
  };

  const navigateToCompanyManagement = () => {
    router.push("/dashboard/admin/manage/company");
  };

  const navigateToSystemHealth = () => {
    router.push("/dashboard/admin/health");
  };

  return {
    users,
    companies,
    isLoadingData,
    error,
    navigateToUserDetails,
    navigateToCompanyDetails,
    navigateToUserManagement,
    navigateToCompanyManagement,
    navigateToSystemHealth,
  };
};
