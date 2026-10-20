'use client'
import Link from 'next/link'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { StoreProduct } from '@/lib/storefront'

export type CartItem = {slug:string;name:string;price:number;quantity:number}
const CartContext=createContext<{items:CartItem[];ready:boolean;add:(p:StoreProduct)=>void;quantity:(slug:string,n:number)=>void;remove:(slug:string)=>void;clear:()=>void}|null>(null)
export function CartProvider({children}:{children:ReactNode}) {
 const [items,setItems]=useState<CartItem[]>([])
 const [ready,setReady]=useState(false)
 useEffect(()=>{let active=true;const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),8000);(async()=>{
   try {
     const data=JSON.parse(localStorage.getItem('binhminh-cart-datcang-v1')||'[]')
     const saved:CartItem[]=Array.isArray(data)?data.filter(x=>typeof x.slug==='string'&&typeof x.name==='string'&&Number.isInteger(x.quantity)&&x.quantity>0&&x.quantity<=999).slice(0,50):[]
     if(saved.length){
       // Saved prices can be stale; show no numeric price until the server has checked them.
       if(active)setItems(saved.map(x=>({...x,price:0})))
       const response=await fetch('/api/cart-prices',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({slugs:saved.map(x=>x.slug)}),signal:controller.signal})
       if(response.ok){const current=await response.json();if(active)setItems(saved.flatMap(item=>{const p=current.items.find((x:CartItem)=>x.slug===item.slug);return p?[{...p,quantity:item.quantity}]:[]}))}
     }
   }catch{}finally{clearTimeout(timer);if(active)setReady(true)}
 })();return()=>{active=false;clearTimeout(timer);controller.abort()}},[])
 useEffect(()=>{if(ready){try{localStorage.setItem('binhminh-cart-datcang-v1',JSON.stringify(items))}catch{}}},[items,ready])
 const add=(p:StoreProduct)=>setItems(current=>current.some(x=>x.slug===p.slug)?current.map(x=>x.slug===p.slug?{...x,quantity:Math.min(999,x.quantity+1)}:x):current.length<50?[...current,{slug:p.slug,name:p.name,price:p.price,quantity:1}]:current)
 return <CartContext.Provider value={{items,ready,add,quantity:(slug,n)=>setItems(current=>current.map(x=>x.slug===slug?{...x,quantity:Math.max(1,Math.min(999,Math.floor(n)||1))}:x)),remove:slug=>setItems(current=>current.filter(x=>x.slug!==slug)),clear:()=>setItems([])}}>{children}</CartContext.Provider>
}
export function useCart(){const cart=useContext(CartContext);if(!cart)throw new Error('CartProvider missing');return cart}
export function CartLink(){const {items}=useCart();const count=items.reduce((sum,x)=>sum+x.quantity,0);return <Link href="/gio-hang" aria-label={`Giỏ hàng${count?`, ${count} sản phẩm`:''}`} className="relative grid h-11 w-11 place-items-center rounded-full bg-[#eef7f0]"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M3 4h2l2.2 11h10.9l2-7H6.2"/><circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/></svg>{count>0&&<span className="absolute -right-1 -top-1 rounded-full bg-[#e31820] px-1.5 text-[10px] font-bold text-white">{count}</span>}</Link>}
export function AddToCart({product,compact=false}:{product:StoreProduct;compact?:boolean}) {
 const {add,ready,items}=useCart()
 const [added,setAdded]=useState(false)
 const disabled=!ready||(!items.some(x=>x.slug===product.slug)&&items.length>=50)
 const addProduct=()=>{add(product);setAdded(true)}
 if(compact)return <div className="shrink-0"><button type="button" disabled={disabled} onClick={addProduct} aria-label={`Thêm vào giỏ hàng: ${product.name}`} title={added?'Đã thêm vào giỏ · Bấm để thêm tiếp':'Thêm vào giỏ hàng'} className="grid h-9 w-9 place-items-center rounded-lg bg-[#087c36] text-white transition hover:bg-[#065e29] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087c36] disabled:opacity-50">{added?<span aria-hidden="true" className="text-lg">✓</span>:<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h2l2.4 12h11.8L22 7H6"/><circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/><path d="M14 3v6m-3-3h6"/></svg>}</button><span role="status" className="sr-only">{added?`Đã thêm ${product.name} vào giỏ hàng`:''}</span></div>
 return <div><button type="button" disabled={disabled} onClick={addProduct} className="mt-3 w-full rounded-xl border border-[#087c36] bg-white px-3 py-2.5 text-xs font-bold text-[#087c36] hover:bg-[#f0f7f1] disabled:opacity-50">{added?'✓ Thêm tiếp vào giỏ':'Thêm vào giỏ hàng'}</button>{added&&<Link href="/gio-hang" role="status" className="mt-1 block text-center text-xs text-[#087c36]">Đã thêm · Xem giỏ hàng →</Link>}</div>
}
