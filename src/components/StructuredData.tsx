import { jsonLD } from '@/lib/site-url'

export function StructuredData({ value }: { value: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLD(value) }} />
}
