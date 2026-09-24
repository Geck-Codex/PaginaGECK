# Plan editorial del blog — arranque

Los primeros diez artículos, en orden de publicación. El objetivo de mercado son
**Chihuahua capital y Ciudad Juárez**, no Parral.

## La estrategia, y por qué el blog es la herramienta correcta

Geck Codex está físicamente en Hidalgo del Parral, y las dos ciudades que
importan comercialmente están a horas de distancia. Eso parte el SEO local en
dos juegos que se ganan de forma distinta:

| | Paquete de mapas | Resultados orgánicos |
| --- | --- | --- |
| Qué es | Las tres fichas con estrellas bajo el mapa | Los enlaces azules de siempre |
| Cómo se gana | Proximidad a una dirección verificada | Contenido y autoridad |
| ¿Se puede en Juárez sin oficina? | **No** | **Sí** |

De ahí la decisión: **no se pelea el mapa fuera de Parral, se pelea lo orgánico
en todo el estado.** El blog es la única pieza del sitio que puede posicionar en
una ciudad donde no hay domicilio, y por eso existe.

Lo que **no** se hace, por si alguien lo sugiere más adelante: cambiar la
dirección del perfil de Google Business a Chihuahua o Juárez. Google verifica
las fichas y suspende las que no corresponden a un lugar con personal. El riesgo
no es no ganar Juárez —que hoy no se tiene—: es perder Parral, que sí funciona.

## Cómo está pensado

1. **Aparecer en búsquedas que las páginas comerciales no pueden atacar.** La
   página de servicios compite por "desarrollo web México", donde hay cientos de
   agencias con años de autoridad. Un artículo compite por "cuánto cuesta una
   página web en Chihuahua", donde hay muchísimo menos.
2. **Entrenar a Google a volver.** Un sitio que no cambia se rastrea una vez al
   mes. El presupuesto de rastreo que gana el blog se derrama sobre las páginas
   que hoy siguen en cola sin indexar.
3. **Contestar antes de la llamada.** Quien llega a "¿necesito una app o una
   página?" y sale con la duda resuelta llega a la cotización sabiendo qué pide.

**Ritmo realista: uno cada dos semanas.** Es preferible a cuatro en enero y
ninguno en marzo. Google premia la constancia, no el atracón.

## Reglas que no conviene romper

- **La línea editorial es "las netas que nadie te dice".** Es el H1 del blog y es
  la prueba a la que se somete cada tema antes de escribirlo: ¿esto lo publica
  la competencia? Si la respuesta es sí, el artículo no vale la pena. Precios con
  número, errores propios, cuándo NO contratarnos, la letra chica que nadie
  enseña. Un "5 tendencias del desarrollo web" no lo lee nadie porque ya está
  escrito mil veces.
- **Una sola intención por artículo.** Si contesta dos preguntas, son dos
  artículos y los dos posicionan peor.
- **El título es la búsqueda.** Escríbelo como lo escribiría alguien en Google.
  Y si el artículo apunta a una ciudad, el nombre de la ciudad va en el título.
- **Menciona Parral solo cuando aporte.** No se oculta —está en el JSON-LD, en
  la página de contacto y en el aviso legal, y ocultarlo sería incoherente—,
  pero deja de ser el encabezado. Donde sí conviene sacarlo es al contestar de
  frente la objeción "no estás en mi ciudad", que es mejor resolver dentro del
  artículo que dejar que el lector la resuelva solo cerrando la pestaña.
- **Precios reales o ninguno.** Los números tienen que coincidir con
  `src/data/packages.js` y `src/data/ecosystem.js`. Una cifra distinta entre el
  blog y la página de servicios destruye la confianza que el artículo venía a
  construir.
- **Nada sobre clientes con el ecosistema conectado.** Ningún cliente lo tiene
  implementado todavía. Se puede decir que los productos están diseñados para
  conectarse; no que haya casos funcionando.
- **Enlaza a dos o tres artículos anteriores.** Es lo que reparte autoridad
  entre ellos y lo que hace que el conjunto valga más que la suma.

