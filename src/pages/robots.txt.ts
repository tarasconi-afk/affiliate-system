import type { APIRoute } from 'astro';

const SITE_URL = import.meta.env.SITE || 'https://example.com';

const robotsTxt = `
User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`.trim();

export const GET: APIRoute = () => {
  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
