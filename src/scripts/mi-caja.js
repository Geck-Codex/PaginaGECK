/**
 * mi-caja.js — lo que se mueve en /mi-caja/.
 *
 * La idea que manda (usuario, 2026-11-07): Mi Caja es como una muñeca con su
 * ropa. La base no cambia; las piezas se ponen, se quitan y se ajustan. Aqui
 * hay un solo motor para eso, `vestir(maq, piezas)`: compara lo que hay en
 * cada ranura con lo que debe haber y decide el movimiento:
 *   - ranura vacia que se llena  → la pieza cae y rebota al encajar
 *   - pieza que se va            → se marca en rojo si se QUITA, y sale volando
 *   - otra pieza del mismo grupo → se voltea (es la misma pieza, ajustada)
 *   - pieza distinta             → sale la vieja y cae la nueva
 * Lo usan la portada (rota sola por giros) y "Se arma" (avanza con el scroll).
 *
 * Con `prefers-reduced-motion` los cambios son instantaneos y la portada no
 * rota sola; los chips y el scroll siguen funcionando.
 */

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const datosEl = document.getElementById('mc-datos');
const D = datosEl ? JSON.parse(datosEl.textContent || '{}') : null;

/* ── Contactos: cada WhatsApp con `data-lead` cuenta como lead ── */
document.addEventListener('click', (e) => {
  const a = e.target instanceof Element ? e.target.closest('a[data-lead]') : null;
  if (!a || typeof window.gcTrack !== 'function') return;
  window.gcTrack('generate_lead', {
    method: 'whatsapp',
    where: `mi-caja-${a.getAttribute('data-lead')}`,
    page: window.location.pathname,
  });
});

const NS = 'http://www.w3.org/2000/svg';
const azar = (a, b) => a + Math.random() * (b - a);

function crearPieza(p, color) {
  const t = document.createElement('div');
  t.className = 'mc-tile';
  t.dataset.id = p.id;
  if (p.g) t.dataset.g = p.g;
  t.style.setProperty('--c', color || p.c);
  const ic = document.createElement('span');
  ic.className = 'mc-tile__ic';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  const path = document.createElementNS(NS, 'path');
  path.setAttribute('d', D.ic[p.ic] || '');
  svg.appendChild(path);
  ic.appendChild(svg);
  const k = document.createElement('span');
  k.className = 'mc-tile__k';
  k.textContent = p.k;
  t.append(ic, k);
  return t;
}

/* Golpecito de la base cuando una pieza encaja. */
function golpe(maq) {
  if (reduce) return;
  const base = maq.querySelector('.mc-app');
  base?.animate(
    [{ transform: 'none' }, { transform: 'translateY(3px) scale(0.995)' }, { transform: 'none' }],
    { duration: 260, easing: 'ease-out' },
  );
}

function entra(t, retraso, maq) {
  if (reduce) return;
  const a = t.animate(
    [
      { transform: `translateY(-140px) rotate(${azar(-14, 14)}deg) scale(0.9)`, opacity: 0 },
      { transform: 'translateY(8px) rotate(0) scale(1.02)', opacity: 1, offset: 0.62 },
      { transform: 'translateY(-4px) scale(0.99)', offset: 0.82 },
      { transform: 'none', opacity: 1 },
    ],
    { duration: 640, delay: retraso, easing: 'cubic-bezier(0.3, 0.7, 0.4, 1)', fill: 'backwards' },
  );
  a.finished.then(() => golpe(maq)).catch(() => {});
}

function sale(t, retraso, quitar) {
  if (reduce) { t.remove(); return Promise.resolve(); }
  if (quitar) t.classList.add('is-quitando');
  const lado = Math.random() < 0.5 ? -1 : 1;
  const pausa = quitar ? 380 : 0;
  const a = t.animate(
    [
      { transform: 'none', opacity: 1 },
      { transform: 'translateY(-14px) scale(1.04)', opacity: 1, offset: 0.25 },
      { transform: `translate(${lado * azar(120, 220)}px, ${azar(-180, -90)}px) rotate(${lado * azar(25, 60)}deg) scale(0.7)`, opacity: 0 },
    ],
    { duration: 560, delay: retraso + pausa, easing: 'cubic-bezier(0.5, 0, 0.75, 0)', fill: 'forwards' },
  );
  return a.finished.then(() => t.remove()).catch(() => t.remove());
}

