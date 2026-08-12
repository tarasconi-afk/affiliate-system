import type { APIRoute } from 'astro';
import { SITE } from '../lib/site';

export const GET: APIRoute = () => {
  const rules = SITE.prelaunch
    ? `User-agent: *\nDisallow: /\n`
    : `User-agent: *\nAllow: /\n\nSitemap: ${SITE.url}/sitemap.xml\n`;

  return new Response(rules, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
