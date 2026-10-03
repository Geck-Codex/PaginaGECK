import { cubicBezier, motion, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../../hooks/useLanguage';
import { localizedPath } from '../../i18n/routes';
import { SERVICES_STATIC } from '../../data/services.js';
import ServiceRolodex from './ServiceRolodex.jsx';
import PackagesAct from './PackagesAct.jsx';
import HiringFaq from './HiringFaq.jsx';
import PackagesAll from './PackagesAll.jsx';
import '../../styles/servicios-paths.css';

/* La misma curva que usan AboutTeaser, StatsSection y SpecialtiesShowcase en
   el index. Que las dos paginas se muevan igual no es decoracion: es lo que
   hace que se sientan el mismo sitio. */
const EASE = cubicBezier(0.22, 1, 0.36, 1);

/* El cierre entra en dos tiempos y por lados opuestos: la garantia empuja
   desde la izquierda y la llamada a la accion le responde desde la derecha.
   El orden es el del argumento: te respaldo, y entonces te invito.

   Las distancias van en porcentaje del propio elemento: cada pieza arranca
   completamente fuera de su sitio y entra desde fuera de la pagina, en vez
   de dar un empujoncito dentro de un marco que ya estaba pintado. El
   recorte lo hace `overflow-x: clip` en la raiz de la pagina. */
const slide = (from, delay) => ({
  hidden: { opacity: 0, x: from === 'left' ? '-125%' : '125%' },
  show: {
    opacity: 1, x: 0,
    transition: { duration: 0.95, ease: EASE, delay },
  },
});
const CLOSE = {
  warranty: slide('left', 0),
  act: slide('right', 0.22),
};

/* Pagina de SERVICIOS: el desarrollo a medida y nada mas.
 *
 * Fue /servicios/a-medida/, una hija de un hub que solo servia para bifurcar
 * entre el ecosistema y esto. Cuando la seccion de modulos se retiro, esa
 * bifurcacion se quedo sin una de sus dos ramas y el hub sin contenido propio:
 * titulo, planes de mantenimiento y dudas. Dos paginas para el mismo tema, una
 * de ellas vacia. Asi que a medida SUBIO al hub y la hija se fue con un 301.
 *
 * El catalogo de servicios vive aqui en HTML estatico —no dentro de un modal—
 * porque es el texto por el que esta pagina puede encontrarse en Google. Los
 * ids de cada tarjeta son los slugs (#web, #ia, #mobile) a los que ya apuntan
 * enlaces desde la home: mover el bloque sin conservarlos los habria roto.
 *
 * El mantenimiento y las dudas de contratacion llegaron del hub y van DESPUES
 * del precio: quien pregunta como se mantiene y que pasa si algo falla ya sabe
 * que se construye y cuanto cuesta. Antes de eso no son dudas, son ruido. */
export default function CustomPage({ lang }) {
  const { t } = useLanguage(lang);
  const reduce = useReducedMotion();
  const s = t.services;
  const { custom } = s;

  const services = SERVICES_STATIC.map((x) => ({ ...x, ...s.items[x.slug] }));
  const cats = s.categories;

  return (
    <div className="paths">
      <section className="paths__sec paths__sec--first">
        <header className="paths__head">
          <span className="paths__eyebrow">{custom.eyebrow}</span>
          <h1 className="paths__title">{custom.title}</h1>
          <p className="paths__lead">{custom.lead}</p>
        </header>

      </section>

      {/* Catalogo */}
      <section className="paths__sec" id="catalogo">
        <header className="paths__head">
          <h2 className="paths__title">{s.detail.title}</h2>
          <p className="paths__lead">{s.detail.subtitle}</p>
        </header>
        {/* Fichero giratorio: las tarjetas cuelgan de un eje horizontal y la
            de enfrente cae hacia el lector al pasar a la siguiente. Sustituye
            al recorrido vertical con desenfoque, que gastaba siete pantallas
            de scroll para ensenar siete parrafos — y quien no bajaba hasta el
            final no sabia que existian los ultimos. */}
        <p className="paths__hint">{s.detail.hint}</p>
        <ServiceRolodex
          services={services}
          cats={cats}
          labels={{ prev: s.detail.prev, next: s.detail.next, list: s.detail.list }}
        />
      </section>

      {/* Paquetes de referencia. Van DESPUES del catalogo: primero se ve
          que construimos y luego, ya sabiendo de que se habla, cuanto cuesta
          en ejemplos concretos.
          Se parten en dos: una sola pieza es el escalon de entrada; ya
          combinados es donde aparece el ahorro. Seis tarjetas iguales
          escondian esa diferencia. */}
      <PackagesAct custom={custom} lang={lang} />

      {/* ── Mantenimiento ── (venia de ServicesPaths, en el hub) */}
      <section className="paths__sec" id="mantenimiento">
        <header className="paths__head">
          <span className="paths__eyebrow">{s.plans.eyebrow}</span>
          <h2 className="paths__title">{s.plans.title}</h2>
          <p className="paths__lead">{s.plans.lead}</p>
        </header>
        <div className="paths__plans">
          {s.plans.items.map((p) => (
            <article className="paths__card paths__plan" key={p.name}>
              <span className="paths__plan-name">{p.name}</span>
              <span className="paths__plan-price">{p.price}</span>
              <span className="paths__plan-per">{s.plans.per}</span>
              <p className="paths__plan-hours">{p.hours}</p>
              <ul className="paths__plan-feats">
                {p.feats.map((f) => <li key={f}>{f}</li>)}
              </ul>
              <p className="paths__plan-target">{p.target}</p>
            </article>
          ))}
        </div>

        {/* Como funcionan las horas. Va DESPUES de las tres fichas y no dentro
            de cada una: son las mismas reglas para los tres planes, y
            repetirlas tres veces alargaba la ficha justo donde se compara.
            Aqui ademas esta el 10% del contrato anual, que es lo unico de este
            bloque que no es una limitacion sino un argumento. */}
        <div className="paths__fine">
          <h3 className="paths__fine-title">{s.plans.fineTitle}</h3>
          <ul className="paths__excl">
            {s.plans.fine.map((f) => <li key={f}>{f}</li>)}
          </ul>
        </div>
      </section>

      {/* ── Dudas de contratacion ── (venia de ServicesPaths, en el hub) */}
      <section className="paths__sec" id="contratar">
        <HiringFaq hiring={s.hiring} />
      </section>

      {/* Los diez paquetes en lista plana, plegada. Va AQUI y no pegada al
          selector: ahi cortaba el paso del precio al mantenimiento. Ver la
          cabecera de `PackagesAll.jsx`. */}
      <PackagesAll custom={custom} />

      {/* Garantia y cierre en UN bloque. Por separado eran dos secciones a
          pantalla completa diciendo dos frases: la garantia es el argumento y
          el boton es la accion. Juntas ocupan lo que merecen.

          Aqui habia un tercer tiempo, el puente a la seccion de modulos; se
          fue con ella y vuelve cuando los productos se relancen. */}
      <motion.section
        className="paths__close"
        {...(reduce ? {} : {
          initial: 'hidden',
          whileInView: 'show',
          viewport: { once: true, amount: 0.25 },
        })}
      >
        {/* Envoltorio con variantes vacias: las variantes solo se propagan a
            traves de componentes motion, y sin esto los dos recuadros de
            dentro no se enterarian del turno. */}
        <motion.div className="paths__close-main" variants={reduce ? undefined : {}}>
          <motion.div className="paths__close-warranty" variants={reduce ? undefined : CLOSE.warranty}>
            <span className="paths__eyebrow">{custom.warranty.k}</span>
            <h2 className="paths__close-title">{custom.warranty.t}</h2>
            <p className="paths__close-desc">{custom.warranty.d}</p>
            <p className="paths__close-desc paths__close-post">{custom.warranty.post}</p>
          </motion.div>
          <motion.div className="paths__close-act" variants={reduce ? undefined : CLOSE.act}>
            <h2 className="paths__close-title">{s.closing.title}</h2>
            <p className="paths__close-desc">{s.closing.lead}</p>
            <motion.a
              className="eco__cta"
              href={localizedPath('contact', lang)}
              {...(reduce ? {} : { whileHover: { y: -2 }, whileTap: { scale: 0.97 } })}
            >
              {s.closing.cta}
            </motion.a>
          </motion.div>
        </motion.div>
      </motion.section>
    </div>
  );
}
