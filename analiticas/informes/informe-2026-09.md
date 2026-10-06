---
periodo_inicio: 2026-09-01
periodo_fin: 2026-09-23
generado: 2026-09-24
comparado_con: ninguno
metricas:
  sesiones: 97.0
  usuarios: 59.0
  vistas: 393.0
  eventos: 628.0
  eventos_clave: 2.0
  leads: 5.0
  leads_reales: 0  # los 5 son pruebas propias, confirmado 2026-09-24
  tasa_interaccion_pct: 75.3
  conversion_sesion_lead_pct: 5.15  # sobre leads medidos; sobre leads reales es 0
---

# Analitica — 2026-09-01 a 2026-09-23

**Periodo parcial: del 1 al 23 de septiembre.** El mes no ha cerrado, asi que
estas cifras no son comparables con las de un mes completo.

97 sesiones y 59 personas. **Contactos reales: cero.** Los 5 eventos
`generate_lead` del mes son pruebas propias — confirmado el 24 de septiembre. Todo lo
que diga "5 contactos" mas abajo hay que leerlo como "5 pruebas": las tablas salen de
GA4 tal cual, y GA4 no sabe distinguirlas.

Ese es el dato del mes y no hay forma de suavizarlo: **de 97 sesiones, ninguna termino
en alguien escribiendo**. No es un problema de medicion (el evento llega, se dispara y
esta marcado como clave) ni de trafico (97 sesiones es poco, pero no cero). Es que la
web no esta consiguiendo que nadie de el paso.

Lo que si quedo listo este mes es la fontaneria: `generate_lead` ya esta marcado como
evento clave y las dimensiones `method`/`where` ya funcionan. Sirvio para comprobar que
la tuberia mide bien; el mes que viene, cuando entre un contacto de verdad, se va a
saber por donde entro.

Lo unico que conviene hacer antes del proximo informe: **desplegar a produccion lo que
lleva desde el 19 de septiembre parado en la rama `astro`** — ahi va el CTA flotante de
WhatsApp, que es lo unico pendiente que ataca directamente el cero. Y hacerlo con una
redireccion del articulo que cambio de URL (seccion 8), porque tal como esta hoy el
despliegue rompe la unica pagina de blog con trafico. Junto con eso, **excluir el
trafico propio en GA4**, para que octubre no vuelva a contar pruebas como contactos.

## 1. Las cifras

| Metrica | Este periodo | Anterior | Variacion |
|---|---|---|---|
| Sesiones | 97 | — | — |
| Usuarios | 59 | — | — |
| Vistas de pagina | 393 | — | — |
| Eventos | 628 | — | — |
| Eventos clave | 2 | — | — |
| Leads (generate_lead) | 5 | — | — |
| Tasa de interaccion % | 75.30 | — | — |
| Conversion sesion->lead % | 5.15 | — | — |


## 2. De donde llega la gente

| Canal | Sesiones | % del total |
|---|---|---|
| Direct | 52 | 53.6 % |
| Organic Search | 24 | 24.7 % |
| Organic Social | 14 | 14.4 % |
| Unassigned | 4 | 4.1 % |
| Paid Search | 3 | 3.1 % |

**El 53.6 % entra como "Direct", y eso no es marca fuerte: es medicion ciega.** Direct
es lo que Analytics escribe cuando no sabe que trajo la visita — clics desde WhatsApp,
desde apps que no pasan referente y enlaces sin etiquetar. De esas 52 sesiones no se
puede decir nada mas.

La buena noticia es que **los UTM empiezan a funcionar**: aparece `instagram / bio`
(1 sesion), que es exactamente el enlace del perfil que se pego el 18. Pero al lado esta
`ig / social` con 8 sesiones: **Instagram esta entrando por dos nombres distintos** y
GA4 no los va a juntar nunca. Hay que dejar un solo nombre, `instagram`, en todos los
enlaces; los de `analiticas/enlaces-utm.md` ya lo usan.

`google / organic` (24 sesiones, 24.7 %) es el segundo canal y es el unico que no
depende de que alguien mande un enlace a mano.

