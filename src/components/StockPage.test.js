import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../auth/AuthProvider';
import StockPage from './StockPage';

const product = {
  id: 'product-1',
  name: 'Amul Gold Milk',
  brand: 'Amul',
  category: 'dairy',
  price: 60,
  priceMinor: 6000,
  mrp: 60,
  discount: null,
  stock: 24,
  unit: 'bottle',
  location: 'G1',
  store: 'GMR Smart Mart',
  floor: 'Ground Floor',
  image: null,
  dataSource: 'database',
};

beforeEach(() => {
  localStorage.clear();
  global.fetch = jest.fn().mockImplementation((url) => Promise.resolve(
    String(url).includes('/auth/session')
      ? { ok: false, status: 401, json: async () => ({ error: { message: 'No session.' } }) }
      : { ok: true, status: 200, json: async () => ({ products: [product], source: 'database' }) },
  ));
});

const openFirstProduct = async () => {
  render(
    <AuthProvider>
      <MemoryRouter>
        <StockPage />
      </MemoryRouter>
    </AuthProvider>
  );
  fireEvent.click(await screen.findByText(product.name));
  return screen.getByRole('button', { name: /add to reminder/i });
};

test('loads products from the API and adds browser-local reminders without a browser alert', async () => {
  const alert = jest.spyOn(window, 'alert').mockImplementation(() => {});
  const addButton = await openFirstProduct();

  fireEvent.click(addButton);

  expect(screen.getByRole('status')).toHaveTextContent(/saved to this browser's reminder list/i);
  expect(screen.getAllByText(/server database/i).length).toBeGreaterThan(0);
  expect(global.fetch).toHaveBeenCalledWith('/api/v1/products?limit=500', expect.objectContaining({
    credentials: 'include',
  }));
  expect(alert).not.toHaveBeenCalled();
  alert.mockRestore();
});

test('reports invalid browser reminder data instead of silently replacing it', async () => {
  localStorage.setItem('gmr_reminder_queue', 'not-json');
  const error = jest.spyOn(console, 'error').mockImplementation(() => {});
  fireEvent.click(await openFirstProduct());

  expect(screen.getByRole('status')).toHaveTextContent(/storage may be unavailable or contain invalid data/i);
  expect(localStorage.getItem('gmr_reminder_queue')).toBe('not-json');
  error.mockRestore();
});
