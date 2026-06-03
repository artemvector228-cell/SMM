import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createPayment } from '@/lib/yookassa'
import { randomUUID } from 'crypto'

const PLAN_PRICES: Record<string, string> = {
  pro: '500.00',
  starter: '990.00',
  growth: '2490.00',
  premium: '4990.00',
}

const PLAN_LABELS: Record<string, string> = {
  pro: 'Pro',
  starter: 'Starter',
  growth: 'Growth',
  premium: 'Premium',
}

export async function POST(request: NextRequest) {
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim()
    if (!appUrl) {
      throw new Error(
        'Missing required env var NEXT_PUBLIC_APP_URL. Add it in Vercel Project Settings -> Environment Variables.'
      )
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { plan } = await request.json()
    const amount = PLAN_PRICES[plan]

    if (!amount) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    const payment = await createPayment({
      amount: { value: amount, currency: 'RUB' },
      description: `Revenue OS — тариф ${PLAN_LABELS[plan]}`,
      metadata: { user_id: user.id, plan, email: user.email ?? '' },
      returnUrl: `${appUrl}/dashboard?upgraded=true`,
      idempotenceKey: randomUUID(),
    })

    const confirmation_url = payment.confirmation?.confirmation_url
    return NextResponse.json({ confirmation_url, url: confirmation_url })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('[/api/yookassa/checkout]', message)
    return NextResponse.json({ error: 'Internal server error', details: message }, { status: 500 })
  }
}
