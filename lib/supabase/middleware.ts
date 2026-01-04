import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// 1. Hàm middleware chính thức mà Next.js sẽ gọi
export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

// 2. Logic cập nhật session (giữ nguyên của bạn nhưng sửa nhẹ setAll)
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Lưu ý: getUser() sẽ giúp refresh token tự động nếu nó sắp hết hạn
  await supabase.auth.getUser()

  return response
}

// 3. Cấu hình Matcher (QUAN TRỌNG: giúp middleware không chạy vào file tĩnh)
export const config = {
  matcher: [
    /*
     * Khớp tất cả các đường dẫn trừ:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - các file ảnh (svg, png, jpg, etc)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}