import { Link } from "react-router";
import { StorePage } from "../components/StoreShell";

const values = [
  { number: "01", title: "Đúng nhu cầu", text: "Bắt đầu từ bài toán thực tế, không bắt đầu từ sản phẩm cần bán." },
  { number: "02", title: "Đúng cam kết", text: "Minh bạch cấu hình, xuất xứ, chi phí và tiến độ trong mọi dự án." },
  { number: "03", title: "Đồng hành dài hạn", text: "Hỗ trợ xuyên suốt vòng đời thiết bị, từ triển khai đến nâng cấp." },
];

export default function AboutPage() {
  return (
    <StorePage>
      <main>
        <section className="mx-auto max-w-[1320px] px-4 pb-8 pt-8 lg:px-6 lg:pb-14 lg:pt-12">
          <div className="relative min-h-[560px] overflow-hidden rounded-[36px] bg-[#043d20]">
            <img className="absolute inset-0 h-full w-full object-cover opacity-45" src="https://images.unsplash.com/photo-1758691737124-05c5bffe46f0?auto=format&fit=crop&w=1600&q=88" alt="Đội ngũ cùng trao đổi giải pháp công nghệ" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#032f18] via-[#043d20]/85 to-transparent" />
            <div className="relative flex min-h-[560px] max-w-3xl flex-col justify-center p-7 text-white sm:p-12 lg:p-16">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#f6b511]">Về Bình Minh</p>
              <h1 className="future-title mt-5 text-4xl font-black leading-none sm:text-6xl">Công nghệ chỉ có ý nghĩa khi tạo ra tiến bộ.</h1>
              <p className="mt-6 max-w-xl text-sm leading-7 text-green-50/75 sm:text-base">Bình Minh kết nối thiết bị chính hãng, năng lực tích hợp và dịch vụ tận tâm để biến những bài toán phức tạp thành giải pháp dễ vận hành.</p>
              <Link to="/lien-he" className="mt-8 w-fit rounded-full bg-[#e31820] px-6 py-3.5 text-xs font-extrabold">Bắt đầu một cuộc trò chuyện</Link>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1320px] gap-10 px-4 py-12 lg:grid-cols-[0.8fr_1.2fr] lg:px-6 lg:py-20">
          <div><p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#e31820]">Chúng tôi là ai</p><h2 className="future-title mt-3 text-3xl font-black sm:text-5xl">Một đối tác công nghệ<br />có tư duy dài hạn.</h2></div>
          <div className="grid gap-6 text-sm leading-7 text-slate-600 sm:grid-cols-2">
            <p>Chúng tôi phục vụ cả khách hàng cá nhân và tổ chức, từ một thiết bị làm việc đáng tin cậy đến hạ tầng công nghệ quy mô doanh nghiệp. Mỗi giải pháp đều được lựa chọn dựa trên hiệu quả sử dụng thực tế.</p>
            <p>Thay vì chạy theo mọi xu hướng, Bình Minh tập trung vào công nghệ có khả năng thích ứng, dễ quản trị và tạo ra giá trị lâu dài. Đó là cách chúng tôi chuẩn bị cùng khách hàng cho giai đoạn 2027 và xa hơn.</p>
          </div>
        </section>

        <section className="bg-[#e8f2e8]/65">
          <div className="mx-auto max-w-[1320px] px-4 py-14 lg:px-6 lg:py-20">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[["15+", "năm kinh nghiệm"], ["9", "nhóm giải pháp"], ["60+", "đối tác công nghệ"], ["24/7", "hỗ trợ hệ thống"]].map(([value, label]) => (
                <div key={label} className="soft-card rounded-[24px] bg-white/80 p-6"><strong className="text-4xl font-black text-[#087c36]">{value}</strong><p className="mt-2 text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p></div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1320px] px-4 py-14 lg:px-6 lg:py-20">
          <div className="mb-8 max-w-2xl"><p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#e31820]">Nguyên tắc đồng hành</p><h2 className="future-title mt-3 text-3xl font-black sm:text-5xl">Ba điều không thay đổi.</h2></div>
          <div className="grid gap-5 md:grid-cols-3">
            {values.map((value) => <article key={value.number} className="product-card rounded-[26px] border bg-white p-7"><span className="text-xs font-black text-[#e31820]">{value.number}</span><h3 className="mt-10 text-2xl font-black">{value.title}</h3><p className="mt-3 text-sm leading-7 text-slate-500">{value.text}</p></article>)}
          </div>
        </section>

        <section className="mx-auto max-w-[1320px] px-4 pb-8 lg:px-6">
          <div className="flex flex-col items-start justify-between gap-6 rounded-[32px] bg-[#087c36] p-8 text-white sm:flex-row sm:items-center lg:p-12">
            <div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#f6b511]">Cùng kiến tạo bước tiếp theo</p><h2 className="future-title mt-2 text-3xl font-black">Bài toán của bạn là điểm bắt đầu.</h2></div>
            <Link to="/lien-he" className="shrink-0 rounded-full bg-white px-6 py-3.5 text-xs font-extrabold text-[#087c36]">Liên hệ Bình Minh <span className="ml-2">→</span></Link>
          </div>
        </section>
      </main>
    </StorePage>
  );
}
