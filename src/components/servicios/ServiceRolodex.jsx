import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/* Catalogo de servicios como fichero giratorio (rolodex).
 *
 * Sustituye al recorrido vertical con desenfoque: siete tarjetas una debajo de
 * otra eran siete pantallas de scroll para leer siete parrafos, y quien no
 * bajaba hasta el final no sabia que existian los ultimos.
 *
 * Es una PILA con fondo visible: detras de la ficha de enfrente asoman las tres
 * siguientes, escalonadas hacia arriba y hacia atras. Ese escalonado es lo que
 * mas aporta —se ve de un vistazo que hay mas y cuantas— y por eso manda sobre
 * el resto del diseno: el alto del escenario, el aire de arriba y los tamanos
 * estan puestos para que se vea, tambien en el telefono.
 *
 * Al avanzar, la de enfrente SE REPARTE: se desliza de lado y sale, como la
 * carta que sacas de encima de la baraja, y la pila da un paso al frente. Se
 * probaron antes dos versiones con giro —la ficha tumbandose hacia el lector y
 * luego levantandose por arriba— y las dos fallaban por lo mismo: el giro se
 * llevaba la atencion que tenia que llevarse la tarjeta que estaba llegando.
 * Un movimiento lateral se entiende sin mirarlo.
 *
 * Todas las fichas comparten curva y duracion, para que el gesto se lea como
 * una pila moviendose y no como cuatro tarjetas animandose cada una por su
 * lado.
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

/* Cuantas fichas asoman detras de la de enfrente.
 *
 * Tres es lo que hace que se lea como una PILA y no como dos hojas sueltas: el
 * ojo necesita ver que el escalonado sigue para entender que hay mas atras.
 * La cuarta ya no aporta profundidad, solo ruido en el borde superior. */
const DEPTH = 3;

/**
 * Posicion de una ficha segun su distancia a la de enfrente.
 *
 * La pila espera escalonada hacia arriba y hacia atras; la ficha repartida sale
 * DE LADO. Los escalones son grandes a proposito —6% de alto y 6% de escala
 * entre una ficha y la siguiente— porque un escalonado sutil a esta distancia
 * no se distingue de un borde mal alineado.
 *
 * Que la salida sea siempre hacia el mismo lado no es un descuido: al retroceder
 * la ficha vuelve entrando desde ese mismo lado, y eso se lee como "la estoy
 * regresando a la baraja". Si saliera por un lado y volviera por el otro,
 * parecerian dos barajas distintas.
 */
function poseOf(offset) {
  if (offset === 0) {
    return { x: '0%', rotate: 0, rotateX: 0, y: '0%', scale: 1, opacity: 1, zIndex: 30 };
  }

  /* Ya se repartio: sale de lado girando un poco sobre si misma, que es lo que
     hace una carta al deslizarse sobre las de abajo. */
  if (offset < 0) {
    return { x: '116%', rotate: 7, rotateX: 0, y: '2%', scale: 0.98, opacity: 0, zIndex: 10 };
  }

  // Todavia no le toca: espera en la pila.
  if (offset > DEPTH) {
    return { x: '0%', rotate: 0, rotateX: 20, y: '-19%', scale: 0.78, opacity: 0, zIndex: 1 };
  }
  return {
    x: '0%',
    rotate: 0,
    rotateX: 5 + offset * 4,
    y: `${-6 * offset}%`,
    scale: 1 - offset * 0.06,
    opacity: [0, 0.62, 0.34, 0.15][offset],
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

  /* Arrastre HORIZONTAL: el gesto tiene que ser el mismo que hace la ficha al
     salir, o el dedo y la pantalla dicen cosas distintas. Arrastrar hacia la
     izquierda reparte la de enfrente; hacia la derecha la regresa.

     El umbral mezcla distancia y velocidad: un tiron corto y rapido cuenta
     igual que uno largo y lento, porque los dos significan "pasala". */
  const onDragEnd = (_, info) => {
    const force = info.offset.x + info.velocity.x * 0.18;
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
              /* Curva, no muelle. El muelle rebotaba al final y cada ficha
                 llegaba en un tiempo distinto segun su recorrido, asi que la
                 pila se movia descoordinada. Con la misma curva y la misma
                 duracion para todas, las cuatro dan el paso a la vez — que es
                 lo que hace que se lea como una pila y no como cuatro tarjetas
                 animandose por su cuenta.

                 Es la curva del resto del sitio (AboutTeaser, StatsSection). */
              transition={
                reduce
                  ? { duration: 0 }
                  : { duration: 0.62, ease: [0.22, 1, 0.36, 1] }
              }
              drag={front && !reduce ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
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
