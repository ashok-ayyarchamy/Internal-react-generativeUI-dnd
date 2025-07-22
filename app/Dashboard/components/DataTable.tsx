import React from "react";

export interface TableRow {
  name: string;
  value: string | number;
  status: string;
}

export interface TableData {
  headers: string[];
  rows: TableRow[];
  title?: string;
}

interface DataTableProps {
  data: TableData;
  className?: string;
}

export const DataTable: React.FC<DataTableProps> = ({ data, className }) => {
  return (
    <div className={className}>
      <h3>{data.title || "Data Table"}</h3>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              {data.headers.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, index) => (
              <tr key={index}>
                <td>{row.name}</td>
                <td>{row.value}</td>
                <td>{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
