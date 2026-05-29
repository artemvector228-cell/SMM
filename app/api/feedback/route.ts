import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { message, type } = await request.json()
  if (!message?.trim()) return NextResponse.json({ error: 'Пустое сообщение' }, { status: 400 })

  const typeLabel: Record<string, string> = {
    bug: '🐛 Баг',
    feature: '✨ Предложение',
    general: '💬 Общее',
  }

  const text = [
    `📬 <b>Обратная связь</b>`,
    ``,
    `<b>Тип:</b> ${typeLabel[type] ?? type}`,
    `<b>От:</b> ${user.email}`,
    ``,
    `<b>Сообщение:</b>`,
    message.trim(),
  ].join('\n')

  const res = await fetch(
    `https://api.telegram.org/bot${process.env.TELEGRAM_NOTIFY_BOT_TOKEN}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_OWNER_CHAT_ID,
        text,
        parse_mode: 'HTML',
      }),
    }
  )

  const data = await res.json()
  if (!data.ok) {
    console.error('[feedback] Telegram error:', data.description)
    return NextResponse.json({ error: 'Не удалось отправить' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
