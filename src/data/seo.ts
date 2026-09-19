import { TEAM } from './team.js';
import { localizedPath } from '../i18n/routes-map.js';

/* ══════════════════════════════════════════════════════════════════
   seo.ts — Fuente única de verdad para datos estructurados (JSON-LD)

   Todo el Schema.org del sitio sale de aquí. La razón de centralizarlo:
   los motores de respuesta con IA (ChatGPT Search, Perplexity, AI Overviews,
   Claude) resuelven mejor una entidad cuando el NAP —nombre, dirección,
   teléfono— es idéntico byte a byte en todas las páginas. Si el dato de
   contacto cambia, se cambia SOLO aquí.
   ══════════════════════════════════════════════════════════════════ */

export const SITE_URL = 'https://geckcodex.com';

/** Idiomas del sitio, en la forma corta que usa el mapa de rutas. */
export type SchemaLocale = 'es' | 'en' | 'pt';

/* ─────────────────────────────────────────────────────────────────
   Texto del schema por idioma.

   Existe porque el grafo se emite en las TRES variantes de cada página
   con el mismo `@id` —es la misma entidad descrita tres veces— y hasta
   ahora la describía en español incluso en /en/ y /pt/. El texto visible
   sí estaba traducido; solo el JSON-LD se quedó atrás.

   Lo que NO se traduce y no debe traducirse: `areaServed` y la dirección.
   "México" o "Hidalgo del Parral" son nombres propios de lugar, no texto
   de interfaz — traducirlos rompe el emparejamiento con la entidad
   geográfica real que hacen los motores.
   ───────────────────────────────────────────────────────────────── */
const SCHEMA_TEXT: Record<SchemaLocale, {
  orgDescription: string;
  slogan: string;
  siteDescription: string;
  knowsAbout: string[];
  offers: string[];
  serviceListName: string;
}> = {
  es: {
    orgDescription:
      'Agencia mexicana de desarrollo tecnológico en Hidalgo del Parral, Chihuahua. Desarrollamos sitios web, aplicaciones móviles, soluciones de inteligencia artificial, e-commerce, plataformas SaaS y software a la medida para empresas de México y Estados Unidos.',
    slogan: 'Tecnología de primer nivel, para todos.',
    siteDescription:
      'Sitio oficial de Geck Codex: desarrollo web, apps móviles, inteligencia artificial y software a la medida desde Parral, Chihuahua.',
    knowsAbout: [
      'Desarrollo Web', 'Diseño de páginas web', 'Aplicaciones Móviles', 'Flutter', 'React',
      'Inteligencia Artificial', 'Visión por Computadora', 'Automatización de procesos',
      'E-commerce', 'SaaS', 'Software a la medida', 'CRM', 'Diseño UI/UX', 'Marketing Digital', 'SEO',
    ],
    offers: [
      'Desarrollo Web', 'Apps Móviles', 'Inteligencia Artificial', 'E-commerce',
      'SaaS y Plataformas', 'Automatización de procesos', 'Software a Medida',
    ],
    serviceListName: 'Servicios de Geck Codex',
  },
  en: {
    orgDescription:
      'Mexican technology development agency based in Hidalgo del Parral, Chihuahua. We build websites, mobile apps, artificial intelligence solutions, e-commerce, SaaS platforms and custom software for companies in Mexico and the United States.',
    slogan: 'World-class technology, for everyone.',
    siteDescription:
      'Official site of Geck Codex: web development, mobile apps, artificial intelligence and custom software from Parral, Chihuahua.',
    knowsAbout: [
      'Web Development', 'Website Design', 'Mobile Apps', 'Flutter', 'React',
      'Artificial Intelligence', 'Computer Vision', 'Process Automation',
      'E-commerce', 'SaaS', 'Custom Software', 'CRM', 'UI/UX Design', 'Digital Marketing', 'SEO',
    ],
    offers: [
      'Web Development', 'Mobile Apps', 'Artificial Intelligence', 'E-commerce',
      'SaaS & Platforms', 'Automation', 'Custom Software',
    ],
    serviceListName: 'Geck Codex Services',
  },
  pt: {
    orgDescription:
      'Agência mexicana de desenvolvimento de tecnologia em Hidalgo del Parral, Chihuahua. Desenvolvemos sites, aplicativos móveis, soluções de inteligência artificial, e-commerce, plataformas SaaS e software sob medida para empresas do México e dos Estados Unidos.',
    slogan: 'Tecnologia de primeiro nível, para todos.',
    siteDescription:
      'Site oficial da Geck Codex: desenvolvimento web, apps mobile, inteligência artificial e software sob medida de Parral, Chihuahua.',
    knowsAbout: [
      'Desenvolvimento Web', 'Design de sites', 'Aplicativos Móveis', 'Flutter', 'React',
      'Inteligência Artificial', 'Visão Computacional', 'Automação de processos',
      'E-commerce', 'SaaS', 'Software sob medida', 'CRM', 'Design UI/UX', 'Marketing Digital', 'SEO',
    ],
    offers: [
      'Desenvolvimento Web', 'Apps Mobile', 'Inteligência Artificial', 'E-commerce',
      'SaaS & Plataformas', 'Automação', 'Software Sob Medida',
    ],
    serviceListName: 'Serviços da Geck Codex',
  },
};

