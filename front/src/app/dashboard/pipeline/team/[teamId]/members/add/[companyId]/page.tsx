"use client";
import React, { use } from "react";

import TeamForm from "@/components/forms/team/TeamForm";

interface CreateClientProps {
  params: Promise<{
    teamId: string;
    companyId: string;
  }>;
}

const AddMembers: React.FC<CreateClientProps> = ({ params }) => {
  // Déballer les paramètres avec use()
  const unwrappedParams = use(params);
  const teamId = unwrappedParams.teamId;
  const companyId = unwrappedParams.companyId;

  return <TeamForm mode="create" companyId={companyId} teamId={teamId} />;
};

export default AddMembers;
