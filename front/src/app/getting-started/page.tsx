// components/pages/auth/GettingStarted.tsx
"use client";
import Image from "next/image";
import { gettingStartedStyles as styles } from "@/styles/pages/getttingStartedStyles";
import ProfileSetupForm from "@/components/forms/auth/ProfileSetupForm";

const GettingStartedPage = () => {
  return (
    <div style={styles.container}>
      <div style={styles.formWrapper}>
        <div style={styles.logoContainer}>
          <Image
            src="/img/logo/logo_crew.png"
            alt="Logo Crew"
            width={100}
            height={100}
            style={styles.logo}
          />
        </div>

        <h2 style={styles.title}>Bienvenue chez CREW CRM</h2>
        <p style={styles.subtitle}>
          Veuillez compléter votre profil pour continuer
        </p>

        <ProfileSetupForm />
      </div>
    </div>
  );
};

export default GettingStartedPage;
