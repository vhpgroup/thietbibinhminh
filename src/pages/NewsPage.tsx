import { useState } from "react";
import { Link } from "react-router";
import { StorePage } from "../components/StoreShell";

type Article = {
  category: string;
  date: string;
  title: string;
  excerpt: string;
  image: string;
};

const articles: Article[] = [
  {
    category: "Xu hướng",
    date: "18.12.2026",
    title: "AI PC bước vào giai đoạn trưởng thành: Doanh nghiệp cần chuẩn bị gì?",
    excerpt: "Từ phần cứng NPU đến quản trị dữ liệu tại thiết bị, đây là những tiêu chí quan trọng khi xây dựng lộ trình AI PC cho năm 2027.",
    image: "https://images.unsplash.com/photo-1638821734607-02db76d614a6?auto=format&fit=crop&w=1200&q=85",
  },
  {
    category: "Hạ tầng mạng",
    date: "12.12.2026",
    title: "Wi-Fi 7 và mạng thích ứng: Nền tảng cho văn phòng thế hệ mới",
    excerpt: "Hạ tầng không dây đang chuyển từ kết nối đơn thuần sang khả năng tự tối ưu theo nhu cầu sử dụng.",
    image: "https://images.unsplash.com/photo-1691435828932-911a7801adfb?auto=format&fit=crop&w=900&q=85",
  },
  {
    category: "Chuyển đổi số",
    date: "05.12.2026",
    title: "Số hóa tài liệu thông minh giúp giảm 40% thời gian vận hành",
    excerpt: "Một quy trình số hóa đúng cách có thể tạo ra dữ liệu sạch, dễ tìm kiếm và sẵn sàng cho AI.",
    image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=900&q=85",
  },
  {
    category: "An ninh",
    date: "28.11.2026",
    title: "Camera AI biên: Riêng tư hơn, phản hồi nhanh hơn",
    excerpt: "Xử lý hình ảnh ngay tại thiết bị đang thay đổi cách doanh nghiệp triển khai hệ thống giám sát.",
    image: "https://images.unsplash.com/photo-1587090564077-c7b8f2f1249e?auto=format&fit=crop&w=900&q=85",
  },
  {
    category: "Góc tư vấn",
    date: "21.11.2026",
    title: "5 tiêu chí chọn UPS cho hệ thống máy chủ doanh nghiệp",
    excerpt: "Công suất chỉ là điểm khởi đầu. Khả năng quản trị, thời gian lưu điện và mở rộng mới tạo nên khác biệt.",
    image: "https://images.unsplash.com/photo-1538503529202-7a0e79cbb6f6?auto=format&fit=crop&w=900&q=85",
  },
  {
    category: "Bình Minh",
    date: "14.11.2026",
    title: "Bình Minh mở rộng dịch vụ tư vấn công nghệ trọn vòng đời",
    excerpt: "Từ khảo sát, thiết kế đến triển khai và bảo trì, doanh nghiệp chỉ cần một đầu mối đồng hành.",
    image: "https://images.unsplash.com/photo-1758691737124-05c5bffe46f0?auto=format&fit=crop&w=900&q=85",
  },
  {
    category: "Sản phẩm",
    date: "08.11.2026",
    title: "Laptop AI khác gì laptop thông thường?",
    excerpt: "NPU, thời lượng pin và trải nghiệm AI cục bộ là ba khác biệt đáng chú ý nhất.",
    image: "https://images.unsplash.com/photo-1565021324739-7493c5a74a13?auto=format&fit=crop&w=900&q=85",
  },
  {
    category: "Góc tư vấn",
    date: "02.11.2026",
    title: "Cách chọn máy scan phù hợp quy mô hồ sơ",
    excerpt: "Tốc độ, khay nạp và chu kỳ quét mỗi ngày quyết định hiệu quả đầu tư thực tế.",
    image: "https://images.unsplash.com/photo-1721830834983-f111ad63dbf4?auto=format&fit=crop&w=900&q=85",
  },
  {
    category: "Sản phẩm",
    date: "26.10.2026",
    title: "Thiết lập phòng họp hybrid gọn nhẹ trong 3 bước",
    excerpt: "Một cấu hình tối giản nhưng vẫn đảm bảo hình ảnh, âm thanh và khả năng cộng tác.",
    image: "https://images.unsplash.com/photo-1643327269452-a291a5f3f72a?auto=format&fit=crop&w=900&q=85",
  },
  {
    category: "Hạ tầng mạng",
    date: "18.10.2026",
    title: "Khi nào doanh nghiệp nên nâng cấp lên Wi-Fi 7?",
    excerpt: "Những dấu hiệu về mật độ thiết bị và độ trễ cho thấy hạ tầng hiện tại đã đến giới hạn.",
    image: "https://images.unsplash.com/photo-1548092372-0d1bd40894a3?auto=format&fit=crop&w=900&q=85",
  },
];