function voltea(viejo, nueva) {
  if (reduce) { viejo.replaceWith(nueva); return; }
  const fuera = viejo.animate(
    [{ transform: 'rotateY(0)' }, { transform: 'rotateY(90deg)' }],
    { duration: 260, easing: 'ease-in', fill: 'forwards' },
  );
  fuera.finished.then(() => {
    viejo.replaceWith(nueva);
    nueva.animate(
      [{ transform: 'rotateY(-90deg)' }, { transform: 'rotateY(12deg)', offset: 0.7 }, { transform: 'none' }],
      { duration: 420, easing: 'ease-out' },
    );
  }).catch(() => viejo.replaceWith(nueva));
}

/* ── La pantalla de la app sigue a las piezas ─────────────────────────────
   Cada pieza puesta mete su seccion en el menu lateral (despues de Venta,
   como en la app) y/o su forma de pago; la que se quita, se va. `items` es
   [{ id, c }] con lo que hay puesto. */
function crecer(el, eje) {
  if (reduce) return;
  if (eje === 'alto') {
    const h = el.offsetHeight;
    el.animate(
      [{ height: '0px', opacity: 0, paddingTop: '0px', paddingBottom: '0px' }, { height: `${h}px`, opacity: 1 }],
      { duration: 380, easing: 'cubic-bezier(0.3, 0.8, 0.3, 1)' },
    );
  } else {
    el.animate([{ transform: 'scale(0)', opacity: 0 }, { transform: 'scale(1.15)', opacity: 1, offset: 0.7 }, { transform: 'none' }],
      { duration: 420, easing: 'ease-out' });
  }
  el.classList.add('is-nuevo');
  setTimeout(() => el.classList.remove('is-nuevo'), 1100);
}
function encoger(el, eje) {
  el.classList.add('is-saliendo');
  if (reduce) { el.remove(); return; }
  const k = eje === 'alto'
    ? [{ height: `${el.offsetHeight}px`, opacity: 1 }, { height: '0px', opacity: 0, paddingTop: '0px', paddingBottom: '0px' }]
    : [{ transform: 'none', opacity: 1 }, { transform: 'scale(0)', opacity: 0 }];
  el.animate(k, { duration: 300, easing: 'ease-in', fill: 'forwards' }).finished
    .then(() => el.remove()).catch(() => el.remove());
}
function pantalla(maq, items) {
  const menu = maq.querySelector('[data-menu]');
  const pagos = maq.querySelector('[data-pagos]');
  if (!menu || !pagos || !D.mod) return;
  const quiere = new Map(items.map((x) => [x.id, x.c]));

  menu.querySelectorAll('[data-m]:not(.is-saliendo)').forEach((li) => {
    if (!quiere.has(li.dataset.m) || !D.mod[li.dataset.m]?.menu) encoger(li, 'alto');
  });
  pagos.querySelectorAll('[data-p]:not(.is-saliendo)').forEach((li) => {
    if (!quiere.has(li.dataset.p) || !D.mod[li.dataset.p]?.pago) encoger(li, 'ancho');
  });

  const antesDe = menu.querySelector('[data-base]');
  quiere.forEach((c, id) => {
    const m = D.mod[id];
    if (!m) return;
    if (m.menu && !menu.querySelector(`[data-m="${id}"]:not(.is-saliendo)`)) {
      const li = document.createElement('li');
      li.className = 'mc-app__item is-pieza';
      li.dataset.m = id;
      const svg = document.createElementNS(NS, 'svg');
      svg.setAttribute('viewBox', '0 0 24 24');
      const path = document.createElementNS(NS, 'path');
      path.setAttribute('d', D.ic[m.menu[1]] || '');
      svg.appendChild(path);
      const sp = document.createElement('span');
      sp.textContent = m.menu[0];
      li.append(svg, sp);
      menu.insertBefore(li, antesDe);
      crecer(li, 'alto');
    }
    if (m.pago && !pagos.querySelector(`[data-p="${id}"]:not(.is-saliendo)`)) {
      const li = document.createElement('li');
      li.className = 'is-pieza';
      li.dataset.p = id;
      li.style.setProperty('--pc', c);
      li.textContent = m.pago;
      pagos.appendChild(li);
      crecer(li, 'ancho');
    }
  });
}

