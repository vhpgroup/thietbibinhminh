'use client'

import Link from 'next/link'
import { useEffect, useRef, useState, type FocusEvent, type KeyboardEvent } from 'react'

export type CategoryMenuLink = { name: string; slug: string; children?: CategoryMenuLink[] }

export function CategoryMenuBranch({ item }: { item: CategoryMenuLink }) {
  const row = useRef<HTMLLIElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState<{ left: number; top: number } | null>(null)
  const children = item.children || []
  const hasChildren = children.length > 0
  const panelID = `category-children-${item.slug}`

  function open() {
    if (!hasChildren || !row.current) return
    const bounds = row.current.getBoundingClientRect()
    const width = 220
    const height = Math.min(children.length * 34 + 16, window.innerHeight - 32)
    setPosition({
      left: bounds.right + width <= window.innerWidth - 16 ? bounds.right : Math.max(16, bounds.left - width),
      top: Math.max(16, Math.min(bounds.top - 7, window.innerHeight - height - 16)),
    })
  }

  useEffect(() => {
    if (!position) return
    const close = (event: Event) => {
      if (event.target instanceof Node && panel.current?.contains(event.target)) return
      setPosition(null)
    }
    window.addEventListener('scroll', close, true)
    window.addEventListener('resize', close)
    return () => {
      window.removeEventListener('scroll', close, true)
      window.removeEventListener('resize', close)
    }
  }, [position])

  function blur(event: FocusEvent<HTMLLIElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) setPosition(null)
  }

  function keyboard(event: KeyboardEvent<HTMLLIElement>) {
    if (event.key === 'Escape') {
      event.preventDefault()
      trigger.current?.focus()
      setPosition(null)
    }
  }

  return <li ref={row} className="w-fit max-w-full" onMouseEnter={open} onMouseLeave={() => setPosition(null)} onFocus={open} onBlur={blur} onKeyDown={keyboard}>
    <div className="flex items-center gap-1">
      <Link href={`/danh-muc/${encodeURIComponent(item.slug)}`} className={`block text-xs leading-5 hover:text-[#e31820] ${position ? 'text-[#e31820] underline underline-offset-2' : 'text-slate-600'}`}>{item.name}</Link>
      {hasChildren && <button ref={trigger} type="button" aria-label={`Danh mục con ${item.name}`} aria-expanded={!!position} aria-controls={panelID} onClick={open} onKeyDown={(event) => {
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
          event.preventDefault()
          open()
          requestAnimationFrame(() => panel.current?.querySelector('a')?.focus())
        }
      }} className="grid h-5 w-4 shrink-0 place-items-center rounded text-slate-500 hover:text-[#e31820] focus-visible:outline-2 focus-visible:outline-[#087c36]">›</button>}
    </div>
    {hasChildren && position && <div ref={panel} id={panelID} aria-label={`Danh mục con ${item.name}`} style={position} className="fixed z-[65] max-h-[calc(100vh-32px)] w-[220px] overflow-y-auto rounded-lg border border-slate-200 bg-white py-2 shadow-[0_12px_30px_rgba(15,42,74,0.16)]">
      {children.map((child) => <Link key={child.slug} href={`/danh-muc/${encodeURIComponent(child.slug)}`} className="block px-4 py-2 text-xs leading-[18px] text-slate-700 hover:bg-slate-50 hover:text-[#e31820] focus-visible:bg-slate-50 focus-visible:text-[#e31820] focus-visible:outline-none">{child.name}</Link>)}
    </div>}
  </li>
}
