# CLAUDE.md — PaginaGECK (Geck Codex)

## Descripcion del proyecto

Sitio web corporativo de **Geck Codex**, agencia de desarrollo de tecnologia ubicada en Parral, Chihuahua, Mexico. El sitio presenta los servicios, portafolio, equipo y opciones de contacto de la agencia con un diseno premium orientado a captacion de clientes.

- URL en produccion: https://geckcodex.com
- Contacto: geckcodexoficial@gmail.com | WhatsApp +52-627-174-5436

---

## Stack tecnico

| Capa | Tecnologia |
|------|------------|
| Framework principal | Astro 5 (SSG con hidratacion parcial) |
| Componentes interactivos | React 19 |
| Tipos | TypeScript (modo strict) |
| Estilos | Tailwind CSS 4 + CSS global personalizado |
| Animaciones | Framer Motion, Canvas API |
| Fisica | Matter.js 0.20.0 (efecto lluvia de tecnologias) |
| Mapas | Leaflet 1.9 + React-Leaflet 5 |
| Iconos | Lucide React |
| SEO | @astrojs/sitemap, Open Graph, Schema.org |

---

## Estructura del proyecto

```
src/
├── components/
│   ├── hero/           # Secciones del hero de la homepage
│   ├── abaut/          # Componentes de la pagina "Nosotros"
│   ├── servicios/      # Componentes de la pagina "Servicios"
│   ├── portafolio/     # Componentes del portafolio
│   ├── contacto/       # Formulario de contacto
│   ├── Navbar.jsx      # Navegacion principal (3 idiomas)
│   ├── Footer.jsx      # Pie de pagina con redes sociales
│   ├── VideoBackground.jsx
│   └── PageContent.jsx
├── pages/
│   ├── index.astro     # Homepage
│   ├── nosotros.astro  # Quienes somos
│   ├── servicios.astro # Servicios ofrecidos
│   ├── portafolio.astro
│   ├── contacto.astro
│   └── blog.astro      # En construccion
├── layouts/
│   └── MainLayout.astro  # Layout base con SEO
└── styles/
    ├── global.css        # Variables CSS, reset, Tailwind
    └── stacktecno.css    # Estilos del tech stack
```

---

## Paleta de colores

```css
--navy-dark:   #0B1D33   /* Fondo principal */
--navy-mid:    #0b1f49
--navy-light:  #0c1e3c
--gold:        #D4AF37   /* Color de acento principal */
--gold-light:  #F4E4BC   /* Texto sobre fondos oscuros */
--gold-dark:   #B8941F
```

Siempre usar estas variables al crear o modificar componentes. No introducir colores fuera de esta paleta sin justificacion.

---

## Patrones de animacion establecidos

El sitio tiene un sistema de animaciones coherente. Al modificar o crear componentes, respetar estos patrones:

1. **Ondas canvas** — usadas en Navbar y Footer (`AnimatedWaves`)
2. **Parallax con scroll** — via `useScroll` y `useTransform` de Framer Motion
3. **Dispersion de texto** — efecto hover caracter por caracter (`DisperseText`)
4. **Links magneticos** — seguimiento del mouse en links de nav (`MagneticLink`)
5. **Lluvia de tecnologias** — simulacion de fisica con Matter.js (`TechStackRain`)
6. **Carousel infinito** — clientes con loop CSS, hover con scale y glow

Siempre respetar `prefers-reduced-motion` al agregar animaciones.

---

## Idiomas

El sitio soporta **espanol, ingles y portugues**. El Navbar incluye un selector de idioma. Al agregar texto estatico a componentes, considerar que debera ser traducible en el futuro.

---

## Convenciones de codigo

- Componentes React en `.jsx` dentro de `src/components/`
- Paginas en `.astro` dentro de `src/pages/`
- Alias de ruta: `@/*` apunta a `src/*`
- Scripts de desarrollo: `npm run dev` (puerto 4321), `npm run build`, `npm run preview`
- TypeScript en modo strict — no usar `any` sin justificacion

---

## Paginas y sus responsabilidades

| Pagina | Ruta | Estado |
|--------|------|--------|
| Homepage | `/` | Produccion |
| Nosotros | `/nosotros` | Produccion |
| Servicios | `/servicios` | Produccion |
| Portafolio | `/portafolio` | Produccion |
| Contacto | `/contacto` | Produccion |
| Blog | `/blog` | En construccion |

---

## Servicios que ofrece Geck Codex

- Desarrollo Web (responsive, SEO, Core Web Vitals, CRM)
- Apps Moviles (nativas y cross-platform)
- E-commerce
- SaaS
- Automatizacion de procesos
- UI/UX Design
- Marketing Digital
- Inversion en proyectos tecnologicos

---

## Clientes actuales (carousel)

- Gobierno Municipal de Parral
- Restaurante Las Chikis
- Capital Transport
- ITParral
- Coronado Gym

---

## Contacto e integraciones externas

- **WhatsApp**: enlace con mensaje automatico al +52-627-174-5436
- **Gmail**: formulario con pre-llenado via mailto
- **Mapas**: Leaflet con zoom animado a Parral, Chihuahua
- **SEO**: Google Site Verification incluido en el layout

---

## Lo que NO hacer

- No cambiar la paleta de colores sin aprobacion
- No agregar dependencias pesadas sin evaluar impacto en bundle
- No romper la animacion del Navbar (logotipo con dispersion de letras)
- No eliminar el soporte `prefers-reduced-motion`
- No modificar el archivo `astro.config.mjs` sin revisar que la URL del sitio (`https://geckcodex.com`) se mantenga correcta
- No usar `any` en TypeScript
- No agregar texto hardcodeado en un solo idioma si la seccion ya tiene soporte multilingue
