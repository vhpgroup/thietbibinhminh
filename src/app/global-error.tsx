'use client'

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="vi">
      <body className="flex min-h-screen items-center justify-center bg-[#f4f6f0] p-6 text-[#183126]">
        <main className="max-w-lg text-center">
          <p className="text-xs font-extrabold uppercase tracking-widest text-[#e31820]">Bình Minh</p>
          <h1 className="mt-3 text-3xl font-black">Có lỗi xảy ra</h1>
          <p className="mt-3 text-sm text-slate-600">Vui lòng thử tải lại nội dung hoặc quay về trang chủ.</p>
          <div className="mt-6 flex justify-center gap-3">
            <button onClick={reset} className="rounded-full bg-[#087c36] px-5 py-3 text-xs font-bold text-white">Thử lại</button>
            <a href="/" className="rounded-full border border-[#087c36] px-5 py-3 text-xs font-bold text-[#087c36]">Về trang chủ</a>
          </div>
        </main>
      </body>
    </html>
  )
}
