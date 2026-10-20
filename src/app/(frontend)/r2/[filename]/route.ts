import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'

export const runtime = 'nodejs'

let client: S3Client | undefined

function getClient() {
  if (!client) {
    client = new S3Client({
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
      },
      endpoint: process.env.R2_ENDPOINT,
      forcePathStyle: true,
      region: process.env.R2_REGION || 'auto',
    })
  }
  return client
}

export async function GET(_request: Request, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params
  if (!filename || filename === '.' || filename === '..' || filename.includes('/') || filename.includes('\\')) {
    return new Response(null, { status: 400 })
  }
  const bucket = process.env.R2_BUCKET
  if (!bucket || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY || !process.env.R2_ENDPOINT) {
    return new Response(null, { status: 503 })
  }

  try {
    const object = await getClient().send(new GetObjectCommand({ Bucket: bucket, Key: filename }))
    if (!object.Body || !object.ContentType?.startsWith('image/')) return new Response(null, { status: 404 })
    return new Response(object.Body.transformToWebStream(), {
      headers: {
        'Content-Type': object.ContentType,
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
        ...(object.ContentLength ? { 'Content-Length': String(object.ContentLength) } : {}),
      },
    })
  } catch {
    return new Response(null, { status: 404 })
  }
}
