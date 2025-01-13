import React from "react";
import { Doughnut, Line } from "react-chartjs-2";
import {
  orange,
  orangeLight,
  purple,
  purpleLight,
} from "../../constants/colors.js";
import { getLast7Days } from "../../lib/features.js";

import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";

ChartJS.register(
  Tooltip,
  Filler,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Legend
);

const lineChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        display: false,
      },
    },
  },
};

const labels = getLast7Days();

const LineChart = ({ value = [] }) => {
  const data = {
    labels,
    datasets: [
      {
        data: value,
        label: "Messages",
        fill: true,
        backgroundColor: purpleLight,
        borderColor: purple,
      },
    ],
  };

  return <Line data={data} options={lineChartOptions} />;
};

const doughnutChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  cutout: 100,
};

const DoughnutChart = ({ value = [], labels = [] }) => {
  const data = {
    labels,
    datasets: [
      {
        data: value,
        label: "Total Chats vs Group Chats",
        backgroundColor: [purpleLight, orangeLight],
        hoverBackgroundColor: [purple, orange],
        borderColor: [purple, orange],
        offset: 40,
      },
    ],
  };

  return (
    <Doughnut
      style={{ zIndex: 10 }}
      data={data}
      options={doughnutChartOptions}
    />
  );
};

export { DoughnutChart, LineChart };
