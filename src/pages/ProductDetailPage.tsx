import { useState } from "react";
import { Link, useParams } from "react-router";
import { StorePage } from "../components/StoreShell";
import { catalogProducts, formatPrice } from "../data/catalog";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const product = catalogProducts.find((item) => item.slug === slug);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) {
    return <StorePage><main className="mx-auto max-w-[1320px] px-4 py-24 text-center"><h1 className="text-3xl font-black">Không tìm thấy sản phẩm</h1><p className="mt-3 text-sm text-slate-500">Sản phẩm có thể đã được cập nhật hoặc ngừng kinh doanh.</p><Link to="/san-pham" className="mt-6 inline-block rounded-xl bg-[#087c36] px-5 py-3 text-sm font-bold text-white">Quay lại danh sách</Link></main></StorePage>;
  }

  const related = catalogProducts.filter((item) => item.category === product.category && item.slug !== product.slug).slice(0, 4);

  return (
    <StorePage>
      <main className="mx-auto max-w-[1320px] px-4 py-6 lg:px-6">
        <nav className="mb-5 flex flex-wrap items-center gap-2 text-xs text-slate-500"><Link to="/" className="hover:text-[#087c36]">Trang chủ</Link><span>/</span><Link to="/san-pham" className="hover:text-[#087c36]">Sản phẩm</Link><span>/</span><span className="text-[#26352d]">{product.name}</span></nav>

        <section className="soft-card grid gap-8 rounded-[32px] bg-white/95 p-4 sm:p-7 lg:grid-cols-[1fr_1fr] lg:p-9">
          <div>
            <div className="relative h-[340px] overflow-hidden rounded-2xl bg-slate-100 sm:h-[500px]">
              <img className="h-full w-full object-cover" src={product.image} alt={product.name} />
              {product.badge && <span className="absolute left-4 top-4 rounded-lg bg-[#f6b511] px-3 py-2 text-xs font-black text-[#26352d]">{product.badge}</span>}
            </div>
            <div className="mt-3 grid grid-cols-4 gap-3">
              {[product.image, product.image, product.image, product.image].map((image, index) => <button key={index} className={`h-20 overflow-hidden rounded-xl border-2 bg-slate-100 ${index === 0 ? "border-[#087c36]" : "border-transparent"}`} aria-label={`Ảnh sản phẩm ${index + 1}`}><img className={`h-full w-full object-cover ${index ? "opacity-70" : ""}`} src={image} alt="" /></button>)}
            </div>
          </div>

          <div className="lg:py-2">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#087c36]">{product.brand} • {product.category}</p>
            <h1 className="future-title mt-3 text-3xl font-black leading-tight sm:text-4xl">{product.name}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs"><span className="font-bold text-[#e31820]">★ {product.rating}/5</span><span className="text-slate-400">{product.reviews} đánh giá</span><span className="text-slate-300">|</span><span className="text-slate-500">Mã: {product.sku}</span></div>
            <p className="mt-5 text-sm leading-6 text-slate-600">{product.description}</p>

            <div className="my-6 rounded-2xl bg-[#f7f8f4] p-5">
              <div className="flex flex-wrap items-baseline gap-3"><span className="text-3xl font-black text-[#d71920]">{formatPrice(product.price)}</span>{product.oldPrice && <span className="text-sm text-slate-400 line-through">{formatPrice(product.oldPrice)}</span>}</div>
              <p className="mt-2 text-xs text-slate-500">Giá đã bao gồm VAT • Miễn phí giao hàng toàn quốc</p>
            </div>

            <div className="rounded-2xl border border-[#087c36]/15 bg-[#e9f6ed]/60 p-5">
              <p className="text-sm font-black text-[#087c36]">Ưu đãi dành cho bạn</p>
              <ul className="mt-3 space-y-2 text-xs leading-5 text-slate-600"><li>• Giảm thêm 2% khi thanh toán chuyển khoản</li><li>• Hỗ trợ cài đặt và hướng dẫn sử dụng miễn phí</li><li>• Đổi mới trong 30 ngày nếu có lỗi nhà sản xuất</li></ul>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="flex h-12 items-center rounded-xl border border-slate-200 bg-white"><button onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="h-full w-11 text-xl" aria-label="Giảm số lượng">−</button><span className="grid h-full w-10 place-items-center border-x border-slate-200 text-sm font-bold">{quantity}</span><button onClick={() => setQuantity((value) => value + 1)} className="h-full w-11 text-xl" aria-label="Tăng số lượng">+</button></div>
              <button onClick={() => setAdded(true)} className={`h-12 flex-1 rounded-xl px-5 text-sm font-extrabold text-white transition ${added ? "bg-[#087c36]" : "bg-[#e31820] hover:bg-[#c5131a]"}`}>{added ? `Đã thêm ${quantity} sản phẩm vào giỏ` : "Thêm vào giỏ hàng"}</button>
              <button className="h-12 rounded-xl border border-[#087c36] px-5 text-sm font-extrabold text-[#087c36] hover:bg-[#087c36] hover:text-white">Mua ngay</button>
            </div>
            <p className="mt-4 flex items-center gap-2 text-xs font-semibold text-[#087c36]"><span className="h-2 w-2 rounded-full bg-[#087c36]" /> Còn {product.stock} sản phẩm, có thể giao ngay</p>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-2xl bg-white p-6 sm:p-8"><h2 className="text-xl font-black">Điểm nổi bật</h2><div className="mt-5 grid gap-3 sm:grid-cols-2">{product.highlights.map((item, index) => <div key={item} className="flex gap-3 rounded-xl bg-[#f7f8f4] p-4"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#087c36] text-xs font-black text-white">{index + 1}</span><p className="text-sm font-semibold leading-6">{item}</p></div>)}</div></div>
          <div className="rounded-2xl bg-white p-6 sm:p-8"><h2 className="text-xl font-black">Thông số kỹ thuật</h2><dl className="mt-5">{product.specs.map(([label, value]) => <div key={label} className="grid grid-cols-[120px_1fr] gap-4 border-b border-slate-100 py-3 text-xs"><dt className="text-slate-500">{label}</dt><dd className="font-semibold">{value}</dd></div>)}</dl></div>
        </section>

        {related.length > 0 && <section className="mt-10"><div className="mb-5 flex items-center justify-between"><h2 className="text-2xl font-black">Sản phẩm liên quan</h2><Link to="/san-pham" className="text-xs font-extrabold text-[#e31820]">Xem tất cả →</Link></div><div className="grid grid-cols-2 gap-3 md:grid-cols-4">{related.map((item) => <article key={item.slug} className="rounded-2xl bg-white p-3 shadow-[0_4px_18px_rgba(8,124,54,0.06)]"><Link to={`/san-pham/${item.slug}`}><img className="h-36 w-full rounded-xl object-cover sm:h-44" src={item.image} alt={item.name} /><h3 className="mt-3 min-h-10 text-xs font-bold leading-5">{item.name}</h3><p className="mt-2 font-black text-[#d71920]">{formatPrice(item.price)}</p></Link></article>)}</div></section>}
      </main>
    </StorePage>
  );
}
