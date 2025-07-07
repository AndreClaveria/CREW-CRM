"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useNavbar } from "@/contexts/NavBarContext";
import { dashboardStyles } from "@/styles/pages/dashboard/dashboardStyles";
import { CSSProperties } from "react";
import ProfileModal from "@/components/modals/ProfileModal/index";
import { User } from "@/services/user.service";
import { useTheme } from "@/app/dashboard/layout";
import { useNavigation } from "@/hooks/useNavigation";

interface NavBarProps {
  user: {
    _id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role: string;
    active: boolean;
    provider?: string;
    phoneNumber?: string;
    companyId?: string;
  } | null;
}

const NavBar: React.FC<NavBarProps> = ({ user: initialUser }) => {
  const { logout, user: authUser } = useAuth();
  const { hoveredIcon, setHoveredIcon } = useNavbar();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const {
    navigateTo,
    navigateToPipeline,
    navigateToPhone,
    navigateToEmail,
    navigateToCalendar,
    navigateToAdmin,
    navigateToManager,
    navigateToContact,
  } = useNavigation();

  const user = authUser || initialUser;
  const [localUserData, setLocalUserData] = useState(user);

  const handleLogout = () => {
    logout();
  };

  const openProfileModal = () => {
    setLocalUserData(authUser || user);
    setIsProfileModalOpen(true);
  };

  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
  };

  const handleUserUpdate = (updatedUser: User) => {
    setLocalUserData(updatedUser);
  };

  const sidebarStyle: CSSProperties = {
    ...dashboardStyles.sidebar,
    backgroundColor: "#1F2937",
  };

  const getDashboardNavStyle = (): CSSProperties => ({
    ...dashboardStyles.navigation,
    ...(hoveredIcon === 0
      ? dashboardStyles.navigationDashboardVisible
      : dashboardStyles.navigationDashboard),
  });

  const getPhoneNavStyle = (): CSSProperties => ({
    ...dashboardStyles.navigation,
    ...(hoveredIcon === 1
      ? dashboardStyles.navigationPhoneVisible
      : dashboardStyles.navigationPhone),
  });

  const getEmailNavStyle = (): CSSProperties => ({
    ...dashboardStyles.navigation,
    ...(hoveredIcon === 2
      ? dashboardStyles.navigationEmailVisible
      : dashboardStyles.navigationEmail),
  });

  const getCalendarNavStyle = (): CSSProperties => ({
    ...dashboardStyles.navigation,
    ...(hoveredIcon === 3
      ? dashboardStyles.navigationCalendarVisible
      : dashboardStyles.navigationCalendar),
  });

  const navItemStyle = (isActive: boolean): CSSProperties => ({
    ...dashboardStyles.navItem,
    ...(isActive ? dashboardStyles.navItemActive : {}),
  });

  const iconButtonStyle = (active: boolean): CSSProperties => ({
    ...dashboardStyles.iconButton,
    ...(active ? dashboardStyles.iconButtonActive : {}),
    color: "#FFFFFF",
  });

  const renderNavItems = () => {
    const commonNavItems = (
      <>
        <div
          style={iconButtonStyle(hoveredIcon === 0)}
          onMouseEnter={() => setHoveredIcon(0)}
          onClick={() => navigateTo("/dashboard")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={dashboardStyles.svgIcon}
          >
            <rect x="2" y="2" width="8" height="8" rx="1"></rect>
            <rect x="14" y="2" width="8" height="8" rx="1"></rect>
            <rect x="2" y="14" width="8" height="8" rx="1"></rect>
            <rect x="14" y="14" width="8" height="8" rx="1"></rect>
          </svg>
        </div>
        <div
          style={iconButtonStyle(hoveredIcon === 4)}
          onMouseEnter={() => setHoveredIcon(4)}
          onClick={() => navigateTo("/dashboard/stripe")}
          title="Paiement Stripe"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={dashboardStyles.svgIcon}
          >
            <rect width="32" height="32" rx="16" fill="#635BFF" />
            <path
              d="M23.5 17.5C23.5 19.9853 21.4853 22 19 22C16.5147 22 14.5 19.9853 14.5 17.5C14.5 15.0147 16.5147 13 19 13C21.4853 13 23.5 15.0147 23.5 17.5Z"
              fill="white"
            />
            <path
              d="M9 17.5C9 15.0147 11.0147 13 13.5 13C15.9853 13 18 15.0147 18 17.5C18 19.9853 15.9853 22 13.5 22C11.0147 22 9 19.9853 9 17.5Z"
              fill="white"
            />
          </svg>
        </div>
        <div
          style={iconButtonStyle(hoveredIcon === 5)}
          onMouseEnter={() => setHoveredIcon(5)}
          onClick={() => navigateTo("/dashboard/metrics")}
          title="Métriques des Services"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={dashboardStyles.svgIcon}
          >
            <path d="M3 3v18h18" />
            <path d="m19 9-5 5-4-4-3 3" />
          </svg>
        </div>
      </>
    );

    return <>{commonNavItems}</>;
  };

  if (!localUserData) {
    return null;
  }

  return (
    <>
      <div style={sidebarStyle}>
        <div
          style={dashboardStyles.logoContainer}
          onClick={() => navigateTo("/dashboard")}
        >
          <Image
            src="/img/logo/logo_crew.png"
            alt="Logo Crew"
            width={60}
            height={60}
            style={{
              ...dashboardStyles.logo,
              cursor: "pointer",
            }}
          />
        </div>

        {renderNavItems()}
        {/* 
        <div
          style={iconButtonStyle(hoveredIcon === 1)}
          onMouseEnter={() => setHoveredIcon(1)}
          onClick={() => navigateToPhone("recentCalls")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={dashboardStyles.svgIcon}
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
        </div> */}

        <div
          style={iconButtonStyle(hoveredIcon === 2)}
          onMouseEnter={() => setHoveredIcon(2)}
          onClick={() => navigateToEmail("inbox")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={dashboardStyles.svgIcon}
          >
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
        </div>

        {/* <div
          style={iconButtonStyle(hoveredIcon === 3)}
          onMouseEnter={() => setHoveredIcon(3)}
          onClick={() => navigateToCalendar("agenda")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={dashboardStyles.svgIcon}
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        </div> */}

        <div style={dashboardStyles.spacer}></div>

        <div
          style={iconButtonStyle(isProfileModalOpen)}
          onClick={openProfileModal}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={dashboardStyles.svgIcon}
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>

        {/* Bouton de bascule thème (soleil/lune) */}
        <div
          style={iconButtonStyle(false)}
          onClick={toggleTheme}
          title={
            isDarkMode ? "Passer au thème clair" : "Passer au thème sombre"
          }
        >
          {isDarkMode ? (
            // Icône de soleil pour le thème sombre
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={dashboardStyles.svgIcon}
            >
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          ) : (
            // Icône de lune pour le thème clair
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={dashboardStyles.svgIcon}
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          )}
        </div>

        <div style={iconButtonStyle(false)} onClick={handleLogout}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={dashboardStyles.svgIcon}
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </div>
      </div>

      <div
        style={getDashboardNavStyle()}
        onMouseLeave={() => setHoveredIcon(null)}
      >
        <div
          style={navItemStyle(false)}
          onClick={() => navigateToContact("list")}
        >
          Contacts
        </div>
        <div
          style={navItemStyle(true)}
          onClick={() => navigateToPipeline("clients")}
        >
          Clients
        </div>
        <div
          style={navItemStyle(false)}
          onClick={() => navigateToPipeline("opportunities")}
        >
          Opportunités
        </div>
        <div
          style={navItemStyle(false)}
          onClick={() => navigateToPipeline("deals")}
        >
          Deals
        </div>
      </div>

      {/* Menu Téléphone */}
      <div style={getPhoneNavStyle()} onMouseLeave={() => setHoveredIcon(null)}>
        <div
          style={navItemStyle(false)}
          onClick={() => navigateToPhone("recentCalls")}
        >
          Appels récents
        </div>
        <div
          style={navItemStyle(false)}
          onClick={() => navigateToPhone("favorites")}
        >
          Contacts favoris
        </div>
        <div
          style={navItemStyle(false)}
          onClick={() => navigateToPhone("schedule")}
        >
          Programmer un appel
        </div>
      </div>

      <div style={getEmailNavStyle()} onMouseLeave={() => setHoveredIcon(null)}>
        <div
          style={navItemStyle(false)}
          onClick={() => navigateToEmail("inbox")}
        >
          Boîte de réception
        </div>
        <div
          style={navItemStyle(false)}
          onClick={() => navigateToEmail("sent")}
        >
          Envoyés
        </div>
        <div
          style={navItemStyle(false)}
          onClick={() => navigateToEmail("drafts")}
        >
          Brouillons
        </div>
      </div>

      <div
        style={getCalendarNavStyle()}
        onMouseLeave={() => setHoveredIcon(null)}
      >
        <div
          style={navItemStyle(false)}
          onClick={() => navigateToCalendar("agenda")}
        >
          Agenda
        </div>
        <div
          style={navItemStyle(false)}
          onClick={() => navigateToCalendar("appointments")}
        >
          Rendez-vous
        </div>
        <div
          style={navItemStyle(false)}
          onClick={() => navigateToCalendar("events")}
        >
          Événements
        </div>
      </div>

      {localUserData && (
        <ProfileModal
          isOpen={isProfileModalOpen}
          onClose={closeProfileModal}
          userData={{
            _id: localUserData._id,
            firstName: localUserData.firstName || "Utilisateur",
            lastName: localUserData.lastName || "",
            email: localUserData.email,
            phone: localUserData.phoneNumber,
            role: localUserData.role,
          }}
          onUserUpdate={handleUserUpdate}
        />
      )}
    </>
  );
};

export default NavBar;
