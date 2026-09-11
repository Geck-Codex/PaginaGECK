import { useRef, useState } from 'react';
import { localizedPath } from '../../i18n/routes';
import { useAutoplay } from '../../hooks/useAutoplay';

/* La bifurcacion del hub: ecosistema o a medida, cara a cara.
 *
 * Antes eran dos tarjetas independientes, una junto a otra, cada una con su
 * lista de datos. Se leian por separado y decidir obligaba a ir y volver
 * comparando de memoria: "el de la izquierda decia dias, y este... semanas?".
 * Aqui las dos columnas comparten las filas, asi que el precio esta a la
 * altura del precio y el arranque a la del arranque: la diferencia se ve sin
 * buscarla.
 *
 * Al pasar por una columna, esa se ensancha y la otra le cede sitio: no es
 * un realce decorativo, el camino que miras ocupa mas pagina que el que no.
 * Y la columna entera es el enlace —de la cabecera al pie— porque cuando ya
 * se agrando bajo el cursor, hacerle clic es el gesto que sigue; obligar a
 * apuntarle a un "Armar el mio" de dos palabras seria pedir punteria para
 * algo que ya estaba decidido.
 *
 * EN MOVIL SOLO SE VE UNO, y se cambia con un interruptor en el mismo sitio
 * —el patron del "Que hacemos" de la portada—. Dos tarjetas apiladas obligaban
 * a bajar, memorizar "dias", subir y contrastar contra "semanas o meses": el ir
 * y venir que la version de escritorio elimina. Cambiandolos en el mismo hueco,
 * el dato de uno cae justo donde estaba el del otro, y la comparacion se hace
 * con la memoria de un segundo en vez de con la de media pantalla.
 *
 * Las DOS columnas siguen en el HTML siempre; la que no toca se oculta por CSS.
 * Asi un rastreador lee los dos caminos aunque nadie toque el interruptor.
 *
 * La columna de etiquetas se oculta y cada celda repone la suya con el ::before
 * del CSS a partir de `data-k`.
 */

/* El orden de las filas es el de la decision: cuanto cuesta, cuando lo
   tengo, que decido yo, que me pregunto, y como se ve en concreto. */
const ROWS = ['price', 'start', 'decide', 'ask', 'example'];

/* El interruptor se ensena solo una vez: pasa al otro camino y vuelve.
 *
 * No es un carrusel, son dos opciones — y dos opciones alternandose para
 * siempre no informan, molestan a quien esta leyendo. Con un viaje de ida y
 * vuelta basta para que se entienda que eso se toca, que es lo unico que hace
 * falta: un interruptor en reposo no dice que se pueda tocar.
 *
 * Es el mismo gesto que la demostracion del "Que hacemos" de la portada, y a
 * proposito: son el mismo patron y deben sentirse igual. */
const DEMO_MS = 2600;

export default function ForkCompare({ fork, lang }) {
  const [focus, setFocus] = useState(null);
  /* Solo manda en movil; en escritorio se ven los dos y esto no pinta nada. */
  const [shown, setShown] = useState('eco');
  const rootRef = useRef(null);

  const { stop } = useAutoplay(rootRef, {
    interval: DEMO_MS,
    onTick: () => {
      /* En escritorio se ven los dos caminos a la vez y el interruptor esta
         oculto: no hay nada que demostrar, y mover `shown` solo provocaria
         recalculos de estilo que nadie ve. El corte va aqui y no en el CSS
         porque es el unico sitio que conoce el ancho real. */
      if (!window.matchMedia('(max-width: 860px)').matches) return false;

      let done = false;
      setShown((p) => {
        // Segundo paso: ya volvio a 'eco', la demostracion cumplio.
        if (p === 'custom') done = true;
        return p === 'eco' ? 'custom' : 'eco';
      });
      return !done;
    },
  });

  /* Cualquier toque manda: si el visitante ya eligio, la pagina deja de
     moverle la tarjeta debajo de la vista. */
  const choose = (id) => { stop(); setShown(id); };

  const cols = [
    { id: 'eco', d: fork.eco, href: localizedPath('ecosystem', lang) },
    { id: 'custom', d: fork.custom, href: localizedPath('custom', lang) },
  ];

  /* El reparto de ancho lo decide el grid de fuera y no cada columna: son
     hermanas repartiendose el mismo espacio, y eso solo lo puede arbitrar el
     padre. Las columnas se limitan a decir si estan arriba o apartadas. */
  return (
    <div className="svcx" ref={rootRef} onMouseLeave={() => setFocus(null)}>
      <p className="svcx__hint">{fork.compareHint}</p>

      {/* Interruptor de movil. `type="button"` explicito: dentro de un formulario
          el valor por defecto es submit, y esto no envia nada. */}
      <div className="svcx__switch" role="tablist" aria-label={fork.eyebrow}>
        {cols.map(({ id, d }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={shown === id}
            className={`svcx__sw${shown === id ? ' is-on' : ''}`}
            onClick={() => choose(id)}
          >
            {d.k}
            {/* El filete no se desliza de una palabra a otra: cada boton tiene
                el suyo y se escala. Uno solo obligaria a medir anchos con JS. */}
            <span className="svcx__sw-bar" aria-hidden="true" />
          </button>
        ))}
      </div>

      <div className={`svcx__grid show-${shown}${focus ? ` on-${focus}` : ''}`}>
        <div className="svcx__labels" aria-hidden="true">
          <div className="svcx__lbl svcx__lbl--head" />
          {ROWS.map((r) => (
            <div className="svcx__lbl" key={r}>{fork.labels[r]}</div>
          ))}
          <div className="svcx__lbl svcx__lbl--foot" />
        </div>

        {/* La columna es el enlace. Por eso el pie lleva un span y no otra
            <a>: un enlace dentro de otro no es HTML valido, y el navegador
            lo desarma por su cuenta. */}
        {cols.map(({ id, d, href }) => {
          const state = focus && focus !== id ? ' is-dim' : (focus === id ? ' is-up' : '');
          return (
            <a
              className={`svcx__col svcx__col--${id}${state}`}
              href={href}
              key={id}
              onMouseEnter={() => setFocus(id)}
              onFocus={() => setFocus(id)}
              onBlur={() => setFocus(null)}
            >
              {/* div y no span: aqui dentro va un <h2>, que un span no puede
                  contener. Las demas celdas siguen siendo span. */}
              <div className="svcx__cell svcx__cell--head">
                <span className="svcx__k">{d.k}</span>
                {/* Encabezado de verdad, no un span con estilo: son los dos
                    caminos de la pagina y asi los lee un rastreador. Un <h2>
                    dentro de un <a> es HTML valido. */}
                <h2 className="svcx__t">{d.title}</h2>
                <span className="svcx__d">{d.desc}</span>
              </div>

              {ROWS.map((r) => (
                <span className="svcx__cell" data-k={fork.labels[r]} key={r}>
                  <span className="svcx__v">{d[r]}</span>
                </span>
              ))}

              <span className="svcx__cell svcx__cell--foot">
                <span className="svcx__go">{d.go} &rarr;</span>
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
