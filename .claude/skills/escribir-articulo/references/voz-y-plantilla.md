# Voz de marca y esqueleto del artículo

## La voz, en cinco reglas

**1. Contesta la pregunta en los primeros tres párrafos.** Nada de "en el mundo
digital de hoy, la presencia en línea es más importante que nunca". Quien llegó
buscando un precio quiere el precio. Dáselo y después explícalo.

**2. Da los números que nadie da.** El diferenciador completo del blog es que
publica cifras reales mientras la competencia pide llenar un formulario. Si un
artículo puede llevar una tabla de precios, la lleva.

**3. Concede antes de discutir.** Es la regla que más convierte. Cuando el lector
trae una objeción buena —"con IA la hago yo", "tú no estás en mi ciudad"—, lo
primero es darle la razón en lo que la tiene. Después se mueve la conversación
a donde la empresa gana de verdad. Negar lo evidente pierde al lector en la
primera línea.

**4. Recomienda en contra de la venta cuando sea honesto.** "Si tu negocio apenas
arranca, estás en el primer renglón; no dejes que nadie te venda el último."
Esa frase vende más que cualquier argumento, porque demuestra que no estás
empujando lo caro.

**5. Habla como se habla, sin caer en relajo.** Frases cortas. Segunda persona.
Cero palabras de consultor: sinergia, holístico, solución integral, ecosistema
digital. Nada de emojis. El lector es un dueño de negocio ocupado, no un colega.

### Lo que nunca

- Burlarse de quien usa IA, de quien cobra barato o de quien no sabe de tecnología.
- Miedo como argumento ("si no tienes web vas a desaparecer").
- Promesas de posición ("te ponemos #1 en Google"). No se puede prometer.
- Inventar casos de clientes o resultados que no ocurrieron.
- Tecnicismos sin traducir. Si hay que decir "Core Web Vitals", explicarlo en la
  misma frase: "la velocidad que Google mide".

## Esqueleto que funciona

```
[Gancho: la pregunta tal como se la hace el lector, y por qué nadie se la contesta]
[Respuesta directa, en 2-3 párrafos. Tabla si hay números.]

## La respuesta corta
   Lo concreto, arriba. Tabla de rangos o lista breve.

## [El desglose: en qué se va el dinero / qué cambia entre opciones]
   Párrafos con negrita al inicio de cada factor. Fáciles de barrer con la vista.

## "[La objeción, entre comillas, como la diría el lector]"
   Conceder lo cierto → mover la conversación. Una o dos por artículo, no más.

## [Lo que nadie te avisa]
   El costo oculto, la letra chica, la señal de alarma. Aquí se gana la confianza.

## [Cómo decidir / cómo comparar]
   Lista numerada y accionable. Que el lector se lleve algo aunque no te contrate.

## [Cómo lo hacemos nosotros]
   Una sola sección comercial, al final, sin disfrazarla de consejo.

## [Cierre que devuelve la pregunta]
   Sin presión. El bloque de contacto ya lo pone la plantilla automáticamente.
```

No hace falta seguirlo al pie de la letra. Lo que sí conviene conservar es el
orden: **respuesta → desglose → objeciones → letra chica → acción → oferta.**
La oferta siempre al final.

## Detalles de formato

- **H2 para las secciones, H3 solo si una sección se parte de verdad.** Los H2
  son lo que Google lee para entender la estructura.
- **Tablas** para comparar precios u opciones. La plantilla ya les pone scroll
  horizontal en celular, así que no hay que limitarlas a tres columnas.
- **Negritas** al inicio de cada punto de una lista larga, para que se pueda
  barrer sin leer todo.
- **Sin imágenes decorativas.** Solo si aportan información. La portada es
  opcional y vale más no ponerla que poner un banco de imágenes genérico.
- **Cajas de acción con `>` (blockquote).** La plantilla las pinta con fondo
  propio, borde dorado y una lupa. Van SOLO para lo que el lector puede hacer
  ahora mismo —el "cómo comprobarlo"—, nunca para explicación ni para citas.
  Si todo es caja, nada resalta: dos o tres por artículo como máximo.
  Ejemplo: `> **Cómo comprobarlo:** busca en Google site:tudominio.com`
- **Nada de iconos junto a los encabezados.** Un H2 con un emoji o un icono al
  lado se ve a PowerPoint y no aporta nada a quien barre el texto: lo que guía
  la vista es la jerarquía y las cajas, no la decoración.
- Los precios se escriben con separador de miles y sin decimales: `$19,500`.
- Rangos con guion corto entre espacios: `$5,000 – $8,000`.

## Portadas con imagen generada

