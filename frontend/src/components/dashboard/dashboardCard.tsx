import React from "react";
import { Euro } from "@mui/icons-material";

interface DashboardCardProps {
  title: string;
  value: string;
  percentage?: string;
  icon?: string; // Optional prop for percentage
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  percentage,
}) => {
  return (
    <div className="bg-white border text-black rounded-lg p-6 shadow-md dark:bg-[#1e293b] dark:text-white">
      {/* Title and Icon */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-800 dark:text-gray-400">{title}</p>
        <Euro className="text-gray-800 dark:text-gray-400 text-2xl" />
      </div>

      {/* Value */}
      <h2 className="text-4xl font-bold mt-3 mb-2">{value.toLocaleString()}</h2>

      {/* Percentage */}
      {percentage ? (
        <p className="text-sm text-gray-800 dark:text-gray-400">{percentage}</p>
      ) : (
        <p className="text-sm text-gray-800 dark:text-gray-400">-</p>
      )}
    </div>
  );
};

export default DashboardCard;
