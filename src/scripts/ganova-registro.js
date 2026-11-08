/**
 * ganova-registro.js — el formulario para apartar lugar en la beta de Ganova.
 *
 * Al enviar, arma el registro en el formato de docs/registro-beta/registro.schema.json
 * y lo manda al intermediario `registro-beta` (Edge Function del Supabase de
 * Ganova, C:\ganova\supabase\functions\registro-beta), que lo pasa al CRM de
 * Geck Codex con la llave del CRM. Esa llave vive solo en el servidor: aqui no
 * va ninguna. Si no se puede guardar (sin señal, el CRM falla, demasiados
 * envios), se abre WhatsApp con los datos ya escritos para no perder a nadie.
 *
 * Si la pagina trae el widget de Turnstile, su token viaja como `captcha`.
 *
 * Antes de mandar nada se pide permiso con el aviso de privacidad (la ventana
 * #gn-aviso). Sale al tocar cualquier boton que lleve a #apartar, la primera vez
 * que se toca un campo o al enviar sin haber aceptado. Lo aceptado viaja con el
 * registro (`consentimiento`) como prueba de que version del aviso se acepto.
 */

// Si cambia el aviso integral (src/pages/ganova/beta/privacidad.astro), cambia
// la version: lo aceptado con otra version ya no cuenta y se vuelve a pedir.
const AVISO = { version: '2026-10-21', url: '/ganova/beta/privacidad/' };
const LLAVE = 'gn-aviso-beta';
const LLAVE_ORIGEN = 'gn-origen-beta';

// UUID v4. randomUUID no existe en navegadores viejos ni fuera de https.
const nuevoId = () => {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  const b = crypto.getRandomValues(new Uint8Array(16));
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = [...b].map((x) => x.toString(16).padStart(2, '0')).join('');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
};

// De donde llego: las UTM del anuncio y la pagina de la que vino. Se guarda la
// primera vez en la pestaña para que no se pierda si navega antes de llenar.
const origen = (() => {
  try {
    const ya = JSON.parse(sessionStorage.getItem(LLAVE_ORIGEN) || 'null');
    if (ya) return ya;
  } catch { /* sin almacenamiento */ }
  const q = new URLSearchParams(window.location.search);
  const utm = {};
  for (const k of ['source', 'medium', 'campaign', 'content']) {
    const v = q.get(`utm_${k}`);
    if (v) utm[k] = v.slice(0, 100);
  }
  let referente = null;
  try {
    if (document.referrer && new URL(document.referrer).host !== window.location.host) {
      referente = document.referrer.slice(0, 300);
    }
  } catch { /* referrer raro */ }
  const o = { pagina: window.location.origin + window.location.pathname, referente, utm };
  try { sessionStorage.setItem(LLAVE_ORIGEN, JSON.stringify(o)); } catch { /* sin almacenamiento */ }
  return o;
})();

// El WhatsApp se escribe como sea; se guarda en formato internacional (+52...).
// 10 digitos en Mexico = celular sin lada de pais.
const whatsappE164 = (escrito, pais) => {
  let d = escrito.replace(/\D/g, '');
  if (d.startsWith('00')) d = d.slice(2);
  if (pais === 'MX') {
    if (d.length === 10) d = `52${d}`;
    else if (d.length === 13 && d.startsWith('521')) d = `52${d.slice(3)}`;
  } else if (pais === 'US' && d.length === 10) {
    d = `1${d}`;
  }
  return `+${d}`;
};

const form = document.getElementById('gn-reg');

