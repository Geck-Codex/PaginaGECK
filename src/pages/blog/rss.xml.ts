/**
 * Feed RSS del blog.
 *
 * No es nostalgia: los agregadores y varios rastreadores —incluidos los de
 * buscadores con IA— descubren contenido nuevo por feed mucho antes que por
 * sitemap, y para un dominio con poco presupuesto de rastreo ese atajo importa.
 * Se declara además en el <head> de todas las páginas vía MainLayout.
 */
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { BLOG_INDEX } from '@/i18n/blog.js';
import { SITE_URL } from '@/data/seo';

export async function GET(context: { site?: URL }) {
  const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );

  return rss({
    title: BLOG_INDEX.title,
    description: BLOG_INDEX.description,
    // `context.site` sale de `site` en astro.config.mjs; el fallback evita que
    // el feed quede con enlaces relativos si algún día se toca esa config.
    site: context.site?.toString() ?? SITE_URL,
    trailingSlash: true,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/blog/${post.id}/`,
      categories: post.data.tags,
    })),
    customData: '<language>es-mx</language>',
  });
}
