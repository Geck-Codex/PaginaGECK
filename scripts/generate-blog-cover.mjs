/**
 * Genera la portada de un artículo del blog a partir de su título.
 *
 * Salida: public/assets/image/blog/<slug>.jpg (1200×630) y su gemela .webp.
 *
 * Uso:
 *   node scripts/generate-blog-cover.mjs                 → todos los que no tengan portada
 *   node scripts/generate-blog-cover.mjs <slug>          → solo ese
 *   node scripts/generate-blog-cover.mjs <slug> --force  → rehace una existente
 *   node scripts/generate-blog-cover.mjs <slug> --bg foto.png --force
 *                                                       → usa una imagen de fondo
 *
 * Sobre --bg: la imagen se recorta a 1200x630 y se le encima un velo azul
 * marino que va de opaco a transparente de izquierda a derecha, para que el
 * título siga siendo legible. El texto SIEMPRE lo pone este script con las
 * fuentes de marca: los generadores de imagen escriben mal las letras, así que
 * la imagen se pide sin una sola palabra. El prompt vive en
 * .claude/skills/escribir-articulo/references/voz-y-plantilla.md
 *
 * ── Por qué existe ────────────────────────────────────────────────
 * Un artículo sin imagen se comparte en WhatsApp como un rectángulo gris, y esa
 * tarjeta es lo único que ve la gente antes de decidir si abre el enlace. La
 * alternativa habitual —fotos de banco de "equipo sonriendo frente a una
 * laptop"— pesa cientos de kilobytes y no dice nada: se ve igual en el blog de
 * cualquier agencia del mundo.
 *
 * Una portada generada del título resuelve las dos cosas: dice de qué trata el
 * artículo, se ve como la marca, y pesa lo que pesa un gradiente. Además nunca
 * se te olvida ponerla.
 *
 * El arranque de fuentes es el mismo truco que generate-og-image.mjs: sharp
 * solo ve las fuentes del sistema, así que se descargan a una caché, se arma un
 * fontconfig temporal y el script se relanza con FONTCONFIG_FILE ya puesto.
 */

