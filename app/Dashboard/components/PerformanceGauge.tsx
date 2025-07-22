import React from "react";

export interface GaugeData {
  percentage: number;
  label: string;
  title?: string;
}

interface PerformanceGaugeProps {
  data: GaugeData;
  className?: string;
}

export const PerformanceGauge: React.FC<PerformanceGaugeProps> = ({
  data,
  className,
}) => {
  return (
    <div className={className}>
      <h3>{data.title || "Performance Gauge"}</h3>
      <div className="gauge-container">
        <div className="gauge-circle">{data.percentage}%</div>
      </div>
      <div className="gauge-label">{data.label}</div>
    </div>
  );
};
