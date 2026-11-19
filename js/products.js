/**
 * Catálogo real de Capi Bolis, comunicado por el negocio.
 * Precios 2026: $2.500 por unidad; si el carrito supera 12 bolis,
 * TODAS las unidades del pedido cuestan $2.000 cada una.
 * Maracuyá, Oreo, pie de limón y fresa tienen fotos reales. Los demás sabores usan ilustraciones.
 */
export const SHOP = Object.freeze({
  brand: "Capi Bolis",
  whatsapp: "573185500770", // Número del aviso original; confirmar que es el canal actual de pedidos.
  alternatePhone: "3224805443",
  retailPrice: 2500,
  wholesalePrice: 2000,
  wholesaleThreshold: 12,
  catalogIsDemo: false,
  maxPerFlavor: 99,
});

export const PRODUCTS = Object.freeze([
  { id: "maracuya", name: "Maracuyá", category: "frutales", description: "Tropical, refrescante y con su toque ácido.", price: SHOP.retailPrice, color: "#EBC86D", pale: "#FFF5D7", fruit: "☀️", tag: "Tropical", image: "./assets/images/maracuya-real.webp", imageAlt: "Foto real de varios bolis de maracuyá de Capi Bolis" },
  { id: "oreo", name: "Oreo", category: "cremosos", description: "Cremoso, con sabor a galleta de chocolate.", price: SHOP.retailPrice, color: "#9F8F93", pale: "#F0E9EC", fruit: "🍪", tag: "Galleta", image: "./assets/images/oreo-real.webp", imageAlt: "Foto real de bolis de Oreo Capi Bolis", imageFrame: "framed", imageWidth: 355, imageHeight: 373 },
  { id: "capuccino", name: "Capuccino", category: "cremosos", description: "Un antojo suave con sabor a café.", price: SHOP.retailPrice, color: "#B98E78", pale: "#EFE3DA", fruit: "☕", tag: "Café" },
  { id: "pie-limon", name: "Pie de limón", category: "cremosos", description: "Dulce, cremoso y con toque cítrico.", price: SHOP.retailPrice, color: "#D7CE83", pale: "#F8F5DB", fruit: "🍋", tag: "Especial", image: "./assets/images/pie-limon-real.webp", imageAlt: "Foto real de bolis de pie de limón Capi Bolis", imageFrame: "framed", imageWidth: 341, imageHeight: 380 },
  { id: "arequipe", name: "Arequipe", category: "cremosos", description: "Dulzura clásica y sabor a caramelo.", price: SHOP.retailPrice, color: "#C48B5B", pale: "#F6E4D3", fruit: "🍮", tag: "Dulce" },
  { id: "mango-biche", name: "Mango biche", category: "frutales", description: "Fresco, vibrante y deliciosamente ácido.", price: SHOP.retailPrice, color: "#A7C86C", pale: "#EFF6D8", fruit: "🥭", tag: "Refrescante" },
  { id: "fresa", name: "Fresa", category: "frutales", description: "Un clásico frutal, dulce y delicioso.", price: SHOP.retailPrice, color: "#F49AAB", pale: "#FCE3E7", fruit: "🍓", tag: "Clásico", image: "./assets/images/fresa-real.webp", imageAlt: "Foto real de bolis de fresa Capi Bolis", imageFrame: "framed", imageWidth: 354, imageHeight: 380 },
]);

export const CATEGORY_LABELS = Object.freeze({
  todos: "Todos los sabores",
  frutales: "Frutales",
  cremosos: "Cremosos",
});
