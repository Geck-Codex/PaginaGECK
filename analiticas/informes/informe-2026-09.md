---
periodo_inicio: 2026-09-01
periodo_fin: 2026-09-18
generado: 2026-09-18
comparado_con: ninguno
metricas:
  sesiones: 78.0
  usuarios: 51.0
  vistas: 302.0
  eventos: 476.0
  eventos_clave: 0
  leads: 2.0
  tasa_interaccion_pct: 71.8
  conversion_sesion_lead_pct: 2.56
---

# Analitica — 2026-09-01 a 2026-09-18

**Periodo parcial: del 1 al 18 de septiembre.** El mes no ha cerrado, así que
estas cifras no son comparables con las de un mes completo.

78 sesiones y 51 personas. De esas 78 visitas salieron **2 contactos, y ninguno
cerró**: la web está trayendo gente pero todavía no clientes. Con estos números
no hay un problema de tráfico que arreglar — hay un problema de qué pasa cuando
la gente llega, y sobre todo de que **el tráfico no se puede atribuir**: el 56 %
de las visitas entran como "Direct", que es la forma que tiene Analytics de decir
"no sé qué las trajo".

Todo el tráfico es orgánico o propio: **no hay ni ha habido inversión
publicitaria**, así que estas 78 sesiones son lo que el sitio produce por sí solo.

No hay periodo anterior con el que comparar: éste es el primer informe. Agosto
existe en GA4 (9 sesiones, 0 contactos) pero es un mes tan pequeño que compararlo
no diría nada.

**Lo único que conviene hacer antes del próximo informe: etiquetar con UTM los
enlaces que se mandan por WhatsApp y los de Instagram.** Mientras más de la mitad
del tráfico sea inatribuible, cualquier conclusión sobre qué funciona es una
corazonada.

## 1. Las cifras

| Metrica | Este periodo | Anterior | Variacion |
|---|---|---|---|
| Sesiones | 78 | — | — |
| Usuarios | 51 | — | — |
| Vistas de pagina | 302 | — | — |
| Eventos | 476 | — | — |
| Eventos clave | 0 | — | — |
| Leads (generate_lead) | 2 | — | — |
| Tasa de interaccion % | 71.80 | — | — |
| Conversion sesion->lead % | 2.56 | — | — |


## 2. De donde llega la gente

| Canal | Sesiones | % del total |
|---|---|---|
| Direct | 44 | 56.4 % |
| Organic Search | 17 | 21.8 % |
| Organic Social | 10 | 12.8 % |
| Paid Search | 3 | 3.8 % |
| Unassigned | 3 | 3.8 % |
| Cross-network | 1 | 1.3 % |

**Ese 56 % de "Direct" casi con seguridad no es gente tecleando geckcodex.com.**
Es el cajón donde Analytics mete lo que no puede identificar: clics desde
WhatsApp, desde apps, desde enlaces sin etiquetar. En un negocio que se mueve
mandando su enlace por mensaje esto es lo esperable — pero significa que de 44 de
las 78 visitas no se sabe qué las originó.

Lo bueno: **Google ya aporta 17 sesiones orgánicas (22 %)**, que para un sitio que
en agosto estaba prácticamente sin indexar es señal real de que la indexación se
destrabó.

Hay **3 sesiones etiquetadas como `google / cpc`, y no corresponden a ninguna
campaña**: nunca se ha contratado Google Ads. En GA4 esas tres llegan con campaña
`(not set)`, cuando una campaña real de Ads traería su nombre por el etiquetado
automático. Lo más probable es que alguien entrara con una URL que llevaba un
parámetro `gclid` pegado de otro sitio, que es lo que hace a GA4 clasificar la
visita como pago.

**No hay gasto publicitario que revisar ni campaña que optimizar.** Con 3
sesiones tampoco vale la pena investigar más: si el próximo mes vuelve a
aparecer y crece, entonces sí conviene mirarlo.

Instagram aporta 7 sesiones (`ig / social`) y Facebook 3 entre sus dos entradas.

**Qué hacer:** poner UTM en todo enlace que salga a mano. Para WhatsApp,
`https://geckcodex.com/?utm_source=whatsapp&utm_medium=chat`; para la bio de
Instagram, `utm_source=instagram&utm_medium=bio`. Es gratis, y el próximo informe
ya separa lo que hoy es un bloque opaco.


## 3. Que paginas ven

