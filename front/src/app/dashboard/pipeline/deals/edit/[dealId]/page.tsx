"use client";
import React, { use } from "react";
import DealForm from "@/components/forms/pipeline/deal/DealForm";

interface EditDealPageProps {
  params: Promise<{
    dealId: string;
  }>;
}

export default function EditDealPage({ params }: EditDealPageProps) {
  const { dealId } = use(params);
  return <DealForm mode="edit" dealId={dealId} />;
}
