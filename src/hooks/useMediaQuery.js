import { useEffect, useState } from 'react';

/**
 * Responde a una media query desde JavaScript.
 *
 * Para lo que se puede resolver con CSS, se resuelve con CSS. Esto es para lo
 * que NO se puede: cuando el ancho no cambia como se ve algo, sino CUANTAS
 * cosas se pintan o donde se colocan —el numero de fichas que asoman detras de
 * la de enfrente, la rejilla del diagrama del ecosistema—. Eso son datos, no
 * estilos, y viven en el componente.
 *
 * ARRANCA SIEMPRE EN `false`, y no es un detalle menor: el HTML lo genera el
 * servidor, que no sabe el ancho de la pantalla. Si devolviera `true` por
 * defecto, un rastreador —que mide como escritorio— recibiria la version
 * angosta. Se corrige en el primer efecto tras hidratar, que para el visitante
 * es imperceptible.
 *
 * @param {string} query  Por ejemplo `(max-width: 620px)`.
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const sync = () => setMatches(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, [query]);

  return matches;
}
