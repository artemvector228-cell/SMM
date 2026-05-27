import { z } from 'zod'

export const generateSchema = z.object({
  niche: z.string().min(2).max(100),
  offer: z.string().min(5).max(300),
  audience: z.string().min(5).max(300),
  pain_points: z.string().min(5).max(500),
  tone: z.enum(['aggressive', 'authoritative', 'empathetic', 'bold', 'professional']),
  conversion_goal: z.enum(['dm', 'telegram', 'call', 'landing']),
  brand_voice: z.string().max(500).optional(),
})

export const rewriteSchema = z.object({
  generation_id: z.string().uuid(),
  tone: z.enum(['aggressive', 'authoritative', 'empathetic', 'bold', 'professional']).optional(),
  cta_strength: z.enum(['soft', 'medium', 'hard']).optional(),
  target_platform: z.enum(['instagram', 'telegram', 'stories', 'reels', 'all']).optional(),
})

export type GenerateInput = z.infer<typeof generateSchema>
export type RewriteInput = z.infer<typeof rewriteSchema>
