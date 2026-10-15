import { Link } from "react-router";
import { StorePage } from "../components/StoreShell";

const articles = [
  {
    category: "Xu hướng công nghệ",
    date: "18.12.2026",
    title: "AI PC bước vào giai đoạn trưởng thành: Doanh nghiệp cần chuẩn bị gì?",
    excerpt: "Từ phần cứng NPU đến quản trị dữ liệu tại thiết bị, đây là những tiêu chí quan trọng khi xây dựng lộ trình AI PC cho năm 2027.",
    image: "https://images.unsplash.com/photo-1638821734607-02db76d614a6?auto=format&fit=crop&w=1200&q=85",
    featured: true,
  },
  {
    category: "Hạ tầng",
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
    title: "Bình Minh mở rộng dịch vụ tư vấn giải pháp công nghệ trọn vòng đời",
    excerpt: "Từ khảo sát, thiết kế đến triển khai và bảo trì, doanh nghiệp chỉ cần một đầu mối đồng hành.",
    image: "https://images.unsplash.com/photo-1758691737124-05c5bffe46f0?auto=format&fit=crop&w=900&q=85",
  },
];

export default function NewsPage() {
  const [featured, ...latest] = articles;

  return (
    <StorePage>
      <main>
        <section className="border-b border-[#087c36]/10 bg-gradient-to-br from-[#e8f2e8] via-white to-[#fff5d6]">
          <div className="mx-auto max-w-[1320px] px-4 py-14 lg:px-6 lg:py-20">
            <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#e31820]">Bình Minh insights</p>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <h1 className="future-title max-w-3xl text-4xl font-black sm:text-6xl">Hiểu công nghệ.<br /><span className="text-[#087c36]">Đi trước thay đổi.</span></h1>
              <p className="max-w-md text-sm leading-7 text-slate-600">Tin tức, góc nhìn và hướng dẫn thực tiễn giúp cá nhân, tổ chức đưa ra quyết định công nghệ tốt hơn.</p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1320px] px-4 py-8 lg:px-6 lg:py-12">
          <article className="soft-card grid overflow-hidden rounded-[32px] bg-[#043d20] text-white lg:grid-cols-[1.08fr_0.92fr]">
            <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
              <div className="flex items-center gap-3 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#f6b511]"><span>Tâm điểm</span><span className="h-1 w-1 rounded-full bg-current" /><span>{featured.date}</span></div>
              <h2 className="future-title mt-5 text-3xl font-black leading-tight sm:text-4xl">{featured.title}</h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-green-50/70">{featured.excerpt}</p>
              <Link to="/lien-he" className="mt-8 w-fit rounded-full bg-[#e31820] px-5 py-3 text-xs font-extrabold transition hover:-translate-y-0.5">Trao đổi cùng chuyên gia <span className="ml-2">→</span></Link>
            </div>
            <div className="min-h-[320px] overflow-hidden lg:min-h-[470px]">
              <img className="h-full w-full object-cover transition duration-700 hover:scale-105" src={featured.image} alt="Máy tính dành cho công việc hiện đại" />
            </div>
          </article>
        </section>

        <section className="mx-auto max-w-[1320px] px-4 pb-10 lg:px-6">
          <div className="mb-6 flex items-end justify-between">
            <div><p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#e31820]">Mới cập nhật</p><h2 className="future-title mt-1 text-3xl font-black">Dòng tin công nghệ</h2></div>
            <div className="hidden gap-2 sm:flex">{["Tất cả", "Doanh nghiệp", "Sản phẩm"].map((item, index) => <span key={item} className={`rounded-full px-4 py-2 text-[11px] font-bold ${index === 0 ? "bg-[#087c36] text-white" : "tech-pill"}`}>{item}</span>)}</div>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {latest.map((article) => (
              <article key={article.title} className="product-card group overflow-hidden rounded-[24px] border bg-white p-3 transition hover:-translate-y-1">
                <div className="future-image h-52 overflow-hidden rounded-[18px]"><img className="h-full w-full object-cover transition duration-700 group-hover:scale-105" src={article.image} alt="" /></div>
                <div className="p-3 pb-4">
                  <div className="mt-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider"><span className="text-[#087c36]">{article.category}</span><span className="text-slate-400">{article.date}</span></div>
                  <h3 className="mt-3 text-lg font-black leading-7">{article.title}</h3>
                  <p className="mt-3 text-xs leading-6 text-slate-500">{article.excerpt}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-xs font-extrabold text-[#e31820]">Đọc bài viết <span>→</span></span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </StorePage>
  );
}
