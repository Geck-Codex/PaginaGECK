import { localizedPath } from '../../i18n/routes';

/* La bifurcacion del hub: ecosistema o a medida, cara a cara.
 *
 * Las dos columnas comparten las filas, asi que el precio de un camino queda a
 * la altura del precio del otro y la diferencia se lee sin buscarla. Decidir no
 * obliga a ir y volver comparando de memoria.
 *
 * SIN CAJAS, como la rejilla de "Que hacemos" de la portada: las celdas se
 * apoyan en el fondo de la pagina y se separan con filetes de un pixel. Antes
 * cada columna era una tarjeta con borde y fondo propios, y en pantallas
 * estrechas el contenido chocaba contra ese contenedor y se cortaba. Sin caja
 * no hay nada contra que chocar, y de paso la seccion se lee como parte de la
 * pagina en vez de como un widget pegado encima.
 *
 * MISMO ACOMODO EN MOVIL Y EN ESCRITORIO, y es la regla que manda: dos
 * columnas, siempre. Apiladas se pierde lo unico que esta seccion hace —
 * comparar—, porque obliga a bajar, memorizar "dias", subir y contrastar
 * contra "semanas o meses". Lo que se ajusta al ancho es el tamaño del texto,
 * nunca el numero de columnas.
 *
 * La etiqueta de cada fila va ARRIBA del dato y no en una columna aparte. Un
 * eje de etiquetas a la izquierda se come un tercio del ancho en un telefono,
 * y mantenerlo solo en escritorio daria dos disenos distintos que hay que
 * corregir dos veces.
 *
 * La columna entera es el enlace, de la cabecera al pie: cuando alguien ya
 * decidio que camino le toca, pedirle punteria para un "Armar el mio" de dos
 * palabras es pedirle trabajo por nada. Por eso el pie lleva un <span> y no
 * otra <a>: un enlace dentro de otro no es HTML valido.
 */

/* El orden de las filas es el de la decision: cuanto cuesta, cuando lo
   tengo, que decido yo, que me pregunto, y como se ve en concreto. */
const ROWS = ['price', 'start', 'decide', 'ask', 'example'];

export default function ForkCompare({ fork, lang }) {
  const cols = [
    { id: 'eco', d: fork.eco, href: localizedPath('ecosystem', lang) },
    { id: 'custom', d: fork.custom, href: localizedPath('custom', lang) },
  ];

  return (
    <div className="svcx">
      <div className="svcx__grid">
        {cols.map(({ id, d, href }) => (
          <a className={`svcx__col svcx__col--${id}`} href={href} key={id}>
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
        ))}
      </div>
    </div>
  );
}
