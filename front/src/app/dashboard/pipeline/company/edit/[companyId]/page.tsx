// /app/dashboard/admin/manage/company/clients/[companyId]/edit/[clientId]/page.tsx
"use client";
import React, { use } from "react";
import CompanyForm from "@/components/forms/company/CompanyForm";

interface EditCompanyProps {
  params: Promise<{
    companyId: string;
  }>;
}

const EditCompany: React.FC<EditCompanyProps> = ({ params }) => {
  // Déballer les paramètres avec use()
  const unwrappedParams = use(params);
  const companyId = unwrappedParams.companyId;

  return <CompanyForm mode="edit" companyId={companyId} />;
};

export default EditCompany;
