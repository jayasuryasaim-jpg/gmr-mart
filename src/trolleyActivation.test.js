import { getTrolleyScanMessage } from "./trolleyActivation";

test("recognized trolley code does not pretend to activate a cart", () => {
  expect(getTrolleyScanMessage("GMR_TROLLEY_01_SECURE")).toMatch(/No cart was activated/);
});

test("unregistered QR payload is rejected", () => {
  expect(getTrolleyScanMessage("unregistered")).toMatch(/not registered/);
});
