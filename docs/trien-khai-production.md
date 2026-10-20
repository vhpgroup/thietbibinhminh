# Triển khai production Bình Minh

## Hệ thống

- Website: https://thietbibinhminh.com.vn (có thêm www).
- Quản trị: https://thietbibinhminh.com.vn/admin.
- Coolify: http://103.232.121.114:8000, project **Bình Minh Storefront**, environment **production**, application **Binh Minh Storefront**.
- Mã nguồn: `vhpgroup/thietbibinhminh`, nhánh `main`, compose `/docker-compose.production.yml`.
- PostgreSQL 16 nằm trong mạng Docker riêng, không mở cổng ra Internet.
- Volume database: `20nhfrzrnjs8yya6if4eawp3_postgres-data`; volume uploads: `20nhfrzrnjs8yya6if4eawp3_media`.
- Database nhập từ local: 6.974 sản phẩm, 13 bài viết; giữ tài khoản quản trị và nội dung chính sách.

## Cập nhật website

1. Push mã nguồn đã kiểm tra lên `main`.
2. Trong Coolify, mở application rồi chọn **Deploy**.
3. Chờ deployment **Success**, app **Healthy**, kiểm tra `/api/health` trả `{"status":"ok"}`.
4. Kiểm tra trang chủ, sản phẩm, tin tức và giỏ hàng. Migration chạy trước ứng dụng mỗi lần triển khai.

Không xóa volume khi triển khai lại. Không đưa `.env` hoặc mật khẩu vào Git. Các biến SMTP/R2 và khóa ứng dụng được lưu trong cấu hình môi trường của Coolify.

## Sao lưu và khôi phục

- Sao lưu PostgreSQL mỗi ngày lúc **03:15 giờ Việt Nam**, lưu 14 ngày trên VPS tại `/root/binhminh-backups/`.
- Script: `/root/binhminh-deploy/backup.sh`; lịch: `/etc/cron.d/binhminh-storefront`.
- Chạy sao lưu thủ công: `bash /root/binhminh-deploy/backup.sh`.
- Bản nhập ban đầu: `/root/binhminh-deploy/catalog-20261020.dump`.
- Khôi phục: dừng riêng app Bình Minh, sao lưu trạng thái hiện tại, dùng `pg_restore` vào database `binhminh` (user `payload`) của container PostgreSQL Bình Minh, sau đó khởi động app và kiểm tra số liệu. Thao tác khôi phục ghi đè dữ liệu nên phải chọn đúng file và đúng container.
- Bản sao lưu hiện ở cùng VPS; cần bổ sung bản sao ở nơi khác để khôi phục khi mất toàn bộ VPS. Ảnh R2 cần chính sách sao lưu riêng; dump PostgreSQL không chứa nội dung ảnh.

## Email yêu cầu khách hàng

- SMTP TLS cổng 465: `mail9234.maychuemail.com`.
- Hộp thư nhận: `kinhdoanh@thietbibinhminh.com.vn`.
- Tác vụ gửi lại yêu cầu đang chờ chạy mỗi 5 phút qua endpoint có khóa bảo vệ.
- Script: `/root/binhminh-deploy/retry-notifications.sh`; log: `/root/binhminh-backups/notifications.log`.
- Khi đổi mật khẩu email: sửa `SMTP_PASSWORD` trong Coolify rồi Deploy lại.
- Kiểm tra trạng thái gửi trong quản trị → Yêu cầu khách hàng. Chưa gửi email thử tới người dùng thật trong quá trình triển khai.

## DNS

- `@` A → `103.232.121.114`.
- `www` CNAME → `thietbibinhminh.com.vn`.
- Giữ nguyên MX, SPF và các bản ghi mail hiện có.
