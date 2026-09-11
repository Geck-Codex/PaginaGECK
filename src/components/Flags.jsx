/* Banderas como SVG en linea, no como emoji.
 *
 * El emoji de bandera (🇲🇽) NO se dibuja en Windows: el sistema no trae los
 * glifos, y el navegador cae a las dos letras del codigo de pais. O sea que en
 * la mitad de las computadoras del mundo se veria "MX" donde deberia haber una
 * bandera — y como al lado ya va el codigo del idioma, quedaria repetido.
 *
 * Van simplificadas a proposito. A 20 px de ancho el aguila del escudo mexicano
 * es una mancha, asi que se resuelve con un circulo que insinua su silueta; sin
 * el, el tricolor verde-blanco-rojo se confunde con el de Italia. La de Estados
 * Unidos lleva siete franjas en vez de trece por lo mismo: trece a este tamano
 * se ven como un degradado gris.
 *
 * Una nota sobre usar banderas para idiomas: en general es mala practica —un
 * idioma no es un pais, y el espanol no es de Mexico—. Aqui se acepta porque
 * las tres variantes del sitio SON regionales (es-MX, en-US, pt-BR, declaradas
 * asi en LOCALE_META) y porque la bandera nunca va sola: siempre acompanada del
 * codigo del idioma, que es lo que de verdad informa.
 */

const box = { viewBox: '0 0 21 14', width: 21, height: 14, 'aria-hidden': true, focusable: 'false' };

/** Mexico — es-MX */
export function FlagMX({ className }) {
  return (
    <svg {...box} className={className}>
      <rect width="7" height="14" fill="#006847" />
      <rect x="7" width="7" height="14" fill="#FFF" />
      <rect x="14" width="7" height="14" fill="#CE1126" />
      {/* El escudo, insinuado: sin esto se lee como la bandera de Italia. */}
      <circle cx="10.5" cy="7" r="2.1" fill="#7B6A3E" />
      <circle cx="10.5" cy="7" r="1.1" fill="#5C4A2A" />
    </svg>
  );
}

/** Estados Unidos — en-US */
export function FlagUS({ className }) {
  return (
    <svg {...box} className={className}>
      <rect width="21" height="14" fill="#FFF" />
      {[0, 2, 4, 6].map((i) => (
        <rect key={i} y={i * 2} width="21" height="2" fill="#B22234" />
      ))}
      <rect width="9" height="8" fill="#3C3B6E" />
      {/* Tres estrellas bastan para leerse como el recuadro estrellado. */}
      {[[2.2, 2], [4.5, 3.4], [6.8, 2]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="0.7" fill="#FFF" />
      ))}
      <circle cx="3.4" cy="5.4" r="0.7" fill="#FFF" />
      <circle cx="5.7" cy="5.4" r="0.7" fill="#FFF" />
    </svg>
  );
}

/** Brasil — pt-BR */
export function FlagBR({ className }) {
  return (
    <svg {...box} className={className}>
      <rect width="21" height="14" fill="#009C3B" />
      <path d="M10.5 1.6 19.4 7l-8.9 5.4L1.6 7z" fill="#FFDF00" />
      <circle cx="10.5" cy="7" r="3.1" fill="#002776" />
      {/* La franja del lema, sin el texto: a este tamano seria una raya gris. */}
      <path d="M7.6 5.9a3.1 3.1 0 0 0 5.8 1.5" stroke="#FFF" strokeWidth="0.9" fill="none" />
    </svg>
  );
}

export const FLAGS = { es: FlagMX, en: FlagUS, pt: FlagBR };