El generador de imágenes hace la FOTO; el texto lo pone siempre
`scripts/generate-blog-cover.mjs` con las fuentes de marca. Los modelos escriben
mal las letras —acentos inventados, "GECK CODEEX"—, así que la imagen se pide
sin una sola palabra.

Flujo: generas la imagen → la guardas donde sea → corres

```
node scripts/generate-blog-cover.mjs <slug> --bg ruta/a/la/imagen.png --force
```

El script la recorta a 1200×630, le encima un velo azul marino que se abre hacia
la derecha, y acota el título al 62% izquierdo para no tapar el sujeto.

### Prompt base (no cambia, solo se le pega el sujeto)

```
Imagen editorial para la portada de un artículo de blog de una agencia
de desarrollo de software premium.

ESTILO: fotografía editorial oscura y minimalista, muy limpia, aire de
revista de negocios. Iluminación lateral dramática con una sola fuente
de luz cálida. Mucho espacio negativo. Sombras profundas.

PALETA ESTRICTA: fondo azul marino casi negro (#0D1625). Acentos en
champagne dorado (#C3AD85) y bronce (#957952). Detalles en marfil
(#F5F1E8). Ningún otro color: nada de azul eléctrico, cian, morado
ni verde.

COMPOSICIÓN: el sujeto ocupa el TERCIO DERECHO de la imagen. Los dos
tercios de la izquierda quedan casi vacíos y oscuros.

FORMATO: horizontal, 1536x1024.

MUY IMPORTANTE: sin ningún texto, sin letras, sin números, sin
logotipos, sin marcas de agua. Sin personas. Sin laptops genéricas ni
oficinas de stock. Sin collages ni elementos flotando. Un solo sujeto.

SUJETO: [aquí va]
```

### Sujetos

El hilo conductor son **objetos reales de latón, luz cálida, fondo oscuro**. Es
lo que hace que diez portadas generadas en diez días distintos se vean de la
misma familia. No mezclar ilustraciones planas con fotografía: el blog se ve
armado a pedazos.

| Artículo | Sujeto |
| --- | --- |
| Precios | Balanza de latón antigua de dos platos sobre piedra oscura, un haz de luz cálida desde arriba a la derecha |
| Por qué no trae clientes | Timbre de recepción de latón sobre un mostrador de madera oscura vacío, polvo suspendido en la luz |
| Juárez bilingüe | Dos llaves de latón idénticas colgando juntas de un gancho, muro de concreto oscuro |
| App o web | Dos cajas de latón cerradas de distinto tamaño sobre piedra oscura |
| Google Maps | Chincheta de latón clavada en un mapa de papel viejo, primer plano cerrado |

Si un artículo no tiene sujeto asignado, buscar un **objeto físico que sea
metáfora de la decisión** del lector, no del tema. Una balanza no es "precios":
es "estoy pesando si vale la pena". Eso es lo que hace que la imagen signifique
algo en vez de decorar.

## Datos de la empresa que se pueden usar

Verificar siempre contra `src/data/packages.js` y `src/data/ecosystem.js` — esto
es solo el resumen para saber qué existe:

- **Solo la página web** (es el rango que se publica en el blog): plantilla desde
  $1,500, a medida desde $5,000, y **hasta $22,000** cuando el trabajo de
  posicionamiento es a fondo. Lo que mueve el precio dentro del rango no es el
  diseño: es qué tan peleada está la palabra clave, cuántas páginas hay que
  escribir y cuánto contenido lleva. Tienda, app y chatbot **no** van en ese
  rango — son otra conversación y otro artículo.
- **A medida** (se cobra una vez, el código es del cliente al liquidar): web desde
  $5,000; automatizaciones desde $10,000; apps desde $20,000. Paquetes de
  referencia: Presencia Digital $5,000–$8,000, Chatbot $15,000, App MVP
  $20,000–$25,000, Negocio Conectado $19,500, Expansión Comercial $48,000,
  Transformación 360 $75,000, E-commerce $15,000–$18,000 / $35,000–$45,000, y
  Enterprise desde $85,000.
- **Ecosistema** (productos propios que se dan de alta): **$300 al mes por módulo,
  sin costo de implementación.** Menú Digital QR, Mi Caja POS, Nuki (lealtad),
  CRM, Agend-In (citas), NFC Reseñas. La web de plantilla del ecosistema arranca
  en $1,500 — no confundirla con el paquete Presencia Digital.
- **Mantenimiento:** $2,500 / $5,500 / $12,000 al mes. El lead es "no vendemos
  horas de soporte".
- **Formas de pago:** anticipo y saldo, o por etapas. Nunca todo por adelantado.
- **Garantía:** los bugs del código propio se corrigen sin costo, de por vida.
