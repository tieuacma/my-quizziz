'use client'

import { signUp } from '../actions'
import { useActionState, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react'; // Import icon con mắt

type State = {
  error?: string
  field?: string
} | null

export default function SignUpPage() {
  const [state, formAction, isPending] = useActionState(signUp, null);
  // Tạo state để kiểm soát việc ẩn/hiện mật khẩu
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Đăng ký tài khoản
          </h2>
        </div>
        <form className="mt-8 space-y-6" action={formAction}>
          <input type="hidden" name="remember" value="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            {/* Input Username */}
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm ${
                  state?.field === 'username' ? 'border-red-500' : 'border-gray-300 focus:border-indigo-500'
                }`}
                placeholder="Username"
              />
            </div>

            {/* Input Email */}
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm ${
                  state?.field === 'email' ? 'border-red-500' : 'border-gray-300 focus:border-indigo-500'
                }`}
                placeholder="Email"
              />
            </div>

            {/* Input Password với nút Con Mắt */}
            <div className="relative"> 
              <label htmlFor="password" className="sr-only">Mật khẩu</label>
              <input
                id="password"
                name="password"
                // Thay đổi type dựa trên state
                type={showPassword ? "text" : "password"} 
                autoComplete="new-password"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:z-10 sm:text-sm ${
                  state?.field === 'password' ? 'border-red-500' : 'border-gray-300 focus:border-indigo-500'
                }`}
                placeholder="Mật khẩu"
              />
              {/* Nút con mắt */}
              <button
                type="button" // Quan trọng: phải là type="button" để không làm submit form
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-indigo-600 transition-colors z-20"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Eye className="h-5 w-5" aria-hidden="true" />
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
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-400"
            >
              {isPending ? 'Đang xử lý...' : 'Đăng ký'}
            </button>
          </div>
          <div className="text-center">
            <a href="/auth/login" className="text-indigo-600 hover:text-indigo-500">
              Đã có tài khoản? Đăng nhập
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}