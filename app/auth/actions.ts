'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

type ActionState = {
  error?: string
  field?: string
} | null

// Hàm validate mật khẩu giữ nguyên của bạn
function validatePassword(password: string): string | null {
  if (password.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự.'
  if (!/[a-z]/.test(password)) return 'Mật khẩu phải chứa ít nhất một chữ cái thường.'
  if (!/[A-Z]/.test(password)) return 'Mật khẩu phải chứa ít nhất một chữ cái hoa.'
  if (!/\d/.test(password)) return 'Mật khẩu phải chứa ít nhất một chữ số.'
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) return 'Mật khẩu phải chứa ít nhất một ký tự đặc biệt.'
  return null
}

export async function signUp(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient()

  const username = (formData.get('username') as string)?.trim()
  const email = (formData.get('email') as string)?.trim()
  const password = formData.get('password') as string

  // 1. Validate cơ bản
  if (!username || username.length < 3) {
    return { error: 'Username phải có ít nhất 3 ký tự.', field: 'username' }
  }

  const passwordError = validatePassword(password)
  if (passwordError) {
    return { error: passwordError, field: 'password' }
  }

  // 2. Kiểm tra Username đã tồn tại trong bảng profiles chưa
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', username)
    .maybeSingle()

  if (existingProfile) {
    return { error: 'Username này đã được sử dụng.', field: 'username' }
  }

  // 3. Đăng ký tài khoản Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username }, // Backup vào metadata
    },
  })

  if (authError) {
    if (authError.message.includes('already registered')) {
      return { error: 'Email này đã có tài khoản.', field: 'email' }
    }
    return { error: authError.message, field: 'email' }
  }

  // 4. Lưu Username vào bảng profiles
  if (authData.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        { 
          id: authData.user.id, 
          username: username 
        }
      ])

    if (profileError) {
      // Nếu lỗi lưu profile (ví dụ: lỗi DB), thông báo cho người dùng
      return { error: 'Không thể khởi tạo hồ sơ: ' + profileError.message }
    }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signIn(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient()

  const identifier = (formData.get('identifier') as string)?.trim()
  const password = formData.get('password') as string

  let email = identifier

  // Nếu người dùng nhập username (không có @), cần tìm email tương ứng
  if (!identifier.includes('@')) {
     // Lưu ý: Để tính năng này hoạt động, bạn cần lưu cả email vào bảng profiles
     // hoặc sử dụng metadata. Ở đây tôi giả định bạn dùng email để đăng nhập cho đơn giản.
     return { error: 'Vui lòng sử dụng Email để đăng nhập.', field: 'identifier' }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: 'Email hoặc mật khẩu không chính xác.', field: 'password' }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/auth/login')
}