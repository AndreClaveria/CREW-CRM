"use client";
import React, { ReactNode, useState, useEffect } from "react";
import NavBar from "@/components/common/NavBar";
import Chatbot from "@/components/chatbot/Chatbot";
import { NavbarProvider } from "@/contexts/NavBarContext";
import { useAuth } from "@/contexts/AuthContext";
import { useScrollableBody } from "@/hooks/useScrollableBody";
import { dashboardStyles as styles } from "@/styles/pages/dashboard/dashboardStyles";
import { CSSProperties } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

const ThemeContext = React.createContext({
  isDarkMode: false,
  toggleTheme: () => {},
});

export const useTheme = () => React.useContext(ThemeContext);

const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode ? "dark" : "light";
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

const DashboardContent: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const [hoveredIcon, setHoveredIcon] = useState<number | null>(null);
  const { isDarkMode } = useTheme();

  useScrollableBody();

  if (isLoading) {
    return null;
  }

  const contentStyle: CSSProperties = {
    ...styles.contentArea,
    ...(hoveredIcon !== null ? styles.contentWithMenu : {}),
    ...(isDarkMode
      ? { backgroundColor: "var(--color-white)", color: "var(--color-text)" }
      : {}),
  };

  const sidebarStyle: CSSProperties = {
    ...styles.fixedSidebar,
    backgroundColor: "#1F2937",
  };

  return (
    <div style={styles.globalContainer}>
      <div style={sidebarStyle}>
        <NavBar user={user} />
      </div>
      <main style={contentStyle}>
        {children}

        {/* Chatbot intégré */}
        <Chatbot
          position="bottom-right"
          theme={isDarkMode ? "dark" : "light"}
          className="dashboard-chatbot"
        />
      </main>
    </div>
  );
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <ThemeProvider>
      <NavbarProvider>
        <DashboardContent>{children}</DashboardContent>
      </NavbarProvider>
    </ThemeProvider>
  );
};

export default DashboardLayout;
