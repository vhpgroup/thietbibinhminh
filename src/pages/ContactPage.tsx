import { useState } from "react";
import { StorePage } from "../components/StoreShell";

const contactItems = [
  { label: "Tư vấn bán hàng", value: "1800 6868", note: "Miễn phí • 8:00 — 21:30" },
  { label: "Email", value: "hello@binhminh.vn", note: "Phản hồi trong 2 giờ làm việc" },
  { label: "Văn phòng", value: "Hà Nội, Việt Nam", note: "Thứ 2 — Thứ 7" },
];

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <StorePage>
      <main>
        <section className="mx-auto max-w-[1320px] px-4 py-10 lg:px-6 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
            <div className="flex flex-col justify-between">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#e31820]">Liên hệ Bình Minh</p>
                <h1 className="future-title mt-4 text-4xl font-black leading-none sm:text-6xl">Cùng tìm lời giải<br /><span className="text-[#087c36]">phù hợp nhất.</span></h1>
                <p className="mt-6 max-w-lg text-sm leading-7 text-slate-600">Cho chúng tôi biết nhu cầu của bạn. Đội ngũ tư vấn sẽ kết nối đúng chuyên gia và phản hồi trong thời gian sớm nhất.</p>
              </div>
              <div className="mt-10 space-y-3">
                {contactItems.map((item) => <div key={item.label} className="tech-pill rounded-[20px] p-5"><p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">{item.label}</p><p className="mt-1 text-lg font-black text-[#087c36]">{item.value}</p><p className="mt-1 text-xs text-slate-500">{item.note}</p></div>)}
              </div>
            </div>

            <div className="soft-card overflow-hidden rounded-[32px] bg-white">
              <div className="relative h-48 overflow-hidden sm:h-56">
                <img className="h-full w-full object-cover" src="https://images.unsplash.com/photo-1766066014237-00645c74e9c6?auto=format&fit=crop&w=1200&q=85" alt="Chuyên viên hỗ trợ khách hàng Bình Minh" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#043d20]/75 to-transparent" />
                <p className="absolute bottom-5 left-6 text-sm font-bold text-white">Chuyên gia sẵn sàng lắng nghe</p>
              </div>
              {sent ? (
                <div className="flex min-h-[480px] flex-col items-center justify-center p-8 text-center">
                  <span className="grid h-16 w-16 place-items-center rounded-full bg-[#e8f2e8] text-2xl font-black text-[#087c36]">✓</span>
                  <h2 className="mt-6 text-2xl font-black">Đã nhận yêu cầu của bạn</h2>
                  <p className="mt-3 max-w-sm text-sm leading-7 text-slate-500">Đội ngũ Bình Minh sẽ liên hệ lại trong thời gian sớm nhất. Cảm ơn bạn đã tin tưởng.</p>
                  <button onClick={() => setSent(false)} className="mt-6 rounded-full border border-[#087c36] px-5 py-3 text-xs font-extrabold text-[#087c36]">Gửi yêu cầu khác</button>
                </div>
              ) : (
                <form className="grid gap-5 p-6 sm:grid-cols-2 sm:p-9" onSubmit={(event) => { event.preventDefault(); setSent(true); }}>
                  <label className="text-xs font-bold">Họ và tên<input required className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-[#f7f9f5] px-4 text-sm font-normal outline-none focus:border-[#087c36]" placeholder="Nguyễn Văn A" /></label>
                  <label className="text-xs font-bold">Số điện thoại<input required type="tel" className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-[#f7f9f5] px-4 text-sm font-normal outline-none focus:border-[#087c36]" placeholder="09xx xxx xxx" /></label>
                  <label className="text-xs font-bold">Email<input required type="email" className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-[#f7f9f5] px-4 text-sm font-normal outline-none focus:border-[#087c36]" placeholder="email@congty.vn" /></label>
                  <label className="text-xs font-bold">Bạn đang quan tâm<select className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-[#f7f9f5] px-4 text-sm font-normal outline-none focus:border-[#087c36]"><option>Mua sản phẩm</option><option>Tư vấn giải pháp</option><option>Báo giá dự án</option><option>Hỗ trợ kỹ thuật</option></select></label>
                  <label className="text-xs font-bold sm:col-span-2">Nội dung cần tư vấn<textarea required rows={5} className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-[#f7f9f5] p-4 text-sm font-normal leading-6 outline-none focus:border-[#087c36]" placeholder="Mô tả ngắn nhu cầu, quy mô hoặc sản phẩm bạn quan tâm..." /></label>
                  <label className="flex items-start gap-2 text-[11px] font-normal leading-5 text-slate-500 sm:col-span-2"><input required type="checkbox" className="mt-1 accent-[#087c36]" /> Tôi đồng ý để Bình Minh sử dụng thông tin trên nhằm mục đích tư vấn và hỗ trợ.</label>
                  <button className="h-12 rounded-full bg-[#e31820] px-6 text-xs font-extrabold text-white transition hover:-translate-y-0.5 sm:col-span-2">Gửi yêu cầu tư vấn <span className="ml-2">→</span></button>
                </form>
              )}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1320px] px-4 pb-6 lg:px-6">
          <div className="grid overflow-hidden rounded-[28px] bg-[#043d20] text-white md:grid-cols-[1fr_1.3fr]">
            <div className="p-7 sm:p-10"><p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#f6b511]">Trung tâm trải nghiệm</p><h2 className="future-title mt-3 text-3xl font-black">Gặp trực tiếp đội ngũ Bình Minh.</h2><p className="mt-4 text-sm leading-7 text-green-50/70">Mang theo bài toán của bạn, chúng tôi sẽ cùng khảo sát, demo và đề xuất phương án phù hợp.</p></div>
            <div className="relative min-h-64 bg-[#0b5d32]"><div className="absolute inset-5 rounded-[20px] border border-white/15 bg-[radial-gradient(circle_at_center,rgba(246,181,17,0.18),transparent_35%)]"><span className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#e31820] text-xl text-white shadow-xl">●</span><span className="absolute bottom-5 left-5 text-xs font-bold">Hà Nội • Việt Nam</span></div></div>
          </div>
        </section>
      </main>
    </StorePage>
  );
}
