import mongoose, { Schema } from "mongoose";
import { IContact } from "../types";

const ContactSchema: Schema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    position: { type: String },
    email: { type: String },
    phone: { type: String },
    mobile: { type: String },
    company: { type: Schema.Types.ObjectId, ref: "Company", required: true }, // Référence à l'entreprise propriétaire
    client: { type: String, required: true }, // ID du client associé - géré par le service client
    team: { type: Schema.Types.ObjectId, ref: "Team" }, // Équipe responsable
    assignedTo: { type: String }, // ID utilisateur responsable
    isPrimary: { type: Boolean, default: false },
    notes: { type: String },
    lastContactDate: { type: Date },
    opportunities: [{ type: String }], // IDs des opportunités liées
    isActive: { type: Boolean, default: true }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default mongoose.model<IContact>("Contact", ContactSchema);
