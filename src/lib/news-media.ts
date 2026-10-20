/** Resolve imported upload references at render time, keeping stored articles intact. */
export function resolveNewsMedia<T>(value: T): T {
  if (typeof value === 'string') {
    const legacy = /^(?:https?:\/\/hpttech\.vn)?\/api\/media\/file\/hpt-\d+-([^?#]+)(?:[?#].*)?$/i.exec(value)
    if (!legacy) return value
    let filename = legacy[1]
    try { filename = decodeURIComponent(filename) } catch { /* Keep literal filenames. */ }
    return `/r2/${encodeURIComponent(filename)}` as T
  }
  if (Array.isArray(value)) return value.map(resolveNewsMedia) as T
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, resolveNewsMedia(entry)])) as T
  }
  return value
}
