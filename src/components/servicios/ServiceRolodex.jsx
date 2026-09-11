import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/* Catalogo de servicios como fichero giratorio (rolodex).
 *
 * Sustituye al recorrido vertical con desenfoque: siete tarjetas una debajo de
 * otra eran siete pantallas de scroll para leer siete parrafos, y quien no
 * bajaba hasta el final no sabia que existian los ultimos.
 *
 * Las fichas cuelgan de un eje HORIZONTAL por su borde superior, como las de
 * un fichero de escritorio o las aletas de un tablero de aeropuerto. Al
 * avanzar, la de enfrente cae hacia el lector y sale por arriba mientras la
 * siguiente se endereza. No es un fundido disfrazado: el giro pasa por el
 * canto, y ver ese canto es lo que convierte el cambio en un movimiento y no
 * en un parpadeo.
 *
 * DOS COSAS QUE NO SE PUEDEN ROMPER, y que condicionan todo el diseno:
 *
 *   1. Las SIETE tarjetas viven siempre en el HTML. Este catalogo es el texto
 *      por el que la pagina puede encontrarse en un buscador; montar solo la
 *      visible lo borraria. Las que no tocan se apartan con transform y
 *      opacidad —nunca con `display: none`— y se marcan `aria-hidden` para que
 *      un lector de pantalla no narre las siete a la vez.
 *
 *   2. Los `id` son los anclas (#web, #ia, #mobile) a los que la portada ya
 *      enlaza. Como ahora solo una ficha esta al frente, llegar con un ancla
 *      tiene que ADELANTAR el fichero hasta ella; si no, el enlace llevaria a
 *      una tarjeta invisible. De eso se encarga `useHashIndex`.
 */

/* Cuantas fichas se ven asomando detras de la de enfrente. Mas de dos y el
   fondo se convierte en ruido; ninguna y el fichero parece de una sola hoja. */
const DEPTH = 2;

/**
 * Posicion de una ficha segun su distancia a la de enfrente.
 *
 * `origin: top` en el CSS hace que todas giren colgadas de su borde superior.
 * Un `rotateX` positivo inclina la ficha hacia atras —es la pila que espera— y
 * uno negativo la tumba hacia el lector, que es la que se esta yendo.
 */
function poseOf(offset) {
  if (offset === 0) return { rotateX: 0, y: '0%', scale: 1, opacity: 1, zIndex: 30 };

  // Ya paso: cae hacia el lector y sale por arriba.
  if (offset < 0) {
    return { rotateX: -104, y: '-14%', scale: 1, opacity: 0, zIndex: 10 };
  }

  // Todavia no llega: espera inclinada hacia atras, cada vez mas tumbada.
  if (offset > DEPTH) return { rotateX: 52, y: '-9%', scale: 0.9, opacity: 0, zIndex: 1 };
  return {
    rotateX: 16 + (offset - 1) * 14,
    y: `${-3.5 * offset}%`,
    scale: 1 - offset * 0.04,
    opacity: offset === 1 ? 0.4 : 0.16,
    zIndex: 30 - offset,
  };
}

