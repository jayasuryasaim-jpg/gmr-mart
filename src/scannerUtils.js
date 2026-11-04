import { getTrolleyScanMessage } from "./trolleyActivation";

export function handleScanSuccess(text) {
  return getTrolleyScanMessage(text);
}
