const isVercel = process.env.VERCEL === '1';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Nếu chạy trên Vercel, không dùng 'export'. Nếu GitHub Pages thì giữ 'export'
  output: isVercel ? undefined : 'export',
  
  images: { 
    unoptimized: true 
  },
  
  // Chỉ áp dụng basePath và assetPrefix khi KHÔNG phải là Vercel
  basePath: isVercel ? '' : '/my-quizziz',
  assetPrefix: isVercel ? '' : '/my-quizziz/',
};

export default nextConfig;