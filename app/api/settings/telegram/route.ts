import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data } = await supabase
    .from('profiles')
    .select('telegram_bot_token, telegram_chat_id')
    .eq('id', user.id)
    .single()

  return NextResponse.json({
    bot_token: data?.telegram_bot_token ?? '',
    chat_id: data?.telegram_chat_id ?? '',
  })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { bot_token, chat_id } = await request.json()

  const { error } = await supabase
    .from('profiles')
    .update({ telegram_bot_token: bot_token?.trim() ?? '', telegram_chat_id: chat_id?.trim() ?? '' })
    .eq('id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
