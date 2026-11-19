import test from "node:test";
import assert from "node:assert/strict";
import { validateOrder, isRealISODate, buildOrderMessage, buildWhatsAppURL, PAYMENT_LABELS, todayLocalISO } from "../js/order.js";

const lines = [{ id:"fresa",name:"Fresa",price:2500,quantity:2,subtotal:5000 }];
const form = { name:"Luisa",phone:"300 123 4567",date:"2099-12-25",delivery:"domicilio",address:"Calle 123 # 45-67",payment:"por_acordar",notes:"Sin azúcar extra" };

test("pedido válido pasa validación",()=>assert.deepEqual(validateOrder(form, lines, "2099-01-01"),{}));
test("carrito vacío y datos faltantes indican errores",()=>{
 const errors = validateOrder({name:"",phone:"",date:"",delivery:"",payment:""}, [], "2026-01-01");
 assert.ok(errors.cart && errors.name && errors.phone && errors.date && errors.delivery && errors.payment);
});
test("domicilio exige dirección, recogida no",()=>{
 assert.ok(validateOrder({...form,address:""}, lines, "2026-01-01").address);
 assert.equal(validateOrder({...form,delivery:"recogida",address:""}, lines, "2026-01-01").address, undefined);
});
test("rechaza fecha pasada y acepta fecha futura",()=>{
 assert.ok(validateOrder({...form,date:"2020-01-01"}, lines, "2026-01-01").date);
 assert.equal(validateOrder(form, lines, "2099-01-01").date, undefined);
});
test("mensaje incluye sabores, cantidades, subtotal, fecha y modalidad",()=>{
 const text=buildOrderMessage(lines, form, 5000);
 assert.match(text,/Fresa: 2/);
 assert.match(text,/5\.000/);
 assert.match(text,/2099-12-25/);
 assert.match(text,/Calle 123/);
 assert.match(text,/confirmación/);
 assert.equal(PAYMENT_LABELS.por_acordar,"Por acordar con el negocio");
});
test("WhatsApp codifica el mensaje y verifica el número",()=>{
 const text="Bolis & fresa 🍓\nHola!";
 const u=buildWhatsAppURL("57 318 550 0770",text);
 assert.ok(u.startsWith("https://wa.me/573185500770?text="));
 assert.equal(new URL(u).searchParams.get("text"),text);
 assert.throws(()=>buildWhatsAppURL("123",text));
});
test("fecha local ISO tiene formato válido",()=>{
 assert.equal(todayLocalISO(new Date(2026,10,19)),"2026-11-19");
});

test("no acepta fechas imposibles del calendario", () => {
  assert.equal(isRealISODate("2099-02-31"), false);
  assert.equal(isRealISODate("2099-02-28"), true);
  assert.ok(validateOrder({ ...form, date:"2099-02-31" }, lines, "2026-01-01").date);
});

test("mensaje mayorista usa precio $2000, 13 unidades y ahorro real", () => {
  const major = [{ id:"oreo", name:"Oreo", quantity:13, price:2000, subtotal:26000 }];
  const message=buildOrderMessage(major, form, 26000);
  assert.match(message, /Oreo: 13/);
  assert.match(message, /Al por mayor/);
  assert.match(message, /2\.000/);
  assert.match(message, /6\.500/);
  assert.match(message, /26\.000/);
  assert.equal(new URL(buildWhatsAppURL("573185500770", message)).searchParams.get("text"), message);
});

test("mensaje con 12 bolis no indica descuento mayorista", () => {
  const normal = [{ id:"fresa", name:"Fresa", quantity:12, price:2500, subtotal:30000 }];
  const message=buildOrderMessage(normal, form, 30000);
  assert.match(message, /hasta 12 bolis/);
  assert.doesNotMatch(message, /Ahorro por mayor/);
  assert.match(message, /30\.000/);
});
