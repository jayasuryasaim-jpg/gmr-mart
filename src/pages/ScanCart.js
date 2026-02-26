import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useNavigate } from "react-router-dom";
import "./ScanCart.css";

function ScanCart() {
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader", { fps: 10, qrbox: 250, aspectRatio: 1.0 }, false
    );

    scanner.render(async (decodedText) => {
      if (decodedText !== "GMR_SECURE_CART_01") {
        alert("❌ Invalid Hardware Token!");
        return;
      }

      setIsVerifying(true);
      try {
        const res = await fetch("/api/hardware-status");
        const data = await res.json();

        if (data.online) {
          localStorage.setItem("cart_unlocked", "true");
          scanner.clear().then(() => navigate("/control-cart"));
        } else {
          setIsVerifying(false);
          alert("❌ ESP32 is OFFLINE. Please power on the cart.");
        }
      } catch (err) {
        setIsVerifying(false);
        alert("❌ Connection Error.");
      }
    });

    return () => scanner.clear().catch(e => console.log(e));
  }, [navigate]);

  return (
    <div className="scan-wrapper">
      <h1>GMR SECURE SCAN</h1>
      {isVerifying && <div className="loader">Verifying Proximity...</div>}
      <div id="reader"></div>
      <p>Scan ESP32 QR to unlock</p>
    </div>
  );
}

export default ScanCart;