---

## Los once

### 1. ¿Cuánto cuesta una página web en Chihuahua en 2026? ✅ PUBLICADO

- **Búsqueda:** "cuanto cuesta una pagina web chihuahua", "precio pagina web"
- **Intención:** comercial, alta. Está a un paso de pedir cotización.
- **Por qué primero:** es la pregunta que ya te hacen todos, nadie la contesta
  con números, y filtra a quien no puede pagarte antes de gastarte una reunión.
- **Incluye** la sección que contesta la objeción de la distancia, y una
  comparación del mercado de la capital contra el de Juárez.
- **Conecta con:** `/servicios/a-medida/`

### 2. ¿Por qué mi página web no me trae clientes? ✅ PUBLICADO

- **Búsqueda:** "mi pagina web no vende", "por que mi pagina no genera clientes",
  "hacer pagina web con ia", "pagina web con chatgpt"
- **Intención:** mixta, y ahí está la fuerza. Atrapa a dos personas distintas:
  quien ya pagó una web que no le sirvió, y quien está por hacerse una con IA.
- **Por qué tan arriba:** es el argumento comercial más fuerte que tienes en
  2026. Ya no compites contra otras agencias — compites contra "lo hago yo en
  una tarde con IA". Ese artículo no discute que se pueda: concede que sí, y
  mueve la conversación a donde tú ganas.
- **La frase que lo ordena todo:** una página bonita que no vende es una foto
  bonita de Facebook. La ves, dices "qué padre", y te vas.
- **Ángulo:** lo que decide si una página vende no se ve en la pantalla.
  Que Google te encuentre, que haya un solo siguiente paso obvio, que cargue
  en un celular con mala señal, que midas resultados, que alguien responda
  cuando se rompa. Nada de eso sale de un prompt.
- **Cuidado con el tono:** no burlarse de quien usó IA. La postura honesta —"si
  solo necesitas existir, hazla con IA y no gastes de más"— vende muchísimo más
  confianza que el miedo, y deja bien parado al que sí necesita lo demás.
- **Conecta con:** artículo 1 (ya trae una versión corta de este argumento),
  `/servicios/a-medida/`

### 3. Página web bilingüe para negocios en la frontera ✅ PUBLICADO

- **Búsqueda:** "pagina web bilingue juarez", "sitio web ingles y español empresa"
- **Intención:** comercial, nicho geográfico muy definido.
- **Por qué segundo:** es el artículo más diferenciado del plan. Nadie en el
  estado lo está escribiendo, y le habla a la única característica que hace de
  Juárez un mercado distinto a cualquier otro de México.
- **Ángulo:** cobrar en dólares, el sitio en dos idiomas, y qué hay que decidir
  ANTES de empezar porque rehacerlo después cuesta el doble.
- **Ventaja extra:** el sitio ya está en tres idiomas — es prueba viva.
- **Conecta con:** `/servicios/a-medida/`, artículos 1 y 2
- **Publicado como** `/blog/pagina-web-bilingue-para-negocios-en-la-frontera/`.
  Se generalizó a toda la franja fronteriza —con una tabla de ciudades hermanas,
  de Tijuana a Matamoros— usando Juárez–El Paso como el ejemplo que ilustra
  todo, más una sección sobre cómo cambia la jugada según el tamaño de la ciudad
  de enfrente. El ángulo son
  cuatro decisiones que hay que tomar antes de empezar: dónde vive cada idioma
  (dirección propia y slug traducido, no un botón de traductor), en qué moneda
  se cotiza, qué se escribe en inglés en vez de traducirse, y cómo te contactan
  del otro lado. El artículo 1 ya lo enlaza desde su sección de Juárez.

### 4. ¿Necesito una app o me basta con una página web? ⏸ EN BORRADOR

- **Búsqueda:** "necesito una app o pagina web", "diferencia app y pagina web"
- **Intención:** informativa, pero de alguien con presupuesto.
- **Por qué:** es la duda que más dinero hace perder. Mucha gente paga $48,000
  por una app cuando necesitaba un sitio de $8,000 — y al revés.
