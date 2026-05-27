import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, phone, plan } = await request.json()

    if (!email || !plan) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const botToken = process.env.TELEGRAM_NOTIFY_BOT_TOKEN
    const chatId = process.env.TELEGRAM_OWNER_CHAT_ID
    const secret = process.env.ADMIN_SECRET
    const appUrl = 'https://smm-tema2000.vercel.app'

    if (!botToken || !chatId) {
      return NextResponse.json({ error: 'Telegram not configured' }, { status: 500 })
    }

    const planLabel = plan === 'pro' ? 'Pro — 500 ₽' : 'Business — 990 ₽'
    const activateUrl = `${appUrl}/api/admin/activate?email=${encodeURIComponent(email)}&plan=${plan}&secret=${secret}`

    const text = [
      '💳 Новая оплата!',
      '',
      `Тариф: ${planLabel}`,
      `Email: ${email}`,
      phone ? `Телефон: ${phone}` : null,
      '',
      `✅ Активировать доступ:`,
      activateUrl,
    ].filter(Boolean).join('\n')

    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    })

    if (!res.ok) {
      const err = await res.json()
      console.error('[notify-payment] Telegram error:', err)
      return NextResponse.json({ error: 'Telegram send failed' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[notify-payment]', e)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
