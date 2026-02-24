import { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useNavigate } from "react-router-dom";
import "./ScanCart.css";

function ScanCart() {
  const navigate = useNavigate();

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0 
      },
      false
    );

    scanner.render(
      (decodedText) => {
        console.log("Scanned:", decodedText);
        localStorage.setItem("cartId", decodedText);
        
        scanner.clear().then(() => {
            navigate("/control-cart"); // Matches App.js route
        }).catch(err => console.error(err));
      },
      (error) => {
        // Silently ignore scan errors to avoid console spam
      }
    );

    return () => {
      scanner.clear().catch((error) => console.error("Scanner cleanup failed", error));
    };
  }, [navigate]);

  return (
    <div className="scan-wrapper">
      <h1 className="main-title">CAMERA SCANNER</h1>
      <div className="scanner-container">
        <div id="reader"></div>
      </div>
      <p className="tagline">Align the QR code within the frame</p>
    </div>
  );
}

export default ScanCart;