- **Ángulo:** una lista honesta de cuándo SÍ vale una app. Decir "casi nunca la
  necesitas" vende más confianza que empujar el producto caro.
- **Conecta con:** `/servicios/a-medida/`, artículo 1
- **Escrito y archivado con `draft: true`** en
  `src/content/blog/necesito-una-app-o-una-pagina-web.md` (2026-09-24). Se
  descartó porque no pasa el filtro de la línea editorial: "app o página web"
  lo publica cualquier agencia, y no lleva ancla de ciudad ni de nicho (la
  lección del artículo 2, que cayó a la posición 65). Si se retoma, la salida es
  convertirlo en **"¿Cuánto cuesta una app en Chihuahua?"** —la fórmula del
  artículo 1— aprovechando el material: cuándo sí vale una app, la letra chica
  de las tiendas (Apple $99 USD/año, Google $25 USD una vez) y el punto
  intermedio con los módulos del ecosistema.

### 4b. Cuándo dejar Excel y tener un sistema propio en Ciudad Juárez ✅ PUBLICADO

- **No estaba en el plan original**; entró en lugar del 4.
- **Búsqueda:** "dejar excel por un sistema", "sistema a medida ciudad juarez",
  "software para empresas juarez"
- **Intención:** comercial, de quien ya siente el dolor. Talleres, proveedores
  de la maquila, transportistas y distribuidoras.
- **Por qué:** es el primer artículo que ataca Juárez de frente y el primero
  que vende software a medida y automatización, no la web.
- **Ángulo:** "la mayoría no necesita dejar Excel". Tres escalones (ordenar el
  Excel, automatizar desde $10,000, sistema propio) y siete señales de que
  Excel ya cuesta dinero, con la trazabilidad que pide la maquila como la señal
  propia de Juárez. La cuenta de horas la hace el lector con sus números.
- **Publicado como** `/blog/cuando-dejar-excel-por-un-sistema-propio-en-ciudad-juarez/`.
  Enlaza a los artículos 1 y 3, `/servicios/a-medida/` y `/servicios/ecosistema/`.

### 5. Cómo poner tu negocio en Google Maps (guía para Chihuahua y Juárez)

- **Búsqueda:** "poner mi negocio en google maps", "google mi negocio verificar"
- **Intención:** informativa, volumen local alto en las dos ciudades.
- **Por qué:** el artículo que más tráfico va a traer, y el más compartible.
- **Ángulo:** guía paso a paso de verdad, hasta la verificación. Regalar esto
  construye reputación — y de paso explica por qué una ficha verificada importa,
  que es el mismo argumento que sostiene tu propia estrategia.
- **Bonus:** es el tema que más circula en grupos de comerciantes locales, la
  vía más realista de conseguir tus primeros enlaces entrantes.

### 6. Punto de venta para negocios pequeños: qué revisar antes de comprar

- **Búsqueda:** "punto de venta para negocio pequeño", "sistema pos mexico precio"
- **Intención:** comercial.
- **Por qué:** Mi Caja POS es de tus módulos más vendibles y la competencia
  (Clip, Square) cobra comisión por transacción. Ese contraste es tu argumento.
- **Cuidado:** comparar con nombres reales exige ser exacto en sus precios o se
  vuelve en contra.
- **Conecta con:** `/servicios/ecosistema/`

### 7. Menú digital con QR para restaurantes: cómo funciona y cuánto cuesta

- **Búsqueda:** "menu digital qr restaurante", "menu qr precio mexico"
- **Intención:** comercial. Dueño de restaurante evaluando.
- **Por qué:** tu módulo más fácil de explicar y el más barato de contratar
  ($300/mes sin implementación). Puerta de entrada natural al ecosistema.
- **Ángulo:** cuánto cuesta reimprimir menús al año contra $300 al mes. La
  cuenta se hace sola.
- **Conecta con:** `/servicios/ecosistema/`, artículo 6

### 8. Chatbot de WhatsApp: qué resuelve de verdad y qué no

