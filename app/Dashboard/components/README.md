# Dashboard Components

This folder contains individual, reusable dashboard components that accept data and display it without inline styles.

## Components

### AnalyticsChart
Displays chart data with labels and values.

```typescript
interface ChartData {
  labels: string[];
  values: number[];
  title?: string;
}
```

### DataTable
Displays tabular data with headers and rows.

```typescript
interface TableData {
  headers: string[];
  rows: TableRow[];
  title?: string;
}

interface TableRow {
  name: string;
  value: string | number;
  status: string;
}
```

### InfoCard
Displays informational content with optional tips.

```typescript
interface CardData {
  title: string;
  content: string;
  tip?: string;
}
```

### KeyMetric
Displays key metrics with values, labels, and optional change indicators.

```typescript
interface MetricData {
  value: string | number;
  label: string;
  change?: string;
  title?: string;
}
```

### PerformanceGauge
Displays performance metrics as a gauge.

```typescript
interface GaugeData {
  percentage: number;
  label: string;
  title?: string;
}
```

### ActivityList
Displays a list of activity items with timestamps.

```typescript
interface ActivityData {
  items: ActivityItem[];
  title?: string;
}

interface ActivityItem {
  message: string;
  time: string;
  type?: "success" | "warning" | "info";
}
```

## Usage

All components accept a `data` prop with the appropriate interface and an optional `className` prop for styling.

```typescript
import { AnalyticsChart, ChartData } from './components';

const chartData: ChartData = {
  labels: ["Jan", "Feb", "Mar"],
  values: [100, 150, 200],
  title: "Sales Chart"
};

<AnalyticsChart data={chartData} className="my-chart" />
```

## Styling

Components use CSS classes defined in `components.css`. The main class is `dashboard-component` which provides basic styling for all components. 