/**
 * Viste una base: `piezas` es un arreglo por ranura de { p, c } o null.
 * `quitar` marca en rojo las piezas que se van sin reemplazo.
 */
function vestir(maq, piezas) {
  const slots = Array.from(maq.querySelectorAll('[data-slots] > .mc-slot'));
  let n = 0;
  slots.forEach((slot, i) => {
    const actual = slot.querySelector('.mc-tile:not(.is-saliendo)');
    const quiere = piezas[i] || null;
    const idActual = actual?.dataset.id || null;
    if (idActual === (quiere?.p.id || null)) return;

    const nueva = quiere ? crearPieza(quiere.p, quiere.c) : null;
    const retraso = n++ * 90;

    if (actual && nueva && actual.dataset.g && actual.dataset.g === quiere.p.g) {
      voltea(actual, nueva);
      return;
    }
    if (actual) {
      actual.classList.add('is-saliendo');
      sale(actual, retraso, !nueva);
    }
    if (nueva) {
      slot.appendChild(nueva);
      entra(nueva, retraso + (actual ? 240 : 0), maq);
    }
  });
  const items = piezas.filter(Boolean).map((x) => ({ id: x.p.id, c: x.c || x.p.c }));
  setTimeout(() => pantalla(maq, items), reduce ? 0 : 420);
}

/* ── La palabra que cambia ─────────────────────────────────────────────── */
function letras(texto) {
  const w = document.createElement('span');
  w.className = 'mc-rot__w';
  for (const ch of texto) {
    const l = document.createElement('span');
    l.className = 'mc-l';
    l.textContent = ch;
    w.appendChild(l);
  }
  return w;
}

function cambiarPalabra(rot, texto) {
  /* Si un cambio anterior no ha terminado (p. ej. se pico un negocio justo
     cuando iba a cambiar solo), se cierra de golpe antes de empezar: queda
     una sola palabra, la mas nueva, y nunca se juntan dos. */
  clearTimeout(rot._fin);
  const previas = Array.from(rot.querySelectorAll('.mc-rot__w'));
  const vieja = previas[previas.length - 1];
  if (!vieja) return;
  previas.slice(0, -1).forEach((w) => w.remove());
  vieja.getAnimations({ subtree: true }).forEach((a) => a.cancel());
  vieja.classList.remove('mc-rot__w--abs');
  rot.style.width = '';
  if (vieja.textContent === texto) return;

  const nueva = letras(texto);
  if (reduce) { vieja.replaceWith(nueva); return; }

  rot.style.width = `${vieja.getBoundingClientRect().width}px`;
  nueva.classList.add('mc-rot__w--abs');
  rot.appendChild(nueva);
  const ancho = nueva.getBoundingClientRect().width;
  requestAnimationFrame(() => { rot.style.width = `${ancho}px`; });

  vieja.classList.add('mc-rot__w--abs', 'is-saliendo');
  Array.from(vieja.children.length ? vieja.children : [vieja]).forEach((l, i) => {
    l.animate([{ transform: 'none', opacity: 1 }, { transform: 'translateY(-110%) rotate(-8deg)', opacity: 0 }],
      { duration: 320, delay: i * 18, easing: 'cubic-bezier(0.5, 0, 0.75, 0)', fill: 'forwards' });
  });
  const ls = Array.from(nueva.children);
  ls.forEach((l, i) => {
    l.animate([{ transform: 'translateY(110%) rotate(8deg)', opacity: 0 }, { transform: 'none', opacity: 1 }],
      { duration: 460, delay: 140 + i * 26, easing: 'cubic-bezier(0.2, 0.9, 0.3, 1.2)', fill: 'backwards' });
  });
  rot._fin = setTimeout(() => {
    vieja.remove();
    nueva.classList.remove('mc-rot__w--abs');
    rot.style.width = '';
  }, 160 + ls.length * 26 + 480);
}

