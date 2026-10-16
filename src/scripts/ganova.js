/**
 * ganova.js — todo lo que se mueve en /ganova/.
 *
 * Un solo bucle de scroll (rAF, listener pasivo) reparte el avance de cada
 * escena como la variable CSS `--p` (0 → 1). El CSS hace el resto con `calc()`
 * y `clamp()`: asi el JS no toca ningun estilo elemento por elemento y solo se
 * anima transform, opacity y stroke-dashoffset.
 *
 * Con `prefers-reduced-motion` no se arma nada: la pagina se queda en su estado
 * final, quieta. La clase `gn-anim` (la pone un script inline antes de pintar)
 * es la que esconde los estados iniciales; sin ella todo se ve de entrada.
 */

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/* ── Contactos ───────────────────────────────────────────────────────────
   Cada boton de WhatsApp lleva `data-lead` con su lugar y se registra como
   `generate_lead`, igual que el resto del sitio (src/data/track.js). */
document.addEventListener('click', (e) => {
  const a = e.target instanceof Element ? e.target.closest('a[data-lead]') : null;
  if (!a || typeof window.gcTrack !== 'function') return;
  window.gcTrack('generate_lead', {
    method: 'whatsapp',
    where: `ganova-${a.getAttribute('data-lead')}`,
    page: window.location.pathname,
  });
});

/* ── Video de la portada ─────────────────────────────────────────────────
   Arranca solo y en silencio DESPUES de cargar la pagina. Se pausa cuando sale
   de la vista (no gasta bateria con nadie mirando). Sin arranque solo si se
   pidio menos movimiento o ahorro de datos. */
function initReel() {
  const v = document.querySelector('.gn-reel__video');
  const bPlay = document.querySelector('[data-reel="play"]');
  const bSound = document.querySelector('[data-reel="sound"]');
  if (!(v instanceof HTMLVideoElement) || !bPlay || !bSound) return;

  let userPaused = false;
  const sync = () => {
    const on = !v.paused;
    bPlay.textContent = on ? 'Pausar' : 'Reproducir';
    bPlay.setAttribute('aria-pressed', String(on));
    bSound.textContent = v.muted ? 'Activar sonido' : 'Quitar sonido';
    bSound.setAttribute('aria-pressed', String(!v.muted));
  };
  ['play', 'pause', 'volumechange'].forEach((ev) => v.addEventListener(ev, sync));
  bPlay.addEventListener('click', () => {
    if (v.paused) { userPaused = false; v.play(); } else { userPaused = true; v.pause(); }
  });
  bSound.addEventListener('click', () => {
    v.muted = !v.muted;
    if (!v.muted && v.paused) { userPaused = false; v.play(); }
  });

  const saveData = navigator.connection && navigator.connection.saveData;
  if (reduce || saveData) return;

  const start = () => setTimeout(() => { if (!userPaused) v.play().catch(() => {}); }, 500);
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });

  new IntersectionObserver(([en]) => {
    if (userPaused || v.readyState === 0) return;
    if (en.isIntersecting) v.play().catch(() => {});
    else v.pause();
  }, { threshold: 0.2 }).observe(v);
}