/** NAP y datos de negocio. Reutilizables también en componentes visibles. */
export const BUSINESS = {
  name: 'Geck Codex',
  legalName: 'Geck Codex',
  email: 'contacto@geckcodex.com',
  phone: '+52-627-174-5436',
  phoneDisplay: '+52 627 174 5436',
  whatsapp: 'https://wa.me/526271745436',
  // Sin `street`: el negocio opera como area de servicio (SAB) en Google
  // Business Profile, donde la direccion queda oculta. Declarar una calle
  // en el schema que el perfil no confirma es una inconsistencia de NAP.
  city: 'Hidalgo del Parral',
  region: 'Chihuahua',
  regionCode: 'MX-CHH',
  postalCode: '33800',
  country: 'MX',
  latitude: 26.9319,
  longitude: -105.6664,
  instagram: 'https://www.instagram.com/geckcodex/',
  // Sin los parametros `?_r` y `?_t` con los que TikTok entrega el enlace desde
  // la app: son de rastreo de esa sesion, no forman parte de la direccion del
  // perfil. Un `sameAs` con basura pegada es una señal mas debil, porque no
  // coincide byte a byte con la URL canonica del perfil.
  tiktok: 'https://www.tiktok.com/@geck_codex_oficial',
  github: 'https://github.com/Geck-Codex',
  // La forma canonica del perfil, no el enlace `/share/` que genera el boton de
  // compartir: ese es un codigo de redireccion, y Google Business lo rechaza
  // como perfil no valido. Si algun dia se le asigna nombre de usuario a la
  // pagina, conviene cambiarlo aqui por `facebook.com/<usuario>`.
  facebook: 'https://www.facebook.com/profile.php?id=61578121934306',
  linkedin: 'https://www.linkedin.com/in/geckcodex-2647a4417/',
} as const;

/** Perfiles externos que confirman la identidad de la entidad (sameAs). */
const SAME_AS = [
  BUSINESS.instagram,
  BUSINESS.facebook,
  BUSINESS.linkedin,
  BUSINESS.tiktok,
  BUSINESS.github,
];

/* ─────────────────────────────────────────────────────────────────
   Entidad principal — ProfessionalService es un subtipo de
   LocalBusiness: da elegibilidad a resultados locales (GEO) sin
   perder la semántica de Organization.
   ───────────────────────────────────────────────────────────────── */
