// src/components/LogCard.jsx
import "../styles/LogCard.css";

export default function LogCard({ log }) {
  return (
    <div className="log-card">
      <div className="log-header">
        <span className="trace-id">[{log.traceId}]</span>
        <span className={`http-method ${log.method?.toLowerCase()}`}>{log.method}</span>
        <span className="path">{log.path}</span>
        <span className={`status-code sc-${Math.floor(log.statusCode/100)}xx`}>
          {log.statusCode}
        </span>
        <span className="resp-time">{log.responseTimeMs} ms</span>
      </div>

      <div className="log-body">
        {log.consoleLogs?.map((c, i) => (
          <p key={i} className={`console-${c.level}`}>
            [{c.level.toUpperCase()}] {c.message}
          </p>
        ))}
      </div>

      <div className="log-footer">
        <span className="timestamp">
          {new Date(log.timestamp).toLocaleString()}
        </span>
      </div>
    </div>
  );
}
