import mongoose, { Schema } from "mongoose";
import { IOpportunity } from "../types";

const OpportunitySchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    value: { type: Number, required: true },
    status: {
      type: String,
      enum: ["lead", "qualified", "proposition", "negotiation", "won", "lost"],
      default: "lead"
    },
    probability: { type: Number, min: 0, max: 100, default: 20 },
    expectedClosingDate: { type: Date },
    company: { type: Schema.Types.ObjectId, ref: "Company", required: true }, // Référence à l'entreprise propriétaire
    client: { type: String, required: true }, // ID du client - géré par le service client
    contacts: [{ type: String }], // IDs des contacts - gérés par le service contact
    team: { type: Schema.Types.ObjectId, ref: "Team" }, // Équipe responsable
    assignedTo: { type: String }, // ID utilisateur responsable
    notes: { type: String },
    products: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true }
      }
    ],
    isActive: { type: Boolean, default: true }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default mongoose.model<IOpportunity>("Opportunity", OpportunitySchema);
