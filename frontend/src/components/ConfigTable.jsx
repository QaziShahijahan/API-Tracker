import { useState } from "react";
import ConfigControls from "./ConfigControls";
import "../styles/ConfigTable.css";

export default function ConfigTable({ configs, onUpdate }) {
  const [selectedId, setSelectedId] = useState(null);

  return (
    <div className="config-table">
      <div className="table-header">
        <span>API Name</span>
        <span>Start Date</span>
        <span></span>
      </div>

      {configs.map((c) => (
        <div key={c._id} className="table-row">
          <span>{c.endpointName}</span>
          <span>{new Date(c.startDate).toISOString().split("T")[0]}</span>
          <span className="menu-cell">
            <button
              className="dots-btn"
              onClick={() =>
                setSelectedId(selectedId === c._id ? null : c._id)
              }
            >
              ⋮
            </button>
            {selectedId === c._id && (
              <ConfigControls config={c} onSave={onUpdate} onClose={() => setSelectedId(null)} />
            )}
          </span>
        </div>
      ))}
    </div>
  );
}
