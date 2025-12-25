import { signOut } from './auth/actions'

interface AuthHeaderProps {
  user: any
}

export default function AuthHeader({ user }: AuthHeaderProps) {
  if (!user) return null

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">Kì Thi 22/12</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">Chào mừng, {user.email}</span>
            <form action={signOut}>
              <button
                type="submit"
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Đăng xuất
              </button>
            </form>
          </div>
        </div>
      </div>
    </header>
  )
}
