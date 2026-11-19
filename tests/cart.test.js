import test from "node:test";
import assert from "node:assert/strict";
import { clampQuantity, changeQuantity, getCartTotals, formatCOP } from "../js/cart.js";
import { PRODUCTS } from "../js/products.js";

test("cantidad inválida, negativa y fraccionaria no se acepta", () => {
  assert.equal(clampQuantity(-2), 0);
  assert.equal(clampQuantity(1.2), 0);
  assert.equal(clampQuantity("a"), 0);
  assert.equal(clampQuantity(150), 99);
});

test("agregar y restar unidades cambia el carrito", () => {
  const one = changeQuantity({}, "fresa", 1, PRODUCTS);
  const two = changeQuantity(one, "fresa", 1, PRODUCTS);
  assert.equal(two.fresa, 2);
  const zero = changeQuantity(two, "fresa", -2, PRODUCTS);
  assert.deepEqual(zero, {});
});

test("un producto desconocido no altera el carrito", () => {
  assert.deepEqual(changeQuantity({}, "inventado", 1, PRODUCTS), {});
});

test("total y subtotales son exactos para múltiples sabores", () => {
  const t = getCartTotals({ fresa: 2, mango: 3 }, PRODUCTS);
  assert.equal(t.count, 5);
  assert.equal(t.total, 15000);
  assert.equal(t.lines[0].subtotal, 6000);
  assert.equal(t.lines[1].subtotal, 9000);
  assert.match(formatCOP(t.total), /15\.000/);
});

test("pedido vacío tiene cero unidades y total cero", () => {
  assert.deepEqual(getCartTotals({}, PRODUCTS), { lines: [], count: 0, total: 0 });
});
