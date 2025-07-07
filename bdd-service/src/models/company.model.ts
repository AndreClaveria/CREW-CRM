import mongoose, { Schema } from "mongoose";
import { ICompany } from "../types";

const CompanySchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    address: {
      street: { type: String },
      city: { type: String },
      zipCode: { type: String },
      country: { type: String }
    },
    phone: { type: String },
    email: { type: String },
    website: { type: String },
    industry: { type: String },
    logo: { type: String },
    owner: { type: String, required: true },
    teams: [{ type: Schema.Types.ObjectId, ref: "Team" }], // Garde la référence aux Teams car c'est dans le même service
    isActive: { type: Boolean, default: true }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default mongoose.model<ICompany>("Company", CompanySchema);