/** Lleva el fichero al servicio que pida el ancla de la URL (#web, #ia...). */
function useHashIndex(services, goTo) {
  useEffect(() => {
    const sync = () => {
      const slug = window.location.hash.replace('#', '');
      if (!slug) return;
      const i = services.findIndex((s) => s.slug === slug);
      if (i >= 0) goTo(i);
    };
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, [services, goTo]);
}

export default function ServiceRolodex({ services, cats, labels }) {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();
  const stageRef = useRef(null);

  const total = services.length;
  const clamp = useCallback((n) => Math.max(0, Math.min(total - 1, n)), [total]);
  const goTo = useCallback((n) => setI(clamp(n)), [clamp]);
  const step = useCallback((d) => setI((p) => clamp(p + d)), [clamp]);

  useHashIndex(services, goTo);

  /* Las flechas del teclado solo mueven el fichero cuando el foco esta dentro:
     capturarlas en toda la pagina secuestraria el scroll de quien solo pasaba
     por aqui. */
  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); step(1); }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); step(-1); }
  };

  /* Arrastre vertical, que es como se pasa un fichero de verdad. El umbral
     mezcla distancia y velocidad: un tiron corto y rapido cuenta igual que uno
     largo y lento, porque los dos significan "pasala". */
  const onDragEnd = (_, info) => {
    const force = info.offset.y + info.velocity.y * 0.18;
    if (force < -60) step(1);
    else if (force > 60) step(-1);
  };

  const pad = (n) => String(n + 1).padStart(2, '0');

  return (
    <div className="rlx" onKeyDown={onKeyDown}>
      {/* Marcador: en cual vas y cuantas quedan, sin contarlas. */}
      <div className="rlx__hud">
        <span className="rlx__hud-n"><b>{pad(i)}</b><i>/ {pad(total - 1)}</i></span>
        <span className="rlx__hud-t">{services[i]?.name}</span>
        <span className="rlx__hud-bar">
          <motion.span
            animate={{ width: `${((i + 1) / total) * 100}%` }}
            transition={reduce ? { duration: 0 } : { duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          />
        </span>
      </div>

      <div className="rlx__stage" ref={stageRef}>
        {services.map((x, idx) => {
          const offset = idx - i;
          const front = offset === 0;
          return (
            <motion.article
              className={`rlx__card${front ? ' is-front' : ''}`}
              key={x.slug}
              id={x.slug}
              /* Fuera de foco para el teclado y mudas para el lector de
                 pantalla, pero presentes en el HTML para el buscador. */
              aria-hidden={front ? undefined : 'true'}
              animate={reduce ? { opacity: front ? 1 : 0, zIndex: front ? 30 : 1 } : poseOf(offset)}
              initial={false}
              transition={
                reduce
                  ? { duration: 0 }
                  : { type: 'spring', stiffness: 260, damping: 32, mass: 0.9 }
              }
              drag={front && !reduce ? 'y' : false}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.14}
              onDragEnd={onDragEnd}
            >
              <div className="rlx__shot">
                <img src={x.image} alt="" loading={idx < 2 ? 'eager' : 'lazy'} decoding="async" draggable="false" />
              </div>
              <div className="rlx__body">
                <span className="rlx__n">{pad(idx)}<i>/ {pad(total - 1)}</i></span>
                <span className="paths__k">{cats[x.cat].name}</span>
                <h3 className="rlx__title">{x.name}</h3>
                <p className="rlx__tagline">{x.tagline}</p>
                <p className="rlx__desc">{x.description}</p>
              </div>
              {/* El canto de la ficha: la linea que se ve al pasar por el
                  perfil. Sin esto el giro se lee como una hoja de papel sin
                  grosor. */}
              <span className="rlx__edge" aria-hidden="true" />
            </motion.article>
          );
        })}
      </div>

      <div className="rlx__nav">
        <button
          type="button" className="rlx__btn"
          onClick={() => step(-1)} disabled={i === 0}
          aria-label={labels.prev}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m18 15-6-6-6 6" /></svg>
        </button>

        {/* Los puntos no son decoracion: dicen cuantas fichas hay. Se puede
            saltar a cualquiera sin pasar por las de en medio. */}
        <div className="rlx__dots" role="tablist" aria-label={labels.list}>
          {services.map((x, idx) => (
            <button
              key={x.slug}
              type="button"
              role="tab"
              aria-selected={idx === i}
              aria-label={x.name}
              className={`rlx__dot${idx === i ? ' is-on' : ''}`}
              onClick={() => goTo(idx)}
            />
          ))}
        </div>

        <button
          type="button" className="rlx__btn"
          onClick={() => step(1)} disabled={i === total - 1}
          aria-label={labels.next}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
        </button>
      </div>
    </div>
  );
}
