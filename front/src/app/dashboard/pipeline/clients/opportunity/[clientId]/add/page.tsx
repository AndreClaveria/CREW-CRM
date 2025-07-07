// /app/dashboard/[role]/manage/company/clients/[companyId]/opportunities/[clientId]/add/page.tsx
"use client";
import React, { use } from "react";
import OpportunityForm from "@/components/forms/pipeline/opportunity/OpportunityForm";

interface CreateOpportunityProps {
  params: Promise<{
    role: string;
    clientId: string;
  }>;
}

const CreateOpportunity: React.FC<CreateOpportunityProps> = ({ params }) => {
  const unwrappedParams = use(params);

  const clientId = unwrappedParams.clientId;
  // const role = unwrappedParams.role;

  return <OpportunityForm mode="create" clientId={clientId} />;
};

export default CreateOpportunity;
