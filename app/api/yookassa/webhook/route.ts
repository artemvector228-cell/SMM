import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getPayment } from '@/lib/yookassa'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // YooKassa sends notification with payment object
    const event = body
    if (!event || !event.object) {
      return NextResponse.json({ ok: true })
    }

    const payment = event.object
    if (payment.status !== 'succeeded') {
      return NextResponse.json({ ok: true })
    }

    // Double-check with YooKassa API
    const verified = await getPayment(payment.id)
    if (verified.status !== 'succeeded') {
      return NextResponse.json({ ok: true })
    }

    const { user_id, plan } = verified.metadata ?? {}
    if (!user_id || !plan) {
      return NextResponse.json({ ok: true })
    }

    const supabase = await createClient()
    await supabase
      .from('profiles')
      .update({ plan, generations_used: 0 })
      .eq('id', user_id)

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[yookassa/webhook]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
