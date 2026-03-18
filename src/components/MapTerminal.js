import React from "react";

const floorConfig = {
  GROUND: { prefix: "G", x: 100 }, 
  FIRST: { prefix: "F", x: 450 },
  SECOND: { prefix: "S", x: 800 }
};

const styles = {
  wrapper: {
    backgroundColor: "#01080e",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "40px",
    color: "#fff",
  },
  svgContainer: {
    backgroundColor: "rgba(2, 13, 24, 0.8)",
    border: "1px solid #1a2a3a",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 0 40px rgba(0,0,0,0.8)"
  },
  header: {
    fontFamily: "'Orbitron', sans-serif",
    color: "#00f7ff",
    marginBottom: "20px",
    letterSpacing: "2px",
    textShadow: "0 0 10px rgba(0, 247, 255, 0.5)"
  }
};

const normalizeFloor = (floor) => {
  if (!floor) return "GROUND";
  const f = floor.toUpperCase();
  if (f.includes("GROUND")) return "GROUND";
  if (f.includes("FIRST")) return "FIRST";
  if (f.includes("SECOND")) return "SECOND";
  return "GROUND";
};

export default function MapTerminal({ sourceRow, destRow, sourceFloor, destFloor, transportType }) {
  if (!sourceRow || !destRow) return null;

  const safeSourceFloor = normalizeFloor(sourceFloor);
  const safeDestFloor = normalizeFloor(destFloor);

  const getRowY = (row) => {
    const num = parseInt(row.replace(/\D/g, "")); 
    return 380 - (num - 1) * 75;
  };

  const sX = floorConfig[safeSourceFloor].x;
  const dX = floorConfig[safeDestFloor].x;
  const sY = sourceRow === "ENTRANCE" ? 110 : getRowY(sourceRow);
  const dY = getRowY(destRow);
  const transitY = transportType === "LIFT" ? 385 : 135; 

  let pathPoints = safeSourceFloor === safeDestFloor 
    ? `${sX + 125},${sY} ${sX + 25},${sY} ${sX + 25},${dY} ${sX + 50},${dY}`
    : `${sX + 125},${sY} ${sX + 25},${sY} ${sX + 25},${transitY} ${dX + 25},${transitY} ${dX + 25},${dY} ${dX + 50},${dY}`;

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.header}>GMR_NAV_OS_V4.1_STABLE</h2>
      
      <div style={styles.svgContainer}>
        <svg width="1150" height="600" viewBox="0 0 1150 600">
          <defs>
            <filter id="neonGreen"><feGaussianBlur stdDeviation="2.5" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            <filter id="neonRed"><feGaussianBlur stdDeviation="2.5" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            <filter id="activeFloorGlow"><feGaussianBlur stdDeviation="10" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            <filter id="transitGlow"><feGaussianBlur stdDeviation="5" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            {/* Added filter for the building perimeter glow */}
            <filter id="buildingGlow"><feGaussianBlur stdDeviation="4" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          </defs>

          {/* New Dotted Building Perimeter Highlight */}
          <rect x="30" y="30" width="1090" height="540" rx="15" fill="none" 
                stroke="#ff00ff" strokeWidth="3" strokeDasharray="15,10" 
                filter="url(#buildingGlow)" opacity="0.6" />

          {Object.keys(floorConfig).map(floor => {
            const { prefix, x } = floorConfig[floor];
            const isFloorActive = floor === safeSourceFloor || floor === safeDestFloor;

            return (
              <g key={floor}>
                <rect x={x} y="80" width="250" height="380" rx="10" 
                    fill={isFloorActive ? "rgba(0, 247, 255, 0.05)" : "#0a1520"} 
                    stroke={isFloorActive ? "#00f7ff" : "#1a2a3a"} 
                    strokeWidth={isFloorActive ? "3" : "2"} 
                    filter={isFloorActive ? "url(#activeFloorGlow)" : "none"}
                />
                <text x={x + 125} y="50" textAnchor="middle" fill={isFloorActive ? "#00f7ff" : "#556677"} style={{fontFamily: 'Orbitron', fontSize: '14px', fontWeight: 'bold'}}>{floor} LEVEL</text>

                {((floor === "GROUND") || (floor === "FIRST")) && (
                  <g>
                    <rect x={x + 250} y="110" width="100" height="50" fill={transportType === "STAIRS" ? "rgba(247, 255, 0, 0.1)" : "rgba(0, 247, 255, 0.02)"} stroke={transportType === "STAIRS" ? "#f7ff00" : "#00f7ff"} strokeWidth={transportType === "STAIRS" ? "3" : "1"} strokeDasharray={transportType === "STAIRS" ? "0" : "4"} filter={transportType === "STAIRS" ? "url(#transitGlow)" : "none"} />
                    <text x={x + 300} y="140" textAnchor="middle" fill={transportType === "STAIRS" ? "#f7ff00" : "#00f7ff"} style={{fontSize: '9px', fontFamily: 'Orbitron', fontWeight: transportType === "STAIRS" ? 'bold' : 'normal'}}>STAIRS</text>
                    <rect x={x + 250} y="360" width="100" height="50" fill={transportType === "LIFT" ? "rgba(247, 255, 0, 0.1)" : "rgba(0, 247, 255, 0.02)"} stroke={transportType === "LIFT" ? "#f7ff00" : "#00f7ff"} strokeWidth={transportType === "LIFT" ? "3" : "1"} strokeDasharray={transportType === "LIFT" ? "0" : "4"} filter={transportType === "LIFT" ? "url(#transitGlow)" : "none"} />
                    <text x={x + 300} y="390" textAnchor="middle" fill={transportType === "LIFT" ? "#f7ff00" : "#00f7ff"} style={{fontSize: '9px', fontFamily: 'Orbitron', fontWeight: transportType === "LIFT" ? 'bold' : 'normal'}}>LIFT</text>
                  </g>
                )}

                {floor === "GROUND" && (
                  <>
                    <rect x={x + 75} y="85" width="100" height="25" rx="4" fill="#003322" stroke="#00ff88" filter="url(#neonGreen)" />
                    <text x={x + 125} y="102" textAnchor="middle" fill="#fff" style={{fontSize: '9px', fontWeight: 'bold'}}>ENTRANCE</text>
                    <rect x={x + 75} y="435" width="100" height="25" rx="4" fill="#331111" stroke="#ff3b3b" filter="url(#neonRed)" />
                    <text x={x + 125} y="452" textAnchor="middle" fill="#fff" style={{fontSize: '9px', fontWeight: 'bold'}}>EXIT_GATE</text>
                  </>
                )}

                {floor === "FIRST" && (
                  <>
                    <rect x={x + 75} y="85" width="100" height="25" rx="4" fill="#162447" stroke="#00f7ff" />
                    <text x={x + 125} y="102" textAnchor="middle" fill="#fff" style={{fontSize: '8px'}}>TRIAL_ROOM (M)</text>
                    <rect x={x + 75} y="435" width="100" height="25" rx="4" fill="#162447" stroke="#00f7ff" />
                    <text x={x + 125} y="452" textAnchor="middle" fill="#fff" style={{fontSize: '8px'}}>TRIAL_ROOM (W)</text>
                  </>
                )}

                {[4, 3, 2, 1].map(i => {
                  const rowName = prefix + i;
                  const rowY = getRowY(rowName);
                  const isSource = rowName === sourceRow;
                  const isDest = rowName === destRow;
                  return (
                    <g key={rowName}>
                      <rect x={x + 50} y={rowY - 25} width="150" height="50" rx="4" fill={isSource ? "#003322" : isDest ? "#331111" : "#111c28"} stroke={isSource ? "#00ff88" : isDest ? "#ff3b3b" : "#1e3a5a"} strokeWidth="2" filter={isSource ? "url(#neonGreen)" : isDest ? "url(#neonRed)" : "none"} />
                      <text x={x + 125} y={rowY + 5} textAnchor="middle" fill="#fff" style={{fontSize: '14px', fontWeight: 'bold', fontFamily: 'Orbitron'}}>{rowName}</text>
                    </g>
                  );
                })}
              </g>
            );
          })}

          <polyline points={pathPoints} fill="none" stroke="#f7ff00" strokeWidth="3" strokeDasharray="8,4" style={{ filter: "drop-shadow(0 0 8px #f7ff00)" }}>
            <animate attributeName="stroke-dashoffset" from="100" to="0" dur="1.5s" repeatCount="indefinite" />
          </polyline>
        </svg>
      </div>
    </div>
  );
}