import { mkdir, writeFile, access, readdir, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { spawnSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = join(__dirname, '..');
const blogDir = join(root, 'src', 'content', 'blog');
const outDir = join(root, 'public', 'assets', 'image', 'blog');

/* ── 1. Fuentes de marca ─────────────────────────────────────────── */

const cacheDir = join(root, 'node_modules', '.cache', 'og-fonts');
const FONTS = {
  'SpaceGrotesk.ttf': 'https://github.com/google/fonts/raw/main/ofl/spacegrotesk/SpaceGrotesk%5Bwght%5D.ttf',
  'Inter.ttf': 'https://github.com/google/fonts/raw/main/ofl/inter/Inter%5Bopsz,wght%5D.ttf',
};

if (!process.env.OG_FONTS_READY) {
  await mkdir(cacheDir, { recursive: true });
  await mkdir(join(cacheDir, 'fc'), { recursive: true });

  for (const [file, url] of Object.entries(FONTS)) {
    const dest = join(cacheDir, file);
    try {
      await access(dest);
    } catch {
      console.log(`descargando ${file}…`);
      const res = await fetch(url);
      if (!res.ok) throw new Error(`No se pudo descargar ${file}: ${res.status}`);
      await writeFile(dest, Buffer.from(await res.arrayBuffer()));
    }
  }

  const p = (s) => s.replace(/\\/g, '/');
  const confPath = join(cacheDir, 'fonts.conf');
  await writeFile(
    confPath,
    `<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "fonts.dtd">
<fontconfig>
  <dir>${p(cacheDir)}</dir>
  <cachedir>${p(join(cacheDir, 'fc'))}</cachedir>
</fontconfig>`,
  );

  const r = spawnSync(process.execPath, [__filename, ...process.argv.slice(2)], {
    stdio: 'inherit',
    env: { ...process.env, FONTCONFIG_FILE: confPath, OG_FONTS_READY: '1' },
  });
  process.exit(r.status ?? 1);
}

const sharp = (await import('sharp')).default;

/* ── 2. Tokens de marca ──────────────────────────────────────────── */

// Los mismos de src/styles/global.css. El oro es acento FUNCIONAL: barra,
// etiqueta y dominio. Nunca el título completo.
const C = {
  navy: '#0D1625',
  gold: '#C3AD85',
  goldLight: '#D8C6A4',
  bronze: '#957952',
  ivory: '#F5F1E8',
};

const W = 1200;
const H = 630;
const PAD = 84;
const esc = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * Parte el título en líneas.
 *
 * sharp no mide texto, así que el ancho se estima por número de caracteres. El
 * factor 0.52 es el ancho medio de un glifo de Space Grotesk bold respecto a su
 * tamaño de fuente; conservador a propósito, porque una línea que se sale de la
 * imagen se ve mucho peor que una que corta antes de tiempo.
 */
function wrap(text, fontSize, maxWidth) {
  const perLine = Math.floor(maxWidth / (fontSize * 0.52));
  const lines = [];
  let line = '';
  for (const word of text.split(/\s+/)) {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length > perLine && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/** Frontmatter mínimo: solo los campos que la portada necesita. */
function parseFront(raw) {
  const front = raw.split(/^---\s*$/m)[1] ?? '';
  const pick = (key) => {
    const m = front.match(new RegExp(`^${key}:\\s*(.*)$`, 'm'));
    if (!m) return undefined;
    return m[1].trim().replace(/^["']|["']$/g, '');
  };
  const tags = [...front.matchAll(/^\s+-\s+(.+)$/gm)].map((m) => m[1].trim());
  return { title: pick('title'), cover: pick('cover'), tags };
}

/**
 * Fondo de la portada: la imagen que se le pase, o el degradado de marca.
 *
 * Cuando hay imagen se le encima un velo azul marino que va de opaco en la
 * izquierda a transparente en la derecha. No es decoración: el título se pinta
 * sobre el lado izquierdo, y sin ese velo el texto queda ilegible en cuanto la
 * foto tenga una zona clara. Por eso el prompt de generación pide dejar los dos
 * tercios izquierdos vacíos y oscuros — el velo refuerza lo que la composición
 * ya debería traer.
 */
async function background(bgPath) {
  if (!bgPath) return null;
  if (!existsSync(bgPath)) throw new Error(`No encuentro la imagen de fondo: ${bgPath}`);

  // `cover` recorta al centro, que es lo correcto: el sujeto va a la derecha y
  // las imágenes generadas llegan en 1536×1024, más altas de proporción.
  return sharp(bgPath).resize(W, H, { fit: 'cover', position: 'centre' }).toBuffer();
}

async function render(slug, title, tag, bgPath) {
  /* Ancho de la columna de texto.

     Sin imagen, el título usa el ancho completo. Con imagen se acota al 62%,
     porque el prompt pide que el sujeto ocupe el tercio derecho: si el texto
     siguiera hasta el margen, se le encimaría encima justo a lo que se generó
     la foto. Es lo que obliga a que la portada con foto tenga el texto más
     chico y más apilado — y está bien, la foto ya está aportando. */
  const maxTextWidth = bgPath ? Math.round(W * 0.62) - PAD : W - PAD * 2;
  let size = 60;
  let lines = wrap(title, size, maxTextWidth);
  if (lines.length > 3) {
    size = 50;
    lines = wrap(title, size, maxTextWidth);
  }
  if (lines.length > 4) {
    size = 42;
    lines = wrap(title, size, maxTextWidth).slice(0, 4);
  }

  const lineHeight = Math.round(size * 1.22);

  /* Centrado ÓPTICO del bloque de título en la zona libre (entre la etiqueta de
     arriba y la línea del pie, cuyo centro cae en y≈320).

     Se centra la mancha visible, no las coordenadas: en SVG la `y` de un <text>
     es la línea base, así que el glifo sube ~0.75·size por encima de ella. Sin
     descontarlo, un título de una línea queda pegado al techo y otro de tres se
     hunde — que es justo lo que pasaba antes. */
  const n = lines.length;
  const blockTop = 320 - ((n - 1) * lineHeight - 0.75 * size) / 2;

  const titleSvg = lines
    .map(
      (l, i) =>
        `<text x="${PAD}" y="${blockTop + i * lineHeight}" font-family="Space Grotesk" ` +
        `font-size="${size}" font-weight="700" fill="${C.ivory}">${esc(l)}</text>`,
    )
    .join('\n  ');

  const bg = await background(bgPath);

  // Con imagen, el fondo lo pone el bitmap y el SVG solo aporta el velo; sin
  // ella, el SVG pinta el navy y el destello dorado.
  const base = bg
    ? `<rect width="${W}" height="${H}" fill="url(#veil)"/>`
    : `<rect width="${W}" height="${H}" fill="${C.navy}"/>
  <circle cx="${W - 120}" cy="80" r="460" fill="url(#glow)"/>`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="bar" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${C.goldLight}"/>
      <stop offset="60%" stop-color="${C.gold}"/>
      <stop offset="100%" stop-color="${C.bronze}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0%" stop-color="${C.gold}" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="${C.gold}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="veil" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${C.navy}" stop-opacity="0.94"/>
      <stop offset="52%" stop-color="${C.navy}" stop-opacity="0.82"/>
      <stop offset="100%" stop-color="${C.navy}" stop-opacity="0.20"/>
    </linearGradient>
  </defs>

  ${base}
  <rect x="0" y="0" width="${W}" height="7" fill="url(#bar)"/>

  <text x="${PAD}" y="140" font-family="Inter" font-size="16" font-weight="600"
        letter-spacing="3.6" fill="${C.gold}">${esc(tag.toUpperCase())}</text>

  ${titleSvg}

  <rect x="${PAD}" y="${H - 132}" width="${W - PAD * 2}" height="1"
        fill="${C.gold}" opacity="0.22"/>

  <text x="${PAD}" y="${H - 82}" font-family="Space Grotesk" font-size="22"
        font-weight="700" letter-spacing="2.6" fill="${C.ivory}">GECK CODEX</text>
  <text x="${W - PAD}" y="${H - 82}" text-anchor="end" font-family="Inter"
        font-size="19" font-weight="600" fill="${C.gold}">geckcodex.com</text>
</svg>`;

  await mkdir(outDir, { recursive: true });

  // Con imagen: el bitmap va debajo y el SVG (velo + texto) encima. Sin ella,
  // el SVG es la portada entera.
  const out = bg
    ? sharp(bg).composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
    : sharp(Buffer.from(svg));

  await out.clone().jpeg({ quality: 88, chromaSubsampling: '4:4:4' }).toFile(join(outDir, `${slug}.jpg`));
  await out.clone().webp({ quality: 88 }).toFile(join(outDir, `${slug}.webp`));
}

/* ── 3. Recorrido ────────────────────────────────────────────────── */

const args = process.argv.slice(2);
const force = args.includes('--force');
const bgFlag = args.indexOf('--bg');
const bgPath = bgFlag !== -1 ? args[bgFlag + 1] : undefined;
// El valor de --bg no debe confundirse con el slug al leer los posicionales.
const only = args.find((a, i) => !a.startsWith('--') && i !== bgFlag + 1);

if (bgPath && !only) {
  console.error('--bg necesita un slug: node scripts/generate-blog-cover.mjs <slug> --bg <imagen>');
  process.exit(1);
}

const files = (await readdir(blogDir)).filter((f) => f.endsWith('.md'));
let hechas = 0;

for (const file of files) {
  const slug = file.replace(/\.md$/, '');
  if (only && slug !== only) continue;

  const path = join(blogDir, file);
  const raw = await readFile(path, 'utf8');
  const { title, cover, tags } = parseFront(raw);

  if (!title) {
    console.warn(`· ${slug}: sin título en el frontmatter, se omite`);
    continue;
  }
  if (cover && !force) {
    console.log(`· ${slug}: ya tiene portada, se omite (usa --force para rehacerla)`);
    continue;
  }

  await render(slug, title, tags[0] ?? 'Blog', bgPath);
  console.log(`✓ ${slug}.jpg`);
  hechas++;

  // Se escribe la ruta en el frontmatter para no depender de que alguien se
  // acuerde de pegarla. El alt describe la portada tal como es —una tarjeta con
  // el título— en vez de repetir el título a secas, que para quien usa lector
  // de pantalla sería oírlo dos veces seguidas.
  if (!cover) {
    const alt = `Portada del artículo: ${title}`;
    const updated = raw.replace(
      /^(draft:.*)$/m,
      `cover: /assets/image/blog/${slug}.jpg\ncoverAlt: "${alt.replace(/"/g, "'")}"\n$1`,
    );
    if (updated !== raw) {
      await writeFile(path, updated);
      console.log(`  └─ cover y coverAlt agregados al frontmatter`);
    } else {
      console.warn(`  └─ no encontré 'draft:' para anclar el cover; agrégalo a mano`);
    }
  }
}

if (hechas === 0) console.log('Nada que generar.');