export const ORGANIZATION_SCHEMA: Record<string, unknown> = {
  '@type': ['Organization', 'ProfessionalService'],
  '@id': `${SITE_URL}/#organization`,
  name: BUSINESS.name,
  legalName: BUSINESS.legalName,
  alternateName: ['GeckCodex', 'Geck Codex Parral'],
  url: SITE_URL,
  logo: {
    '@type': 'ImageObject',
    '@id': `${SITE_URL}/#logo`,
    url: `${SITE_URL}/assets/image/logo.png`,
    width: 512,
    height: 512,
    caption: BUSINESS.name,
  },
  image: `${SITE_URL}/assets/image/og-image.jpg`,
  description:
    'Agencia mexicana de desarrollo tecnológico en Hidalgo del Parral, Chihuahua. Desarrollamos sitios web, aplicaciones móviles, soluciones de inteligencia artificial, e-commerce, plataformas SaaS y software a la medida para empresas de México y Estados Unidos.',
  slogan: 'Tecnología de primer nivel, para todos.',
  email: BUSINESS.email,
  telephone: BUSINESS.phone,
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    addressLocality: BUSINESS.city,
    addressRegion: BUSINESS.region,
    postalCode: BUSINESS.postalCode,
    addressCountry: BUSINESS.country,
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: BUSINESS.latitude,
    longitude: BUSINESS.longitude,
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: BUSINESS.phone,
      email: BUSINESS.email,
      contactType: 'sales',
      areaServed: ['MX', 'US'],
      availableLanguage: ['Spanish', 'English', 'Portuguese'],
    },
    {
      '@type': 'ContactPoint',
      telephone: BUSINESS.phone,
      contactType: 'customer support',
      areaServed: ['MX', 'US'],
      availableLanguage: ['Spanish', 'English'],
    },
  ],
  areaServed: [
    { '@type': 'Country', name: 'México' },
    { '@type': 'Country', name: 'Estados Unidos' },
    {
      '@type': 'State',
      name: 'Chihuahua',
      containedInPlace: { '@type': 'Country', name: 'México' },
    },
    {
      '@type': 'City',
      name: 'Hidalgo del Parral',
      alternateName: 'Parral',
      containedInPlace: { '@type': 'State', name: 'Chihuahua' },
    },
    {
      // Chihuahua capital. El estado y la ciudad se llaman igual, así que sin
      // containedInPlace los motores no distinguen a cuál de los dos se refiere.
      '@type': 'City',
      name: 'Chihuahua',
      alternateName: 'Chihuahua Capital',
      containedInPlace: { '@type': 'State', name: 'Chihuahua' },
    },
    {
      '@type': 'City',
      name: 'Ciudad Juárez',
      containedInPlace: { '@type': 'State', name: 'Chihuahua' },
    },
    // Resto de municipios del estado por poblacion. Camargo y Jimenez son
    // chicos pero estan a menos de una hora de Parral: ahi el servicio puede
    // ser presencial, no solo remoto.
    {
      '@type': 'City',
      name: 'Cuauhtémoc',
      containedInPlace: { '@type': 'State', name: 'Chihuahua' },
    },
    {
      '@type': 'City',
      name: 'Delicias',
      containedInPlace: { '@type': 'State', name: 'Chihuahua' },
    },
    {
      '@type': 'City',
      name: 'Nuevo Casas Grandes',
      containedInPlace: { '@type': 'State', name: 'Chihuahua' },
    },
    {
      '@type': 'City',
      name: 'Meoqui',
      containedInPlace: { '@type': 'State', name: 'Chihuahua' },
    },
    {
      '@type': 'City',
      name: 'Camargo',
      containedInPlace: { '@type': 'State', name: 'Chihuahua' },
    },
    {
      '@type': 'City',
      name: 'Jiménez',
      containedInPlace: { '@type': 'State', name: 'Chihuahua' },
    },
  ],
  // Radio de servicio presencial; el trabajo remoto queda cubierto por areaServed.
  serviceArea: {
    '@type': 'GeoCircle',
    geoMidpoint: {
      '@type': 'GeoCoordinates',
      latitude: BUSINESS.latitude,
      longitude: BUSINESS.longitude,
    },
    geoRadius: 500000,
  },
  sameAs: SAME_AS,
  /* Las personas se declaran por referencia y no incrustadas: el nodo completo
     de cada una vive en /nosotros (About.astro), con su foto y su puesto. Aquí
     solo se cierra la relación en el sentido que faltaba — cada Person ya
     apuntaba a la organización con worksFor, pero la organización no apuntaba
     de vuelta, y un grafo enlazado en un solo sentido se recorre a medias. */
  founder: TEAM.filter((m) => m.founder && m.name).map((m) => ({ '@id': `${SITE_URL}/#person-${m.id}` })),
  employee: TEAM.filter((m) => m.name).map((m) => ({ '@id': `${SITE_URL}/#person-${m.id}` })),
  knowsLanguage: ['es-MX', 'en-US', 'pt-BR'],
  knowsAbout: [
    'Desarrollo Web',
    'Diseño de páginas web',
    'Aplicaciones Móviles',
    'Flutter',
    'React',
    'Inteligencia Artificial',
    'Visión por Computadora',
    'Automatización de procesos',
    'E-commerce',
    'SaaS',
    'Software a la medida',
    'CRM',
    'Diseño UI/UX',
    'Marketing Digital',
    'SEO',
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Servicios de Geck Codex',
    itemListElement: [
      'Desarrollo Web',
      'Apps Móviles',
      'Inteligencia Artificial',
      'E-commerce',
      'SaaS y Plataformas',
      'Automatización de procesos',
      'Software a Medida',
    ].map((name) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name, provider: { '@id': `${SITE_URL}/#organization` } },
    })),
  },
};

export const WEBSITE_SCHEMA: Record<string, unknown> = {
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: BUSINESS.name,
  description:
    'Sitio oficial de Geck Codex: desarrollo web, apps móviles, inteligencia artificial y software a la medida desde Parral, Chihuahua.',
  publisher: { '@id': `${SITE_URL}/#organization` },
  inLanguage: ['es-MX', 'en', 'pt'],
};

/* ─────────────────────────────────────────────────────────────────
   Las dos entidades base, dichas en el idioma de la página.

   Las constantes de arriba siguen siendo la forma en español y la
   estructura común; estas funciones solo sustituyen los campos que son
   prosa. El `@id` NO cambia: es la misma entidad, y ese identificador
   es justo lo que permite a los motores unificar las tres variantes.
   ───────────────────────────────────────────────────────────────── */
