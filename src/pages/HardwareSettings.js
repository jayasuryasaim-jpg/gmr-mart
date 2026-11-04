import React, { useEffect, useState } from "react";
import { apiRequest, jsonBody } from "../services/api";
import "./HardwareDashboard.css";

const devices = [
  {
    type: "esp32",
    title: "ESP32 cart controller",
    description: "Controller identity and future command transport.",
    fields: [
      ["protocol", "Protocol", "select", ["https", "mqtt"]],
      ["host", "Host / IP", "text"],
      ["port", "Port", "number"],
      ["timeoutMs", "Communication timeout (ms)", "number"],
      ["retryLimit", "Retry count", "number"],
      ["heartbeatIntervalMs", "Heartbeat interval (ms)", "number"],
      ["telemetryIntervalMs", "Telemetry interval (ms)", "number"],
      ["firmwareChannel", "Firmware channel", "select", ["stable", "beta"]],
    ],
  },
  {
    type: "rc522",
    title: "RC522 RFID reader",
    description: "Reader model and scan timing; no real scans are generated here.",
    fields: [
      ["readerType", "Reader type", "select", ["RC522"]],
      ["readTimeoutMs", "Read timeout (ms)", "number"],
      ["retryLimit", "Retry count", "number"],
      ["scanIntervalMs", "Scan interval (ms)", "number"],
      ["duplicateWindowMs", "Duplicate window (ms)", "number"],
    ],
  },
  {
    type: "qr",
    title: "QR and trolley identity",
    description: "Registry identity used to prepare QR previews for a registered cart.",
    fields: [
      ["cartCode", "Human-readable cart code", "text"],
      ["identityFormat", "QR identity format", "select", ["opaque-token"]],
    ],
  },
  {
    type: "hx711",
    title: "HX711 weight sensor",
    description: "Calibration settings only; simulated weight never changes inventory.",
    fields: [
      ["calibrationFactor", "Calibration factor", "number"],
      ["calibrationOffsetGrams", "Zero offset (g)", "number"],
      ["sampleRateHz", "Sample rate (Hz)", "number"],
      ["sampleIntervalMs", "Sample interval (ms)", "number"],
      ["toleranceGrams", "Weight tolerance (g)", "number"],
    ],
  },
  {
    type: "ir",
    title: "IR entry / exit sensors",
    description: "Configure future sensor debounce and signal polarity.",
    fields: [
      ["debounceMs", "Debounce (ms)", "number"],
      ["activeLow", "Active-low signal", "checkbox"],
      ["sampleIntervalMs", "Sample interval (ms)", "number"],
    ],
  },
  {
    type: "ultrasonic",
    title: "Ultrasonic distance sensor",
    description: "Distance bounds for future obstacle sensing.",
    fields: [
      ["minimumDistanceCm", "Minimum distance (cm)", "number"],
      ["maximumDistanceCm", "Maximum distance (cm)", "number"],
      ["warningDistanceCm", "Warning distance (cm)", "number"],
      ["sampleIntervalMs", "Sample interval (ms)", "number"],
      ["timeoutMs", "Read timeout (ms)", "number"],
    ],
  },
  {
    type: "motor",
    title: "Motor driver",
    description: "Configuration only. Commands are simulated and cannot move a physical cart.",
    fields: [
      ["driverType", "Driver type", "select", ["L298N", "TB6612FNG", "unconfigured"]],
      ["maximumSpeedPercent", "Maximum speed (%)", "number"],
      ["defaultCommand", "Default command", "select", ["stop"]],
      ["rampDurationMs", "Ramp duration (ms)", "number"],
      ["commandTimeoutMs", "Command timeout (ms)", "number"],
    ],
  },
  {
    type: "battery",
    title: "Battery and power",
    description: "Warning thresholds for simulated battery indicators.",
    fields: [
      ["warningPercent", "Warning threshold (%)", "number"],
      ["criticalPercent", "Critical threshold (%)", "number"],
      ["nominalVoltage", "Nominal voltage (V)", "number"],
      ["sampleIntervalMs", "Sample interval (ms)", "number"],
    ],
  },
  {
    type: "network",
    title: "Network communication",
    description: "Transport preferences; do not enter private credentials here.",
    fields: [
      ["protocol", "Protocol", "select", ["https", "mqtt"]],
      ["heartbeatIntervalMs", "Heartbeat interval (ms)", "number"],
      ["timeoutMs", "Communication timeout (ms)", "number"],
      ["retryLimit", "Retry count", "number"],
    ],
  },
  {
    type: "camera",
    title: "Camera (future integration)",
    description: "Placeholder settings only; this module does not request camera access.",
    fields: [
      ["cameraType", "Camera type", "select", ["not-configured", "usb", "network"]],
      ["resolution", "Resolution", "select", ["low", "medium", "high"]],
      ["frameRate", "Frame rate (FPS)", "number"],
      ["motionDetection", "Motion detection", "checkbox"],
    ],
  },
];

function defaults(device) {
  return {
    deviceType: device.type,
    displayName: device.title,
    deviceId: "",
    enabled: false,
    mode: "simulation",
    settings: {},
  };
}