/* El ticket de la pantalla tambien es del giro: renglones nuevos y total. */
function cambiarTicket(maq, tk) {
  const box = maq.querySelector('[data-ticket]');
  const total = maq.querySelector('[data-venta]');
  if (!box || !tk) return;
  const poner = () => {
    box.getAnimations().forEach((x) => x.cancel());
    box.replaceChildren(...tk.rows.map(([q, p]) => {
      const r = document.createElement('p');
      r.className = 'mc-app__renglon';
      const a = document.createElement('span'); a.textContent = q;
      const b = document.createElement('span'); b.textContent = p;
      r.append(a, b);
      return r;
    }));
    if (total) total.textContent = tk.total;
    if (!reduce) {
      Array.from(box.children).forEach((r, k) => r.animate(
        [{ opacity: 0, transform: 'translateX(-10px)' }, { opacity: 1, transform: 'none' }],
        { duration: 300, delay: k * 90, easing: 'ease-out', fill: 'backwards' },
      ));
      total?.animate([{ transform: 'scale(1.18)' }, { transform: 'none' }], { duration: 420, delay: 300, easing: 'ease-out' });
    }
  };
  if (reduce) { poner(); return; }
  box.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 180, fill: 'forwards' }).finished.then(poner).catch(poner);
}

/* ── Cambiar de seccion en la pantalla ─────────────────────────────────────
   Como en la app: se marca el boton del menu (blanco, texto azul) y se ve su
   vista. Cada pieza tiene la suya: las fieles (Apartados, Vales, el fiado en
   Clientes) y las de concepto (Mesas, Comandas, Citas, Bascula); las demas
   caen en la generica, "se arma a la medida". */
const VISTA = {
  apartados: 'apartados', vales: 'vales', fiado: 'clientes', fiado2: 'clientes',
  mesas: 'mesas', comandas: 'comandas', llevar: 'comandas', propinas: 'mesas',
  citas: 'citas', servicios: 'citas', kilo: 'bascula', granel: 'bascula', cortes: 'cortes',
  tallas: 'tallas', talla: 'tallas', caduca: 'caducidades', cotiza: 'cotizaciones',
  mayoreo: 'mayoreo', paquete: 'mayoreo', paquete2: 'mayoreo', metro: 'metro',
  copias: 'copias', listas: 'listas', receta: 'receta', comision: 'comision',
};
const TITULO = {
  venta: 'Venta', caja: 'Caja', corte: 'Caja', productos: 'Productos', reportes: 'Reportes',
  clientes: 'Clientes', apartados: 'Apartados', vales: 'Vales', mesas: 'Mesas',
  comandas: 'Comandas', citas: 'Citas', bascula: 'Báscula', tallas: 'Tallas',
  caducidades: 'Caducidades', cotizaciones: 'Cotizaciones', mayoreo: 'Mayoreo', metro: 'Por metro',
  copias: 'Copias', listas: 'Listas escolares', cortes: 'Cortes', receta: 'Con receta', comision: 'Comisiones',
};
const vistaDe = (id) => VISTA[id] || 'generica';

function mostrar(maq, vista, piezaId) {
  const app = maq.querySelector('[data-app]');
  if (!app) return;
  const destino = app.querySelector(`[data-vista="${vista}"]`);
  if (!destino) return;
  app.querySelectorAll('[data-vista].is-activa').forEach((v) => { if (v !== destino) v.classList.remove('is-activa'); });
  destino.classList.add('is-activa');

  const etiqueta = piezaId ? D.mod?.[piezaId]?.menu?.[0] : null;
  const titulo = app.querySelector('[data-titulo]');
  if (titulo) titulo.textContent = vista === 'generica' ? (etiqueta || 'Tu pieza') : TITULO[vista] || 'Venta';
  const gen = app.querySelector('[data-generica]');
  if (gen && vista === 'generica') gen.textContent = etiqueta || 'Tu pieza';

  /* El boton que se marca: el de la pieza si tiene seccion; si no, el de su
     vista (el fiado vive en Clientes; el corte, en Caja). */
  let boton = piezaId ? app.querySelector(`[data-m="${piezaId}"]:not(.is-saliendo)`) : null;
  if (!boton) boton = app.querySelector(`[data-v="${vista === 'corte' ? 'caja' : vista}"]`);
  app.querySelectorAll('.mc-app__item.is-activo').forEach((b) => { if (b !== boton) b.classList.remove('is-activo'); });
  if (boton) {
    boton.classList.add('is-activo');
    /* Que el boton activo se vea aunque el menu este lleno. */
    const menu = boton.parentElement;
    if (menu && menu.scrollHeight > menu.clientHeight) {
      const top = Math.max(0, boton.offsetTop - menu.clientHeight / 2 + boton.offsetHeight / 2);
      menu.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
    }
    if (!reduce) boton.animate([{ transform: 'scale(0.86)' }, { transform: 'scale(1.06)' }, { transform: 'none' }], { duration: 360, easing: 'ease-out' });
  }
}

