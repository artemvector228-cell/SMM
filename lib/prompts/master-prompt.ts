import OpenAI from 'openai'
import { GenerateInput } from '@/lib/validations'
import { GenerationOutput } from '@/types'
import { buildInstagramPrompt } from './instagram-agent'
import { buildTelegramPrompt } from './telegram-agent'
import { buildStoriesPrompt } from './stories-agent'
import { buildReelsPrompt } from './reels-agent'
import { buildHooksPrompt } from './hooks-agent'
import { buildCTAPrompt } from './cta-optimizer'

const GROQ_TIMEOUT_MS = 25_000
const MAX_RETRIES = 2

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
  timeout: GROQ_TIMEOUT_MS,
  maxRetries: MAX_RETRIES,
})

async function runAgent<T>(prompt: string): Promise<T> {
  const response = await openai.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.8,
  })

  const content = response.choices[0].message.content
  if (!content) throw new Error('Empty AI response')
  return JSON.parse(content) as T
}

async function runArrayAgent<T>(prompt: string): Promise<T> {
  const response = await openai.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'user',
        content: prompt + '\n\nIMPORTANT: Wrap your JSON array in an object like: {"result": [your array here]}',
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.85,
  })

  const content = response.choices[0].message.content
  if (!content) throw new Error('Empty AI response')
  const parsed = JSON.parse(content)
  return (parsed.result ?? parsed) as T
}

export async function generateAllContent(input: GenerateInput): Promise<GenerationOutput> {
  const [instagram, telegram, stories, reels, hooks, strategy] = await Promise.allSettled([
    runAgent<GenerationOutput['instagram_post']>(buildInstagramPrompt(input)),
    runAgent<GenerationOutput['telegram_post']>(buildTelegramPrompt(input)),
    runArrayAgent<string[]>(buildStoriesPrompt(input)),
    runAgent<GenerationOutput['reels_script']>(buildReelsPrompt(input)),
    runArrayAgent<string[]>(buildHooksPrompt(input)),
    runAgent<GenerationOutput['conversion_strategy']>(buildCTAPrompt(input)),
  ])

  const resolve = <T>(result: PromiseSettledResult<T>, fallback: T): T =>
    result.status === 'fulfilled' ? result.value : fallback

  return {
    instagram_post: resolve(instagram, { hook: '', pain_agitation: '', value_body: '', cta: '', hashtags: [] } as GenerationOutput['instagram_post']),
    telegram_post: resolve(telegram, { structure: [], cta: '' } as GenerationOutput['telegram_post']),
    stories: (() => { const v = resolve(stories, []); return Array.isArray(v) ? v : (v as any).result ?? [] })(),
    reels_script: resolve(reels, { hook: '', scenes: [], cta: '' } as GenerationOutput['reels_script']),
    viral_hooks: (() => { const v = resolve(hooks, []); return Array.isArray(v) ? v : (v as any).result ?? [] })(),
    conversion_strategy: resolve(strategy, { primary_trigger: '', psychological_levers: [], cta_mechanism: '' } as GenerationOutput['conversion_strategy']),
  }
}
