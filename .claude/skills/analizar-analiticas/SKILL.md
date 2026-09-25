---
name: analizar-analiticas
description: Analizar las analíticas de geckcodex.com — Google Analytics 4 y Search Console — y escribir el informe del periodo en `analiticas/informes/`. Consulta GA4 en vivo por su API y lee los CSV de Search Console, los normaliza, calcula el embudo de sesión a contacto, compara contra el periodo anterior y diagnostica si el tracking del sitio está midiendo lo que debería. Úsala cuando el usuario diga "analiza las analíticas", "qué dicen los datos de Analytics", "revisa GA4", "cuánta gente entró este mes", "de dónde viene el tráfico", "cuántos leads generó la web", "por qué no tengo conversiones", "el informe de septiembre", "qué busca la gente en Google", "estoy subiendo o bajando", o cuando suba capturas o CSV de GA4 o Search Console esperando que alguien los interprete. También cuando pregunte si la web le está trayendo clientes o si vale la pena lo que invierte en ella.
---

# Analizar las analíticas de Geck Codex

El objetivo de esta skill no es describir números: es contestar si la web trae
clientes y qué hacer para que traiga más. Un informe que dice "80 sesiones, 61 %
directo" no vale nada. Uno que dice "de cada 100 visitas, 3 escriben, y las tres
llegan de WhatsApp — Google todavía no aporta un solo contacto" sirve para
decidir dónde poner el esfuerzo del mes.

## Flujo

**1. Ver qué hay.** `ls analiticas/` — ahí van los CSV crudos que el usuario
descarga. Si está vacío o le faltan piezas, decir exactamente qué descargar
usando `references/ga4-exports.md`; no analizar a medias fingiendo que no falta
nada.

**2. Normalizar.** GA4 se trae en vivo de la API; no hace falta que el usuario
descargue nada:

```bash
export GOOGLE_APPLICATION_CREDENTIALS="C:/Users/carlo/.config/geckcodex/ga4.json"
python .claude/skills/analizar-analiticas/scripts/ingest.py --backend ga4api --mes 2026-09
```

Sin `--mes` toma el mes anterior completo, que es lo que casi siempre se quiere.
Para un periodo suelto, `--inicio` y `--fin`.

**Search Console no tiene backend de API**, así que sus CSV se siguen dejando en
`analiticas/` y se leen aparte:

```bash
python .claude/skills/analizar-analiticas/scripts/ingest.py --dir analiticas
```

Los dos escriben `analiticas/.cache/dataset.json`, así que al correr los dos hay
que mandar uno a otro `--out` y decidir cuál alimenta el informe. Cuando importe
la parte de búsqueda, usar el de CSV; cuando importe el tráfico, el de la API.

Leer siempre los avisos que imprime: una consulta que falló o un archivo que no
se reconoció es un dato que no va a aparecer en el informe, y el informe no
tiene forma de saber que falta.

**3. Diagnosticar el tracking** (sección de abajo). Antes de interpretar nada,
porque un cero puede significar "nadie te contactó" o "no lo estás midiendo", y
esas dos conclusiones llevan a decisiones opuestas.

**4. Generar el esqueleto.**

```bash
python .claude/skills/analizar-analiticas/scripts/informe.py
```

Escribe `analiticas/informes/informe-YYYY-MM.md` con las tablas ya calculadas,
la comparación contra el informe anterior y marcadores `<!-- ESCRIBIR: ... -->`.

**5. Redactar.** Reemplazar cada marcador por el análisis, siguiendo el criterio
de abajo. No debe quedar ningún `<!-- ESCRIBIR` en el archivo final.

**6. Cerrar en el chat** con lo que importa: el número que cambió, la causa más
probable y la primera acción. El informe es el detalle; el chat es la respuesta.

Si el usuario solo pega capturas o pregunta algo puntual, no hace falta el
informe entero — contestar la pregunta. El informe es para cuando pide análisis
del periodo.

## Qué mide este sitio realmente

Verificarlo en el código antes de afirmar nada, pero el punto de partida es:

- `src/components/Analytics.astro` carga GA4 (`G-NCC4TMJN98`) y define
  `window.gcTrack(evento, params)`.
- `src/data/track.js` expone `trackLead(method, where)`, que emite
  **`generate_lead`** con `method` (whatsapp, email, form), `where` (footer,
  services, contact) y `page`.
- `page_view` se emite a mano en cada `astro:page-load` porque el sitio navega
  como SPA.

Es decir: el sitio **solo** emite `page_view`, `generate_lead` y los eventos
automáticos de GA4 (`scroll`, `click`, `session_start`...). No hay eventos de
formulario enviado, ni de clic en paquete, ni de descarga.

### El diagnóstico de tracking

Tres comprobaciones, en este orden:

**a) ¿`generate_lead` está marcado como evento clave en GA4?** Si el informe
muestra eventos por cientos y `eventos_clave: 0`, el evento llega pero GA4 no lo
cuenta como conversión — es un interruptor en el panel (Administrar → Eventos →
marcar como evento clave), no un problema de código. Decirlo así de claro: es la
diferencia entre tener datos y poder usarlos, y se arregla en un minuto.

**b) ¿Todos los CTA de contacto llaman a `trackLead`?** Buscar los enlaces de
WhatsApp y correo del sitio y cruzarlos contra quién llama a `trackLead`:

```bash
grep -rn "wa.me\|mailto:" src/ --include=*.jsx --include=*.astro
grep -rn "trackLead(" src/ --include=*.jsx
```

