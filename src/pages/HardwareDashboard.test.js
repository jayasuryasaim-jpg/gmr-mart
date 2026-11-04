import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import HardwareDashboard from "./HardwareDashboard";

const cart = {
  id: "cart-1",
  cartCode: "SIM-001",
  qrIdentity: "qr-preview-001",
  mode: "simulation",
  status: "active",
  zone: "Aisle A",
  batteryPercent: 80,
  weightGrams: 1250,
  rfidScans: 2,
  sensorAlerts: 0,
  sensorStatus: "Ready",
  motorState: "Stopped",
  lastEventAt: "2026-10-21T08:00:00.000Z",
};
const jsonResponse = (body, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body,
});

test("shows explicitly simulated cart readings and a fictional store map", async () => {
  global.fetch = jest.fn()
    .mockResolvedValueOnce(jsonResponse({ carts: [cart] }))
    .mockResolvedValueOnce(jsonResponse({ status: "ready" }))
    .mockResolvedValueOnce(jsonResponse({ events: [{
      id: "event-1",
      type: "rfid-detected",
      label: "Test rice tag detected",
      timestamp: "2026-10-21T08:00:00.000Z",
      simulation: true,
    }] }));

  render(<HardwareDashboard />);

  expect(await screen.findByText("SIMULATION DATA")).toBeInTheDocument();
  expect(screen.getByText("FICTIONAL STORE")).toBeInTheDocument();
  expect(screen.getByText(/1250 g \(simulated\)/i)).toBeInTheDocument();
  expect(screen.getByText(/Test rice tag detected/i)).toBeInTheDocument();
  expect(screen.getByText(/no GPS, browser location, or third-party maps/i)).toBeInTheDocument();
});

test("records a controlled simulation action and refreshes its events", async () => {
  global.fetch = jest.fn()
    .mockResolvedValueOnce(jsonResponse({ carts: [cart] }))
    .mockResolvedValueOnce(jsonResponse({ status: "ready" }))
    .mockResolvedValueOnce(jsonResponse({ events: [] }))
    .mockResolvedValueOnce(jsonResponse({ event: { simulation: true } }, 201))
    .mockResolvedValueOnce(jsonResponse({ carts: [cart] }))
    .mockResolvedValueOnce(jsonResponse({ events: [] }));

  render(<HardwareDashboard />);
  await screen.findByText("SIMULATION DATA");
  fireEvent.click(screen.getByRole("button", { name: /^start$/i }));

  expect(await screen.findByText(/did not change authoritative stock or orders/i)).toBeInTheDocument();
  const simulationCall = global.fetch.mock.calls.find(([url]) => String(url).includes("/simulation"));
  expect(simulationCall[0]).toContain("/api/v1/admin/hardware/carts/cart-1/simulation");
  expect(JSON.parse(simulationCall[1].body)).toMatchObject({ action: "start", scenario: "guided-tour" });
});

test("does not hide registration failures behind a success message", async () => {
  global.fetch = jest.fn()
    .mockResolvedValueOnce(jsonResponse({ carts: [] }))
    .mockResolvedValueOnce(jsonResponse({ status: "ready" }))
    .mockResolvedValueOnce(jsonResponse({ error: { message: "Admin permission required." } }, 403));

  render(<HardwareDashboard />);
  await screen.findByText(/register simulation cart/i);
  await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));
  fireEvent.click(screen.getByRole("button", { name: /register simulation cart/i }));

  expect(await screen.findByRole("alert")).toHaveTextContent("Admin permission required.");
  await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(3));
});

test("shows a loading state before carts and events arrive", async () => {
  let finishCarts;
  global.fetch = jest.fn()
    .mockImplementationOnce(() => new Promise((resolve) => { finishCarts = resolve; }))
    .mockResolvedValueOnce(jsonResponse({ status: "ready" }))
    .mockResolvedValueOnce(jsonResponse({ events: [] }));
  render(<HardwareDashboard />);
  expect(screen.getByRole("status")).toHaveTextContent(/loading registered carts/i);
  finishCarts(jsonResponse({ carts: [cart] }));
  expect(await screen.findByText("No simulation events recorded for this cart.")).toBeInTheDocument();
});

test.each([null, undefined, { events: null }, { events: {} }, { events: [null] }])(
  "reports an invalid event response (%s) without crashing",
  async (eventResponse) => {
    global.fetch = jest.fn()
      .mockResolvedValueOnce(jsonResponse({ carts: [cart] }))
      .mockResolvedValueOnce(jsonResponse({ status: "ready" }))
      .mockResolvedValueOnce(jsonResponse(eventResponse));
    render(<HardwareDashboard />);
    expect(await screen.findByText("Unable to load simulation events.")).toBeInTheDocument();
    expect(screen.getAllByRole("alert")[0]).toHaveTextContent(/invalid cart events response/i);
  },
);

