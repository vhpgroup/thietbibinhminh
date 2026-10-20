import Link from 'next/link'
import { getSiteSettings } from '@/lib/storefront'
import { companyDetails } from '@/lib/company'

export const metadata = { title: 'Giới thiệu Bình Minh', description: 'Thông tin Công ty TNHH Phát triển Thương mại Thiết bị Bình Minh.', alternates: { canonical: '/gioi-thieu' } }

export default async function AboutPage() {
  const settings = await getSiteSettings()
  return <main>
    <section className="mx-auto max-w-[1320px] px-4 py-10 lg:px-6"><div className="relative overflow-hidden rounded-[36px] bg-[#043d20] p-8 text-white sm:p-14 lg:p-20"><div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-[#087c36]/60 blur-3xl" /><p className="relative text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#f6b511]">Về Bình Minh</p><h1 className="future-title relative mt-5 max-w-4xl text-4xl font-black leading-none sm:text-6xl">Công nghệ chỉ có ý nghĩa khi tạo ra tiến bộ.</h1><p className="relative mt-6 max-w-2xl text-sm leading-7 text-white/70">Bình Minh kết nối thiết bị chính hãng, năng lực tích hợp và dịch vụ tận tâm để biến những bài toán phức tạp thành giải pháp dễ vận hành.</p><Link href="/lien-he" className="relative mt-8 inline-block rounded-full bg-[#e31820] px-6 py-3 text-xs font-extrabold">Bắt đầu một cuộc trò chuyện</Link></div></section>
    <section className="mx-auto grid max-w-[1320px] gap-10 px-4 py-14 lg:grid-cols-2 lg:px-6"><h2 className="future-title text-3xl font-black sm:text-5xl">Một đối tác công nghệ<br />có tư duy dài hạn.</h2><div className="grid gap-5 text-sm leading-7 text-slate-600 sm:grid-cols-2"><p>Chúng tôi phục vụ từ một thiết bị làm việc đáng tin cậy đến hạ tầng công nghệ quy mô doanh nghiệp.</p><p>Bình Minh tập trung vào công nghệ có khả năng thích ứng, dễ quản trị và tạo ra giá trị lâu dài.</p></div></section>
    <section className="border-y border-slate-100 bg-white"><div className="mx-auto max-w-[1320px] px-4 py-14 lg:px-6"><h2 className="text-2xl font-black text-[#087c36]">Thông tin doanh nghiệp</h2><p className="mt-5 text-lg font-bold leading-8">{settings.companyName || companyDetails.companyName}</p><dl className="mt-6 grid gap-6 sm:grid-cols-2">{[['Mã số doanh nghiệp', settings.businessCode || companyDetails.businessCode], ['Trụ sở', settings.address || companyDetails.address], ['Người đại diện', settings.legalRepresentative || companyDetails.legalRepresentative], ['Chức vụ', settings.representativeTitle || companyDetails.representativeTitle]].map(([label, value]) => <div key={label}><dt className="text-sm text-slate-500">{label}</dt><dd className="mt-2 font-semibold leading-7 text-[#183126]">{value}</dd></div>)}</dl></div></section>
  </main>
}
