"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Table, { TableColumn } from "@/components/common/Table";
import StatusBadge from "@/components/common/StatusBadge";
import ActionButton from "@/components/common/ActionButton";
import ToggleCompanyStatus from "@/components/company/ToggleCompanyStatus";
import { Company } from "@/services/company.service";
import { tableStyleProps } from "@/styles/components/tableStyles";
import { useAuth } from "@/contexts/AuthContext";

interface CompanyTableProps {
  companies: Company[];
  isLoading: boolean;
  onStatusChange: (companyId: string, newStatus: boolean) => void;
}

const CompanyTable: React.FC<CompanyTableProps> = ({
  companies,
  isLoading,
  onStatusChange,
}) => {
  const router = useRouter();
  const { user } = useAuth(); // Récupération de l'utilisateur connecté

  // Formatage de la date de création
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Non disponible";
    const date = new Date(dateString);
    return date.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const columns: TableColumn<Company>[] = [
    {
      header: "Nom",
      accessor: "name",
      align: "left",
    },
    {
      header: "Email",
      accessor: (company) => company.email || "Non renseigné",
      align: "left",
    },
    {
      header: "Téléphone",
      accessor: (company) => company.phone || "Non renseigné",
      align: "left",
    },
    {
      header: "Ville",
      accessor: (company) => company.address?.city || "Non renseigné",
      align: "left",
    },
    {
      header: "Secteur",
      accessor: (company) => company.industry || "Non renseigné",
      align: "left",
    },
    {
      header: "Statut",
      accessor: (company) => <StatusBadge isActive={company.isActive} />,
      align: "center",
    },
    {
      header: "Date de création",
      accessor: (company) => formatDate(company.createdAt),
      align: "left",
    },
    {
      header: "Actions",
      accessor: (company) => {
        return (
          <div
            style={{ display: "flex", justifyContent: "center", gap: "10px" }}
          >
            <ActionButton
              onClick={() =>
                router.push(`/dashboard/companies/edit/${company._id}`)
              }
              variant="secondary"
              size="medium"
            >
              Éditer
            </ActionButton>
            <ActionButton
              onClick={() =>
                router.push(`/dashboard/companies/teams/${company._id}`)
              }
              size="medium"
            >
              Équipes
            </ActionButton>
            <ActionButton
              onClick={() =>
                router.push(`/dashboard/companies/clients/${company._id}`)
              }
              size="medium"
            >
              Clients
            </ActionButton>
            <ToggleCompanyStatus
              companyId={company._id}
              isActive={company.isActive}
              onStatusChange={(newStatus) =>
                onStatusChange(company._id, newStatus)
              }
            />
          </div>
        );
      },
      align: "center",
      isAction: true,
    },
  ];

  // Utiliser les styles configurés
  const customTableStyles = {
    ...tableStyleProps,
    variant: "striped" as const,
    headerStyle: "light" as const,
    rounded: true,
    maxWidth: "1200px",
  };

  return (
    <Table
      data={companies}
      columns={columns}
      keyField="_id"
      isLoading={isLoading}
      emptyMessage="Aucune entreprise trouvée"
      styleProps={customTableStyles}
    />
  );
};

export default CompanyTable;
