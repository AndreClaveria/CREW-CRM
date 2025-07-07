// /components/teams/TeamTable.tsx
import React from "react";
import { useRouter } from "next/navigation";
import Table, { TableColumn } from "@/components/common/Table";
import StatusBadge from "@/components/common/StatusBadge";
import ActionButton from "@/components/common/ActionButton";
import ToggleTeamStatus from "@/components/teams/ToggleTeamStatus";
import { Team } from "@/services/team.service";
import { tableStyleProps } from "@/styles/components/tableStyles";
import { useTeamTable } from "@/hooks/useTeamTable";

interface TeamTableProps {
  teams: Team[];
  companyId: string;
  isLoading: boolean;
  onStatusChange: (teamId: string, newStatus: boolean) => void;
}

const TeamTable: React.FC<TeamTableProps> = ({
  teams,
  companyId,
  isLoading,
  onStatusChange,
}) => {
  const router = useRouter();

  // Utilisation du hook personnalisé
  const { loadingLeaders, getLeaderName, formatDate } = useTeamTable({ teams });

  const columns: TableColumn<Team>[] = [
    {
      header: "Nom",
      accessor: "name",
      align: "left",
    },
    {
      header: "Description",
      accessor: (team) => team.description || "Non renseignée",
      align: "left",
    },
    {
      header: "Nombre de membres",
      accessor: (team) => team.members?.length || 0,
      align: "center",
    },
    {
      header: "Leader",
      accessor: getLeaderName,
      align: "left",
    },
    {
      header: "Statut",
      accessor: (team) => <StatusBadge isActive={team.isActive} />,
      align: "center",
    },
    {
      header: "Date de création",
      accessor: (team) => formatDate(team.createdAt),
      align: "left",
    },
    {
      header: "Actions",
      accessor: (team) => {
        return (
          <div
            style={{ display: "flex", justifyContent: "center", gap: "10px" }}
          >
            <ActionButton
              onClick={() => router.push(`/dashboard/teams/edit/${team._id}`)}
              variant="secondary"
              size="medium"
            >
              Éditer
            </ActionButton>
            <ActionButton
              onClick={() =>
                router.push(`/dashboard/teams/members/${team._id}`)
              }
              size="medium"
            >
              Membres
            </ActionButton>

            <ToggleTeamStatus
              teamId={team._id}
              isActive={team.isActive}
              onStatusChange={(newStatus) =>
                onStatusChange(team._id, newStatus)
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
      data={teams}
      columns={columns}
      keyField="_id"
      isLoading={isLoading || loadingLeaders}
      emptyMessage="Aucune équipe trouvée pour cette entreprise"
      styleProps={customTableStyles}
    />
  );
};

export default TeamTable;
