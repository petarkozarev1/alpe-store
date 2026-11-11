import { clipSource, pdpUgcClips } from '@/lib/pdp-ugc'

test('keeps the product-page clips in play order and can start a later clip at a timestamp', () => {
  expect(pdpUgcClips.map((clip) => clip.id)).toEqual(['01', '02', '03', '05', '06', '04'])
  expect(clipSource(pdpUgcClips[0])).toBe('/videos/pdp/01.mp4')
  expect(pdpUgcClips[3].startAt).toBe(7)
  expect(clipSource(pdpUgcClips[3])).toBe('/videos/pdp/05.mp4#t=7')
  expect(pdpUgcClips[5].startAt).toBeUndefined()
  expect(clipSource(pdpUgcClips[5])).toBe('/videos/pdp/04.mp4')
})
