import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { anuncioVigente, contenidoDe, enlaceWhatsapp } from '../../data/anuncios.js';
import { trackLead } from '../../data/track.js';

/* ─── CAPA DE ANUNCIO ───────────────────────────────────────────────────────
 *
 * Flota por encima del sitio sin reemplazar ninguna seccion: una tarjeta mini
 * abajo a la izquierda (la derecha es del WhatsApp flotante) que abre un
 * escenario con el video a un lado y la informacion en pestanas.
 *
 * No sabe de que anuncio se trata: todo sale de `src/data/anuncios.js`. Hoy es
 * Radar GC; manana es otra entrada en ese archivo.
 *
 * Reglas que no se negocian:
 *  - NUNCA se abre sola. Solo con la tarjeta o con el enlace (`/#radar`).
 *  - Si la cierran, la tarjeta se encoge y no insiste. Se recuerda por id de
 *    anuncio; sin localStorage (modo privado) simplemente no se recuerda.
 *  - No pinta nada en el servidor. El anuncio vigente depende de la fecha de
 *    HOY y de lo que el visitante ya cerro, y ninguna de las dos se sabe al
 *    compilar. Arrancar en `null` en ambos lados evita el desfase al hidratar.
 *
 * Vive en el layout con `transition:persist`, asi que es el MISMO componente
 * entre navegaciones: no se duplica ni pierde si estaba encogida.
 */

const CLAVE = (id) => `gc-anuncio-cerrado:${id}`;

function leer(clave) {
  try { return window.localStorage.getItem(clave); } catch { return null; }
}
function guardar(clave, valor) {
  try { window.localStorage.setItem(clave, valor); } catch { /* sin storage, sin memoria */ }
}

/** Evento de apertura. Igual que trackLead: si no hay analitica, no pasa nada. */
function medirApertura(id, via) {
  if (typeof window.gcTrack !== 'function') return;
  try { window.gcTrack('anuncio_open', { id, via, page: window.location.pathname }); } catch { /* nunca romper la UI */ }
}

const pesos = (n) => `$${n.toLocaleString('en-US')}`;

