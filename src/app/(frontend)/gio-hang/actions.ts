'use server'
import { headers } from 'next/headers'
import { isSpamForm } from '@/lib/submission-guard'
import { verifiedCommerce } from '@/lib/catalog-verification'
import { getPayloadClient } from '@/lib/payload'
export async function requestCart(form:FormData){
 if(isSpamForm(form))return {success:false,message:'Yêu cầu không hợp lệ.'}
 const text=(key:string)=>String(form.get(key)||'').trim()
 const name=text('name'),phone=text('phone'),email=text('email'),note=text('note')
 if(name.length<2||name.length>120||!/^[0-9+\s().-]{8,20}$/.test(phone)||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>160||note.length>1000)return {success:false,message:'Vui lòng nhập đầy đủ họ tên, số điện thoại và email hợp lệ.'}
 let lines:{slug:string;quantity:number}[]
 try{lines=JSON.parse(text('items'));if(!Array.isArray(lines)||!lines.length||lines.length>50||lines.some(x=>typeof x.slug!=='string'||x.slug.length>250||!Number.isInteger(x.quantity)||x.quantity<1||x.quantity>999)||new Set(lines.map(x=>x.slug)).size!==lines.length)throw new Error()}catch{return {success:false,message:'Giỏ hàng chưa hợp lệ. Vui lòng tải lại trang.'}}
 try{
 const payload=await getPayloadClient()
 const result=await payload.find({collection:'products',where:{slug:{in:lines.map(x=>x.slug)}},limit:50,depth:0,overrideAccess:false})
 if(result.docs.length!==lines.length)return {success:false,message:'Một sản phẩm không còn khả dụng. Vui lòng cập nhật giỏ hàng.'}
 const message=['Yêu cầu mua hàng / báo giá từ giỏ hàng:',...lines.map(line=>{const p=result.docs.find(x=>x.slug===line.slug)!;return `${p.sku} | ${p.name} | Số lượng: ${line.quantity} | ${verifiedCommerce(p).price>0?`${verifiedCommerce(p).price} VND/sp`:'Liên hệ báo giá'}`}),...(note?['Ghi chú: '+note]:[])].join('\n')
 await payload.create({collection:'contact-submissions',overrideAccess:false,req:{headers:await headers()},data:{name,phone,email,topic:'Mua sản phẩm',message}})
 return {success:true,message:'Đã gửi yêu cầu. Bình Minh sẽ liên hệ xác nhận sản phẩm, giá và giao hàng.'}
 }catch(error){return {success:false,message:error instanceof Error && 'status' in error && error.status===429?error.message:'Chưa gửi được yêu cầu. Vui lòng thử lại hoặc gọi 0876 645 432.'}}
}
