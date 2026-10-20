'use client'
import Image from 'next/image'
import { useState } from 'react'
import type { StoreMedia } from '@/lib/storefront'
export function NewsImage({image,title,priority=false}:{image:StoreMedia|null;title:string;priority?:boolean}) {
 const [failed,setFailed]=useState(false)
 return <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-[#f3f6f3]">{image&&!failed ? <Image src={image.url} alt={image.alt||title} fill sizes="(max-width:640px) 100vw, 800px" className="object-cover transition duration-500 group-hover:scale-105" unoptimized={image.url.startsWith('/r2/')} priority={priority} onError={()=>setFailed(true)}/> : <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-[#edf5ed] to-white px-5 text-center text-sm font-bold tracking-widest text-[#087c36]">BÌNH MINH<br/>TIN CÔNG NGHỆ</div>}</div>
}
