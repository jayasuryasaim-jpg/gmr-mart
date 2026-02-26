// This acts as the secure bridge
let lastPulseTime = 0;

export default function handler(req, res) {
  // 1. RECEIVE PULSE FROM ESP32
  if (req.method === 'POST') {
    const { hw_id } = req.body;
    // Ensure the ID matches what is programmed in your Arduino code
    if (hw_id === "ESP32_GMR_01") {
      lastPulseTime = Date.now(); 
      return res.status(200).json({ status: "Verified" });
    }
  }

  // 2. CHECK STATUS FOR REACT SCANNER
  if (req.method === 'GET') {
    const now = Date.now();
    // Online if pulse received within last 30 seconds
    const isOnline = (now - lastPulseTime) < 30000;
    return res.status(200).json({ online: isOnline });
  }

  return res.status(405).end();
}