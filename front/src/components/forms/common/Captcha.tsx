// components/forms/common/Captcha.tsx
import React from "react";

interface CaptchaProps {
  onVerify: () => void;
  verified: boolean;
  styles: any;
}

const Captcha: React.FC<CaptchaProps> = ({ onVerify, verified, styles }) => {
  return (
    <div style={styles.captchaContainer}>
      <div style={styles.captchaHeader}>
        <label style={styles.captchaTitle}>Vérification CAPTCHA</label>
        <button
          type="button"
          onClick={onVerify}
          style={{
            ...styles.captchaButton,
            backgroundColor: verified
              ? "#4CAF50"
              : styles.captchaButton.backgroundColor,
          }}
        >
          {verified ? "Vérifié" : "Valider"}
        </button>
      </div>
      <div style={styles.captchaPlaceholder}>[Emplacement pour CAPTCHA]</div>
      <p style={styles.captchaInfo}>
        Cliquez sur Valider pour simuler la vérification du CAPTCHA
      </p>
    </div>
  );
};

export default Captcha;
