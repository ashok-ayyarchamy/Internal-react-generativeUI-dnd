import React, { useState, useRef } from "react";
import MasterLayout, { type MasterLayoutRef } from "~/MasterLayout";
import type { DraggableComponent } from "./ComponentLibrary";
import { componentLibrary } from "./ComponentLibrary";

// Add CSS for pulse animation
const pulseAnimation = `
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

const Dashboard: React.FC = () => {
  const [dashboardComponents, setDashboardComponents] = useState<
    DraggableComponent[]
  >([]);
  const masterLayoutRef = useRef<MasterLayoutRef>(null);

  const handleAddComponentToDashboard = (component: DraggableComponent) => {
    // Create a new instance with unique ID
    const newComponent: DraggableComponent = {
      ...component,
      id: `${component.type}-${Math.floor(Math.random() * 10000)}`,
    };

    // Check if component already exists
    if (!dashboardComponents.find((c) => c.id === newComponent.id)) {
      setDashboardComponents((prev) => [...prev, newComponent]);

      // Add to master layout if ref is available
      if (masterLayoutRef.current) {
        masterLayoutRef.current.addLayoutItem(newComponent);
      }
    }
  };

  const handleRemoveComponentFromDashboard = (componentId: string) => {
    setDashboardComponents((prev) => prev.filter((c) => c.id !== componentId));

    // Remove from master layout if ref is available
    if (masterLayoutRef.current) {
      masterLayoutRef.current.removeLayoutItem(componentId);
    }
  };

  const handleUpdateComponent = (
    componentId: string,
    updates: Partial<DraggableComponent>
  ) => {
    console.log("Updating component:", componentId, "with updates:", updates);
    setDashboardComponents((prev) => {
      const updated = prev.map((component) =>
        component.id === componentId ? { ...component, ...updates } : component
      );
      console.log("Updated components:", updated);
      return updated;
    });
  };

  const handleAddEmptyComponent = () => {
    // Create an empty component that will be replaced by chat selection
    const emptyComponent: DraggableComponent = {
      id: `empty-${Math.floor(Math.random() * 10000)}`,
      type: "empty",
      title: "Select Component",
      content: (
        <div
          style={{
            padding: "20px",
            textAlign: "center",
            color: "#666",
            fontSize: "14px",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f8f9fa",
            border: "2px dashed #dee2e6",
          }}
        >
          Click the chat button to select a component
        </div>
      ),
      size: { w: 2, h: 2 },
      minSize: { w: 2, h: 2 },
      maxSize: { w: 8, h: 6 },
    };

    setDashboardComponents((prev) => [...prev, emptyComponent]);

    // Add to master layout if ref is available
    if (masterLayoutRef.current) {
      masterLayoutRef.current.addLayoutItem(emptyComponent);
    }
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
    floatingButton: {
      position: "fixed" as const,
      bottom: "20px",
      right: "20px",
      width: "50px",
      height: "50px",
      borderRadius: "25px",
      backgroundColor: "#f0f0f0",
      color: "#333",
      border: "1px solid #ccc",
      cursor: "pointer",
      fontSize: "20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    },
  };

  return (
    <div style={styles.dashboardContainer}>
      <style>{pulseAnimation}</style>
      <header style={styles.appBar}>
        <h1>Dashboard</h1>
        <div style={styles.componentCounter}>
          Active Components: {dashboardComponents.length}
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
          <MasterLayout
            ref={masterLayoutRef}
            components={dashboardComponents}
            onComponentRemove={handleRemoveComponentFromDashboard}
            onUpdateComponent={handleUpdateComponent}
          ></MasterLayout>
        </main>
      </div>

      {/* Floating Add Button */}
      <button
        onClick={handleAddEmptyComponent}
        style={styles.floatingButton}
        title="Add new component"
      >
        +
      </button>
    </div>
  );
};

export default Dashboard;
