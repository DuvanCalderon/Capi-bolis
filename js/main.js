import { SHOP, PRODUCTS, CATEGORY_LABELS } from "./products.js";
import { changeQuantity, getCartTotals, formatCOP } from "./cart.js";
import { PAYMENT_LABELS, todayLocalISO, validateOrder, buildOrderMessage, buildWhatsAppURL } from "./order.js";

const catalog = document.querySelector("#product-grid");
const cartItems = document.querySelector("#cart-items");
const cartEmpty = document.querySelector("#cart-empty");
const cartCount = document.querySelectorAll("[data-cart-count]");
const cartAmount = document.querySelectorAll("[data-cart-total]");
const orderForm = document.querySelector("#order-form");
const reviewDialog = document.querySelector("#review-dialog");
const messagePreview = document.querySelector("#message-preview");
const toast = document.querySelector("#toast");

let cart = {};
let currentFilter = "todos";
let pendingWhatsAppURL = "";

function visual(product) {
  return `<svg class="boli-art" viewBox="0 0 240 236" role="img" aria-label="Ilustración de boli sabor ${product.name}">
    <defs><linearGradient id="fill-${product.id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity=".48" />
      <stop offset=".34" stop-color="${product.color}" />
      <stop offset="1" stop-color="${product.color}" />
    </linearGradient></defs>
    <ellipse cx="124" cy="207" rx="56" ry="10" fill="#48342c" opacity=".09"/>
    <g transform="rotate(-8 120 117)">
      <path d="M94 30 Q120 19 146 30 L149 42 144 63 151 171 Q154 189 138 195 L107 195 Q89 191 92 174 L97 63 91 42Z"
        fill="url(#fill-${product.id})" stroke="#fff" stroke-width="4"/>
      <path d="M92 31 Q120 36 148 31 L149 42 Q119 50 91 42Z" fill="#fff" fill-opacity=".7"/>
      <path d="M100 60 Q103 47 108 58 L109 172 Q109 181 105 182 Q99 182 99 173Z" fill="#fff" opacity=".28"/>
      <path d="M128 57 Q139 65 140 82 L141 168" fill="none" stroke="#fff" stroke-opacity=".32" stroke-width="3" stroke-linecap="round"/>
      <path d="M108 25 Q120 5 132 25" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/>
    </g>
    <circle cx="182" cy="66" r="24" fill="#fff" opacity=".78"/><text x="182" y="75" text-anchor="middle" font-size="23">${product.fruit}</text>
    <circle cx="57" cy="156" r="4" fill="${product.color}" opacity=".8"/>
    <path d="M56 66 l3 10 10 3 -10 3 -3 10 -3 -10 -10 -3 10 -3Z" fill="#fff" opacity=".9"/>
  </svg>`;
}

function productCard(product) {
  const quantity = cart[product.id] || 0;
  return `<article class="product-card" style="--product-pale:${product.pale};--product-accent:${product.color}">
    <div class="product-image${product.image ? " has-photo" : ""}">${product.image ? `<img class="product-photo" src="${product.image}" alt="${product.imageAlt || `Bolis sabor ${product.name}`}" loading="lazy" decoding="async" width="420" height="748" />` : visual(product)}<span class="product-tag">${product.tag}</span></div>
    <div class="product-info">
      <span class="product-category">${product.category === "frutales" ? "Frutal" : "Cremoso"}</span>
      <h3>${product.name}</h3><p>${product.description}</p>
      <div class="product-bottom">
        <strong>${formatCOP(product.price)}</strong>
        <div class="quantity-control" aria-label="Cantidad de ${product.name}">
          <button type="button" class="quantity-btn" data-product="${product.id}" data-delta="-1" aria-label="Quitar uno de ${product.name}" ${quantity === 0 ? "disabled" : ""}>−</button>
          <output aria-label="${quantity} unidades de ${product.name}">${quantity}</output>
          <button type="button" class="quantity-btn plus" data-product="${product.id}" data-delta="1" aria-label="Agregar uno de ${product.name}" ${quantity >= SHOP.maxPerFlavor ? "disabled" : ""}>+</button>
        </div>
      </div>
    </div>
  </article>`;
}

function renderCatalog() {
  const shown = PRODUCTS.filter((product) => currentFilter === "todos" || product.category === currentFilter);
  catalog.innerHTML = shown.length
    ? shown.map(productCard).join("")
    : '<p class="empty-catalog">Aún no hay sabores en esta categoría.</p>';
}

function renderCart() {
  const { lines, count, total, isWholesale, savings, remainingToWholesale, unitPrice } = getCartTotals(cart, PRODUCTS);
  cartEmpty.hidden = lines.length > 0;
  cartItems.innerHTML = lines.map((item) => `<li class="cart-line">
    <span class="cart-dot" style="background:${item.color}"></span>
    <div class="cart-line-main"><strong>${item.name}</strong><small>${item.quantity} × ${formatCOP(item.price)}</small></div>
    <strong>${formatCOP(item.subtotal)}</strong>
    <button type="button" class="cart-remove" data-product="${item.id}" data-delta="-1" aria-label="Quitar una unidad de ${item.name}">−</button>
  </li>`).join("");
  cartCount.forEach((el) => { el.textContent = count; });
  cartAmount.forEach((el) => { el.textContent = formatCOP(total); });
  const status = document.querySelector("#wholesale-status");
  status.textContent = isWholesale
    ? `¡Precio al por mayor aplicado! ${formatCOP(unitPrice)} por boli · Ahorras ${formatCOP(savings)}.`
    : count === 0
      ? `Lleva 13 bolis o más y cada uno te cuesta ${formatCOP(SHOP.wholesalePrice)}.`
      : `Agrega ${remainingToWholesale} boli${remainingToWholesale === 1 ? "" : "s"} más para pagar ${formatCOP(SHOP.wholesalePrice)} por unidad en todo el pedido.`;
  status.classList.toggle("is-wholesale", isWholesale);
  document.querySelector("#wholesale-progress").value = Math.min(count, SHOP.wholesaleThreshold + 1);
  const savingsRow = document.querySelector("#wholesale-savings");
  savingsRow.hidden = !isWholesale;
  document.querySelector("#wholesale-savings-amount").textContent = `−${formatCOP(savings)}`;
  document.querySelector("#checkout-unit-price").textContent = formatCOP(unitPrice);
  document.querySelector("#cart-summary").setAttribute("aria-label", `Tu pedido: ${count} bolis, ${formatCOP(total)}`);
}

