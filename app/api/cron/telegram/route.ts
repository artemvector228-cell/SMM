import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Called by Vercel Cron every 5 minutes
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Find due posts that have not been published yet
  const now = new Date().toISOString()
  const { data: duePosts, error } = await supabase
    .from('generations')
    .select('id, user_id, input_json, output_json')
    .not('scheduled_at', 'is', null)
    .lte('scheduled_at', now)
    .is('telegram_published_at', null)
    .limit(50)

  if (error) {
    console.error('[cron/telegram] query error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  let sent = 0
  let failed = 0

  for (const post of duePosts ?? []) {
    // Get user's telegram credentials
    const { data: profile } = await supabase
      .from('profiles')
      .select('telegram_bot_token, telegram_chat_id')
      .eq('id', post.user_id)
      .single()

    if (!profile?.telegram_bot_token || !profile?.telegram_chat_id) continue

    try {
      const out = post.output_json
      const inp = post.input_json
      const tg = out?.telegram_post
      if (!tg) continue

      const text = `📍 ${inp.niche}\n\n${tg.structure?.join('\n\n') ?? ''}\n\n${tg.cta ?? ''}`

      const tgRes = await fetch(
        `https://api.telegram.org/bot${profile.telegram_bot_token}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: profile.telegram_chat_id, text }),
        }
      )
      const tgData = await tgRes.json()

      if (tgData.ok) {
        await supabase
          .from('generations')
          .update({ telegram_published_at: new Date().toISOString() })
          .eq('id', post.id)
        sent++
      } else {
        console.error('[cron/telegram] TG error:', tgData.description)
        failed++
      }
    } catch (e) {
      console.error('[cron/telegram] post error:', e)
      failed++
    }
  }

  return NextResponse.json({ sent, failed, total: (duePosts ?? []).length })
}
