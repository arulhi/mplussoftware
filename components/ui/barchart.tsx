"use client";
import React from "react";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { ApexOptions } from "apexcharts";

interface BarChartProps {
  data: { name: string; data: { x: string | number; y: number }[] }[];
  title?: string;
  colors: string[];
  x?: ApexXAxis;
  y?: ApexYAxis;
  grid?: ApexGrid;
  legend?: ApexLegend;
  dataLabels?: ApexDataLabels;
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  colors,
  title = "",
  x = {},
  y = {},
  grid = {},
  legend = {},
  dataLabels = {},
}) => {
  // Ensure data is valid before rendering
  if (!data || data.length === 0) {
    console.error("No data provided for the chart.");
    return null;
  }

  const options: ApexOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "40%",
        borderRadius: 5,
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "last",
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "vertical",
        shadeIntensity: 0.5,
        gradientToColors: colors,
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 0.3,
        stops: [50, 100],
      },
    },
    colors: colors,
    xaxis: {
      categories: data[0]?.data?.map((item) => item.x) || [],
      labels: {
        style: {
          colors: "#9aa0ac",
        },
      },
    },
    tooltip: {
      enabled: true,
      theme: "dark",
    },
    title: {
      text: title,
      align: "center",
    },
  };

  return (
    <div className="w-full">
      <Chart options={options} series={data} type="bar" height={200} />
    </div>
  );
};

export default BarChart;
