import React from "react";

interface DoughnutData {
  label: string;
  value: number;
  color: string;
}

interface DoughnutChartProps {
  data: DoughnutData[];
  centerLabel?: string;
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({
  data,
  centerLabel = "Total",
}) => {
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;

  let offset = 0;

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-6 flex flex-col justify-between gap-6 h-full">
      <div className="flex flex-col gap-6">
        <h4 className="text-lg font-bold">{centerLabel} Distribution</h4>

        {/* Chart */}
        <div className="flex justify-center">
          <div className="relative size-48">
            <svg className="size-full" viewBox="0 0 36 36">
              {/* Base ring */}
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                stroke="#edefeb"
                strokeWidth="4"
              />

              {/* Dynamic segments */}
              {data.map((item, index) => {
                const percentage = (item.value / total) * 100;
                const dashArray = `${percentage} ${100 - percentage}`;
                const dashOffset = -offset;
                offset += percentage;

                return (
                  <circle
                    key={index}
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke={item.color}
                    strokeWidth="4"
                    strokeDasharray={dashArray}
                    strokeDashoffset={dashOffset}
                    strokeLinecap="round"
                  />
                );
              })}
            </svg>

            {/* Center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold">
                {total.toLocaleString()}
              </span>
              <span className="text-[10px] text-text-light font-bold uppercase">
                {centerLabel}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-3">
        {data.map((item) => {
          const percent = Math.round((item.value / total) * 100);
          return (
            <div key={item.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="size-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              <span className="text-sm font-bold">{percent}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DoughnutChart;
