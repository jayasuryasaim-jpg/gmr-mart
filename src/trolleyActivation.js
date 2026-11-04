import { TROLLEY_QR_PAYLOAD } from "./constants";

export function getTrolleyScanMessage(payload) {
  if (payload !== TROLLEY_QR_PAYLOAD) {
    return "This QR code is not registered as a GMR trolley.";
  }

  return "Trolley recognized, but activation is unavailable because no authenticated device service is configured. No cart was activated.";
}
