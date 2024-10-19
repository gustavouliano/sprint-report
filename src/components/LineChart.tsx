"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

type Props = {
  workedDays: number;
  plannedSeries: number[];
  realizedSeries: number[];
};

const LineChart = ({ workedDays, plannedSeries, realizedSeries }: Props) => {
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
        height: 400,
        type: "line",
        zoom: {
          enabled: true,
        },
      },
      colors: ["#FF5733", "#2E93fA"],
      dataLabels: {
        enabled: true,
        formatter: function (val: number, opt) {
          console.log('a');
          let seriesList = [];
          // SeriesIndex = 0 -- Série planejada | 1 -- Série realizada 
          if (opt.seriesIndex == 0) {
            seriesList = plannedSeries;
            const valIndex = opt.dataPointIndex;
            if (valIndex == 0){
              return 0;
            }
            const prevValue = seriesList[valIndex - 1];
            return prevValue - val;
          }
          else{
            seriesList = realizedSeries;
            const valIndex = opt.dataPointIndex;
            if (valIndex == 0) {
              return plannedSeries[valIndex] - realizedSeries[valIndex];
            }
            const prevValue = seriesList[valIndex - 1];
            return prevValue - val;
          }
          return `${val.toFixed(1)}%`;
        },
      },
      stroke: {
        curve: "straight",
      },
      title: {
        text: "Gráfico de Burndown",
        align: "middle",
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: workDays,
        title: {
          text: "Dias úteis",
        },
      },
      yaxis: {
        title: {
          text: "Tarefas",
        },
      },
    },
  });

  useEffect(() => {
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
          categories: xWorkDays,
          title: {
            text: "Dias úteis",
          },
        },
      },
    }));
  }, [workedDays, plannedSeries, realizedSeries]); // Dependências para re-executar o efeito sempre que essas props mudarem

  return (
    <div className="w-1/2">
      <div id="chart">
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="line"
          height={350}
        />
      </div>
    </div>
  );
};

export default LineChart;
