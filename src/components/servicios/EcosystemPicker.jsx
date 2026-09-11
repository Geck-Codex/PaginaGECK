import { useEffect, useMemo, useState } from 'react';
import {
  MODULES, LINKS, PRESETS, linkKey, NARROW_POS, VIEWBOX, NARROW_AT,
} from '../../data/ecosystem.js';

/* Selector del ecosistema.
 *
 * Es un configurador, no una lista: el diagrama a la izquierda y el resumen a
 * la derecha, para que las cifras se muevan a la vista mientras se decide —
 * que es el momento en que se decide. Antes iba todo apilado en una columna y
 * cada panel nuevo empujaba el precio y el boton fuera de pantalla.
 *
 * El diagrama va en SVG y no en una rejilla de tarjetas porque lo que se
 * vende no son los modulos sueltos, son los cables: al encender dos que se
 * hablan, la linea entre ellos se ilumina y el resumen dice QUE viaja por
 * ahi. Una linea sin explicar solo dice "relacionados de alguna forma".
 */

const W = 165;
const H = 60;

/**
 * En pantallas angostas el diagrama se REACOMODA a dos columnas, no se encoge.
 * Ver `NARROW_POS` en data/ecosystem.js para el porque.
 *
 * Arranca en `false` a proposito: el HTML del servidor no sabe el ancho de la
 * pantalla, y pintar la version angosta por defecto le daria a un rastreador
 * —que mide como escritorio— la disposicion equivocada. Se corrige en el
 * primer efecto tras hidratar.
 */
