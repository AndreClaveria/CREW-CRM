// components/forms/auth/LoginForm.tsx
"use client";
import { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { authStyles } from "@/styles/pages/auth/authStyles";
import IconInput from "@/components/forms/common/IconInput";
import Logo_User from "@public/img/login/email.svg";
import Logo_Password from "@public/img/login/password_img.svg";
import Logo_Google from "@public/img/login/google_img.svg";

const LoginForm: React.FC = () => {
  const { login: authLogin, isLoading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await authLogin(email, password);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };
  return (
    <>
      {error && <div style={authStyles.error}>{error}</div>}

      <form style={authStyles.form} onSubmit={handleSubmit}>
        <IconInput
          type="email"
          placeholder="Email"
          icon={Logo_User}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <IconInput
          type="password"
          placeholder="Password"
          icon={Logo_Password}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          style={{
            ...authStyles.primaryButton,
            opacity: loading || authLoading ? 0.7 : 1,
            cursor: loading || authLoading ? "not-allowed" : "pointer",
          }}
          disabled={loading || authLoading}
        >
          {loading || authLoading ? "LOADING..." : "START"}
        </button>
      </form>

      <div style={authStyles.loginOther}>Login with others</div>

      <button
        type="button"
        style={authStyles.googleButton}
        onClick={handleGoogleLogin}
        disabled={loading || authLoading}
      >
        <Image src={Logo_Google} alt="Google Icon" width={20} height={20} />
        Login with Google
      </button>
    </>
  );
};

export default LoginForm;
