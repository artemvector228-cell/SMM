'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, TrendingUp, CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

const NICHES = ['Онлайн-коучинг', 'E-commerce', 'SaaS', 'Консалтинг', 'Недвижимость', 'Фитнес', 'Финансы', 'Образование']
const GOALS = [
  { value: 'dm', label: 'DM и личные сообщения' },
  { value: 'telegram', label: 'Рост Telegram-канала' },
  { value: 'call', label: 'Звонки и консультации' },
  { value: 'landing', label: 'Трафик на лендинг' },
]

export default function OnboardingPage() {
  const [step, setStep] = useState(0)
  const [niche, setNiche] = useState('')
  const [goal, setGoal] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function finish() {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('profiles').upsert({
          id: user.id,
          email: user.email!,
          plan: 'free',
          generations_used: 0,
        })
      }
      router.push('/dashboard')
    } catch {
      toast.error('Что-то пошло не так')
    }
    setLoading(false)
  }

  const steps = [
    {
      title: 'Ваша ниша?',
      subtitle: 'Мы адаптируем контент под ваш рынок',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {NICHES.map((n) => (
              <button
                key={n}
                onClick={() => setNiche(n)}
                className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                  niche === n
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          <div className="space-y-2">
            <Label>Или введите свою</Label>
            <Input
              placeholder="Например: Маркетинговое агентство"
              value={NICHES.includes(niche) ? '' : niche}
              onChange={(e) => setNiche(e.target.value)}
            />
          </div>
        </div>
      ),
      canContinue: niche.length > 0,
    },
    {
      title: 'Главная цель конверсии?',
      subtitle: 'Весь контент будет оптимизирован под этот результат',
      content: (
        <div className="space-y-3">
          {GOALS.map((g) => (
            <button
              key={g.value}
              onClick={() => setGoal(g.value)}
              className={`w-full p-4 rounded-lg border text-left transition-all flex items-center justify-between ${
                goal === g.value
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <span className="font-medium">{g.label}</span>
              {goal === g.value && <CheckCircle2 className="w-4 h-4 text-primary" />}
            </button>
          ))}
        </div>
      ),
      canContinue: goal.length > 0,
    },
    {
      title: 'Всё готово!',
      subtitle: 'Ваш Revenue Content OS готов генерировать конверсии',
      content: (
        <div className="space-y-4">
          <div className="bg-muted rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Ниша</span>
              <span className="font-medium">{niche}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Цель</span>
              <span className="font-medium">{GOALS.find(g => g.value === goal)?.label ?? goal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Тариф</span>
              <Badge>Бесплатно — 10 генераций</Badge>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Генерируйте посты для Instagram, Telegram, сценарии Reels и многое другое — всё для конверсий.
          </p>
        </div>
      ),
      canContinue: true,
    },
  ]

  const current = steps[step]

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold">Revenue OS</span>
        </div>

        <div className="flex gap-2 mb-6">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                i <= step ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="p-6 space-y-6">
              <div>
                <h2 className="text-xl font-bold">{current.title}</h2>
                <p className="text-muted-foreground text-sm mt-1">{current.subtitle}</p>
              </div>

              {current.content}

              <div className="flex gap-3">
                {step > 0 && (
                  <Button variant="outline" onClick={() => setStep(s => s - 1)} className="flex-1">
                    Назад
                  </Button>
                )}
                <Button
                  className="flex-1"
                  disabled={!current.canContinue || loading}
                  onClick={() => step < steps.length - 1 ? setStep(s => s + 1) : finish()}
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {step < steps.length - 1 ? 'Продолжить' : 'Перейти в дашборд'}
                </Button>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

        <p className="text-center text-xs text-muted-foreground">Шаг {step + 1} из {steps.length}</p>
      </div>
    </div>
  )
}
