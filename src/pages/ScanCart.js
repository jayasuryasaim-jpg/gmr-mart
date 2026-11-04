import React, { useState } from "react";
import QrScanner from "react-qr-scanner";
import { handleScanSuccess } from "../scannerUtils";

export default function ScanCart() {
  const [scanMessage, setScanMessage] = useState("Camera scanning depends on browser permission and HTTPS.");

  const onScan = (data) => {
    if (data) {
      setScanMessage(handleScanSuccess(data.text));
    }
  };

  const onError = (err) => console.error(err);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Scan Trolley QR</h1>
      <p role="status" aria-live="polite">{scanMessage}</p>
      
      {/* Live Camera Scanner */}
      <QrScanner
        delay={300}
        style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}
        onError={onError}
        onScan={onScan}
      />
      <p>Cart activation is unavailable until an authenticated trolley service is configured.</p>
    </div>
  );
}