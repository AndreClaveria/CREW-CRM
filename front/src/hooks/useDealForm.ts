import { useEffect, useMemo, useState } from "react";
import {
  Deal,
  DealStatus,
  createDeal,
  updateDeal,
  getDealById,
} from "@/services/deal.service";

export interface DealFormData {
  title: string;
  description?: string;
  value: number;
  status: DealStatus;
  probability: number;
  expectedClosingDate?: string;
  company?: string;
  client?: string;
  notes?: string;
  isActive: boolean;
}

interface UseDealFormProps {
  mode: "create" | "edit";
  companyId?: string;
  clientId?: string;
  dealId?: string;
}

interface UseDealFormReturn {
  formData: DealFormData;
  setFormData: React.Dispatch<React.SetStateAction<DealFormData>>;
  dataLoading: boolean;
  error: string | null;
  success: string | null;
  currentStep: number;
  totalSteps: number;
  steps: { number: number; label: string }[];
  progressPercentage: number;
  handleChange: (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  nextStep: () => void;
  prevStep: () => void;
  handleSubmit: () => Promise<void>;
}

export const useDealForm = ({
  mode,
  companyId,
  clientId,
  dealId,
}: UseDealFormProps): UseDealFormReturn => {
  const [formData, setFormData] = useState<DealFormData>({
    title: "",
    description: "",
    value: 0,
    status: "prospection",
    probability: 20,
    expectedClosingDate: "",
    company: companyId,
    client: clientId,
    isActive: true,
    notes: "",
  });

  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  const steps = useMemo(
    () => [
      { number: 1, label: "Informations" },
      { number: 2, label: "Valorisation" },
      { number: 3, label: "Notes" },
      { number: 4, label: "Récapitulatif" },
    ],
    []
  );
  const totalSteps = steps.length;

  const progressPercentage = useMemo(
    () => Math.round(((currentStep - 1) / (totalSteps - 1)) * 100),
    [currentStep, totalSteps]
  );

  useEffect(() => {
    const loadDeal = async () => {
      if (mode !== "edit" || !dealId) return;
      try {
        setDataLoading(true);
        const d = await getDealById(dealId);
        setFormData({
          title: d.title,
          description: d.description,
          value: d.value,
          status: d.status,
          probability: d.probability ?? 20,
          expectedClosingDate: d.expectedClosingDate,
          company: d.company,
          client: d.client,
          notes: d.notes,
          isActive: d.isActive,
        });
      } catch (e: any) {
        setError(e.message || "Impossible de charger le deal");
      } finally {
        setDataLoading(false);
      }
    };
    loadDeal();
  }, [mode, dealId]);

  const handleChange: UseDealFormReturn["handleChange"] = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "value" || name === "probability" ? Number(value) : value,
    }));
  };

  const nextStep = () => setCurrentStep((s) => Math.min(totalSteps, s + 1));
  const prevStep = () => setCurrentStep((s) => Math.max(1, s - 1));

  const handleSubmit = async () => {
    try {
      setError(null);
      setDataLoading(true);
      if (mode === "create") {
        await createDeal({
          title: formData.title,
          description: formData.description,
          value: formData.value,
          status: formData.status,
          probability: formData.probability,
          expectedClosingDate: formData.expectedClosingDate,
          company: formData.company!,
          client: formData.client!,
          notes: formData.notes,
          isActive: formData.isActive,
        });
        setSuccess("Deal créé avec succès");
      } else if (mode === "edit" && dealId) {
        await updateDeal(dealId, formData as Partial<Deal>);
        setSuccess("Deal mis à jour avec succès");
      }
    } catch (e: any) {
      setError(e.message || "Erreur lors de l'enregistrement du deal");
    } finally {
      setDataLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    dataLoading,
    error,
    success,
    currentStep,
    totalSteps,
    steps,
    progressPercentage,
    handleChange,
    nextStep,
    prevStep,
    handleSubmit,
  };
};
