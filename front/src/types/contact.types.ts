export interface Contact {
  _id: string;
  firstName: string;
  lastName: string;
  position?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  company: string;
  client: string;
  team?: string;
  assignedTo?: string;
  isPrimary?: boolean;
  notes?: string;
  lastContactDate?: Date;
  opportunities?: string[];
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
