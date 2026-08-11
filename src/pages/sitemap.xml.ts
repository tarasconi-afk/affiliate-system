import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const SITE_URL = import.meta.env.SITE || 'https://example.com';

export const GET: APIRoute = async () => {
  const allPages = await getCollection('pages');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${SITE_URL}/${page.data.slug}/</loc>
    <lastmod>${page.data.metadata.updatedAt}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