**Las 3 sesiones de `google / cpc` no son publicidad.** Nunca se ha contratado Ads: son
visitas que llegaron con un `gclid` pegado en la URL. No hay ningun gasto que revisar.

Las 4 sesiones "Unassigned" son ruido de la atribucion de GA4, no un canal.


## 3. Que paginas ven

| Pagina | Vistas | Usuarios | Tiempo medio |
|---|---|---|---|
| / | 169 | 48 | 0:28 |
| /portafolio/ | 43 | 12 | 1:39 |
| /nosotros/ | 36 | 8 | 1:19 |
| /blog/ | 34 | 6 | 1:20 |
| /servicios/ | 31 | 7 | 1:23 |
| /contacto/ | 23 | 8 | 0:44 |
| /servicios/a-medida/ | 16 | 5 | 1:18 |
| /blog/por-que-mi-pagina-web-no-me-trae-clientes/ | 8 | 3 | 1:34 |
| /servicios/ecosistema/ | 8 | 2 | 0:37 |
| /en/ | 6 | 2 | 0:12 |
| /blog/cuanto-cuesta-una-pagina-web-en-chihuahua/ | 5 | 2 | 0:03 |
| /en/portfolio/ | 4 | 1 | 0:09 |

**El recorrido se corta antes de contacto.** 48 personas vieron la portada; 8 llegaron
a `/contacto/`. Una de cada seis. Esa es la fuga principal, y no se arregla con mas
trafico.

Lo que si funciona es la profundidad: `/portafolio/` retiene 1:39 de media,
`/servicios/` 1:23 y `/nosotros/` 1:19. Quien pasa de la portada lee de verdad. La
portada, en cambio, se despacha en 28 segundos — es un paso, no un destino.

**El blog ya no es decorativo**: `/blog/` suma 34 vistas y el articulo de "por que mi
pagina web no me trae clientes" 8 vistas con 1:34 de lectura. El de precios
(`/cuanto-cuesta-una-pagina-web-en-chihuahua/`) tiene 5 vistas pero **3 segundos de
media**: la gente entra y se va. Con 2 usuarios no es concluyente, pero conviene mirarlo
el mes que viene: si el patron se repite, el articulo no esta dando el precio arriba,
que es lo unico que esa busqueda quiere.

`/servicios/a-medida/` (16 vistas, 1:18) rinde mejor que `/servicios/ecosistema/` (8
vistas, 0:37). Y las versiones en ingles y portugues juntas no llegan a 15 vistas, con
tiempos de 0 a 12 segundos: hoy no aportan y no merecen inversion.


## 4. Que hacen

| Evento | Recuento | Eventos clave |
|---|---|---|
| page_view | 393 | 0 |
| session_start | 93 | 0 |
| first_visit | 47 | 0 |
| scroll | 43 | 0 |
| user_engagement | 37 | 0 |
| click | 10 | 0 |
| generate_lead | 5 | 2 |


## 5. El embudo

| Escalon | Cantidad | % de las sesiones |
|---|---|---|
| Sesiones | 97 | 100.0 % |
| Sesiones con interaccion | 73 | 75.3 % |
| Contactos (generate_lead) | 5 | 5.2 % |


La tabla de arriba dice 5 contactos porque la calcula GA4. **El escalon real es cero**:
los 5 son pruebas propias. De 97 sesiones y 73 con interaccion, **nadie de fuera
escribio**.

Los dos escalones que si son reales y si informan:

- **97 sesiones -> 73 con interaccion (75.3 %).** La gente que entra no rebota. El
  contenido no espanta.
- **48 personas en la portada -> 8 en `/contacto/`.** Una de cada seis hace el viaje. Y
  de esas 8, ninguna escribio.

Ese segundo dato es el que hay que atacar, y da dos lecturas posibles: o llega poca
gente a contacto (una de cada seis), o la que llega no encuentra motivo para escribir.
Con 8 personas no se puede distinguir cual de las dos pesa mas — hacen falta mas meses o
mas trafico. Mientras tanto, lo barato es reducir el viaje: el CTA flotante de WhatsApp,
que sigue sin desplegar, pone el contacto en todas las paginas en vez de exigir que
alguien navegue hasta `/contacto/`.