/* ── Portada: entrada orquestada + inclinacion con el mouse ─────────────── */
function initHero() {
  const hero = document.querySelector('.gn-hero');
  if (!hero) return;
  const go = () => hero.classList.add('is-in');
  // Espera a la tipografia para que las palabras no suban con la de respaldo.
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve())
    .then(() => requestAnimationFrame(go));
  setTimeout(go, 1200); // red de seguridad

  const reel = document.querySelector('.gn-reel');
  if (!reel || !finePointer) return;
  let tx = 0; let ty = 0; let cx = 0; let cy = 0; let raf = 0;
  const loop = () => {
    cx += (tx - cx) * 0.08;
    cy += (ty - cy) * 0.08;
    reel.style.setProperty('--rx', `${(-cy * 7).toFixed(2)}deg`);
    reel.style.setProperty('--ry', `${(cx * 9).toFixed(2)}deg`);
    hero.style.setProperty('--mx', cx.toFixed(3));
    hero.style.setProperty('--my', cy.toFixed(3));
    raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.001 ? requestAnimationFrame(loop) : 0;
  };
  hero.addEventListener('pointermove', (e) => {
    const r = hero.getBoundingClientRect();
    tx = (e.clientX - r.left) / r.width - 0.5;
    ty = (e.clientY - r.top) / r.height - 0.5;
    if (!raf) raf = requestAnimationFrame(loop);
  }, { passive: true });
  hero.addEventListener('pointerleave', () => {
    tx = 0; ty = 0;
    if (!raf) raf = requestAnimationFrame(loop);
  });
}

/* ── Motor de escenas por scroll ─────────────────────────────────────────
   `data-scene="pin"`  → avance mientras la escena esta clavada (sticky).
   `data-scene="pass"` → avance mientras la seccion cruza la pantalla.
   Tambien mueve la barra de arriba con la vaquita. */
function initScenes() {
  const scenes = Array.from(document.querySelectorAll('[data-scene]'));
  const barra = document.querySelector('.gn-barra');
  const nav = document.querySelector('.pr-nav');
  let ticking = false;
  let quieto = 0;

  const placeBar = () => {
    if (barra && nav) barra.style.top = `${nav.getBoundingClientRect().height}px`;
  };

  const update = () => {
    ticking = false;
    const vh = window.innerHeight;
    for (const el of scenes) {
      const r = el.getBoundingClientRect();
      if (r.bottom < -vh * 0.2 || r.top > vh * 1.2) continue;
      const p = el.dataset.scene === 'pin'
        ? clamp(-r.top / Math.max(1, r.height - vh))
        : clamp((vh * 0.9 - r.top) / (r.height + vh * 0.4));
      el.style.setProperty('--p', p.toFixed(4));
    }
    if (barra) {
      const max = document.documentElement.scrollHeight - vh;
      barra.style.setProperty('--p', clamp(window.scrollY / Math.max(1, max)).toFixed(4));
    }
  };

  const request = () => {
    if (barra) {
      barra.classList.add('is-andando');
      clearTimeout(quieto);
      quieto = setTimeout(() => barra.classList.remove('is-andando'), 220);
    }
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  };

  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', () => { placeBar(); request(); }, { passive: true });
  placeBar();
  update();
}

/* ── Un dia en el rancho ──────────────────────────────────────────────────
   Escena clavada que avanza de lado. El alto de la seccion se calcula para que
   un pixel de scroll vertical sea un pixel de recorrido horizontal: asi la
   velocidad se siente natural. El reloj marca la hora segun el avance. */
function initDia() {
  const sec = document.querySelector('.gn-dia');
  const track = document.querySelector('.gn-dia__track');
  const relojes = document.querySelectorAll(".gn-dia__reloj");
  if (!sec || !track) return;

  const medir = () => {
    const dx = Math.max(0, track.scrollWidth - window.innerWidth);
    sec.style.setProperty('--dx', String(dx));
    sec.style.height = `${dx + window.innerHeight}px`;
  };
  medir();
  window.addEventListener('resize', medir, { passive: true });
  window.addEventListener('load', medir, { once: true });

  if (!relojes.length) return;
  const ini = 6.5; const fin = 21; // de 6:30 a 21:00
  let ultimo = '';
  let ticking = false;
  const pinta = () => {
    ticking = false;
    const r = sec.getBoundingClientRect();
    const p = clamp(-r.top / Math.max(1, r.height - window.innerHeight));
    const h = ini + (fin - ini) * p;
    const hh = Math.floor(h);
    const mm = Math.floor(((h - hh) * 60) / 5) * 5; // de cinco en cinco, como reloj de pared
    const txt = `${hh}:${String(mm).padStart(2, '0')}`;
    if (txt !== ultimo) { relojes.forEach((r) => { r.textContent = txt; }); ultimo = txt; }
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(pinta); }
  }, { passive: true });
  pinta();
}

