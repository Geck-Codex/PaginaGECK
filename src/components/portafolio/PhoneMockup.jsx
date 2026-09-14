import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

/* ─── MOCKUP DE TELÉFONO CON VIDEO DENTRO ──────────────────────────────────
 *
 * Pensado para las automatizaciones del portafolio: un bot de WhatsApp no se
 * entiende con una captura fija — lo que hay que ensenar es la conversacion
 * ocurriendo.
 *
 * Imita los mockups renderizados que ya usa la galeria (ganova, micaja, nuki):
 * telefono girado sobre su eje vertical ensenando el canto, ocupando casi todo
 * el alto, y un halo dorado difuso detras que lo despega del fondo. Todo en
 * CSS y no en un PNG a proposito:
 *
 *   · pesa cero y escala a cualquier ancho sin pixelarse,
 *   · el hueco de la pantalla no hay que alinearlo a mano con el video,
 *   · el giro es real, asi que el video gira CON el telefono.
 *
 * Las medidas del marco son porcentajes del ANCHO (en CSS un padding o un
 * border-radius en % se resuelve contra el ancho), asi que el telefono entero
 * se redimensiona cambiando una sola variable: --phone-w.
 *
 * Uso:
 *   <PhoneMockup
 *     src="/assets/video/portafolio/bot-leads.mp4"
 *     poster="/assets/image/portafolio/bot-leads-poster.webp"
 *     label="Conversacion del bot calificador de leads"
 *     labels={strings.detail}
 *   />
 */

/* Proporcion del cuerpo de un telefono moderno (~9:19.5 de pantalla mas los
 * bordes). Vive aqui como constante para que el marco y la pantalla no puedan
 * desincronizarse al tocar el CSS. */
const BODY_RATIO = '1 / 2.03';