| Pagina | Vistas | Usuarios | Tiempo medio |
|---|---|---|---|
| / | 135 | 43 | 0:28 |
| /portafolio/ | 31 | 10 | 0:37 |
| /blog/ | 30 | 4 | 1:39 |
| /nosotros/ | 26 | 7 | 0:42 |
| /servicios/ | 23 | 4 | 0:52 |
| /contacto/ | 11 | 5 | 0:06 |
| /servicios/a-medida/ | 10 | 3 | 0:55 |
| /servicios/ecosistema/ | 8 | 2 | 0:37 |
| /blog/por-que-mi-pagina-web-no-me-trae-clientes/ | 6 | 2 | 0:16 |
| /en/ | 6 | 2 | 0:12 |
| /blog/cuanto-cuesta-una-pagina-web-en-chihuahua/ | 4 | 2 | 0:03 |
| /en/portfolio/ | 4 | 1 | 0:09 |

Aquí está el hallazgo del mes.

**`/contacto/` retiene 6 segundos.** Es la página con menos permanencia de todo el
sitio, y la única cuyo propósito es que alguien haga algo. Seis segundos es el
tiempo de mirar y salir. Llegaron 5 personas y 2 escribieron, así que no es que la
página no sirva — pero de todas, es la que más desentona: la home retiene 28 s y
`/servicios/` 52 s.

**El blog es lo que más engancha.** `/blog/` retiene 99 segundos, casi el doble
que cualquier otra página, aunque solo con 4 personas. Los artículos sueltos, en
cambio, retienen poco (16 s y 3 s). Lectura probable: el índice del blog gusta y
los artículos aún no retienen, o son demasiado nuevos para tener lectores llegados
de Google.

**El recorrido hacia contacto se estrecha mucho:** 43 personas en la home, 4 en
`/servicios/`, 5 en `/contacto/`. De cada diez que entran, una llega a servicios.
Eso apunta a que la home no está empujando hacia el catálogo.

Las páginas en inglés (`/en/`, `/en/portfolio/`) tienen 2 usuarios: existen y se
visitan, poco.


## 4. Que hacen

| Evento | Recuento | Eventos clave |
|---|---|---|
| page_view | 302 | 0 |
| session_start | 75 | 0 |
| first_visit | 41 | 0 |
| scroll | 30 | 0 |
| user_engagement | 22 | 0 |
| click | 4 | 0 |
| generate_lead | 2 | 0 |


## 5. El embudo

| Escalon | Cantidad | % de las sesiones |
|---|---|---|
| Sesiones | 78 | 100.0 % |
| Sesiones con interaccion | 56 | 71.8 % |
| Contactos (generate_lead) | 2 | 2.6 % |


De 78 sesiones, 56 tuvieron interacción real (72 %) y **2 terminaron en un
contacto: el 2,6 %**.

Para un sitio de servicios ese 2,6 % no es malo en sí. El problema es otro: **son
dos personas**. Con dos, cualquier lectura porcentual es ruido — si el mes que
viene son cuatro, no se habrá "duplicado la conversión", habrá habido dos
contactos más. Conviene seguir esto en números absolutos durante varios meses
antes de sacar conclusiones de tendencia.

**No se sabe por dónde llegaron esos 2 contactos.** Las dimensiones `method` y
`where` se crearon el 18 de septiembre y GA4 no las aplica hacia atrás, así que
aparecen como `(not set)`. Desde ahora sí se registran: el próximo informe podrá
decir si los contactos vienen de WhatsApp o del formulario, y desde qué sección.

**Ninguno de los 2 contactos cerró.** Ese es el dato confirmado a mano, y ninguna
herramienta puede medirlo: GA4 sabe que alguien pulsó WhatsApp, no qué pasó en la
conversación.

El embudo completo del periodo queda así:

| Escalón | Cantidad |
|---|---|
| Sesiones | 78 |
| Con interacción | 56 |
| Contactos | 2 |
| Propuestas enviadas | (sin dato) |
| Clientes | **0** |
| Ingresos atribuibles a la web | **0 MXN** |

Dicho sin rodeos: **en lo que va de septiembre la web no ha producido ingresos.**
No es motivo de alarma con 78 sesiones —el volumen es demasiado bajo para esperar
cierres— pero fija el punto de partida. Para el próximo informe conviene anotar de
cada contacto: de dónde vino, qué pidió y en qué quedó. Son tres campos, y son los
que convierten esta sección en información de negocio en vez de una cuenta de
clics.


## 6. Busqueda en Google


**Indexacion al 2026-09-13:** 11 indexadas, 19 sin indexar.

**No hay datos de consultas este periodo:** falta exportar el informe de
Rendimiento de Search Console (Rendimiento → Resultados de búsqueda → Exportar) y
dejarlo en `analiticas/`. Sin eso no se puede decir qué se busca para llegar al
sitio, ni separar las búsquedas de marca de las que no lo son.

