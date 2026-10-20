import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    minimumCacheTTL: 86400,
    remotePatterns: [{ protocol: 'https', hostname: 'hpttech.vn', pathname: '/api/media/file/**' }, { protocol: 'https', hostname: 'maytinhdatcang.vn', pathname: '/wp-content/uploads/**' }],
  },
  // `next dev` serves the Make preview at a per-sandbox cross-origin host. Next
  // blocks its dev resources (`/_next/*`, HMR WebSocket, internal endpoints)
  // unless the origin is listed here, and a blocked HMR socket stalls Turbopack
  // so the Payload `/admin` panel renders blank in the preview iframe.
  // Dev-only - ignored by `next build`.
  //
  // Prerender source maps add ~100 MB per static build worker
  enablePrerenderSourceMaps: false,
  experimental: {
    // Caps static build workers (~250-380 MB each) to lower `next build` peak memory
    cpus: 2,
    // Payload Admin uses Next Server Actions. In the Make preview proxy, the
    // browser origin is the public sandbox host while `x-forwarded-host` points
    // at the local dev server. Allow only that exact platform-provisioned host.
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
