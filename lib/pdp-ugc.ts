export type PdpUgcClip = {
  id: string
  src: string
  poster: string
  /** Seconds to begin playback. A later clip can set this, for example 7. */
  startAt?: number
}

export const pdpUgcClips: PdpUgcClip[] = [
  { id: '01', src: '/videos/pdp/01.mp4', poster: '/videos/pdp/01.jpg' },
  { id: '02', src: '/videos/pdp/02.mp4', poster: '/videos/pdp/02.jpg' },
  { id: '03', src: '/videos/pdp/03.mp4', poster: '/videos/pdp/03.jpg' },
  { id: '04', src: '/videos/pdp/04.mp4', poster: '/videos/pdp/04.jpg' },
]

export function clipSource(clip: PdpUgcClip): string {
  if (clip.startAt == null || clip.startAt <= 0) return clip.src
  return `${clip.src}#t=${clip.startAt}`
}
