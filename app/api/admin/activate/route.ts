import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const plan = searchParams.get('plan')
    const secret = searchParams.get('secret')

    if (!email || !plan || !secret) {
      return new NextResponse('Missing parameters', { status: 400 })
    }

    if (secret !== process.env.ADMIN_SECRET) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data, error } = await supabase
      .from('profiles')
      .update({ plan })
      .eq('email', email)
      .select('email, plan')
      .single()

    if (error || !data) {
      return new NextResponse(
        `<html><body style="font-family:sans-serif;padding:40px;max-width:500px;margin:auto">
          <h2>❌ Ошибка</h2>
          <p>Пользователь с email <b>${email}</b> не найден.</p>
          <p style="color:#999;font-size:13px">${error?.message ?? ''}</p>
        </body></html>`,
        { status: 404, headers: { 'Content-Type': 'text/html' } }
      )
    }

    // Notify user via Telegram bot (optional — silent if fails)
    try {
      const botToken = process.env.TELEGRAM_NOTIFY_BOT_TOKEN
      const chatId = process.env.TELEGRAM_OWNER_CHAT_ID
      if (botToken && chatId) {
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: `✅ Доступ активирован!\n\nEmail: ${email}\nТариф: ${plan}`,
          }),
        })
      }
    } catch {}

    return new NextResponse(
      `<html><body style="font-family:sans-serif;padding:40px;max-width:500px;margin:auto;text-align:center">
        <div style="font-size:48px">✅</div>
        <h2 style="color:#7c3aed">Доступ активирован!</h2>
        <p>Тариф <b>${plan}</b> успешно включён для <b>${email}</b></p>
        <p style="color:#999;font-size:13px;margin-top:24px">Можно закрыть эту страницу</p>
      </body></html>`,
      { headers: { 'Content-Type': 'text/html' } }
    )
  } catch (e) {
    console.error('[admin/activate]', e)
    return new NextResponse('Internal error', { status: 500 })
  }
}
