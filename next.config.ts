/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === 'development';
const isVercel = process.env.VERCEL === '1';

const nextConfig = {
  // FIX: Xóa bỏ hoàn toàn logic ép 'export' 
  // Next.js sẽ tự động chọn chế độ phù hợp (Server-side)
  output: undefined, 

  images: {
    unoptimized: true,
  },

  // BasePath chỉ cần thiết nếu bạn định deploy vào thư mục con của một tên miền
  // Nếu deploy Vercel hoặc chạy local bình thường, tốt nhất nên để trống
  basePath: (isVercel || isDev) ? '' : '', 
  assetPrefix: (isVercel || isDev) ? '' : '',
};

export default nextConfig;