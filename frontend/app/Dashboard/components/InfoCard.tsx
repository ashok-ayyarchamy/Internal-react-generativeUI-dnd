import React from "react";

export interface CardData {
  title: string;
  content: string;
  tip?: string;
}

interface InfoCardProps {
  data: CardData;
  className?: string;
}

export const InfoCard: React.FC<InfoCardProps> = ({ data, className }) => {
  return (
    <div className={className}>
      <h3>{data.title}</h3>
      <p>{data.content}</p>
      {data.tip && <div className="tip">💡 Tip: {data.tip}</div>}
    </div>
  );
};
