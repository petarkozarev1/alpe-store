'use client'

import { useLayoutEffect, useState } from 'react'

/**
 * One announcement at a time. Each message travels its full width, including
 * when it is shorter than the bar, and the next one starts only after it has
 * left. Speed matches the previous loop: one copy of the full line took 6s
 * (six copies crossed in 36s).
 */
export default function SaleMarquee({ text }: { text: string }) {
  const messages = text.split(' · ').map(part => part.trim()).filter(Boolean).map(part => `✦ ${part}`)
  const [index, setIndex] = useState(0)
  const [ready, setReady] = useState(false)
  const message = messages[index % Math.max(messages.length, 1)] ?? ''

  useLayoutEffect(() => {
    const track = document.querySelector<HTMLElement>('.sale-marquee')
    const item = track?.querySelector<HTMLElement>('.sale-marquee-line')
    if (!track || !item) return
    const reduced = typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setReady(true)
      return
    }
    const itemWidth = item.scrollWidth
    const trackWidth = track.clientWidth
    if (itemWidth <= 0 || trackWidth <= 0) return
    const sample = item.cloneNode(true) as HTMLElement
    sample.style.animation = 'none'
    sample.style.transform = 'none'
    sample.style.position = 'absolute'
    sample.style.visibility = 'hidden'
    const sampleLabel = sample.querySelector('span')
    if (sampleLabel) sampleLabel.textContent = `✦ ${text}`
    track.appendChild(sample)
    const sampleWidth = sample.scrollWidth
    sample.remove()
    const speed = Math.max(sampleWidth, itemWidth) / 6
    const distance = trackWidth + itemWidth
    item.style.setProperty('--sale-from', `${trackWidth}px`)
    item.style.setProperty('--sale-to', `${-itemWidth}px`)
    item.style.setProperty('--sale-duration', `${distance / speed}s`)
    setReady(true)
  }, [index, text])

  return (
    <div
      className={ready ? 'sale-marquee is-ready flex h-[26px] w-full items-center overflow-hidden bg-onyx md:h-[30px]' : 'sale-marquee flex h-[26px] w-full items-center overflow-hidden bg-onyx md:h-[30px]'}
      role="region"
      aria-label={text}
    >
      <div
        key={message}
        className="sale-marquee-line"
        onAnimationEnd={(event) => {
          if (event.target !== event.currentTarget || messages.length === 0) return
          setReady(false)
          setIndex(current => (current + 1) % messages.length)
        }}
      >
        <span className="font-sans text-[10px] font-bold uppercase leading-none tracking-widest text-gold md:text-[11px]">
          {message}
        </span>
      </div>
      <style>{`
        .sale-marquee-line {
          display: inline-block;
          white-space: nowrap;
          padding: 0 2.5rem;
          animation-name: sale-pass;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
          animation-duration: var(--sale-duration, 14s);
          animation-play-state: paused;
          transform: translate3d(var(--sale-from, 100vw), 0, 0);
          will-change: transform;
        }
        .sale-marquee.is-ready .sale-marquee-line {
          animation-play-state: running;
        }
        .sale-marquee:hover .sale-marquee-line,
        .sale-marquee:focus-within .sale-marquee-line {
          animation-play-state: paused;
        }
        @keyframes sale-pass {
          from { transform: translate3d(var(--sale-from, 100vw), 0, 0); }
          to { transform: translate3d(var(--sale-to, -100%), 0, 0); }
        }
        @keyframes sale-fade {
          0% { opacity: 0; }
          15% { opacity: 1; }
          80% { opacity: 1; }
          100% { opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .sale-marquee {
            height: auto;
            min-height: 26px;
            padding-top: 4px;
            padding-bottom: 4px;
          }
          .sale-marquee-line,
          .sale-marquee.is-ready .sale-marquee-line {
            animation-name: sale-fade;
            animation-duration: 4.8s;
            animation-timing-function: ease-in-out;
            animation-play-state: running;
            transform: none;
            display: block;
            text-align: center;
            white-space: normal;
            padding: 0 1rem;
          }
          .sale-marquee:hover .sale-marquee-line,
          .sale-marquee:focus-within .sale-marquee-line {
            animation-play-state: paused;
          }
        }
      `}</style>
    </div>
  )
}
