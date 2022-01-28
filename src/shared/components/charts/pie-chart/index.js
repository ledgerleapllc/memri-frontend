import React from "react";
import { ReactApexChart } from "react-apexcharts";

import "./style.scss";

const buildOptions = (xaxisData, name) => ({
  chart: {
    width: 380,
    type: "pie",
  },
  labels: xaxisData,
  title: {
    text: name,
    align: "center",
    style: {
      color: "currentColor",
    },
  },
  legend: {
    position: "bottom",
    labels: {
      colors: "currentColor",
    },
  },
});

export const PieChart = ({ name, data }) => {
  return (
    <div className="pie-chart">
      {data && (
        <ReactApexChart
          options={buildOptions(
            data.map((x) => x.label),
            name
          )}
          series={data.map((x) => x.value)}
          type="pie"
          height="100%"
        />
      )}
    </div>
  );
};
