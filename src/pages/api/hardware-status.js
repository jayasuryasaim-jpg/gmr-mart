export default function handler(req, res) {
  if (req.method !== "GET" && req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  return res.status(503).json({
    status: "unavailable",
    message: "Hardware status is unavailable until an authenticated device service is configured."
  });
}