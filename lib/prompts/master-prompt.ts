import OpenAI from 'openai'
import { GenerateInput } from '@/lib/validations'
import { GenerationOutput, QualityScore } from '@/types'
import { buildInstagramPrompt } from './instagram-agent'
import { buildTelegramPrompt } from './telegram-agent'
import { buildStoriesPrompt } from './stories-agent'
import { buildReelsPrompt } from './reels-agent'
import { buildHooksPrompt } from './hooks-agent'
import { buildCTAPrompt } from './cta-optimizer'
import {
  buildQualityGatePrompt,
  buildPremiumRewritePrompt,
  gradeFromScore,
  type QualityScore as RawScore,
} from './quality-gate'

const GROQ_TIMEOUT_MS = 28_000
const MAX_RETRIES = 2
const QUALITY_THRESHOLD = 80

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
  timeout: GROQ_TIMEOUT_MS,
  maxRetries: MAX_RETRIES,
})

async function runAgent<T>(prompt: string, temperature = 0.8): Promise<T> {
  const response = await openai.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature,
  })
  const content = response.choices[0].message.content
  if (!content) throw new Error('Empty AI response')
  return JSON.parse(content) as T
}

async function runArrayAgent<T>(prompt: string): Promise<T> {
  const response = await openai.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{
      role: 'user',
      content: prompt + '\n\nIMPORTANT: Wrap your JSON array in an object like: {"result": [your array here]}',
    }],
    response_format: { type: 'json_object' },
    temperature: 0.85,
  })
  const content = response.choices[0].message.content
  if (!content) throw new Error('Empty AI response')
  const parsed = JSON.parse(content)
  return (parsed.result ?? parsed) as T
}

type IGPost = GenerationOutput['instagram_post']
type TGPost = GenerationOutput['telegram_post']

async function scoreAndRefine(
  ig: IGPost,
  tg: TGPost,
  input: GenerateInput
): Promise<{ ig: IGPost; tg: TGPost; scores: GenerationOutput['quality_scores'] }> {
  const igText = [ig.hook, ig.pain_agitation, ig.value_body, ig.cta].join('\n\n')
  const tgText = [...(tg.structure ?? []), tg.cta].join('\n\n')

  // Run scoring in parallel
  const [igScoreRaw, tgScoreRaw] = await Promise.allSettled([
    runAgent<Omit<RawScore, 'total' | 'grade' | 'passed'>>(
      buildQualityGatePrompt(igText, 'instagram', input), 0.3
    ),
    runAgent<Omit<RawScore, 'total' | 'grade' | 'passed'>>(
      buildQualityGatePrompt(tgText, 'telegram', input), 0.3
    ),
  ])

  function buildScore(raw: Omit<RawScore, 'total' | 'grade' | 'passed'>): QualityScore {
    const total = Math.min(100, Math.round(
      (raw.clarity ?? 0) +
      (raw.specificity ?? 0) +
      (raw.conversion_strength ?? 0) +
      (raw.novelty ?? 0) +
      (raw.credibility ?? 0) +
      (raw.channel_fit ?? 0)
    ))
    return {
      ...raw,
      total,
      grade: gradeFromScore(total),
      passed: total >= QUALITY_THRESHOLD,
      issues: raw.issues ?? [],
    }
  }

  let igScore: QualityScore
  let tgScore: QualityScore

  if (igScoreRaw.status === 'fulfilled') {
    igScore = buildScore(igScoreRaw.value)
  } else {
    igScore = { clarity: 15, specificity: 15, conversion_strength: 18, novelty: 10, credibility: 7, channel_fit: 8, total: 73, grade: 'B', issues: [], passed: false }
  }

  if (tgScoreRaw.status === 'fulfilled') {
    tgScore = buildScore(tgScoreRaw.value)
  } else {
    tgScore = { clarity: 15, specificity: 15, conversion_strength: 18, novelty: 10, credibility: 7, channel_fit: 8, total: 73, grade: 'B', issues: [], passed: false }
  }

  // Rewrite failed content in parallel
  const rewrites = await Promise.allSettled([
    !igScore.passed && igScore.issues.length > 0
      ? runAgent<IGPost>(buildPremiumRewritePrompt(igText, 'instagram', igScore.issues, input), 0.75)
      : Promise.resolve(ig),
    !tgScore.passed && tgScore.issues.length > 0
      ? runAgent<TGPost>(buildPremiumRewritePrompt(tgText, 'telegram', tgScore.issues, input), 0.75)
      : Promise.resolve(tg),
  ])

  const finalIg = rewrites[0].status === 'fulfilled' ? rewrites[0].value : ig
  const finalTg = rewrites[1].status === 'fulfilled' ? rewrites[1].value : tg

  // Re-score rewritten content (lightweight)
  const overall = Math.round((igScore.total + tgScore.total) / 2)

  return {
    ig: { ...finalIg, hashtags: finalIg.hashtags ?? ig.hashtags },
    tg: finalTg,
    scores: { instagram: igScore, telegram: tgScore, overall },
  }
}

export async function generateAllContent(input: GenerateInput): Promise<GenerationOutput> {
  // Stage 1: Generate all formats in parallel
  const [instagram, telegram, stories, reels, hooks, strategy] = await Promise.allSettled([
    runAgent<IGPost>(buildInstagramPrompt(input)),
    runAgent<TGPost>(buildTelegramPrompt(input)),
    runArrayAgent<string[]>(buildStoriesPrompt(input)),
    runAgent<GenerationOutput['reels_script']>(buildReelsPrompt(input)),
    runArrayAgent<string[]>(buildHooksPrompt(input)),
    runAgent<GenerationOutput['conversion_strategy']>(buildCTAPrompt(input)),
  ])

  const resolve = <T>(result: PromiseSettledResult<T>, fallback: T): T =>
    result.status === 'fulfilled' ? result.value : fallback

  const igPost = resolve(instagram, { hook: '', pain_agitation: '', value_body: '', cta: '', hashtags: [] } as IGPost)
  const tgPost = resolve(telegram, { structure: [], cta: '' } as TGPost)

  // Stage 2: Quality Gate — score + optional rewrite
  let quality_scores: GenerationOutput['quality_scores'] | undefined
  let finalIg = igPost
  let finalTg = tgPost

  try {
    const refined = await scoreAndRefine(igPost, tgPost, input)
    finalIg = refined.ig
    finalTg = refined.tg
    quality_scores = refined.scores
  } catch {
    // Quality gate failed silently — return original content
  }

  return {
    instagram_post: finalIg,
    telegram_post: finalTg,
    stories: (() => { const v = resolve(stories, []); return Array.isArray(v) ? v : (v as {result?: string[]}).result ?? [] })(),
    reels_script: resolve(reels, { hook: '', scenes: [], cta: '' } as GenerationOutput['reels_script']),
    viral_hooks: (() => { const v = resolve(hooks, []); return Array.isArray(v) ? v : (v as {result?: string[]}).result ?? [] })(),
    conversion_strategy: resolve(strategy, { primary_trigger: '', psychological_levers: [], cta_mechanism: '' } as GenerationOutput['conversion_strategy']),
    quality_scores,
  }
}
