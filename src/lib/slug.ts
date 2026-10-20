/** Match both imported percent-encoded slugs and Next.js decoded route params. */
export function slugCandidates(slug: string): string[] {
  let decoded = slug
  try { decoded = decodeURIComponent(slug) } catch { /* Keep literal malformed percent signs. */ }
  return [...new Set([slug, decoded, encodeURI(decoded), encodeURIComponent(decoded)]
    .flatMap(value => [value, value.replace(/%[0-9a-f]{2}/gi, part => part.toLowerCase()), value.replace(/%[0-9a-f]{2}/gi, part => part.toUpperCase())]))]
}
