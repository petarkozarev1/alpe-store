import Stripe from 'stripe'

export function getRequiredEnv(name: string) {
  const value = process.env[name]
  if (!value) {
    throw new Error(`${name} is not configured`)
  }

  return value
}

export function getStripe() {
  return new Stripe(getRequiredEnv('STRIPE_SECRET_KEY'))
}
