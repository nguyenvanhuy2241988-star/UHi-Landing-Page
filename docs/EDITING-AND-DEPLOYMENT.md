# Chỉnh sửa UHi từ ChatGPT và Antigravity

Repo chính: https://github.com/nguyenvanhuy2241988-star/UHi-Landing-Page
Website đích: https://uhi.vn

## Luồng làm việc

1. ChatGPT hoặc Antigravity đọc phiên bản main hiện tại, tạo nhánh theo công việc.
2. Sửa source trong repo này, chạy npm ci và npm run build.
3. Mở PR về main. GitHub chạy kiểm tra build.
4. Khi Vercel Git Integration đã kết nối, Vercel tạo deployment Preview cho nhánh/PR.
5. Gửi link Preview và các thay đổi để chủ website duyệt.
6. Chỉ sau khi được duyệt mới merge main. Với cấu hình production branch=main,
   Vercel tự build và cập nhật các domain đã gắn vào dự án.

Sửa riêng bản mẫu chatgpt.site không tự cập nhật uhi.vn.
Không cần tạo cron, bot đồng bộ hoặc thêm token Vercel vào GitHub Actions
khi dùng Vercel Git Integration. Workflow hiện tại chỉ kiểm tra build.

## Trạng thái kiểm tra ngày 10/11/2026

- Đã xác minh repo GitHub, quyền push và nhánh main.
- Đã xác minh Pixel, form lead và FloatingCTA trong mã nguồn.
- Chưa xác minh được project u-hi-landing-page trong tài khoản Vercel đang kết nối
  (cả phạm vi cá nhân và team LYHU's projects không trả về project tương ứng).
- Vì vậy chưa thể khẳng định auto Preview hoặc cập nhật production hoạt động.
- Không tạo project Vercel mới và không đổi DNS để tránh nhầm với site đang chạy.

## Việc cần làm tại project Vercel thực sự đang phục vụ uhi.vn

Chủ website hoặc Antigravity kiểm tra Settings > Git của project:

- Connected Repository: nguyenvanhuy2241988-star/UHi-Landing-Page.
- Production Branch: main.
- Framework: Vite; Build Command: npm run build; Output: dist.
- Root Directory: thư mục gốc của repo nếu không có cấu trúc monorepo mới.
- Git deployments/Preview cho nhánh công việc phải hoạt động.
- Domain uhi.vn/www.uhi.vn thuộc đúng project, không thay đổi DNS đang hoạt động.
- Kết nối Vercel của ChatGPT phải có quyền truy cập đúng account/team/project đó.

Xác minh bằng PR thiết lập này: kiểm tra Vercel check và link Preview ở PR.
Nếu không có check, xử lý Git Integration ở đúng project thay vì thêm project trùng.

## Khi tích hợp bộ thiết kế mới

Antigravity đã nhận bộ source UHi Design v10. Port giao diện sang Vite/React của
repo này. Backend COD/Cloudflare D1 và auth ChatGPT của prototype không thể
chép nguyên sang Vercel. Giữ source đang vận hành cho tới khi preview mới được duyệt.

## Duyệt bản phát hành

- Build pass và Vercel Preview READY cho đúng SHA của PR.
- Kiểm tra mobile/desktop, các liên kết, ảnh và font.
- Thử lead form trên môi trường đã thống nhất; không gửi đơn khách giả vào production.
- Pixel không khởi tạo trùng; không gửi dữ liệu khách trong URL hoặc analytics.
- Có đồng ý của chủ website trước merge. Sau merge kiểm tra production deployment
  đúng SHA và mở uhi.vn; nếu lỗi, dùng rollback tới deployment đã xác minh.

Hướng dẫn AGENTS.md là quy tắc làm việc cho agent, không thay thế branch protection
ở cấp GitHub. PR build cũng không tự đặt required reviewers hay khóa nhánh main.