Un CTA que abre WhatsApp sin llamar a `trackLead` es un contacto que ocurre y
nunca aparece en ningún informe. Ese fue exactamente el problema que motivó
sacar `trackLead` a `src/data/track.js`; conviene comprobar que no volvió a
pasar al agregar secciones nuevas.

**c) ¿Los valores de `where` que aparecen en GA4 coinciden con los del código?**
Si el código emite `where: 'services'` pero en GA4 no existe ese valor, o el
componente no se está usando, o el evento no llega. Reportarlo.

Reportar los agujeros encontrados en la sección de medición del informe. Arreglarlos solo
si el usuario lo pide — el trabajo aquí es analizar, y un cambio de tracking
mezclado en un informe pasa sin revisión.

## Cómo leer estos números

**El volumen es bajo y eso cambia todo.** El sitio mueve decenas de sesiones al
mes, no miles. Con esos números, pasar de 12 a 9 contactos no es "una caída del
25 %": son tres personas, y puede ser puro azar. Decir "cayó un 25 %" con esa
base es dar por real un ruido, y se toman decisiones caras por eso. La regla:
**por debajo de ~30 eventos, hablar de cantidades absolutas y no de porcentajes,
y decir explícitamente cuándo la variación no es concluyente.** Los porcentajes
del script están para el contexto, no para la narrativa.

**No hay inversion publicitaria.** Nunca se ha contratado Google Ads. Si
aparecen sesiones de `google / cpc`, mirar la dimension de campana antes de
concluir nada: con campana `(not set)` suele ser una visita que llego con un
`gclid` pegado, no una campana. Afirmar que hay Ads corriendo cuando no lo hay
manda al usuario a revisar un gasto que no existe.

**El "Directo" alto casi nunca es gente tecleando la URL.** En un negocio que
manda su enlace por WhatsApp y por Instagram, el tráfico directo es sobre todo
eso: clics desde apps que no pasan referente, más campañas sin UTM. Tratarlo
como "marca fuerte" es engañarse. La acción correcta es etiquetar los enlaces
con UTM. Los enlaces ya generados estan en `analiticas/enlaces-utm.md`; para
regenerarlos o crear los de una campana nueva:

```bash
python .claude/skills/analizar-analiticas/scripts/utm.py --campaign navidad-2026
```

Generarlos y no escribirlos a mano importa porque GA4 trata `whatsapp` y
`WhatsApp` como fuentes distintas, y una vez partida la cifra no se vuelve a
juntar.

**Una agencia no se mide en volumen sino en tickets.** Los proyectos están en
`src/data/packages.js` y `src/data/ecosystem.js`; leerlos antes de valorar un
lead. Un mes de 40 sesiones con un contacto que cierra vale más que uno de 400
sin ninguno, y el informe tiene que reflejar ese orden de importancia y no el de
las visitas.

**Separar marca de no-marca en las búsquedas.** Que alguien busque "geck codex"
significa que ya conocía la empresa: esa visita la trajo otra cosa. El
crecimiento real está en las consultas que no llevan el nombre. Si todas las
impresiones son de marca, decirlo — es el dato que explica por qué el orgánico
no crece.

**Las impresiones sin clics son una pista, no un fracaso.** Muchas impresiones y
CTR bajo en una consulta relevante suele significar que el título y la
descripción de esa página no están respondiendo la búsqueda. Eso es accionable y
barato. Si la posición media está por encima de 15, en cambio, el CTR bajo es
normal y el problema es de posición, no de copy.

**Cruzar con lo que se publicó.** El blog y los cambios del sitio están en el
git del repo. Si el tráfico orgánico se movió, mirar qué se publicó antes —
`git log --since=... --oneline` y `ls src/content/blog/`. Una subida que coincide
con un artículo es información; una subida sin causa identificada hay que
declararla como tal, no adornarla.

## Reglas que sostienen el informe

**Ningún número inventado.** Todo lo que aparece sale del dataset o del código.
Si el usuario pregunta algo que los datos no contestan —cuántos leads cerraron,
cuánto facturó— la respuesta es que ese dato no está en GA4 y hay que ponerlo a
mano. Un informe con una cifra plausible pero falsa es peor que uno incompleto,
porque nadie va a volver a verificarla.

**Distinguir "es cero" de "no se midió".** Aparece todo el tiempo y es el error
más caro de esta disciplina.

**Las acciones son concretas o no son acciones.** "Mejorar el SEO" no sirve.
"Reescribir el `<title>` de `/servicios/` para incluir 'desarrollo web
Chihuahua', que tiene 340 impresiones y 0,59 % de CTR" sí: dice qué, dónde y qué
número debería moverse.

**Escribir en español y sin jerga innecesaria.** El lector es el dueño del
negocio. "Sesiones con interacción" se explica una vez y se usa; "engagement
rate" no se usa. Mismo tono que el resto del proyecto: directo, sin relleno y
con el porqué de cada recomendación.

## Archivos de apoyo

- `references/ga4-exports.md` — qué descargar exactamente de GA4 y de Search
  Console, y cómo nombrarlo. Leerlo cuando falten datos o el usuario pregunte
  qué necesita bajar.
- `references/api-ga4.md` — el alta de la credencial de GA4 (ya hecha) y el
  contrato de `dataset.json`. Leerlo si la API falla con un 403, si hay que
  añadir una consulta nueva, o para conectar la Admin API.

Los informes se versionan en git: son el histórico del negocio y comparar contra
el mes anterior depende de que sigan ahí. Los CSV crudos y `.cache/` no hace
falta versionarlos.
