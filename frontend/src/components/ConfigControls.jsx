import { useState } from "react";
import "../styles/ConfigControls.css";

export default function ConfigControls({ config, onSave, onClose }) {
  const [form, setForm] = useState({
    active: config.active,
    schedulingEnabled: config.scheduling?.enabled || false,
    startTime: config.scheduling?.startTime || "",
    endTime: config.scheduling?.endTime || "",
    requestLimit: config.requestLimit,
    rateUnit: config.rateUnit,
  });

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = () => {
    onSave(config._id, {
      ...config,
      active: form.active,
      scheduling: {
        enabled: form.schedulingEnabled,
        startTime: form.startTime,
        endTime: form.endTime,
      },
      requestLimit: form.requestLimit,
      rateUnit: form.rateUnit,
    });
    onClose();
  };

  return (
    <>
      {/* backdrop overlay */}
      <div className="config-overlay" onClick={onClose}></div>

      <div className="config-controls">
        <div className="controls-header">Controls</div>

        <div className="control-item">
          <label>API</label>
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => handleChange("active", e.target.checked)}
          />
        </div>

        <div className="control-item">
          <label>Limit</label>
          <input
            type="number"
            value={form.requestLimit}
            onChange={(e) => handleChange("requestLimit", e.target.value)}
          />
        </div>

        <div className="control-item">
          <label>Schedule On/Off</label>
          <input
            type="checkbox"
            checked={form.schedulingEnabled}
            onChange={(e) =>
              handleChange("schedulingEnabled", e.target.checked)
            }
          />
        </div>

        {form.schedulingEnabled && (
          <div className="time-inputs">
            <label>Start Time:</label>
            <input
              type="time"
              value={form.startTime}
              onChange={(e) => handleChange("startTime", e.target.value)}
            />
            <label>End Time:</label>
            <input
              type="time"
              value={form.endTime}
              onChange={(e) => handleChange("endTime", e.target.value)}
            />
          </div>
        )}

        <div className="controls-footer">
          <button onClick={handleSubmit} className="save-btn">
            Save
          </button>
          <button onClick={onClose} className="cancel-btn">
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}
