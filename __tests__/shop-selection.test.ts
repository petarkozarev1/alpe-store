import { getInitialShopSelection } from '@/lib/shop-selection'

test('keeps the cross-sell link on Daily while Evening is out of stock', () => {
  expect(getInitialShopSelection('daily-evening')).toEqual({
    lens: 'daily',
    bundle: 2,
    slots: ['daily', 'daily'],
  })
})

test('keeps the normal one-pair Daily selection for other visits', () => {
  expect(getInitialShopSelection()).toEqual({
    lens: 'daily',
    bundle: 1,
    slots: ['daily'],
  })
})
