// /app/dashboard/admin/manage/company/clients/[companyId]/edit/[clientId]/page.tsx
"use client";
import React, { use } from "react";
import ClientForm from "@/components/forms/pipeline/clients/ClientForm";

interface EditClientProps {
  params: Promise<{
    companyId: string;
    clientId: string;
  }>;
}

const EditClient: React.FC<EditClientProps> = ({ params }) => {
  // Déballer les paramètres avec use()
  const unwrappedParams = use(params);
  const companyId = unwrappedParams.companyId;
  const clientId = unwrappedParams.clientId;

  return <ClientForm mode="edit" companyId={companyId} clientId={clientId} />;
};

export default EditClient;
