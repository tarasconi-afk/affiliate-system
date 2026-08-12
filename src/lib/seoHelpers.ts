import { SITE } from './site';

/** Build canonical URL from slug */
export function buildCanonical(slug: string): string {
  const cleanSlug = slug.replace(/^\/+|\/+$/g, '');
  return cleanSlug ? `${SITE.url}/${cleanSlug}/` : `${SITE.url}/`;
}

export function getEvidenceById(evidences: any[], id: string) {
  return evidences.find(ev => ev.id === id);
}

export function getEvidencesByIds(evidences: any[], ids: string[]) {
  return ids.map(id => getEvidenceById(evidences, id)).filter(Boolean);
}
