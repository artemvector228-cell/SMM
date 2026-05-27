import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia' as const,
})

export const STRIPE_PRICES = {
  pro: process.env.STRIPE_PRICE_PRO!,
}
