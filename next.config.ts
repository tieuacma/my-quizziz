/** @type {import('next').NextConfig} */
// 1. Kiểm tra môi trường
// isDev: đang chạy npm run dev
// isVercel: đang chạy trên server Vercel
const isDev = process.env.NODE_ENV === 'development';
const isVercel = process.env.VERCEL === '1';

const nextConfig = {
  // 2. Cấu hình Output
  // Chỉ dùng 'export' khi không phải Vercel và không phải Dev (tức là dùng cho GitHub Pages)
  output: (isVercel || isDev) ? undefined : 'export',

  images: {
    unoptimized: true,
  },

  // 3. Cấu hình Đường dẫn (Quan trọng nhất để hết lỗi 404 Local)
  // Chỉ thêm '/my-quizziz' khi build thực tế cho GitHub Pages
  basePath: (isVercel || isDev) ? '' : '/my-quizziz',
  assetPrefix: (isVercel || isDev) ? '' : '/my-quizziz/',
};

export default nextConfig;