import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import OpenAI from 'openai'

export const maxDuration = 60

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { niche, goal, audience, previousPlan } = await request.json()
    if (!niche) return NextResponse.json({ error: 'Ниша обязательна' }, { status: 400 })

    const goalMap: Record<string, string> = {
      dm: 'личные сообщения в директ',
      telegram: 'подписка на Telegram',
      call: 'запись на звонок',
      landing: 'переход на лендинг',
    }

    const previousPlanSection = previousPlan ? `
Предыдущий контент-план (ОБЯЗАТЕЛЬНО изучи и НЕ повторяй эти темы):
---
${previousPlan}
---
Твоя задача: создать план который:
1. Не повторяет ни одну из вышеперечисленных тем
2. Развивает аудиторию дальше — более глубокие инсайты, сильнее хуки
3. Закрывает пробелы которые не были освещены
4. Создаёт ощущение прогресса и движения вперёд
` : ''

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{
        role: 'user',
        content: `Ты — эксперт по контент-стратегии для социальных сетей. Создай детальный контент-план на 30 дней.

Ниша: ${niche}
Целевая аудитория: ${audience || 'не указана'}
Цель конверсии: ${goalMap[goal] || 'продажи'}
${previousPlanSection}
Правила:
- Каждый день уникальная тема
- Чередуй форматы: instagram, reels, stories, telegram
- Темы должны вести к конверсии
- Хуки — конкретные, цепляющие, на русском
- Описания краткие (1 предложение)
- 4 тематические недели с общей аркой повествования

Верни ТОЛЬКО JSON (без лишнего текста):
{
  "month_theme": "общая тема месяца одной фразой",
  "week_themes": [
    "тема 1-й недели",
    "тема 2-й недели",
    "тема 3-й недели",
    "тема 4-й недели"
  ],
  "days": [
    {
      "day": 1,
      "format": "instagram",
      "topic": "название темы поста",
      "description": "о чём пост в одном предложении",
      "hook": "готовая фраза-хук для начала поста"
    }
  ]
}

Форматы только: instagram, reels, stories, telegram
Всего ровно 30 объектов в массиве days. Весь текст на русском языке.`,
      }],
      response_format: { type: 'json_object' },
      temperature: 0.8,
    })

    const content = response.choices[0].message.content
    if (!content) throw new Error('Empty response')

    const plan = JSON.parse(content)
    return NextResponse.json({ plan })
  } catch (error) {
    console.error('[/api/content-plan]', error)
    return NextResponse.json({ error: 'Ошибка генерации плана' }, { status: 500 })
  }
}
