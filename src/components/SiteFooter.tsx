import Image from 'next/image'
import Link from 'next/link'

export function SiteFooter({ hotline, description }: { hotline?: string | null; description?: string | null }) {
  return <footer className="mt-16 border-t-4 border-[#f6b511] bg-[#043d20] text-white"><div className="mx-auto grid max-w-[1320px] gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
    <div><div className="w-fit rounded-xl bg-white p-1"><Image src="/binh-minh-logo.png" width={128} height={80} alt="Bình Minh" className="h-20 w-32 object-contain" /></div><p className="mt-4 max-w-xs text-sm leading-6 text-green-100/70">{description ?? 'Thiết bị và giải pháp công nghệ chính hãng.'}</p></div>
    <div><h2 className="mb-4 font-bold">Về Bình Minh</h2><Link className="mb-2 block text-sm text-green-100/70 hover:text-white" href="/gioi-thieu">Giới thiệu</Link><Link className="mb-2 block text-sm text-green-100/70 hover:text-white" href="/tin-tuc">Tin tức công nghệ</Link></div>
    <div><h2 className="mb-4 font-bold">Hỗ trợ khách hàng</h2>{['Chính sách bảo hành', 'Giao nhận', 'Đổi trả', 'Mua hàng doanh nghiệp'].map((item) => <span key={item} className="mb-2 block text-sm text-green-100/70">{item}</span>)}</div>
    <div><h2 className="mb-4 font-bold">Tổng đài tư vấn</h2><p className="text-2xl font-black text-[#f6b511]">{hotline ?? '1800 6868'}</p><p className="mt-1 text-xs text-green-100/70">Miễn phí • 8:00 — 21:30 mỗi ngày</p><Link href="/admin" className="mt-5 inline-block text-xs font-bold text-white/50 hover:text-white">Quản trị nội dung</Link></div>
  </div></footer>
}
