import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CartControl from "./CartControl";

beforeEach(() => {
  localStorage.setItem("cart_unlocked", "true");
  localStorage.setItem("rules_accepted", "true");
});

test("does not show live cart data or allow checkout without configured services", () => {
  render(
    <MemoryRouter>
      <CartControl />
    </MemoryRouter>
  );

  expect(screen.getByText(/no live cart data is connected/i)).toBeInTheDocument();
  expect(screen.getByText(/no charge has been made/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /checkout unavailable/i })).toBeDisabled();
});
