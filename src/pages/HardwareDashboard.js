import React, { useEffect, useMemo, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { apiRequest, jsonBody } from "../services/api";
import "./HardwareDashboard.css";

const scenarios = [
  { value: "guided-tour", label: "Guided store tour" },
  { value: "rfid-invalid-tag", label: "RFID: invalid test tag" },
  { value: "weight-increase", label: "Weight: increase" },
  { value: "weight-decrease", label: "Weight: decrease" },
  { value: "ir-entry-exit", label: "IR entry / exit trigger" },
  { value: "ultrasonic-distance", label: "Ultrasonic distance change" },
  { value: "battery-warning", label: "Battery warning" },
  { value: "enter-zone", label: "Trolley enters next zone" },
  { value: "stop-cart", label: "Trolley stop" },
  { value: "motor-forward-command", label: "Motor: simulate forward command" },
  { value: "motor-reverse-command", label: "Motor: simulate reverse command" },
  { value: "communication-timeout", label: "Communication timeout" },
  { value: "device-disconnected", label: "Device disconnect" },
  { value: "device-reconnected", label: "Device reconnect" },
];
const zones = ["Entrance", "Aisle A", "Aisle B", "Produce", "Checkout"];

function requireArrayResponse(result, property, label) {
  if (!result || !Array.isArray(result[property]) || result[property].some((row) => (
    !row || typeof row !== "object" || Array.isArray(row) || typeof row.id !== "string" || !row.id
  ))) {
    throw new Error(`The server returned an invalid ${label} response.`);
  }
  return result[property];
}

function StoreMap({ selectedCart }) {
  const zoneIndex = Math.max(0, zones.indexOf(selectedCart?.zone));
  return (
    <section className="hardware-card map-card">
      <div className="hardware-card-heading">
        <div><p className="hardware-eyebrow">DEMONSTRATION ONLY</p><h2>Simulated store map</h2></div>
        <span className="hardware-state">FICTIONAL STORE</span>
      </div>
      <div className="simulated-map" role="img" aria-label="Fictional simulated store map with entrance, aisles, produce, and checkout">
        {zones.map((zone, index) => (
          <div className={`map-zone ${zone === selectedCart?.zone ? "map-zone-active" : ""}`} key={zone}>
            <span>{zone}</span>
            {index === zoneIndex && selectedCart && <strong aria-label="Selected simulated cart">CART</strong>}
          </div>
        ))}
      </div>
      <p className="hardware-footnote">Cart positions are simulation data. No GPS, browser location, or third-party maps are used.</p>
    </section>
  );
}

export default function HardwareDashboard() {
  const [carts, setCarts] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [filterMode, setFilterMode] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [scenario, setScenario] = useState(scenarios[0].value);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [cartsError, setCartsError] = useState("");
  const [notice, setNotice] = useState("");
  const [readiness, setReadiness] = useState(null);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsError, setEventsError] = useState("");
  const eventsRequestId = useRef(0);

  const loadEvents = async (cartId) => {
    const requestId = ++eventsRequestId.current;
    setEvents([]);
    setEventsError("");
    if (!cartId) {
      setEventsLoading(false);
      return;
    }
    setEventsLoading(true);
    try {
      const result = await apiRequest(`/api/v1/admin/hardware/carts/${cartId}/events`);
      const rows = requireArrayResponse(result, "events", "cart events");
      if (requestId === eventsRequestId.current) setEvents(rows);
    } catch (requestError) {
      if (requestId === eventsRequestId.current) {
        setEventsError(requestError.message);
        setError(requestError.message);
      }
    } finally {
      if (requestId === eventsRequestId.current) setEventsLoading(false);
    }
  };

  const refresh = async (cartId = selectedId) => {
    const result = await apiRequest("/api/v1/admin/hardware/carts");
    const rows = requireArrayResponse(result, "carts", "cart list");
    setCarts(rows);
    const nextId = cartId && rows.some((cart) => cart.id === cartId)
      ? cartId
      : rows[0]?.id ?? "";
    setSelectedId(nextId);
    await loadEvents(nextId);
  };

  useEffect(() => {
    let active = true;
    let loadingPhase = "cart list";
    apiRequest("/api/v1/admin/hardware/carts")
      .then(async (result) => {
        const rows = requireArrayResponse(result, "carts", "cart list");
        if (!active) return;
        setCarts(rows);
        const firstId = rows[0]?.id ?? "";
        setSelectedId(firstId);
        loadingPhase = "cart events";
        if (active) await loadEvents(firstId);
      })
      .catch((requestError) => {
        if (active) {
          setError(requestError.message);
          if (loadingPhase === "cart list") setCartsError(requestError.message);
          else setEventsError(requestError.message);
        }
      })
      .finally(() => { if (active) setLoading(false); });
    apiRequest("/api/v1/admin/operations/readiness")
      .then((result) => { if (active) setReadiness(result); })
      .catch((requestError) => {
        if (active) setReadiness({ status: "unavailable", message: requestError.message });
      });
    return () => {
      active = false;
      eventsRequestId.current += 1;
    };
  }, []);

  const visibleCarts = useMemo(() => carts.filter((cart) => (
    (filterMode === "all" || cart.mode === filterMode)
    && (filterStatus === "all" || cart.status === filterStatus)
    && `${cart.id} ${cart.cartCode ?? cart.displayName ?? ""}`.toLowerCase().includes(search.trim().toLowerCase())
  )), [carts, filterMode, filterStatus, search]);
  const selectedCart = carts.find((cart) => cart.id === selectedId);
  const metrics = {
    total: carts.length,
    active: carts.filter((cart) => cart.mode === "simulation" && cart.status === "active").length,
    disabled: carts.filter((cart) => cart.status === "disabled").length,
    scans: carts.reduce((total, cart) => total + (cart.rfidScans ?? 0), 0),
    alerts: carts.reduce((total, cart) => total + (cart.sensorAlerts ?? 0), 0),
    battery: carts.filter((cart) => cart.batteryPercent != null && cart.batteryPercent < (cart.batteryWarningPercent ?? 20)).length,
  };

  const runAction = async (action) => {
    if (!selectedId) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const result = await apiRequest(`/api/v1/admin/hardware/carts/${selectedId}/simulation`, {
        method: "POST",
        body: jsonBody({ action, scenario }),
      });
      if (result.cart) {
        setCarts((current) => current.map((cart) => cart.id === selectedId ? result.cart : cart));
      }
      await refresh(selectedId);
      setNotice("Simulation event recorded. It did not change authoritative stock or orders.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  const addCart = async () => {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const result = await apiRequest("/api/v1/admin/hardware/carts", {
        method: "POST",
        body: jsonBody({ mode: "simulation" }),
      });
      await refresh(result.cart.id);
      setNotice("Simulation cart registered. Its QR identity does not authorize payment or customer access.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="hardware-page">
      <header className="hardware-header">
        <div>
          <p className="hardware-eyebrow">OPERATIONS / SIMULATION</p>
          <h1>Smart cart simulator</h1>
          <p>Controlled, deterministic demonstration events only. Simulated readings are never presented as live hardware data.</p>
        </div>
        <button type="button" className="hardware-button primary" onClick={addCart} disabled={busy}>Register simulation cart</button>
      </header>
      {error && <p className="hardware-alert" role="alert">{error}</p>}
      {notice && <p className="hardware-notice" role="status">{notice}</p>}
      {loading ? <p role="status">Loading registered carts…</p> : (
        <>
          <section className="hardware-metrics" aria-label="Simulation dashboard summary">
            {[
              ["Registered carts", metrics.total],
              ["Simulated active", metrics.active],
              ["Disabled", metrics.disabled],
              ["Simulated RFID scans", metrics.scans],
              ["Sensor alerts", metrics.alerts],
              ["Battery warnings", metrics.battery],
            ].map(([label, value]) => <article className="metric-card" key={label}><span>{label}</span><strong>{value}</strong></article>)}
          </section>
          <section className="hardware-toolbar" aria-label="Cart filters">
            <label>Mode<select value={filterMode} onChange={(event) => setFilterMode(event.target.value)}><option value="all">All modes</option><option value="simulation">Simulation</option><option value="live">Live</option></select></label>
            <label>Status<select value={filterStatus} onChange={(event) => setFilterStatus(event.target.value)}><option value="all">All statuses</option><option value="active">Active</option><option value="paused">Paused</option><option value="disabled">Disabled</option><option value="disconnected">Disconnected</option></select></label>
            <label>Cart ID<input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search registered carts" /></label>
          </section>
          {cartsError ? <section className="hardware-card"><h2>Cart data unavailable</h2><p>Registered carts could not be loaded.</p></section> : visibleCarts.length === 0 ? (
            <section className="hardware-card"><h2>No registered carts</h2><p>Register a simulation cart to begin with labeled test events.</p></section>
          ) : (
            <div className="hardware-dashboard-grid">
              <section className="hardware-card">
                <div className="hardware-card-heading"><div><p className="hardware-eyebrow">REGISTERED DEVICES</p><h2>Cart fleet</h2></div><span className="hardware-state">SIMULATION DATA</span></div>
                <div className="cart-list">
                  {visibleCarts.map((cart) => (
                    <button type="button" className={`cart-row ${selectedId === cart.id ? "cart-row-selected" : ""}`} key={cart.id} onClick={async () => {
                      setSelectedId(cart.id);
                      await loadEvents(cart.id);
                    }}>
                      <span><strong>{cart.cartCode || cart.displayName || cart.id}</strong><small>{cart.qrIdentity || cart.qrPreview || "QR identity pending"} · {cart.mode}</small></span>
                      <span className="cart-status">{cart.status}</span>
                    </button>
                  ))}
                </div>
              </section>
              {selectedCart && (
                <section className="hardware-card">
                  <div className="hardware-card-heading"><div><p className="hardware-eyebrow">{selectedCart.mode?.toUpperCase()} CART</p><h2>{selectedCart.cartCode || selectedCart.displayName || selectedCart.id}</h2></div><span className="hardware-state">{selectedCart.status}</span></div>
                  <dl className="cart-readings">
                    <div><dt>QR identity</dt><dd>{selectedCart.qrIdentity || selectedCart.qrPreview || "Not assigned"}</dd></div>
                    <div><dt>Simulated zone</dt><dd>{selectedCart.zone || "Entrance"}</dd></div>
                    <div><dt>Battery</dt><dd>{selectedCart.batteryPercent == null ? "Not available" : `${selectedCart.batteryPercent}%`}</dd></div>
                    <div><dt>Weight</dt><dd>{selectedCart.weightGrams == null ? "Not available" : `${selectedCart.weightGrams} g (simulated)`}</dd></div>
                    <div><dt>RFID scan events</dt><dd>{selectedCart.rfidScans ?? 0} (simulated)</dd></div>
                    <div><dt>Sensors / motor</dt><dd>{selectedCart.sensorStatus || "Idle"} / {selectedCart.motorState || "Stopped"}</dd></div>
                    <div><dt>Last event</dt><dd>{selectedCart.lastEventAt ? new Date(selectedCart.lastEventAt).toLocaleString() : "No events"}</dd></div>
                  </dl>
                  {(selectedCart.qrPreview || selectedCart.qrIdentity) && (
                    <div className="qr-preview">
                      <QRCodeSVG value={selectedCart.qrPreview || selectedCart.qrIdentity} size={112} level="M" />
                      <div>
                        <strong>Simulation QR preview</strong>
                        <p>This registered-cart identity is for demonstration only. It does not authorize payment or customer access.</p>
                      </div>
                    </div>
                  )}
                  <StoreMap selectedCart={selectedCart} />
                  <div className="sim-controls">
                    <label>Controlled scenario<select value={scenario} onChange={(event) => setScenario(event.target.value)}>{scenarios.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
                    <div className="hardware-actions">
                      {["start", "pause", "reset"].map((action) => (
                        <button type="button" key={action} className={`hardware-button ${action === "start" ? "primary" : "secondary"}`} disabled={busy} onClick={() => runAction(action)}>
                          {busy ? "Working…" : action[0].toUpperCase() + action.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <p className="hardware-footnote">Motor state is simulation-only and defaults to stopped. No movement command is sent to a device.</p>
                </section>
              )}
              <section className="hardware-card event-card">
                <div className="hardware-card-heading"><div><p className="hardware-eyebrow">AUDITABLE DEMONSTRATION EVENTS</p><h2>Recent activity</h2></div><span className="hardware-state">TEST DATA</span></div>
                {eventsLoading ? <p role="status">Loading simulation events…</p> : eventsError ? <p role="alert">Unable to load simulation events.</p> : events.length === 0 ? <p>No simulation events recorded for this cart.</p> : (
                  <ol className="event-list">
                    {events.map((event) => <li key={event.id}><div><strong>{event.label || event.type}</strong><small>{new Date(event.timestamp).toLocaleString()}</small></div><span>{event.simulation ? "SIMULATED" : "LIVE EVENT"}</span></li>)}
                  </ol>
                )}
              </section>
            </div>
          )}
          <div className="adapter-readiness">
            <strong>API readiness:</strong> {readiness?.status === "ready" ? "PostgreSQL connected; migrations current." : readiness?.status === "degraded" ? "Database or migrations are not ready." : readiness?.message ?? "Checking PostgreSQL readiness…"}
            {" "}· <strong>Adapter readiness:</strong> Future live adapters are not configured. All dashboard values are marked simulation data.
          </div>
        </>
      )}
    </main>
  );
}
