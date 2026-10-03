import { ENTERPRISE, PACKAGES } from '../../data/packages.js';

/* Los diez paquetes en lista plana y plegada.
 *
 * Existe porque el selector de `PackagesAct` ensena UN paquete a la vez —que es
 * lo que hace que se entienda— y el coste es que los otros nueve no existen
 * para quien lee la pagina sin tocarla: un rastreador, un buscador de IA,
 * alguien con lector de pantalla. Esta lista los pone a todos en el HTML sin
 * deshacer el selector, y repite los mismos textos en vez de unos nuevos que se
 * desincronicen al primer cambio de precio o de nombre.
 *
 * VA AL FINAL DE LA PAGINA, no pegada al selector. Ahi era un apendice metido a
 * media pagina: cortaba el paso del precio al mantenimiento, justo cuando quien
 * lee viene siguiendo un hilo. Al final, detras de la FAQ, comparte el gesto de
 * plegado con ella y no interrumpe nada; el cierre sigue siendo lo ultimo que se
 * ve, que es lo que debe quedarse.
 *
 * Sin precios a proposito: el precio se ve en el selector, donde va acompanado
 * de su alcance.
 */

/* Los diez, en el orden del dato: primero los que se arman con el selector y
   al final los dos escalones Enterprise, que no salen de una combinacion. */
const ALL_IDS = [...PACKAGES.map((p) => p.id), ENTERPRISE.shop.id, ENTERPRISE.base.id];

export default function PackagesAll({ custom }) {
  return (
    <details className="pkgall">
      <summary className="pkgall__sum">{custom.allTitle}</summary>
      <ul className="pkgall__list">
        {ALL_IDS.map((id) => {
          const d = custom.packages[id];
          return (
            <li className="pkgall__it" key={id}>
              <h3 className="pkgall__n">{d.name}</h3>
              <p className="pkgall__d">{d.d}</p>
              <p className="pkgall__l">{d.limit}</p>
            </li>
          );
        })}
      </ul>
    </details>
  );
}
