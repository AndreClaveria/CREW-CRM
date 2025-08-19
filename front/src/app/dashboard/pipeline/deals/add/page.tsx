"use client";
import React from "react";
import { useUserDashboard } from "@/hooks/useUserDashboard";
import DealForm from "@/components/forms/pipeline/deal/DealForm";

export default function AddDealPage() {
  const { dashboardData, loading } = useUserDashboard();
  if (loading)
    return (
      <div
        style={{
          padding: "20px",
          textAlign: "center",
          fontSize: "var(--font-size-normal)",
          fontFamily: "var(--font-second-regular)",
          color: "var(--color-text)",
        }}
      >
        Chargement…
      </div>
    );
  const companyId = dashboardData?.company?._id;
  return <DealForm mode="create" companyId={companyId} />;
}
