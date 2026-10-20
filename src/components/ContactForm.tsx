'use client'

import { useActionState } from 'react'
import { submitContact, type ContactState } from '@/app/(frontend)/lien-he/actions'

const initialState: ContactState = { success: false, message: '' }

export function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, initialState)
  if (state.success) return <div className="flex min-h-[480px] flex-col items-center justify-center p-8 text-center"><span className="grid h-16 w-16 place-items-center rounded-full bg-[#e8f2e8] text-2xl font-black text-[#087c36]">✓</span><h2 className="mt-6 text-2xl font-black">Đã nhận yêu cầu của bạn</h2><p className="mt-3 max-w-sm text-sm text-slate-500">{state.message}</p></div>
  return <form action={action} className="grid gap-5 p-6 sm:grid-cols-2 sm:p-9">
<div aria-hidden="true" className="hidden"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>    <label className="text-xs font-bold">Họ và tên<input name="name" required className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-[#f7f9f5] px-4 text-sm font-normal" />{state.errors?.name && <span className="mt-1 block text-[10px] text-red-600">{state.errors.name}</span>}</label>
    <label className="text-xs font-bold">Số điện thoại<input name="phone" required className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-[#f7f9f5] px-4 text-sm font-normal" />{state.errors?.phone && <span className="mt-1 block text-[10px] text-red-600">{state.errors.phone}</span>}</label>
    <label className="text-xs font-bold">Email<input name="email" type="email" required className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-[#f7f9f5] px-4 text-sm font-normal" />{state.errors?.email && <span className="mt-1 block text-[10px] text-red-600">{state.errors.email}</span>}</label>
    <label className="text-xs font-bold">Bạn đang quan tâm<select name="topic" className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-[#f7f9f5] px-4 text-sm font-normal">{['Mua sản phẩm', 'Tư vấn giải pháp', 'Báo giá dự án', 'Hỗ trợ kỹ thuật'].map((item) => <option key={item}>{item}</option>)}</select></label>
    <label className="text-xs font-bold sm:col-span-2">Nội dung<textarea name="message" required rows={5} className="mt-2 w-full rounded-xl border border-slate-200 bg-[#f7f9f5] p-4 text-sm font-normal" />{state.errors?.message && <span className="mt-1 block text-[10px] text-red-600">{state.errors.message}</span>}</label>
    {state.message && <p className="text-xs text-red-600 sm:col-span-2">{state.message}</p>}
    <p className="text-xs leading-6 text-slate-500 sm:col-span-2">Thông tin được dùng để xử lý yêu cầu. <a href="/chinh-sach/bao-mat" className="underline">Chính sách bảo mật</a></p>
    <button disabled={pending} className="h-12 rounded-full bg-[#e31820] text-xs font-extrabold text-white disabled:opacity-60 sm:col-span-2">{pending ? 'Đang gửi...' : 'Gửi yêu cầu tư vấn →'}</button>
  </form>
}
