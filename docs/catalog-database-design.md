# Thiết kế danh mục và SEO Bình Minh

## Hiện trạng đã kiểm tra

- `product-categories` đang phẳng: name, slug, description, icon, order.
- Mỗi sản phẩm chỉ có một category; không có danh mục cha hay danh mục phụ.
- Menu và nhóm trang chủ được viết cố định trong `home-categories.ts`, không quản lý từ CMS.
- Nhóm văn phòng đang đặt Máy scan ngang hàng Scan tài liệu ADF; camera hội nghị xuất hiện ở nhiều nhóm nhưng chưa có quan hệ phân loại rõ ràng.

## Mô hình đề xuất

Giữ PostgreSQL và Payload CMS. Dùng cây danh mục adjacency list với `parent_id`; không cần closure table ở quy mô hiện tại. Tạo cây từ một truy vấn danh mục, lấy tập ID con để lọc sản phẩm. Không lưu đường dẫn tổ tiên trong sản phẩm.

| Đối tượng | Trường chính và ràng buộc |
| --- | --- |
| product_categories | id PK, parent_id FK nullable, name, slug UNIQUE, description, content, image_id, icon, sort_order, status, seo_title, seo_description, seo_image_id, indexable |
| products | Giữ id/slug/sku; category_id là danh mục chính; brand_id; các trường giá và nội dung hiện có; thêm SEO title/description/image |
| product_secondary_categories | product_id FK, category_id FK, UNIQUE(product_id, category_id); chỉ dùng cho phân loại phụ thực sự |
| navigation_items | id, parent_id, label, category_id nullable, destination_type, internal_path nullable, icon, sort_order, enabled; mỗi mục có đúng một đích |
| product_collections | id, slug UNIQUE, name, description, SEO, status; nhóm biên tập như sản phẩm nổi bật hoặc theo nhu cầu |
| product_collection_items | collection_id, product_id, sort_order; UNIQUE(collection_id, product_id) |
| attribute_definitions | id, code UNIQUE, name, type(number/enum/boolean/text), unit, filterable |
| attribute_options | id, attribute_id, code, label; UNIQUE(attribute_id, code) |
| category_attributes | category_id, attribute_id, required, sort_order; UNIQUE(category_id, attribute_id) |
| product_attribute_values | product_id, attribute_id, value_number/value_text/value_boolean/option_id; UNIQUE(product_id, attribute_id), kiểm tra kiểu giá trị |
| url_redirects | id, source_path UNIQUE, target_path, status_code=301, enabled |

Payload quản lý các bảng quan hệ qua relationship hasMany/array khi phù hợp; tên bảng SQL thực tế do migration sinh ra. Không tạo song song bảng thủ công trùng với cấu trúc Payload.

## Cây khởi đầu

- Thiết bị văn phòng → Máy scan → ADF, ADF + Flatbed, Flatbed, scan sách, scan khổ lớn; Máy in → laser đen trắng, laser màu, phun, nhiệt; Máy photocopy.
- Máy tính → Laptop → văn phòng, gaming; Desktop → đồng bộ, All-in-One, mini PC; Máy chủ.
- Thiết bị mạng → Router, Access Point, Switch → PoE, quản lý, thường; Firewall; cáp và phụ kiện.
- An ninh giám sát → Camera quan sát, lưu trữ camera, phụ kiện.
- Hội nghị & giáo dục → Camera hội nghị, thiết bị hội nghị, máy chiếu vật thể; Kandao là thương hiệu/bộ lọc, không cần một cấp danh mục riêng.
- Phần mềm → Office, hệ điều hành, bảo mật, phần mềm máy chủ; Microsoft 365 phân loại theo loại giấy phép/sản phẩm phù hợp.
- Thiết bị hình ảnh → Máy ảnh, ống kính, máy quay, phụ kiện. Canon/Sony/Fujifilm là thương hiệu, không nhân bản cây theo hãng.
- IoT & công nghiệp → thiết bị IoT, mô-đun, máy tính công nghiệp, năng lượng.
- Âm thanh và nguồn điện nên tách thành hai nhóm phân loại; menu có thể trình bày chung nếu cần.

