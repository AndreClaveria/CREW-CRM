import mongoose, { Schema } from "mongoose";
import { ITeam } from "../types";

const TeamSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    company: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    members: [{ type: String }],
    leader: { type: String },
    isActive: { type: Boolean, default: true }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default mongoose.model<ITeam>("Team", TeamSchema);