- **Búsqueda:** "chatbot whatsapp negocio", "bot de whatsapp para empresas precio"
- **Intención:** comercial.
- **Por qué:** tema con mucho humo alrededor. Un artículo que diga con claridad
  qué NO hace un bot te distingue de quien lo vende como magia.
- **Ángulo:** el bot no vende, filtra. Contesta las diez preguntas repetidas
  para que tú atiendas las que valen.
- **Conecta con:** paquete Negocio Conectado ($19,500)

### 9. Sistema de citas para barberías, clínicas y gimnasios

- **Búsqueda:** "sistema de citas para barberia", "agenda de citas online negocio"
- **Intención:** comercial, nicho claro.
- **Por qué:** Agend-In tiene comprador identificable, y son negocios que se
  recomiendan mucho entre sí dentro de una misma ciudad.
- **Ángulo:** el costo real de un hueco en la agenda y de las citas que no
  llegan.
- **Conecta con:** `/servicios/ecosistema/`

### 10. Cómo saber si tu página web está trabajando

- **Búsqueda:** "como saber si mi pagina web funciona", "metricas pagina web negocio"
- **Intención:** informativa, de alguien que YA tiene sitio.
- **Por qué:** le habla a quien pagó una web y sospecha que le vendieron aire.
  Ese es tu mejor prospecto: tiene presupuesto y ya se decepcionó una vez.
- **Ángulo:** cuatro cosas que puede revisar solo, gratis, hoy.

### 11. Errores al contratar a un desarrollador en México

- **Búsqueda:** "como contratar desarrollador web", "me estafaron pagina web"
- **Intención:** informativa con intención de rescate.
- **Por qué:** captura a quien ya tuvo una mala experiencia y busca cómo no
  repetirla. Aquí entra tu garantía de por vida sin sonar a venta.
- **Ángulo:** el dominio a nombre de quién, la entrega del código, el
  mantenimiento oculto.
- **Conecta con:** artículos 1, 2 y 10

---

## Lo que el blog solo no resuelve

El blog posiciona **artículos**, no tu oferta. Alguien que busca directamente
"desarrollo de software en Chihuahua" —intención de compra pura, sin duda que
resolver— no quiere leer un artículo: quiere una página de servicios.

Hoy no tienes ninguna página que apunte a esa búsqueda. La home dice "Parral,
Chihuahua" y `/servicios/` no nombra ciudades.

La pieza que falta son **páginas por ciudad**: `/desarrollo-web-chihuahua/` y
`/desarrollo-web-ciudad-juarez/`, cada una con su propio contenido real —el
mercado de esa ciudad, casos, preguntas específicas—, no la misma página con el
nombre cambiado, que Google detecta y descarta.

Es un trabajo aparte de este plan y conviene hacerlo **después** de que haya
tres o cuatro artículos publicados: esas páginas necesitan enlaces internos que
las sostengan, y los artículos son quienes se los van a dar.

## Después de los once

Cuando estos estén publicados y alguno empiece a traer visitas, el siguiente
paso **no** es escribir diez más a ciegas: es abrir Search Console, ver por qué
búsquedas te está apareciendo el blog sin que tú las hayas buscado, y escribir
sobre ésas. Esas búsquedas son datos reales de tu mercado; esta lista es una
hipótesis.

## Cómo publicar

Los artículos se escriben en el repo, no en un panel. El camino es el mismo que
el de cualquier cambio de código, y eso es deliberado: el artículo pasa por
revisión antes de salir, igual que todo lo demás.

1. El artículo se escribe como `.md` en `src/content/blog/`, siguiendo la skill
   `escribir-articulo`.
2. `node scripts/generate-blog-cover.mjs <slug>` para la portada.
3. `npm run build` — valida el frontmatter y falla si algo no cumple.
4. Commit en `astro` y pull request a `main`.
5. Netlify reconstruye al hacer merge. En minutos está en línea.

Para guardar un artículo a medias sin publicarlo, `draft: true` en el
frontmatter: queda fuera del blog, del sitemap y del feed hasta que se apague.
