import { motion, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../../hooks/useLanguage';
import { localizedPath } from '../../i18n/routes';
import { TEAM } from '../../data/team.js';

/* "Quienes somos" de la portada.
 *
 * QUE SE RETIRO Y POR QUE. Antes era un mosaico que se armaba atado al scroll,
 * dentro de una seccion de 200vh en escritorio y 300vh en el telefono. Dos
 * problemas, y los dos de fondo:
 *
 *   · Cobraba dos o tres pantallas de scroll por unas cuarenta palabras. Es
 *     exactamente lo que hizo retirar al SpecialtiesShowcase —"decia lo mismo
 *     en tres videos y 240vh de scroll", quedo escrito en WhatWeDo—, y esta
 *     seccion era la ultima que quedaba con ese patron.
 *
 *   · Decia lo que dice todo el mundo: "equipo 100% mexicano", "tecnologia de
 *     punta", "compromiso real". Tapando el logo, esos tres puntos podian ser
 *     de cualquier agencia del pais.
 *
 * QUE DICE AHORA. El argumento que ya estaba escrito en data/team.js y que no
 * se estaba usando: los fundadores no llevan rol tecnico porque no tienen roles
 * fijos, y ponerles "Frontend Developer" seria meterse a competir en el terreno
 * donde una agencia de cuarenta personas siempre gana. El argumento es el
 * contrario — TU PROYECTO TIENE UN RESPONSABLE CON NOMBRE— y las caras son la
 * prueba: se puede ver a quien le vas a marcar.
 *
 * Las tres afirmaciones de abajo son verificables y estan en otras paginas del
 * sitio: el codigo se entrega, la garantia es de por vida, y se viaja dentro de
 * Chihuahua. Nada de "calidad" ni "compromiso".
 *
 * Los datos salen de TEAM, no de una lista propia: si entra o sale alguien, la
 * portada no puede quedarse contando otra historia que /nosotros.
 */

const EASE = [0.22, 1, 0.36, 1];

const Arrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

/** Iniciales para quien aun no tiene retrato. Estado valido, no un hueco. */
const initialsOf = (name) =>
  name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

export default function AboutTeaser({ lang }) {
  const { t } = useLanguage(lang);
  const a = t.aboutTeaser;
  const reduce = useReducedMotion();

  const founders = TEAM.filter((m) => m.founder && m.name);

  /* Entrada escalonada. `once: true` porque es una presentacion, no un efecto:
     repetirla cada vez que la seccion vuelve a pasar la convierte en ruido. */
  const rise = (i = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 28 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.4 },
          transition: { duration: 0.7, ease: EASE, delay: i * 0.09 },
        };

  return (
    <>
      <section className="abt">
        <div className="abt__inner">
          <motion.p className="abt__eyebrow" {...rise(0)}>
            <span className="abt__dot" aria-hidden="true" />
            {a.eyebrow}
          </motion.p>

          <motion.h2 className="abt__title" {...rise(1)}>
            {a.title} <span className="abt__accent">{a.highlight}</span>
          </motion.h2>

          {/* Las caras van ANTES del parrafo: la frase habla de personas y la
              prueba tiene que estar a la vista mientras se lee, no debajo. */}
          <motion.ul className="abt__faces" {...rise(2)}>
            {founders.map((m) => (
              <li className="abt__face" key={m.id}>
                <span className="abt__shot">
                  {m.photo ? (
                    <img src={m.photo} alt="" loading="lazy" decoding="async" />
                  ) : (
                    <span className="abt__initials" aria-hidden="true">{initialsOf(m.name)}</span>
                  )}
                </span>
                {/* Solo el nombre de pila: el completo parte en dos lineas y
                    convierte una fila de caras en un parrafo. El nombre entero
                    esta en /nosotros y en el JSON-LD. */}
                <span className="abt__name">{m.name.split(' ')[0]}</span>
                <span className="abt__role">{a.role}</span>
              </li>
            ))}
          </motion.ul>

          <motion.p className="abt__body" {...rise(3)}>{a.body}</motion.p>

          <ul className="abt__proof">
            {a.proof.map((p, i) => (
              <motion.li className="abt__pf" key={p.k} {...rise(4 + i)}>
                <span className="abt__pf-k">{p.k}</span>
                <span className="abt__pf-d">{p.d}</span>
              </motion.li>
            ))}
          </ul>

          <motion.a className="abt__cta" href={localizedPath('about', lang)} {...rise(7)}>
            <span>{a.cta}</span>
            <Arrow />
          </motion.a>
        </div>
      </section>
      <style>{styles}</style>
    </>
  );
}

