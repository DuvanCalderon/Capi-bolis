import { formatCOP } from "./cart.js";

export const PAYMENT_LABELS = Object.freeze({
  por_acordar: "Por acordar con el negocio",
  efectivo: "Efectivo (por confirmar)",
  transferencia: "Transferencia (por confirmar)",
});

export const DELIVERY_LABELS = Object.freeze({
  domicilio: "Domicilio (sujeto a confirmación)",
  recogida: "Recoger (sujeto a confirmación)",
});

export function todayLocalISO(now = new Date()) {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function validateOrder(data, lines, today = todayLocalISO()) {
  const errors = {};
  if (!Array.isArray(lines) || lines.length === 0) errors.cart = "Agrega al menos un boli a tu pedido.";
  if (!data.name?.trim() || data.name.trim().length < 2) errors.name = "Escribe tu nombre (mínimo 2 caracteres).";
  if (!/^[\d\s()+-]{7,20}$/.test(data.phone?.trim() || "") || (data.phone.match(/\d/g) || []).length < 7) {
    errors.phone = "Escribe un número de contacto válido.";
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date || "") || data.date < today || Number.isNaN(new Date(`${data.date}T12:00:00`).getTime())) {
    errors.date = "Elige una fecha válida de hoy en adelante.";
  }
  if (!Object.hasOwn(DELIVERY_LABELS, data.delivery)) errors.delivery = "Selecciona una modalidad.";
  if (data.delivery === "domicilio" && (!data.address?.trim() || data.address.trim().length < 6)) {
    errors.address = "Indica una dirección de al menos 6 caracteres.";
  }
  if (!Object.hasOwn(PAYMENT_LABELS, data.payment)) errors.payment = "Selecciona cómo prefieres pagar.";
  return errors;
}

export function buildOrderMessage(lines, data, total) {
  const rows = lines.map((item) => `• ${item.name}: ${item.quantity} × ${formatCOP(item.price)} = ${formatCOP(item.subtotal)}`);
  const delivery = DELIVERY_LABELS[data.delivery] || "Por confirmar";
  const payment = PAYMENT_LABELS[data.payment] || "Por acordar";
  return [
    "🍧 *¡Hola, Capi Bolis!*",
    "Quisiera consultar disponibilidad para este pedido:",
    "",
    "*Mis bolis:*",
    ...rows,
    "",
    `*Unidades:* ${lines.reduce((sum, item) => sum + item.quantity, 0)}`,
    `*Total estimado:* ${formatCOP(total)}`,
    "",
    "*Mis datos:*",
    `Nombre: ${data.name.trim()}`,
    `Contacto: ${data.phone.trim()}`,
    `Fecha solicitada: ${data.date}`,
    `Modalidad: ${delivery}`,
    ...(data.delivery === "domicilio" ? [`Dirección: ${data.address.trim()}`] : []),
    `Pago preferido: ${payment}`,
    ...(data.notes?.trim() ? [`Notas: ${data.notes.trim().slice(0, 240)}`] : []),
    "",
    "Entiendo que el pedido, la entrega, la disponibilidad y el valor final requieren su confirmación. ¡Gracias!",
  ].join("\n");
}

export function buildWhatsAppURL(number, message) {
  const digits = String(number || "").replace(/\D/g, "");
  if (!/^\d{10,15}$/.test(digits)) throw new Error("Número de WhatsApp inválido.");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
