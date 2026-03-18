import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { CART_ID } from "../constants"; // Assume this is "CART-2006"

export const handleScanSuccess = async (text, navigate) => {
  const ESP32_IP = "10.173.229.168";

  // 1. Verify the QR Code Text
  if (text === "GMR_TROLLEY_01_SECURE") {
    try {
      // 2. Unlock the ESP32 Hardware
      // This sends a request to your ESP32 server to enable RFID scanning
      const response = await fetch(`http://${ESP32_IP}/unlock`, { mode: 'no-cors' });
      console.log("ESP32 Unlocked:", response);

      // 3. Initialize/Reset Session in Firebase
      const user = JSON.parse(localStorage.getItem("user_profile")) || { name: "Guest", id: "GMR-000" };
      
      await setDoc(doc(db, "active_sessions", CART_ID), {
        cartNumber: "2006",
        customerName: user.name,
        customerId: user.id,
        items: [],
        totalPrice: 0,
        status: "ACTIVE",
        timestamp: new Date().toISOString()
      });
      
      // 4. Update Local Storage for session persistence
      localStorage.setItem("cart_unlocked", "true");
      
      // 5. Navigate to the Cart Control Dashboard
      navigate("/control-cart");

    } catch (error) {
      console.error("Session Start Error:", error);
      alert("System Error: Could not connect to the trolley. Ensure you are on the GMR Mart WiFi.");
    }
  } else {
    alert("Invalid QR Code: This is not a registered GMR Trolley.");
  }
};