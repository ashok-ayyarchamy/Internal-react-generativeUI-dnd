import React from "react";

export interface ActivityItem {
  message: string;
  time: string;
  type?: "success" | "warning" | "info";
}

export interface ActivityData {
  items: ActivityItem[];
  title?: string;
}

interface ActivityListProps {
  data: ActivityData;
  className?: string;
}

export const ActivityList: React.FC<ActivityListProps> = ({
  data,
  className,
}) => {
  return (
    <div className={className}>
      <h3>{data.title || "Activity List"}</h3>
      <div className="activity-list">
        {data.items.map((item, index) => (
          <div key={index} className="activity-item">
            <span className="activity-bullet">●</span>
            <span className="activity-message">{item.message}</span>
            <span className="activity-time">{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
