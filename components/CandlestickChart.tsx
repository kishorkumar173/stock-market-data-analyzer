"use client";

import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function CandlestickChart({ data }: any) {

  const series = [
    {
      data: data.map((item: any) => ({
        x: new Date(item.date),
        y: [
          item.open,
          item.high,
          item.low,
          item.close
        ]
      }))
    }
  ];

  const options: any = {

    chart: {
      type: "candlestick",
      background: "transparent",
      toolbar: {
        show: true
      }
    },

    theme: {
      mode: "dark"
    },

    xaxis: {
      type: "datetime"
    },

    yaxis: {
      tooltip: {
        enabled: true
      }
    },

    grid: {
      borderColor: "#1e293b"
    }
  };

  return (

    <Chart
      options={options}
      series={series}
      type="candlestick"
      height={400}
    />

  );
}