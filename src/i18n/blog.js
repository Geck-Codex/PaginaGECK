/**
 * Textos del blog.
 *
 * A diferencia del resto del sitio, el blog vive SOLO en español y por eso su
 * copy no está en `translations.js` con las tres variantes. No es un descuido
 * ni deuda pendiente: es una decisión. El blog existe para competir por
 * búsquedas locales ("cuánto cuesta una página web en Chihuahua"), y esas
 * búsquedas se hacen en español. El objetivo son Chihuahua capital y Ciudad
 * Juárez —los dos mercados grandes del estado—, donde no se puede competir por
 * el paquete de mapas sin domicilio verificado ahí, pero sí por los resultados
 * orgánicos, que no piden domicilio. Ese es exactamente el hueco que el blog
 * viene a ocupar. Traducirlo crearía dieciocho URLs que nadie
 * busca y que se llevarían el presupuesto de rastreo que hoy necesitan las
 * páginas comerciales.
 *
 * Consecuencias en el resto del código, para que nadie las revierta por error:
 *   · `blog` NO está en `SLUGS` de routes-map.js → no se generan /en/blog/ ni
 *     /pt/blog/, y `resolvePath` devuelve null para /blog/.
 *   · Por eso el sitemap no le emite alternates y las páginas no llevan
 *     hreflang: declarar un grupo de una sola variante no aporta nada.
 *   · El Navbar sí enlaza /blog/ desde los tres idiomas, a propósito.
 *
 * Si algún día el blog se traduce, el camino es agregarlo a SLUGS y mover
 * esto a translations.js — no parchear hreflang sueltos.
 */

export const BLOG_INDEX = {
  /** Meta de buscador. Mismos límites que vigila scripts/check-seo-meta.mjs. */
  title: 'Blog de desarrollo de software y tecnología | Geck Codex',
  description:
    'Artículos sobre desarrollo web, apps móviles, inteligencia artificial y digitalización de negocios en Chihuahua y Ciudad Juárez, por el equipo de Geck Codex.',

  eyebrow: 'Geck Codex',

  /* La línea editorial del blog, y conviene no diluirla con el tiempo: aquí se
     publica lo que el resto del gremio no publica —precios con número, errores
     propios, cuándo NO contratarnos—. Ese es el único motivo por el que alguien
     volvería a leernos. Un blog de "5 tendencias del desarrollo web" no lo lee
     nadie porque ya está escrito mil veces. */
  heading: 'Las netas que nadie te dice',
  intro:
    'Precios con número, errores que hemos visto costar dinero y lo que de verdad decide si un proyecto funciona. Escribimos de lo que hacemos todos los días, sin humo y sin tecnicismos innecesarios.',

  breadcrumb: 'Blog',

  /** Estado vacío. El blog arranca con un artículo, pero esto evita que una
   *  colección vacía —o con todo en borrador— rompa la página en silencio. */
  empty: 'Todavía no hay artículos publicados. Vuelve pronto.',

  readingTime: (min) => `${min} min de lectura`,
  readMore: 'Leer artículo',
  backToIndex: 'Volver al blog',
  relatedHeading: 'Sigue leyendo',
  publishedLabel: 'Publicado el',
  updatedLabel: 'Actualizado el',

  /** Cierre comercial al pie de cada artículo. El blog trae tráfico; esto es
   *  lo que lo convierte en conversación. */
  cta: {
    heading: '¿Tienes un proyecto en mente?',
    body: 'Cotizamos sin costo y respondemos en menos de 24 horas. Cuéntanos qué necesitas y te decimos con honestidad si podemos ayudarte.',
    button: 'Hablar con nosotros',
  },
};

/** Fecha larga en español, estable entre servidor y cliente. */
export const formatDate = (date) =>
  new Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);

/**
 * Minutos de lectura a 200 palabras por minuto. Se usa solo cuando el artículo
 * no trae `readingTime` propio en el frontmatter.
 */
export const estimateReadingTime = (body = '') => {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
};
