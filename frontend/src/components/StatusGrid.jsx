import "../styles/StatusGrid.css";

export default function StatusGrid({ apis }) {
  return (
    <div className="status-grid">
      {apis.map((api, index) => (
        <div key={index} className="api-row">
          <div className="api-name">{index + 1}. {api.endpointName}</div>
          <div className="api-status">
            {api.logs.map((log, i) => {
              let statusClass = "green"; // default

              if (log.statusCode >= 200 && log.statusCode < 300) {
                statusClass = "green";
              } else if (log.statusCode >= 300 && log.statusCode < 400) {
                statusClass = "orange";
              } else if (log.statusCode >= 400 && log.statusCode < 600) {
                statusClass = "red";
              } else if (log.statusCode >= 100 && log.statusCode < 200) {
                statusClass = "yellow";
              }

              return <span key={i} className={`status-dot ${statusClass}`}></span>;
            })}
          </div>
          <div className="api-indicator">
            {api.latestStatus === "green" && <span className="tick">✔</span>}
            {api.latestStatus === "red" && <span className="cross">✖</span>}
            {api.latestStatus === "orange" && <span className="warn">⚠</span>}
            {api.latestStatus === "yellow" && <span className="info">ℹ</span>}
          </div>
        </div>
      ))}
    </div>
  );
}