export default function PhoneMockup({
  src,
  poster,
  label = '',
  caption = '',
  width = 'clamp(200px, 26vw, 300px)',
  /* La pose es la de ensenarle el telefono a alguien: de frente, con dos
   * inclinaciones leves y en sentidos contrarios que se compensan.
   *   tilt = giro sobre el eje vertical. Positivo acerca el canto derecho.
   *          Poco: pasado de ~12 grados deja de ser un gesto y se convierte
   *          en una vista de tres cuartos.
   *   pitch = vuelco sobre el eje horizontal. Positivo echa el aparato hacia
   *           atras: la parte de arriba se aleja, la de abajo se acerca, y
   *           asomando el canto inferior es donde se ve que el armazon tiene
   *           cuerpo y no es una lamina.
   *   roll = ladeo en el plano. Negativo inclina el aparato a la izquierda.
   * Al invertir el signo de `tilt` hay que invertir con el toda la luz: el
   * gradiente del marco, el reflejo del cristal, el halo y la sombra van
   * referidos al lado que se acerca. */
  tilt = 8,
  pitch = 6.5,
  roll = -1.2,
  glow = true,
  labels = {},
  className = '',
}) {
  const sources = Array.isArray(src) ? src : [src];
  const videoRef = useRef(null);
  const hostRef = useRef(null);
  const reduce = useReducedMotion();
  const [playing, setPlaying] = useState(false);
  /* El video no se descarga hasta que hace falta. Mientras, se ve el poster:
   * una ficha del portafolio puede tener varios mockups y no tiene sentido
   * bajar megas de video que el visitante quiza no llegue a mirar. */
  const [armed, setArmed] = useState(false);

  /* Reproduce solo mientras esta a la vista. Un video que sigue corriendo
   * fuera de pantalla gasta bateria y decodificador para nadie. */
  useEffect(() => {
    const host = hostRef.current;
    if (!host || reduce) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        const v = videoRef.current;
        if (entry.isIntersecting) {
          setArmed(true);
          /* El play() puede ser rechazado (politicas de autoplay, pestana en
           * segundo plano). Se ignora: el poster sigue ahi y queda el boton. */
          v?.play().then(() => setPlaying(true)).catch(() => {});
        } else {
          v?.pause();
          setPlaying(false);
        }
      },
      { threshold: 0.4 },
    );
    io.observe(host);
    return () => io.disconnect();
  }, [reduce]);

  /* WCAG 2.2.2: todo lo que se mueve solo mas de cinco segundos necesita una
   * forma de pararlo. Ademas sirve para arrancarlo cuando el autoplay no
   * llego a permitirse o el visitante pidio menos movimiento. */
  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    setArmed(true);
    if (v.paused) v.play().then(() => setPlaying(true)).catch(() => {});
    else { v.pause(); setPlaying(false); }
  };

  return (
    <figure
      ref={hostRef}
      className={`gc-phone ${className}`}
      style={{
        '--phone-w': width,
        '--phone-tilt': `${tilt}deg`,
        '--phone-pitch': `${pitch}deg`,
        '--phone-roll': `${roll}deg`,
      }}
    >
      <div className="gc-phone__scene">
        {glow && <div className="gc-phone__glow" aria-hidden="true" />}

        <div className="gc-phone__body">
          {/* El canto. Es una copia del cuerpo empujada hacia atras en Z: al
              girar el conjunto se asoma por el costado y da el grosor del
              aparato, que es lo que delata a un mockup plano. Lleva las dos
              lineas de antena que cortan el metal en un telefono real. */}
          <span className="gc-phone__side" aria-hidden="true">
            <i className="gc-phone__ant gc-phone__ant--top" />
            <i className="gc-phone__ant gc-phone__ant--bottom" />
          </span>

          {/* Marco negro entre el metal y el cristal. De frente, un telefono no
              ensena la pantalla pegada al rail: hay ~2,5 mm de negro en medio,
              y es de lo que mas depende que el conjunto se lea como una foto. */}
          <div className="gc-phone__bezel">
          <div className="gc-phone__screen">
            <video
              ref={videoRef}
              className="gc-phone__video"
              /* muted + playsInline son el requisito para que un navegador
               * permita autoplay; sin ellos iOS abre el video a pantalla
               * completa en vez de reproducirlo en linea. */
              muted
              loop
              playsInline
              preload={armed ? 'auto' : 'none'}
              poster={poster}
              aria-label={label}
              tabIndex={-1}
            >
              {sources.map((s) => (
                <source key={s} src={s} type={s.endsWith('.webm') ? 'video/webm' : 'video/mp4'} />
              ))}
            </video>

            {/* Isla dinamica: la pastilla que vende el conjunto como un
                telefono de verdad. Decorativa — fuera del arbol de accesibilidad. */}
            <span className="gc-phone__island" aria-hidden="true" />

            {/* Reflejo del cristal. Es lo que separa una pantalla encendida de
                un rectangulo con un video pegado. */}
            <span className="gc-phone__glare" aria-hidden="true" />

            <button
              type="button"
              className="gc-phone__toggle"
              onClick={toggle}
              aria-label={playing ? (labels.pauseVideo || 'Pausar video') : (labels.playVideo || 'Reproducir video')}
            >
              {playing ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <rect x="6" y="5" width="4" height="14" rx="1" />
                  <rect x="14" y="5" width="4" height="14" rx="1" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M8 5l11 7-11 7V5z" />
                </svg>
              )}
            </button>
          </div>
          </div>

          {/* Botones fisicos. Van sobre el canto, no sobre la cara: se empujan
              en Z lo mismo que el costado para que el giro los coloque solos. */}
          <span className="gc-phone__key gc-phone__key--mute" aria-hidden="true" />
          <span className="gc-phone__key gc-phone__key--up" aria-hidden="true" />
          <span className="gc-phone__key gc-phone__key--down" aria-hidden="true" />
          <span className="gc-phone__key gc-phone__key--power" aria-hidden="true" />
        </div>
      </div>

      {caption && <figcaption className="gc-phone__caption">{caption}</figcaption>}

      <style>{`
        .gc-phone {
          margin: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        /* La escena da la profundidad. Sin perspective el rotateY sale como un
         * simple achatamiento, sin canto ni fuga. */
        .gc-phone__scene {
          position: relative;
          width: var(--phone-w);
          perspective: 1750px;
          perspective-origin: 44% 44%;
        }

        /* Halo dorado detras: lo que despega el aparato del fondo en los
         * mockups de la galeria. Centrado tras el aparato: descentrarlo lo
         * convierte en una luz lateral y lo que se busca es que el telefono
         * salga de en medio del resplandor. */
        .gc-phone__glow {
          position: absolute;
          /* Desborda el cuerpo a proposito: el halo es mas grande que el
             telefono, si no parece un contorno y no una luz. */
          inset: -30% -56%;
          z-index: 0;
          pointer-events: none;
          /* #655B4A — dorado apagado, de nube y no de foco. Al ser un tono
           * cercano al fondo del modal, el halo envuelve al telefono en vez de
           * recortarlo, que es lo que hacia el oro saturado. */
          background: radial-gradient(ellipse 54% 48% at 50% 50%,
            rgba(101, 91, 74, 0.92) 0%,
            rgba(101, 91, 74, 0.6) 30%,
            rgba(101, 91, 74, 0.3) 50%,
            rgba(101, 91, 74, 0.1) 68%,
            transparent 82%);
          filter: blur(46px);
        }

        .gc-phone__body {
          position: relative;
          z-index: 1;
          width: 100%;
          aspect-ratio: ${BODY_RATIO};
          /* Grosor del rail metalico visto de frente (~1,5 mm de 71 mm). En %
           * se resuelve contra el ancho, asi que guarda su proporcion a
           * cualquier tamano. El resto del borde lo pone el bezel negro. */
          padding: 1.5%;
          /* Radio horizontal / vertical: el segundo se divide por la
           * proporcion del cuerpo para que la esquina salga redonda y no un
           * ovalo estirado. */
          border-radius: 13% / 6.4%;
          /* Plata pulida, en cuatro capas apiladas — un degradado solo siempre
           * sale plastico. De arriba a abajo:
           *   1. destello especular en la esquina que recibe la luz,
           *   2. segundo destello, mas debil, en la esquina opuesta,
           *   3. las bandas horizontales del entorno que recoge todo metal
           *      pulido (suelo claro, horizonte oscuro, cielo claro),
           *   4. la base: el metal en si, con cortes bruscos entre paradas
           *      porque una transicion suave lee como gris plano. */
          background:
            radial-gradient(88% 20% at 86% 1%, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0) 58%),
            radial-gradient(88% 18% at 16% 99%, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 60%),
            linear-gradient(180deg,
              rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 8%,
              rgba(0,0,0,0.18) 30%, rgba(255,255,255,0.22) 50%,
              rgba(0,0,0,0.22) 72%, rgba(255,255,255,0.45) 96%),
            linear-gradient(255deg, #fdfdfe 0%, #dcdce2 5%, #a9a9b3 21%, #86868f 46%, #b6b6c0 71%, #e8e8ed 92%, #fafafb 100%);
          /* preserve-3d: sin esto el canto y los botones se aplastan contra la
           * cara y el translateZ no hace nada. */
          transform-style: preserve-3d;
          /* El orden importa: primero el giro vertical, luego el vuelco sobre
           * el resultado y por ultimo el ladeo en pantalla. Invertirlo hace que
           * el vuelco arrastre al giro y la pose se descuadre. */
          transform: rotateY(var(--phone-tilt)) rotateX(var(--phone-pitch)) rotateZ(var(--phone-roll));
          /* Los dos primeros inset son el chaflan: el filo exterior del rail
           * esta biselado y devuelve una linea de luz muy fina antes de caer
           * al cuerpo. Sin el, el metal termina en un corte plano. */
          box-shadow:
            inset 0 0 0 1px rgba(255, 255, 255, 0.85),
            inset 0 0 0 2px rgba(148, 148, 160, 0.45),
            -16px 32px 76px rgba(0, 0, 0, 0.6),
            -5px 12px 28px rgba(0, 0, 0, 0.42),
            0 2px 8px rgba(0, 0, 0, 0.5);
        }

        /* Marco negro entre el metal y el cristal */
        .gc-phone__bezel {
          position: relative;
          width: 100%;
          height: 100%;
          /* ~2,5 mm: lo que separa el rail del area encendida. */
          padding: 2.7%;
          border-radius: 11.3% / 5.56%;
          background: #050506;
          /* El cristal monta sobre el bezel y devuelve un filo tenue. */
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.07);
        }

        /* Grosor del aparato */
        .gc-phone__side {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: linear-gradient(255deg, #eeeef3, #a0a0aa 34%, #6d6d77 70%, #4e4e56);
          transform: translateZ(-3.4%);
          /* Redondea el canto contra el cuerpo en vez de cortarlo en seco. */
          box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.6);
        }

        /* Lineas de antena: el corte que parte el marco metalico por arriba y
         * por abajo. Es un detalle diminuto y de los que mas delatan a un
         * mockup dibujado cuando falta. */
        .gc-phone__ant {
          position: absolute;
          left: 0; right: 0;
          height: 0.9%;
          background: rgba(236, 236, 242, 0.85);
        }
        .gc-phone__ant--top    { top: 11%; }
        .gc-phone__ant--bottom { bottom: 11%; }

        .gc-phone__screen {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 9.6% / 4.73%;
          overflow: hidden;
          background: #000;
        }

        .gc-phone__video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          /* cover: el video llena la pantalla aunque no venga exactamente en
           * 9:19.5. Graba en vertical y no habra franjas negras. */
          object-fit: cover;
          display: block;
        }

        .gc-phone__island {
          position: absolute;
          top: 2.2%;
          left: 50%;
          transform: translateX(-50%);
          width: 30%;
          aspect-ratio: 7 / 2;
          border-radius: 999px;
          background: #08080a;
          z-index: 2;
          pointer-events: none;
        }

        /* Reflejo diagonal del cristal */
        .gc-phone__glare {
          position: absolute;
          inset: 0;
          z-index: 3;
          pointer-events: none;
          /* Dos franjas separadas, como el reflejo de una ventana sobre el
           * cristal. Una rampa unica lee como un velo y apaga el video. */
          background:
            linear-gradient(258deg,
              rgba(255, 255, 255, 0.16) 0%,
              rgba(255, 255, 255, 0.06) 9%,
              rgba(255, 255, 255, 0) 24%),
            linear-gradient(258deg,
              rgba(255, 255, 255, 0) 30%,
              rgba(255, 255, 255, 0.055) 38%,
              rgba(255, 255, 255, 0) 47%);
        }

        .gc-phone__toggle {
          position: absolute;
          left: 6%;
          bottom: 3.2%;
          z-index: 4;
          display: grid;
          place-items: center;
          width: 28px;
          height: 28px;
          border: 1px solid rgba(244, 228, 188, 0.28);
          border-radius: 50%;
          background: rgba(11, 29, 51, 0.6);
          backdrop-filter: blur(6px);
          color: var(--gold-light, #F4E4BC);
          cursor: pointer;
          opacity: 0;
          transition: opacity 0.25s ease, transform 0.25s ease;
        }
        /* Se revela al acercarse, pero nunca se esconde del teclado. */
        .gc-phone:hover .gc-phone__toggle,
        .gc-phone__toggle:focus-visible { opacity: 1; }
        .gc-phone__toggle:hover { transform: scale(1.08); }

        /* Botones del costado. El translateZ los saca de la cara y los apoya
         * en el canto: con el giro quedan solos en su sitio. */
        .gc-phone__key {
          position: absolute;
          width: 1.4%;
          border-radius: 1.5px;
          /* Los botones son piezas del mismo metal, no rectangulos pegados:
           * llevan su propio brillo arriba y su sombra de contacto abajo. */
          background: linear-gradient(180deg, #f6f6f9 0%, #d2d2da 26%, #97979f 72%, #6f6f79 100%);
          box-shadow:
            0 1px 2px rgba(0, 0, 0, 0.55),
            inset 0 1px 0 rgba(255, 255, 255, 0.7);
          transform: translateZ(-1.3%);
        }
        .gc-phone__key--mute  { left: -0.9%;  top: 17%; height: 4.5%; }
        .gc-phone__key--up    { left: -0.9%;  top: 25%; height: 8%;   }
        .gc-phone__key--down  { left: -0.9%;  top: 35%; height: 8%;   }
        .gc-phone__key--power { right: -0.9%; top: 27%; height: 11%;  }

        .gc-phone__caption {
          max-width: 34ch;
          text-align: center;
          font-size: 0.82rem;
          line-height: 1.45;
          color: var(--text-muted, rgba(244, 228, 188, 0.65));
        }

        /* Sin movimiento: el video no arranca solo. Queda el poster y el boton
         * siempre visible para quien quiera verlo. El giro se mantiene — es una
         * pose, no una animacion. */
        @media (prefers-reduced-motion: reduce) {
          .gc-phone__toggle { opacity: 1; }
        }
      `}</style>
    </figure>
  );
}
