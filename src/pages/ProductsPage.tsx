import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { StorePage } from "../components/StoreShell";
import { catalogCategories, catalogProducts, formatPrice } from "../data/catalog";

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [category, setCategory] = useState("Tất cả");
  const [sort, setSort] = useState("featured");
  const [onlySale, setOnlySale] = useState(false);

  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("vi");
    const filtered = catalogProducts.filter((product) =>
      (category === "Tất cả" || product.category === category) &&
      (!normalizedQuery || `${product.name} ${product.brand} ${product.shortSpec}`.toLocaleLowerCase("vi").includes(normalizedQuery)) &&
      (!onlySale || product.oldPrice)
    );
    if (sort === "price-asc") return [...filtered].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") return [...filtered].sort((a, b) => b.price - a.price);
    if (sort === "rating") return [...filtered].sort((a, b) => b.rating - a.rating);
    return filtered;
  }, [category, onlySale, query, sort]);

  return (
    <StorePage>
      <main>
        <section className="border-b border-[#087c36]/10 bg-gradient-to-br from-[#e9f6ed] via-white to-[#fff7e0]">
          <div className="mx-auto max-w-[1320px] px-4 py-10 lg:px-6 lg:py-14">
            <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[#e31820]">Danh mục sản phẩm</p>
            <h1 className="max-w-2xl text-3xl font-black tracking-[-0.04em] sm:text-4xl">Công nghệ chính hãng cho mọi nhu cầu</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">Khám phá thiết bị văn phòng, máy tính và giải pháp công nghệ được tuyển chọn, hỗ trợ kỹ thuật tận tâm.</p>
            <div className="relative mt-6 max-w-2xl">
              <input value={query} onChange={(event) => setQuery(event.target.value)} className="h-12 w-full rounded-xl border border-white bg-white px-4 pr-24 text-sm shadow-[0_8px_30px_rgba(8,124,54,0.1)] outline-none focus:border-[#087c36]" placeholder="Bạn đang tìm sản phẩm nào?" aria-label="Tìm sản phẩm" />
              <button className="absolute right-1.5 top-1.5 h-9 rounded-lg bg-[#e31820] px-5 text-xs font-extrabold text-white">Tìm kiếm</button>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1320px] px-4 py-8 lg:px-6">
          <div className="mb-6 flex flex-wrap items-center gap-2">
            {catalogCategories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`rounded-full border px-4 py-2 text-xs font-bold transition ${category === item ? "border-[#087c36] bg-[#087c36] text-white" : "border-slate-200 bg-white hover:border-[#087c36] hover:text-[#087c36]"}`}>{item}</button>)}
          </div>

          <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
            <aside className="h-fit rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_4px_18px_rgba(8,124,54,0.06)]">
              <h2 className="font-black">Bộ lọc sản phẩm</h2>
              <div className="mt-5 border-t border-slate-100 pt-5">
                <p className="mb-3 text-xs font-extrabold uppercase tracking-wider text-slate-400">Tình trạng</p>
                <label className="flex cursor-pointer items-center gap-2 text-sm"><input type="checkbox" checked={onlySale} onChange={(event) => setOnlySale(event.target.checked)} className="accent-[#087c36]" /> Sản phẩm đang giảm giá</label>
              </div>
              <div className="mt-5 border-t border-slate-100 pt-5">
                <p className="mb-3 text-xs font-extrabold uppercase tracking-wider text-slate-400">Cam kết</p>
                {["Hàng chính hãng", "Bảo hành đầy đủ", "Hỗ trợ kỹ thuật", "Xuất hóa đơn VAT"].map((item) => <p key={item} className="mb-2 flex items-center gap-2 text-xs text-slate-600"><span className="grid h-4 w-4 place-items-center rounded-full bg-[#e9f6ed] text-[9px] font-black text-[#087c36]">✓</span>{item}</p>)}
              </div>
            </aside>

            <div>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-slate-600">Tìm thấy <b className="text-[#26352d]">{visibleProducts.length}</b> sản phẩm</p>
                <select value={sort} onChange={(event) => setSort(event.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold outline-none">
                  <option value="featured">Nổi bật</option><option value="price-asc">Giá thấp đến cao</option><option value="price-desc">Giá cao đến thấp</option><option value="rating">Đánh giá cao nhất</option>
                </select>
              </div>
              {visibleProducts.length ? (
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
                  {visibleProducts.map((product) => (
                    <article key={product.slug} className="group overflow-hidden rounded-2xl border border-slate-100 bg-white p-3 shadow-[0_4px_18px_rgba(8,124,54,0.06)] transition hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(8,124,54,0.12)]">
                      <Link to={`/san-pham/${product.slug}`} className="relative block h-36 overflow-hidden rounded-xl bg-slate-100 sm:h-44">
                        <img className="h-full w-full object-cover transition duration-500 group-hover:scale-105" src={product.image} alt={product.name} />
                        {product.badge && <span className="absolute left-2 top-2 rounded-md bg-[#f6b511] px-2 py-1 text-[10px] font-black text-[#26352d]">{product.badge}</span>}
                      </Link>
                      <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-[#087c36]">{product.brand}</p>
                      <Link to={`/san-pham/${product.slug}`} className="mt-1 block min-h-10 text-xs font-bold leading-5 hover:text-[#e31820] sm:text-[13px]">{product.name}</Link>
                      <p className="mt-1 truncate text-[10px] text-slate-400">{product.shortSpec}</p>
                      <div className="mt-3 flex flex-wrap items-baseline gap-x-2"><b className="text-base text-[#d71920]">{formatPrice(product.price)}</b>{product.oldPrice && <span className="text-[10px] text-slate-400 line-through">{formatPrice(product.oldPrice)}</span>}</div>
                      <Link to={`/san-pham/${product.slug}`} className="mt-3 block rounded-lg border border-[#087c36] py-2.5 text-center text-[11px] font-extrabold text-[#087c36] transition hover:bg-[#087c36] hover:text-white">Xem chi tiết</Link>
                    </article>
                  ))}
                </div>
              ) : <div className="rounded-2xl bg-white px-6 py-16 text-center"><h2 className="font-black">Không tìm thấy sản phẩm</h2><p className="mt-2 text-sm text-slate-500">Hãy thử từ khóa hoặc danh mục khác.</p></div>}
            </div>
          </div>
        </section>
      </main>
    </StorePage>
  );
}
