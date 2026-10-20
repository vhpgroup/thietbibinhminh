import Image from 'next/image'
import Link from 'next/link'
import type { SiteSetting } from '@/payload-types'
import { companyDetails } from '@/lib/company'

export function SiteFooter({ settings }: { settings: SiteSetting }) {
  return <footer className="mt-16 border-t-4 border-[#f6b511] bg-[#043d20] text-white"><div className="mx-auto grid max-w-[1320px] gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
    <div><div className="w-fit rounded-xl bg-white p-1"><Image src="/binh-minh-logo.png" width={128} height={80} alt="Bình Minh" className="h-20 w-32 object-contain" /></div><h2 className="mt-4 text-sm font-bold leading-6">{settings.companyName || companyDetails.companyName}</h2><p className="mt-2 text-sm leading-6 text-green-100/70">Mã số doanh nghiệp: {settings.businessCode || companyDetails.businessCode}<br />{settings.address || companyDetails.address}</p>{settings.footerDescription && <p className="mt-3 text-sm leading-6 text-green-100/70">{settings.footerDescription}</p>}</div>
    <div><h2 className="mb-4 font-bold">Về Bình Minh</h2><Link className="mb-2 block text-sm text-green-100/70 hover:text-white" href="/gioi-thieu">Giới thiệu</Link><Link className="mb-2 block text-sm text-green-100/70 hover:text-white" href="/tin-tuc">Tin tức công nghệ</Link></div>
    <div><h2 className="mb-4 font-bold">Hỗ trợ khách hàng</h2>{[['bao-hanh', 'Chính sách bảo hành'], ['giao-nhan', 'Giao nhận'], ['doi-tra', 'Đổi trả và hoàn tiền'], ['mua-hang-doanh-nghiep', 'Mua hàng doanh nghiệp'], ['bao-mat', 'Bảo mật thông tin'], ['dieu-khoan', 'Điều khoản sử dụng']].map(([slug, title]) => <Link key={slug} href={`/chinh-sach/${slug}`} className="mb-2 block text-sm text-green-100/70 hover:text-white">{title}</Link>)}</div>
    <div><h2 className="mb-4 font-bold">Tổng đài tư vấn</h2><a href={`tel:${(settings.hotline || companyDetails.hotline).replace(/\s/g, '')}`} className="text-2xl font-black text-[#f6b511]">{settings.hotline || companyDetails.hotline}</a><p className="mt-2 text-xs leading-6 text-green-100/70">Tư vấn thiết bị và giải pháp phù hợp.</p>{settings.email && <a href={`mailto:${settings.email}`} className="mt-2 block text-sm text-green-100/70">{settings.email}</a>}<Link href="/lien-he" className="mt-4 block text-sm font-bold hover:text-[#f6b511]">Liên hệ Bình Minh →</Link><Link href="/admin" className="mt-5 inline-block text-xs font-bold text-white/50 hover:text-white">Quản trị nội dung</Link></div>
  </div></footer>
}
