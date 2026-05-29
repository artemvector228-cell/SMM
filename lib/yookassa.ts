const YOOKASSA_BASE = 'https://api.yookassa.ru/v3'

function getRequiredEnv(name: 'YOOKASSA_SHOP_ID' | 'YOOKASSA_SECRET_KEY'): string {
  const value = process.env[name]?.trim()

  if (!value) {
    throw new Error(
      `Missing required env var ${name}. Add it in Vercel Project Settings -> Environment Variables.`
    )
  }

  return value
}

function authHeader(): string {
  const shopId = getRequiredEnv('YOOKASSA_SHOP_ID')
  const secretKey = getRequiredEnv('YOOKASSA_SECRET_KEY')
  return 'Basic ' + Buffer.from(`${shopId}:${secretKey}`).toString('base64')
}

export interface YookassaPayment {
  id: string
  status: 'pending' | 'waiting_for_capture' | 'succeeded' | 'canceled'
  amount: { value: string; currency: string }
  metadata?: Record<string, string>
  confirmation?: { confirmation_url: string }
}

export async function createPayment(params: {
  amount: { value: string; currency: 'RUB' }
  description: string
  metadata: Record<string, string>
  returnUrl: string
  idempotenceKey: string
}): Promise<YookassaPayment> {
  const res = await fetch(`${YOOKASSA_BASE}/payments`, {
    method: 'POST',
    headers: {
      Authorization: authHeader(),
      'Content-Type': 'application/json',
      'Idempotence-Key': params.idempotenceKey,
    },
    body: JSON.stringify({
      amount: params.amount,
      confirmation: { type: 'redirect', return_url: params.returnUrl },
      capture: true,
      description: params.description,
      metadata: params.metadata,
    }),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(`YooKassa createPayment error: ${JSON.stringify(err)}`)
  }

  return res.json()
}

export async function getPayment(paymentId: string): Promise<YookassaPayment> {
  const res = await fetch(`${YOOKASSA_BASE}/payments/${paymentId}`, {
    headers: { Authorization: authHeader() },
  })

  if (!res.ok) {
    throw new Error(`YooKassa getPayment error: ${res.status}`)
  }

  return res.json()
}
