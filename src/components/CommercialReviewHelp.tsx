export function CommercialReviewHelp() {
  return <div style={{ border: '1px solid var(--theme-elevation-150)', borderRadius: 8, padding: 20, marginBottom: 24 }}>
    <h3>Xác minh giá và tồn kho Bình Minh</h3>
    <p>Giá và số lượng từ nguồn nhập chưa được coi là giá bán hoặc hàng sẵn có. Mở sản phẩm → Giá &amp; kho → cập nhật số liệu thực tế và lưu. Sau đó bật ô xác nhận tương ứng rồi lưu lần nữa. Mỗi khi thay đổi giá hoặc tồn kho, hệ thống tự bỏ xác nhận cũ để yêu cầu kiểm tra lại.</p>
    <a href="/api/catalog-review">Xuất danh sách giá và kho cần kiểm tra (CSV)</a>
  </div>
}