test("reports event API failures instead of showing an empty success state", async () => {
  global.fetch = jest.fn()
    .mockResolvedValueOnce(jsonResponse({ carts: [cart] }))
    .mockResolvedValueOnce(jsonResponse({ status: "ready" }))
    .mockResolvedValueOnce(jsonResponse({ error: { message: "Events service unavailable." } }, 503));
  render(<HardwareDashboard />);
  expect(await screen.findByText("Unable to load simulation events.")).toBeInTheDocument();
  expect(screen.getAllByRole("alert")[0]).toHaveTextContent("Events service unavailable.");
  expect(screen.queryByText("No simulation events recorded for this cart.")).not.toBeInTheDocument();
});

test("renders the event count and all valid event records", async () => {
  const events = [
    { id: "event-1", type: "rfid", label: "Tag detected", timestamp: "2026-10-21T08:00:00Z", simulation: true },
    { id: "event-2", type: "weight", label: "Weight changed", timestamp: "2026-10-21T08:01:00Z", simulation: true },
  ];
  global.fetch = jest.fn()
    .mockResolvedValueOnce(jsonResponse({ carts: [cart] }))
    .mockResolvedValueOnce(jsonResponse({ status: "ready" }))
    .mockResolvedValueOnce(jsonResponse({ events }));
  render(<HardwareDashboard />);
  expect(await screen.findByText("Tag detected")).toBeInTheDocument();
  expect(screen.getByText("Weight changed")).toBeInTheDocument();
  expect(screen.getAllByText("SIMULATED")).toHaveLength(2);
});

test("keeps delayed events tied to the currently selected cart", async () => {
  const secondCart = { ...cart, id: "cart-2", cartCode: "SIM-002" };
  let resolveSecondCartEvents;
  let firstCartEventRequestCount = 0;
  global.fetch = jest.fn((url) => {
    if (String(url).endsWith("/hardware/carts")) return Promise.resolve(jsonResponse({ carts: [cart, secondCart] }));
    if (String(url).endsWith("/operations/readiness")) return Promise.resolve(jsonResponse({ status: "ready" }));
    if (String(url).endsWith("/cart-1/events")) {
      firstCartEventRequestCount += 1;
      const label = firstCartEventRequestCount === 1 ? "First cart event" : "First cart refreshed";
      return Promise.resolve(jsonResponse({ events: [{ id: `first-event-${firstCartEventRequestCount}`, type: "test", label, timestamp: "2026-10-21T07:59:00Z" }] }));
    }
    if (String(url).endsWith("/cart-2/events")) {
      return new Promise((resolve) => { resolveSecondCartEvents = resolve; });
    }
    throw new Error(`Unexpected request: ${url}`);
  });

  render(<HardwareDashboard />);
  await screen.findByRole("button", { name: /SIM-002/i });
  expect(await screen.findByText("First cart event")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: /SIM-002/i }));
  expect(await screen.findByText("Loading simulation events…")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: /SIM-001/i }));
  expect(await screen.findByText("First cart refreshed")).toBeInTheDocument();

  await act(async () => {
    resolveSecondCartEvents(jsonResponse({ events: [{ id: "second-event", type: "test", label: "Second cart late event", timestamp: "2026-10-21T08:00:00Z" }] }));
  });
  expect(screen.getByText("First cart refreshed")).toBeInTheDocument();
  expect(screen.queryByText("Second cart late event")).not.toBeInTheDocument();
});

test("displays a failed cart-list request", async () => {
  global.fetch = jest.fn()
    .mockResolvedValueOnce(jsonResponse({ error: { message: "Hardware service unavailable." } }, 503))
    .mockResolvedValueOnce(jsonResponse({ status: "ready" }));
  render(<HardwareDashboard />);
  expect(await screen.findByRole("alert")).toHaveTextContent("Hardware service unavailable.");
  expect(screen.queryByText("No registered carts")).not.toBeInTheDocument();
});

test("reports a malformed cart list instead of treating it as empty", async () => {
  global.fetch = jest.fn()
    .mockResolvedValueOnce(jsonResponse({ carts: [null] }))
    .mockResolvedValueOnce(jsonResponse({ status: "ready" }));
  render(<HardwareDashboard />);
  expect(await screen.findByRole("alert")).toHaveTextContent(/invalid cart list response/i);
  expect(screen.getByText("Cart data unavailable")).toBeInTheDocument();
  expect(screen.queryByText("No registered carts")).not.toBeInTheDocument();
});
