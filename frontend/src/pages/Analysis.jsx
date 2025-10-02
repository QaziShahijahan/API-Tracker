// src/pages/Analysis.jsx
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import Gauge from "../components/Gauge";
import AreaTrend from "../components/AreaTrend";
import "../styles/Analysis.css";

export default function Analysis() {
  const [stats, setStats] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [maxVolume, setMaxVolume] = useState(1);

  // Create last 12 months array with from/to and label
  function getLast12Months() {
    const months = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = d.getFullYear();
      const month = d.getMonth(); // 0-indexed
      const from = new Date(year, month, 1).toISOString().split("T")[0];
      const to = new Date(year, month + 1, 0).toISOString().split("T")[0];
      const label = d.toLocaleString(undefined, { month: "short" });
      months.push({ label, from, to });
    }
    return months;
  }

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        // 1) overall quick stats
        const s = await api.get("/tracer/stats");
        if (!mounted) return;
        setStats(s.data);

        // 2) monthly series (last 12 months)
        const months = getLast12Months();

        // fetch monthly stats in parallel (handles missing data safely)
        const promises = months.map(async (m) => {
          try {
            const res = await api.get("/tracer/stats", {
              params: { from: m.from, to: m.to }
            });
            return {
              month: m.label,
              totalRequests: res.data?.totalRequests ?? 0,
              avgResponseTime: res.data?.avgResponseTime ?? 0,
              uptimePercentage: res.data?.uptimePercentage ?? 100
            };
          } catch (err) {
            // if a month request fails, return zeroes (keeps UI stable)
            return {
              month: m.label,
              totalRequests: 0,
              avgResponseTime: 0,
              uptimePercentage: 100
            };
          }
        });

        const results = await Promise.all(promises);
        if (!mounted) return;

        // prepare area chart data (primary = totalRequests, secondary = avgResponseTime)
        const area = results.map((r) => ({
          month: r.month,
          value: r.totalRequests,
          value2: Math.round(r.avgResponseTime)
        }));

        setMonthlyData(area);
        const maxV = Math.max(1, ...area.map((a) => a.value));
        setMaxVolume(maxV);
      } catch (err) {
        console.error("Error loading analysis page data", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return (
    <div className="analysis-container">
      <Sidebar />
      <main className="analysis-main">
        <h1>Analysis</h1>
        <div className="loading">Loading analysis...</div>
      </main>
    </div>
  );

  if (!stats) return (
    <div className="analysis-container">
      <Sidebar />
      <main className="analysis-main">
        <h1>Analysis</h1>
        <div className="loading">No stats available</div>
      </main>
    </div>
  );

  // map some values for gauge displays
  const uptime = Number(stats.uptimePercentage ?? 100);
  const avgRt = Number(stats.avgResponseTime ?? 0);
  const totalRequests = Number(stats.totalRequests ?? 0);
  const errorRate = Number(stats.errorRate ?? 0);

  return (
    <div className="analysis-container">
      <Sidebar />
      <main className="analysis-main">
        <h1>Analysis</h1>

        <div className="cards">
          <div className="card large-card">
            <div className="card-title">Uptime (Last 7 Days)</div>
            <div className="card-body">
              <Gauge
                value={Math.round(uptime * 100) / 100}
                max={100}
                color="#00c853"
                unit="%"
                centerText={`${Math.round(uptime * 100) / 100}%`}
                subText={stats.lastDowntime ? `Last downtime: ${new Date(stats.lastDowntime).toLocaleString()}` : "No downtime recorded"}
              />
            </div>
          </div>

          <div className="card">
            <div className="card-title">Average Response Time</div>
            <div className="card-body">
              {/* map avg response to percentage of a chooseable ceiling (e.g., 1000ms) */}
              <Gauge
                value={avgRt}
                max={1000}
                color="#1e88e5"
                unit=" ms"
                centerText={`${avgRt} ms`}
                subText={`Peak: ${stats.avgResponseTime ?? 0} ms`}
              />
            </div>
          </div>

          <div className="card">
            <div className="card-title">Request Volume</div>
            <div className="card-body">
              <Gauge
                value={totalRequests}
                max={Math.max(maxVolume, totalRequests)}
                color="#fdd835"
                unit=""
                centerText={`${(totalRequests >= 1000) ? Math.round(totalRequests/1000) + "k" : totalRequests}`}
                subText={`Avg/day: ${(Math.round((totalRequests/30) * 10) / 10)}`}
              />
            </div>
          </div>

          <div className="card">
            <div className="card-title">Error Rate</div>
            <div className="card-body">
              <Gauge
                value={Math.round(errorRate * 100) / 100}
                max={100}
                color="#d50000"
                unit="%"
                centerText={`${Math.round(errorRate * 100) / 100}%`}
                subText={`Most common: ${stats.mostCommonError ?? "N/A"}`}
              />
            </div>
          </div>
        </div>

        <div className="chart-wrapper">
          <div className="chart-header">
            <h2>Request Volume / Response Time (Last 12 Months)</h2>
          </div>

          <div className="area-chart-card">
            <AreaTrend data={monthlyData} />
          </div>
        </div>
      </main>
    </div>
  );
}
