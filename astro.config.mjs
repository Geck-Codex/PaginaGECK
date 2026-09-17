// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { alternatesForUrl } from './src/i18n/routes-map.js';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

/**
 * Fecha real de cada artículo del blog, leída de su frontmatter.
 *
 * Existe porque `lastmod` solo sirve si es verdad. La config anterior ponía
 * `lastmod: new Date()`, así que las 27 URLs declaraban haber cambiado en el
 * instante del build —incluidas las que llevaban meses intactas—. Google
 * documenta que cuando detecta un lastmod poco fiable deja de usarlo para todo
 * el sitio, y justo es la señal que le diría "vuelve a pasar por aquí".
 *
 * Se lee el archivo en lugar de importar la colección porque esta config se
 * evalúa antes de que exista el runtime de `astro:content`. Basta con extraer
 * dos campos, así que no se añade una dependencia de frontmatter solo para eso.
 */
function readBlogDates() {
  const dir = fileURLToPath(new URL('./src/content/blog/', import.meta.url));
  if (!existsSync(dir)) return {};

  const dates = {};
  for (const file of readdirSync(dir)) {
    if (!file.endsWith('.md')) continue;
    const raw = readFileSync(new URL(file, new URL('./src/content/blog/', import.meta.url)), 'utf8');
    const front = raw.split(/^---\s*$/m)[1] ?? '';
    // `updated` gana sobre `date`: es la fecha de la última revisión de fondo.
    const updated = front.match(/^updated:\s*['"]?([\d-]+)/m);
    const date = front.match(/^date:\s*['"]?([\d-]+)/m);
    const value = (updated ?? date)?.[1];
    if (value) dates[file.replace(/\.md$/, '')] = value;
  }
  return dates;
}

const BLOG_DATES = readBlogDates();

/** La más reciente de todas: es lo que cambia cuando se publica un artículo. */
const BLOG_INDEX_LASTMOD = Object.values(BLOG_DATES).sort().pop();

export default defineConfig({
  site: 'https://geckcodex.com', // <--- ¡ASEGÚRATE DE QUE ESTO ESTÉ AQUÍ!
  markdown: {
    // Shiki le mete al <pre> un style inline con los colores de GitHub Dark,
    // y un style inline le gana a cualquier hoja de estilos: el bloque salía
    // como una caja negra ajena a la marca que en tema oscuro se perdía
    // contra el fondo. Este blog no es de código —el único bloque que hay son
    // dos URLs de ejemplo—, así que el resaltado no vale lo que cuesta.
    // Sin él, Astro emite un <pre> limpio y manda el CSS de Prose.astro.
    syntaxHighlight: false,
  },
  // Prefetch: precarga el HTML de los links internos al pasar el mouse, así el
  // cambio de página con ClientRouter se siente instantáneo.
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  integrations: [
    react(),
    sitemap({
      // Ya no se filtra /blog: dejó de ser un placeholder con noindex y ahora
      // es la sección que más se actualiza, justo la que conviene que Google
      // rastree seguido. El filtro original era correcto mientras estaba vacía.
      changefreq: 'monthly',
      // Sin `lastmod` global a propósito — ver readBlogDates() arriba. Solo los
      // artículos declaran fecha, y la declaran de verdad.
      // NO se usa la opción `i18n` del plugin: empareja las variantes por slug
      // idéntico, y aquí los slugs están traducidos (/servicios/ ↔ /en/services/).
      // Con ella, el sitemap agrupaba /en/portfolio/ con /pt/portfolio/ —que sí
      // coinciden— dejando fuera el español, y contradecía el hreflang del <head>.
      // Los alternates se construyen abajo desde el mismo mapa de rutas que usa
      // el layout, para que ambas señales digan exactamente lo mismo.
      serialize(item) {
        // Cada URL se acompaña de sus variantes de idioma. `alternatesForUrl`
        // devuelve null para las páginas que solo existen en español (legales),
        // y ahí no se emite ningún alternate: declarar un grupo de una sola
        // variante no aporta nada y arriesga que Google lo descarte.
        const links = alternatesForUrl(item.url);
        if (links) item = { ...item, links };

        // Las URLs van CON barra final porque es lo que sirve Netlify: pedir
        // /contacto devuelve un 301 hacia /contacto/. Un sitemap lleno de URLs
        // que redirigen desperdicia presupuesto de rastreo, y si el canonical
        // apunta a la forma que redirige, Google reparte señales entre dos URLs.
        // Los canonical de cada página usan esta misma forma.

        // La home y las páginas comerciales son las que reciben tráfico de Ads
        // y las que deben rastrearse primero.
        if (item.url === 'https://geckcodex.com/') return { ...item, priority: 1.0, changefreq: 'weekly' };
        if (/\/(servicios|contacto)\/?$/.test(item.url)) return { ...item, priority: 0.9 };
        if (/\/(portafolio|nosotros)\/?$/.test(item.url)) return { ...item, priority: 0.8 };
        if (/\/(privacidad|terminos)\/?$/.test(item.url)) return { ...item, priority: 0.3, changefreq: 'yearly' };

        // ── Blog ──
        // El índice cambia cada vez que se publica; los artículos casi nunca
        // después de salir. Decirle a Google que un artículo de hace un año
        // cambia cada mes es gastarle rastreo en una página idéntica.
        if (/\/blog\/?$/.test(item.url)) {
          return {
            ...item,
            priority: 0.7,
            changefreq: 'weekly',
            ...(BLOG_INDEX_LASTMOD ? { lastmod: BLOG_INDEX_LASTMOD } : {}),
          };
        }

        const post = item.url.match(/\/blog\/([^/]+)\/?$/);
        if (post) {
          return {
            ...item,
            priority: 0.6,
            changefreq: 'yearly',
            ...(BLOG_DATES[post[1]] ? { lastmod: BLOG_DATES[post[1]] } : {}),
          };
        }

        return item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});