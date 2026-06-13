'use client'

import { Suspense, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { TrendingUp, Loader2, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageContent />
    </Suspense>
  )
}

function LoginPageContent() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/dashboard'

  async function onReset() {
    if (!email) {
      toast.error('Введите email выше, затем нажмите «Забыл пароль».')
      return
    }
    setResetLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    })
    if (error) {
      toast.error('Не удалось отправить письмо. Проверьте email.')
    } else {
      toast.success('Письмо отправлено — проверьте почту.')
    }
    setResetLoading(false)
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      if (error.message.includes('Email not confirmed')) {
        toast.error('Подтвердите email — проверьте почту и перейдите по ссылке.')
      } else if (error.message.includes('rate limit')) {
        toast.error('Слишком много попыток. Подождите несколько минут.')
      } else {
        toast.error('Неверный email или пароль.')
      }
    } else {
      router.push(redirectTo)
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: '#F5F4F0' }}
    >
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
            style={{ background: '#1B40AE' }}
          >
            <TrendingUp className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: '#111110', fontFamily: 'var(--font-space-grotesk)' }}
          >
            С возвращением
          </h1>
          <p className="mt-1.5 text-sm text-center" style={{ color: '#8A8882' }}>
            Войдите в аккаунт Revenue OS
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-6"
          style={{ background: '#FFFFFF', border: '1px solid #E6E3DB', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
        >
          <form onSubmit={onSubmit} className="space-y-4">

            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-sm font-medium"
                style={{ color: '#111110' }}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-sm rounded-xl outline-none transition-all"
                style={{
                  background: '#FAFAF8',
                  border: '1px solid #E6E3DB',
                  color: '#111110',
                  fontFamily: 'var(--font-geist-sans)',
                }}
                onFocus={e => {
                  e.currentTarget.style.borderColor = '#1B40AE'
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(27,64,174,0.08)'
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = '#E6E3DB'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium"
                  style={{ color: '#111110' }}
                >
                  Пароль
                </label>
                <button
                  type="button"
                  onClick={onReset}
                  disabled={resetLoading}
                  className="text-xs transition-colors"
                  style={{ color: '#8A8882' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#111110' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#8A8882' }}
                >
                  {resetLoading ? 'Отправка...' : 'Забыл пароль'}
                </button>
              </div>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-sm rounded-xl outline-none transition-all"
                style={{
                  background: '#FAFAF8',
                  border: '1px solid #E6E3DB',
                  color: '#111110',
                  fontFamily: 'var(--font-geist-sans)',
                }}
                onFocus={e => {
                  e.currentTarget.style.borderColor = '#1B40AE'
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(27,64,174,0.08)'
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = '#E6E3DB'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full font-bold text-sm text-white transition-all duration-150 disabled:opacity-60 cursor-pointer"
              style={{ background: '#1B40AE', boxShadow: '0 4px 14px rgba(27,64,174,0.28)' }}
              onMouseEnter={e => {
                if (!loading) (e.currentTarget as HTMLElement).style.background = '#163596'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = '#1B40AE'
              }}
            >
              {loading
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <>Войти <ArrowRight className="w-4 h-4" strokeWidth={2.5} /></>}
            </button>
          </form>
        </div>

        {/* Footer link */}
        <p className="text-center text-sm mt-6" style={{ color: '#8A8882' }}>
          Нет аккаунта?{' '}
          <Link
            href="/signup"
            className="font-medium transition-colors"
            style={{ color: '#111110' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#1B40AE' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#111110' }}
          >
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  )
}
