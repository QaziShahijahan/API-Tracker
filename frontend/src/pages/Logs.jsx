import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import LogCard from "../components/LogCard";
import api from "../services/api";
import "../styles/Logs.css";

export default function Logs() {
  const [logsByDate, setLogsByDate] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get("/tracer/logs", {
          params: { page: 1, pageSize: 50 }
        });

        const logs = res.data.data || [];

        // Group logs by day (Today, Yesterday, or Date)
        const grouped = {};
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();

        logs.forEach((log) => {
          const logDate = new Date(log.timestamp).toDateString();

          let label;
          if (logDate === today) label = "Today";
          else if (logDate === yesterday) label = "Yesterday";
          else label = logDate;

          if (!grouped[label]) grouped[label] = [];
          grouped[label].push(log);
        });

        setLogsByDate(grouped);
      } catch (err) {
        console.error("Error fetching logs", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="logs-container">
      <Sidebar />
      <main className="logs-main">
        <h1>API Trace Logs</h1>

        {Object.keys(logsByDate).map((date) => (
          <div key={date} className="log-group">
            <h2 className="log-date">{date}</h2>
            {logsByDate[date].map((log) => (
              <LogCard key={log._id} log={log} />
            ))}
          </div>
        ))}
      </main>
    </div>
  );
}
