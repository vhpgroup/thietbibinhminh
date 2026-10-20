import { getPayloadClient } from '@/lib/payload'

const cell = (value: unknown) => {
  let text = String(value ?? '')
  if (/^[=+\-@\t\r]/.test(text)) text = "'" + text
  return '"' + text.replaceAll('"', '""') + '"'
}

export async function GET(request: Request) {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: request.headers })
  if (user?.collection !== 'admins') return Response.json({ error: 'Vui lòng đăng nhập quản trị.' }, { status: 401 })
  const products = await payload.find({ collection: 'products', overrideAccess: false, user, depth: 0, limit: 50000, sort: 'sku', select: { sku: true, name: true, price: true, stock: true, priceVerified: true, stockVerified: true, priceVerifiedAt: true, stockVerifiedAt: true } })
  const rows = [['SKU', 'Tên sản phẩm', 'Giá đang lưu', 'Đã xác nhận giá', 'Xác nhận giá lúc', 'Tồn đang lưu', 'Đã kiểm đếm', 'Kiểm đếm lúc'], ...products.docs.map(p => [p.sku, p.name, p.price, p.priceVerified ? 'Có' : 'Chưa', p.priceVerifiedAt, p.stock, p.stockVerified ? 'Có' : 'Chưa', p.stockVerifiedAt])]
  return new Response('\ufeff' + rows.map(row => row.map(cell).join(',')).join('\r\n'), { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="binhminh-gia-kho-can-xac-minh.csv"', 'Cache-Control': 'no-store' } })
}
