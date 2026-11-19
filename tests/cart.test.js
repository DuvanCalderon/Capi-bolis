import test from "node:test";
import assert from "node:assert/strict";
import { clampQuantity, changeQuantity, getCartTotals, formatCOP } from "../js/cart.js";
import { PRODUCTS, SHOP } from "../js/products.js";

test("los siete sabores reales están en el catálogo", () => {
  assert.deepEqual(PRODUCTS.map(p=>p.name), [
    "Maracuyá", "Oreo", "Capuccino", "Pie de limón", "Arequipe", "Mango biche", "Fresa"
  ]);
  assert.ok(PRODUCTS.every(p=>p.price===2500));
});

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

test("un sabor desconocido no altera el carrito", () => {
  assert.deepEqual(changeQuantity({}, "inventado", 1, PRODUCTS), {});
});

test("hasta 12 unidades: 2500 COP c/u en cualquier combinación", () => {
  const t = getCartTotals({ fresa: 6, maracuya: 6 }, PRODUCTS);
  assert.equal(t.count, 12);
  assert.equal(t.total, 30000);
  assert.equal(t.savings, 0);
  assert.equal(t.isWholesale, false);
  assert.equal(t.remainingToWholesale, 1);
  assert.equal(t.unitPrice, SHOP.retailPrice);
  assert.equal(t.lines.find(x=>x.id==="fresa").subtotal, 15000);
});

test("más de 12: 2000 COP para TODAS las unidades, incluso entre sabores", () => {
  const t = getCartTotals({ fresa: 6, oreo: 7 }, PRODUCTS);
  assert.equal(t.count, 13);
  assert.equal(t.total, 26000);
  assert.equal(t.regularTotal, 32500);
  assert.equal(t.savings, 6500);
  assert.equal(t.isWholesale, true);
  assert.equal(t.unitPrice, SHOP.wholesalePrice);
  assert.equal(t.remainingToWholesale, 0);
  assert.equal(t.lines.find(x=>x.id==="oreo").subtotal, 14000);
  assert.equal(t.lines.find(x=>x.id==="fresa").subtotal, 12000);
});

test("14 bolis: 28000 COP y se mantiene el descuento", () => {
  const t = getCartTotals({ fresa: 14 }, PRODUCTS);
  assert.equal(t.total, 28000);
  assert.equal(t.savings, 7000);
});

test("al bajar de 13 a 12 se revierte correctamente al precio normal", () => {
  const prev = { fresa: 8, maracuya: 5 };
  assert.equal(getCartTotals(prev, PRODUCTS).total, 26000);
  const next = changeQuantity(prev, "maracuya", -1, PRODUCTS);
  const t = getCartTotals(next, PRODUCTS);
  assert.equal(t.count, 12);
  assert.equal(t.total, 30000);
  assert.equal(t.savings, 0);
  assert.equal(t.unitPrice, 2500);
});

test("pedido vacío tiene cero unidades y total cero", () => {
  const t = getCartTotals({}, PRODUCTS);
  assert.equal(t.count, 0);
  assert.equal(t.total, 0);
  assert.equal(t.savings, 0);
  assert.deepEqual(t.lines, []);
});

test("formato de precios en pesos colombianos", () => {
  assert.match(formatCOP(26000), /26\.000/);
});
