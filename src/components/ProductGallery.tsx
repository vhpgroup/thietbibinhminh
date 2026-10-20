'use client'

import { useEffect, useRef, useState } from 'react'
import type { StoreProduct } from '@/lib/storefront'
import { ProductVisual } from './ProductVisual'

export function ProductGallery({product}:{product:StoreProduct}) {
 const images=[...new Map([product.image,...product.gallery].filter((image)=>!!image).map(image=>[image!.url,image!])).values()]
 const [selected,setSelected]=useState(0)
 const image=images[selected]||product.image
 const dialog=useRef<HTMLDialogElement>(null)
 const [open,setOpen]=useState(false)
 useEffect(()=>{if(open)dialog.current?.showModal();else dialog.current?.close()},[open])
 return <><button type="button" onClick={()=>setOpen(true)} className="group relative block aspect-square w-full overflow-hidden rounded-2xl border border-slate-100 bg-white" aria-label={`Phóng to ảnh ${product.name}`}><ProductVisual key={image?.url} image={image} name={product.name} category={product.category} variant="detail"/><span className="absolute bottom-4 right-4 rounded-full border border-slate-200 bg-white/95 px-3 py-1.5 text-[11px] text-slate-500">⤢ Phóng to</span>{product.badge&&<span className="absolute left-4 top-4 rounded-md bg-[#fff4d2] px-3 py-1 text-xs font-bold text-[#7b5b13]">{product.badge}</span>}</button><div className="mt-3 flex gap-2 overflow-x-auto pb-1">{images.map((item,index)=><button key={item.url} type="button" aria-label={`Xem ảnh ${index+1}`} aria-pressed={index===selected} onClick={()=>setSelected(index)} className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 bg-white ${index===selected?'border-[#087c36]':'border-slate-100'}`}><ProductVisual image={item} name={product.name} category={product.category}/></button>)}</div><p className="mt-3 text-center text-xs text-slate-400">Hình ảnh sản phẩm · {product.brand}</p><dialog ref={dialog} onCancel={()=>setOpen(false)} onClose={()=>setOpen(false)} className="fixed inset-0 m-auto w-[min(900px,94vw)] rounded-2xl bg-white p-5 backdrop:bg-black/60"><div className="mb-3 flex items-center justify-between gap-5"><span className="text-sm font-semibold">{product.name}</span><button type="button" onClick={()=>setOpen(false)} aria-label="Đóng ảnh" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-100 text-xl">×</button></div><div className="relative h-[min(70vh,650px)]"><ProductVisual key={image?.url} image={image} name={product.name} category={product.category} variant="detail"/></div></dialog></>
}
