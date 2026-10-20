export function siteURL(path = '/') {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'
  return new URL(path, base).toString()
}

export function jsonLD(value: unknown) {
  return JSON.stringify(value).replace(/</g, '\\u003c')
}