Lo que sí hay es la cobertura de indexación, y está a medias: **11 páginas
indexadas y 19 sin indexar** al 13 de septiembre, con 18 en "Descubierta:
actualmente sin indexar". Google conoce esas páginas y ha decidido no incluirlas
todavía, cosa habitual en sitios jóvenes con pocos enlaces entrantes.

Que 17 sesiones ya lleguen por orgánico con solo 11 páginas indexadas sugiere que
el problema no es técnico sino de antigüedad y autoridad. Conviene volver a
mirarlo en el informe de octubre antes de tocar nada.


## 7. Estado de la medicion

**Corregido hoy, 18 de septiembre:**

- `generate_lead` **no estaba marcado como evento clave**. Por eso este informe
  muestra `eventos_clave: 0` pese a haber 2 contactos reales: el evento llegaba,
  GA4 no lo contaba como conversión. Ya está marcado, con conteo *una vez por
  sesión*. **Ese 0 es histórico y no se va a rellenar hacia atrás.**
- Las dimensiones `method` y `where` **no existían**, así que GA4 descartaba esos
  parámetros aunque `src/data/track.js` los enviaba en cada evento. Ya creadas.
- La propiedad traía de fábrica los eventos clave `purchase`, `close_convert_lead`
  y `qualify_lead`, que **el sitio no emite nunca**. Estaban contando cero de
  forma permanente. Se dejaron como estaban; no estorban.

**Pendiente — CTAs sin medir:** solo llaman a `trackLead()` el pie, `/contacto/` y
`ServicesSection`. Otros enlaces de WhatsApp del sitio abren el chat sin registrar
nada, así que hay contactos que ocurren y no aparecen en ningún informe. Vale la
pena repasarlos antes de sacar conclusiones sobre qué sección convierte.

**Nota para cuando haya Google Ads:** hoy no hay campañas y las variables
`PUBLIC_GOOGLE_ADS_ID` y `PUBLIC_ADS_CONVERSION_LABEL` están vacías, que es lo
correcto. El código de `Analytics.astro` ya está preparado para enviar la
conversión en cuanto se rellenen, así que el día que se contrate Ads eso es lo
primero que hay que hacer: una campaña que no recibe conversiones optimiza a
ciegas.


## 8. Que hacer ahora

Por orden de lo que más mueve la aguja:

**1. Etiquetar con UTM los enlaces de WhatsApp e Instagram.** Hoy el 56 % del
tráfico es inatribuible. Coste: cero. Debería mover el reparto de la sección 2,
con "Direct" bajando y apareciendo fuentes reales.

**2. Revisar `/contacto/`: 6 segundos de permanencia.** Es la página más
importante del sitio y la que menos retiene. Mirar qué se ve sin hacer scroll: si
el formulario o el botón de WhatsApp quedan por debajo, subirlos. Debería mover la
permanencia de esa página en la sección 3, y con suerte los contactos.

**3. Empujar de la home hacia `/servicios/`.** 43 personas en la home, 4 en
servicios. El catálogo es donde están los precios y los paquetes, y casi nadie
llega. Debería mover los usuarios de `/servicios/` en la sección 3.

**4. Exportar Search Console cada mes.** Sin las consultas, este informe está
ciego a la mitad del canal orgánico. Son dos clics y una carpeta.

**Nota de seguimiento:** el artículo `por-que-mi-pagina-web-no-me-trae-clientes`
cambió de URL y tiene visitas en la antigua. El redirect 301 ya está escrito en
`netlify.toml` pero **todavía sin desplegar**: hasta que se suba, esas visitas dan
404.


---

## Procedencia de los datos

| Archivo | Tablas reconocidas |
|---|---|
| GA4 API · canales (sessionDefaultChannelGroup) | 1 |
| GA4 API · fuentes (sessionSourceMedium) | 1 |
| GA4 API · paginas (pagePath) | 1 |
| GA4 API · eventos (eventName) | 1 |
| GA4 API · leads (eventName+customEvent:method+customEvent:where) | 1 |
| GA4 API · dispositivos (deviceCategory) | 1 |
| GA4 API · ciudades (city) | 1 |
| GA4 API · paises (country) | 1 |
| GA4 API · serie (date) | 1 |
| Gráfico (2).csv | 1 |
| Problemas críticos (1).csv | 1 |


**Avisos de la ingesta:**

- Search Console no viene por esta via: sus CSV se siguen dejando en analiticas/.
