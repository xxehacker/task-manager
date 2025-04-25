import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from "recharts";

const BarChartComponent = ({ chartData }) => {
  const getBarColor = (priority) => {
    switch (priority) {
      case "low":
        return "#34d399";
      case "medium":
        return "#fbbf24";
      case "high":
        return "#f87171";
      default:
        return "#34d399";
    }
  };

  const customTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { priority, count } = payload[0].payload;
      return (
        <div className="bg-white text-black p-2 rounded-lg shadow-md">
          <p className="font-semibold">{priority}</p>
          <p>{count}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="priority" tick={{ fontSize: 12, fill: "#4b5563" }} />
          <YAxis tick={{ fontSize: 12, fill: "#4b5563" }} />
          <Tooltip
            content={customTooltip}
            cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
          />
          <Legend />
          <Bar dataKey="count" radius={[10, 10, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.priority)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartComponent;
