import { unstable_cache } from 'next/cache'
import { getPayloadClient } from './payload'
import { policyPages } from './policy-content'

export const getPolicies = unstable_cache(async () => {
  const payload = await getPayloadClient()
  const settings = await payload.findGlobal({ slug: 'policies', overrideAccess: false })
  return settings.pages?.length ? settings.pages : policyPages
}, ['customer-policies'], { tags: ['policies'], revalidate: 300 })
