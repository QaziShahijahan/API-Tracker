// src/components/Gauge.jsx
import React from "react";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
import "../styles/Analysis.css"; // uses central classes defined there

/**
 * Props:
 *  - value: numeric (displayed in center)
 *  - max: numeric (max value used to compute percentage fill)
 *  - color: stroke color for gauge
 *  - unit: string appended to center (e.g. ' ms' or '%')
 *  - centerText: optional text to show in center (overrides default)
 *  - subText: small subtitle under center
 */
export default function Gauge({ value = 0, max = 100, color = "#00c853", unit = "", centerText, subText }) {
  // compute percent fill 0..100
  const percent = Math.max(0, Math.min(100, (value / (max || 1)) * 100));
  const data = [{ name: "v", value: percent }];

  return (
    <div className="gauge-card">
      <div className="gauge-chart">
        <ResponsiveContainer width="100%" height={110}>
          <RadialBarChart
            cx="50%"
            cy="100%"
            innerRadius="60%"
            outerRadius="100%"
            data={data}
            startAngle={180}
            endAngle={0}
          >
            <RadialBar
              background={{ fill: "rgba(255,255,255,0.06)" }}
              minAngle={2}
              clockWise={true}
              dataKey="value"
              cornerRadius={20}
              fill={color}
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>

      <div className="gauge-center">
        <div className="gauge-center-value">{centerText ?? `${value}${unit}`}</div>
        {subText && <div className="gauge-center-sub">{subText}</div>}
      </div>
    </div>
  );
}
