import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { StorePage } from "../components/StoreShell";
import { catalogCategories, catalogProducts, formatPrice } from "../data/catalog";

function CartIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="9" cy="20" r="1" /><circle cx="18" cy="20" r="1" /><path d="M3 4h2l2.3 11h10.8l2-7H6" /></svg>;
}

function CompareIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M8 3v18M16 3v18M4 7l4-4 4 4M12 17l4 4 4-4" /></svg>;
}

const priceRanges = [
  { value: "all", label: "Tất cả mức giá" },
  { value: "under-5", label: "Dưới 5 triệu" },
  { value: "5-15", label: "Từ 5 — 15 triệu" },
  { value: "15-30", label: "Từ 15 — 30 triệu" },
  { value: "over-30", label: "Trên 30 triệu" },
];

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [category, setCategory] = useState("Tất cả");
  const [brand, setBrand] = useState("Tất cả");
  const [priceRange, setPriceRange] = useState("all");
  const [sort, setSort] = useState("featured");
  const [onlySale, setOnlySale] = useState(false);
  const [cart, setCart] = useState<string[]>([]);
  const [compare, setCompare] = useState<string[]>([]);

  const brands = useMemo(() => ["Tất cả", ...new Set(catalogProducts.map((product) => product.brand))], []);

  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("vi");
    const filtered = catalogProducts.filter((product) => {
      const inPriceRange =
        priceRange === "all" ||
        (priceRange === "under-5" && product.price < 5_000_000) ||
        (priceRange === "5-15" && product.price >= 5_000_000 && product.price <= 15_000_000) ||
        (priceRange === "15-30" && product.price > 15_000_000 && product.price <= 30_000_000) ||
        (priceRange === "over-30" && product.price > 30_000_000);
      return (
        (category === "Tất cả" || product.category === category) &&
        (brand === "Tất cả" || product.brand === brand) &&
        (!normalizedQuery || `${product.name} ${product.brand} ${product.shortSpec} ${product.sku}`.toLocaleLowerCase("vi").includes(normalizedQuery)) &&
        (!onlySale || product.oldPrice) &&
        inPriceRange
      );
    });
    if (sort === "price-asc") return [...filtered].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") return [...filtered].sort((a, b) => b.price - a.price);
    if (sort === "rating") return [...filtered].sort((a, b) => b.rating - a.rating);
    if (sort === "newest") return [...filtered].reverse();
    return filtered;
  }, [brand, category, onlySale, priceRange, query, sort]);

  const resetFilters = () => {
    setCategory("Tất cả");
    setBrand("Tất cả");
    setPriceRange("all");
    setOnlySale(false);
    setQuery("");
  };

  return (
    <StorePage>
      <main className="bg-[#f4f6f3]/70 pb-10">
        <section className="mx-auto max-w-[1420px] px-4 pt-5 lg:px-6">
          <div className="soft-card relative z-20 rounded-2xl bg-white p-3.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-2 pr-1 text-[11px] font-black uppercase tracking-wide text-[#183126]">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M4 5h16l-6 7v6l-4 2v-8Z" /></svg>
                Bộ lọc
              </span>
              <select value={category} onChange={(event) => setCategory(event.target.value)} className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 outline-none focus:border-[#087c36]">
                {catalogCategories.map((item) => <option key={item}>{item}</option>)}
              </select>
              <select value={brand} onChange={(event) => setBrand(event.target.value)} className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 outline-none focus:border-[#087c36]">
                {brands.map((item) => <option key={item} value={item}>{item === "Tất cả" ? "Tất cả hãng" : item}</option>)}
              </select>
              <select value={priceRange} onChange={(event) => setPriceRange(event.target.value)} className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 outline-none focus:border-[#087c36]">
                {priceRanges.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
              </select>
              <button onClick={() => setOnlySale((value) => !value)} className={`h-10 rounded-lg border px-3 text-xs font-bold transition ${onlySale ? "border-[#e31820] bg-[#fff0f0] text-[#e31820]" : "border-slate-200 text-slate-600"}`}>Đang khuyến mại</button>
              {(category !== "Tất cả" || brand !== "Tất cả" || priceRange !== "all" || onlySale || query) && <button onClick={resetFilters} className="h-10 px-2 text-xs font-bold text-[#e31820]">Xóa lọc</button>}
              <label className="ml-auto inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700">
                <span className="text-slate-400">Sắp xếp:</span>
                <select value={sort} onChange={(event) => setSort(event.target.value)} className="bg-transparent font-bold outline-none">
                  <option value="featured">Phù hợp nhất</option><option value="price-asc">Giá tăng dần</option><option value="price-desc">Giá giảm dần</option><option value="rating">Đánh giá tốt</option><option value="newest">Mới nhất</option>
                </select>
              </label>
            </div>
          </div>

          <div className="mb-4 mt-5 flex items-center justify-between">
            <p className="text-sm text-slate-600">Có <strong className="text-[#183126]">{visibleProducts.length}</strong> sản phẩm phù hợp</p>
            {compare.length > 0 && <span className="rounded-full bg-[#fff5d6] px-3 py-1.5 text-[11px] font-bold text-[#183126]">So sánh: {compare.length} sản phẩm</span>}
          </div>

          {visibleProducts.length ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {visibleProducts.map((product) => {
                const saving = product.oldPrice ? product.oldPrice - product.price : 0;
                const isCompared = compare.includes(product.slug);
                const isInCart = cart.includes(product.slug);
                return (
                  <article key={product.slug} className="group flex min-h-[390px] min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 transition duration-200 hover:-translate-y-1 hover:border-transparent hover:shadow-[0_18px_45px_rgba(6,75,39,0.13)]">
                    <Link to={`/san-pham/${product.slug}`} className="relative flex h-40 items-center justify-center overflow-hidden rounded-xl bg-[#f7f8f5] p-2 sm:h-44">
                      <img className="max-h-full w-full object-contain transition duration-300 group-hover:scale-[1.04]" src={product.image} alt={product.name} />
                      {product.badge && <span className="absolute left-2 top-2 rounded-md bg-[#f6b511] px-2 py-1 text-[10px] font-black text-[#183126]">{product.badge}</span>}
                    </Link>
                    <div className="mt-3 flex flex-1 flex-col">
                      <p className="text-[9px] font-extrabold uppercase tracking-wider text-[#087c36]">{product.brand} • {product.sku}</p>
                      <Link to={`/san-pham/${product.slug}`} className="mt-1 line-clamp-2 min-h-10 text-xs font-semibold leading-5 text-slate-900 hover:text-[#e31820] sm:text-[13px]">{product.name}</Link>
                      <p className="mt-1 truncate text-[10px] text-slate-400">{product.shortSpec}</p>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <span className="text-[11px] font-bold text-[#f0a500]">★ {product.rating} <span className="font-medium text-slate-400">({product.reviews})</span></span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#087c36]"><span className="h-1.5 w-1.5 rounded-full bg-[#087c36]" /> Còn hàng</span>
                      </div>
                      <div className="mt-2 min-h-[66px]">
                        <p className="h-4 text-[10px] font-medium text-slate-400 line-through">{product.oldPrice ? formatPrice(product.oldPrice) : ""}</p>
                        <div className="mt-0.5 flex items-end justify-between gap-1">
                          <strong className="text-base font-black leading-6 text-[#e31820] sm:text-[18px]">{formatPrice(product.price)}</strong>
                          {saving > 0 && <span className="rounded-md bg-[#e31820] px-1.5 py-1 text-[9px] font-extrabold text-white">-{formatPrice(saving)}</span>}
                        </div>
                        <p className="mt-1 text-[10px] text-slate-500">{product.oldPrice ? "1 ưu đãi đang áp dụng" : "Giá đã bao gồm VAT"}</p>
                      </div>
                      <div className="mt-auto flex items-center gap-2 pt-3">
                        <button onClick={() => setCart((items) => items.includes(product.slug) ? items : [...items, product.slug])} className={`flex h-10 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-xl text-[11px] font-bold text-white transition sm:text-xs ${isInCart ? "bg-[#087c36]" : "bg-[#e31820] hover:bg-[#c5131a]"}`}><CartIcon /><span className="hidden sm:inline">{isInCart ? "Đã thêm" : "Thêm vào giỏ"}</span><span className="sm:hidden">{isInCart ? "Đã thêm" : "Mua"}</span></button>
                        <button onClick={() => setCompare((items) => isCompared ? items.filter((item) => item !== product.slug) : [...items, product.slug])} className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border transition ${isCompared ? "border-[#087c36] bg-[#e8f2e8] text-[#087c36]" : "border-slate-300 text-slate-500 hover:border-[#e31820] hover:text-[#e31820]"}`} aria-label={`So sánh ${product.name}`}><CompareIcon /></button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="soft-card rounded-2xl bg-white px-6 py-20 text-center"><h2 className="text-xl font-black">Không tìm thấy sản phẩm</h2><p className="mt-2 text-sm text-slate-500">Hãy thử thay đổi từ khóa, hãng hoặc mức giá.</p><button onClick={resetFilters} className="mt-5 rounded-full bg-[#087c36] px-5 py-3 text-xs font-bold text-white">Xóa toàn bộ bộ lọc</button></div>
          )}

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[["Hàng chính hãng", "Đầy đủ CO/CQ và hóa đơn VAT"], ["Báo giá nhanh", "Phản hồi yêu cầu doanh nghiệp"], ["Giao toàn quốc", "Đóng gói và theo dõi minh bạch"], ["Hỗ trợ kỹ thuật", "Đồng hành trong suốt vòng đời"]].map(([title, text]) => <div key={title} className="rounded-2xl border border-[#087c36]/10 bg-white p-4"><p className="text-xs font-black text-[#087c36]">{title}</p><p className="mt-1 text-[10px] leading-5 text-slate-500">{text}</p></div>)}
          </div>
        </section>
      </main>
    </StorePage>
  );
}