## Quy tắc vận hành

- Một danh mục có đúng một cha; chặn tự làm cha và vòng lặp, kể cả khi đổi cha qua API.
- Sản phẩm có một danh mục chính để tạo breadcrumb/canonical; có thể xuất hiện ở danh mục phụ hoặc collection mà không nhân bản sản phẩm.
- Xem danh mục cha phải bao gồm sản phẩm các cấp con và loại trùng theo product ID.
- Menu độc lập với taxonomy: có thể đặt Camera hội nghị ở nhiều vị trí menu cùng trỏ một danh mục.
- Không xóa danh mục còn con hoặc sản phẩm; chuyển dữ liệu trước rồi lưu trữ danh mục cũ.
- Thay đổi danh mục phải xóa cache menu, danh sách, breadcrumb và trang chủ.
- Index parent_id, (parent_id, sort_order), products.category_id và hai chiều của các bảng quan hệ. Chỉ thêm index thuộc tính sau khi có truy vấn lọc thực tế.

## URL và SEO

- Giữ URL sản phẩm `/san-pham/{slug}` ổn định khi chuyển nhóm.
- Danh mục dùng `/danh-muc/{slug}` với slug duy nhất toàn hệ thống; cây cha xuất hiện trong breadcrumb. Đổi cha không buộc đổi URL.
- Mỗi danh mục xuất bản có tiêu đề SEO, mô tả, H1 và nội dung riêng; canonical trỏ URL chuẩn của danh mục.
- Khi đổi slug, ghi redirect 301 trong cùng giao dịch; chặn vòng lặp và rút gọn chuỗi redirect.
- Chuyển liên kết cũ `san-pham?category=...` sang trang danh mục; giữ các tham số lọc hợp lệ khi điều hướng.
- Bộ lọc tự do không đưa vào sitemap. Chỉ tạo landing page thương hiệu/nhu cầu khi có nội dung và giá trị riêng; canonical/noindex phải được quyết định theo từng loại trang, không áp dụng đại trà.
- Sitemap chỉ liệt kê trang xuất bản được phép index; thêm BreadcrumbList và Product structured data khớp dữ liệu hiển thị.

## Kế hoạch chuyển đổi không mất dữ liệu

1. Sao lưu DB và xuất bảng đối chiếu product ID, category ID, slug, số lượng sản phẩm và URL hiện tại.
2. Thêm trường mới dạng nullable và collection mới bằng migration Payload; tắt DB push ở production.
3. Lập bảng ánh xạ danh mục cũ → danh mục mới; đánh dấu các nhóm theo hãng để chuyển brand/filter. Giữ ID danh mục phù hợp, không nhập lại toàn bộ sản phẩm.
4. Tạo cây cha, cập nhật category chính; giữ các tên cũ làm redirect khi hợp nhất. Tách danh mục cần quy tắc dựa trên dữ liệu sản phẩm, đưa trường hợp không rõ vào danh sách duyệt.
5. Chuyển menu/trang chủ sang dữ liệu CMS, truy vấn danh mục theo cây; thêm trang danh mục, breadcrumb và redirect.
6. So sánh tổng sản phẩm, quan hệ ảnh/brand, sản phẩm mồ côi, vòng lặp, URL trùng và redirect. Kiểm tra cha bao gồm con và mỗi sản phẩm chỉ xuất hiện một lần.
7. Chạy thử trên bản sao database trước, rồi mới áp dụng lên DB đang dùng. Giữ bảng ánh xạ và bản sao lưu để rollback.

## Tiêu chí hoàn tất

Thêm/sắp xếp danh mục và menu từ CMS không sửa code; chuyển nhóm không đổi URL sản phẩm; tách/gộp không mất sản phẩm hay ảnh; URL cũ điều hướng đúng; sitemap/canonical/breadcrumb phản ánh taxonomy hiện tại.
