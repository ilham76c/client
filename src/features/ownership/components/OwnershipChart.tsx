"use client";

import ReactECharts from "echarts-for-react";
import { useOwnership } from "../hooks/useOwnership";

export default function OwnershipChart() {
  const { data, isLoading } = useOwnership();

  if (isLoading) return <div>Loading ownership chart...</div>;

  return (
    <ReactECharts
      option={{
        xAxis: { type: "category", data: data.dates },
        yAxis: { type: "value" },
        series: [{ data: data.values, type: "line" }],
      }}
    />
  );
}
