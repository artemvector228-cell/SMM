export type Plan = 'free' | 'pro'

export type ConversionGoal = 'dm' | 'telegram' | 'call' | 'landing'

export type Tone = 'aggressive' | 'authoritative' | 'empathetic' | 'bold' | 'professional'

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
}

export interface PlanLimit {
  plan: Plan
  maxGenerations: number | null
  label: string
  price: string
  features: string[]
}

export const PLAN_LIMITS: Record<Plan, PlanLimit> = {
  free: {
    plan: 'free',
    maxGenerations: 10,
    label: 'Бесплатно',
    price: '0 ₽',
    features: ['10 генераций', 'Все форматы контента', 'Базовые шаблоны'],
  },
  pro: {
    plan: 'pro',
    maxGenerations: null,
    label: 'Pro',
    price: '500 ₽/мес',
    features: ['Безлимитные генерации', 'Все форматы контента', 'Все шаблоны', 'Приоритетный AI', 'Библиотека контента'],
  },
}
