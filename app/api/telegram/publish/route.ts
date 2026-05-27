import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { generation_id, bot_token, chat_id, format } = await request.json()

    if (!bot_token || !chat_id || !generation_id) {
      return NextResponse.json({ error: 'Требуются bot_token, chat_id и generation_id' }, { status: 400 })
    }

    const { data: gen, error } = await supabase
      .from('generations')
      .select('input_json, output_json')
      .eq('id', generation_id)
      .eq('user_id', user.id)
      .single()

    if (error || !gen) return NextResponse.json({ error: 'Генерация не найдена' }, { status: 404 })

    const out = gen.output_json
    const inp = gen.input_json

    let text = ''
    if (format === 'telegram') {
      const tg = out.telegram_post
      text = tg.structure.join('\n\n') + '\n\n' + tg.cta
    } else if (format === 'instagram') {
      const ig = out.instagram_post
      text = `${ig.hook}\n\n${ig.pain_agitation}\n\n${ig.value_body}\n\n${ig.cta}\n\n${ig.hashtags.map((h: string) => `#${h}`).join(' ')}`
    } else if (format === 'hooks') {
      text = out.viral_hooks.map((h: string, i: number) => `${i + 1}. ${h}`).join('\n\n')
    } else {
      // Default: telegram post
      const tg = out.telegram_post
      text = tg.structure.join('\n\n') + '\n\n' + tg.cta
    }

    text = `📍 ${inp.niche}\n\n${text}`

    const tgRes = await fetch(`https://api.telegram.org/bot${bot_token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id, text }),
    })

    const tgData = await tgRes.json()

    if (!tgData.ok) {
      return NextResponse.json({ error: tgData.description ?? 'Ошибка Telegram API' }, { status: 400 })
    }

    return NextResponse.json({ success: true, message_id: tgData.result?.message_id })
  } catch (err) {
    console.error('[/api/telegram/publish]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
