import React, { useState } from "react";
import { DynoChatLayout } from "~/plugins/MasterLayoutPlugin";
import { componentRegistry } from "./ComponentRegistry";

// Add CSS for pulse animation
const pulseAnimation = `
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

const Dashboard: React.FC = () => {
  // Layout state - managed by DynoChatLayout internally
  const [layoutInfo, setLayoutInfo] = useState<{
    layout: any[];
    components: any[];
  }>({ layout: [], components: [] });

  const handleLayoutChange = (layoutDetails: {
    layout: any[];
    components: any[];
  }) => {
    setLayoutInfo(layoutDetails);
  };

  const handleAddNewComponent = (componentDetails: {
    id: string;
    type: string;
    title: string;
  }) => {
    // Handle new component added
  };

  const handleComponentUpdate = (updateDetails: {
    id: string;
    type: string;
    title: string;
    updates: any;
  }) => {
    // Handle component update
  };

  const styles = {
    dashboardContainer: {
      display: "flex",
      flexDirection: "column" as const,
      height: "100vh",
    },
    appBar: {
      backgroundColor: "#f0f0f0",
      color: "#333",
      padding: "10px",
      textAlign: "center" as const,
      borderBottom: "1px solid #ccc",
    },
    dashboardContent: {
      display: "flex",
      flex: 1,
    },
    sideNav: {
      width: "200px",
      backgroundColor: "#f8f8f8",
      padding: "10px",
      boxSizing: "border-box" as const,
      borderRight: "1px solid #ccc",
    },
    mainContent: {
      flex: 1,
      overflowY: "auto" as const,
      padding: "10px",
      boxSizing: "border-box" as const,
      position: "relative" as const,
    },
    navList: {
      listStyleType: "none" as const,
      padding: 0,
    },
    navItem: {
      marginBottom: "10px",
    },
    navLink: {
      textDecoration: "none",
      color: "#333",
    },
    componentCounter: {
      fontSize: "12px",
      color: "#666",
      marginTop: "4px",
    },
  };

  return (
    <div style={styles.dashboardContainer}>
      <style>{pulseAnimation}</style>
      <header style={styles.appBar}>
        <h1>Dashboard</h1>
        <div style={styles.componentCounter}>
          Active Components: {layoutInfo.components.length}
        </div>
      </header>
      <div style={styles.dashboardContent}>
        <nav style={styles.sideNav}>
          <ul style={styles.navList}>
            <li style={styles.navItem}>
              <a href="#item1" style={styles.navLink}>
                Dashboard
              </a>
            </li>
            <li style={styles.navItem}>
              <a href="#item2" style={styles.navLink}>
                Components
              </a>
            </li>
            <li style={styles.navItem}>
              <a href="#item3" style={styles.navLink}>
                Settings
              </a>
            </li>
          </ul>
        </nav>
        <main style={styles.mainContent}>
          <DynoChatLayout
            storageKey="masterLayout_state" // Enables persistence
            componentRegistry={componentRegistry}
            onLayoutChange={handleLayoutChange}
            onAddNewComponent={handleAddNewComponent}
            onComponentUpdate={handleComponentUpdate}
          />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
