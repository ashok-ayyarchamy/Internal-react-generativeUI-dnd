import React from "react";
import {
  AnalyticsChart,
  DataTable,
  InfoCard,
  KeyMetric,
  PerformanceGauge,
  ActivityList,
} from "~/Dashboard/components";
import type { ComponentConfig } from "./localStorageUtils";
import type { DraggableComponent } from "~/Dashboard/ComponentLibrary";

// Sample data for components (this should match the data structure in ComponentLibrary)
const createChartData = (data?: any) => ({
  labels: data?.labels || ["Jan", "Feb", "Mar", "Apr"],
  values: data?.values || [100, 150, 200, 250],
  title: data?.title || "Analytics Chart",
});

const createTableData = (data?: any) => ({
  headers: data?.headers || ["Name", "Value", "Status"],
  rows: data?.rows || [
    { name: "Item 1", value: 100, status: "✓ Active" },
    { name: "Item 2", value: 200, status: "⚠ Pending" },
    { name: "Item 3", value: 150, status: "✓ Active" },
  ],
  title: data?.title || "Data Table",
});

const createCardData = (data?: any) => ({
  title: data?.title || "Info Card",
  content:
    data?.content ||
    "This is an informational card component that can be moved between the dashboard and chat. It provides important information at a glance.",
  tip:
    data?.tip || "Click and drag to move this component around the dashboard.",
});

const createMetricData = (data?: any) => ({
  value: data?.value || "1,234",
  label: data?.label || "Total Users",
  change: data?.change || "+12% from last month",
  title: data?.title || "Key Metric",
});

const createGaugeData = (data?: any) => ({
  percentage: data?.percentage || 85,
  label: data?.label || "System Performance",
  title: data?.title || "Performance Gauge",
});

const createActivityData = (data?: any) => ({
  items: data?.items || [
    { message: "User login successful", time: "2m ago", type: "success" },
    { message: "Data export completed", time: "5m ago", type: "info" },
    { message: "New component added", time: "8m ago", type: "success" },
    { message: "System backup started", time: "12m ago", type: "info" },
  ],
  title: data?.title || "Activity List",
});

// Factory function to create React component from config
export const createComponentFromConfig = (
  config: ComponentConfig
): DraggableComponent => {
  const baseComponent = {
    id: config.id,
    type: config.type,
    title: config.title,
  };

  switch (config.type) {
    case "chart":
      return {
        ...baseComponent,
        content: (
          <AnalyticsChart
            data={createChartData(config.data?.chartData)}
            className="dashboard-component"
          />
        ),
      };

    case "table":
      return {
        ...baseComponent,
        content: (
          <DataTable
            data={createTableData(config.data?.tableData)}
            className="dashboard-component"
          />
        ),
      };

    case "card":
      return {
        ...baseComponent,
        content: (
          <InfoCard
            data={createCardData(config.data?.cardData)}
            className="dashboard-component"
          />
        ),
      };

    case "metric":
      return {
        ...baseComponent,
        content: (
          <KeyMetric
            data={createMetricData(config.data?.metricData)}
            className="dashboard-component"
          />
        ),
      };

    case "gauge":
      return {
        ...baseComponent,
        content: (
          <PerformanceGauge
            data={createGaugeData(config.data?.gaugeData)}
            className="dashboard-component"
          />
        ),
      };

    case "activity":
      return {
        ...baseComponent,
        content: (
          <ActivityList
            data={createActivityData(config.data?.activityData)}
            className="dashboard-component"
          />
        ),
      };

    case "empty":
      return {
        ...baseComponent,
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
      };

    default:
      console.warn(`Unknown component type: ${config.type}`);
      return {
        ...baseComponent,
        content: (
          <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>
            Unknown component type: {config.type}
          </div>
        ),
      };
  }
};

// Convert DraggableComponent to ComponentConfig
export const convertToComponentConfig = (
  component: DraggableComponent
): ComponentConfig => {
  const config: ComponentConfig = {
    id: component.id,
    type: component.type,
    title: component.title,
  };

  // Extract data based on component type
  // Note: This is a simplified approach. In a real application,
  // you might want to store the actual data that was used to create the component
  switch (component.type) {
    case "chart":
      config.data = {
        chartData: {
          labels: ["Jan", "Feb", "Mar", "Apr"],
          values: [100, 150, 200, 250],
          title: component.title,
        },
      };
      break;

    case "table":
      config.data = {
        tableData: {
          headers: ["Name", "Value", "Status"],
          rows: [
            { name: "Item 1", value: 100, status: "✓ Active" },
            { name: "Item 2", value: 200, status: "⚠ Pending" },
            { name: "Item 3", value: 150, status: "✓ Active" },
          ],
          title: component.title,
        },
      };
      break;

    case "card":
      config.data = {
        cardData: {
          title: component.title,
          content:
            "This is an informational card component that can be moved between the dashboard and chat. It provides important information at a glance.",
          tip: "Click and drag to move this component around the dashboard.",
        },
      };
      break;

    case "metric":
      config.data = {
        metricData: {
          value: "1,234",
          label: "Total Users",
          change: "+12% from last month",
          title: component.title,
        },
      };
      break;

    case "gauge":
      config.data = {
        gaugeData: {
          percentage: 85,
          label: "System Performance",
          title: component.title,
        },
      };
      break;

    case "activity":
      config.data = {
        activityData: {
          items: [
            {
              message: "User login successful",
              time: "2m ago",
              type: "success",
            },
            { message: "Data export completed", time: "5m ago", type: "info" },
            { message: "New component added", time: "8m ago", type: "success" },
            { message: "System backup started", time: "12m ago", type: "info" },
          ],
          title: component.title,
        },
      };
      break;
  }

  return config;
};
