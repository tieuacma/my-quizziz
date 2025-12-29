'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

type ActionState = {
  error?: string
  field?: string
} | null

function validatePassword(password: string): string | null {
  if (password.length < 6) {
    return 'Mật khẩu phải có ít nhất 6 ký tự.'
  }
  if (!/[a-z]/.test(password)) {
    return 'Mật khẩu phải chứa ít nhất một chữ cái thường.'
  }
  if (!/[A-Z]/.test(password)) {
    return 'Mật khẩu phải chứa ít nhất một chữ cái hoa.'
  }
  if (!/\d/.test(password)) {
    return 'Mật khẩu phải chứa ít nhất một chữ số.'
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return 'Mật khẩu phải chứa ít nhất một ký tự đặc biệt.'
  }
  return null
}

export async function signIn(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient()

  const identifier = formData.get('identifier') as string
  const password = formData.get('password') as string

  // Determine if identifier is email or username
  const isEmail = identifier.includes('@')
  const email = isEmail ? identifier : '' // If not email, we need to find email by username

  if (!isEmail) {
    // To handle username, we need to query the profiles table or user_metadata
    // Assuming a profiles table exists with username and user_id
    // For now, return error as table may not exist
    return { error: 'Đăng nhập bằng username chưa được hỗ trợ. Vui lòng sử dụng email.', field: 'identifier' }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message, field: 'password' }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signUp(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient()

  const username = formData.get('username') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // Validate password
  const passwordError = validatePassword(password)
  if (passwordError) {
    return { error: passwordError, field: 'password' }
  }

  // Check if username exists (assuming profiles table exists)
  // If not, this will fail
  const { data: existingUser, error: usernameError } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', username)
    .single()

  if (existingUser) {
    return { error: 'Username này đã được sử dụng.', field: 'username' }
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
      },
    },
  })

  if (error) {
    if (error.message.includes('already registered')) {
      return { error: 'Email này đã có tài khoản.', field: 'email' }
    }
    return { error: error.message, field: 'email' }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signOut() {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/', 'layout')
  redirect('/auth/login')
}
