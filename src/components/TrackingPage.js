import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import MapTerminal from "./MapTerminal";

// 🚀 PRO-LEVEL STYLES EMBEDDED DIRECTLY TO AVOID "MODULE NOT FOUND" ERRORS
const styles = {
  root: {
    minHeight: "100vh",
    backgroundColor: "#01080e",
    color: "#fff",
    fontFamily: "'Rajdhani', sans-serif",
    display: "flex",
    justifyContent: "center",
    padding: "40px 20px",
  },
  overlay: {
    width: "100%",
    maxWidth: "1000px",
    backgroundColor: "rgba(2, 13, 24, 0.9)",
    border: "1px solid rgba(0, 247, 255, 0.2)",
    padding: "40px",
    borderRadius: "4px",
  },
  glitchText: {
    fontFamily: "'Orbitron', sans-serif",
    fontSize: "24px",
    color: "#00f7ff",
    letterSpacing: "2px",
    margin: 0,
  },
  floorGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "30px",
    marginTop: "30px",
  },
  proBtn: {
    background: "rgba(10, 25, 41, 0.8)",
    border: "1px solid rgba(0, 247, 255, 0.3)",
    color: "#fff",
    padding: "15px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    transition: "0.3s",
  },
  entranceBtn: {
    marginTop: "40px",
    width: "100%",
    background: "transparent",
    border: "1px dashed #00ff88",
    color: "#00ff88",
    padding: "15px",
    fontFamily: "'Orbitron'",
    cursor: "pointer",
  }
};

const floors = {
  GROUND: ["G1", "G2", "G3", "G4"],
  FIRST: ["F1", "F2", "F3", "F4"],
  SECOND: ["S1", "S2", "S3", "S4"]
};

export default function TrackingPage() {
  const location = useLocation();
  const product = location.state?.product || { name: "GMR_ITEM", location: "G3", floor: "GROUND" };

  const [sourceRow, setSourceRow] = useState(null);
  const [transport, setTransport] = useState(null);

  const destRow = product.location;
  const destFloor = product.floor;

  const sameFloor = sourceRow && (
    sourceRow === "ENTRANCE" ? destFloor === "GROUND" : sourceRow[0] === destRow[0]
  );

  if (!sourceRow) {
    return (
      <div style={styles.root}>
        <div style={styles.overlay}>
          <div style={{borderLeft: "4px solid #00f7ff", paddingLeft: "20px"}}>
            <h2 style={styles.glitchText}>📍 NAV_SYSTEM_ACTIVE</h2>
            <p style={{color: "#8899aa", fontSize: "13px"}}>TARGET: {product.name} | ZONE: {destRow}</p>
          </div>

          <div style={styles.floorGrid}>
            {Object.keys(floors).map(floor => (
              <div key={floor}>
                <div style={{color: "#00f7ff", fontSize: "11px", marginBottom: "10px", fontFamily: "Orbitron"}}>{floor} LEVEL</div>
                <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px"}}>
                  {floors[floor].map(r => (
                    <button
                      key={r}
                      style={{...styles.proBtn, opacity: r === destRow ? 0.2 : 1}}
                      disabled={r === destRow}
                      onClick={() => setSourceRow(r)}
                    >
                      <span style={{fontFamily: "Orbitron", fontSize: "18px"}}>{r}</span>
                      <span style={{fontSize: "10px", opacity: 0.7}}>STATION</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button style={styles.entranceBtn} onClick={() => setSourceRow("ENTRANCE")}>
            START FROM MAIN ENTRANCE
          </button>
        </div>
      </div>
    );
  }

  // STEP 2: TRANSIT
  if (!sameFloor && !transport) {
    return (
      <div style={styles.root}>
        <div style={{...styles.overlay, textAlign: "center"}}>
            <h2 style={styles.glitchText}>TRANSIT_REQUIRED</h2>
            <div style={{display: "flex", justifyContent: "center", gap: "20px", marginTop: "30px"}}>
                <button onClick={() => setTransport("STAIRS")} style={styles.proBtn}>🪜 STAIRS</button>
                <button onClick={() => setTransport("LIFT")} style={styles.proBtn}>🛗 SMART_LIFT</button>
            </div>
        </div>
      </div>
    );
  }

  return (
    <MapTerminal
      sourceRow={sourceRow}
      destRow={destRow}
      sourceFloor={sourceRow === "ENTRANCE" || sourceRow.startsWith("G") ? "GROUND" : sourceRow.startsWith("F") ? "FIRST" : "SECOND"}
      destFloor={destFloor}
      transportType={transport}
    />
  );
}