function IconoRadar() {
  return (
    <svg className="gc-ad-radar" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <circle cx="12" cy="12" r="9.5" />
      <circle cx="12" cy="12" r="5" />
      <g className="gc-ad-radar__sweep"><path d="M12 12 L12 2.5" strokeWidth="1.8" strokeLinecap="round" /></g>
      <circle cx="16.5" cy="8" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconoPlay({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5.5v13l11-6.5z" />
    </svg>
  );
}

/* Poster o video. `estado`: 'pendiente' (aun no sabemos si existe el video),
 * 'listo' o 'ausente'. Mientras no hay video, el poster hace el trabajo y un
 * "Proximamente" ocupa el lugar del boton de reproducir. */
function Medio({ anuncio, estado, reproduciendo, silenciado, onPlay, onSonido, onVolumen, onError, videoRef, ui, compacto }) {
  return (
    <div className={`gc-ad__media${compacto ? ' is-compact' : ''}`}>
      {estado === 'listo' ? (
        <video
          ref={videoRef}
          className="gc-ad__video"
          src={anuncio.video}
          poster={anuncio.poster}
          preload="none"
          playsInline
          controls={reproduciendo}
          onPlay={onPlay}
          onVolumeChange={onVolumen}
          onError={onError}
        />
      ) : (
        <img
          className="gc-ad__video"
          src={anuncio.poster}
          alt=""
          width="720"
          height="1280"
          decoding="async"
        />
      )}
      {estado === 'listo' && !reproduciendo && (
        <button type="button" className="gc-ad__play" onClick={onPlay} aria-label={ui.reproducir}>
          <IconoPlay />
        </button>
      )}
      {estado === 'listo' && silenciado && (
        <button type="button" className="gc-ad__sound" onClick={onSonido}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M11 5 6 9H2v6h4l5 4V5z" />
            <path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14" />
          </svg>
          {ui.activarSonido}
        </button>
      )}
      {estado === 'ausente' && <span className="gc-ad__soon">{ui.proximamente}</span>}
    </div>
  );
}

function Bloque({ b, ui, cta }) {
  switch (b.tipo) {
    case 'pasos':
      return (
        <section className="gc-ad__sec">
          <h3>{b.titulo}</h3>
          {b.intro && <p className="gc-ad__intro-t">{b.intro}</p>}
          <ol className="gc-ad__steps">
            {b.items.map((it, i) => (
              <li key={it.titulo}>
                <span className="gc-ad__no" aria-hidden="true">{i + 1}</span>
                <div><b>{it.titulo}</b><span>{it.texto}</span></div>
              </li>
            ))}
          </ol>
        </section>
      );

    case 'lista':
      return (
        <section className="gc-ad__sec">
          <h3>{b.titulo}</h3>
          {b.intro && <p className="gc-ad__intro-t">{b.intro}</p>}
          <ul className="gc-ad__review">
            {b.items.map((it) => (
              <li key={it.titulo}><b>{it.titulo}</b><span>{it.texto}</span></li>
            ))}
          </ul>
        </section>
      );

    case 'caso': {
      // Las barras van a escala: la mas grande ocupa todo el ancho.
      const max = Math.max(...b.barras.map((r) => r.valor));
      const descripcion = `${b.total.etiqueta}: ${b.barras
        .map((r) => `${r.etiqueta} ${pesos(r.valor)} ${ui.pesos}`)
        .join(', ')}`;
      return (
        <section className="gc-ad__sec">
          <h3>{b.titulo}</h3>
          {b.intro && <p className="gc-ad__intro-t">{b.intro}</p>}
          <div className="gc-ad__case">
            <p className="gc-ad__who">{b.negocio ? `${b.negocio} · ${b.etiqueta}` : b.etiqueta}</p>
            <p className="gc-ad__big">{b.titular}</p>
            <div className="gc-ad__bars" role="img" aria-label={descripcion}>
              {b.barras.map((r) => (
                <div className="gc-ad__brow" key={r.etiqueta}>
                  <span>{r.etiqueta}</span>
                  <span className="gc-ad__track">
                    <span className="gc-ad__fill" style={{ width: `${(r.valor / max) * 100}%` }} />
                  </span>
                  <em>{pesos(r.valor)}</em>
                </div>
              ))}
            </div>
            <div className="gc-ad__tot">
              <span>{b.total.etiqueta}</span>
              <b>{pesos(b.total.valor)}</b>
            </div>
            <ul className="gc-ad__finds">
              {b.hallazgos.map((h) => (
                <li key={h.texto}>
                  <span className={`gc-ad__pill is-${h.nivel}`}>{ui.niveles[h.nivel]}</span>
                  <span>{h.texto}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      );
    }

    case 'preguntas':
      return (
        <section className="gc-ad__sec gc-ad__faq">
          <h3>{b.titulo}</h3>
          {b.items.map((q) => (
            <details key={q.pregunta}>
              <summary>{q.pregunta}</summary>
              <p>{q.respuesta}</p>
            </details>
          ))}
        </section>
      );

    case 'cierre':
      return (
        <div className="gc-ad__end">
          <b>{b.titulo}</b>
          <p>{b.texto}</p>
          {cta}
        </div>
      );

    default:
      return null;
  }
}

export default function CapaAnuncio({ lang = 'es' }) {
  const { lang: locale, t } = useLanguage(lang);
  const ui = t.anuncio;

  const [anuncio, setAnuncio] = useState(null);
  const [abierta, setAbierta] = useState(false);
  const [encogida, setEncogida] = useState(false);
  const [pestana, setPestana] = useState(0);
  const [video, setVideo] = useState('pendiente');
  const [reproduciendo, setReproduciendo] = useState(false);
  const [silenciado, setSilenciado] = useState(false);
  const angosta = useMediaQuery('(max-width: 700px)');

  const tarjetaRef = useRef(null);
  const dialogoRef = useRef(null);
  const cerrarRef = useRef(null);
  const videoRef = useRef(null);
  const tabsRef = useRef([]);
  // Copia sincrona de `abierta` para los listeners: el enlace y la tarjeta
  // pueden pedir abrir en el mismo tick y no debe contarse dos veces.
  const abiertaRef = useRef(false);

  const base = useId();
  const dialogoId = `${base}-dialogo`;
  const tituloId = `${base}-titulo`;

  // ── Cual anuncio, y si ya lo cerraron ────────────────────────────────────
  useEffect(() => {
    const a = anuncioVigente();
    setAnuncio(a);
    if (a) setEncogida(leer(CLAVE(a.id)) === '1');
  }, []);

  const abrir = useCallback((via) => {
    if (!anuncio || abiertaRef.current) return;
    abiertaRef.current = true;
    setAbierta(true);
    medirApertura(anuncio.id, via);
    // El enlace compartible queda en la barra mientras esta abierta. Se
    // conserva `history.state` porque ahi guarda su indice el ClientRouter.
    if (anuncio.hash && window.location.hash !== `#${anuncio.hash}`) {
      try {
        const { pathname, search } = window.location;
        window.history.replaceState(window.history.state, '', `${pathname}${search}#${anuncio.hash}`);
      } catch { /* la URL es un extra */ }
    }
  }, [anuncio]);

  const cerrar = useCallback(({ navegando = false } = {}) => {
    if (!anuncio || !abiertaRef.current) return;
    abiertaRef.current = false;
    setAbierta(false);
    setEncogida(true);
    setReproduciendo(false);
    setSilenciado(false);
    if (videoRef.current) {
      videoRef.current.pause();
      // Al reabrir con un clic ya puede sonar: se vuelve a intentar con audio.
      videoRef.current.muted = false;
    }
    guardar(CLAVE(anuncio.id), '1');
    if (navegando) return; // el router ya se encarga de la URL y del foco
    if (anuncio.hash && window.location.hash === `#${anuncio.hash}`) {
      try {
        const { pathname, search } = window.location;
        window.history.replaceState(window.history.state, '', `${pathname}${search}`);
      } catch { /* idem */ }
    }
    // El foco vuelve a quien abrio. setTimeout y no requestAnimationFrame: se
    // ejecuta despues de que React quite el `is-hidden` de la tarjeta, y no
    // depende de que la pestana este pintando (rAF se pausa en segundo plano).
    setTimeout(() => tarjetaRef.current?.focus({ preventScroll: true }), 0);
  }, [anuncio]);

  // ── Enlace compartible: /#radar abre la capa ─────────────────────────────
  useEffect(() => {
    if (!anuncio?.hash) return undefined;
    const revisar = () => {
      if (window.location.hash === `#${anuncio.hash}`) abrir('enlace');
    };
    revisar();
    window.addEventListener('hashchange', revisar);
    // Navegando con el ClientRouter a otra pagina con #radar no hay hashchange.
    document.addEventListener('astro:page-load', revisar);
    return () => {
      window.removeEventListener('hashchange', revisar);
      document.removeEventListener('astro:page-load', revisar);
    };
  }, [anuncio, abrir]);

  // Si el visitante navega (p. ej. boton Atras) con la capa abierta, se cierra
  // antes del cambio de pagina para no dejar el scroll del sitio bloqueado.
  useEffect(() => {
    const alNavegar = () => cerrar({ navegando: true });
    document.addEventListener('astro:before-preparation', alNavegar);
    return () => document.removeEventListener('astro:before-preparation', alNavegar);
  }, [cerrar]);

  // ── Abierta: sin scroll detras, Esc cierra, foco adentro ─────────────────
  useEffect(() => {
    if (!abierta) return undefined;
    // En <html> y no en <body>: el Navbar escribe body.style.overflow al
    // abrir y cerrar su menu, y no deben pisarse.
    const html = document.documentElement;
    const previo = html.style.overflow;
    html.style.overflow = 'hidden';
    const foco = setTimeout(() => cerrarRef.current?.focus({ preventScroll: true }), 60);
    const onKey = (e) => {
      if (e.key === 'Escape') cerrar();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      html.style.overflow = previo;
      clearTimeout(foco);
      document.removeEventListener('keydown', onKey);
    };
  }, [abierta, cerrar]);

  // ── ¿Existe ya el video? Se pregunta al abrir, una sola vez ──────────────
  // Un HEAD y no la carga del video: lo unico que importa es si esta. Se mira
  // el tipo porque algunos hostings responden 200 con una pagina HTML.
  useEffect(() => {
    if (!abierta || !anuncio || video !== 'pendiente') return undefined;
    if (!anuncio.video) {
      setVideo('ausente');
      return undefined;
    }
    let vigente = true;
    fetch(anuncio.video, { method: 'HEAD' })
      .then((r) => {
        const tipo = r.headers.get('content-type') || '';
        if (vigente) setVideo(r.ok && tipo.startsWith('video/') ? 'listo' : 'ausente');
      })
      .catch(() => { if (vigente) setVideo('ausente'); });
    return () => { vigente = false; };
  }, [abierta, anuncio, video]);

  const reproducir = useCallback(() => {
    setReproduciendo(true);
    const v = videoRef.current;
    if (!v || !v.paused) return;
    v.play().catch(() => {
      // Sin un clic reciente (p. ej. llegando por /#radar) el navegador no
      // deja sonar. Antes que un video congelado, arranca en silencio y se
      // ofrece "Activar sonido".
      v.muted = true;
      setSilenciado(true);
      v.play().catch(() => { /* el navegador decide */ });
    });
  }, []);

  const activarSonido = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    setSilenciado(false);
    if (v.paused) v.play().catch(() => {});
  }, []);

  // Si lo activan desde los controles nativos, el boton propio sobra.
  const alCambiarVolumen = useCallback(() => {
    const v = videoRef.current;
    if (v && !v.muted) setSilenciado(false);
  }, []);

  // ── Autoplay al abrir ────────────────────────────────────────────────────
  // Arranca solo cuando ya se sabe que el video existe. Al reabrir sigue
  // donde se quedo. Con "reducir movimiento" no arranca: el visitante pidio
  // que nada se mueva sin su permiso.
  useEffect(() => {
    if (!abierta || video !== 'listo') return;
    let reducir = false;
    try { reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { /* sin preferencia */ }
    if (!reducir) reproducir();
  }, [abierta, video, reproducir]);

  // Foco atrapado: Tab y Shift+Tab dan la vuelta dentro del dialogo.
  const atraparFoco = (e) => {
    if (e.key !== 'Tab' || !dialogoRef.current) return;
    const enfocables = [
      ...dialogoRef.current.querySelectorAll('a[href], button:not([disabled]), video[controls], summary, [tabindex]'),
    ].filter((n) => n.tabIndex >= 0 && n.getClientRects().length > 0);
    if (!enfocables.length) return;
    const primero = enfocables[0];
    const ultimo = enfocables[enfocables.length - 1];
    if (e.shiftKey && document.activeElement === primero) {
      e.preventDefault();
      ultimo.focus();
    } else if (!e.shiftKey && document.activeElement === ultimo) {
      e.preventDefault();
      primero.focus();
    }
  };

  // Pestanas con flechas, Inicio y Fin (patron WAI-ARIA de tabs).
  const moverPestana = (e) => {
    if (!anuncio) return;
    const total = contenidoDe(anuncio, locale).pestanas.length;
    const destino = {
      ArrowRight: (pestana + 1) % total,
      ArrowLeft: (pestana - 1 + total) % total,
      Home: 0,
      End: total - 1,
    }[e.key];
    if (destino === undefined) return;
    e.preventDefault();
    setPestana(destino);
    tabsRef.current[destino]?.focus();
  };

  if (!anuncio) return null;

  const c = contenidoDe(anuncio, locale);
  const href = enlaceWhatsapp(anuncio, locale);
  const cta = (
    <a
      className="gc-ad__btn"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackLead('whatsapp', anuncio.id)}
    >
      {c.cta}
    </a>
  );

  const notas = [
    anuncio.cupo ? `${ui.cupo}: ${anuncio.cupo}` : '',
    anuncio.fechaLimite
      ? `${ui.cierra} ${new Date(`${anuncio.fechaLimite}T12:00:00`).toLocaleDateString(locale, { day: 'numeric', month: 'long' })}`
      : '',
  ].filter(Boolean);

  const hero = (
    <div className="gc-ad__hero">
      <p className="gc-ad__eyebrow">{c.ceja}</p>
      <h2 id={tituloId} className="gc-ad__title">{anuncio.titulo}</h2>
      <p className="gc-ad__lead">{c.gancho}</p>
      {c.areas?.length > 0 && (
        <ul className="gc-ad__areas" aria-label={ui.revisamos}>
          {c.areas.map((a) => <li key={a}>{a}</li>)}
        </ul>
      )}
      {notas.length > 0 && <p className="gc-ad__note">{notas.join(' · ')}</p>}
      {cta}
    </div>
  );

  const medio = (compacto) => (
    <Medio
      anuncio={anuncio}
      estado={video}
      reproduciendo={reproduciendo}
      silenciado={silenciado}
      onPlay={reproducir}
      onSonido={activarSonido}
      onVolumen={alCambiarVolumen}
      onError={() => setVideo('ausente')}
      videoRef={videoRef}
      ui={ui}
      compacto={compacto}
    />
  );

  return (
    <>
      <button
        ref={tarjetaRef}
        type="button"
        className={`gc-ad-card${encogida ? ' is-small' : ''}${abierta ? ' is-hidden' : ''}`}
        onClick={() => abrir('tarjeta')}
        aria-haspopup="dialog"
        aria-expanded={abierta}
        aria-controls={dialogoId}
      >
        {encogida ? (
          <>
            <IconoRadar />
            <b>{anuncio.titulo}</b>
          </>
        ) : (
          <>
            <span className="gc-ad-card__thumb">
              <img src={anuncio.poster} alt="" width="54" height="96" decoding="async" />
            </span>
            <span className="gc-ad-card__txt">
              <b>{anuncio.titulo}</b>
              <small>{c.tarjeta.subtitulo}</small>
              <span className="gc-ad-card__go"><IconoPlay size={12} />{c.tarjeta.accion}</span>
            </span>
          </>
        )}
      </button>

      <div className={`gc-ad${abierta ? ' is-open' : ''}`}>
        <div className="gc-ad__scrim" onClick={() => cerrar()} aria-hidden="true" />
        <div
          ref={dialogoRef}
          id={dialogoId}
          className="gc-ad__dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby={tituloId}
          onKeyDown={atraparFoco}
        >
          {!angosta && <div className="gc-ad__side">{medio(false)}</div>}

          <div className="gc-ad__main">
            <div className="gc-ad__head">
              {angosta ? (
                <div className={`gc-ad__intro${reproduciendo ? ' is-playing' : ''}`}>
                  {medio(true)}
                  {hero}
                </div>
              ) : hero}
              <button
                ref={cerrarRef}
                type="button"
                className="gc-ad__close"
                onClick={() => cerrar()}
                aria-label={ui.cerrar}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <div className="gc-ad__tabs" role="tablist" aria-label={ui.secciones} onKeyDown={moverPestana}>
              {c.pestanas.map((p, i) => (
                <button
                  key={p.etiqueta}
                  ref={(el) => { tabsRef.current[i] = el; }}
                  type="button"
                  role="tab"
                  id={`${base}-tab-${i}`}
                  aria-selected={i === pestana}
                  aria-controls={`${base}-panel-${i}`}
                  tabIndex={i === pestana ? 0 : -1}
                  onClick={() => setPestana(i)}
                >
                  {p.etiqueta}
                </button>
              ))}
            </div>

            {c.pestanas.map((p, i) => (
              <div
                key={p.etiqueta}
                className="gc-ad__pane"
                role="tabpanel"
                id={`${base}-panel-${i}`}
                aria-labelledby={`${base}-tab-${i}`}
                tabIndex={0}
                hidden={i !== pestana}
              >
                {p.bloques.map((b, j) => <Bloque key={j} b={b} ui={ui} cta={cta} />)}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        /* ── Tarjeta mini ─────────────────────────────────────────────── */
        .gc-ad-card {
          position: fixed;
          left: 1.25rem;
          bottom: calc(1.25rem + env(safe-area-inset-bottom, 0px));
          z-index: 900;
          display: flex;
          align-items: center;
          gap: 12px;
          width: 236px;
          padding: 9px 12px 9px 9px;
          text-align: left;
          background: var(--surface);
          color: var(--text);
          border: 1px solid var(--border);
          border-radius: 14px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.22);
          font-family: var(--font-body);
          cursor: pointer;
          animation: gc-ad-in 0.4s ease both;
          transition: opacity 0.2s ease, transform 0.2s ease, border-color 0.2s ease, visibility 0.2s;
        }
        .gc-ad-card:hover { transform: translateY(-2px); border-color: var(--accent); }
        .gc-ad-card:focus-visible { outline: 3px solid var(--accent); outline-offset: 3px; }
        .gc-ad-card.is-hidden { opacity: 0; visibility: hidden; pointer-events: none; }
        .gc-ad-card__thumb {
          flex: none;
          width: 54px;
          aspect-ratio: 9 / 16;
          border-radius: 9px;
          overflow: hidden;
          background: var(--brand-navy);
          border: 1px solid color-mix(in srgb, var(--brand-gold) 45%, transparent);
        }
        .gc-ad-card__thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .gc-ad-card__txt { min-width: 0; }
        .gc-ad-card b {
          display: block;
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 15px;
          line-height: 1.1;
        }
        .gc-ad-card small { display: block; color: var(--text-muted); font-size: 12px; margin: 2px 0 6px; }
        .gc-ad-card__go {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          font-weight: 600;
          color: var(--accent-text);
        }

        /* Cerrada una vez: queda solo el nombre, sin miniatura ni invitacion. */
        .gc-ad-card.is-small {
          width: auto;
          gap: 8px;
          padding: 9px 14px 9px 11px;
          border-radius: 999px;
        }
        .gc-ad-card.is-small b { font-size: 13px; }
        .gc-ad-card.is-small .gc-ad-radar { color: var(--accent-text); }

        .gc-ad-radar { width: 18px; height: 18px; flex: none; }
        .gc-ad-radar__sweep { transform-origin: 12px 12px; animation: gc-ad-spin 4s linear infinite; }

        /* ── Escenario ────────────────────────────────────────────────── */
        .gc-ad { position: fixed; inset: 0; z-index: 1000; visibility: hidden; transition: visibility 0s 0.28s; }
        .gc-ad.is-open { visibility: visible; transition-delay: 0s; }
        .gc-ad__scrim {
          position: absolute;
          inset: 0;
          background: color-mix(in srgb, var(--brand-navy) 60%, transparent);
          opacity: 0;
          transition: opacity 0.28s ease;
        }
        .gc-ad.is-open .gc-ad__scrim { opacity: 1; }

        .gc-ad__dialog {
          --gc-ad-h: min(700px, calc(100vh - 48px));
          position: absolute;
          left: 50%;
          top: 50%;
          width: min(1040px, calc(100vw - 48px));
          height: var(--gc-ad-h);
          display: grid;
          grid-template-columns: auto minmax(0, 1fr);
          background: var(--surface);
          color: var(--text);
          border: 1px solid var(--border);
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.4);
          font-family: var(--font-body);
          font-size: 15px;
          line-height: 1.5;
          opacity: 0;
          transform: translate(-50%, -50%) scale(0.97) translateY(8px);
          transition: opacity 0.28s ease, transform 0.28s ease;
        }
        @supports (height: 100dvh) {
          .gc-ad__dialog { --gc-ad-h: min(700px, calc(100dvh - 48px)); }
        }
        .gc-ad.is-open .gc-ad__dialog { opacity: 1; transform: translate(-50%, -50%); }

        /* Columna del video: siempre navy, en claro y en oscuro. */
        .gc-ad__side {
          background: var(--brand-navy);
          display: grid;
          place-items: center;
          padding: 24px;
        }
        .gc-ad__side .gc-ad__media { width: min(260px, calc((var(--gc-ad-h) - 48px) * 9 / 16)); }

        .gc-ad__media {
          position: relative;
          aspect-ratio: 9 / 16;
          border-radius: 14px;
          overflow: hidden;
          background: var(--brand-navy);
          border: 1px solid color-mix(in srgb, var(--brand-gold) 35%, transparent);
        }
        .gc-ad__video { display: block; width: 100%; height: 100%; object-fit: cover; background: var(--brand-navy); }
        .gc-ad__play {
          position: absolute;
          left: 50%;
          top: 55%;
          transform: translate(-50%, -50%);
          display: grid;
          place-items: center;
          width: 56px;
          height: 56px;
          border: 0;
          border-radius: 50%;
          background: var(--brand-gold);
          color: var(--brand-navy);
          cursor: pointer;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);
        }
        .gc-ad__play:focus-visible { outline: 3px solid var(--brand-ivory); outline-offset: 3px; }
        .gc-ad__sound {
          position: absolute;
          top: 10px;
          left: 50%;
          transform: translateX(-50%);
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 12px;
          border: 1px solid var(--brand-gold);
          border-radius: 999px;
          background: color-mix(in srgb, var(--brand-navy) 85%, transparent);
          color: var(--brand-ivory);
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 12px;
          white-space: nowrap;
          cursor: pointer;
        }
        .gc-ad__sound:focus-visible { outline: 3px solid var(--brand-ivory); outline-offset: 2px; }
        .gc-ad__soon {
          position: absolute;
          left: 10px;
          right: 10px;
          bottom: 12px;
          padding: 6px 8px;
          border-radius: 8px;
          background: color-mix(in srgb, var(--brand-navy) 80%, transparent);
          color: var(--brand-ivory);
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 12px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          text-align: center;
        }

        .gc-ad__main { position: relative; display: flex; flex-direction: column; min-width: 0; min-height: 0; }
        .gc-ad__head { padding: 22px 68px 14px 24px; }
        .gc-ad__close {
          position: absolute;
          top: 16px;
          right: 16px;
          display: grid;
          place-items: center;
          width: 38px;
          height: 38px;
          border: 1px solid var(--border);
          border-radius: 10px;
          background: var(--surface-2);
          color: var(--text);
          cursor: pointer;
        }
        .gc-ad__close:hover { border-color: var(--accent); }

        .gc-ad__eyebrow {
          margin: 0 0 6px;
          font-family: var(--font-display);
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          color: var(--accent-text);
        }
        .gc-ad__title {
          margin: 0 0 6px;
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 30px;
          letter-spacing: -0.025em;
          line-height: 1.05;
          color: var(--text);
        }
        .gc-ad__lead { margin: 0 0 14px; color: var(--text-muted); font-size: 15px; }
        .gc-ad__areas {
          list-style: none;
          margin: -4px 0 16px;
          padding: 0;
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .gc-ad__areas li {
          padding: 4px 10px;
          border: 1px solid var(--border);
          border-radius: 8px;
          background: var(--surface-2);
          color: var(--text);
          font-size: 12.5px;
          font-weight: 500;
          line-height: 1.4;
        }
        .gc-ad__note { margin: -6px 0 14px; color: var(--text); font-size: 14px; font-weight: 600; }
        .gc-ad__btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 12px 18px;
          border-radius: 10px;
          background: var(--btn-primary-bg);
          color: var(--btn-primary-text);
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 14px;
          text-decoration: none;
          transition: background 0.2s ease;
        }
        .gc-ad__btn:hover { background: var(--btn-primary-hover); }

        .gc-ad__tabs {
          display: flex;
          gap: 4px;
          padding: 0 24px;
          border-bottom: 1px solid var(--border);
          overflow-x: auto;
          scrollbar-width: none;
        }
        .gc-ad__tabs button {
          margin-bottom: -1px;
          padding: 10px 12px;
          border: 0;
          border-bottom: 2px solid transparent;
          background: transparent;
          color: var(--text-muted);
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 14px;
          white-space: nowrap;
          cursor: pointer;
        }
        .gc-ad__tabs button[aria-selected="true"] { color: var(--text); border-bottom-color: var(--accent); }
        .gc-ad__pane {
          flex: 1;
          min-height: 0;
          overflow: auto;
          overscroll-behavior: contain;
          padding: 20px 24px 14px;
        }
        .gc-ad__pane[hidden] { display: none; }

        .gc-ad :focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

        /* ── Bloques ──────────────────────────────────────────────────── */
        .gc-ad__sec + .gc-ad__sec { margin-top: 22px; padding-top: 22px; border-top: 1px solid var(--border); }
        .gc-ad__sec h3 {
          margin: 0 0 4px;
          font-family: var(--font-display);
          font-size: 19px;
          font-weight: 600;
          letter-spacing: -0.01em;
          color: var(--text);
        }
        .gc-ad__intro-t { margin: 0 0 14px; color: var(--text-muted); font-size: 14px; }

        .gc-ad__steps {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          gap: 12px;
        }
        .gc-ad__steps li { display: grid; grid-template-columns: 30px minmax(0, 1fr); gap: 12px; align-items: start; }
        .gc-ad__no {
          display: grid;
          place-items: center;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 1px solid var(--accent);
          color: var(--accent-text);
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 13px;
        }
        .gc-ad__steps b,
        .gc-ad__review b { display: block; font-family: var(--font-display); font-weight: 600; color: var(--text); }
        .gc-ad__steps span:not(.gc-ad__no),
        .gc-ad__review span { color: var(--text-muted); font-size: 14px; }

        .gc-ad__review {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0 22px;
        }
        .gc-ad__review li { padding: 12px 0; border-top: 1px solid var(--border); }
        .gc-ad__review li:nth-child(-n + 2) { border-top: 0; }

        .gc-ad__case { padding: 18px; border-radius: 14px; background: var(--surface-2); border: 1px solid var(--border); }
        .gc-ad__who { margin: 0 0 6px; font-size: 12px; letter-spacing: 0.07em; text-transform: uppercase; color: var(--text-muted); }
        .gc-ad__big {
          margin: 0 0 16px;
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 20px;
          letter-spacing: -0.01em;
          line-height: 1.25;
          text-wrap: balance;
          color: var(--text);
        }
        .gc-ad__bars { display: grid; gap: 9px; margin-bottom: 12px; }
        .gc-ad__brow {
          display: grid;
          grid-template-columns: 104px minmax(0, 1fr) 62px;
          gap: 10px;
          align-items: center;
          font-size: 13px;
        }
        .gc-ad__track { height: 10px; border-radius: 5px; background: var(--border); overflow: hidden; }
        .gc-ad__fill { display: block; height: 100%; border-radius: 5px; background: var(--accent); }
        .gc-ad__brow em { font-style: normal; text-align: right; font-variant-numeric: tabular-nums; font-weight: 600; }
        .gc-ad__tot {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          padding-top: 10px;
          border-top: 1px solid var(--border);
          font-size: 13px;
          color: var(--text-muted);
        }
        .gc-ad__tot b { color: var(--text); font-variant-numeric: tabular-nums; }
        .gc-ad__finds { list-style: none; margin: 16px 0 0; padding: 0; display: grid; gap: 8px; }
        .gc-ad__finds li { display: flex; gap: 10px; align-items: baseline; font-size: 14px; }
        /* Semaforo de hallazgos: el rojo y el ambar son de estado, no de marca;
           el verde es el --success del sistema. */
        .gc-ad__pill {
          flex: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          min-width: 100px;
          padding: 2px 8px;
          border-radius: 999px;
          background: var(--surface);
          border: 1px solid var(--border);
          font-size: 11px;
          font-weight: 600;
        }
        .gc-ad__pill::before { content: ""; width: 7px; height: 7px; border-radius: 50%; background: var(--c); }
        .gc-ad__pill.is-urgente { --c: #D64545; }
        .gc-ad__pill.is-importante { --c: #E0A100; }
        .gc-ad__pill.is-bien { --c: var(--success); }

        .gc-ad__faq details { border-top: 1px solid var(--border); }
        .gc-ad__faq details:last-child { border-bottom: 1px solid var(--border); }
        .gc-ad__faq summary {
          list-style: none;
          display: flex;
          justify-content: space-between;
          gap: 12px;
          padding: 13px 0;
          font-family: var(--font-display);
          font-weight: 600;
          cursor: pointer;
        }
        .gc-ad__faq summary::-webkit-details-marker { display: none; }
        .gc-ad__faq summary::after { content: "+"; color: var(--accent-text); font-size: 18px; line-height: 1; }
        .gc-ad__faq details[open] summary::after { content: "–"; }
        .gc-ad__faq details p { margin: 0 0 14px; color: var(--text-muted); font-size: 14px; }

        .gc-ad__end { margin-top: 22px; padding-top: 24px; border-top: 1px solid var(--border); text-align: center; }
        .gc-ad__end b { display: block; margin-bottom: 4px; font-family: var(--font-display); font-size: 18px; }
        .gc-ad__end p { margin: 0 0 12px; color: var(--text-muted); }

        @keyframes gc-ad-spin { to { transform: rotate(360deg); } }
        @keyframes gc-ad-in { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }

        /* ── Telefono: el escenario ocupa casi todo y el video se vuelve
              miniatura junto al titulo ─────────────────────────────────── */
        @media (max-width: 700px) {
          .gc-ad-card {
            left: 1rem;
            bottom: calc(1rem + env(safe-area-inset-bottom, 0px));
            width: 214px;
          }
          .gc-ad__dialog {
            --gc-ad-h: calc(100vh - 20px);
            width: calc(100vw - 20px);
            grid-template-columns: minmax(0, 1fr);
            border-radius: 16px;
          }
          @supports (height: 100dvh) {
            .gc-ad__dialog { --gc-ad-h: calc(100dvh - 20px); }
          }
          /* En el telefono no cabe una cabecera fija y un panel con scroll
             propio: con el video agrandado, el panel se quedaba en cero. Aqui
             scrollea todo junto, las pestanas se pegan arriba y la X cuelga
             del dialogo (no del contenido) para no irse con el scroll. */
          .gc-ad__main { position: static; overflow-y: auto; overscroll-behavior: contain; }
          .gc-ad__main > * { flex-shrink: 0; }
          .gc-ad__pane { flex: none; overflow: visible; }
          .gc-ad__tabs { position: sticky; top: 0; z-index: 1; background: var(--surface); }
          .gc-ad__head { padding: 16px 60px 12px 16px; }
          .gc-ad__close { top: 12px; right: 12px; z-index: 2; }
          .gc-ad__intro { display: grid; grid-template-columns: 88px minmax(0, 1fr); gap: 14px; align-items: start; }
          .gc-ad__intro.is-playing { grid-template-columns: minmax(0, 1fr); }
          .gc-ad__intro.is-playing .gc-ad__media { width: min(100%, calc(var(--gc-ad-h) * 0.5 * 9 / 16)); margin-inline: auto; }
          .gc-ad__media.is-compact { border-radius: 10px; }
          .gc-ad__media.is-compact .gc-ad__play { width: 34px; height: 34px; top: 50%; }
          .gc-ad__media.is-compact .gc-ad__play svg { width: 14px; height: 14px; }
          .gc-ad__media.is-compact .gc-ad__soon { left: 4px; right: 4px; bottom: 6px; padding: 3px 2px; font-size: 9px; letter-spacing: 0.02em; }
          .gc-ad__title { font-size: 26px; }
          .gc-ad__lead { font-size: 14px; margin-bottom: 12px; }
          .gc-ad__tabs { padding: 0 12px; }
          .gc-ad__pane { padding: 16px 16px 22px; }
          .gc-ad__review { grid-template-columns: minmax(0, 1fr); }
          .gc-ad__review li:nth-child(2) { border-top: 1px solid var(--border); }
          .gc-ad__brow { grid-template-columns: 84px minmax(0, 1fr) 58px; }
          .gc-ad__pill { min-width: 92px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .gc-ad-card,
          .gc-ad,
          .gc-ad__scrim,
          .gc-ad__dialog { animation: none; transition: none; }
          .gc-ad-card:hover { transform: none; }
          .gc-ad__dialog,
          .gc-ad.is-open .gc-ad__dialog { transform: translate(-50%, -50%); }
          .gc-ad-radar__sweep { animation: none; }
        }
      `}</style>
    </>
  );
}
