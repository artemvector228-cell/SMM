import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getPayment } from '@/lib/yookassa'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Only handle succeeded payments
    if (body.event !== 'payment.succeeded') {
      return NextResponse.json({ ok: true })
    }

    const paymentId: string | undefined = body.object?.id
    if (!paymentId) {
      return NextResponse.json({ error: 'Missing payment id' }, { status: 400 })
    }

    // Verify payment status directly via YooKassa API — don't trust webhook body alone
    const payment = await getPayment(paymentId)
    if (payment.status !== 'succeeded') {
      return NextResponse.json({ ok: true })
    }

    const { user_id, plan, email } = payment.metadata ?? {}
    if (!user_id || !plan) {
      console.error('[webhooks/yookassa] Missing metadata', payment.metadata)
      return NextResponse.json({ error: 'Missing metadata' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    await supabase.from('profiles').update({ plan }).eq('id', user_id)

    // Notify owner via Telegram
    try {
      const botToken = process.env.TELEGRAM_NOTIFY_BOT_TOKEN
      const chatId = process.env.TELEGRAM_OWNER_CHAT_ID
      if (botToken && chatId) {
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: [
              '✅ Оплата ЮKassa!',
              '',
              `Тариф: ${plan}`,
              email ? `Email: ${email}` : null,
              `ID платежа: ${paymentId}`,
            ].filter(Boolean).join('\n'),
          }),
        })
      }
    } catch {}

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[webhooks/yookassa]', e)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
