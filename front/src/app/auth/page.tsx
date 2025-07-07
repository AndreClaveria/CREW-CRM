import Image from "next/image";
import { authStyles } from "@/styles/pages/auth/authStyles";
import Logo_Crew from "@public/img/logo/logo_crew.png";
import Background_Image from "@public/img/login/one_piece.jpg";
import LoginForm from "@/components/forms/auth/LoginForm";

const Login: React.FC = () => {
  return (
    <main className="main">
      <div style={authStyles.container}>
        <div style={authStyles.imageWrapper}>
          <Image
            src={Background_Image}
            alt="One Piece Background"
            fill
            priority
            quality={100}
            style={authStyles.image}
          />
          <div style={authStyles.logoWrapper}>
            <Image
              src={Logo_Crew}
              alt="Logo Crew"
              width={80}
              height={80}
              style={authStyles.logo}
            />
          </div>
          <div style={authStyles.textWrapper}>
            <h1 style={authStyles.title}>Crew</h1>
            <p style={authStyles.subtitle}>Customer Relationship Management</p>
          </div>
        </div>

        <div style={authStyles.formContainer}>
          <div style={authStyles.wrapper}>
            <h2 style={authStyles.title}>LOGIN</h2>
            <p
              style={{ color: "rgba(255, 255, 255, 0.6)", textAlign: "center" }}
            >
              Welcome on Board please connect to use the CRM
            </p>
            <LoginForm />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
