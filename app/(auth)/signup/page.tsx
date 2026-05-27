'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { TrendingUp, Loader2 } from 'lucide-react'
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
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center mb-2">
            <TrendingUp className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">Создать аккаунт</h1>
          <p className="text-muted-foreground text-sm">Начни генерировать контент, который конвертирует</p>
        </div>

        <Card className="p-6">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                placeholder="Минимум 6 символов"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Зарегистрироваться
            </Button>
          </form>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          Уже есть аккаунт?{' '}
          <Link href="/login" className="text-foreground font-medium hover:underline">
            Войти
          </Link>
        </p>
      </div>
    </div>
  )
}
