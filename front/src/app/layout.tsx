"use client";

import { ReactNode } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { globalStyles } from "@/styles/base/globals";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <title>Crew CRM</title>
        <meta name="description" content="Customer Relation Management" />
      </head>
      <body>
        <style jsx global>
          {globalStyles}
        </style>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
