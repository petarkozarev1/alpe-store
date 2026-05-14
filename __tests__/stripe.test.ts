import { getRequiredEnv, getStripe } from '@/lib/stripe'

const originalEnv = process.env

beforeEach(() => {
  process.env = { ...originalEnv }
})

afterAll(() => {
  process.env = originalEnv
})

test('getRequiredEnv throws a clear error when a value is missing', () => {
  delete process.env.STRIPE_SECRET_KEY

  expect(() => getRequiredEnv('STRIPE_SECRET_KEY')).toThrow(
    'STRIPE_SECRET_KEY is not configured'
  )
})

test('getStripe throws a clear error when Stripe is not configured', () => {
  delete process.env.STRIPE_SECRET_KEY

  expect(() => getStripe()).toThrow('STRIPE_SECRET_KEY is not configured')
})
