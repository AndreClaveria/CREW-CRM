import mongoose, { Schema } from "mongoose";
import { IDeal } from "../types";

const DealSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    value: { type: Number, required: true },
    status: {
      type: String,
      enum: [
        "prospection",
        "qualification",
        "proposition",
        "negociation",
        "signature",
        "perdu",
        "gagne"
      ],
      default: "prospection"
    },
    probability: { type: Number, min: 0, max: 100, default: 20 },
    expectedClosingDate: { type: Date },
    company: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    client: { type: String, required: true },
    contacts: [{ type: String }],
    team: { type: Schema.Types.ObjectId, ref: "Team" },
    assignedTo: { type: String },
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

export default mongoose.model<IDeal>("Deal", DealSchema);