/* La pieza que mejor se luce: primero las que tienen vista propia. */
const piezaVistosa = (ids) => ids.find((id) => VISTA[id]) || ids[0];

/* ── Portada: rota sola por los giros ─────────────────────────────────────
   Cada giro: la palabra cambia, caen sus piezas y la pantalla muestra la Venta
   con el ticket de ese negocio; luego brinca a la seccion de su pieza. */
function portada() {
  const hero = document.querySelector('[data-hero]');
  if (!hero || !D) return;
  const maq = hero.querySelector('[data-maq="hero"]');
  const nombre = hero.querySelector('[data-nombre]');
  const chips = Array.from(hero.querySelectorAll('[data-giro]'));
  const rots = Array.from(document.querySelectorAll('[data-rot]'));
  let i = 0;
  let timer = 0;
  let brinco = 0;
  let visible = true;
  const cubo = hero.querySelector('[data-cubo]');
  const piezaRot = hero.querySelector('[data-pieza-rot]');
  let paso = 0;
  /* La caja gira un cuarto de vuelta por negocio: antes de girar se escribe
     el negocio nuevo en la cara que va a quedar al frente. */
  const girar = (g) => {
    if (!cubo) return;
    paso += 1;
    const cara = cubo.querySelector(`[data-cara="${paso % 4}"] [data-cara-giro]`);
    if (cara) cara.textContent = g.t;
    cubo.style.setProperty('--ry', `${-paso * 90}deg`);
  };
  /* El boleto oscuro dice la pieza del negocio, con un cambio vertical. */
  const ponerPieza = (texto) => {
    if (!piezaRot || piezaRot.textContent === texto) return;
    if (reduce) { piezaRot.textContent = texto; return; }
    piezaRot.animate([{ transform: 'none', opacity: 1 }, { transform: 'translateY(-40%)', opacity: 0 }], { duration: 220, easing: 'ease-in', fill: 'forwards' })
      .finished.then(() => {
        piezaRot.textContent = texto;
        piezaRot.animate([{ transform: 'translateY(40%)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 380, easing: 'cubic-bezier(0.2, 0.9, 0.3, 1.2)', fill: 'forwards' });
      }).catch(() => { piezaRot.textContent = texto; });
  };

  const ir = (k) => {
    i = (k + D.giros.length) % D.giros.length;
    const g = D.giros[i];
    hero.style.setProperty('--gc', g.c);
    rots.forEach((r) => cambiarPalabra(r, g.t));
    if (nombre) nombre.textContent = `· ${g.t}`;
    chips.forEach((c, j) => c.setAttribute('aria-pressed', String(j === i)));
    mostrar(maq, 'venta');
    vestir(maq, g.piezas.map((p) => ({ p, c: g.c })));
    cambiarTicket(maq, D.tickets?.[i]);
    girar(g);
    ponerPieza(g.piezas[0].k);
    clearTimeout(brinco);
    const id = piezaVistosa(g.piezas.map((p) => p.id));
    brinco = setTimeout(() => mostrar(maq, vistaDe(id), id), reduce ? 0 : 1900);
  };

  const programar = (espera = 4600) => {
    clearTimeout(timer);
    if (reduce || !visible || document.hidden) return;
    timer = setTimeout(() => { ir(i + 1); programar(); }, espera);
  };

  chips.forEach((c, j) => c.addEventListener('click', () => { ir(j); programar(7000); }));

  /* El primer giro tambien brinca a su pieza. */
  const id0 = piezaVistosa(D.giros[0].piezas.map((p) => p.id));
  brinco = setTimeout(() => mostrar(maq, vistaDe(id0), id0), reduce ? 0 : 1600);

  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible) programar(3200); else clearTimeout(timer);
  }).observe(hero);
  document.addEventListener('visibilitychange', () => programar(3200));
}

