# Hoàn thiện bán hàng qua tư vấn — 20/10/2026

## Đã triển khai

- Trạng thái và ngày xác minh giá/kho; tự bỏ xác nhận khi số liệu thay đổi. Có xuất CSV trong quản trị.
- Giỏ hàng kiểm tra lại giá với máy chủ. Giá chưa xác minh không hiển thị như giá bán và không đưa vào Offer.
- Lưu yêu cầu trước khi gửi email. Email kinh doanh + xác nhận tiếp nhận cho khách; lưu thời điểm riêng và hỗ trợ gửi lại phần thất bại.
- 6 chính sách có thể sửa trong CMS, được nối vào chân trang và trang sản phẩm.
- Giới hạn spam trong PostgreSQL, bảo vệ cả API lẫn biểu mẫu; trường bẫy bot trên biểu mẫu.
- Sitemap, robots, canonical, schema Organization/Product/Article/BreadcrumbList; cache danh mục và bộ lọc, giảm dữ liệu quan hệ, tăng cache ảnh.

## Kết quả kiểm tra

- Production build và TypeScript: đạt. App local tại http://localhost:3001.
- 3 bài kiểm thử đạt: dữ liệu chưa xác minh, thay đổi giá/kho yêu cầu xác minh lại, giới hạn đồng thời và thử lại email bị lỗi giữa chừng.
- HTTP thực tế: 6/6 chính sách trả 200; 6.974 URL sản phẩm trong sitemap; tổng sitemap 7.089 URL theo cờ cho phép lập chỉ mục.
- Kiểm tra Product schema không công bố giá chưa xác minh, Article schema, breadcrumb, slug mã hóa, giá giỏ hàng và các endpoint yêu cầu đăng nhập.
- Thử tạo 3 yêu cầu cùng email được lưu; lần thứ 4 trả 429. Thiếu mật khẩu SMTP được ghi là lỗi cấu hình, không giả báo đã gửi. Các yêu cầu thử đã được xóa.
- Database còn 6.974 sản phẩm, 13 bài viết và thêm 6 trang chính sách. Chưa có giá/kho nào được cửa hàng xác minh.
- Đã quan sát trang bảo hành trong trình duyệt và lưu ảnh tại `.tmp-chinh-sach-binh-minh.png`.

## Phản hồi máy chủ local

Mỗi trang đo 4 lượt; lấy trung vị 3 lượt sau khi cache đã có dữ liệu. Số liệu không bao gồm tải ảnh và không đại diện tốc độ trên điện thoại/mạng công khai.

| Trang | Trước | Sau |
|---|---:|---:|
| Trang chủ | 53 ms | 33 ms |
| Danh mục laptop | 107 ms | 43 ms |
| Danh sách sản phẩm | 173 ms | 26 ms |

Lượt đầu sau khởi động vẫn chậm hơn: trang chủ khoảng 2,6 giây, danh mục 648 ms, danh sách sản phẩm 751 ms. Chưa kiểm chứng Core Web Vitals môi trường công khai.

## Cần dữ liệu của cửa hàng để hoàn tất vận hành

1. Giá bán và tồn kho thực tế để quản trị viên kiểm tra, xác nhận. Giữ nguyên số liệu nguồn trong database, ngoài website tạm dùng Liên hệ báo giá.
2. Mật khẩu SMTP: đã cấu hình máy chủ `mail9234.maychuemail.com`, cổng 465, tài khoản và địa chỉ nhận `kinhdoanh@thietbibinhminh.com.vn`. Kết nối TLS và chứng chỉ hợp lệ, chưa đăng nhập hoặc gửi thư thật. Điền `SMTP_PASSWORD` trong `.env` rồi tạo lại dịch vụ app để nhận cấu hình.

Hướng dẫn chi tiết và nguồn tham khảo chính sách: [Vận hành bán hàng](../van-hanh-ban-hang.md).
