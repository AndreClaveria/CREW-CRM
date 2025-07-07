"use client";
import React, { use } from "react";
import ClientForm from "@/components/forms/pipeline/clients/ClientForm";

interface CreateClientProps {
  params: Promise<{
    companyId: string;
  }>;
}

const CreateClient: React.FC<CreateClientProps> = ({ params }) => {
  // Déballer les paramètres avec use()
  const unwrappedParams = use(params);
  const companyId = unwrappedParams.companyId;

  return <ClientForm mode="create" companyId={companyId} />;
};

export default CreateClient;
