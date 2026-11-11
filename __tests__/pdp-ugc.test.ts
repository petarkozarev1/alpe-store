import { clipSource, pdpUgcClips } from '@/lib/pdp-ugc'

test('keeps the product-page clips in play order and can start a later clip at a timestamp', () => {
  expect(pdpUgcClips.map((clip) => clip.id)).toEqual(['01', '02', '03', '04', '05'])
  expect(clipSource(pdpUgcClips[0])).toBe('/videos/pdp/01.mp4')
  expect(pdpUgcClips[4].startAt).toBe(7)
  expect(clipSource(pdpUgcClips[4])).toBe('/videos/pdp/05.mp4#t=7')
})
