/**
 * Build canonical URL from slug
 */
export function buildCanonical(slug: string): string {
  const SITE_URL = import.meta.env.SITE || 'https://example.com';
  return `${SITE_URL}/${slug}`;
}

/**
 * Get evidence by ID from evidences array
 */
export function getEvidenceById(evidences: any[], id: string) {
  return evidences.find(ev => ev.id === id);
}

/**
 * Get multiple evidences by IDs
 */
export function getEvidencesByIds(evidences: any[], ids: string[]) {
  return ids.map(id => getEvidenceById(evidences, id)).filter(Boolean);
}
