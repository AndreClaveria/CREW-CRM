// components/modals/ProfileModal/ProfileTabs.tsx
import React from "react";
import { profileModalStyles } from "@/styles/components/modals/ProfileModal/profileModalStyles";
import { TabProps } from "./types";

const ProfileTabs: React.FC<TabProps> = ({
  activeTab,
  setActiveTab,
  tabStyle,
}) => {
  const handleTabClick = (tab: "info" | "password" | "edit") => {
    setActiveTab(tab);
  };

  return (
    <div style={profileModalStyles.sidebar}>
      <button style={tabStyle("info")} onClick={() => handleTabClick("info")}>
        <div style={profileModalStyles.tabIconContainer}>
          <span>ℹ️</span>
        </div>
        <h2 style={profileModalStyles.h3}>Informations personnelles</h2>
      </button>

      <button style={tabStyle("edit")} onClick={() => handleTabClick("edit")}>
        <div style={profileModalStyles.tabIconContainer}>
          <span>✏️</span>
        </div>
        <h2 style={profileModalStyles.h3}>Modifier mes informations</h2>
      </button>

      <button
        style={tabStyle("password")}
        onClick={() => handleTabClick("password")}
      >
        <div style={profileModalStyles.tabIconContainer}>
          <span>🔒</span>
        </div>
        <h2 style={profileModalStyles.h3}>Mot de passe</h2>
      </button>
    </div>
  );
};

export default ProfileTabs;