const styles = `
  /* Una pantalla, sin sticky y sin robar scroll: la seccion mide lo que mide
     su contenido. */
  .abt {
    background: transparent;
    padding: clamp(4.5rem, 11vh, 8rem) clamp(1.25rem, 5vw, 4rem);
  }
  .abt__inner { max-width: 940px; margin: 0 auto; text-align: center; }

  .abt__eyebrow {
    display: inline-flex; align-items: center; gap: 0.5rem;
    font-family: var(--font-display);
    font-size: 0.7rem; font-weight: 800; letter-spacing: 0.2em;
    text-transform: uppercase; color: var(--accent-text);
    margin: 0 0 1.1rem;
  }
  .abt__dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); }

  .abt__title {
    font-family: var(--font-display);
    font-size: clamp(1.75rem, 5.4vw, 3.1rem);
    font-weight: 700; letter-spacing: -0.03em; line-height: 1.08;
    margin: 0 0 clamp(2rem, 5vw, 2.8rem); color: var(--text);
  }
  /* El oro NUNCA es texto sobre fondo claro: --accent-text es la variante que
     si tiene contraste. Regla del sistema de tokens, no preferencia. */
  .abt__accent { color: var(--accent-text); }

  /* ── Las caras ── */
  .abt__faces {
    list-style: none; margin: 0 0 clamp(1.8rem, 4vw, 2.4rem); padding: 0;
    display: flex; justify-content: center;
    gap: clamp(1.4rem, 5vw, 3.2rem);
  }
  .abt__face { display: flex; flex-direction: column; align-items: center; gap: 0.55rem; }
  .abt__shot {
    width: clamp(76px, 19vw, 116px); aspect-ratio: 1;
    border-radius: 50%; overflow: hidden;
    border: 1px solid var(--border-strong);
    background: var(--surface-2);
    display: grid; place-items: center;
  }
  /* Los retratos son verticales (~2:3) y de estudio: se encuadran arriba
     porque es donde esta la cara — recortar centrado corta frentes. */
  .abt__shot img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 18%; display: block; }
  .abt__initials {
    font-family: var(--font-display); font-weight: 700;
    font-size: clamp(1.1rem, 3.5vw, 1.5rem); color: var(--text-muted);
  }
  .abt__name {
    font-family: var(--font-display); font-weight: 700;
    font-size: clamp(0.85rem, 2.2vw, 1rem); color: var(--text); line-height: 1;
  }
  .abt__role {
    font-size: 0.6rem; font-weight: 800; letter-spacing: 0.14em;
    text-transform: uppercase; color: var(--text-muted);
  }

  .abt__body {
    max-width: 62ch; margin: 0 auto clamp(2.2rem, 5vw, 3rem);
    font-size: clamp(0.95rem, 2.2vw, 1.08rem); line-height: 1.7;
    color: var(--text-muted);
  }

  /* ── Las tres pruebas ──
     Sin cajas, separadas por filetes, como la rejilla de "Que hacemos": la
     seccion se lee como parte de la pagina y no como tarjetas pegadas encima. */
  .abt__proof {
    list-style: none; margin: 0 0 clamp(2.2rem, 5vw, 3rem); padding: 0;
    display: grid; gap: 0;
    border-top: 1px solid var(--border);
    text-align: left;
  }
  .abt__pf {
    padding: 1.1rem 0.2rem;
    border-bottom: 1px solid var(--border);
    display: flex; flex-direction: column; gap: 0.3rem;
  }
  .abt__pf-k {
    font-family: var(--font-display); font-weight: 700;
    font-size: 0.98rem; color: var(--text);
  }
  .abt__pf-d { font-size: 0.88rem; line-height: 1.55; color: var(--text-muted); }

  .abt__cta {
    display: inline-flex; align-items: center; gap: 0.6rem;
    background: var(--btn-primary-bg); color: var(--btn-primary-text);
    font-weight: 700; font-size: 0.95rem;
    padding: 0.85rem 1.6rem; border-radius: 10px; text-decoration: none;
    transition: background 0.22s ease, transform 0.22s ease;
  }
  .abt__cta:hover { background: var(--btn-primary-hover); }
  .abt__cta:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }

  @media (min-width: 720px) {
    /* Las tres pruebas en fila: son hermanas, y en columna la tercera queda
       tan abajo que se lee como una nota al pie. */
    .abt__proof { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0 2.4rem; }
    .abt__pf { border-bottom: 0; padding: 1.3rem 0 0; }
  }

  @media (prefers-reduced-motion: no-preference) {
    .abt__cta:hover { transform: translateY(-2px); }
  }
`;
