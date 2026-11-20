/**
 * indexnow.mjs — avisa a Bing (y a los buscadores que usan IndexNow) de todas
 * las URLs del sitemap, sin esperar a que el rastreador las descubra solo.
 *
 * USO (DESPUES de desplegar, porque la llave tiene que estar publicada):
 *   node scripts/indexnow.mjs            # manda todas las URLs del sitemap
 *   node scripts/indexnow.mjs --dry      # solo lista lo que mandaria
 *
 * La llave es el nombre del archivo public/<llave>.txt (y su contenido). Si se
 * cambia, hay que cambiarla en los dos lados.
 */
const HOST = 'geckcodex.com';
const KEY = 'c1f665b33fadc2770b0f5ab3859c102c';
const SITEMAP = `https://${HOST}/sitemap-0.xml`;
const dry = process.argv.includes('--dry');

const xml = await (await fetch(SITEMAP)).text();
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (!urls.length) throw new Error('El sitemap no devolvio URLs: ' + SITEMAP);

console.log(`${urls.length} URLs del sitemap.`);

if (dry) {
  console.log(urls.join('\n'));
} else {
  // Comprueba que la llave ya este publicada; si no, IndexNow rechaza el envio.
  const keyUrl = `https://${HOST}/${KEY}.txt`;
  const check = await fetch(keyUrl);
  if (!check.ok || (await check.text()).trim() !== KEY) {
    throw new Error(`La llave aun no esta publicada en ${keyUrl}. Despliega primero.`);
  }

  const res = await fetch('https://api.indexnow.org/IndexNow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: keyUrl, urlList: urls }),
  });
  console.log('Respuesta de IndexNow:', res.status, res.statusText, '(200/202 = aceptado)');
}
