// services/deal.service.ts

const API_URL =
  process.env.NEXT_PUBLIC_API_URL_CLIENT ||
  process.env.NEXT_PUBLIC_API_URL_BDD ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:3001/api/";

export type DealStatus =
  | "prospection"
  | "qualification"
  | "proposition"
  | "negociation"
  | "signature"
  | "perdu"
  | "gagne";

export interface Deal {
  _id: string;
  title: string;
  description?: string;
  value: number;
  status: DealStatus;
  probability?: number;
  expectedClosingDate?: string;
  company: string;
  client: string;
  contacts?: string[];
  team?: string;
  assignedTo?: string;
  notes?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const headers = {
  "Content-Type": "application/json",
};

function ensureJsonResponse(response: Response): Promise<any> {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return response.text().then((txt) => {
      throw new Error(
        `Réponse non-JSON de l'API (${response.status}): ${txt.substring(
          0,
          200
        )}`
      );
    });
  }
  return response.json();
}

export const getDealsByCompany = async (companyId: string): Promise<Deal[]> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Non authentifié");

  const response = await fetch(`${API_URL}deals/company/${companyId}`, {
    method: "GET",
    headers: { ...headers, Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(errBody || "Erreur lors du chargement des deals");
  }

  const data = await ensureJsonResponse(response);
  if (data && typeof data === "object" && Array.isArray(data.data))
    return data.data;
  return Array.isArray(data) ? data : [];
};

export const createDeal = async (dealData: Partial<Deal>): Promise<Deal> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Non authentifié");

  const response = await fetch(`${API_URL}deals`, {
    method: "POST",
    headers: { ...headers, Authorization: `Bearer ${token}` },
    body: JSON.stringify(dealData),
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(errBody || "Erreur lors de la création du deal");
  }

  return await ensureJsonResponse(response);
};

export const updateDeal = async (
  id: string,
  dealData: Partial<Deal>
): Promise<Deal> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Non authentifié");

  const response = await fetch(`${API_URL}deals/${id}`, {
    method: "PUT",
    headers: { ...headers, Authorization: `Bearer ${token}` },
    body: JSON.stringify(dealData),
  });
  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(errBody || "Erreur lors de la mise à jour du deal");
  }
  return await ensureJsonResponse(response);
};

export const deleteDeal = async (id: string): Promise<void> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Non authentifié");

  const response = await fetch(`${API_URL}deals/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(errBody || "Erreur lors de la suppression du deal");
  }
};
