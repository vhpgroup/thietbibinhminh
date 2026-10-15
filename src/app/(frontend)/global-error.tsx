'use client'

export default function FrontendGlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="vi">
      <body className="flex min-h-screen items-center justify-center bg-[#f4f6f0] p-6 text-[#183126]">
        <main className="text-center">
          <h1 className="text-3xl font-black">Có lỗi xảy ra</h1>
          <p className="mt-3 text-sm text-slate-600">Vui lòng thử lại hoặc quay về trang chủ.</p>
          <button onClick={reset} className="mt-6 rounded-full bg-[#087c36] px-5 py-3 text-xs font-bold text-white">Thử lại</button>
        </main>
      </body>
    </html>
  )
}
