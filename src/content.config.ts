/**
 * Colecciones de contenido — por ahora solo el blog.
 *
 * Los artículos viven como Markdown en `src/content/blog/` y no en una base de
 * datos, así que el contenido queda versionado en git junto al código: se
 * escriben, se revisan y se despliegan por el mismo camino que todo lo demás.
 * Un artículo es un archivo; publicarlo es un commit.
 *
 * El esquema no es decoración: `@astrojs/content` valida cada archivo en el
 * build y lo revienta si falta un campo o si una fecha no es fecha. Un
 * artículo sin `description` es un artículo que Google recorta como quiere,
 * y prefiero que el build falle a publicarlo mal.
 */

import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  // El loader `glob` (Astro 5) lee de disco y deriva el `id` del nombre del
  // archivo. El id ES el slug de la URL, así que el nombre del archivo debe
  // escribirse pensando en la URL: `cuanto-cuesta-una-pagina-web-en-parral.md`
  // → /blog/cuanto-cuesta-una-pagina-web-en-parral/.
  loader: glob({ base: './src/content/blog', pattern: '**/*.md' }),

  schema: z.object({
    /** H1 del artículo. No lleva sufijo de marca: eso lo agrega el <title>. */
    title: z.string().min(10).max(90),

    /**
     * Meta description. El rango es el mismo que vigila
     * `scripts/check-seo-meta.mjs` para las páginas fijas: por debajo de 140
     * Google rellena con texto de la página, por encima de 165 la corta.
     */
    description: z.string().min(120).max(170),

    /** Fecha de publicación. Alimenta el orden del índice y el JSON-LD. */
    date: z.coerce.date(),

    /**
     * Fecha de la última revisión de fondo. Solo se pone cuando el contenido
     * cambió de verdad —no por corregir una coma—, porque alimenta el
     * `lastmod` del sitemap y `dateModified` del JSON-LD. Inflarla es
     * exactamente el error que ya cometía el sitemap con `new Date()`.
     */
    updated: z.coerce.date().optional(),

    /**
     * Imagen de portada. Es también la que se ve al compartir el enlace en
     * WhatsApp o LinkedIn, así que la proporción útil es 1200×630.
     */
    cover: z.string().optional(),
    coverAlt: z.string().optional(),

    /** Autor. Por defecto la empresa, que es quien firma el JSON-LD. */
    author: z.string().default('Geck Codex'),

    /**
     * Etiquetas temáticas. Se muestran y sirven para enlazar artículos
     * relacionados; no generan páginas de archivo propias, que en un blog
     * pequeño solo crean páginas vacías que Google marca como "sin valor".
     */
    tags: z.array(z.string()).default([]),

    /** Minutos de lectura. Si se omite, se calcula del cuerpo del texto. */
    readingTime: z.number().int().positive().optional(),

    /**
     * Artículo sin terminar: se puede guardar desde el panel sin que salga
     * publicado. El build lo excluye del índice, del sitemap y del RSS.
     */
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