const categories = ["Tất cả", "Xu hướng", "Sản phẩm", "Góc tư vấn", "Chuyển đổi số", "Hạ tầng mạng", "An ninh", "Bình Minh"];

function ArticleMeta({ article, light = false }: { article: Article; light?: boolean }) {
  return <p className={`mt-2 flex items-center gap-2 text-[10px] font-semibold ${light ? "text-white/75" : "text-slate-400"}`}><span className={light ? "text-[#f6b511]" : "text-[#087c36]"}>{article.category}</span><span>•</span><span>{article.date}</span></p>;
}

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [featured, sideOne, sideTwo, ...rest] = articles;
  const filtered = activeCategory === "Tất cả" ? rest : articles.filter((article) => article.category === activeCategory);
  const latestLead = filtered[0];
  const latestList = filtered.slice(1, 5);

  return (
    <StorePage>
      <main className="bg-white">
        <section className="border-b border-slate-200 bg-white shadow-[0_4px_16px_rgba(6,75,39,0.06)]">
          <div className="mx-auto flex max-w-[1240px] items-center gap-3 px-4 py-3 lg:px-5">
            <Link to="/" aria-label="Trang chủ" className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#087c36] text-white">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10M9 20v-6h6v6" /></svg>
            </Link>
            <div className="flex min-w-0 flex-1 gap-1 overflow-x-auto pb-1">
              {categories.map((item) => <button key={item} onClick={() => setActiveCategory(item)} className={`shrink-0 rounded-lg px-4 py-2 text-xs font-bold transition ${activeCategory === item ? "bg-[#e8f2e8] text-[#087c36]" : "text-slate-600 hover:text-[#087c36]"}`}>{item}</button>)}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1240px] px-4 py-8 lg:px-5">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div><p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#e31820]">Bình Minh Newsroom</p><h1 className="future-title mt-1 text-3xl font-black text-[#07552a] sm:text-4xl">Tin được quan tâm</h1></div>
            <p className="hidden max-w-md text-right text-xs leading-6 text-slate-500 md:block">Cập nhật công nghệ, tư vấn lựa chọn và giải pháp vận hành hiệu quả.</p>
          </div>

          <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
            <article className="group relative min-h-[390px] overflow-hidden rounded-2xl sm:min-h-[500px]">
              <img className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" src={featured.image} alt={featured.title} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#042e19] via-[#042e19]/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
                <span className="rounded-md bg-[#e31820] px-2.5 py-1 text-[10px] font-extrabold uppercase">Nổi bật</span>
                <h2 className="mt-4 max-w-3xl text-2xl font-black leading-tight sm:text-4xl">{featured.title}</h2>
                <ArticleMeta article={featured} light />
                <p className="mt-3 hidden max-w-2xl text-sm leading-6 text-white/75 sm:block">{featured.excerpt}</p>
              </div>
            </article>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
              {[sideOne, sideTwo].map((article) => <article key={article.title} className="group">
                <div className="h-36 overflow-hidden rounded-xl sm:h-48 lg:h-[196px]"><img className="h-full w-full object-cover transition duration-500 group-hover:scale-105" src={article.image} alt={article.title} /></div>
                <h3 className="mt-3 line-clamp-2 text-sm font-black leading-6 sm:text-base">{article.title}</h3>
                <ArticleMeta article={article} />
              </article>)}
            </div>
          </div>

          <div className="mt-6 grid gap-4 border-t border-slate-200 pt-5 sm:grid-cols-3">
            {rest.slice(0, 3).map((article) => <article key={article.title} className="group flex gap-3">
              <div className="h-20 w-28 shrink-0 overflow-hidden rounded-lg"><img className="h-full w-full object-cover transition duration-500 group-hover:scale-105" src={article.image} alt="" /></div>
              <div><h3 className="line-clamp-3 text-xs font-bold leading-5 sm:text-sm">{article.title}</h3><ArticleMeta article={article} /></div>
            </article>)}
          </div>
        </section>

        <section className="border-t border-slate-100 bg-[#f8faf7]">
          <div className="mx-auto grid max-w-[1240px] gap-10 px-4 py-10 lg:grid-cols-[minmax(0,795px)_365px] lg:px-5">
            <div>
              <div className="mb-5 flex items-center justify-between border-b border-slate-200 pb-3">
                <h2 className="text-2xl font-black uppercase text-[#07552a]">Tin mới nhất</h2>
                {activeCategory !== "Tất cả" && <button onClick={() => setActiveCategory("Tất cả")} className="text-xs font-bold text-[#e31820]">Xem tất cả</button>}
              </div>
              {latestLead ? (
                <div className="grid gap-6 md:grid-cols-[1.05fr_0.95fr]">
                  <article className="group">
                    <div className="h-64 overflow-hidden rounded-xl"><img className="h-full w-full object-cover transition duration-500 group-hover:scale-105" src={latestLead.image} alt={latestLead.title} /></div>
                    <h3 className="mt-4 text-xl font-black leading-7">{latestLead.title}</h3>
                    <ArticleMeta article={latestLead} />
                    <p className="mt-3 text-sm leading-6 text-slate-500">{latestLead.excerpt}</p>
                  </article>
                  <div>
                    {latestList.map((article) => <article key={article.title} className="group flex gap-3 border-b border-slate-200 py-4 first:pt-0 last:border-0">
                      <div className="h-20 w-28 shrink-0 overflow-hidden rounded-lg"><img className="h-full w-full object-cover transition duration-500 group-hover:scale-105" src={article.image} alt="" /></div>
                      <div><h3 className="line-clamp-2 text-sm font-bold leading-5">{article.title}</h3><ArticleMeta article={article} /></div>
                    </article>)}
                  </div>
                </div>
              ) : <p className="rounded-xl bg-white p-10 text-center text-sm text-slate-500">Chưa có bài viết trong chuyên mục này.</p>}

              <div className="mt-12">
                <div className="mb-5 flex items-center justify-between border-b border-slate-200 pb-3"><h2 className="text-2xl font-black uppercase text-[#07552a]">Đáng chú ý</h2><span className="text-xs font-bold text-[#087c36]">Xem thêm →</span></div>
                <div className="grid gap-7 md:grid-cols-2">
                  {[articles.slice(3, 6), articles.slice(6, 9)].map((column, index) => <div key={index}>
                    {column.map((article, articleIndex) => <article key={article.title} className={`group ${articleIndex === 0 ? "pb-4" : "flex gap-3 border-t border-slate-200 py-4"}`}>
                      <div className={`overflow-hidden rounded-lg ${articleIndex === 0 ? "h-48 w-full" : "h-20 w-28 shrink-0"}`}><img className="h-full w-full object-cover transition duration-500 group-hover:scale-105" src={article.image} alt="" /></div>
                      <div><h3 className={`${articleIndex === 0 ? "mt-3 text-base" : "text-sm"} line-clamp-2 font-bold leading-6`}>{article.title}</h3><ArticleMeta article={article} /></div>
                    </article>)}
                  </div>)}
                </div>
              </div>
            </div>

            <aside className="h-fit lg:sticky lg:top-36">
              <h2 className="relative border-b border-slate-300 pb-3 text-xl font-black uppercase text-[#183126] after:absolute after:bottom-[-1px] after:left-0 after:h-px after:w-28 after:bg-[#087c36]">Mẹo & hướng dẫn</h2>
              <div className="mt-3">
                {articles.filter((article) => article.category === "Góc tư vấn" || article.category === "Sản phẩm").map((article, index) => <article key={article.title} className="group flex gap-3 border-b border-slate-200 py-4 last:border-0">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#e8f2e8] text-[11px] font-black text-[#087c36]">{index + 1}</span>
                  <div><h3 className="text-sm font-bold leading-6 transition group-hover:text-[#087c36]">{article.title}</h3><ArticleMeta article={article} /></div>
                </article>)}
              </div>
              <div className="mt-6 overflow-hidden rounded-2xl bg-[#07552a] p-6 text-white">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#f6b511]">Nhận bản tin hàng tuần</p>
                <h3 className="mt-2 text-xl font-black">Công nghệ hữu ích, không gây nhiễu.</h3>
                <p className="mt-2 text-xs leading-6 text-white/65">Tổng hợp xu hướng và hướng dẫn chọn thiết bị từ đội ngũ Bình Minh.</p>
                <form className="mt-4" onSubmit={(event) => event.preventDefault()}><input type="email" className="h-11 w-full rounded-xl border border-white/15 bg-white/10 px-4 text-xs text-white outline-none placeholder:text-white/45" placeholder="Email của bạn" aria-label="Email nhận bản tin" /><button className="mt-2 h-10 w-full rounded-xl bg-[#e31820] text-xs font-extrabold">Đăng ký nhận tin</button></form>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </StorePage>
  );
}