if (form instanceof HTMLFormElement) {
  const estado = form.querySelector('.gn-reg__estado');
  const pais = form.elements.namedItem('pais');
  const enMx = form.querySelector('[data-solo="mx"]');
  const fuera = form.querySelector('[data-solo="fuera"]');
  const otroPais = form.querySelector('[data-solo="otro-pais"]');

  // México pide estado de la lista; fuera de México, estado o provincia escrito.
  const ajustarPais = () => {
    if (!(pais instanceof HTMLSelectElement)) return;
    const esMx = pais.value === 'MX';
    const esOtro = pais.value === 'XX';
    for (const [caja, ver] of [[enMx, esMx], [fuera, !esMx], [otroPais, esOtro]]) {
      if (!caja) continue;
      caja.hidden = !ver;
      const campo = caja.querySelector('input, select');
      if (campo) campo.required = ver;
    }
  };
  pais?.addEventListener('change', ajustarPais);
  ajustarPais();

  const decir = (texto) => { if (estado) estado.textContent = texto; };

  // Un id por envio: si se reintenta (doble toque, señal que se cae), es el
  // mismo y la base no lo duplica. Se cambia hasta que el registro se guarda.
  let envioId = nuevoId();

  // ── Aviso de privacidad ──
  const dialogo = document.getElementById('gn-aviso');
  const acepto = dialogo?.querySelector('[data-acepto]');
  const novedades = dialogo?.querySelector('[data-novedades]');
  const aceptar = dialogo?.querySelector('[data-aceptar-aviso]');
  const avisoEstado = form.querySelector('[data-aviso-estado]');
  const avisoLeer = form.querySelector('[data-abrir-aviso]');

  // Se recuerda en la pestaña para no preguntar dos veces; si el navegador no
  // deja guardar, se vuelve a preguntar y ya.
  let consentimiento = null;
  try {
    const guardado = JSON.parse(sessionStorage.getItem(LLAVE) || 'null');
    if (guardado?.aviso_version === AVISO.version) consentimiento = guardado;
  } catch { /* sin almacenamiento */ }

  let despues = null;
  let yaPreguntado = false;

  const pintarAviso = () => {
    if (!consentimiento) return;
    if (avisoEstado) avisoEstado.textContent = 'Ya aceptaste el aviso de privacidad.';
    if (avisoLeer) avisoLeer.textContent = 'Volver a leerlo';
  };
  pintarAviso();

  const pedirPermiso = (luego) => {
    if (consentimiento || !(dialogo instanceof HTMLDialogElement)) { luego?.(); return; }
    if (dialogo.open) return;
    yaPreguntado = true;
    despues = luego ?? null;
    if (acepto instanceof HTMLInputElement) acepto.checked = false;
    if (aceptar instanceof HTMLButtonElement) aceptar.disabled = true;
    dialogo.showModal();
  };

  acepto?.addEventListener('change', () => {
    if (aceptar instanceof HTMLButtonElement && acepto instanceof HTMLInputElement) aceptar.disabled = !acepto.checked;
  });
  dialogo?.querySelector('[data-cerrar-aviso]')?.addEventListener('click', () => dialogo.close('no'));

  dialogo?.addEventListener('close', () => {
    const luego = despues;
    despues = null;
    if (dialogo.returnValue !== 'si' || !(acepto instanceof HTMLInputElement) || !acepto.checked) return;
    // Releerlo y volver a aceptar conserva la fecha original; solo cambia lo de las novedades.
    consentimiento = {
      aviso_version: AVISO.version,
      aviso_url: AVISO.url,
      aceptado_en: consentimiento?.aceptado_en ?? new Date().toISOString(),
      mayor_de_edad: true,
      finalidades_necesarias: true,
      novedades: novedades instanceof HTMLInputElement && novedades.checked,
    };
    try { sessionStorage.setItem(LLAVE, JSON.stringify(consentimiento)); } catch { /* sin almacenamiento */ }
    pintarAviso();
    luego?.();
  });

  avisoLeer?.addEventListener('click', () => {
    if (!(dialogo instanceof HTMLDialogElement)) return;
    if (!consentimiento) { pedirPermiso(); return; }
    if (acepto instanceof HTMLInputElement) acepto.checked = true;
    if (novedades instanceof HTMLInputElement) novedades.checked = consentimiento.novedades;
    if (aceptar instanceof HTMLButtonElement) aceptar.disabled = false;
    dialogo.showModal();
  });

  const irAlFormulario = () => {
    const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById('apartar')?.scrollIntoView({ behavior: quieto ? 'auto' : 'smooth' });
    const primero = form.elements.namedItem('nombre');
    if (primero instanceof HTMLInputElement) primero.focus({ preventScroll: true });
  };

  // "Quiero entrar a la beta" (portada y barra): primero el aviso, luego al formulario.
  document.addEventListener('click', (e) => {
    const a = e.target instanceof Element ? e.target.closest('a[href="#apartar"]') : null;
    if (!a || consentimiento) return;
    e.preventDefault();
    pedirPermiso(irAlFormulario);
  });

  // Quien llega al formulario bajando con el dedo: se le pregunta al tocar el
  // primer campo, una sola vez. Si dice "Ahora no", puede llenar y se le vuelve
  // a pedir al enviar (sin eso, el foco que regresa al campo la reabriria).
  form.addEventListener('focusin', (e) => {
    if (consentimiento || yaPreguntado || e.target === avisoLeer) return;
    pedirPermiso();
  });

  const valor = (k) => String(new FormData(form).get(k) ?? '').trim();

  // Lo que vio la persona en la lista (para el WhatsApp), no el codigo.
  const textoDe = (k) => {
    const el = form.elements.namedItem(k);
    if (el instanceof HTMLSelectElement) return el.selectedOptions[0]?.textContent?.trim() ?? '';
    if (el instanceof RadioNodeList) {
      const marcado = [...el].find((x) => x instanceof HTMLInputElement && x.checked);
      return marcado?.parentElement?.textContent?.trim() ?? '';
    }
    return valor(k);
  };

  // El campo del registro que rechazó el CRM (`perfil.cabezas`) → el campo del
  // formulario que la persona puede corregir. Lo que no tiene campo visible
  // (id, consentimiento, origen) no se le puede pedir: cae a WhatsApp.
  const campoDelFormulario = (ruta) => {
    if (typeof ruta !== 'string') return null;
    const esMx = valor('pais') === 'MX';
    const nombre = {
      'contacto.nombre': 'nombre',
      'contacto.correo': 'correo',
      'contacto.whatsapp': 'whatsapp',
      'ubicacion.pais': 'pais',
      'ubicacion.pais_nombre': 'pais_otro',
      'ubicacion.estado': esMx ? 'estado' : 'provincia',
      'ubicacion.municipio': 'municipio',
      'perfil.ocupacion': 'ocupacion',
      'perfil.especialidad': 'especialidad',
      'perfil.cabezas': 'cabezas',
      'perfil.senal': 'senal',
      'perfil.equipo': 'equipo',
      'perfil.rancho': 'rancho',
      'perfil.medio': 'medio',
    }[ruta];
    const el = nombre ? form.elements.namedItem(nombre) : null;
    return el instanceof HTMLInputElement || el instanceof HTMLSelectElement ? el : null;
  };

  // El registro tal como lo pide registro.schema.json (version 1).
  const registro = () => {
    const p = valor('pais');
    return {
      version: 1,
      id: envioId,
      enviado_en: new Date().toISOString(),
      contacto: {
        nombre: valor('nombre'),
        correo: valor('correo').toLowerCase(),
        whatsapp: whatsappE164(valor('whatsapp'), p),
      },
      ubicacion: {
        pais: p,
        pais_nombre: p === 'XX' ? valor('pais_otro') : textoDe('pais'),
        estado: p === 'MX' ? valor('estado') : valor('provincia'),
        municipio: valor('municipio'),
      },
      perfil: {
        ocupacion: valor('ocupacion'),
        especialidad: valor('especialidad'),
        cabezas: valor('cabezas'),
        senal: valor('senal'),
        equipo: valor('equipo'),
        rancho: valor('rancho') || null,
        telefono: valor('sistema'),
        medio: valor('medio'),
      },
      consentimiento,
      origen,
    };
  };

  const mensajeWa = (r) => [
    'Hola, quiero entrar a la beta de Ganova.',
    `Nombre: ${r.contacto.nombre}`,
    `Correo: ${r.contacto.correo}`,
    `WhatsApp: ${r.contacto.whatsapp}`,
    `De: ${[r.ubicacion.municipio, r.ubicacion.estado, r.ubicacion.pais_nombre].filter(Boolean).join(', ')}`,
    `Me dedico a: ${textoDe('ocupacion')} (${textoDe('especialidad')})`,
    `Cabezas: ${textoDe('cabezas')}`,
    `Señal en el rancho: ${textoDe('senal')}`,
    `Cuántos más la usarían: ${textoDe('equipo')}`,
    r.perfil.rancho ? `Rancho: ${r.perfil.rancho}` : '',
    `Teléfono: ${textoDe('sistema')}`,
    `Me enteré por: ${textoDe('medio')}`,
    `Acepté el aviso de privacidad de la beta (versión ${AVISO.version}).`,
    `Novedades después de la beta: ${consentimiento?.novedades ? 'sí' : 'no'}`,
  ].filter(Boolean).join('\n');

  const abrirWa = (r) => {
    const base = form.dataset.wa || '';
    const sep = base.includes('?') ? '&' : '?';
    window.open(`${base}${sep}text=${encodeURIComponent(mensajeWa(r))}`, '_blank', 'noopener');
  };

  const marcar = (via) => {
    if (typeof window.gcTrack === 'function') {
      window.gcTrack('generate_lead', { method: via, where: 'ganova-formulario', page: window.location.pathname });
    }
  };

  form.addEventListener('input', (e) => {
    const t = e.target;
    if (t instanceof HTMLElement && t.getAttribute('aria-invalid') === 'true') t.removeAttribute('aria-invalid');
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    decir('');

    // La trampa: un bot la llena, una persona ni la ve. Se hace como que salio.
    const trampa = form.elements.namedItem('sitio_web');
    if (trampa instanceof HTMLInputElement && trampa.value) {
      decir('¡Listo! Ya tienes tu lugar apartado.');
      return;
    }

    // El WhatsApp se escribe como sea (con espacios, guiones o +52); lo que cuenta
    // es que traiga al menos los 10 dígitos de un número de México.
    const wa = form.elements.namedItem('whatsapp');
    if (wa instanceof HTMLInputElement) {
      const digitos = wa.value.replace(/\D/g, '').length;
      wa.setCustomValidity(wa.value && (digitos < 10 || digitos > 15) ? 'whatsapp' : '');
    }

    form.classList.add('is-revisado');
    let primero = null;
    for (const el of form.querySelectorAll('input, select')) {
      if (!(el instanceof HTMLInputElement || el instanceof HTMLSelectElement)) continue;
      const ok = el.checkValidity();
      if (el.type !== 'radio') {
        if (ok) el.removeAttribute('aria-invalid');
        else el.setAttribute('aria-invalid', 'true');
      }
      if (!ok && !primero) primero = el;
    }
    if (primero) {
      const avisos = {
        email: 'Revisa tu correo: parece que le falta algo.',
        tel: 'Revisa tu WhatsApp: escríbelo con lada, son 10 dígitos.',
      };
      decir((primero.value && avisos[primero.type]) || 'Te falta llenar un dato. Lo marcamos en el formulario.');
      primero.focus();
      return;
    }

    if (!consentimiento) {
      decir('Falta que aceptes el aviso de privacidad.');
      pedirPermiso(() => { decir(''); form.requestSubmit(); });
      return;
    }

    const r = registro();
    const endpoint = form.dataset.endpoint;
    if (!endpoint) {
      marcar('whatsapp');
      abrirWa(r);
      decir('Se abrió WhatsApp con tus datos. Nomás dale enviar y te apartamos lugar.');
      return;
    }

    const caerAWhatsapp = () => {
      marcar('whatsapp');
      abrirWa(r);
      decir('No pudimos guardarlo, así que abrimos WhatsApp con tus datos. Dale enviar ahí.');
    };

    const boton = form.querySelector('button[type="submit"]');
    boton?.setAttribute('disabled', '');
    decir('Enviando…');
    try {
      const captcha = valor('cf-turnstile-response') || null;
      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registro: r, captcha }),
      });
      const res = await resp.json().catch(() => ({}));

      if (resp.ok && res.ok) {
        // El CRM no dice si ya estaba registrado (a propósito): siempre "¡Listo!".
        marcar('formulario');
        form.reset();
        form.classList.remove('is-revisado');
        ajustarPais();
        window.turnstile?.reset?.();
        envioId = nuevoId();
        decir('¡Listo! Ya tienes tu lugar apartado. Te escribimos antes del 13 de noviembre.');
        return;
      }

      if (res.motivo === 'captcha') {
        window.turnstile?.reset?.();
        decir('No pudimos comprobar que no eres un robot. Espera un segundo y vuelve a enviar.');
        return;
      }

      // Un dato que el CRM rechazó y que la persona puede corregir: se marca.
      const campo = res.motivo === 'datos' ? campoDelFormulario(res.campo) : null;
      if (campo) {
        campo.setAttribute('aria-invalid', 'true');
        campo.focus();
        decir('Revisa tus datos: el campo marcado no se pudo guardar así.');
        return;
      }

      caerAWhatsapp();
    } catch {
      caerAWhatsapp();
    } finally {
      boton?.removeAttribute('disabled');
    }
  });
}
