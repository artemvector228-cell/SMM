export type Plan = 'free' | 'starter' | 'growth' | 'premium' | 'pro'

export type ConversionGoal = 'dm' | 'telegram' | 'call' | 'landing'

export type Tone = 'aggressive' | 'authoritative' | 'empathetic' | 'bold' | 'professional'

export interface QualityScore {
  clarity: number
  specificity: number
  conversion_strength: number
  novelty: number
  credibility: number
  channel_fit: number
  total: number
  grade: 'S' | 'A' | 'B' | 'C'
  issues: string[]
  passed: boolean
}

export interface Profile {
  id: string
  email: string
  plan: Plan
  generations_used: number
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  created_at: string
}

export interface Project {
  id: string
  user_id: string
  name: string
  niche: string | null
  created_at: string
}

export interface Generation {
  id: string
  user_id: string
  project_id: string | null
  input_json: GenerationInput
  output_json: GenerationOutput
  created_at: string
  scheduled_at?: string | null
}

export interface GenerationInput {
  niche: string
  offer: string
  audience: string
  pain_points: string
  tone: Tone
  conversion_goal: ConversionGoal
}

export interface GenerationOutput {
  instagram_post: {
    hook: string
    pain_agitation: string
    value_body: string
    cta: string
    hashtags: string[]
  }
  telegram_post: {
    structure: string[]
    cta: string
  }
  stories: string[]
  reels_script: {
    hook: string
    scenes: string[]
    cta: string
  }
  viral_hooks: string[]
  conversion_strategy: {
    primary_trigger: string
    psychological_levers: string[]
    cta_mechanism: string
  }
  quality_scores?: {
    instagram: QualityScore
    telegram: QualityScore
    overall: number
  }
}

export interface PlanLimit {
  plan: Plan
  maxGenerations: number | null
  label: string
  price: string
  priceMonthly?: number
  features: string[]
  highlight?: boolean
  badge?: string
}

export const PLAN_LIMITS: Record<Plan, PlanLimit> = {
  free: {
    plan: 'free',
    maxGenerations: 10,
    label: 'Бесплатно',
    price: '0 ₽',
    priceMonthly: 0,
    features: [
      '10 генераций',
      'Все форматы контента',
      'Базовая библиотека',
      'Telegram-публикация',
    ],
  },
  starter: {
    plan: 'starter',
    maxGenerations: 100,
    label: 'Starter',
    price: '990 ₽/мес',
    priceMonthly: 990,
    features: [
      '100 генераций в месяц',
      'Все форматы контента',
      'Quality Gate (оценка текстов)',
      'Библиотека + шаблоны',
      'Telegram-публикация',
      'Контент-план на 30 дней',
    ],
  },
  growth: {
    plan: 'growth',
    maxGenerations: 500,
    label: 'Growth',
    price: '2 490 ₽/мес',
    priceMonthly: 2490,
    highlight: true,
    badge: 'Популярный',
    features: [
      '500 генераций в месяц',
      'Всё из Starter',
      'Brand Voice Engine',
      'A/B трекинг хуков',
      'Аналитика конверсий',
      'Авто-переписка при низком Quality Gate',
      'Приоритетный AI (GPT-4 класс)',
    ],
  },
  premium: {
    plan: 'premium',
    maxGenerations: null,
    label: 'Premium',
    price: '4 990 ₽/мес',
    priceMonthly: 4990,
    badge: 'Безлимит',
    features: [
      'Безлимитные генерации',
      'Всё из Growth',
      'Командная работа (до 5 человек)',
      'ROI Dashboard',
      'Приоритетная поддержка',
      'Кастомные тоны и шаблоны',
      'API доступ',
    ],
  },
  pro: {
    plan: 'pro',
    maxGenerations: null,
    label: 'Pro',
    price: '500 ₽/мес',
    priceMonthly: 500,
    features: ['Безлимитные генерации', 'Все форматы контента', 'Все шаблоны', 'Приоритетный AI', 'Библиотека контента'],
  },
}

// Helper: get effective plan limit (treat 'pro' as 'premium' for limits)
export function getPlanLimit(plan: string): PlanLimit {
  return PLAN_LIMITS[plan as Plan] ?? PLAN_LIMITS.free
}