function useNarrow() {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${NARROW_AT}px)`);
    const sync = () => setNarrow(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);
  return narrow;
}

const posOf = (m, narrow) => (narrow ? NARROW_POS[m.id] ?? m : m);
const cx = (m, narrow) => posOf(m, narrow).x + W / 2;
const cy = (m, narrow) => posOf(m, narrow).y + H / 2;

const mxn = (n) => '$' + n.toLocaleString('es-MX');

export default function EcosystemPicker({ t, contactHref }) {
  const narrow = useNarrow();
  const [on, setOn] = useState(() => new Set());
  const toggle = (id) =>
    setOn((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const pickable = MODULES.filter((m) => !m.soon);

  const { sub, wires } = useMemo(() => {
    let sub = 0;
    on.forEach((id) => {
      const m = MODULES.find((x) => x.id === id);
      if (m) sub += m.sub;
    });
    const wires = LINKS.filter((l) => on.has(l.a) && on.has(l.b));
    return { sub, wires };
  }, [on]);

  /* Los atajos por rubro NO llevan precio cerrado: solo encienden piezas. El
     total sigue siendo la suma, asi que aqui no hay dos cuentas que mezclar
     — a diferencia de los paquetes de a medida, que si tienen precio propio. */
  const activePreset = PRESETS.find(
    (c) => c.mods.length === on.size && c.mods.every((id) => on.has(id)),
  );

  /* Cada modulo cuesta lo mismo al mes, asi que el precio del nodo dice
     "/mes" y no una cifra a secas: sin eso se lee como pago unico, que es
     justo lo que este modelo dejo de ser. */
  const priceOf = (m) => (m.soon ? t.eco.soon : `${mxn(m.sub)}${t.eco.perMo}`);

  return (
    <div className="eco">
      {/* Un solo aparato: diagrama, cifras y alcance dentro de la misma caja.
          El diagrama se lleva ~75% del ancho porque es lo que vende; la
          columna estrecha solo carga con lo que cambia al pulsar (cuantos
          modulos, cuanto cuesta y que viaja por los cables). */}
      <div className="eco__rig">
        {/* Los atajos entran DENTRO del aparato, como su barra de mandos.
            Sueltos encima flotaban en tierra de nadie y se leian como filtros;
            aqui se ven como lo que son: el punto de partida. Cada uno dice
            cuantas piezas enciende, para que no haya que pulsarlo a ciegas. */}
        <div className="eco__rig-top">
          <div className="eco__rig-top-head">
            <h3 className="eco__rig-top-title">{t.eco.presetsTitle}</h3>
            <p className="eco__rig-top-hint">{t.eco.presetsHint}</p>
          </div>
          <div className="eco__presets">
            {PRESETS.map((c) => {
              const is = activePreset?.id === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  className={`eco__chip${is ? ' is-on' : ''}`}
                  aria-pressed={is}
                  onClick={() => setOn(new Set(c.mods))}
                >
                  {t.eco.presets[c.id]}
                  <span className="eco__chip-n">{c.mods.length}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="eco__rig-main">
          <div className="eco__stage">
            <svg viewBox={narrow ? VIEWBOX.narrow : VIEWBOX.wide} role="img" aria-label={t.eco.title}>
              <g fill="none" strokeLinecap="round">
                {LINKS.map((l) => {
                  const A = MODULES.find((m) => m.id === l.a);
                  const B = MODULES.find((m) => m.id === l.b);
                  const live = on.has(l.a) && on.has(l.b);
                  return (
                    <line
                      key={linkKey(l)}
                      x1={cx(A, narrow)} y1={cy(A, narrow)} x2={cx(B, narrow)} y2={cy(B, narrow)}
                      className={`eco__link${live ? ' is-on' : ''}`}
                    />
                  );
                })}
              </g>

              {MODULES.map((m) => {
                const active = on.has(m.id);
                return (
                  <g
                    key={m.id}
                    className={`eco__node${active ? ' is-on' : ''}${m.soon ? ' is-soon' : ''}`}
                    transform={`translate(${posOf(m, narrow).x},${posOf(m, narrow).y})`}
                    role={m.soon ? undefined : 'button'}
                    tabIndex={m.soon ? undefined : 0}
                    aria-pressed={m.soon ? undefined : active}
                    aria-label={t.eco.modules[m.id]}
                    onClick={m.soon ? undefined : () => toggle(m.id)}
                    onKeyDown={
                      m.soon
                        ? undefined
                        : (e) => {
                            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(m.id); }
                          }
                    }
                  >
                    <rect width={W} height={H} rx="16" />
                    <text x={W / 2} y="27" textAnchor="middle" className="eco__nm">{t.eco.modules[m.id]}</text>
                    <text x={W / 2} y="45" textAnchor="middle" className="eco__pr">{priceOf(m)}</text>
                  </g>
                );
              })}
            </svg>
          </div>

          <aside className="eco__side">
            {/* Cuantos y cuanto, en la MISMA fila: son las dos mitades de una
                sola frase —"tres modulos, novecientos al mes"— y separadas en
                dos bloques obligaban a leerlas como dos datos sueltos. Juntas
                se ve la cuenta moverse al encender una pieza, que es lo que
                convence.

                Una sola cifra de dinero: la del mes. Antes habia dos —alta y
                suscripcion— y la grande, la del alta, era la que frenaba. */}
            <div className="eco__figs">
              <div className="eco__fig">
                <span className="eco__fig-k">{t.eco.cntK}</span>
                <span className="eco__fig-v">{on.size}</span>
                <span className="eco__fig-s">{t.eco.cntS(on.size ? pickable.length : 0)}</span>
              </div>
              <div className="eco__fig">
                <span className="eco__fig-k">{t.eco.subK}</span>
                <span className="eco__fig-v is-accent">{mxn(sub)}</span>
                <span className="eco__fig-s">{t.eco.subS}</span>
              </div>
            </div>
            <div className="eco__fig">
              <span className="eco__fig-k">{t.eco.setupK}</span>
              <span className="eco__fig-v">{t.eco.setupV}</span>
              <span className="eco__fig-s">{t.eco.setupS}</span>
            </div>

            <div className="eco__block">
              <h4 className="eco__block-title">{t.eco.wiresTitle}</h4>
              {wires.length === 0 ? (
                <p className="eco__empty">{t.eco.wiresNone}</p>
              ) : (
                <ul className="eco__wires-list">
                  {wires.map((l) => (
                    <li key={linkKey(l)}>
                      {t.eco.links[linkKey(l)]}
                      {!l.confirmed && <em> — {t.eco.unconfirmed}</em>}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>
        </div>

        {/* Hasta donde llega cada pieza: a lo ancho y en rejilla. En la
            columna estrecha se convertia en una lista larga que empujaba el
            boton fuera de pantalla. El precio es cerrado porque el alcance lo
            es, y decirlo aqui evita la sorpresa en la cotizacion. */}
        {/* Aqui vivia "Hasta donde llega cada uno": las seis fichas de alcance
            con su captura. Se retiro por decision del usuario, en las dos
            medidas —no solo en movil—. El bloque repetia en prosa lo que el
            diagrama ya dice al encender un modulo, y alargaba la pagina justo
            despues del precio, que es donde se decide. El texto sigue en
            `t.eco.scopes` por si vuelve; las capturas, en `MODULES[].img`. */}

        <div className="eco__rig-foot">
          <a href={contactHref} className="eco__cta">{t.eco.cta}</a>
        </div>
      </div>

      <p className="eco__note">{t.eco.draftNote}</p>
    </div>
  );
}
