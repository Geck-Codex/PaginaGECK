/**
 * track.js — un solo camino para registrar un contacto.
 *
 * `window.gcTrack` la define `Analytics.astro` y solo existe si hay IDs de
 * medición configurados. Por eso cada llamada comprueba antes: sin analítica
 * esto no hace nada y, sobre todo, no rompe el clic del usuario. Una conversión
 * que no se mide es un dato perdido; un botón que no abre WhatsApp porque falló
 * la analítica es un cliente perdido, y ese orden no se invierte nunca.
 *
 * Vive aquí y no dentro de un componente porque lo llaman tres: el formulario
 * de contacto, el pie y la página de servicios. Cuando estaba solo en
 * `Contact.jsx`, los enlaces de WhatsApp y correo del pie y de servicios no
 * contaban nada — la gente escribía desde ahí y esos contactos no aparecían en
 * ningún reporte.
 *
 * `method` es POR DÓNDE llegó el contacto (whatsapp, email, form) y `where` es
 * DESDE DÓNDE (footer, services, contact). Separarlos es lo que después
 * permite saber si el pie trae clientes o solo ocupa espacio.
 */

export function trackLead(method, where) {
  if (typeof window === 'undefined') return;
  if (typeof window.gcTrack !== 'function') return;

  window.gcTrack('generate_lead', {
    method,
    where,
    page: window.location.pathname,
  });
}
