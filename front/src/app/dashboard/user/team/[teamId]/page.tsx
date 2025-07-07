"use client";

import TeamDetails from "@/components/teams/TeamDetails";

// Définir l'interface pour les paramètres
interface TeamPageParams {
  params: {
    teamId: string;
  };
}

// Pour Next.js Pages Router
export default function TeamDetailsPage({ params }: TeamPageParams) {
  return <TeamDetails params={Promise.resolve(params)} />;
}