/* ── "De fábrica": se toca una cosa de la lista y la pantalla cambia ──────
   Avanza sola mientras se ve, hasta que el visitante toca una. Sin scroll
   fijo (el usuario lo rechazo). */
function fabrica() {
  const sec = document.querySelector('[data-fabrica]');
  if (!sec) return;
  const maq = sec.querySelector('[data-maq="fabrica"]');
  const capturas = sec.querySelector('[data-capturas]');
  const btns = Array.from(sec.querySelectorAll('[data-ver]'));
  const pags = Array.from(sec.querySelectorAll('[data-pag]'));
  let i = 0;
  let timer = 0;
  let visible = false;
  let tocado = false;
  const ir = (k) => {
    i = (k + btns.length) % btns.length;
    btns.forEach((b, j) => b.setAttribute('aria-pressed', String(j === i)));
    pags.forEach((p, j) => p.classList.toggle('is-activo', j === i));
    const vista = btns[i].dataset.ver;
    if (capturas) {
      capturas.querySelectorAll('img[data-vista]').forEach((im) => im.classList.toggle('is-activa', im.dataset.vista === vista));
    } else if (maq) {
      mostrar(maq, vista);
    }
  };
  const seguir = () => {
    clearTimeout(timer);
    if (reduce || tocado || !visible || document.hidden) return;
    timer = setTimeout(() => { ir(i + 1); seguir(); }, 4500);
  };
  btns.forEach((b, j) => b.addEventListener('click', () => { tocado = true; clearTimeout(timer); ir(j); }));
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; seguir(); }, { threshold: 0.35 }).observe(sec);
  ir(0);
}

/* ── "Ármalo tú": el visitante encaja las piezas ──────────────────────────
   Tocar una ficha de la charola la hace volar a la primera ranura libre (FLIP:
   nace en la ranura y se anima desde donde estaba la ficha). Tocarla en la
   base, o tocar otra vez su ficha, la regresa. Lo armado viaja en el mensaje
   de WhatsApp. */
