import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'
import { getPosts, type StorePost } from '@/lib/storefront'
import { NewsImage } from '@/components/NewsImage'

export const metadata={title:'Tin tức công nghệ | Bình Minh',description:'Tin công nghệ, giải pháp số hóa và hướng dẫn sử dụng thiết bị.',alternates:{canonical:'/tin-tuc'}}
const href=(post:StorePost)=>`/tin-tuc/${post.slug}`
const date=(value:string)=>new Intl.DateTimeFormat('vi-VN',{timeZone:'Asia/Ho_Chi_Minh'}).format(new Date(value))
function Card({post,large=false}:{post:StorePost;large?:boolean}) {
 return <article className="group min-w-0"><Link href={href(post)} tabIndex={-1} aria-hidden="true"><NewsImage image={post.image} title={post.title} priority={large}/></Link><p className="mt-3 text-[11px] text-slate-400">{post.category} · <time dateTime={post.publishedAt}>{date(post.publishedAt)}</time></p><h3 className={`mt-1 font-bold leading-snug text-[#20352a] group-hover:text-[#087c36] ${large?'text-xl sm:text-2xl':'text-sm sm:text-base'}`}><Link href={href(post)}>{post.title}</Link></h3>{large&&<p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">{post.excerpt}</p>}</article>
}
function Heading({children,url}:{children:React.ReactNode;url?:string}) {
 return <div className="mb-5 flex items-center justify-between border-b border-slate-200 pb-3"><h2 className="border-l-4 border-[#087c36] pl-3 text-xl font-extrabold uppercase text-[#07552a] sm:text-2xl">{children}</h2>{url&&<Link href={url} className="text-xs font-semibold text-[#087c36]">Xem tất cả →</Link>}</div>
}
export default async function NewsPage({searchParams}:{searchParams:Promise<{category?:string;page?:string}>}) {
 const params=await searchParams
 const [posts,payload]=await Promise.all([getPosts(),getPayloadClient()])
 const categories=await payload.find({collection:'article-categories',limit:100,sort:'order,name',overrideAccess:false})
 const selected=categories.docs.find(c=>c.slug===params.category)
 const filtered=selected?posts.filter(p=>p.category===selected.name):posts
 const pages=Math.max(1,Math.ceil(filtered.length/8))
 const page=Math.min(pages,Math.max(1,parseInt(params.page||'1',10)||1))
 const featured=[...filtered.filter(p=>p.featured),...filtered.filter(p=>!p.featured)].slice(0,6)
 const latest=filtered.slice((page-1)*8,page*8)
 return <main className="bg-white pb-12"><div className="border-b border-slate-200"><nav aria-label="Chuyên mục tin tức" className="mx-auto flex max-w-[1320px] gap-1 overflow-x-auto px-4 py-3 lg:px-6"><Link href="/tin-tuc" className={`shrink-0 rounded-md px-4 py-2.5 text-sm font-bold ${!selected?'bg-[#087c36] text-white':'text-slate-600'}`}>Tất cả tin tức</Link>{categories.docs.map(c=><Link key={c.id} href={`/tin-tuc?category=${encodeURIComponent(c.slug)}`} aria-current={selected?.id===c.id?'page':undefined} className={`shrink-0 rounded-md px-4 py-2.5 text-sm font-semibold ${selected?.id===c.id?'bg-[#087c36] text-white':'text-slate-600 hover:text-[#087c36]'}`}>{c.name}</Link>)}</nav></div>
 <div className="mx-auto max-w-[1320px] px-4 lg:px-6"><nav className="py-5 text-xs text-slate-400"><Link href="/">Trang chủ</Link> / Tin tức {selected&&` / ${selected.name}`}</nav><h1 className="sr-only">{selected?.name||'Tin tức công nghệ Bình Minh'}</h1>
 {!filtered.length?<p className="py-16 text-center text-slate-500">Chưa có bài viết được xuất bản.</p>:<>
 {page===1&&<section className="mb-10"><Heading>{selected?.name||'Tin nổi bật'}</Heading><div className="grid items-start gap-6 lg:grid-cols-[2fr_1fr]"><Card post={featured[0]} large/><div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">{featured.slice(1,3).map(p=><Card key={p.id} post={p}/>)}</div></div>{featured.length>3&&<div className="mt-6 grid gap-6 border-t border-slate-100 pt-6 sm:grid-cols-3">{featured.slice(3).map(p=><Card key={p.id} post={p}/>)}</div>}</section>}
 <section className="mb-12 grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]"><div><Heading>Tin mới nhất</Heading><div className="divide-y divide-slate-100">{latest.map(p=><article key={p.id} className="group grid grid-cols-[120px_1fr] gap-4 py-5 first:pt-0 sm:grid-cols-[240px_1fr]"><Link href={href(p)} tabIndex={-1} aria-hidden="true"><NewsImage image={p.image} title={p.title}/></Link><div><p className="text-[11px] text-slate-400">{p.category} · {date(p.publishedAt)}</p><h3 className="mt-1 text-sm font-bold leading-6 group-hover:text-[#087c36] sm:text-lg"><Link href={href(p)}>{p.title}</Link></h3><p className="mt-2 hidden text-sm leading-6 text-slate-500 sm:line-clamp-2">{p.excerpt}</p></div></article>)}</div>{pages>1&&<nav aria-label="Phân trang tin tức" className="mt-6 flex justify-center gap-2">{Array.from({length:pages},(_,i)=><Link key={i} href={`/tin-tuc?${new URLSearchParams({...(selected?{category:selected.slug}:{}),page:String(i+1)})}`} aria-current={page===i+1?'page':undefined} className={`grid h-9 w-9 place-items-center rounded border text-sm ${page===i+1?'border-[#087c36] bg-[#087c36] text-white':'border-slate-200'}`}>{i+1}</Link>)}</nav>}</div><aside><Heading>Chuyên mục</Heading><div className="divide-y divide-slate-100 rounded-lg border border-slate-100 px-5">{categories.docs.map(c=><Link key={c.id} href={`/tin-tuc?category=${encodeURIComponent(c.slug)}`} className="flex justify-between gap-3 py-4 text-sm font-semibold hover:text-[#087c36]">{c.name}<span className="text-slate-400">{posts.filter(p=>p.category===c.name).length}</span></Link>)}</div><div className="mt-8 rounded-lg bg-[#f3f8f3] p-6"><p className="text-xs font-bold uppercase text-[#087c36]">Bình Minh đồng hành</p><h3 className="mt-2 text-xl font-bold">Chọn thiết bị đúng nhu cầu</h3><p className="mt-3 text-sm leading-6 text-slate-500">Tư vấn sản phẩm và giải pháp cho doanh nghiệp.</p><a href="tel:0876645432" className="mt-5 inline-block rounded-full bg-[#087c36] px-5 py-2.5 text-sm font-bold text-white">0876 645 432</a></div></aside></section>
 {!selected&&categories.docs.map(c=>{const items=posts.filter(p=>p.category===c.name).slice(0,4);return items.length?<section key={c.id} className="mb-10"><Heading url={`/tin-tuc?category=${encodeURIComponent(c.slug)}`}>{c.name}</Heading><div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{items.map(p=><Card key={p.id} post={p}/>)}</div></section>:null})}</> }</div></main>
}

