'use client'
import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { CatalogFilters } from '@/lib/storefront'

type Category={name:string;slug:string;id:number;parent:number|null}
export function CatalogFilterBar({categories,brands,filters}:{categories:Category[];brands:{name:string;slug:string}[];filters:CatalogFilters}) {
 const router=useRouter()
 const [pending,start]=useTransition()
 const [value,setValue]=useState(filters)
 useEffect(()=>setValue(filters),[filters])
 const selected=categories.find(c=>c.slug===value.category)
 const path:Category[]=[]
 let node=selected
 const seen=new Set<number>()
 while(node&&!seen.has(node.id)){seen.add(node.id);path.unshift(node);node=categories.find(c=>c.id===node?.parent)}
 const levels=[categories.filter(c=>!c.parent),...path.map(parent=>categories.filter(c=>c.parent===parent.id)).filter(options=>options.length>0)]
 function update(patch:Partial<CatalogFilters>){const next={...value,...patch,page:1};setValue(next);const params=new URLSearchParams();if(next.category)params.set('category',next.category);if(next.brand)params.set('brand',next.brand);if(next.search)params.set('search',next.search);if(next.sort!=='featured')params.set('sort',next.sort);start(()=>router.replace(`/san-pham${params.size?'?'+params:''}`,{scroll:false}))}
 const selectClass='mt-1.5 h-11 w-full min-w-0 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#087c36]'
 return <section aria-label="Bộ lọc sản phẩm" aria-busy={pending} className="rounded-xl border border-slate-200 bg-white p-4"><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{levels.map((options,level)=>options.length>0&&<label key={level} className="min-w-0 text-xs font-semibold text-slate-500">{['Nhóm sản phẩm','Loại sản phẩm','Danh mục chi tiết','Dòng sản phẩm'][level]}<select aria-label={['Nhóm sản phẩm','Loại sản phẩm','Danh mục chi tiết','Dòng sản phẩm'][level]} className={selectClass} value={path[level]?.slug||''} onChange={e=>update({category:e.target.value||path[level-1]?.slug||'',brand:''})}><option value="">{level===0?'Tất cả nhóm':'Tất cả'}</option>{options.map(c=><option key={c.id} value={c.slug}>{c.name}</option>)}</select></label>)}<label className="min-w-0 text-xs font-semibold text-slate-500">Thương hiệu<select aria-label="Thương hiệu" value={value.brand} onChange={e=>update({brand:e.target.value})} className={selectClass}><option value="">Tất cả thương hiệu</option>{brands.map(b=><option key={b.slug} value={b.slug}>{b.name}</option>)}</select></label><label className="min-w-0 text-xs font-semibold text-slate-500">Sắp xếp<select aria-label="Sắp xếp" value={value.sort} onChange={e=>update({sort:e.target.value})} className={selectClass}><option value="featured">Phù hợp nhất</option><option value="price-asc">Giá tăng dần</option><option value="price-desc">Giá giảm dần</option><option value="rating">Đánh giá tốt</option></select></label></div><div className="mt-3 flex min-h-5 items-center justify-between gap-3 text-xs"><span role="status" className="text-[#087c36]">{pending?'Đang cập nhật sản phẩm…':'Chọn bộ lọc để xem sản phẩm phù hợp'}</span>{(value.category||value.brand||value.search||value.sort!=='featured')&&<button type="button" onClick={()=>update({category:'',brand:'',search:'',sort:'featured'})} className="shrink-0 font-semibold text-red-600">Xóa bộ lọc</button>}</div></section>
}
