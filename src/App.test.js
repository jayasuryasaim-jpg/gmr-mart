import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

const response = (status, body) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body,
});

beforeEach(() => {
  localStorage.clear();
  window.history.pushState({}, '', '/');
  global.fetch = jest.fn().mockResolvedValue(response(401, {
    error: { code: 'UNAUTHENTICATED', message: 'No active session.' },
  }));
});

test('renders the server-backed sign-in form', () => {
  render(<App />);
  expect(screen.getByText(/secure gateway/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
});

test('allows a guest to browse without creating a customer session', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('link', { name: /browse the read-only demo/i }));

  expect(screen.getByRole('button', { name: /home/i })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /account/i })).not.toBeInTheDocument();
});

test('registration collects only an email and password', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /new customer/i }));

  expect(screen.getByLabelText(/email/i)).toBeRequired();
  expect(screen.getByLabelText(/password/i)).toHaveAttribute('minLength', '12');
  expect(screen.queryByLabelText(/phone|address/i)).not.toBeInTheDocument();
});

test('does not restore a customer identity from browser storage', () => {
  localStorage.setItem('gmr_auth', 'true');
  localStorage.setItem('gmr_role', 'customer');
  window.history.pushState({}, '', '/home');

  render(<App />);

  expect(screen.getByRole('button', { name: /home/i })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /sign out/i })).not.toBeInTheDocument();
});

test('does not expose an admin console from a browser-stored session', () => {
  localStorage.setItem('gmr_auth', 'true');
  localStorage.setItem('gmr_role', 'admin');
  window.history.pushState({}, '', '/admin-terminal');

  render(<App />);

  expect(screen.getByText(/admin console unavailable/i)).toBeInTheDocument();
});

test('does not mount hardware settings or call its API for an unauthenticated user', async () => {
  window.history.pushState({}, '', '/admin/hardware');

  render(<App />);

  expect(await screen.findByRole('heading', { name: /administrator access required/i })).toBeInTheDocument();
  expect(global.fetch).not.toHaveBeenCalledWith(
    '/api/v1/admin/hardware/configurations',
    expect.anything(),
  );
});

test('payment route does not claim a successful charge without a provider', () => {
  window.history.pushState({}, '', '/payment');

  render(<App />);

  expect(screen.getByRole('status')).toHaveTextContent(/no payment has been attempted or charged/i);
  expect(screen.queryByRole('button', { name: /pay now/i })).not.toBeInTheDocument();
});

test('payment return does not treat a provider redirect as proof of payment', () => {
  window.history.pushState({}, '', '/payment?status=return');
  render(<App />);
  expect(screen.getByRole('status')).toHaveTextContent(/payment verification pending/i);
  expect(screen.getByRole('link', { name: /check server order status/i })).toHaveAttribute('href', '/orders');
});

test('successful server login establishes the session and exposes sign out', async () => {
  global.fetch.mockImplementation((url) => {
    if (String(url).includes('/auth/login')) {
      return Promise.resolve(response(200, {
        user: { id: 'user-1', email: 'shopper@example.test', role: 'customer' },
      }));
    }
    return Promise.resolve(response(401, {
      error: { code: 'UNAUTHENTICATED', message: 'No active session.' },
    }));
  });

  render(<App />);
  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'shopper@example.test' } });
  fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'a-long-password-123' } });
  fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

  expect(await screen.findByRole('button', { name: /sign out/i })).toBeInTheDocument();
  expect(global.fetch).toHaveBeenCalledWith('/api/v1/auth/login', expect.objectContaining({
    method: 'POST',
    credentials: 'include',
  }));
});