function announce(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(announce.timer);
  announce.timer = window.setTimeout(() => toast.classList.remove("is-visible"), 2900);
}

function updateProduct(productId, delta) {
  cart = changeQuantity(cart, productId, delta, PRODUCTS, SHOP.maxPerFlavor);
  renderCatalog();
  renderCart();
}

function handleQuantityClick(event) {
  const button = event.target.closest("button[data-product][data-delta]");
  if (!button || button.disabled) return;
  updateProduct(button.dataset.product, Number(button.dataset.delta));
}

catalog.addEventListener("click", handleQuantityClick);
cartItems.addEventListener("click", handleQuantityClick);

document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach((candidate) => {
      const active = candidate === button;
      candidate.classList.toggle("is-active", active);
      candidate.setAttribute("aria-pressed", String(active));
    });
    document.querySelector("#filter-summary").textContent = CATEGORY_LABELS[currentFilter];
    renderCatalog();
  });
});

const deliveryInputs = document.querySelectorAll('input[name="delivery"]');
const addressGroup = document.querySelector("#address-group");
const addressInput = document.querySelector("#address");
function syncDelivery() {
  const selected = document.querySelector('input[name="delivery"]:checked')?.value;
  addressGroup.hidden = selected !== "domicilio";
  addressInput.required = selected === "domicilio";
  if (selected !== "domicilio") {
    addressInput.value = "";
    clearError("address");
  }
}
deliveryInputs.forEach((input) => input.addEventListener("change", () => {
  syncDelivery();
  clearError("delivery");
}));
syncDelivery();

const dateInput = document.querySelector("#date");
dateInput.min = todayLocalISO();

function clearError(fieldName) {
  const target = document.querySelector(`[data-error-for="${fieldName}"]`);
  if (target) target.textContent = "";
  const field = orderForm.elements.namedItem(fieldName);
  if (field && "removeAttribute" in field) field.removeAttribute("aria-invalid");
}

function setErrors(errors) {
  document.querySelectorAll("[data-error-for]").forEach((el) => { el.textContent = ""; });
  orderForm.querySelectorAll('[aria-invalid="true"]').forEach((el) => el.removeAttribute("aria-invalid"));
  for (const [name, message] of Object.entries(errors)) {
    const target = document.querySelector(`[data-error-for="${name}"]`);
    if (target) target.textContent = message;
    const input = orderForm.elements.namedItem(name);
    if (input && "setAttribute" in input) input.setAttribute("aria-invalid", "true");
  }
}

orderForm.addEventListener("input", (event) => {
  if (event.target.name) clearError(event.target.name);
});
orderForm.addEventListener("change", (event) => {
  if (event.target.name) clearError(event.target.name);
});

orderForm.addEventListener("submit", (event) => {
  event.preventDefault();
  // El formulario es una solicitud de contacto: ningún dato se guarda en el navegador.
  const formData = new FormData(orderForm);
  const data = Object.fromEntries(formData.entries());
  const { lines, total } = getCartTotals(cart, PRODUCTS);
  const errors = validateOrder(data, lines);
  setErrors(errors);
  if (Object.keys(errors).length) {
    announce("Revisa los campos señalados para continuar.");
    if (errors.cart) document.querySelector("#sabores").scrollIntoView({ behavior: "smooth", block: "start" });
    else {
      const first = orderForm.elements.namedItem(Object.keys(errors)[0]);
      if (first && "focus" in first) first.focus();
    }
    return;
  }
  const message = buildOrderMessage(lines, data, total);
  try {
    pendingWhatsAppURL = buildWhatsAppURL(SHOP.whatsapp, message);
  } catch {
    announce("Falta configurar el WhatsApp del negocio.");
    return;
  }
  messagePreview.textContent = message;
  if ("showModal" in reviewDialog) reviewDialog.showModal();
  else reviewDialog.setAttribute("open", "");
});

document.querySelector("#close-review").addEventListener("click", () => reviewDialog.close());
document.querySelector("#back-to-edit").addEventListener("click", () => reviewDialog.close());
document.querySelector("#send-whatsapp").addEventListener("click", () => {
  if (!pendingWhatsAppURL) return;
  window.open(pendingWhatsAppURL, "_blank", "noopener,noreferrer");
  reviewDialog.close();
  announce("WhatsApp se abrió para que revises y envíes tu mensaje. Tu pedido aún no está confirmado.");
});

document.querySelector("#year").textContent = new Date().getFullYear();
document.querySelector("#primary-phone").textContent = "318 550 0770";
document.querySelector("#secondary-phone").textContent = SHOP.alternatePhone.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3");
renderCatalog();
renderCart();
