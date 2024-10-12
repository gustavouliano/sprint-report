"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Carregamento dinâmico do componente ReactApexChart
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

type Props = {
  workedDays: number;
  plannedSeries: number[];
  realizedSeries: number[];
};

const MultiLineChart = ({
  workedDays,
  plannedSeries,
  realizedSeries,
}: Props) => {
  const [workDays, setWorkDays] = useState<number[]>([]);
  const [chartData, setChartData] = useState({
    series: [
      {
        name: "Planejado",
        data: plannedSeries,
      },
      {
        name: "Realizado",
        data: realizedSeries,
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false,
        },
      },
      colors: ["#FF5733", "#2E93fA"],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "straight",
      },
      title: {
        text: "Product Trends by Month",
        align: "left",
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: workDays,
      },
    },
  });

  // Atualiza os dias de trabalho e a série planejada
  useEffect(() => {
    console.log("planned: ", plannedSeries);
    console.log("realized: ", realizedSeries);

    const xWorkDays: number[] = [];
    for (let i = 1; i <= workedDays; i++) {
      xWorkDays.push(i);
    }
    setWorkDays(xWorkDays);

    // Atualiza o gráfico sempre que as props mudarem
    setChartData((prevData) => ({
      ...prevData,
      series: [
        {
          name: "Planejado",
          data: plannedSeries,
        },
        {
          name: "Realizado",
          data: realizedSeries,
        },
      ],
      options: {
        ...prevData.options,
        xaxis: {
          categories: xWorkDays, // Atualizando os dias de trabalho
        },
      },
    }));
  }, [workedDays, plannedSeries, realizedSeries]); // Dependências para re-executar o efeito sempre que essas props mudarem

  return (
    <div>
      <div id="chart">
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="line"
          height={350}
        />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default MultiLineChart;
