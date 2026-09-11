import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { Menu, X, Briefcase, Info, BookOpen, Mail, Layers, ArrowUpRight } from "lucide-react";
import { FLAGS } from "./Flags.jsx";
import { translations as allTranslations } from "../i18n/translations";
import { localizedPath, resolvePath, DEFAULT_LOCALE } from "../i18n/routes";

const navTranslations = {
  en: allTranslations.en.nav,
  es: allTranslations.es.nav,
  pt: allTranslations.pt.nav,
};

/* El espanol va con la bandera de MEXICO, no la de Espana: la variante del
   sitio es es-MX y el mercado esta en Chihuahua, no en Madrid. Las banderas se
   dibujan en `Flags.jsx` — el emoji no sirve, en Windows no existe el glifo. */
const languageOptions = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "pt", label: "Português" },
];

export default function GeckNavbar({ lang, pageKey }) {
  // El idioma lo fija la URL de la página, no un estado de React: cada variante
  // se genera en build con su propio HTML. El <html lang> ya viene correcto
  // desde el servidor, así que aquí no hay nada que sincronizar.
  const language = lang || DEFAULT_LOCALE;

  // ── Tema (light/dark). El valor inicial ya lo fijó el script no-flash
  //    del <head> sobre <html data-theme>; aquí solo lo leemos. ──
  const [theme, setTheme] = useState('dark');

  useLayoutEffect(() => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    setTheme(current);
  }, []);

  // El cambio de tema es un fundido de color, sin barrido en pantalla: la
  // clase `theme-anim` activa la transicion global de color durante ~360ms
  // y se retira sola. Toda la animacion visible vive en el switch.
  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    const root = document.documentElement;
    root.classList.add('theme-anim');
    setTheme(next);
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('geck-theme', next); } catch (e) { /* modo privado */ }
    window.setTimeout(() => root.classList.remove('theme-anim'), 360);
  };

  const [menuOpen, setMenuOpen] = useState(false);
  const [menuClosing, setMenuClosing] = useState(false);
  const [revealOpen, setRevealOpen] = useState(false);
  const [reveal, setReveal] = useState({ x: 0, y: 0, r: 0 });
  const [navVisible, setNavVisible] = useState(true);
  const [atTop, setAtTop] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const lastScrollYRef = useRef(0);
  const menuBtnRef = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 860px)');
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const t = navTranslations[language];
  const isMenuShown = menuOpen && !menuClosing;

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      setAtTop(current < 10);
      if (current < 10) setNavVisible(true);
      else if (current > lastScrollYRef.current && current > 100) setNavVisible(false);
      else if (current < lastScrollYRef.current) setNavVisible(true);
      lastScrollYRef.current = current;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [menuOpen]);

  // Dispara el crecimiento del círculo en el frame siguiente al montaje
  useEffect(() => {
    if (!menuOpen) return;
    const id = requestAnimationFrame(() => setRevealOpen(true));
    return () => cancelAnimationFrame(id);
  }, [menuOpen]);

  const openMenu = () => {
    const rect = menuBtnRef.current?.getBoundingClientRect();
    const cx = rect ? rect.left + rect.width / 2 : window.innerWidth;
    const cy = rect ? rect.top + rect.height / 2 : 0;
    // Radio que alcanza la esquina más lejana (cubre todo el viewport)
    const r = Math.hypot(Math.max(cx, window.innerWidth - cx), Math.max(cy, window.innerHeight - cy)) * 1.05;
    setReveal({ x: cx, y: cy, r });
    setMenuOpen(true);
  };

  const closeMenu = () => {
    setRevealOpen(false);
    setMenuClosing(true);
    // La capa dorada es la ultima en irse: 0.16s de retardo + 0.66s de barrido.
    setTimeout(() => { setMenuOpen(false); setMenuClosing(false); }, 840);
  };

  const toggleMenu = () => { if (menuOpen) closeMenu(); else openMenu(); };

  // Cambiar de idioma navega a la MISMA página en la otra lengua. Es lo que
  // hace que exista una URL por idioma, que es lo único que Google puede
  // indexar por separado. Si la página actual no tiene variante (las legales
  // solo existen en español), se va a la home de ese idioma.
  // Se resuelve durante el render y no dentro de un onClick, para que el
  // destino viva en el atributo href y no en un manejador de eventos.
  // `pageKey` llega del servidor; window.location es solo el respaldo para
  // cuando el nav se monta sin saber en que pagina esta.
  const languageHref = (code) => {
    const key =
      pageKey ??
      (typeof window !== 'undefined'
        ? resolvePath(window.location.pathname)?.page
        : null);
    return localizedPath(key ?? 'home', code);
  };

  const handleNavLinkClick = () => { if (menuOpen) closeMenu(); };

  // Los enlaces apuntan a la variante del idioma actual: navegar dentro del
  // sitio nunca debe devolverte al español. El blog solo existe en español.
  const navLinks = [
    { key: "portfolio", icon: Briefcase, href: localizedPath("portfolio", language) },
    { key: "services", icon: Layers, href: localizedPath("services", language) },
    { key: "about", icon: Info, href: localizedPath("about", language) },
    { key: "blog", icon: BookOpen, href: "/blog/" },
    // En móvil el acceso a Contacto vive dentro del menú (no en la barra)
    ...(isMobile ? [{ key: "contact", icon: Mail, href: localizedPath("contact", language) }] : []),
  ];

  return (
    <>
      <style>{`
        :root { --navy-deep: #061327; }
        * { box-sizing: border-box; }

        /* ── Pills (Contacto / Menú) ── */
        /* ── Logo en texto: Geck Codex ── */
        .nav-logo-text {
          display: flex; align-items: baseline; gap: 0.5rem;
          font-family: var(--font-display);
          font-weight: 700; font-size: 2.4rem; line-height: 1;
          letter-spacing: -0.02em;
        }
        .nav-logo-geck { color: var(--accent-text); }
        .nav-logo-codex { color: var(--accent-text); }
        .nav-logo-link { transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1); }
        .nav-logo-link:hover { transform: translateY(-2px); }

        .nav-actions { gap: 1.25rem; }

        .nav-pill {
          display: flex; align-items: center; gap: 1rem;
          padding: 0.5rem 0.6rem 0.5rem 1.9rem;
          border-radius: 999px;
          backdrop-filter: blur(24px) saturate(160%);
          -webkit-backdrop-filter: blur(24px) saturate(160%);
          font-weight: 700; font-size: 1.5rem;
          text-decoration: none; cursor: pointer;
          transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.45s cubic-bezier(0.22, 1, 0.36, 1), background 0.45s ease, color 0.45s ease;
          white-space: nowrap;
        }

        .nav-pill-contact {
          color: var(--gold);
          background: var(--navy-dark);
          border: 1px solid var(--border);
        }
        .nav-pill-contact:hover {
          transform: translateY(-3px);
        }

        .nav-pill-menu {
          color: var(--on-accent);
          background: var(--accent);
          border: 1px solid var(--border);
        }
        .nav-pill-menu:hover {
          transform: translateY(-3px);
        }
        /* Con el menú abierto la píldora se invierte y acompaña al barrido:
           el oro se va al icono y el fondo se funde con la capa que acaba de
           cubrir la pantalla, en vez de quedarse dorada sobre dorado. */
        .nav-pill-menu[aria-expanded="true"] {
          background: var(--navy-dark);
          color: var(--accent);
        }
        .nav-pill-menu[aria-expanded="true"] .nav-pill-icon {
          background: var(--accent);
          color: var(--on-accent);
        }

        /* ── Círculo que encierra el icono de cada píldora ── */
        .nav-pill-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 3.1rem;
          height: 3.1rem;
          border-radius: 50%;
          flex-shrink: 0;
          transition: background 0.45s ease, color 0.45s ease;
        }
        /* Contacto (navy): círculo dorado tenue */
        .nav-pill-contact .nav-pill-icon {
          background: rgba(195, 173, 133, 0.14);
          border: 1px solid rgba(195, 173, 133, 0.4);
          color: var(--gold);
        }
        /* Menú (dorado): círculo navy con icono dorado */
        .nav-pill-menu .nav-pill-icon {
          background: var(--navy-dark);
          color: var(--accent);
        }

        /* ── Carrusel vertical del texto del botón Menú ── */
        .menu-toggle-text {
          display: inline-block; overflow: hidden;
          height: 1.25em; line-height: 1.25em;
        }
        .menu-toggle-track {
          display: flex; flex-direction: column;
          transition: transform 0.6s cubic-bezier(0.34, 1.4, 0.5, 1);
        }
        .menu-toggle-track > span {
          height: 1.25em; line-height: 1.25em;
          display: block; text-align: center;
        }
        .menu-toggle-track[data-open="true"] { transform: translateY(-50%); }

        /* ── Menú: reveal en capas ──
           El fondo no cambia de color de un tirón. Tres capas crecen desde el
           botón con retardos distintos: primero barre el oro, detrás entra un
           tono intermedio y al final se asienta el navy. Lo que se ve es un
           destello dorado cruzando la pantalla que deja el fondo definitivo,
           no un círculo de un solo color. Al cerrar el orden se invierte: se
           va el navy primero y el oro sale al último, así que el destello
           también aparece de salida. */
        .menu-reveal {
          position: fixed; inset: 0; z-index: 59;
          display: flex; align-items: center; justify-content: center;
          background: transparent;
          overflow-y: auto;
          pointer-events: none;
        }
        .menu-reveal.is-open { pointer-events: auto; }

        .mr-layer {
          position: fixed; inset: 0;
          clip-path: circle(0px at var(--cx) var(--cy));
          transition: clip-path 0.66s cubic-bezier(0.76, 0, 0.24, 1);
          transition-delay: var(--out-delay);
          pointer-events: none;
        }
        .menu-reveal.is-open .mr-layer {
          clip-path: circle(var(--r) at var(--cx) var(--cy));
          transition-delay: var(--in-delay);
        }
        .mr-layer--gold {
          background: var(--accent);
          --in-delay: 0s; --out-delay: 0.16s;
        }
        .mr-layer--mid {
          background: color-mix(in srgb, var(--accent) 28%, var(--navy-dark));
          --in-delay: 0.09s; --out-delay: 0.08s;
        }
        .mr-layer--base {
          background: var(--navy-dark);
          --in-delay: 0.18s; --out-delay: 0s;
        }
        /* Halo dorado radial sutil centrado en el origen del círculo */
        .mr-layer--base::after {
          content: "";
          position: absolute; inset: 0;
          background: radial-gradient(circle at var(--cx) var(--cy),
            color-mix(in srgb, var(--accent) 16%, transparent), transparent 55%);
          pointer-events: none;
        }

        /* Anillo que sale disparado del botón al abrir: deja claro de dónde
           nace el barrido y se desvanece solo, sin dejar nada que limpiar. */
        .mr-ring {
          position: fixed; left: var(--cx); top: var(--cy);
          width: 0; height: 0; border-radius: 50%;
          border: 2px solid var(--accent);
          transform: translate(-50%, -50%);
          opacity: 0; pointer-events: none;
        }
        .menu-reveal.is-open .mr-ring {
          animation: mr-ring-out 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        @keyframes mr-ring-out {
          0%   { width: 0; height: 0; opacity: 0.85; }
          100% { width: calc(var(--r) * 2.1); height: calc(var(--r) * 2.1); opacity: 0; }
        }

        .menu-reveal__inner {
          position: relative;
          width: min(820px, 90vw);
          padding: clamp(2rem, 6vh, 4rem) clamp(1.5rem, 5vw, 3rem);
        }

        /* ── Links grandes editoriales ── */
        .mr-links { display: flex; flex-direction: column; }
        .mr-link {
          display: flex; align-items: baseline; gap: clamp(1rem, 3vw, 2rem);
          padding: clamp(0.9rem, 2.2vh, 1.5rem) 0.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          text-decoration: none;
          color: var(--white-soft);
          opacity: 0; transform: translateY(26px); filter: blur(8px);
          transition: opacity 0.5s ease, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1),
                      filter 0.5s ease, color 0.3s ease, padding-left 0.3s ease;
        }
        /* Entran cuando el navy ya se asentó, no encima del barrido dorado. */
        .menu-reveal.is-open .mr-link {
          opacity: 1; transform: translateY(0); filter: blur(0);
          transition-delay: calc(0.34s + var(--i) * 0.07s);
        }
        .mr-link__num {
          font-family: var(--font-body);
          font-size: clamp(0.85rem, 1.4vw, 1rem); font-weight: 600;
          color: var(--accent); flex-shrink: 0; min-width: 2.4ch;
        }
        .mr-link__label {
          font-family: var(--font-display);
          font-size: clamp(2.1rem, 7vw, 4rem); font-weight: 700;
          line-height: 1; letter-spacing: -0.02em;
        }
        .mr-link__arrow {
          margin-left: auto; align-self: center;
          color: var(--accent);
          opacity: 0; transform: translate(-12px, 4px);
          transition: opacity 0.35s ease, transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .mr-link:hover { color: var(--accent); padding-left: 1.25rem; }
        .mr-link:hover .mr-link__arrow { opacity: 1; transform: translate(0, 0); }

        /* ── Pie: idioma + tema ── */
        /* Los dos mandos —idioma y tema— van en la MISMA fila y repartidos.
           Apilados, cada uno arrancaba pegado al margen izquierdo y el pie del
           menu se veia cargado hacia ese lado, con un hueco muerto a la
           derecha. En fila el peso queda repartido y el bloque se cierra solo.
           Van repartidos y no centrados: son dos mandos distintos, y
           separarlos evita que se lean como un solo control de cinco botones. */
        .mr-footer {
          display: flex; flex-wrap: wrap;
          justify-content: space-between; align-items: flex-end;
          gap: 1.25rem 1.5rem;
          margin-top: clamp(2rem, 5vh, 3.5rem);
          opacity: 0; transform: translateY(20px);
          transition: opacity 0.5s ease, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .menu-reveal.is-open .mr-footer {
          opacity: 1; transform: translateY(0);
          transition-delay: calc(0.34s + 4 * 0.07s);
        }
        /* El alto lo fija el pie, no cada mando: idioma y tema tienen
           formas distintas (una tira de tres, un switch) y si cada uno
           calculara su altura por su cuenta quedarian desalineados en la
           fila, que es justo como se veian. */
        .mr-footer { --mr-ctl-h: 42px; }
        .mr-control { display: flex; flex-direction: column; gap: 0.85rem; }
        .mr-control__label {
          font-size: 0.78rem; letter-spacing: 0.22em; text-transform: uppercase;
          color: rgba(255,255,255,0.45); font-weight: 600;
        }
        .mr-seg {
          position: relative;
          display: inline-flex; gap: 0.25rem;
          height: var(--mr-ctl-h); padding: 0.25rem;
          border-radius: 999px;
          background: var(--navy-deep);
          border: 1px solid var(--border);
        }

        /* Las tres lenguas: una tira de pastillas, la activa en oro.
           Son enlaces y no botones a proposito —un <button> que navega no se
           abre en pestana nueva, no se copia con clic derecho y ningun
           rastreador lo sigue— asi que hay que apagarles el subrayado y
           heredar la tipografia a mano. */
        .mr-seg__btn {
          display: inline-flex; align-items: center; justify-content: center;
          gap: 0.4rem;
          min-width: 2.6rem; height: 100%; padding: 0 0.7rem;
          border: none; border-radius: 999px;
          background: transparent; cursor: pointer; text-decoration: none;
          color: rgba(255, 255, 255, 0.6);
          font-family: var(--font-body); font-size: 0.95rem;
          font-weight: 700; letter-spacing: 0.05em;
          transition: background 0.3s ease, color 0.3s ease, transform 0.3s ease;
        }
        .mr-seg__btn--lang { font-size: 0.82rem; letter-spacing: 0.04em; }
        /* Filete tenue: sobre el blanco de la bandera de Mexico, el borde del
           rectangulo desaparecia contra el fondo claro del boton activo. */
        .mr-flag {
          display: block; border-radius: 2px; flex: none;
          box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.22);
        }
        .mr-seg__btn:hover { color: var(--white-soft); transform: translateY(-1px); }
        .mr-seg__btn.active { background: var(--accent); color: var(--on-accent); }

        /* ── Toggle de tema: un solo astro que se transforma ──
           El mismo cuerpo viaja de un extremo al otro y por el camino el sol
           se convierte en luna.

           REGLA DE ORO AQUI: solo se animan transform y opacity. Son las
           dos unicas propiedades que el navegador resuelve en el compositor,
           sin volver a calcular ni repintar nada. La version anterior animaba
           background y box-shadow del astro —un glow con blur repintado
           en cada frame, dentro de un contorno circular que tambien hay que
           recortar en cada frame— y por eso se veia a tirones. El color ya no
           se interpola: hay dos capas, una dorada y una palida, y lo que
           cambia es cual esta visible.

           La otra mitad del efecto es el ORDEN. Las piezas no se mueven a la
           vez: al ir a oscuro los rayos se apagan, el astro sale, la mordida
           lo alcanza a medio camino y las estrellas asoman cuando ya llego;
           al volver, la mordida se cierra ANTES de que el astro emprenda el
           regreso y los rayos salen al final. Para acelerar o frenar todo,
           los numeros estan aqui arriba. */
        .tsw {
          --tsw-w: 84px; --tsw-h: var(--mr-ctl-h); --tsw-orb: 30px; --tsw-pad: 6px;
          --tsw-travel: 1400ms;  /* recorrido del astro */
          --tsw-morph: 1100ms;   /* la mordida */
          --tsw-rays: 900ms;     /* los rayos */
          /* Arranca con calma, acelera, frena largo. A esta duracion un
             overshoot se notaria como un tropiezo, asi que no lo lleva. */
          --tsw-ease: cubic-bezier(0.62, 0.02, 0.22, 1);
          --tsw-ease-soft: cubic-bezier(0.65, 0, 0.35, 1);
          --tsw-track: color-mix(in srgb, var(--accent) 42%, var(--brand-ivory));
          position: relative;
          width: var(--tsw-w); height: var(--tsw-h);
          padding: 0; border-radius: 999px; cursor: pointer;
          border: 1px solid var(--border);
          background: var(--tsw-track);
          overflow: hidden;
          /* El carril es lo unico que aun interpola color, y puede: es un
             fondo plano, sin blur ni recorte, una sola capa. */
          transition: background var(--tsw-travel) var(--tsw-ease-soft),
                      border-color var(--tsw-travel) var(--tsw-ease-soft),
                      transform 0.3s ease;
          -webkit-tap-highlight-color: transparent;
        }
        .tsw[data-on="dark"] { --tsw-track: var(--navy-deep); }
        .tsw:hover { transform: translateY(-1px); }
        .tsw:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }

        /* El cuerpo que viaja. Lleva dentro el disco, el halo y los rayos:
           los dos ultimos van FUERA del disco porque este recorta (necesita
           recortar para que la mordida no se salga de su contorno). */
        .tsw__orb {
          position: absolute; top: 50%; left: var(--tsw-pad);
          width: var(--tsw-orb); height: var(--tsw-orb);
          transform: translateY(-50%);
          transition: transform var(--tsw-travel) var(--tsw-ease);
          transition-delay: 260ms;  /* de vuelta espera a que cierre la mordida */
          will-change: transform;
        }
        .tsw[data-on="dark"] .tsw__orb {
          transform: translate(calc(var(--tsw-w) - var(--tsw-orb) - var(--tsw-pad) * 2), -50%);
          transition-delay: 0ms;
        }

        /* El disco: palido de base (la luna) con la capa dorada encima. */
        .tsw__astro {
          position: absolute; inset: 0; border-radius: 50%;
          overflow: hidden;
          background: var(--brand-ivory);
          transition: transform 0.3s ease;
        }
        /* El sol. Se apaga por opacidad en vez de interpolar el color de
           fondo: un fundido entre dos capas planas no cuesta repintado. */
        .tsw__astro::before {
          content: ""; position: absolute; inset: 0;
          background: var(--accent);
          transition: opacity calc(var(--tsw-travel) * 0.6) var(--tsw-ease-soft);
          transition-delay: 180ms;
        }
        .tsw[data-on="dark"] .tsw__astro::before { opacity: 0; transition-delay: 0ms; }
        .tsw:hover .tsw__astro { transform: scale(1.06); }

        /* El halo, en su propia capa. El box-shadow es fijo y lo que se
           anima es la opacidad: asi el blur se rasteriza UNA vez. */
        .tsw__glow {
          position: absolute; inset: 0; border-radius: 50%;
          box-shadow: 0 0 16px 1px rgba(195, 173, 133, 0.65);
          transition: opacity calc(var(--tsw-travel) * 0.6) var(--tsw-ease-soft);
          transition-delay: 180ms;
          pointer-events: none;
        }
        .tsw[data-on="dark"] .tsw__glow { opacity: 0; transition-delay: 0ms; }
        /* El halo palido de la luna, debajo del dorado y al reves. */
        .tsw__glow--moon {
          box-shadow: 0 0 14px 1px rgba(245, 241, 232, 0.4);
          opacity: 0; transition-delay: 0ms;
        }
        .tsw[data-on="dark"] .tsw__glow--moon { opacity: 1; transition-delay: 420ms; }

        /* La mordida: un circulo del color del carril que crece dentro del
           disco. Al ser el mismo color del fondo, lo que se ve no es un
           circulo encima sino el astro vaciandose en creciente. */
        .tsw__bite {
          position: absolute; top: -26%; left: 32%;
          width: 100%; height: 100%; border-radius: 50%;
          background: var(--tsw-track);
          transform: scale(0);
          transition: transform var(--tsw-morph) var(--tsw-ease),
                      background var(--tsw-travel) var(--tsw-ease-soft);
          transition-delay: 0ms;  /* de vuelta cierra primero */
          will-change: transform;
        }
        /* De ida alcanza al astro a medio recorrido, no sale con el. */
        .tsw[data-on="dark"] .tsw__bite { transform: scale(1); transition-delay: 320ms; }

        /* Ocho rayos en corona. Van en box-shadow de un solo nodo en vez de
           ocho spans: es un elemento, y escalarlo los retrae todos a la vez.
           El box-shadow no cambia nunca — se mueve el nodo entero. */
        .tsw__rays {
          position: absolute; top: 50%; left: 50%;
          width: 3.5px; height: 3.5px; margin: -1.75px 0 0 -1.75px;
          border-radius: 50%; background: transparent;
          box-shadow:
            0 -17px 0 var(--accent),      12px -12px 0 var(--accent),
            17px 0 0 var(--accent),       12px 12px 0 var(--accent),
            0 17px 0 var(--accent),      -12px 12px 0 var(--accent),
            -17px 0 0 var(--accent),     -12px -12px 0 var(--accent);
          transition: transform var(--tsw-rays) var(--tsw-ease),
                      opacity calc(var(--tsw-rays) * 0.5) ease;
          transition-delay: 700ms;  /* salen cuando el astro ya volvio */
          will-change: transform;
        }
        /* Se retraen girando: caen hacia el centro en espiral, no en linea.
           De ida se van de inmediato — el sol se apaga y luego viaja. */
        .tsw[data-on="dark"] .tsw__rays {
          transform: scale(0.3) rotate(-60deg); opacity: 0;
          transition-delay: 0ms;
        }

        /* Estrellas del lado que el astro deja libre al irse a la derecha.
           Escalonadas: aparecer las tres a la vez se lee como un parpadeo. */
        .tsw__star {
          position: absolute; border-radius: 50%;
          background: var(--brand-ivory);
          opacity: 0; transform: scale(0);
          transition: opacity 300ms ease, transform 500ms var(--tsw-ease);
          transition-delay: 0ms;  /* se apagan juntas; lo escalonado es entrar */
        }
        .tsw__star--a { width: 3px; height: 3px; left: 15px; top: 11px; }
        .tsw__star--b { width: 2px; height: 2px; left: 25px; top: 27px; }
        .tsw__star--c { width: 2.5px; height: 2.5px; left: 33px; top: 16px; }
        .tsw[data-on="dark"] .tsw__star { opacity: 0.9; transform: scale(1); }
        .tsw[data-on="dark"] .tsw__star--a { transition-delay: 760ms; }
        .tsw[data-on="dark"] .tsw__star--b { transition-delay: 900ms; }
        .tsw[data-on="dark"] .tsw__star--c { transition-delay: 1040ms; }

        /* ── Responsive ── */
        /* En móvil/tablet Contacto pasa al menú → la barra deja solo logo + Menú */
        @media (max-width: 860px) {
          .nav-pill-contact { display: none; }
        }
        @media (max-width: 768px) {
          .nav-logo-text { font-size: 2.1rem; }
          .nav-pill { padding: 0.4rem 0.5rem 0.4rem 1.5rem; font-size: 1.2rem; }
          .nav-pill-icon { width: 2.7rem; height: 2.7rem; }
        }
        @media (max-width: 480px) {
          .nav-row { padding: 0.85rem 1.1rem !important; }
          .nav-logo-text { font-size: 2rem; }
          .mr-footer { gap: 1.5rem; }
        }

        @media (prefers-reduced-motion: reduce) {
          /* Sin barrido: las capas aparecen ya cubiertas y el anillo no sale. */
          .mr-layer { transition: none !important; transition-delay: 0s !important; }
          .mr-ring { display: none !important; }
          .menu-reveal .mr-link,
          .menu-reveal .mr-footer { transition: none !important; opacity: 1 !important; transform: none !important; filter: none !important; }
          .nav-pill, .mr-link, .mr-seg__btn { transition: none !important; }
          .tsw, .tsw__orb, .tsw__astro, .tsw__astro::before, .tsw__glow,
          .tsw__bite, .tsw__rays, .tsw__star { transition: none !important; }
        }
      `}</style>

      {/* ── Barra transparente: solo secciones flotantes, sin contenedor de barra ── */}
      <nav
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 60,
          pointerEvents: "none",
          transform: navVisible ? "translateY(0)" : "translateY(-130%)",
          transition: "transform 0.4s ease",
        }}
      >
        <div
          className="nav-row"
          style={{
            padding: "1.4rem 2.5rem",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            maxWidth: "2200px", margin: "0 auto",
          }}
        >
          {/* Sección Geck Codex — sin contenedor, parte de la página */}
          <a
            href={localizedPath("home", language)}
            aria-label="Geck Codex"
            className="nav-logo-link"
            style={{
              display: "flex", alignItems: "center", textDecoration: "none",
              pointerEvents: "auto",
            }}
          >
            <span className="nav-logo-text">
              <span className="nav-logo-geck">Geck</span>
              <span className="nav-logo-codex">Codex</span>
            </span>
          </a>

          {/* Secciones Contacto + Menú — con contenedor visible y bordes redondeados */}
          <div className="nav-actions" style={{ display: "flex", alignItems: "center", pointerEvents: "auto" }}>
            <a href={localizedPath("contact", language)} className="nav-pill nav-pill-contact">
              <span className="nav-pill-text">{t.contact}</span>
              <span className="nav-pill-icon"><Mail size={20} /></span>
            </a>

            <button
              ref={menuBtnRef}
              type="button"
              onClick={toggleMenu}
              aria-label={isMenuShown ? t.close : t.menu}
              aria-expanded={menuOpen}
              className="nav-pill nav-pill-menu"
            >
              <span className="menu-toggle-text">
                <span className="menu-toggle-track" data-open={isMenuShown}>
                  <span>{t.menu}</span>
                  <span>{t.close}</span>
                </span>
              </span>
              <span className="nav-pill-icon">{isMenuShown ? <X size={22} /> : <Menu size={22} />}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Menú: reveal circular que crece desde el botón ── */}
      {menuOpen && (
        <div
          className={`menu-reveal ${revealOpen && !menuClosing ? "is-open" : ""}`}
          style={{ "--cx": `${reveal.x}px`, "--cy": `${reveal.y}px`, "--r": `${reveal.r}px` }}
          role="dialog"
          aria-modal="true"
          aria-label={t.menu}
        >
          {/* Las tres capas del barrido + el anillo del origen. Van antes del
              contenido para que este pinte encima sin pelear por z-index. */}
          <div className="mr-layer mr-layer--gold" />
          <div className="mr-layer mr-layer--mid" />
          <div className="mr-layer mr-layer--base" />
          <span className="mr-ring" />

          <div className="menu-reveal__inner">
            <nav className="mr-links">
              {navLinks.map(({ key, href }, i) => (
                <a
                  key={key}
                  href={href}
                  onClick={handleNavLinkClick}
                  className="mr-link"
                  style={{ "--i": i }}
                >
                  <span className="mr-link__num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="mr-link__label">{t[key]}</span>
                  <ArrowUpRight className="mr-link__arrow" size={28} />
                </a>
              ))}
            </nav>

            <div className="mr-footer">
              <div className="mr-control">
                <span className="mr-control__label">{t.language}</span>
                <div className="mr-seg">
                  {/* Enlaces, no botones. Un <button> que navega no se puede
                      abrir en pestana nueva, no se copia con clic derecho y
                      ningun rastreador lo sigue. El destino se calcula aqui
                      mismo en el render en vez de dentro del onClick. */}
                  {languageOptions.map((opt) => {
                    const Flag = FLAGS[opt.code];
                    return (
                      <a
                        key={opt.code}
                        href={languageHref(opt.code)}
                        className={`mr-seg__btn mr-seg__btn--lang ${language === opt.code ? "active" : ""}`}
                        aria-label={opt.label}
                        aria-current={language === opt.code ? "true" : undefined}
                      >
                        {/* La bandera acompana al codigo, nunca lo sustituye:
                            un idioma no es un pais, y el codigo es lo que de
                            verdad informa. */}
                        {Flag && <Flag className="mr-flag" />}
                        {opt.code.toUpperCase()}
                      </a>
                    );
                  })}
                </div>
              </div>

              <div className="mr-control">
                <span className="mr-control__label">{t.theme}</span>
                {/* La etiqueta dice a dónde te lleva pulsar, no en dónde
                    estás: es lo único accionable del control y en un lector
                    de pantalla "modo claro" es mas util que "modo oscuro,
                    activado". El estado lo lleva aria-pressed. */}
                <button
                  type="button"
                  className="tsw"
                  data-on={theme}
                  onClick={toggleTheme}
                  aria-label={theme === "dark" ? t.themeLight : t.themeDark}
                  aria-pressed={theme === "dark"}
                >
                  <span className="tsw__star tsw__star--a" aria-hidden="true" />
                  <span className="tsw__star tsw__star--b" aria-hidden="true" />
                  <span className="tsw__star tsw__star--c" aria-hidden="true" />
                  <span className="tsw__orb" aria-hidden="true">
                    <span className="tsw__glow tsw__glow--moon" />
                    <span className="tsw__glow" />
                    <span className="tsw__astro"><span className="tsw__bite" /></span>
                    <span className="tsw__rays" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
