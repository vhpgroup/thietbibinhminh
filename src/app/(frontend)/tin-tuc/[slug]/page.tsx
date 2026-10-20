import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import { StructuredData } from '@/components/StructuredData'
import { siteURL } from '@/lib/site-url'
import Link from 'next/link'
import { slugCandidates } from '@/lib/slug'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { getPayloadClient } from '@/lib/payload'
import { mediaView, getPosts } from '@/lib/storefront'
import { NewsImage } from '@/components/NewsImage'
import { resolveNewsMedia } from '@/lib/news-media'

const findPost = cache(unstable_cache(async (slug:string) => {
 const payload=await getPayloadClient()
 const result=await payload.find({collection:'posts',where:{slug:{in:slugCandidates(slug)}},limit:1,depth:1,overrideAccess:false})
 if(!result.docs[0]) notFound()
 return result.docs[0]
}, ['post-by-slug'], { tags: ['posts'], revalidate: 300 }))
export async function generateMetadata({params}:{params:Promise<{slug:string}>}) {
 const post=await findPost((await params).slug)
 return {title:`${post.title} | Bình Minh`,description:post.excerpt,alternates:{canonical:`/tin-tuc/${post.slug}`}}
}
export default async function NewsDetail({params}:{params:Promise<{slug:string}>}) {
 const post=await findPost((await params).slug)
 const related=(await getPosts()).filter(p=>p.slug!==post.slug).slice(0,3)
 const image=mediaView(post.heroImage)
 return <><StructuredData value={{'@context':'https://schema.org','@type':'Article',headline:post.title,description:post.excerpt,datePublished:post.publishedAt,dateModified:post.updatedAt,image:image?[siteURL(image.url)]:undefined,mainEntityOfPage:siteURL(`/tin-tuc/${post.slug}`),publisher:{'@id':siteURL('/#organization')}}}/><main className="mx-auto max-w-[1120px] bg-white px-4 py-6 lg:px-6"><nav className="mb-6 text-xs text-slate-400"><Link href="/">Trang chủ</Link> / <Link href="/tin-tuc">Tin tức</Link></nav><article className="mx-auto max-w-[850px]"><p className="mb-3 text-sm font-bold text-[#087c36]">{typeof post.category==='object'?post.category.name:''}</p><h1 className="text-3xl font-bold leading-tight sm:text-4xl">{post.title}</h1><p className="my-4 text-xs text-slate-400">{new Intl.DateTimeFormat('vi-VN').format(new Date(post.publishedAt))}</p><p className="mb-6 text-lg font-medium leading-8 text-slate-600">{post.excerpt}</p><NewsImage image={mediaView(post.heroImage)} title={post.title} priority/>{post.content&&<div className="news-body my-8"><RichText data={resolveNewsMedia(post.content)}/></div>}</article><section className="my-12 border-t border-slate-200 pt-6"><h2 className="mb-5 text-xl font-bold text-[#087c36]">Bài viết liên quan</h2><div className="grid gap-6 sm:grid-cols-3">{related.map(p=><Link key={p.id} href={`/tin-tuc/${p.slug}`} className="group"><NewsImage image={p.image} title={p.title}/><h3 className="mt-3 font-bold leading-6 group-hover:text-[#087c36]">{p.title}</h3></Link>)}</div></section></main></>
}
