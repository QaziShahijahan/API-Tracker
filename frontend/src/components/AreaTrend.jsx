// src/components/AreaTrend.jsx
import React from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend
} from "recharts";

/**
 * data: [{ month: "Jan", value: 200, value2: 320 }, ...]
 * value => primary series (request volume)
 * value2 => secondary series (avg response time)
 */
export default function AreaTrend({ data = [] }) {
  return (
    <div className="area-card">
      <ResponsiveContainer width="100%" height={340}>
        <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2196f3" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#2196f3" stopOpacity={0.08} />
            </linearGradient>
            <linearGradient id="colorSecondary" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#64b5f6" stopOpacity={0.6} />
              <stop offset="100%" stopColor="#64b5f6" stopOpacity={0.05} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }} />
          <YAxis tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }} />
          <Tooltip wrapperStyle={{ background: "#0b1022", borderRadius: 6 }} />
          <Area type="monotone" dataKey="value" stroke="#1e88e5" strokeWidth={2} fill="url(#colorPrimary)" />
          <Area type="monotone" dataKey="value2" stroke="#64b5f6" strokeWidth={1} fill="url(#colorSecondary)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
