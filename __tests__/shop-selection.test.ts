import { getInitialShopSelection } from '@/lib/shop-selection'

test('keeps the cross-sell link on Daily when production locks Evening', () => {
  const previous = process.env.VERCEL_ENV
  const previousPublic = process.env.NEXT_PUBLIC_VERCEL_ENV
  process.env.VERCEL_ENV = 'production'
  process.env.NEXT_PUBLIC_VERCEL_ENV = 'production'
  expect(getInitialShopSelection('daily-evening')).toEqual({
    lens: 'daily',
    bundle: 2,
    slots: ['daily', 'daily'],
  })
  if (previous === undefined) delete process.env.VERCEL_ENV
  else process.env.VERCEL_ENV = previous
  if (previousPublic === undefined) delete process.env.NEXT_PUBLIC_VERCEL_ENV
  else process.env.NEXT_PUBLIC_VERCEL_ENV = previousPublic
})

test('selects Evening on the cross-sell link outside production', () => {
  const previous = process.env.VERCEL_ENV
  const previousPublic = process.env.NEXT_PUBLIC_VERCEL_ENV
  process.env.VERCEL_ENV = 'preview'
  process.env.NEXT_PUBLIC_VERCEL_ENV = 'preview'
  expect(getInitialShopSelection('daily-evening')).toEqual({
    lens: 'daily',
    bundle: 2,
    slots: ['daily', 'evening'],
  })
  if (previous === undefined) delete process.env.VERCEL_ENV
  else process.env.VERCEL_ENV = previous
  if (previousPublic === undefined) delete process.env.NEXT_PUBLIC_VERCEL_ENV
  else process.env.NEXT_PUBLIC_VERCEL_ENV = previousPublic
})

test('keeps the normal one-pair Daily selection for other visits', () => {
  expect(getInitialShopSelection()).toEqual({
    lens: 'daily',
    bundle: 1,
    slots: ['daily'],
  })
})
