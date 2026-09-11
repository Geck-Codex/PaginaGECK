---
name: escribir-articulo
description: Escribir, revisar o publicar un artículo del blog de Geck Codex (geckcodex.com/blog). Lleva el plan editorial, la voz de la marca, los precios reales que se pueden publicar y el contrato del frontmatter que valida el build. Úsala cuando el usuario pida "escribe un artículo", "el siguiente del blog", "vamos con el artículo 3", "una entrada sobre X", "publica algo del blog", "revisa este artículo", "actualiza el artículo de precios", o cuando pregunte de qué escribir. También al retomar el blog después de tiempo, para saber qué sigue.
---

# Escribir un artículo del blog de Geck Codex

El blog vive en `src/content/blog/*.md`. Un artículo es un archivo Markdown con
frontmatter; el build lo valida y lo publica solo.

**Antes de escribir una sola línea, leer `docs/plan-editorial-blog.md`.** Ahí está
qué artículo sigue, con qué búsqueda ataca, el ángulo decidido y con qué otros
artículos debe enlazar. No improvisar temas cuando ya hay un plan — y si el
usuario pide uno que no está en el plan, escribirlo y **agregarlo al plan
después**, o el plan deja de servir en dos meses.

## Lo primero: confirmar de qué se escribe

Si el usuario no dijo el tema, no adivinar. Mirar qué hay publicado
(`ls src/content/blog/`), cruzarlo contra el plan editorial, y proponer el
siguiente con una frase de por qué toca ése. Si el usuario trae un tema propio,
verificar que no choque con uno ya publicado: dos artículos que atacan la misma
búsqueda compiten entre sí y los dos posicionan peor.

## Reglas que no se rompen

**Una sola intención por artículo.** Si contesta dos preguntas distintas, son dos
artículos.

**El título es la búsqueda.** Se escribe como lo teclearía alguien en Google, no
como suena bonito. Si apunta a una ciudad, la ciudad va en el título.

**El mercado objetivo es Chihuahua capital y Ciudad Juárez, no Parral.** La
empresa está físicamente en Hidalgo del Parral y eso no se oculta —está en el
JSON-LD, en contacto y en las legales—, pero dejó de ser el encabezado. Cuando
la distancia sea relevante, contestar la objeción de frente dentro del artículo:
**un trato se cierra en persona y se viaja a cerrarlo**; la videollamada es para
el día a día del proyecto, no para la firma. Nunca escribir que da igual dónde
esté el proveedor.

El alcance exacto del compromiso, que **no se infla**: dentro de Chihuahua se va
a donde esté el cliente, sin cobrar el viaje y sin condiciones. Fuera del estado
también se viaja, pero "hay que acomodarlo con tiempo" — nunca prometer que se
maneja a todo México. Es una decisión tomada, no una omisión: una promesa vale
lo que cuesta cumplirla, y una que después se negocia hace más daño que no
haberla hecho. La misma redacción vive en la FAQ de `/servicios/`
(`translations.js`, en los tres idiomas): si se cambia una, se cambian las dos o
el sitio se contradice ante Google, que lee esa FAQ como JSON-LD.

**Los precios salen del código, no de la memoria.** Leer `src/data/packages.js` y
`src/data/ecosystem.js` antes de escribir cualquier cifra. Una cifra distinta
entre el blog y `/servicios/` destruye la confianza que el artículo venía a
construir. Los números vigentes están también en `docs/plan-editorial-blog.md`.

**Nada sobre clientes con el ecosistema conectado.** Ningún cliente lo tiene
implementado. Se puede decir que los productos están diseñados para conectarse;
no que haya casos funcionando.

**La garantía de por vida sí se publica.** Los errores del código propio se
corrigen sin costo, siempre. Es el mayor diferenciador y conviene que aparezca
donde encaje natural, sin forzarlo en cada artículo.

**Enlazar a dos o tres artículos ya publicados.** Es lo que reparte autoridad
entre ellos. Usar rutas relativas: `/blog/slug-del-otro/`.

## La voz