/* ── Videos de pantalla (grabaciones de la app) ─────────────────────────
   Corren en silencio y en bucle solo mientras se ven. */
function initPantallas() {
  const vids = document.querySelectorAll('video[data-pantalla]');
  if (!vids.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      const v = en.target;
      if (!(v instanceof HTMLVideoElement)) return;
      if (en.isIntersecting) { v.preload = 'auto'; v.play().catch(() => {}); } else v.pause();
    });
  }, { threshold: 0.35 });
  vids.forEach((v) => io.observe(v));
}

/* ── Avisos: notificaciones que van cayendo en el telefono bloqueado ──── */
function initAvisos() {
  const pila = document.querySelector('.gn-avisos__pila');
  if (!pila) return;
  const items = Array.from(pila.children);
  const n = items.length;
  let top = 0;
  let timer = 0;
  const pintar = () => {
    items.forEach((el, i) => {
      const pos = (i - top + n) % n; // 0 = la mas nueva
      el.setAttribute('data-pos', String(Math.min(pos, 4)));
    });
  };
  const siguiente = () => { top = (top - 1 + n) % n; pintar(); };
  pintar();
  new IntersectionObserver(([en]) => {
    clearInterval(timer);
    if (en.isIntersecting) timer = setInterval(siguiente, 2300);
  }, { threshold: 0.25 }).observe(pila);
}

/* ── Animaciones en bucle que solo corren a la vista ─────────────────────
   Iconos del corral y el hatito de vacas: `is-vivo` les da play. */
function initVivos() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => en.target.classList.toggle('is-vivo', en.isIntersecting));
  }, { threshold: 0.1 });
  document.querySelectorAll('[data-vivo]').forEach((el) => io.observe(el));
}

/* ── Botones magneticos ──────────────────────────────────────────────── */
function initMagnet() {
  if (!finePointer) return;
  document.querySelectorAll('[data-magnet]').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.25;
      const y = (e.clientY - r.top - r.height / 2) * 0.35;
      el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
    }, { passive: true });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });
}

/* ── El juego: ¿de quien es esta cria? ───────────────────────────────────
   Funciona igual con y sin movimiento reducido: es una respuesta a un clic. */
function initJuego() {
  const juego = document.querySelector('.gn-juego');
  if (!juego) return;
  const msg = juego.querySelector('.gn-juego__msg');
  const otra = juego.querySelector('.gn-juego__otra');
  const vacas = Array.from(juego.querySelectorAll('[data-vaca]'));

  vacas.forEach((b) => b.addEventListener('click', () => {
    if (juego.classList.contains('is-resuelto')) return;
    juego.classList.add('is-resuelto');
    vacas.forEach((v) => {
      v.setAttribute('aria-pressed', String(v === b));
      v.classList.toggle('is-escogida', v === b);
    });
    if (msg) msg.textContent = b.getAttribute('data-msg') || '';
    juego.setAttribute('data-resultado', b.getAttribute('data-vaca') === 'madre' ? 'bien' : 'mal');
  }));

  if (otra) otra.addEventListener('click', () => {
    juego.classList.remove('is-resuelto');
    juego.removeAttribute('data-resultado');
    vacas.forEach((v) => { v.setAttribute('aria-pressed', 'false'); v.classList.remove('is-escogida'); });
    if (msg) msg.textContent = '';
    vacas[0].focus();
  });
}

initReel();
initJuego();
if (!reduce) {
  initHero();
  initDia();
  initScenes();
  initPantallas();
  initAvisos();
  initVivos();
  initMagnet();
} else {
  // Sin movimiento las grabaciones no arrancan solas: se les dan controles.
  document.querySelectorAll('video[data-pantalla]').forEach((v) => { v.controls = true; });
}