export function organizationSchema(lang: SchemaLocale = 'es'): Record<string, unknown> {
  const tx = SCHEMA_TEXT[lang] ?? SCHEMA_TEXT.es;
  return {
    ...ORGANIZATION_SCHEMA,
    description: tx.orgDescription,
    slogan: tx.slogan,
    knowsAbout: tx.knowsAbout,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: tx.serviceListName,
      itemListElement: tx.offers.map((name) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name, provider: { '@id': `${SITE_URL}/#organization` } },
      })),
    },
  };
}

export function websiteSchema(lang: SchemaLocale = 'es'): Record<string, unknown> {
  const tx = SCHEMA_TEXT[lang] ?? SCHEMA_TEXT.es;
  return { ...WEBSITE_SCHEMA, description: tx.siteDescription };
}

/* ─────────────────────────────────────────────────────────────────
   Helpers de schema por página
   ───────────────────────────────────────────────────────────────── */

export function breadcrumbSchema(items: { name: string; url: string }[]): Record<string, unknown> {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Inicio', url: SITE_URL + '/' }, ...items].map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * FAQPage — el formato que los motores generativos citan con más frecuencia,
 * porque cada par pregunta/respuesta es una unidad extraíble por sí sola.
 */
export function faqSchema(items: FaqItem[], id = 'faq'): Record<string, unknown> {
  return {
    '@type': 'FAQPage',
    /* El ancla la elige quien llama: dos paginas con FAQ distinta no pueden
       compartir @id, o en el grafo son la misma entidad y una pisa a la otra. */
    '@id': `${SITE_URL}/#${id}`,
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

export interface ServiceItem {
  name: string;
  description: string;
  /** Término del catálogo al que pertenece (Desarrollo, Marketing, Inversión). */
  category?: string;
}

/**
 * Los servicios que ofrece la página, en su idioma.
 *
 * `lang` también decide el `serviceUrl`: antes apuntaba siempre a
 * `/contacto/`, así que el schema de /en/ mandaba al formulario en español.
 */
export function serviceListSchema(services: ServiceItem[], lang: SchemaLocale = 'es'): Record<string, unknown> {
  const tx = SCHEMA_TEXT[lang] ?? SCHEMA_TEXT.es;
  const contactUrl = `${SITE_URL}${localizedPath('contact', lang)}`;
  return {
    '@type': 'ItemList',
    name: tx.serviceListName,
    itemListElement: services.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Service',
        name: s.name,
        description: s.description,
        ...(s.category ? { serviceType: s.category } : {}),
        provider: { '@id': `${SITE_URL}/#organization` },
        areaServed: [
          { '@type': 'Country', name: 'México' },
          { '@type': 'Country', name: 'Estados Unidos' },
        ],
        availableChannel: {
          '@type': 'ServiceChannel',
          serviceUrl: contactUrl,
          servicePhone: { '@type': 'ContactPoint', telephone: BUSINESS.phone },
        },
      },
    })),
  };
}

export interface PackageItem {
  name: string;
  description: string;
}

/**
 * Los paquetes de referencia del desarrollo a medida.
 *
 * Va SIN `offers`: los precios se ven en la pagina, pero publicarlos como
 * dato estructurado es otra cosa —los vuelve citables por buscadores y
 * asistentes, y eso es una decision comercial, no tecnica—. El dia que se
 * decida, cada item admite:
 *
 *   offers: { '@type': 'Offer', price: '19500', priceCurrency: 'MXN' }
 *
 * y para los rangos, un `AggregateOffer` con lowPrice/highPrice.
 */
export function packageListSchema(items: PackageItem[], id = 'packages'): Record<string, unknown> {
  return {
    '@type': 'ItemList',
    '@id': `${SITE_URL}/#${id}`,
    name: 'Paquetes de desarrollo a medida de Geck Codex',
    itemListElement: items.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Service',
        name: p.name,
        description: p.description,
        provider: { '@id': `${SITE_URL}/#organization` },
      },
    })),
  };
}

export interface PortfolioItem {
  name: string;
  description: string;
  url?: string;
  image?: string;
}

export function portfolioSchema(items: PortfolioItem[]): Record<string, unknown> {
  return {
    '@type': 'ItemList',
    name: 'Portafolio de proyectos de Geck Codex',
    itemListElement: items.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'CreativeWork',
        name: p.name,
        description: p.description,
        creator: { '@id': `${SITE_URL}/#organization` },
        ...(p.url ? { url: p.url } : {}),
        ...(p.image ? { image: p.image } : {}),
      },
    })),
  };
}

/** Página de contacto — ayuda a que el NAP se asocie a la URL correcta. */
export function contactPageSchema(): Record<string, unknown> {
  return {
    '@type': 'ContactPage',
    '@id': `${SITE_URL}/contacto/#webpage`,
    url: `${SITE_URL}/contacto/`,
    name: 'Contacto | Geck Codex',
    about: { '@id': `${SITE_URL}/#organization` },
    mainEntity: { '@id': `${SITE_URL}/#organization` },
  };
}