function armalo() {
  const sec = document.querySelector('[data-juega]');
  if (!sec || !D) return;
  const maq = sec.querySelector('[data-maq="juega"]');
  const slots = Array.from(maq.querySelectorAll('[data-slots] > .mc-slot'));
  const fichas = Array.from(sec.querySelectorAll('[data-pieza]'));
  const aviso = sec.querySelector('[data-aviso]');
  const waBtn = sec.querySelector('[data-wa-armado]');
  const porId = Object.fromEntries(D.charola.map((p) => [p.id, p]));
  const enBase = () => slots.map((s) => s.querySelector('.mc-tile:not(.is-saliendo)')?.dataset.id).filter(Boolean);

  const actualizar = (espera = 0, nueva = null) => {
    const ids = enBase();
    setTimeout(() => {
      pantalla(maq, ids.map((id) => ({ id, c: porId[id].c })));
      const ver = nueva || ids[ids.length - 1];
      setTimeout(() => (ver ? mostrar(maq, vistaDe(ver), ver) : mostrar(maq, 'venta')), reduce ? 0 : 160);
    }, reduce ? 0 : espera);
    const nombres = ids.map((id) => porId[id].k);
    if (aviso) {
      aviso.textContent = ids.length === 0
        ? 'Toca una pieza de la charola.'
        : ids.length === slots.length
          ? 'Ya llenaste la muestra. En tu negocio van todas las que ocupes.'
          : `Tu punto de venta lleva: ${nombres.join(', ')}.`;
    }
    if (waBtn) {
      const txt = ids.length
        ? `Hola, armé mi punto de venta en su página. Mi negocio ocupa: ${nombres.join(', ')}. ¿Cuánto me sale?`
        : 'Hola, tengo un negocio y quiero saber cómo quedaría Mi Caja para mí.';
      waBtn.href = `${D.wa}?text=${encodeURIComponent(txt)}`;
    }
  };

  const desde = (el, tile) => {
    if (reduce) return;
    const a = el.getBoundingClientRect();
    const b = tile.getBoundingClientRect();
    const dx = a.left + a.width / 2 - (b.left + b.width / 2);
    const dy = a.top + a.height / 2 - (b.top + b.height / 2);
    const anim = tile.animate(
      [
        { transform: `translate(${dx}px, ${dy}px) scale(0.45) rotate(${azar(-20, 20)}deg)`, opacity: 0.6 },
        { transform: `translate(${dx * 0.4}px, ${dy * 0.4 - 90}px) scale(0.9) rotate(${azar(-10, 10)}deg)`, opacity: 1, offset: 0.55 },
        { transform: 'translateY(6px) scale(1.03)', offset: 0.85 },
        { transform: 'none' },
      ],
      { duration: 700, easing: 'cubic-bezier(0.3, 0.6, 0.4, 1)' },
    );
    anim.finished.then(() => golpe(maq)).catch(() => {});
  };

  const regresar = (tile) => {
    const ficha = fichas.find((f) => f.dataset.pieza === tile.dataset.id);
    ficha?.setAttribute('aria-pressed', 'false');
    tile.classList.add('is-saliendo');
    if (reduce || !ficha) { tile.remove(); actualizar(); return; }
    const a = tile.getBoundingClientRect();
    const b = ficha.getBoundingClientRect();
    const dx = b.left + b.width / 2 - (a.left + a.width / 2);
    const dy = b.top + b.height / 2 - (a.top + a.height / 2);
    tile.animate(
      [
        { transform: 'none', opacity: 1 },
        { transform: 'translateY(-16px) scale(1.05)', offset: 0.2 },
        { transform: `translate(${dx}px, ${dy}px) scale(0.4) rotate(${azar(-25, 25)}deg)`, opacity: 0 },
      ],
      { duration: 520, easing: 'cubic-bezier(0.5, 0, 0.6, 1)', fill: 'forwards' },
    ).finished.then(() => tile.remove()).catch(() => tile.remove());
    actualizar();
  };

  const poner = (ficha) => {
    const id = ficha.dataset.pieza;
    const ya = slots.map((s) => s.querySelector('.mc-tile:not(.is-saliendo)')).find((t) => t?.dataset.id === id);
    if (ya) { regresar(ya); return; }
    const libre = slots.find((s) => !s.querySelector('.mc-tile:not(.is-saliendo)'));
    if (!libre) {
      if (!reduce) {
        maq.querySelector('.mc-app')?.animate(
          [{ transform: 'none' }, { transform: 'translateX(-8px)' }, { transform: 'translateX(8px)' }, { transform: 'translateX(-4px)' }, { transform: 'none' }],
          { duration: 380 },
        );
      }
      if (aviso) aviso.textContent = 'La muestra lleva hasta 6. Quita una tocándola; en tu negocio van todas las que ocupes.';
      return;
    }
    const p = porId[id];
    const tile = crearPieza(p, p.c);
    tile.setAttribute('role', 'button');
    tile.setAttribute('tabindex', '0');
    tile.setAttribute('aria-label', `Quitar ${p.k}`);
    libre.appendChild(tile);
    ficha.setAttribute('aria-pressed', 'true');
    desde(ficha, tile);
    actualizar(560, id);
  };

  fichas.forEach((f) => f.addEventListener('click', () => poner(f)));
  maq.addEventListener('click', (e) => {
    const t = e.target instanceof Element ? e.target.closest('.mc-tile:not(.is-saliendo)') : null;
    if (t) regresar(t);
  });
  maq.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const t = e.target instanceof Element ? e.target.closest('.mc-tile:not(.is-saliendo)') : null;
    if (t) { e.preventDefault(); regresar(t); }
  });
}

/* ── Entradas al hacer scroll y la impresora ──────────────────────────── */
function entradas() {
  const els = document.querySelectorAll('.mc-sube, .mx-sube, [data-imprime]');
  if (reduce || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver((es) => {
    es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -12% 0px' });
  els.forEach((el) => io.observe(el));
}

if (D) {
  portada();
  fabrica();
  armalo();
}
entradas();
