# Bình Minh Storefront

Landing page thương mại điện máy được chuyển từ Figma Make sang dự án tự host:

- Next.js App Router + React
- Tailwind CSS
- Payload CMS tại `/admin`
- PostgreSQL
- Docker Compose

## Chạy bằng Docker

```bash
docker compose up --build
```

Mở `http://localhost:3001` và tạo tài khoản quản trị đầu tiên tại `http://localhost:3001/admin`.

Khi triển khai thật, đặt `PAYLOAD_SECRET` thành chuỗi ngẫu nhiên dài và cập nhật `NEXT_PUBLIC_SITE_URL`.

## Chạy local

Sao chép `.env.example` thành `.env`, khởi động PostgreSQL, sau đó:

```bash
corepack enable
pnpm install
pnpm dev
```
