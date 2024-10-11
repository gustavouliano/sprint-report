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
};

const MultiLineChart = ({ workedDays, plannedSeries }: Props) => {
  const [workDays, setWorkDays] = useState<number[]>([]);
  const [chartData, setChartData] = useState({
    series: [
      {
        name: "Planejado",
        data: plannedSeries,
      },
      {
        name: "Realizado",
        data: [23, 32, 44, 55, 34, 40, 45, 55, 60, 3],
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
    const xWorkDays = [];
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
          data: plannedSeries, // Atualizando a série planejada com os novos dados
        },
        prevData.series[1], // Mantendo a série de "Realizado" fixa
      ],
      options: {
        ...prevData.options,
        xaxis: {
          categories: xWorkDays, // Atualizando os dias de trabalho
        },
      },
    }));

    console.log("planned series:", plannedSeries);
  }, [workedDays, plannedSeries]); // Dependências para re-executar o efeito sempre que essas props mudarem

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
