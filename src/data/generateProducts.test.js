import { generateProducts } from "./generateProducts";

test("development catalogue values are stable between generations", () => {
  const firstGeneration = generateProducts();
  const secondGeneration = generateProducts();

  expect(firstGeneration.map(({ id, mrp, price, discount, stock }) => ({
    id,
    mrp,
    price,
    discount,
    stock
  }))).toEqual(secondGeneration.map(({ id, mrp, price, discount, stock }) => ({
    id,
    mrp,
    price,
    discount,
    stock
  })));
});
