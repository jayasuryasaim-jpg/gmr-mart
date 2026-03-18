import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import QrScanner from "react-qr-scanner";
import { handleScanSuccess } from "./scannerUtils";

export default function ScanCart() {
  const navigate = useNavigate();
  const fileRef = useRef(null); // Reference for the hidden file input

  const onScan = (data) => {
    if (data) {
      handleScanSuccess(data.text, navigate);
    }
  };

  const onError = (err) => console.error(err);

  // Handle image file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a URL for the file to scan
      const reader = new FileReader();
      reader.onload = (event) => {
        // Here you would typically use a library like 'jsqr' 
        // to decode the image data directly
        console.log("File loaded for scanning:", event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Scan Trolley QR</h1>
      
      {/* Live Camera Scanner */}
      <QrScanner
        delay={300}
        style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}
        onError={onError}
        onScan={onScan}
      />

      <div style={{ marginTop: '20px' }}>
        <p>OR</p>
        {/* Hidden file input triggered by custom button */}
        <input 
          type="file" 
          ref={fileRef} 
          style={{ display: 'none' }} 
          accept="image/*" 
          onChange={handleFileChange} 
        />
        <button 
          className="pro-btn" 
          onClick={() => fileRef.current.click()}
        >
          CHOOSE FROM GALLERY
        </button>
      </div>
    </div>
  );
}