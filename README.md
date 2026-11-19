# 🍧 Capi Bolis — sitio web (MVP v1)

Primera versión de una web de **bolis gourmet caseros** con catálogo interactivo y preparación de pedidos mediante WhatsApp. Diseñada con una estética suave y minimalista.

> ⚠️ **Prototipo:** el catálogo, los sabores, las condiciones de entrega y los medios de pago están pendientes de aprobación. Antes de compartirlo con clientes, valida la información del negocio.

## Qué puede hacer

- Explorar y filtrar 6 **sabores de ejemplo** (frutales y cremosos).
- Agregar/quitar unidades por sabor; ver subtotales, cantidades y total estimado.
- Indicar nombre, contacto, fecha solicitada, domicilio o recogida y pago preferido.
- Exigir dirección solo si se elige domicilio.
- Validar carrito vacío, cantidades, teléfono, nombre y fechas.
- Revisar el texto exacto del pedido antes de abrir WhatsApp.
- Abrir WhatsApp con los datos y precios codificados en una URL segura.
- Funciona desde móvil, con teclado y sin servidor ni registro de datos.

**Importante:** WhatsApp no envía ni confirma automáticamente el pedido. El cliente debe pulsar Enviar y el negocio debe confirmar disponibilidad, costo final y entrega. La web no cobra dinero.

## Tecnologías

HTML semántico, CSS mobile-first y JavaScript (ES Modules). Sin React, backend, build ni dependencias de producción.

```
.
├── index.html
├── css/styles.css
├── js/
│   ├── products.js    # sabores, precios y WhatsApp del negocio
│   ├── cart.js        # lógica de cantidades y subtotales
│   ├── order.js       # validaciones y mensaje
│   └── main.js        # interacciones y DOM
├── assets/favicon.svg
├── tests/
│   ├── cart.test.js
│   └── order.test.js
├── package.json
└── README.md
```

## Probar en tu equipo

Puedes ejecutar un servidor estático local (los módulos JavaScript no siempre funcionan al abrir `index.html` con `file://`).

```bash
git clone https://github.com/DuvanCalderon/Capi-bolis.git
cd Capi-bolis
python -m http.server 8000
```

Abre **http://localhost:8000**. Como alternativa, usa Live Server en VS Code.

### Pruebas automatizadas

Con Node.js 20+:

```bash
npm test
```

No necesitas instalar dependencias.

## Configurar antes de publicar

**1.** Edita `js/products.js`:

- `SHOP.whatsapp`: número de WhatsApp de pedidos en formato internacional **57XXXXXXXXXX**. Actualmente `573185500770`, obtenido del aviso original, **no confirmado** como canal de pedidos.
- `SHOP.alternatePhone`: teléfono secundario del aviso.
- `PRODUCTS`: nombres, categorías, descripciones, colores y precios. Los **6 sabores son demostrativos**, no una afirmación de disponibilidad.
- El precio utilizado es **$3.000 COP** por unidad, el que figura en el aviso histórico de Canva; actualizar si cambió.

**2.** Confirmar y ajustar: recogida/domicilios, cobertura, recargos, antelación y franjas horarias, medios de pago, fotos reales, privacidad y teléfonos de contacto.

**3.** Revisar textos de ejemplo de `index.html`. Los métodos de pago y modalidades visibles están marcados **por confirmar**; el sitio no los promete.

**4.** Probar pedido desde móvil y abrir el enlace de WhatsApp real antes de anunciar el sitio.

## Publicar con GitHub Pages

1. Ir a **Settings → Pages** en el repositorio.
2. En **Build and deployment** elegir **Deploy from a branch**.
3. Seleccionar `main` y `/(root)`; guardar.
4. Cuando GitHub confirme el despliegue, probar el enlace que muestre la sección Pages.

> La subida de archivos al repositorio no activa ni verifica GitHub Pages automáticamente.

## Identidad visual

Referencia: aviso de Canva «Bolis Gourmet». Se reutilizaron **#FFC8C5** (rosa) y **#7FC6C2** (verde agua), con una paleta crema y tipografía suave. Las ilustraciones SVG son originales de esta versión (no fotografías de producto).

- [Documentación del proyecto en Notion](https://app.notion.com/p/40760fb53673804181edc620cca28d86)
- [Aviso original en Canva](https://www.canva.com/design/DAGOnTjzZAI/P7DlqAO2JHBAOiMWFeo-zA/edit)

## Privacidad

No se usa `localStorage` ni se envían datos a servidores del proyecto. Los datos del formulario se mantienen en memoria para redactar el mensaje, que solo se comparte si el usuario decide enviarlo mediante WhatsApp. El enlace de WhatsApp sí transferirá los datos introducidos al servicio cuando se abra.

Hecho con cariño para **Capi Bolis**. 💚