Leer `references/voz-y-plantilla.md` antes del primer párrafo. En corto: se
habla claro, se dan números que nadie da, y **se concede lo que es cierto antes
de discutir**. La postura honesta —"si solo necesitas existir, hazla con IA y no
gastes de más"— vende más que el miedo. Nunca burlarse del lector ni de quien
cobra barato.

## El frontmatter

Debe coincidir con el esquema de `src/content.config.ts` o **el build falla**.
Ese es el contrato completo:

| Campo | Obligatorio | Regla |
| --- | --- | --- |
| `title` | sí | 10–90 caracteres. Sin "\| Geck Codex": se agrega solo. Apuntar a que `title` + 13 quede cerca de 60. |
| `description` | sí | **120–170 caracteres.** Por debajo Google la rellena solo; por encima la corta. |
| `date` | sí | `YYYY-MM-DD`. |
| `updated` | no | Solo si cambió el contenido de fondo. Alimenta el `lastmod` del sitemap: inflarla hace que Google deje de creerle al sitio entero. |
| `cover` / `coverAlt` | no | Ruta pública (`/assets/image/blog/...`), ideal 1200×630. |
| `author` | no | Por defecto `Geck Codex`; dejarlo así salvo que el usuario firme como persona. |
| `tags` | no | Dos o tres. No generan páginas propias. |
| `readingTime` | no | Omitir: se calcula del texto. |
| `draft` | no | `true` lo excluye del blog, del sitemap y del RSS. |

**El nombre del archivo es la URL.** `cuanto-cuesta-una-pagina-web-en-chihuahua.md`
→ `/blog/cuanto-cuesta-una-pagina-web-en-chihuahua/`. Renombrar un archivo ya
publicado tira su indexación: si hay que hacerlo, va con redirección 301.

## Cómo escribir el archivo

**Usar la herramienta Write, no un heredoc de bash.** El contenido lleva acentos,
comillas, guiones largos y tablas que rompen el parseo del shell — ya pasó.

Largo útil: **1,200–2,000 palabras**. Menos no alcanza a cubrir una intención
completa; más se vuelve un artículo que nadie termina.

## La portada

**Siempre generarla, nunca buscar una foto.** Al terminar el artículo:

```
node scripts/generate-blog-cover.mjs <slug>
```

Arma una tarjeta 1200×630 con el título, la primera etiqueta y la marca, usando
las fuentes y los tokens reales. Escribe `cover` y `coverAlt` en el frontmatter
solo. Con `--force` rehace una existente —hace falta si cambió el título—.

Esa imagen es la que se ve al compartir el enlace en WhatsApp, que para este
negocio es el canal que más importa. Un artículo sin portada se comparte como un
rectángulo gris.

Solo se usa otra imagen si aporta información real: una captura de pantalla, un
diagrama. **Nunca fotos de banco** de gente sonriendo frente a una laptop: pesan
cientos de kilobytes y se ven igual en el blog de cualquier agencia del mundo.

## Verificar antes de decir que está listo

1. `npm run build` — valida el frontmatter y genera la página.
2. Confirmar largos: `title` 10–90, `description` 120–170.
3. Revisar que la URL nueva salga en `dist/sitemap-0.xml` con su `lastmod`, y en
   `dist/blog/rss.xml`.
4. Si el servidor de desarrollo está corriendo, abrir la URL y revisar que los
   H2, la tabla y los relacionados se vean bien.

## Al terminar

- Marcar el artículo como publicado en `docs/plan-editorial-blog.md`.
- Si el tema no estaba en el plan, agregarlo con su búsqueda y su ángulo.
- Revisar si algún artículo anterior debería enlazar al nuevo.

## Lo que NO se hace

- **No traducir el artículo.** El blog es solo en español, a propósito; el porqué
  está en `src/i18n/blog.js`.
- **No agregar `blog` a `SLUGS` de `src/i18n/routes-map.js`.** Generaría
  `/en/blog/` y `/pt/blog/` sin plantilla y rompería el build.
- **No poner `lastmod` global en el sitemap** ni tocar `readBlogDates()` de
  `astro.config.mjs` sin leer por qué está así.
- **No editar desde `astro` un artículo que el usuario haya publicado desde el
  panel `/admin`** sin antes sincronizar con `git merge origin/main`: el panel
  escribe en `main`.
