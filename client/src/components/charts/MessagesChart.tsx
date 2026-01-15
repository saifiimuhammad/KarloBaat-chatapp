import React from "react";

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

interface MessagesChartProps {
  data: number[];
}

const MessagesChart: React.FC<MessagesChartProps> = ({ data }) => {
  const width = 500;
  const height = 150;
  const padding = 20;

  const maxValue = Math.max(...data, 1);

  const points = data.map((value, index) => {
    const x = (width / (data.length - 1)) * index;
    const y = height - padding - (value / maxValue) * (height - padding * 2);
    return { x, y };
  });

  const createPath = (points: { x: number; y: number }[]) => {
    if (!points.length) return "";

    let d = `M ${points[0].x} ${points[0].y}`;

    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];

      const cpX = (prev.x + curr.x) / 2;
      d += ` C ${cpX} ${prev.y}, ${cpX} ${curr.y}, ${curr.x} ${curr.y}`;
    }

    return d;
  };

  const linePath = createPath(points);
  const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`;

  return (
    <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-xl p-6 flex flex-col gap-4">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-lg font-bold">Messages Sent in a Week</h4>
          <p className="text-text-light text-sm">
            Average daily volume:{" "}
            {Math.round(data.reduce((a, b) => a + b, 0) / data.length)}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1 text-xs font-bold rounded bg-primary text-white">
            Week
          </button>
          <button className="px-3 py-1 text-xs font-bold rounded bg-background-light text-text-light">
            Month
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-60 w-full">
        <svg
          className="w-full h-full"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#628141" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#628141" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Area */}
          <path d={areaPath} fill="url(#chartGradient)" />

          {/* Line */}
          <path
            d={linePath}
            fill="none"
            stroke="#628141"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* X Axis */}
      <div className="flex justify-between px-2 pt-4 border-t border-zinc-200">
        {DAYS.map((day) => (
          <span key={day} className="text-[11px] font-bold text-text-light">
            {day}
          </span>
        ))}
      </div>
    </div>
  );
};

export default MessagesChart;
