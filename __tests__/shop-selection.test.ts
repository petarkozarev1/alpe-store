import { getInitialShopSelection } from '@/lib/shop-selection'

test('preselects one Daily and one Evening pair for the cross-sell bundle', () => {
  expect(getInitialShopSelection('daily-evening')).toEqual({
    lens: 'daily',
    bundle: 2,
    slots: ['daily', 'evening'],
  })
})

test('keeps the normal one-pair Daily selection for other visits', () => {
  expect(getInitialShopSelection()).toEqual({
    lens: 'daily',
    bundle: 1,
    slots: ['daily'],
  })
})
