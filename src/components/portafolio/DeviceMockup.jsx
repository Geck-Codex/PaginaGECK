import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

/* ─── MOCKUP DE DISPOSITIVO CON VIDEO DENTRO ───────────────────────────────
 *
 * Pensado para las automatizaciones del portafolio: un bot no se entiende con
 * una captura fija — lo que hay que ensenar es la conversacion ocurriendo.
 * Dos variantes, `phone` y `tablet`, que comparten toda la maquinaria (carga
 * diferida, pausa fuera de pantalla, accesibilidad) y se diferencian solo en
 * las medidas del armazon.
 *
 * El marco va en CSS y no en un PNG a proposito:
 *   · pesa cero y escala a cualquier ancho sin pixelarse,
 *   · el hueco de la pantalla no hay que alinearlo a mano con el video,
 *   · se adapta al tema y a cualquier proporcion de video.
 *
 * Las medidas del armazon son porcentajes del ANCHO (en CSS un padding o un
 * border-radius en % se resuelve contra el ancho), asi que el aparato entero
 * se redimensiona cambiando una sola variable: --dev-w.
 *
 * Va DE FRENTE por defecto. Girado hay que fingir el canto con laminas
 * paralelas y la luz queda pintada en gradientes fijos que no responden al
 * angulo — es justo lo que delata a un marco dibujado. De frente no hay canto
 * que fingir y el metal se puede modelar bien.
 *
 * Uso:
 *   <DeviceMockup device="tablet" src="/assets/video/..." labels={strings.detail} />
 */

/* Proporcion del cuerpo de cada aparato, y el ancho por defecto que le
 * corresponde. Viven aqui para que el marco y la pantalla no puedan
 * desincronizarse al tocar el CSS. Regla de los radios: el radio vertical es
 * el horizontal multiplicado por la proporcion, si no la esquina sale ovalada
 * en vez de redonda. */
const DEVICES = {
  phone: {
    ratio: '1 / 2.03',
    width: 'clamp(200px, 26vw, 300px)',
    /* cover: el video llena la pantalla aunque no venga exactamente en 9:19.5.
     * Graba en vertical y no habra franjas negras. */
    fit: 'cover',
  },
  tablet: {
    /* Tablet apaisada 16:10. La proporcion la manda el CONTENIDO: las
     * grabaciones de panel vienen en 16:9, y con un cuerpo 4:3 o 1.43:1 el
     * video deja dos franjas negras enormes arriba y abajo que convierten el
     * mockup en una tele de tubo. A 16:10 el recorte es del 9% y no se nota. */
    ratio: '1.6 / 1',
    width: 'clamp(300px, 46vw, 620px)',
    /* cover: con la pantalla ya casi a la proporcion del video, llenarla no
     * cuesta bordes de interfaz y evita el letterbox. */
    fit: 'cover',
  },
};