Solo 10 eventos `click` y 43 `scroll` contra 393 vistas. Es poca interaccion medida, y
en parte es porque el sitio casi no tiene enlaces salientes que GA4 cuente sola.

**Cero clientes y cero facturacion desde la web este mes**, porque no hubo ningun
contacto real que pudiera convertirse en uno.

El detalle de los 5 eventos, para que quede en el historico por que se descartan:

| Fecha | Ciudad | Dispositivo | Fuente | method / where |
|---|---|---|---|---|
| 17 sep | Chihuahua | movil | `ig / social` | (not set) x2 |
| 18 sep | Chihuahua | escritorio | `linkedin.com / referral` | email + whatsapp, `contact` |
| 21 sep | Jose Mariano Jimenez | movil | `google / organic` | whatsapp, `contact` |

Los dos del 18 salen de la misma sesion y por dos vias distintas — la firma tipica de
una prueba, no de una persona. Los otros tres los confirmo el usuario.

Lo que si dice la prueba: el evento llega con su `method` y su `where` correctos desde
`/contacto/`. La tuberia funciona; lo que falta es que alguien de fuera la use.

Con el catalogo actual (`src/data/packages.js`: desde $5,000 la web sola hasta $75,000
el paquete 360), **un solo contacto que cierre vale mas que duplicar las sesiones**. Ese
sigue siendo el numero a vigilar, y hoy esta en cero.


## 6. Busqueda en Google


**Indexacion al 2026-09-13:** 11 indexadas, 19 sin indexar.

**Falta el dato principal: no hay exportacion de rendimiento de Search Console.** En
`analiticas/` solo estan los CSV de indexacion, asi que **este informe no puede decir
que busquedas traen gente, cuales son de marca y cuales no, ni el CTR de ninguna
pagina**. No es que sea cero: es que no esta medido. Para el informe de octubre hay que
descargar de Search Console -> Rendimiento -> pestanas Consultas y Paginas (ultimos 28
dias) y dejar los CSV en `analiticas/`.

Lo que si dicen los CSV que hay:

- **57 impresiones del 1 al 13 de septiembre.** Es muy poco. El unico pico, 22
  impresiones el 10 de septiembre, no tiene causa identificada en el repo.
- **Al 13 de septiembre: 11 paginas indexadas y 19 sin indexar.** De esas, 18 figuran
  como "Descubierta: actualmente sin indexar" — Google las conoce y ha decidido no
  rastrearlas todavia. Es lo normal en un sitio nuevo con poca autoridad, y se corrige
  publicando con constancia y enlazando internamente, no pidiendo indexacion una por
  una.

Ese 11 contra 19 explica las 24 sesiones de organico mejor que cualquier otra cosa: la
mayor parte del sitio todavia no compite en Google porque no esta en el indice.


## 7. Estado de la medicion

**Las tres comprobaciones del diagnostico, sobre el codigo de hoy:**

1. **`generate_lead` ya es evento clave.** 2 de 5 aparecen marcados. GA4 no cuenta hacia
   atras: los 3 anteriores al interruptor no se recuperan. A partir de octubre la cifra
   de eventos clave y la de leads deberian coincidir; si no coinciden, algo se
   desconfiguro.
2. **Todos los CTA de contacto llaman a `trackLead`.** Comprobado uno por uno:
   `Contact.jsx` (whatsapp, email, form), `Footer.jsx` (whatsapp, email),
   `ServicesSection.jsx` (whatsapp) y `FloatingWhatsApp.jsx` (whatsapp, 'float'). No
   queda ningun `wa.me` ni `mailto:` suelto fuera de los textos legales. El agujero que
   motivo sacar `trackLead` a `src/data/track.js` no ha vuelto.
3. **Los valores de `where` cuadran a medias.** En GA4 solo aparece `contact`. No
   aparecen `footer`, `services` ni `float`, y la explicacion es distinta para cada uno:
   `float` **no existe en produccion** — `FloatingWhatsApp.jsx` esta solo en la rama
   `astro`, sin desplegar. `footer` y `services` si estan publicados y miden bien;
   simplemente nadie escribio desde ahi este mes.

