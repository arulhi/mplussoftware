import React from "react";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import type { ApexOptions } from "apexcharts";

interface LineChartProps {
  data: { name: string; data: { x: string | number; y: number }[] }[];
  title?: string;
  colors: string[];
  x?: ApexXAxis;
  y?: ApexYAxis;
  grid?: ApexGrid;
  legend?: ApexLegend;
  dataLabels?: ApexDataLabels;
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  colors,
  title = "",
  dataLabels,
  grid,
  legend,
}) => {
  // Ensure data is valid before accessing it
  if (!data || data.length === 0) {
    console.error("No data provided for the chart.");
    return null;
  }

  const options: ApexOptions = {
    chart: {
      id: "line-chart",
      toolbar: { show: false },
    },
    xaxis: {
      type: "category",
      categories: data[0]?.data?.map((item) => item.x) || [], // Safely access data
      labels: {
        style: {
          colors: "#9aa0ac",
        },
      },
    },
    stroke: {
      curve: "smooth",
      width: 5, // Thicker line
      colors: colors, // Line color
    },
    markers: {
      size: 5,
      colors: ["#fff"], // Inner color
      strokeColors: colors, // Border color
      strokeWidth: 3,
      hover: {
        size: 5,
      },
    },
    legend: legend || {}, // Provide default value
    tooltip: {
      enabled: true,
      theme: "dark",
      custom: ({ series, dataPointIndex, w }) => {
        let tooltipHTML = '<div style="background: #222; padding: 8px 12px; border-radius: 8px; color: #fff;">';

        series.forEach((_: any, seriesIndex: number) => {
          const backgroundColor = w.config.colors?.[seriesIndex] || "#000"; // Safely access colors
          tooltipHTML += `
            <div style="display: flex; align-items: center; margin-bottom: 4px;">
              <div style="width: 10px; height: 10px; background: ${backgroundColor}; border-radius: 50%; margin-right: 6px;"></div>
              <span>${w.globals.seriesNames?.[seriesIndex] || "Series"}: $${series[seriesIndex][dataPointIndex].toFixed(2)}</span>
            </div>
          `;
        });

        tooltipHTML += '</div>';
        return tooltipHTML;
      },
    },
    colors: colors,
    title: {
      text: title,
      align: "center",
    },
    grid: grid || {}, // Provide default value
    dataLabels: dataLabels || {}, // Provide default value
  };

  return (
    <div className="w-full">
      <Chart options={options} series={data} type="line" height={350} />
    </div>
  );
};

export default LineChart;