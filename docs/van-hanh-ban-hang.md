# Giá, kho, thông báo và chính sách Bình Minh

## Xác minh giá và kho

- Vào **Quản trị → Sản phẩm → Giá & kho**.
- Kiểm tra số liệu thực tế tại Bình Minh, cập nhật giá/số lượng và lưu.
- Bật **Đã xác nhận giá bán tại Bình Minh** / **Đã kiểm đếm tồn kho tại Bình Minh**, lưu lần nữa.
- Mỗi lần thay đổi số liệu, xác nhận cũ tự bị xóa. Ngày xác nhận được hệ thống ghi lại.
- Giá chưa xác minh vẫn được giữ trong database để đối chiếu; ngoài website hiển thị **Liên hệ báo giá**. Không phát sinh nhãn giảm giá từ số liệu chưa xác minh.
- Kho chưa xác minh không được thông báo là còn hàng. Kho đã kiểm đếm bằng 0 là tạm hết hàng.
- Trên danh sách sản phẩm có nút xuất CSV phục vụ đối chiếu. Chỉ quản trị viên đăng nhập mới được tải.
- Giỏ hàng kiểm tra lại giá với máy chủ khi mở website; yêu cầu gửi từ giỏ luôn lấy giá hiện tại từ database.

## Email

Địa chỉ nhận: **kinhdoanh@thietbibinhminh.com.vn**.

Máy chủ từ ảnh DNS đã được kiểm tra kết nối TLS: `mail9234.maychuemail.com`, cổng `465`.

Điền `SMTP_PASSWORD` vào `.env` trên máy. Không đưa mật khẩu vào Git hoặc tài liệu. Sau khi thay đổi cấu hình, chạy lại dịch vụ app để nhận biến môi trường mới.

Các biến: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`, `SALES_NOTIFICATION_EMAIL`.

Khi khách gửi yêu cầu:

1. Lưu vào **Khách hàng → Yêu cầu tư vấn** trước.
2. Sau khi trả phản hồi cho khách, gửi thông báo cho kinh doanh và email xác nhận tiếp nhận cho khách.
3. Lưu thời điểm gửi của từng email. Nếu email xác nhận khách thất bại sau khi email kinh doanh thành công, gửi lại chỉ thử email khách.
4. Khi lỗi cấu hình hoặc kết nối, dữ liệu yêu cầu vẫn được giữ. Trong quản trị có trạng thái, thông báo lỗi và nút **Gửi lại thông báo email**.

Có endpoint `POST /api/notifications/process` dành cho tác vụ gửi lại tự động, bảo vệ bằng `Authorization: Bearer <NOTIFICATION_CRON_SECRET>`. Chưa có lịch gọi tự động; gửi lại thủ công vẫn dùng được. Không gửi lại hàng loạt các yêu cầu có từ trước migration.

## Chính sách

**Nội dung → Chính sách khách hàng** cho phép chỉnh sửa 6 trang:

- `/chinh-sach/bao-hanh`
- `/chinh-sach/giao-nhan`
- `/chinh-sach/doi-tra`
- `/chinh-sach/mua-hang-doanh-nghiep`
- `/chinh-sach/bao-mat`
- `/chinh-sach/dieu-khoan`

Nội dung được soạn riêng cho quy trình tư vấn/báo giá Bình Minh, tham khảo bố cục hỗ trợ của Samnec. Các thời hạn, mức phí và ưu đãi riêng của Samnec không được mặc định thành cam kết của Bình Minh. Nhân viên xác nhận thông số thương mại cụ thể trong báo giá hoặc hợp đồng.

Nguồn tham khảo:

- https://samnec.com.vn/quy-dinh/chinh-sach-chung
- https://samnec.com.vn/quy-dinh/bao-hanh-doi-tra-san-pham
- https://samnec.com.vn/quy-dinh/chinh-sach-van-chuyen
- https://samnec.com.vn/quy-dinh/an-toan-bao-mat-thong-tin
- https://samnec.com.vn/quy-dinh/cach-thuc-mua-hang-va-dieu-khoan-thanh-toan
- https://samnec.com.vn/quy-dinh/quy-dinh-su-dung-trang-web-samnec

## Chống spam

- Tối đa 3 yêu cầu/email trong một cửa sổ 15 phút, 100 yêu cầu toàn hệ thống/15 phút.
- Giới hạn nằm trong PostgreSQL, dùng được khi có nhiều tiến trình app và không mất sau khởi động lại.
- Khi bật `TRUST_PROXY_HEADERS=true`, thêm giới hạn 10 yêu cầu/IP/15 phút. Chỉ bật sau proxy đã thay thế header chuyển tiếp do người dùng gửi.
- Biểu mẫu có trường bẫy bot; kiểm tra độ dài và định dạng ở máy chủ. API tạo yêu cầu cũng chịu giới hạn.
- Khóa nhận diện được băm bằng HMAC; không lưu IP thô trong bảng giới hạn. Dữ liệu bucket cũ được dọn khi có yêu cầu.

## SEO và tốc độ

- `/sitemap.xml`: sản phẩm đã xuất bản, danh mục menu cho phép lập chỉ mục, tin tức và trang chính sách.
- `/robots.txt`: chặn lập chỉ mục bản localhost; khi đổi sang tên miền thật, cho phép trang công khai, loại quản trị/API/giỏ hàng.
- Cấu hình `NEXT_PUBLIC_SITE_URL` đúng tên miền trước khi dựng bản công khai.
- Canonical trang chi tiết và phân trang; noindex các biến thể lọc/tìm kiếm sản phẩm.
- Dữ liệu có cấu trúc Organization, Product, Article và BreadcrumbList. Không công bố giá hoặc tồn kho chưa xác minh trong Offer; không thêm đánh giá giả vào schema.
- Cache truy vấn danh mục và bộ lọc trong 5 phút; thay đổi sản phẩm trong CMS xóa cache ngay. Giảm độ sâu tải quan hệ trên thẻ sản phẩm, dùng cache ảnh 24 giờ.
- Đây chưa phải xác nhận tốc độ trên mạng di động hoặc kiểm chứng Google đã lập chỉ mục; cần đo môi trường công khai sau khi đưa lên tên miền thật.

## Sao lưu và kiểm tra

Sao lưu trước migration: `.backups/binhminh-before-launch-20261020.dump`.

Kiểm thử tích hợp: `node --import tsx --test scripts/launch-readiness.test.ts` với `DATABASE_URL` trỏ đến PostgreSQL local. Email thử dùng SMTP giả lập và tên miền `.invalid`, không gửi thư thật. Bài thử tự xóa yêu cầu thử sau khi chạy.
