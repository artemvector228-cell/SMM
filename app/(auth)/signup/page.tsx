'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { TrendingUp, Loader2, ArrowRight, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding` },
    })
    if (error) {
      if (error.message.includes('rate limit') || error.message.includes('429')) {
        toast.error('Слишком много попыток. Подождите несколько минут и попробуйте снова.')
      } else if (error.message.includes('already registered') || error.message.includes('already exists')) {
        toast.error('Этот email уже зарегистрирован. Попробуйте войти.')
      } else if (error.message.includes('invalid') || error.message.includes('email')) {
        toast.error('Неверный формат email.')
      } else if (error.message.includes('password') || error.message.includes('weak')) {
        toast.error('Пароль слишком простой. Используйте минимум 6 символов.')
      } else {
        toast.error('Ошибка регистрации. Попробуйте ещё раз.')
      }
    } else {
      router.push('/onboarding')
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
            Создать аккаунт
          </h1>
          <p className="mt-1.5 text-sm text-center" style={{ color: '#8A8882' }}>
            15 генераций бесплатно · Карта не нужна
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
              <label
                htmlFor="password"
                className="text-sm font-medium"
                style={{ color: '#111110' }}
              >
                Пароль
              </label>
              <input
                id="password"
                type="password"
                placeholder="Минимум 6 символов"
                value={password}
                onChange={e => setPassword(e.target.value)}
                minLength={6}
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
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full font-bold text-sm text-white transition-all duration-150 disabled:opacity-60 cursor-pointer mt-1"
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
                : <>Зарегистрироваться <ArrowRight className="w-4 h-4" strokeWidth={2.5} /></>}
            </button>
          </form>
        </div>

        {/* Trust */}
        <p className="flex items-center justify-center gap-1.5 mt-4 text-xs" style={{ color: '#8A8882' }}>
          <ShieldCheck className="w-3.5 h-3.5" style={{ color: '#186435' }} />
          Без карты · Отмена в любой момент
        </p>

        {/* Footer link */}
        <p className="text-center text-sm mt-4" style={{ color: '#8A8882' }}>
          Уже есть аккаунт?{' '}
          <Link
            href="/login"
            className="font-medium transition-colors"
            style={{ color: '#111110' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#1B40AE' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#111110' }}
          >
            Войти
          </Link>
        </p>
      </div>
    </div>
  )
}
