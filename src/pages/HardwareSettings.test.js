import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import HardwareSettings from "./HardwareSettings";

const jsonResponse = (body, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body,
});

test("loads all device profiles and clearly marks live integration unavailable", async () => {
  global.fetch = jest.fn().mockResolvedValue(jsonResponse({ configurations: [] }));

  render(<HardwareSettings />);

  expect(await screen.findByRole("heading", { name: /esp32 cart controller/i })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: /hx711 weight sensor/i })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: /camera \(future integration\)/i })).toBeInTheDocument();
  expect(screen.getAllByText(/no physical device connection/i).length).toBeGreaterThan(0);
  expect(global.fetch).toHaveBeenCalledWith(
    "/api/v1/admin/hardware/configurations",
    expect.objectContaining({ credentials: "include" }),
  );
});

test("saves configuration through the protected API and reports success", async () => {
  global.fetch = jest.fn()
    .mockResolvedValueOnce(jsonResponse({ configurations: [] }))
    .mockResolvedValueOnce(jsonResponse({
      configuration: {
        deviceType: "esp32",
        displayName: "Store cart controller",
        deviceId: "cart-controller-01",
        enabled: true,
        mode: "simulation",
        settings: {},
        updatedAt: "2026-10-21T08:00:00.000Z",
      },
    }));

  render(<HardwareSettings />);
  const deviceCard = await screen.findByRole("heading", { name: /esp32 cart controller/i }).then((heading) => heading.closest("article"));
  fireEvent.change(within(deviceCard).getByLabelText(/display name/i), { target: { value: "Store cart controller" } });
  fireEvent.change(within(deviceCard).getByLabelText(/device id/i), { target: { value: "cart-controller-01" } });
  fireEvent.click(within(deviceCard).getByLabelText(/device profile enabled/i));
  fireEvent.click(within(deviceCard).getByRole("button", { name: /save settings/i }));

  expect(await screen.findByText(/settings saved/i)).toBeInTheDocument();
  const [, request] = global.fetch.mock.calls[1];
  expect(request.method).toBe("PUT");
  expect(JSON.parse(request.body)).toMatchObject({
    deviceType: "esp32",
    displayName: "Store cart controller",
    deviceId: "cart-controller-01",
    enabled: true,
    mode: "simulation",
  });
});

test("shows API errors rather than reporting a failed save as successful", async () => {
  global.fetch = jest.fn()
    .mockResolvedValueOnce(jsonResponse({ configurations: [] }))
    .mockResolvedValueOnce(jsonResponse({ error: { message: "Settings were rejected." } }, 400));

  render(<HardwareSettings />);
  const deviceCard = await screen.findByRole("heading", { name: /esp32 cart controller/i }).then((heading) => heading.closest("article"));
  fireEvent.click(within(deviceCard).getByRole("button", { name: /save settings/i }));

  expect(await screen.findByRole("alert")).toHaveTextContent("Settings were rejected.");
  expect(screen.queryByText(/settings saved/i)).not.toBeInTheDocument();
  await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));
});
