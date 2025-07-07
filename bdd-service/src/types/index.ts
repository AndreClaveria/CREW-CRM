// Interface pour le modèle Client
// Interface pour le modèle Client
export interface IClient {
  _id: string; // Non optionnel pour une entité existante
  name: string;
  description?: string;
  sector?: string;
  address?: {
    street?: string;
    city?: string;
    zipCode?: string;
    country?: string;
  };
  phone?: string;
  email?: string;
  logo?: string;
  company: string; // ID de l'entreprise propriétaire
  team?: string; // ID de l'équipe responsable (optionnel)
  assignedTo?: string; // ID utilisateur responsable (optionnel)
  goodForCustomer?: number; // Indicateur "bonne poire" (0-100)
  contacts?: string[]; // IDs des contacts - gérés par le service contact
  opportunities?: string[]; // IDs des opportunités - gérées par le service opportunité
  isActive?: boolean;

  // 🔥 NOUVEAUX CHAMPS IA
  // Données commerciales
  estimatedBudget?: number; // Budget estimé en €
  companySize?: "1-10" | "11-50" | "51-200" | "200+"; // Taille entreprise

  // Pipeline de vente
  stage?:
        | "prospect"
        | "contacted"
        | "interested"
        | "proposal"
        | "negotiation"
        | "closed_won"
        | "closed_lost";
      lastContactDate?: Date; // Dernier contact avec le client
      urgency?: "low" | "medium" | "high"; // Urgence du besoin

  // Résultats IA (calculés automatiquement)
  aiScore?: number; // Score IA de 0 à 100
  aiRecommendation?: string; // Recommandation d'action
  aiLastAnalysis?: Date; // Date de la dernière analyse IA

  // Timestamps
  createdAt?: Date;
  updatedAt?: Date;

  // Méthode pour récupérer les données IA
  getAIData?(): {
    name: string;
    sector?: string;
    description?: string;
    estimatedBudget?: number;
    companySize?: string;
    stage?: string;
    urgency?: string;
    daysSinceLastContact: number;
    currentScore?: number;
  };
}
// Type pour la création d'un nouveau Client (sans _id)
export type IClientInput = Omit<IClient, "_id"> & { _id?: string };

// Interface pour le modèle Contact
export interface IContact {
  _id: string; // Non optionnel pour une entité existante
  firstName: string;
  lastName: string;
  position?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  company: string; // ID de l'entreprise propriétaire
  client: string; // ID du client associé
  team?: string; // ID de l'équipe responsable (optionnel)
  assignedTo?: string; // ID utilisateur responsable (optionnel)
  isPrimary?: boolean; // Contact principal
  notes?: string;
  lastContactDate?: Date;
  opportunities?: string[]; // IDs des opportunités liées
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Type pour la création d'un nouveau Contact (sans _id)
export type IContactInput = Omit<IContact, "_id"> & { _id?: string };

// Interface pour le modèle Opportunity (Opportunité)
export interface IOpportunity {
  _id: string; // Non optionnel pour une entité existante
  title: string;
  description?: string;
  value: number;
  status: "lead" | "qualified" | "proposition" | "negotiation" | "won" | "lost";
  probability: number; // 0-100
  expectedClosingDate?: Date;
  company: string; // ID de l'entreprise propriétaire
  client: string; // ID du client
  contacts?: string[]; // IDs des contacts impliqués
  team?: string; // ID de l'équipe responsable (optionnel)
  assignedTo?: string; // ID utilisateur responsable (optionnel)
  notes?: string;
  products?: {
    name: string;
    price: number;
    quantity: number;
  }[];
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Type pour la création d'une nouvelle Opportunity (sans _id)
export type IOpportunityInput = Omit<IOpportunity, "_id"> & { _id?: string };

// Interface pour le modèle Company (existant)
export interface ICompany {
  _id: string; // Non optionnel pour une entité existante
  name: string;
  description?: string;
  address?: {
    street?: string;
    city?: string;
    zipCode?: string;
    country?: string;
  };
  phone?: string;
  email?: string;
  website?: string;
  industry?: string;
  logo?: string;
  owner: string; // ID du propriétaire (manager)
  teams?: string[]; // IDs des équipes
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Type pour la création d'une nouvelle Company (sans _id)
export type ICompanyInput = Omit<ICompany, "_id"> & { _id?: string };

// Interface pour le modèle Team (existant)
export interface ITeam {
  _id: string; // Non optionnel pour une entité existante
  name: string;
  description?: string;
  company: string; // ID de l'entreprise
  members: string[]; // IDs des membres
  leader?: string; // ID du chef d'équipe
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Type pour la création d'une nouvelle Team (sans _id)
export type ITeamInput = Omit<ITeam, "_id"> & { _id?: string };

// Interface pour l'utilisateur (pour référence)
export interface IUser {
  _id: string; // Non optionnel pour une entité existante
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "manager" | "user";
  companyId?: string; // ID de l'entreprise
  teams?: string[]; // IDs des équipes
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Type pour la création d'un nouvel User (sans _id)
export type IUserInput = Omit<IUser, "_id"> & { _id?: string };

// Types pour les réponses API
export interface IApiResponse<T> {
  success: boolean;
  data?: T;
  count?: number;
  message?: string;
  error?: string;
}
