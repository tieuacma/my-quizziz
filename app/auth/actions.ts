'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

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

export async function signIn(formData: FormData) {
  const supabase = await createClient()

  const identifier = formData.get('identifier') as string
  const password = formData.get('password') as string

  // Determine if identifier is email or username
  const isEmail = identifier.includes('@')
  const email = isEmail ? identifier : '' // If not email, we need to find email by username

  if (!isEmail) {
    // To handle username, we need to query the profiles table or user_metadata
    // Assuming a profiles table exists with username and user_id
    // For now, throw error as table may not exist
    throw new Error('Đăng nhập bằng username chưa được hỗ trợ. Vui lòng sử dụng email.')
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signUp(formData: FormData) {
  const supabase = await createClient()

  const username = formData.get('username') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // Validate password
  const passwordError = validatePassword(password)
  if (passwordError) {
    throw new Error(passwordError)
  }

  // Check if username exists (assuming profiles table exists)
  // If not, this will fail
  const { data: existingUser, error: usernameError } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', username)
    .single()

  if (existingUser) {
    throw new Error('Username này đã được sử dụng.')
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
      throw new Error('Email này đã có tài khoản.')
    }
    throw new Error(error.message)
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
