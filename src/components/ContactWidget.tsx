'use client'

import { useState } from 'react'

// Thay các URL này khi có kênh tư vấn chính thức.
const supportLinks = {
  ai: '/lien-he?channel=ai',
  messenger: '/lien-he?channel=messenger',
}

export function ContactWidget() {
  const [open, setOpen] = useState(false)
  return <aside className="fixed bottom-5 right-4 z-50 w-[210px] max-w-[calc(100vw-32px)]" aria-label="Tư vấn Bình Minh">
    {open && <div id="contact-options" className="mb-2 space-y-2">
      <a href={supportLinks.ai} className="flex items-center gap-2 rounded-2xl border border-slate-100 bg-white px-3 py-3 shadow-lg">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-indigo-600 text-white"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="4" y="7" width="16" height="13" rx="3"/><path d="M12 3v4M1 12h3m16 0h3M8 12v3m8-3v3m-8 2h8"/></svg></span>
        <span><strong className="block whitespace-nowrap text-[13px] leading-5 text-slate-800">Chat với AI Bình Minh</strong><small className="block whitespace-nowrap text-[11px] leading-4 text-slate-500">Đang cập nhật</small></span>
      </a>
      <a href="https://zalo.me/0876645432" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-2xl border border-slate-100 bg-white px-3 py-3 shadow-lg">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#edf5ff] text-[11px] font-black text-[#0068ff]">Zalo</span>
        <span><strong className="block whitespace-nowrap text-[13px] leading-5 text-slate-800">Tư vấn qua Zalo</strong><small className="block whitespace-nowrap text-[11px] leading-4 text-slate-500">0876 645 432</small></span>
      </a>
      <a href={supportLinks.messenger} className="flex items-center gap-2 rounded-2xl border border-slate-100 bg-white px-3 py-3 shadow-lg">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-blue-500 via-violet-500 to-pink-500 text-white"><svg width="23" height="23" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3C6.5 3 2 7 2 12c0 2.7 1.3 5.1 3.5 6.7V22l3.3-1.8c1 .3 2.1.5 3.2.5 5.5 0 10-4 10-8.7S17.5 3 12 3Z"/><path d="m6 15 5-5 3 2 4-3-5 6-3-2Z" fill="#8b5cf6"/></svg></span>
        <span><strong className="block whitespace-nowrap text-[13px] leading-5 text-slate-800">Facebook Messenger</strong><small className="block whitespace-nowrap text-[11px] leading-4 text-slate-500">Đang cập nhật</small></span>
      </a>
      <a href="tel:0876645432" className="flex items-center gap-2 rounded-2xl border border-slate-100 bg-white px-3 py-3 shadow-lg">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#169c61] text-white"><svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="m7 3 3 5-2 2c2 3 3 4 6 6l2-2 5 3c-1 4-3 5-6 3C8 17 4 13 3 7c0-2 1-3 4-4Z" /></svg></span>
        <span><strong className="block whitespace-nowrap text-[13px] leading-5 text-slate-800">Gọi 0876 645 432</strong><small className="block whitespace-nowrap text-[11px] leading-4 text-slate-500">Hotline tư vấn</small></span>
      </a>
    </div>}
    <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="contact-options" className="flex w-full items-center justify-center gap-3 rounded-full bg-[#e31820] px-5 py-3.5 text-sm font-extrabold text-white shadow-lg transition hover:bg-[#c5131a]">
      <span className="text-xl leading-none" aria-hidden="true">{open ? '×' : '☏'}</span>Tư vấn Bình Minh
    </button>
  </aside>
}