**Agujeros abiertos:**

- **El trafico propio no esta excluido.** Es el agujero mas caro ahora mismo: las 5
  pruebas de este mes entraron al informe como contactos y, si no se filtra, el mes que
  viene vuelve a pasar. En GA4: Administrar -> Flujos de datos -> el flujo web ->
  Configurar los ajustes de la etiqueta -> Mostrar todo -> Definir trafico interno, con
  la IP de casa y la de la oficina; despues Administrar -> Filtros de datos, poner
  "Trafico interno" en Activo. Ojo con el movil en datos: ahi la IP cambia, asi que las
  pruebas desde el telefono conviene hacerlas en modo DebugView.
- No se mide nada entre entrar y contactar: ni clic en un paquete, ni apertura del modal
  de servicios, ni scroll hasta precios. Cuando el embudo se corta —como se corta hoy
  entre portada y contacto— no hay forma de saber en que punto.
- Instagram llega con dos nombres (`ig` y `instagram`), lo que parte la cifra.
- Search Console no tiene automatizacion: depende de que alguien baje los CSV a mano.

*No se toco nada de esto: el informe analiza, los arreglos van aparte para que se
revisen.*


## 8. Que hacer ahora

1. **Desplegar la rama `astro` a produccion (PR a `main`), con redireccion.** Son dos
   commits parados desde el 19 de septiembre: CTA flotante de WhatsApp, telefono en el
   formulario y cierre del portafolio. **Antes de mezclar hay que anadir una redireccion
   301 de `/blog/por-que-mi-pagina-web-no-me-trae-clientes/` a
   `/blog/por-que-mi-pagina-web-en-chihuahua-no-me-trae-clientes/`**: el articulo cambio
   de slug en `astro`, en produccion sigue el viejo y hoy es la unica pagina de blog con
   trafico (8 vistas). Sin redireccion, al desplegar se convierte en un 404 y se pierde
   ademas lo que Google ya tenia indexado. *Que deberia moverse:* aparicion de
   `where: float` en la tabla de leads, y mas de 5 contactos en octubre.

2. **Unificar el nombre de Instagram a `instagram` en todos los enlaces.** Hoy entran 8
   sesiones como `ig / social` y 1 como `instagram / bio`. Usar siempre los enlaces de
   `analiticas/enlaces-utm.md` y revisar donde quedo pegado el `ig` (link in bio,
   historias destacadas, publicaciones). *Que deberia moverse:* una sola fila de
   Instagram en la tabla de fuentes, y menos sesiones en Direct.

3. **Descargar los CSV de rendimiento de Search Console** (Consultas y Paginas, ultimos
   28 dias) y dejarlos en `analiticas/`. Es el unico bloque del informe que hoy esta
   vacio, y es el que dice si el organico viene de gente que busca "geck codex" o de
   gente que busca lo que vendemos. *Que deberia moverse:* la seccion 6 deja de decir
   "no esta medido".

4. **Publicar los dos articulos que estan escritos y sin commitear**
   (`cuando-dejar-excel-por-un-sistema-propio-en-ciudad-juarez.md` y
   `necesito-una-app-o-una-pagina-web.md`). El blog ya demuestra que retiene —1:34 de
   lectura media en el articulo que funciona— y con 19 paginas sin indexar lo que
   necesita el sitio es senal de actividad. Ademas apuntan a Ciudad Juarez, de donde ya
   llegan 14 sesiones sin haber publicado nada dirigido ahi. *Que deberia moverse:*
   paginas indexadas de 11 hacia arriba, e impresiones por encima de 57 al mes.

5. **Excluir el trafico propio en GA4** (ruta exacta en la seccion 7). Cuesta cinco
   minutos y es lo que separa "la web genero 5 contactos" de "la web genero cero", que
   son dos decisiones de negocio opuestas. *Que deberia moverse:* que el proximo
   `generate_lead` que aparezca sea de alguien de fuera, sin tener que preguntarlo.


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
