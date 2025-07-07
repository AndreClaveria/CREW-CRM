  import mongoose, { Schema } from "mongoose";
  import { IClient } from "../types";

  const ClientSchema: Schema = new Schema(
    {
      // ===== DONNÉES DE BASE =====
      name: { type: String, required: true },
      description: { type: String },
      sector: { type: String },
      address: {
        street: { type: String },
        city: { type: String },
        zipCode: { type: String },
        country: { type: String }
      },
      phone: { type: String },
      email: { type: String },
      logo: { type: String },
      company: { type: Schema.Types.ObjectId, ref: "Company", required: true },
      team: { type: Schema.Types.ObjectId, ref: "Team" },
      assignedTo: { type: String },
      contacts: [{ type: String }],
      opportunities: [{ type: String }],
      isActive: { type: Boolean, default: true },
      goodForCustomer: { type: Number, min: 0, max: 100, default: 50 },

      // ===== DONNÉES COMMERCIALES MINIMALES =====
      estimatedBudget: { type: Number }, // Optionnel
      companySize: {
        type: String,
        enum: ["1-10", "11-50", "51-200", "200+"],
        default: "1-10"
      },

      hasWorkedWithUs: { type: Boolean, default: false }, // Déjà client ?
      knowsUs: { type: Boolean, default: false }, // Nous connaît ?

      // ===== INTERACTIONS (limitées à 5 max) =====
      interactions: [
        {
          date: { type: Date, default: Date.now },
          type: {
            type: String,
            enum: [
              "call",
              "email",
              "meeting",
              "demo",
              "proposal",
              "follow_up",
              "other"
            ]
          },
          outcome: {
            type: String,
            enum: ["positive", "neutral", "negative", "no_response"]
          },
          notes: { type: String, maxlength: 200 } // Limite des notes
        }
      ],

      // ===== DERNIÈRE ACTIVITÉ =====
      lastContactDate: { type: Date }
    },
    {
      timestamps: true,
      versionKey: false
    }
  );

  // Index pour les performances
  ClientSchema.index({ company: 1 });
  ClientSchema.index({ assignedTo: 1 });
  ClientSchema.index({ isActive: 1 });
  ClientSchema.index({ lastContactDate: -1 });

  // 🔥 LIMITATION AUTOMATIQUE DES INTERACTIONS (garde les 5 plus récentes)
  ClientSchema.pre("save", function (this: any) {
    if (this.interactions && this.interactions.length > 5) {
      // Trie par date décroissante et garde les 5 plus récentes
      this.interactions = this.interactions
        .sort(
          (a: any, b: any) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        )
        .slice(0, 5);
    }

    // Met à jour automatiquement lastContactDate
    if (this.interactions && this.interactions.length > 0) {
      this.lastContactDate = this.interactions[0].date;
    }
  });

  export default mongoose.model<IClient>("Client", ClientSchema);
