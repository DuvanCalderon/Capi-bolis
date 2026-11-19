/**
 * Catálogo EDITABLE. Los sabores son ejemplos, todavía no están confirmados.
 * El precio de referencia ($3.000) proviene del aviso de Canva.
 * IMPORTANTE: validar estos datos con el negocio antes de publicar.
 */
export const SHOP = Object.freeze({
  brand: "Capi Bolis",
  whatsapp: "573185500770", // Número mostrado en el aviso de Canva; confirmar que reciba pedidos.
  alternatePhone: "3224805443",
  referencePrice: 3000,
  catalogIsDemo: true,
  maxPerFlavor: 99,
});

export const PRODUCTS = Object.freeze([
  { id: "fresa", name: "Fresa suave", category: "cremosos", description: "Un clásico dulce y delicado.", price: 3000, color: "#F49AAB", pale: "#FCE3E7", fruit: "🍓", tag: "El clásico" },
  { id: "mango", name: "Mango tropical", category: "frutales", description: "Un toque tropical para refrescarte.", price: 3000, color: "#F4B65E", pale: "#FFF1D9", fruit: "🥭", tag: "Tropical" },
  { id: "mora", name: "Mora silvestre", category: "frutales", description: "Frutal, intenso y muy antojable.", price: 3000, color: "#AE92CB", pale: "#F0E8F7", fruit: "🫐", tag: "Frutal" },
  { id: "coco", name: "Coco cremosito", category: "cremosos", description: "Suave y con sabor a vacaciones.", price: 3000, color: "#E4CDB4", pale: "#F7EDE1", fruit: "🥥", tag: "Suavecito" },
  { id: "maracuya", name: "Maracuyá", category: "frutales", description: "Ácido, alegre y refrescante.", price: 3000, color: "#EBC86D", pale: "#FFF5D7", fruit: "✨", tag: "Refrescante" },
  { id: "chocolate", name: "Chocolate", category: "cremosos", description: "Para quienes aman lo chocolatudo.", price: 3000, color: "#B98E78", pale: "#EFE3DA", fruit: "🍫", tag: "Golosito" },
]);

export const CATEGORY_LABELS = Object.freeze({
  todos: "Todos los sabores",
  frutales: "Frutales",
  cremosos: "Cremosos",
});
