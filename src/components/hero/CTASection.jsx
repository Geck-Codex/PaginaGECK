import { useEffect, useRef } from 'react';
import { translations } from '../../i18n/translations';
import { localizedPath } from '../../i18n/routes';

/* ─── CIERRE DE PAGINA ──────────────────────────────────────────────────────
 *
 * El ultimo bloque antes del pie. Existe porque una pagina que termina en una
 * FAQ o en un teaser de blog despide al visitante ofreciendole irse a leer otra
 * cosa: quien acaba de recorrer todo el argumento es justo quien mas cerca esta
 * de escribir, y hasta ahora no habia nada que se lo pidiera.
 *
 * Los dos botones NO son intercambiables. El solido va a contacto y el fantasma
 * al portafolio, en ese orden: el trabajo ya se enseño mas arriba, asi que
 * mandar aqui a verlo otra vez es devolver al visitante al principio del
 * embudo. El clic a contacto no se mide como lead —todavia no ha escrito
 * nada— pero el destino si lo mide.
 *
 * Colores por tokens de tema, no fijos: este bloque aparece en paginas que se
 * ven en claro y en oscuro.
 */

export default function CTASection({ lang = 'es' }) {
  const t = (translations[lang] || translations.es).ctaFinal;
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const rafRef     = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    /* Si el visitante pidio menos movimiento, el contenido se deja visible y no
     * se engancha nada al scroll: la entrada es un adorno, el bloque no. */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (contentRef.current) {
        contentRef.current.style.opacity = 1;
        contentRef.current.style.transform = 'none';
      }
      return;
    }

    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        const rect     = section.getBoundingClientRect();
        const vh       = window.innerHeight;
        const progress = Math.max(0, Math.min(1, 1 - rect.top / vh));

        if (contentRef.current) {
          const p = Math.max(0, Math.min(1, (progress - 0.1) / 0.4));
          contentRef.current.style.opacity   = p;
          contentRef.current.style.transform = `translateY(${(1 - p) * 28}px)`;
        }

        rafRef.current = null;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <section ref={sectionRef} className="cta-section">

        <div className="cta-section__glow" aria-hidden="true" />

        <div ref={contentRef} className="cta-section__content">

          <p className="cta-section__eyebrow">{t.eyebrow}</p>

          <h2 className="cta-section__headline">
            {t.title}
            <br />
            <span className="cta-section__headline-accent">{t.titleAccent}</span>
          </h2>

          <p className="cta-section__sub">{t.sub}</p>

          <div className="cta-section__actions">
            <a href={localizedPath('contact', lang)} className="cta-section__btn cta-section__btn--primary">
              {t.primary}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
            <a href={localizedPath('portfolio', lang)} className="cta-section__btn cta-section__btn--ghost">
              {t.secondary}
            </a>
          </div>

          <p className="cta-section__note">{t.note}</p>

        </div>

      </section>

      <style>{`
        .cta-section {
          background: var(--surface-2);
          border-top: 1px solid var(--border);
          position: relative;
          overflow: hidden;
          padding: 7rem 2rem;
          text-align: center;
        }

        /* Resplandor dorado central muy sutil */
        .cta-section__glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 600px;
          height: 400px;
          max-width: 100%;
          background: radial-gradient(ellipse at center, rgba(195, 173, 133, 0.16) 0%, transparent 70%);
          pointer-events: none;
        }

        .cta-section__content {
          position: relative;
          z-index: 1;
          max-width: 700px;
          margin: 0 auto;
          opacity: 0;
          will-change: opacity, transform;
        }

        .cta-section__eyebrow {
          font-family: var(--font-display);
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--accent-text);
          margin-bottom: 1.5rem;
        }

        .cta-section__headline {
          font-family: var(--font-display);
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 700;
          line-height: 1.1;
          color: var(--text);
          margin-bottom: 1.5rem;
          letter-spacing: -0.02em;
        }

        .cta-section__headline-accent {
          color: var(--accent-text);
        }

        .cta-section__sub {
          font-size: clamp(0.95rem, 1.5vw, 1.1rem);
          color: var(--text-muted);
          line-height: 1.7;
          margin-bottom: 2.5rem;
        }

        .cta-section__actions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .cta-section__btn {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.95rem 2.25rem;
          font-size: 0.9rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-decoration: none;
          border-radius: 10px;
          transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        }

        .cta-section__btn--primary {
          background: var(--btn-primary-bg);
          color: var(--btn-primary-text);
          border: 1px solid var(--btn-primary-bg);
        }

        .cta-section__btn--primary:hover {
          background: var(--btn-primary-hover);
          border-color: var(--btn-primary-hover);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
        }

        .cta-section__btn--primary svg {
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .cta-section__btn--primary:hover svg {
          transform: translateX(4px);
        }

        .cta-section__btn--ghost {
          background: transparent;
          color: var(--text);
          border: 1px solid var(--border-strong);
        }

        .cta-section__btn--ghost:hover {
          border-color: var(--accent);
          transform: translateY(-2px);
        }

        .cta-section__note {
          margin-top: 1.5rem;
          font-size: 0.78rem;
          color: var(--text-muted);
          opacity: 0.85;
        }

        @media (max-width: 600px) {
          .cta-section { padding: 5rem 1.5rem; }
          .cta-section__glow { width: 100%; height: 300px; }
          .cta-section__btn { width: 100%; justify-content: center; }
        }

        @media (prefers-reduced-motion: reduce) {
          .cta-section__content {
            opacity: 1 !important;
            transform: none !important;
          }
          .cta-section__btn:hover { transform: none; }
        }
      `}</style>
    </>
  );
}
