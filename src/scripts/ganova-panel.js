/**
 * ganova-panel.js — el panel de aspirantes a la beta (/ganova/beta/panel/).
 *
 * Entra con Supabase Auth hablándole directo a su API (sin la librería: son tres
 * llamadas) y pide los datos a dos funciones de la base que solo contestan al
 * equipo: panel_beta_registros y panel_beta_decidir.
 *
 * TODO lo que viene de la base lo mandó gente desde un formulario público: se
 * pinta con textContent y atributos, NUNCA con innerHTML.
 */

// Lugares de la primera tanda de la beta (lo dice la página de Ganova).
const LUGARES = 40;
const LLAVE_SESION = 'gn-panel-sesion';

const raiz = document.getElementById('gp');

if (raiz) {
  const URL_SUPA = raiz.dataset.supabase;
  const ANON = raiz.dataset.llave;
  const ETQ = JSON.parse(raiz.dataset.etiquetas || '{}');
  const $ = (sel) => raiz.querySelector(sel);

  const vistaEntrar = $('[data-vista="entrar"]');
  const vistaPanel = $('[data-vista="panel"]');
  const formEntrar = $('[data-entrar]');
  const errorEntrar = $('[data-entrar-error]');
  const ficha = $('[data-ficha]');
  const aviso = $('[data-aviso]');

  // ── Pintar sin innerHTML ──
  const el = (tag, props = {}, ...hijos) => {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(props)) {
      if (v == null || v === false) continue;
      if (k === 'texto') n.textContent = v;
      else if (k === 'clase') n.className = v;
      else if (k.startsWith('on')) n.addEventListener(k.slice(2), v);
      else n.setAttribute(k, v === true ? '' : String(v));
    }
    for (const h of hijos.flat()) if (h != null) n.append(h);
    return n;
  };

  let avisoTimer = null;
  const avisar = (texto) => {
    aviso.textContent = texto;
    clearTimeout(avisoTimer);
    avisoTimer = setTimeout(() => { aviso.textContent = ''; }, 2600);
  };

  // ── Sesión ──
  const leerSesion = () => {
    try { return JSON.parse(localStorage.getItem(LLAVE_SESION) || 'null'); } catch { return null; }
  };
  const guardarSesion = (s) => { try { localStorage.setItem(LLAVE_SESION, JSON.stringify(s)); } catch { /* sin almacenamiento */ } };
  const borrarSesion = () => { try { localStorage.removeItem(LLAVE_SESION); } catch { /* sin almacenamiento */ } };
  let sesion = leerSesion();

  const auth = async (ruta, cuerpo, token) => {
    const r = await fetch(`${URL_SUPA}/auth/v1/${ruta}`, {
      method: 'POST',
      headers: { apikey: ANON, 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify(cuerpo ?? {}),
    });
    return r;
  };

  const tomarSesion = (j) => {
    sesion = {
      access_token: j.access_token,
      refresh_token: j.refresh_token,
      expires_at: j.expires_at ?? Math.floor(Date.now() / 1000) + (j.expires_in ?? 3600),
      correo: j.user?.email ?? sesion?.correo ?? '',
    };
    guardarSesion(sesion);
  };

  const renovar = async () => {
    if (!sesion?.refresh_token) throw new Error('sin_sesion');
    const r = await auth('token?grant_type=refresh_token', { refresh_token: sesion.refresh_token });
    if (!r.ok) throw new Error('sin_sesion');
    tomarSesion(await r.json());
  };

  const token = async () => {
    if (!sesion) throw new Error('sin_sesion');
    if (sesion.expires_at * 1000 - Date.now() < 60_000) await renovar();
    return sesion.access_token;
  };

  // Llama a una función de la base con la sesión del equipo. Si el token
  // venció entre medio, lo renueva una vez y reintenta.
  const rpc = async (nombre, params, reintento = true) => {
    const r = await fetch(`${URL_SUPA}/rest/v1/rpc/${nombre}`, {
      method: 'POST',
      headers: { apikey: ANON, Authorization: `Bearer ${await token()}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(params ?? {}),
    });
    if (r.status === 401 && reintento) { await renovar(); return rpc(nombre, params, false); }
    if (!r.ok) {
      const j = await r.json().catch(() => ({}));
      throw new Error(j.message === 'sin_acceso' || r.status === 403 ? 'sin_acceso' : (j.message || String(r.status)));
    }
    return r.json();
  };

  // ── Estado ──
  let registros = [];
  const filtro = { decision: 'pendiente', texto: '', estado: '', cabezas: '', senal: '', equipo: '', telefono: '' };

  const etq = (grupo, codigo) => ETQ[grupo]?.[codigo] ?? codigo ?? '';
  const lugar = (r) => [r.municipio, r.estado, r.pais !== 'MX' ? r.pais_nombre : null].filter(Boolean).join(', ');
  const hace = (iso) => {
    const min = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
    if (min < 1) return 'ahorita';
    if (min < 60) return `hace ${min} min`;
    const h = Math.round(min / 60);
    if (h < 24) return `hace ${h} h`;
    const d = Math.round(h / 24);
    if (d === 1) return 'ayer';
    if (d < 7) return `hace ${d} días`;
    return new Date(iso).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
  };
  const sinAcentos = (s) => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

  const pasaFiltros = (r, ignorarDecision = false) => {
    if (!ignorarDecision && filtro.decision && r.decision !== filtro.decision) return false;
    for (const k of ['estado', 'cabezas', 'senal', 'equipo', 'telefono']) {
      if (filtro[k] && r[k] !== filtro[k]) return false;
    }
    if (filtro.texto) {
      const q = sinAcentos(filtro.texto);
      const en = sinAcentos([r.nombre, r.correo, r.rancho, r.municipio, r.estado, r.whatsapp].join(' '));
      if (!en.includes(q)) return false;
    }
    return true;
  };

  // ── Resumen ──
  const pintarTiles = () => {
    const n = (f) => registros.filter(f).length;
    const tiles = [
      ['Registrados', registros.length, 'en total'],
      ['Escogidos', n((r) => r.decision === 'escogido'), `de ${LUGARES} lugares`],
      ['Por revisar', n((r) => r.decision === 'pendiente'), 'pendientes'],
      ['Sin señal', n((r) => r.senal === 'no_hay'), 'buenos para probar'],
      ['Con equipo', n((r) => r.equipo !== 'solo_yo'), 'más de un usuario'],
      ['Android / iPhone', `${n((r) => r.telefono === 'android')} / ${n((r) => r.telefono === 'iphone')}`, 'Android sale primero'],
    ];
    $('[data-tiles]').replaceChildren(...tiles.map(([k, v, s]) => el('div', { clase: 'gp-tile' },
      el('p', { clase: 'gp-tile__k', texto: k }),
      el('p', { clase: 'gp-tile__v', texto: String(v) }),
      el('p', { clase: 'gp-tile__s', texto: s }),
    )));
  };

  const pintarChips = () => {
    const opciones = [['', 'Todos'], ...Object.entries(ETQ.decision || {})];
    $('[data-chips]').replaceChildren(...opciones.map(([v, t]) => {
      const cuantos = registros.filter((r) => (!v || r.decision === v) && pasaFiltros(r, true)).length;
      return el('button', {
        type: 'button', clase: 'gp-chip', 'aria-pressed': String(filtro.decision === v), texto: `${t} · ${cuantos}`,
        onclick: () => { filtro.decision = v; pintar(); },
      });
    }));
  };

  // Las listas de los filtros: las fijas salen de las etiquetas; los estados,
  // de los que de veras llegaron.
  const llenarSelects = () => {
    const llenar = (k, pares) => {
      const s = raiz.querySelector(`[data-filtro="${k}"]`);
      const primero = s.options[0];
      s.replaceChildren(primero, ...pares.map(([v, t]) => el('option', { value: v, texto: t })));
      s.value = filtro[k] && pares.some(([v]) => v === filtro[k]) ? filtro[k] : '';
      filtro[k] = s.value;
    };
    const estados = [...new Set(registros.map((r) => r.estado).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'es'));
    llenar('estado', estados.map((e) => [e, e]));
    llenar('cabezas', Object.entries(ETQ.cabezas || {}));
    llenar('senal', Object.entries(ETQ.senal || {}));
    llenar('equipo', Object.entries(ETQ.equipo || {}));
  };

  // ── Decidir ──
  const botonesDecidir = (r) => el('div', { clase: 'gp-decidir', role: 'group', 'aria-label': `Decisión sobre ${r.nombre}` },
    [['escogido', 'Escoger'], ['en_espera', 'En espera'], ['descartado', 'Descartar']].map(([v, t]) => el('button', {
      type: 'button', 'data-valor': v, 'aria-pressed': String(r.decision === v), texto: t,
      // Tocar la que ya está marcada la regresa a "por revisar".
      onclick: () => decidir(r.id, r.decision === v ? 'pendiente' : v),
    })),
  );

  const guardar = async (id, cambio, mensaje) => {
    const i = registros.findIndex((x) => x.id === id);
    if (i < 0) return;
    const antes = registros[i];
    registros[i] = { ...antes, ...cambio };
    pintar();
    if (ficha.open && ficha.dataset.id === id) pintarFicha(registros[i]);
    try {
      const nuevo = await rpc('panel_beta_decidir', { registro: id, decision: cambio.decision ?? null, notas: cambio.notas ?? null });
      registros[i] = nuevo;
      avisar(mensaje);
    } catch (e) {
      if (e.message === 'sin_acceso' || e.message === 'sin_sesion') return salir('Tu sesión se cerró. Vuelve a entrar.');
      registros[i] = antes;
      avisar('No se guardó. Revisa tu internet e intenta otra vez.');
    }
    pintar();
    if (ficha.open && ficha.dataset.id === id) pintarFicha(registros[i]);
  };

  const decidir = (id, decision) => guardar(id, { decision }, decision === 'pendiente' ? 'Regresó a por revisar' : `Guardado: ${etq('decision', decision)}`);

  // ── Lista ──
  const pintarLista = () => {
    const visibles = registros.filter((r) => pasaFiltros(r));
    $('[data-cuantos]').textContent = `Mostrando ${visibles.length} de ${registros.length}. Lo que marques aquí se guarda en la base y le llega solo al CRM.`;
    const vacio = $('[data-vacio]');
    vacio.hidden = visibles.length > 0;
    vacio.textContent = registros.length ? 'Nadie con esos filtros.' : 'Todavía no se registra nadie.';
    $('[data-lista]').replaceChildren(...visibles.map((r) => el('li', { clase: 'gp-fila' },
      el('button', { type: 'button', clase: 'gp-fila__abrir', onclick: () => abrirFicha(r.id) },
        el('span', { clase: 'gp-fila__nombre', texto: r.nombre }),
        el('span', { clase: 'gp-fila__sub', texto: [r.rancho || 'Sin nombre de rancho', etq('ocupacion', r.ocupacion)].join(' · ') }),
      ),
      el('span', { clase: 'gp-fila__dato', 'data-k': 'De dónde', texto: lugar(r) }),
      el('span', { clase: 'gp-fila__dato', 'data-k': 'Cabezas', texto: etq('cabezas', r.cabezas) }),
      el('span', { clase: 'gp-fila__dato', 'data-k': 'Señal' }, el('span', { clase: `gp-senal gp-senal--${r.senal}`, texto: etq('senal', r.senal) })),
      el('span', { clase: 'gp-fila__dato', 'data-k': 'Más usuarios', texto: etq('equipo', r.equipo) }),
      el('span', { clase: 'gp-fila__dato', 'data-k': 'Teléfono', texto: r.telefono === 'iphone' ? 'iPhone' : 'Android' }),
      el('span', { clase: 'gp-fila__dato gp-fila__llego', 'data-k': 'Llegó', texto: hace(r.recibido_en) }),
      el('div', { clase: 'gp-decidir-celda' }, botonesDecidir(r)),
    )));
  };

  const pintar = () => { pintarTiles(); pintarChips(); pintarLista(); };

  // ── Ficha ──
  const pintarFicha = (r) => {
    ficha.dataset.id = r.id;
    const notas = el('textarea', { rows: 3, id: 'gp-notas' });
    notas.value = r.notas ?? '';
    const digitos = String(r.whatsapp || '').replace(/\D/g, '');
    const fila = (k, v) => el('div', {}, el('dt', { texto: k }), el('dd', {}, v));
    ficha.replaceChildren(
      el('div', { clase: 'gp-ficha__cabeza' },
        el('div', {},
          el('h2', { clase: 'gp-ficha__h2', id: 'gp-ficha-nombre', texto: r.nombre }),
          el('p', { clase: 'gp-ficha__sub', texto: `${r.rancho ? `Rancho ${r.rancho} · ` : ''}llegó ${hace(r.recibido_en)} por ${etq('medio', r.medio)}` }),
        ),
        el('button', { type: 'button', clase: 'gp-ficha__cerrar', 'aria-label': 'Cerrar', texto: '×', onclick: () => ficha.close() }),
      ),
      el('div', { clase: 'gp-ficha__cuerpo' },
        el('div', { clase: 'gp-ficha__chips' },
          el('span', { texto: etq('cabezas', r.cabezas) }),
          el('span', { texto: etq('senal', r.senal) }),
          el('span', { texto: `Más usuarios: ${etq('equipo', r.equipo)}` }),
          el('span', { texto: r.telefono === 'iphone' ? 'iPhone' : 'Android' }),
        ),
        el('dl', {},
          fila('Se dedica a', `${etq('ocupacion', r.ocupacion)} · ${etq('especialidad', r.especialidad)}`),
          fila('De', lugar(r)),
          fila('Correo', el('a', { href: `mailto:${r.correo}`, texto: r.correo })),
          fila('WhatsApp', r.whatsapp),
          fila('Novedades', r.novedades ? 'Sí quiere' : 'No'),
          r.utm_campaign || r.utm_source ? fila('Anuncio', [r.utm_source, r.utm_campaign].filter(Boolean).join(' · ')) : null,
          fila('Aviso aceptado', `versión ${r.aviso_version}`),
        ),
        el('a', { clase: 'gp-ficha__wa', href: `https://wa.me/${digitos}`, target: '_blank', rel: 'noopener', texto: 'Escribirle por WhatsApp' }),
        el('label', { clase: 'gp-ficha__notas', for: 'gp-notas' }, 'Notas', notas),
        el('button', {
          type: 'button', clase: 'gp-btn gp-btn--olivo gp-ficha__guardar', texto: 'Guardar nota',
          onclick: () => guardar(r.id, { notas: notas.value }, notas.value.trim() ? 'Nota guardada' : 'Nota borrada'),
        }),
      ),
      el('div', { clase: 'gp-ficha__pie' }, el('p', { texto: `Decisión: ${etq('decision', r.decision)}` }), botonesDecidir(r)),
    );
  };

  const abrirFicha = (id) => {
    const r = registros.find((x) => x.id === id);
    if (!r) return;
    pintarFicha(r);
    ficha.showModal();
  };
  ficha.addEventListener('click', (e) => { if (e.target === ficha) ficha.close(); });

  // ── Filtros ──
  raiz.querySelectorAll('[data-filtro]').forEach((c) => {
    c.addEventListener('input', () => { filtro[c.dataset.filtro] = c.value.trim(); pintar(); });
  });

  // ── Entrar, cargar y salir ──
  const mostrar = (cual) => {
    vistaEntrar.hidden = cual !== 'entrar';
    vistaPanel.hidden = cual !== 'panel';
  };

  const cargar = async () => {
    const boton = $('[data-actualizar]');
    boton.disabled = true;
    try {
      registros = await rpc('panel_beta_registros', {});
      $('[data-quien]').textContent = sesion?.correo ? `${sesion.correo} · equipo de Geck Codex` : 'Equipo de Geck Codex';
      llenarSelects();
      pintar();
      mostrar('panel');
    } catch (e) {
      if (e.message === 'sin_acceso') return salir('Tu cuenta no tiene acceso al panel.');
      if (e.message === 'sin_sesion') return salir('');
      mostrar(vistaPanel.hidden ? 'entrar' : 'panel');
      if (vistaPanel.hidden) errorEntrar.textContent = 'No se pudo cargar. Revisa tu internet.';
      else avisar('No se pudo actualizar. Revisa tu internet.');
    } finally {
      boton.disabled = false;
    }
  };

  async function salir(mensaje) {
    const t = sesion?.access_token;
    sesion = null;
    borrarSesion();
    registros = [];
    if (ficha.open) ficha.close();
    if (t) auth('logout', {}, t).catch(() => {});
    errorEntrar.textContent = mensaje || '';
    mostrar('entrar');
  }

  formEntrar.addEventListener('submit', async (e) => {
    e.preventDefault();
    const datos = new FormData(formEntrar);
    const correo = String(datos.get('correo') || '').trim();
    const contrasena = String(datos.get('contrasena') || '');
    if (!correo || !contrasena) { errorEntrar.textContent = 'Escribe tu correo y tu contraseña.'; return; }
    const boton = formEntrar.querySelector('button[type="submit"]');
    boton.disabled = true;
    errorEntrar.textContent = '';
    try {
      const r = await auth('token?grant_type=password', { email: correo, password: contrasena });
      if (!r.ok) { errorEntrar.textContent = 'Correo o contraseña incorrectos.'; return; }
      tomarSesion(await r.json());
      formEntrar.reset();
      await cargar();
    } catch {
      errorEntrar.textContent = 'No se pudo entrar. Revisa tu internet.';
    } finally {
      boton.disabled = false;
    }
  });

  $('[data-actualizar]').addEventListener('click', cargar);
  $('[data-salir]').addEventListener('click', () => salir(''));

  if (sesion) cargar(); else mostrar('entrar');
}
