"use client";
import React from "react";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

import { ApexOptions } from "apexcharts";

interface StackedBarChartProps {
  data: { name: string; data: { x: string | number; y: number }[] }[];
  title?: string;
  colors: string[];
  x?: ApexXAxis;
  y?: ApexYAxis;
  grid?: ApexGrid;
  legend?: ApexLegend;
  dataLabels?: ApexDataLabels;
}

const StackedBarChart: React.FC<StackedBarChartProps> = ({
  data,
  colors,
  title = "",
  x = {},
  y = {},
  grid = {},
  legend = {},
  dataLabels = {},
}) => {
  if (!data || data.length === 0) {
    console.error("No data provided for the chart.");
    return null;
  }

  const options: ApexOptions = {
    chart: {
      type: "bar",
      stacked: true,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "40%",
        borderRadius: 5,
      },
    },
    colors: colors,
    xaxis: {
      ...x,
      categories: data[0]?.data?.map((item) => item.x) || [], // Safely extract categories
      labels: {
        style: {
          colors: "#9aa0ac",
        },
      },
    },
    yaxis: y,
    grid: grid,
    dataLabels: dataLabels,
    legend: legend,
    tooltip: {
      enabled: true,
      theme: "dark",
      custom: ({ series, dataPointIndex, w }) => {
        let tooltipHTML = '<div style="background: #222; padding: 8px 12px; border-radius: 8px; color: #fff;">';

        series.forEach((_: any, seriesIndex: number) => {
          const backgroundColor = w.config.colors?.[seriesIndex] || "#000"; // Safely access colors
          const seriesName = w.globals.seriesNames?.[seriesIndex] || "Series"; // Safely access series names
          tooltipHTML += `
            <div style="display: flex; align-items: center; margin-bottom: 4px;">
              <div style="width: 10px; height: 10px; background: ${backgroundColor}; border-radius: 50%; margin-right: 6px;"></div>
              <span>${seriesName}: $${series[seriesIndex][dataPointIndex].toFixed(2)}</span>
            </div>
          `;
        });

        tooltipHTML += '</div>';
        return tooltipHTML;
      },
    },
    title: {
      text: title,
      align: "center",
    },
  };

  return (
    <div className="w-full">
      <Chart options={options} series={data} type="bar" height={300} />
    </div>
  );
};

export default StackedBarChart;