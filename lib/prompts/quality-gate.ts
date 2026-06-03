import { GenerateInput } from '@/lib/validations'

export interface QualityScore {
  clarity: number           // 0-20: ясность и читаемость
  specificity: number       // 0-20: конкретика vs вода
  conversion_strength: number // 0-25: сила конверсионного действия
  novelty: number           // 0-15: оригинальность, отсутствие клише
  credibility: number       // 0-10: доверие, обоснованность
  channel_fit: number       // 0-10: соответствие формату платформы
  total: number             // 0-100
  grade: 'S' | 'A' | 'B' | 'C'
  issues: string[]          // конкретные проблемы
  passed: boolean           // total >= 80
}

export function gradeFromScore(score: number): 'S' | 'A' | 'B' | 'C' {
  if (score >= 90) return 'S'
  if (score >= 80) return 'A'
  if (score >= 65) return 'B'
  return 'C'
}

export function buildQualityGatePrompt(
  content: string,
  platform: 'instagram' | 'telegram',
  input: GenerateInput
): string {
  return `Ты — старший редактор конверсионного контента. Оцени этот ${platform === 'instagram' ? 'Instagram' : 'Telegram'}-пост по 6 критериям. Будь строгим — хороший контент должен реально продавать.

═══ КОНТЕНТ ДЛЯ ОЦЕНКИ ═══
${content}

═══ КОНТЕКСТ ═══
Ниша: ${input.niche}
Оффер: ${input.offer}
Аудитория: ${input.audience}
Цель: ${input.conversion_goal}

═══ КРИТЕРИИ ОЦЕНКИ ═══

clarity (0-20): Ясность и читаемость
- 20: Каждое предложение понятно с первого прочтения
- 10: Есть места где теряешься
- 0: Нужно перечитывать чтобы понять

specificity (0-20): Конкретика vs вода
- 20: Конкретные цифры, механизмы, ситуации
- 10: Смесь конкретного и общего
- 0: Сплошные абстракции ("помогаем расти", "достигать целей")

conversion_strength (0-25): Сила конверсионного действия
- 25: CTA неизбежен, создаёт срочность и чёткий следующий шаг
- 12: CTA есть но слабый или размытый
- 0: Нет CTA или он теряется в тексте

novelty (0-15): Оригинальность, отсутствие клише
- 15: Свежий угол, читатель не видел такого раньше
- 7: Частично оригинально
- 0: Шаблонно, банально, предсказуемо

credibility (0-10): Доверие и обоснованность
- 10: Есть факты, логика, или кейс — доверяешь автору
- 5: Нейтрально
- 0: Голословные обещания, невозможно проверить

channel_fit (0-10): Соответствие формату платформы
- 10: Идеально под ${platform} (длина, структура, ритм)
- 5: Работает но не оптимально
- 0: Не соответствует формату платформы

═══ ОТВЕТ ═══
Верни ТОЛЬКО JSON:
{
  "clarity": <число 0-20>,
  "specificity": <число 0-20>,
  "conversion_strength": <число 0-25>,
  "novelty": <число 0-15>,
  "credibility": <число 0-10>,
  "channel_fit": <число 0-10>,
  "issues": ["конкретная проблема 1", "конкретная проблема 2"]
}`
}

export function buildPremiumRewritePrompt(
  originalContent: string,
  platform: 'instagram' | 'telegram',
  issues: string[],
  input: GenerateInput
): string {
  return `Ты — топ-редактор конверсионного контента. Перепиши этот ${platform === 'instagram' ? 'Instagram-пост' : 'Telegram-пост'} устранив конкретные проблемы.

═══ ОРИГИНАЛ ═══
${originalContent}

═══ ПРОБЛЕМЫ КОТОРЫЕ НУЖНО УСТРАНИТЬ ═══
${issues.map((issue, i) => `${i + 1}. ${issue}`).join('\n')}

═══ КОНТЕКСТ ═══
Ниша: ${input.niche}
Оффер: ${input.offer}
Аудитория: ${input.audience}
Цель: ${input.conversion_goal}

═══ ПРАВИЛА ПЕРЕПИСКИ ═══
1. Сохрани общую структуру и идею — только улучши исполнение
2. Устрани каждую из указанных проблем конкретно
3. Сделай текст более конкретным — добавь цифры, механизмы, ситуации
4. Усиль CTA — сделай следующий шаг неизбежным
5. Убери все клише и банальные фразы
6. Сохрани длину близкой к оригиналу

СТРОГО НА РУССКОМ ЯЗЫКЕ.

${platform === 'instagram'
  ? `Верни ТОЛЬКО JSON:
{
  "hook": "улучшенный хук",
  "pain_agitation": "улучшенное усиление боли",
  "value_body": "улучшенная ценность",
  "cta": "усиленный CTA",
  "hashtags": ["тег1", "тег2", "тег3", "тег4", "тег5"]
}`
  : `Верни ТОЛЬКО JSON:
{
  "structure": ["улучшенный блок 1", "блок 2", "блок 3", "блок 4", "блок 5"],
  "cta": "усиленный финальный CTA"
}`
}`
}
