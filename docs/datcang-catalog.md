# Catalog Đất Cảng

## Phạm vi

Thay sản phẩm, danh mục và thương hiệu catalog. Giữ nguyên tin tức, danh mục tin,
yêu cầu khách hàng, tài khoản quản trị, cấu hình và banner. Không xóa kho media
chung vì ảnh tin tức có thể vẫn được sử dụng.

## Nguồn

- `dat_cang_catalog.sqlite`: 6.964 sản phẩm, 652 nút phân loại, 140 thương hiệu,
  40.110 liên kết ảnh và 130.064 giá trị thuộc tính.
- `products_complete.xlsx`: 5.545 SKU, tất cả có trong SQLite và giá khớp 100%.
  SQLite là nguồn chính vì có đủ sản phẩm và cấu trúc thuộc tính.
- 731 sản phẩm không có thương hiệu nguồn được gán `Chưa xác định`.
- 117 sản phẩm không có giá hiển thị `Liên hệ báo giá`. Không suy diễn tồn kho,
  khuyến mại hoặc đánh giá từ dữ liệu không tồn tại.

## Danh mục

Giữ 11 nhóm chính và cây menu nguồn tối đa 4 cấp. Nguồn chỉ gán sản phẩm vào
nhóm chính và taxonomy; các mục menu theo hãng, CPU, RAM, giá là bộ lọc.
Importer giữ nguyên liên kết nguồn và chỉ bổ sung liên kết khi có bằng chứng
trực tiếp từ tên, hãng, thông số hoặc khoảng giá. Không suy đoán ý nghĩa mã `dm`.
Menu được đồng bộ từ website maytinhdatcang.vn, giữ đủ nhánh kể cả khi chưa có
sản phẩm trong bản SQLite. Loại riêng “Linh kiện nâng cấp” theo yêu cầu.
18 nhãn taxonomy nội bộ cũng được ẩn khỏi menu để tránh lặp lại nhóm cha.
Đây là quy tắc phân loại có thể kiểm tra trong `scripts/prepare-datcang.py`,
không phải liên kết taxonomy được cung cấp sẵn bởi nguồn.

Nhóm lọc theo tham số và nhóm menu không được lập chỉ mục tự động. Admin có thể
biên tập nội dung SEO và bật lập chỉ mục riêng cho landing cần quảng bá.

## Ảnh và thông số

40.110 liên kết ảnh dùng 40.074 URL duy nhất. Lưu URL ngoài trong media và giữ
thư viện ảnh theo thứ tự nguồn. Ảnh đang được phục vụ từ `maytinhdatcang.vn`,
chưa sao chép vào R2. Next Image tối ưu kích thước hiển thị.

Các giá trị của cùng tên thuộc tính được gộp bằng dấu chấm phẩy, giữ đủ giá trị:
123.363 dòng bảng thông số sau khi gộp. Trang danh sách không tải thư viện ảnh
và bảng thông số; trang chi tiết tải đầy đủ.

## Chạy lại

1. Tạo bản sao lưu PostgreSQL đầy đủ và lưu ngoài Git trong `.backups/`.
2. Chạy `python scripts/prepare-datcang.py <sqlite> <manifest.json>`.
3. Áp dụng migration Payload `20261019_150904_datcang_catalog`.
4. Đặt `DATABASE_URL`, chạy
   `node scripts/import-datcang.mjs <manifest.json> <backup.dump>`.
5. Chạy `node scripts/sync-datcang-menu.mjs` để áp dụng menu đã đối chiếu website
   trong `scripts/datcang-menu.json` và bổ sung liên kết chéo Apple/MacBook.
6. Tạo lại container ứng dụng để xóa cache catalog cũ.

Để cập nhật bản chụp menu: tải HTML trang chủ Đất Cảng, chạy
`python scripts/read-datcang-menu.py <html-file>`, kiểm tra JSON trước khi sync.
Không nhập các dịch vụ riêng của Đất Cảng vào danh mục sản phẩm Bình Minh.

Importer thực hiện trong transaction, kiểm tra số sản phẩm/ảnh/thông số và
so sánh dấu kiểm dữ liệu tin tức, yêu cầu khách hàng, admin và cấu hình trước
khi commit. Kết quả được lưu trong `.backups/datcang-import-result.json`.
Bản sao lưu trước lần chuyển này: `.backups/binhminh-before-datcang-20261019.dump`.

Giỏ hàng local được đổi phiên bản lưu trữ để sản phẩm HPT đã xóa không tiếp tục
xuất hiện trong đơn yêu cầu mới. Bản ghi yêu cầu khách hàng trong database được giữ.
