import React from "react";
import {
  AnalyticsChart,
  DataTable,
  InfoCard,
  KeyMetric,
  PerformanceGauge,
  ActivityList,
} from "./components";
import type {
  ChartData,
  TableData,
  CardData,
  MetricData,
  GaugeData,
  ActivityData,
} from "./components";

export interface DraggableComponent {
  id: string;
  type: string;
  title: string;
  content: React.ReactNode;
}

// Sample data for components
const chartData: ChartData = {
  labels: ["Jan", "Feb", "Mar", "Apr"],
  values: [100, 150, 200, 250],
  title: "Analytics Chart",
};

const tableData: TableData = {
  headers: ["Name", "Value", "Status"],
  rows: [
    { name: "Item 1", value: 100, status: "✓ Active" },
    { name: "Item 2", value: 200, status: "⚠ Pending" },
    { name: "Item 3", value: 150, status: "✓ Active" },
  ],
  title: "Data Table",
};

const cardData: CardData = {
  title: "Info Card",
  content:
    "This is an informational card component that can be moved between the dashboard and chat. It provides important information at a glance.",
  tip: "Click and drag to move this component around the dashboard.",
};

const metricData: MetricData = {
  value: "1,234",
  label: "Total Users",
  change: "+12% from last month",
  title: "Key Metric",
};

const gaugeData: GaugeData = {
  percentage: 85,
  label: "System Performance",
  title: "Performance Gauge",
};

const activityData: ActivityData = {
  items: [
    { message: "User login successful", time: "2m ago", type: "success" },
    { message: "Data export completed", time: "5m ago", type: "info" },
    { message: "New component added", time: "8m ago", type: "success" },
    { message: "System backup started", time: "12m ago", type: "info" },
  ],
  title: "Activity List",
};

export const componentLibrary: DraggableComponent[] = [
  {
    id: "chart-1",
    type: "chart",
    title: "Analytics Chart",
    content: (
      <AnalyticsChart data={chartData} className="dashboard-component" />
    ),
  },
  {
    id: "table-1",
    type: "table",
    title: "Data Table",
    content: <DataTable data={tableData} className="dashboard-component" />,
  },
  {
    id: "card-1",
    type: "card",
    title: "Info Card",
    content: <InfoCard data={cardData} className="dashboard-component" />,
  },
  {
    id: "metric-1",
    type: "metric",
    title: "Key Metric",
    content: <KeyMetric data={metricData} className="dashboard-component" />,
  },
  {
    id: "gauge-1",
    type: "gauge",
    title: "Performance Gauge",
    content: (
      <PerformanceGauge data={gaugeData} className="dashboard-component" />
    ),
  },
  {
    id: "list-1",
    type: "list",
    title: "Activity List",
    content: (
      <ActivityList data={activityData} className="dashboard-component" />
    ),
  },
];

export const getComponentById = (
  id: string
): DraggableComponent | undefined => {
  return componentLibrary.find((component) => component.id === id);
};

export const getComponentByType = (type: string): DraggableComponent[] => {
  return componentLibrary.filter((component) => component.type === type);
};
