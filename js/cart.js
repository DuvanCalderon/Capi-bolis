import { SHOP } from "./products.js";

/** Funciones puras: la misma regla de precio rige carrito y mensaje. */
export function clampQuantity(value, max = 99) {
  const number = Number(value);
  if (!Number.isInteger(number) || !Number.isFinite(number)) return 0;
  return Math.min(Math.max(number, 0), max);
}

export function changeQuantity(cart, productId, delta, products, max = 99) {
  if (!products.some((product) => product.id === productId) || !Number.isInteger(delta)) return { ...cart };
  const next = { ...cart };
  const quantity = clampQuantity((next[productId] || 0) + delta, max);
  if (quantity === 0) delete next[productId];
  else next[productId] = quantity;
  return next;
}

/** Más de 12 unidades entre TODOS los sabores: precio mayorista en TODO el pedido. */
export function getCartLines(cart, products) {
  const unpricedLines = products.flatMap((product) => {
    const quantity = clampQuantity(cart[product.id] || 0, SHOP.maxPerFlavor);
    return quantity > 0 ? [{ ...product, quantity }] : [];
  });
  const count = unpricedLines.reduce((sum, item) => sum + item.quantity, 0);
  const isWholesale = count > SHOP.wholesaleThreshold;
  return unpricedLines.map((item) => {
    const unitPrice = isWholesale ? SHOP.wholesalePrice : item.price;
    return {
      ...item,
      regularPrice: item.price,
      price: unitPrice,
      subtotal: item.quantity * unitPrice,
      regularSubtotal: item.quantity * item.price,
    };
  });
}

export function getCartTotals(cart, products) {
  const lines = getCartLines(cart, products);
  const count = lines.reduce((sum, item) => sum + item.quantity, 0);
  const total = lines.reduce((sum, item) => sum + item.subtotal, 0);
  const regularTotal = lines.reduce((sum, item) => sum + item.regularSubtotal, 0);
  const isWholesale = count > SHOP.wholesaleThreshold;
  return {
    lines,
    count,
    total,
    regularTotal,
    savings: regularTotal - total,
    isWholesale,
    unitPrice: isWholesale ? SHOP.wholesalePrice : SHOP.retailPrice,
    remainingToWholesale: isWholesale ? 0 : Math.max(0, SHOP.wholesaleThreshold + 1 - count),
  };
}

export function formatCOP(amount) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(amount);
}
