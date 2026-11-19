/** Funciones puras: sin DOM y fáciles de probar. */
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

export function getCartLines(cart, products) {
  return products.flatMap((product) => {
    const quantity = clampQuantity(cart[product.id] || 0);
    return quantity > 0
      ? [{ ...product, quantity, subtotal: quantity * product.price }]
      : [];
  });
}

export function getCartTotals(cart, products) {
  const lines = getCartLines(cart, products);
  return {
    lines,
    count: lines.reduce((total, item) => total + item.quantity, 0),
    total: lines.reduce((total, item) => total + item.subtotal, 0),
  };
}

export function formatCOP(amount) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(amount);
}
