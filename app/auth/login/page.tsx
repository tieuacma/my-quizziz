'use client'

import { signIn } from '../actions'
import { useActionState, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react'; // Import icons

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(signIn, null);
  // State để kiểm soát ẩn/hiện mật khẩu
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Đăng nhập vào hệ thống
          </h2>
        </div>
        <form className="mt-8 space-y-6" action={formAction}>
          <input type="hidden" name="remember" value="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="identifier" className="sr-only">
                Username hoặc Email
              </label>
              <input
                id="identifier"
                name="identifier"
                type="text"
                autoComplete="username email"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm ${
                  state?.field === 'identifier' ? 'border-red-500' : 'border-gray-300 focus:border-indigo-500'
                }`}
                placeholder="Username hoặc Email"
              />
            </div>
            
            {/* Password Input Container */}
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Mật khẩu
              </label>
              <input
                id="password"
                name="password"
                // Thay đổi type dựa vào state showPassword
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm ${
                  state?.field === 'password' ? 'border-red-500' : 'border-gray-300 focus:border-indigo-500'
                }`}
                placeholder="Mật khẩu"
              />
              
              {/* Eye Button */}
              <button
                type="button" // Để không kích hoạt submit form
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-indigo-600 transition-colors z-20"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1} // Bỏ qua khi nhấn phím Tab để trải nghiệm mượt hơn
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {state?.error && (
            <div className="text-red-600 text-sm text-center">
              {state.error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isPending}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
              {isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </div>
          <div className="text-center">
            <a href="/auth/signup" className="text-indigo-600 hover:text-indigo-500">
              Chưa có tài khoản? Đăng ký
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}