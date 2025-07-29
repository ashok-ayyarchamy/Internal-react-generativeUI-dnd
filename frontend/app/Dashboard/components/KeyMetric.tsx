import React from "react";

export interface MetricData {
  value: string | number;
  label: string;
  change?: string;
  title?: string;
}

interface KeyMetricProps {
  data: MetricData;
  className?: string;
}

export const KeyMetric: React.FC<KeyMetricProps> = ({ data, className }) => {
  return (
    <div className={className}>
      <h3>{data.title || "Key Metric"}</h3>
      <div className="metric-value">{data.value}</div>
      <div className="metric-label">{data.label}</div>
      {data.change && <div className="metric-change">{data.change}</div>}
    </div>
  );
};
