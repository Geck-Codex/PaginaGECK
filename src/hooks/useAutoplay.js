import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Avance automatico para carruseles e interruptores.
 *
 * Lo automatico no esta para ahorrarle el clic a nadie: esta para DECIR QUE SE
 * PUEDE TOCAR. Un carrusel quieto se lee como una imagen fija, y la mitad de la
 * gente nunca descubre que hay seis fichas mas atras. En cuanto el visitante
 * entiende el gesto, lo automatico sobra y estorba.
 *
 * De ahi las reglas, que no son adorno:
 *
 *   · SOLO CORRE A LA VISTA. Fuera de pantalla no hay a quien ensenarle nada, y
 *     un temporizador vivo en una seccion que nadie mira es bateria regalada en
 *     un telefono.
 *
 *   · SE DETIENE PARA SIEMPRE AL PRIMER TOQUE. Quien ya tomo el control no
 *     quiere que la pagina le mueva la ficha mientras lee. Ademas es lo que
 *     exigen las pautas de accesibilidad para contenido que se mueve solo: que
 *     exista una forma de pararlo, y la mas natural es usarlo.
 *
 *   · SE PAUSA CON EL CURSOR ENCIMA O EL FOCO DENTRO, y mientras la pestana
 *     este en segundo plano. Leer algo que se mueve solo es una pelea.
 *
 *   · NO ARRANCA SI EL SISTEMA PIDIO MENOS MOVIMIENTO.
 *
 * @param {object}   ref       Referencia al elemento que se vigila.
 * @param {object}   opts
 * @param {number}   opts.interval  Milisegundos entre pasos.
 * @param {number}   [opts.delay]   Espera antes del primer paso.
 * @param {Function} opts.onTick    Se llama en cada paso. Devolver `false`
 *                                  detiene el ciclo (p. ej. al llegar al final).
 * @returns {{ stop: () => void, running: boolean }}
 */
export function useAutoplay(ref, { interval, delay = interval, onTick }) {
  const [running, setRunning] = useState(false);
  const stopped = useRef(false);
  const paused = useRef(false);
  /* `onTick` en un ref: si entrara como dependencia del efecto, una funcion
     nueva en cada render reiniciaria el temporizador en cada paso y el ciclo
     no avanzaria nunca. */
  const tick = useRef(onTick);
  tick.current = onTick;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let timer = 0;
    let started = false;

    const halt = () => {
      clearInterval(timer);
      timer = 0;
      setRunning(false);
    };

    const run = () => {
      if (stopped.current || paused.current || timer) return;
      timer = setInterval(() => {
        if (stopped.current || paused.current) return;
        if (tick.current?.() === false) {
          stopped.current = true;
          halt();
        }
      }, interval);
      setRunning(true);
    };

    /* El primer paso se hace esperar: si el carrusel ya se esta moviendo cuando
       la seccion entra en pantalla, no se ve el cambio —se ve algo que ya
       estaba pasando— y el gesto no se lee. */
    const kickoff = () => {
      if (started || stopped.current) return;
      started = true;
      timer = setTimeout(() => {
        timer = 0;
        if (stopped.current || paused.current) return;
        if (tick.current?.() === false) { stopped.current = true; return; }
        run();
      }, delay);
    };

    const io =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver(
            ([e]) => {
              if (e.isIntersecting) kickoff();
              else { paused.current = true; halt(); }
              if (e.isIntersecting) paused.current = false;
            },
            { threshold: 0.35 },
          );

    if (io) io.observe(el);
    else kickoff();

    const pause = () => { paused.current = true; halt(); };
    const resume = () => {
      if (stopped.current) return;
      paused.current = false;
      if (started) run();
    };

    const onVisibility = () => (document.hidden ? pause() : resume());

    el.addEventListener('pointerenter', pause);
    el.addEventListener('pointerleave', resume);
    el.addEventListener('focusin', pause);
    el.addEventListener('focusout', resume);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      io?.disconnect();
      clearInterval(timer);
      clearTimeout(timer);
      el.removeEventListener('pointerenter', pause);
      el.removeEventListener('pointerleave', resume);
      el.removeEventListener('focusin', pause);
      el.removeEventListener('focusout', resume);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [ref, interval, delay]);

  /**
   * Corta el ciclo definitivamente. Se llama desde cualquier accion manual.
   *
   * Va memoizada y sin dependencias porque quien la usa suele meterla dentro de
   * otro `useCallback` o de un efecto. Si cambiara de identidad en cada render,
   * esos efectos se volverian a montar constantemente — y en el fichero de
   * servicios eso significaba que el efecto del ancla reponia la ficha de la
   * URL cada vez que el usuario pasaba a la siguiente.
   */
  const stop = useCallback(() => {
    stopped.current = true;
    setRunning(false);
  }, []);

  return { stop, running };
}
