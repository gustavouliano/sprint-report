"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

type Props = {
  seriesData: number[];
  labels: string[];
};

const PieChart = ({ seriesData, labels }: Props) => {
  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: {
        width: 400,
        type: "pie",
      },
      labels: labels,
      colors: [
        "#FF5733",
        "#2E93fA",
        "#66DA26",
        "#F9C80E",
        "#E91E63",
        "#FA17BA",
      ],
      dataLabels: {
        enabled: true,
        formatter: function (val: number) {
          return `${val.toFixed(1)}%`;
        },
      },
      title: {
        text: "Atribuições de Tarefas",
        align: "center",
      },
      legend: {
        position: "bottom",
      },
    },
  });

  useEffect(() => {
    setChartData((prevData) => ({
      ...prevData,
      series: seriesData,
      options: {
        ...prevData.options,
        labels: labels,
      },
    }));
  }, [seriesData, labels]);

  return (
    <div className="w-1/2">
      <div id="chart">
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="pie"
          height={350}
        />
      </div>
    </div>
  );
};

export default PieChart;