function DeviceField({ field, value, onChange }) {
  const [key, label, type, options] = field;
  const inputId = `${key}-${label.replaceAll(" ", "-")}`;
  if (type === "checkbox") {
    return (
      <label className="hardware-toggle" htmlFor={inputId}>
        <input id={inputId} type="checkbox" checked={Boolean(value)} onChange={(event) => onChange(key, event.target.checked)} />
        <span>{label}</span>
      </label>
    );
  }
  return (
    <label className="hardware-field" htmlFor={inputId}>
      <span>{label}</span>
      {type === "select" ? (
        <select id={inputId} value={value ?? options[0]} onChange={(event) => onChange(key, event.target.value)}>
          {options.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      ) : (
        <input
          id={inputId}
          type={type}
          min={type === "number" ? "0" : undefined}
          value={value ?? ""}
          onChange={(event) => onChange(key, type === "number" ? Number(event.target.value) : event.target.value)}
        />
      )}
    </label>
  );
}

export default function HardwareSettings() {
  const [configurations, setConfigurations] = useState({});
  const [drafts, setDrafts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState("");

  useEffect(() => {
    let active = true;
    apiRequest("/api/v1/admin/hardware/configurations")
      .then(({ configurations: rows }) => {
        if (!active) return;
        const saved = Object.fromEntries(rows.map((row) => [row.deviceType, row]));
        setConfigurations(saved);
        setDrafts(Object.fromEntries(devices.map((device) => [
          device.type,
          { ...defaults(device), ...saved[device.type], settings: { ...saved[device.type]?.settings } },
        ])));
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const updateDraft = (deviceType, update) => {
    setDrafts((current) => ({ ...current, [deviceType]: { ...current[deviceType], ...update } }));
  };

  const updateSetting = (deviceType, key, value) => {
    setDrafts((current) => ({
      ...current,
      [deviceType]: {
        ...current[deviceType],
        settings: { ...current[deviceType].settings, [key]: value },
      },
    }));
  };

  const save = async (deviceType) => {
    setSaving(deviceType);
    setError("");
    setNotice("");
    try {
      const saved = await apiRequest(`/api/v1/admin/hardware/configurations/${deviceType}`, {
        method: "PUT",
        body: jsonBody(drafts[deviceType]),
      });
      setConfigurations((current) => ({ ...current, [deviceType]: saved.configuration }));
      setDrafts((current) => ({ ...current, [deviceType]: saved.configuration }));
      setNotice(`${devices.find((device) => device.type === deviceType).title} settings saved.`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving("");
    }
  };

  const cancel = (deviceType) => {
    const saved = configurations[deviceType];
    setDrafts((current) => ({
      ...current,
      [deviceType]: saved
        ? { ...saved, settings: { ...saved.settings } }
        : defaults(devices.find((device) => device.type === deviceType)),
    }));
  };

  return (
    <main className="hardware-page">
      <header className="hardware-header">
        <div>
          <p className="hardware-eyebrow">OPERATIONS / CONFIGURATION</p>
          <h1>Hardware integration</h1>
          <p>Prepare device profiles for future integration. Simulation mode does not connect to physical hardware.</p>
        </div>
        <span className="hardware-mode-badge">LIVE ADAPTERS NOT CONFIGURED</span>
      </header>
      {error && <p className="hardware-alert" role="alert">{error}</p>}
      {notice && <p className="hardware-notice" role="status">{notice}</p>}
      {loading ? <p role="status">Loading hardware profiles…</p> : (
        <section className="hardware-grid" aria-label="Hardware configuration sections">
          {devices.map((device) => {
            const draft = drafts[device.type] ?? defaults(device);
            return (
              <article className="hardware-card" key={device.type}>
                <div className="hardware-card-heading">
                  <div>
                    <p className="hardware-eyebrow">{device.type.toUpperCase()}</p>
                    <h2>{device.title}</h2>
                  </div>
                  <span className={`hardware-state ${draft.enabled ? "is-enabled" : ""}`}>
                    {draft.enabled ? "Enabled" : "Disabled"}
                  </span>
                </div>
                <p className="hardware-description">{device.description}</p>
                <div className="hardware-form-grid">
                  <label className="hardware-field">
                    <span>Display name</span>
                    <input value={draft.displayName} maxLength="80" onChange={(event) => updateDraft(device.type, { displayName: event.target.value })} />
                  </label>
                  <label className="hardware-field">
                    <span>Device ID</span>
                    <input value={draft.deviceId ?? ""} maxLength="80" placeholder="Optional in simulation mode" onChange={(event) => updateDraft(device.type, { deviceId: event.target.value })} />
                  </label>
                  <label className="hardware-field">
                    <span>Integration mode</span>
                    <select value={draft.mode} onChange={(event) => updateDraft(device.type, { mode: event.target.value })}>
                      <option value="simulation">Simulation</option>
                      <option value="live">Live (not configured)</option>
                    </select>
                  </label>
                  {device.fields.map((field) => (
                    <DeviceField
                      key={field[0]}
                      field={field}
                      value={draft.settings?.[field[0]]}
                      onChange={(key, value) => updateSetting(device.type, key, value)}
                    />
                  ))}
                  <label className="hardware-toggle">
                    <input type="checkbox" checked={Boolean(draft.enabled)} onChange={(event) => updateDraft(device.type, { enabled: event.target.checked })} />
                    <span>Device profile enabled</span>
                  </label>
                </div>
                <p className="hardware-footnote">
                  Status: {draft.mode === "live" ? "Integration unavailable — no live adapter is configured." : "Simulation profile — no physical device connection."}
                  {draft.updatedAt ? ` Last saved ${new Date(draft.updatedAt).toLocaleString()}.` : ""}
                </p>
                <div className="hardware-actions">
                  <button type="button" className="hardware-button secondary" onClick={() => cancel(device.type)} disabled={saving === device.type}>Cancel</button>
                  <button type="button" className="hardware-button primary" onClick={() => save(device.type)} disabled={saving === device.type}>
                    {saving === device.type ? "Saving…" : "Save settings"}
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}
