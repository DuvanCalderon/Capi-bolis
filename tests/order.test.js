import test from "node:test";
import assert from "node:assert/strict";
import { validateOrder, buildOrderMessage, buildWhatsAppURL, PAYMENT_LABELS, todayLocalISO } from "../js/order.js";

const lines = [{ id:"fresa",name:"Fresa suave",price:3000,quantity:2,subtotal:6000 }];
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
 const text=buildOrderMessage(lines, form, 6000);
 assert.match(text,/Fresa suave: 2/);
 assert.match(text,/6\.000/);
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
