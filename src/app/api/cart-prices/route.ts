import { getPayloadClient } from '@/lib/payload'
import { verifiedCommerce } from '@/lib/catalog-verification'

export async function POST(request: Request) {
  try {
    const { slugs } = await request.json()
    if (!Array.isArray(slugs) || slugs.length > 50 || slugs.some((s: unknown) => typeof s !== 'string' || s.length > 500)) return Response.json({ error: 'Invalid cart' }, { status: 400 })
    const payload = await getPayloadClient()
    const result = await payload.find({ collection: 'products', overrideAccess: false, depth: 0, limit: 50, where: { slug: { in: slugs } }, select: { slug: true, name: true, price: true, priceVerified: true } })
    return Response.json({ items: result.docs.map(p => ({ slug: p.slug, name: p.name, price: verifiedCommerce(p).price })) }, { headers: { 'Cache-Control': 'no-store' } })
  } catch { return Response.json({ error: 'Cart unavailable' }, { status: 400 }) }
}