export default function DeviceMockup({
  device = 'phone',
  src,
  poster,
  label = '',
  caption = '',
  width,
  /*   tilt  = giro sobre el eje vertical. Positivo acerca el canto derecho.
   *   pitch = vuelco sobre el eje horizontal. Positivo echa el aparato atras.
   *   roll  = ladeo en el plano. Negativo lo inclina a la izquierda.
   * Al sacarlos de cero hay que mover con ellos toda la luz: el gradiente del
   * marco, el reflejo del cristal, el halo y la sombra van referidos al lado
   * que se acerca. */
  tilt = 0,
  pitch = 0,
  roll = 0,
  glow = true,
  labels = {},
  className = '',
}) {
  const conf = DEVICES[device] || DEVICES.phone;
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
      className={`gc-dev gc-dev--${device} ${className}`}
      style={{
        '--dev-w': width || conf.width,
        '--dev-ratio': conf.ratio,
        '--dev-fit': conf.fit,
        '--dev-tilt': `${tilt}deg`,
        '--dev-pitch': `${pitch}deg`,
        '--dev-roll': `${roll}deg`,
      }}
    >
      <div className="gc-dev__scene">
        {glow && <div className="gc-dev__glow" aria-hidden="true" />}

        <div className="gc-dev__body">
          {/* El canto. Copia del cuerpo empujada hacia atras en Z: solo se
              asoma cuando el aparato va girado. */}
          <span className="gc-dev__side" aria-hidden="true" />

          {/* Marco negro entre el metal y el cristal. De frente, un aparato no
              ensena la pantalla pegada al rail: hay unos milimetros de negro en
              medio, y es de lo que mas depende que se lea como una foto. */}
          <div className="gc-dev__bezel">
            {/* En la tablet la camara va sobre el bezel, que es donde esta de
                verdad; en el telefono vive dentro de la isla. */}
            {device === 'tablet' && <span className="gc-dev__cam" aria-hidden="true" />}

            <div className="gc-dev__screen">
              <video
                ref={videoRef}
                className="gc-dev__video"
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

              {/* Isla dinamica con su camara: la pastilla que vende el conjunto
                  como un telefono de verdad. Decorativa — fuera del arbol de
                  accesibilidad. */}
              {device === 'phone' && <span className="gc-dev__island" aria-hidden="true" />}

              {/* Reflejo del cristal. Es lo que separa una pantalla encendida de
                  un rectangulo con un video pegado. */}
              <span className="gc-dev__glare" aria-hidden="true" />

              <button
                type="button"
                className="gc-dev__toggle"
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

          {/* Botones fisicos. Van sobre el canto, no sobre la cara: el
              translateZ los apoya ahi para que un giro los coloque solos. */}
          <span className="gc-dev__key gc-dev__key--a" aria-hidden="true" />
          <span className="gc-dev__key gc-dev__key--b" aria-hidden="true" />
          <span className="gc-dev__key gc-dev__key--c" aria-hidden="true" />
          <span className="gc-dev__key gc-dev__key--d" aria-hidden="true" />
        </div>
      </div>

      {caption && <figcaption className="gc-dev__caption">{caption}</figcaption>}

      <style>{`
        .gc-dev {
          margin: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .gc-dev__scene {
          position: relative;
          width: var(--dev-w);
          /* Solo interviene si se sacan tilt/pitch/roll de cero.
           * El origen va centrado: descentrarlo hace que el canto, que vive
           * detras en Z, se vea corrido y asome por la esquina contraria
           * aunque el aparato este completamente de frente. */
          perspective: 1750px;
          perspective-origin: 50% 50%;
        }

        /* Halo detras: lo que despega el aparato del fondo, como en los mockups
         * renderizados de la galeria. Centrado tras el cuerpo: descentrarlo lo
         * convierte en una luz lateral, y lo que se busca es que el aparato
         * salga de en medio del resplandor. */
        .gc-dev__glow {
          position: absolute;
          /* Desborda el cuerpo a proposito: el halo es mas grande que el
             aparato, si no parece un contorno y no una luz. */
          inset: -30% -56%;
          z-index: 0;
          pointer-events: none;
          /* #655B4A — dorado apagado, de nube y no de foco. Al ser un tono
           * cercano al fondo del modal, el halo envuelve al aparato en vez de
           * recortarlo, que es lo que hacia el oro saturado. */
          background: radial-gradient(ellipse 54% 48% at 50% 50%,
            rgba(101, 91, 74, 0.92) 0%,
            rgba(101, 91, 74, 0.6) 30%,
            rgba(101, 91, 74, 0.3) 50%,
            rgba(101, 91, 74, 0.1) 68%,
            transparent 82%);
          filter: blur(46px);
        }
        /* La tablet es mucho mas ancha que alta: el mismo desborde en % la
         * dejaria con un halo desproporcionado a los lados. */
        .gc-dev--tablet .gc-dev__glow { inset: -46% -26%; }

        /* Sombra de contacto. Sin ella el aparato flota sobre el halo y nada lo
         * apoya en ningun sitio — el cerebro lo lee como recorte pegado. */
        .gc-dev__scene::after {
          content: '';
          position: absolute;
          left: 8%; right: 8%;
          bottom: -4%;
          height: 7%;
          border-radius: 50%;
          background: radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 45%, transparent 72%);
          filter: blur(14px);
          z-index: 0;
        }
        .gc-dev--tablet .gc-dev__scene::after { bottom: -7%; height: 12%; }

        .gc-dev__body {
          position: relative;
          z-index: 1;
          width: 100%;
          aspect-ratio: var(--dev-ratio);
          /* Grosor del rail metalico visto de frente. En % se resuelve contra
           * el ancho, asi que guarda su proporcion a cualquier tamano. El resto
           * del borde lo pone el bezel negro. */
          padding: 1.5%;
          /* Radio horizontal / vertical: el vertical es el horizontal por la
           * proporcion del cuerpo, para que la esquina salga redonda y no un
           * ovalo estirado. */
          border-radius: 18% / 8.87%;
          /* El delator numero uno de un marco dibujado. border-radius traza una
           * ELIPSE: la curva entra y sale de golpe. Un aparato real usa squircle
           * —curvatura continua, la esquina se va redondeando— y a este tamano
           * el ojo distingue las dos al instante aunque no sepa nombrarlas.
           * OJO: el squircle es MAS cuadrado que la elipse a igual radio, asi
           * que pide radios generosos — un aparato real combina las dos cosas.
           * Con el radio pequeno las esquinas salen casi rectas.
           * Donde corner-shape no existe todavia, queda la elipse de siempre. */
          corner-shape: superellipse(3);
          /* El canto es un CILINDRO, y un cilindro metalico visto de frente da
           * siempre la misma secuencia desde el filo hacia dentro: sombra del
           * borde, banda especular estrecha, caida rapida y cuerpo medio. Esa
           * secuencia, con las paradas muy juntas, es lo que lee como metal
           * torneado; un degradado diagonal a todo lo ancho no modela nada.
           *
           * Va en el eje horizontal, que es donde el rail se ve de canto. Los
           * lados de arriba y abajo los modela ::before con el perfil girado. */
          background: linear-gradient(90deg,
            #55555e 0%, #8e8e99 0.2%, #e9e9ef 0.45%, #fdfdfe 0.65%,
            #cfcfd8 0.95%, #a3a3ad 1.2%, #90909a 1.5%,
            #9b9ba5 50%,
            #90909a 98.5%, #a3a3ad 98.8%, #cfcfd8 99.05%,
            #fdfdfe 99.35%, #e9e9ef 99.55%, #8e8e99 99.8%, #55555e 100%);
          /* preserve-3d: sin esto el canto y los botones se aplastan contra la
           * cara y el translateZ no hace nada. */
          transform-style: preserve-3d;
          /* El orden importa: primero el giro vertical, luego el vuelco sobre el
           * resultado y por ultimo el ladeo en pantalla. */
          transform: rotateY(var(--dev-tilt)) rotateX(var(--dev-pitch)) rotateZ(var(--dev-roll));
          /* Los dos primeros inset son el chaflan: el filo exterior del rail
           * esta biselado y devuelve una linea de luz muy fina antes de caer al
           * cuerpo. Sin el, el metal termina en un corte plano. */
          box-shadow:
            inset 0 0 0 0.5px rgba(255, 255, 255, 0.5),
            -16px 32px 76px rgba(0, 0, 0, 0.6),
            -5px 12px 28px rgba(0, 0, 0, 0.42),
            0 2px 8px rgba(0, 0, 0, 0.5);
        }

        /* El mismo perfil de cilindro para los cantos de arriba y abajo, con el
         * centro transparente para no tapar el modelado horizontal. Asi cada
         * lado del rail queda modelado en la direccion en la que curva. */
        .gc-dev__body::before {
          content: '';
          position: absolute;
          inset: 0;
          z-index: 0;
          border-radius: inherit;
          corner-shape: inherit;
          pointer-events: none;
          background: linear-gradient(180deg,
            #55555e 0%, #8e8e99 0.1%, #e9e9ef 0.22%, #fdfdfe 0.32%,
            #cfcfd8 0.47%, #a3a3ad 0.6%, #90909a 0.74%,
            rgba(155,155,165,0) 3%, rgba(155,155,165,0) 97%,
            #90909a 99.26%, #a3a3ad 99.4%, #cfcfd8 99.53%,
            #fdfdfe 99.68%, #e9e9ef 99.78%, #8e8e99 99.9%, #55555e 100%);
        }

        /* ── TABLET ────────────────────────────────────────────────────────
         * Un iPad no es un telefono estirado: el rail es mucho mas fino
         * respecto al ancho, la esquina mucho menos redonda y el bezel mas
         * ancho y uniforme. Los perfiles del cilindro se comprimen en la misma
         * proporcion que el rail, si no el metal se ve el triple de grueso. */
        .gc-dev--tablet .gc-dev__body {
          padding: 0.85%;
          border-radius: 6.5% / 10.4%;
          background: linear-gradient(90deg,
            #55555e 0%, #8e8e99 0.11%, #e9e9ef 0.25%, #fdfdfe 0.37%,
            #cfcfd8 0.54%, #a3a3ad 0.68%, #90909a 0.85%,
            #9b9ba5 50%,
            #90909a 99.15%, #a3a3ad 99.32%, #cfcfd8 99.46%,
            #fdfdfe 99.63%, #e9e9ef 99.75%, #8e8e99 99.89%, #55555e 100%);
        }
        .gc-dev--tablet .gc-dev__body::before {
          background: linear-gradient(180deg,
            #55555e 0%, #8e8e99 0.18%, #e9e9ef 0.4%, #fdfdfe 0.6%,
            #cfcfd8 0.86%, #a3a3ad 1.1%, #90909a 1.36%,
            rgba(155,155,165,0) 5%, rgba(155,155,165,0) 95%,
            #90909a 98.64%, #a3a3ad 98.9%, #cfcfd8 99.14%,
            #fdfdfe 99.4%, #e9e9ef 99.6%, #8e8e99 99.82%, #55555e 100%);
        }

        /* Marco negro entre el metal y el cristal */
        .gc-dev__bezel {
          position: relative;
          z-index: 1;
          width: 100%;
          height: 100%;
          padding: 2.7%;
          border-radius: 16.5% / 8.13%;
          corner-shape: superellipse(3);
          background: #050506;
          /* El cristal monta sobre el bezel y devuelve un filo tenue. */
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.07);
        }
        .gc-dev--tablet .gc-dev__bezel {
          padding: 1.9%;
          border-radius: 5.65% / 9.04%;
        }

        /* Camara de la tablet: sobre el bezel superior, centrada, que es donde
         * la lleva un iPad apaisado. */
        .gc-dev__cam {
          position: absolute;
          top: 1%;
          left: 50%;
          transform: translateX(-50%);
          width: 0.85%;
          aspect-ratio: 1;
          border-radius: 50%;
          z-index: 2;
          background:
            radial-gradient(circle at 34% 30%, rgba(120,150,190,0.6) 0%, rgba(20,28,44,0.9) 42%, #05070c 70%),
            #05070c;
          box-shadow: inset 0 0 0 0.5px rgba(150,170,200,0.3);
        }

        /* Grosor del aparato */
        .gc-dev__side {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          corner-shape: inherit;
          background: linear-gradient(255deg, #eeeef3, #a0a0aa 34%, #6d6d77 70%, #4e4e56);
          transform: translateZ(-3.4%);
          box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.6);
        }

        .gc-dev__screen {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 13.8% / 6.8%;
          corner-shape: superellipse(3);
          overflow: hidden;
          background: #000;
        }
        .gc-dev--tablet .gc-dev__screen { border-radius: 3.75% / 6%; }

        .gc-dev__video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: var(--dev-fit);
          display: block;
        }

        .gc-dev__island {
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
        /* La camara. Un ojo diminuto con su reflejo: es de las primeras cosas
         * que el ojo busca para dar por bueno un telefono. */
        .gc-dev__island::after {
          content: '';
          position: absolute;
          top: 50%;
          right: 13%;
          transform: translateY(-50%);
          width: 26%;
          aspect-ratio: 1;
          border-radius: 50%;
          background:
            radial-gradient(circle at 34% 30%, rgba(120,150,190,0.55) 0%, rgba(20,28,44,0.9) 42%, #05070c 70%),
            #05070c;
          box-shadow: inset 0 0 0 0.5px rgba(150,170,200,0.25);
        }

        /* Reflejo diagonal del cristal */
        .gc-dev__glare {
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

        .gc-dev__toggle {
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
        .gc-dev--tablet .gc-dev__toggle { left: 2.6%; bottom: 4%; }
        /* Se revela al acercarse, pero nunca se esconde del teclado. */
        .gc-dev:hover .gc-dev__toggle,
        .gc-dev__toggle:focus-visible { opacity: 1; }
        .gc-dev__toggle:hover { transform: scale(1.08); }

        /* Botones fisicos: piezas del mismo metal, no rectangulos pegados —
         * llevan su brillo arriba y su sombra de contacto abajo. */
        .gc-dev__key {
          position: absolute;
          border-radius: 1.5px;
          background: linear-gradient(180deg, #f6f6f9 0%, #d2d2da 26%, #97979f 72%, #6f6f79 100%);
          box-shadow:
            0 1px 2px rgba(0, 0, 0, 0.55),
            inset 0 1px 0 rgba(255, 255, 255, 0.7);
          transform: translateZ(-1.3%);
        }
        /* Telefono: silencio y volumen a la izquierda, encendido a la derecha. */
        /* Apenas asoman del canto y son metal apagado, no piezas brillantes:
         * con el blanco del rail se leian como pestanas pegadas al marco. */
        .gc-dev--phone .gc-dev__key {
          width: 0.9%;
          background: linear-gradient(90deg, #c3c3cc 0%, #9296a0 45%, #666a74 100%);
          box-shadow: 0 0.5px 1.5px rgba(0, 0, 0, 0.5);
        }
        .gc-dev--phone .gc-dev__key--a { left: -0.5%;  top: 17%; height: 4.5%; }
        .gc-dev--phone .gc-dev__key--b { left: -0.5%;  top: 25%; height: 8%;   }
        .gc-dev--phone .gc-dev__key--c { left: -0.5%;  top: 35%; height: 8%;   }
        .gc-dev--phone .gc-dev__key--d { right: -0.5%; top: 27%; height: 11%;  }
        /* Tablet apaisada: encendido en el canto de arriba, volumen en el
         * derecho — el gradiente se gira para que el brillo siga cayendo desde
         * la misma luz. */
        .gc-dev--tablet .gc-dev__key {
          background: linear-gradient(90deg, #f6f6f9 0%, #d2d2da 26%, #97979f 72%, #6f6f79 100%);
        }
        /* La tablet va sin botones. En un aparato tan ancho visto de frente lo
         * que asoma del canto es de decimas de milimetro: a cualquier tamano
         * util en pantalla eso cae por debajo del pixel, y forzarlo a que se
         * vea lo convierte en pestanas claras pegadas al marco — que es peor
         * que no tenerlos. El telefono si los luce porque su canto es mucho
         * mas alto en proporcion. */
        .gc-dev--tablet .gc-dev__key { display: none; }

        .gc-dev__caption {
          max-width: 44ch;
          text-align: center;
          font-size: 0.82rem;
          line-height: 1.45;
          color: var(--text-muted, rgba(244, 228, 188, 0.65));
        }

        /* Sin movimiento: el video no arranca solo. Queda el poster y el boton
         * siempre visible para quien quiera verlo. */
        @media (prefers-reduced-motion: reduce) {
          .gc-dev__toggle { opacity: 1; }
        }
      `}</style>
    </figure>
  );
}
