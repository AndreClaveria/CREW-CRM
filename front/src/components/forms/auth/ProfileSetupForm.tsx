// components/forms/auth/ProfileSetupForm.tsx
"use client";
import { useProfileSetup } from "@/hooks/useProfileSetup";
import { gettingStartedStyles as styles } from "@/styles/pages/getttingStartedStyles";
import TextInput from "@/components/forms/common/TextInput";
import PasswordInput from "@/components/forms/common/PasswordInput";
import Captcha from "@/components/forms/common/Captcha";

const ProfileSetupForm = () => {
  const {
    formData,
    loading,
    error,
    passwordRequired,
    captchaVerified,
    setCaptchaVerified,
    handleChange,
    handleSubmit,
  } = useProfileSetup();

  return (
    <>
      {error && <div style={styles.errorContainer}>{error}</div>}

      <form style={styles.form} onSubmit={handleSubmit}>
        <TextInput
          id="firstName"
          name="firstName"
          label="Prénom"
          placeholder="Votre prénom"
          value={formData.firstName}
          onChange={handleChange}
          required
          styles={styles}
        />

        <TextInput
          id="lastName"
          name="lastName"
          label="Nom"
          placeholder="Votre nom"
          value={formData.lastName}
          onChange={handleChange}
          required
          styles={styles}
        />

        {passwordRequired && (
          <PasswordInput
            id="currentPassword"
            name="currentPassword"
            label="Mot de passe actuel"
            placeholder="Entrez votre mot de passe actuel pour confirmer"
            value={formData.currentPassword}
            onChange={handleChange}
            required={true}
            styles={styles}
          />
        )}

        <Captcha
          onVerify={() => setCaptchaVerified(true)}
          verified={captchaVerified}
          styles={styles}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            ...styles.submitButton,
            ...(loading ? styles.submitButtonDisabled : {}),
          }}
        >
          {loading && (
            <span style={styles.spinner}>
              <svg
                className="animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </span>
          )}
          {loading ? "Chargement..." : "Continuer vers le Dashboard"}
        </button>
      </form>
    </>
  );
};

export default ProfileSetupForm;