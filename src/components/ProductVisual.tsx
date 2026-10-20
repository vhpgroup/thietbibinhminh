'use client'

import Image from 'next/image'
import { useState } from 'react'
import type { StoreMedia } from '@/lib/storefront'

export function ProductVisual({ image, name, category, variant = 'card' }: {
  image: StoreMedia | null
  name: string
  category: string
  variant?: 'card' | 'home' | 'detail'
}) {
  const [failed, setFailed] = useState(false)
  if (image && !failed) {
    return <Image
      src={image.url}
      alt={image.alt || name}
      fill
      sizes={variant === 'detail' ? '(max-width: 1024px) 100vw, 50vw' : '(max-width: 640px) 45vw, 230px'}
      className="object-contain p-3 transition duration-500 group-hover:scale-105"
      onError={() => setFailed(true)}
      priority={variant === 'detail'}
    />
  }

  return <div className="flex h-full w-full flex-col items-center justify-center bg-white px-3 text-center">
    <span className={`${variant === 'detail' ? 'text-8xl' : 'text-6xl'} font-light text-[#087c36]/35`}>▣</span>
    <span className="mt-2 max-w-full truncate text-[10px] font-bold uppercase tracking-wider text-[#087c36]/70">{category}</span>
    {variant === 'detail' && <span className="mt-2 text-xs text-slate-400">Ảnh sản phẩm đang được cập nhật</span>}
  </div>
}

