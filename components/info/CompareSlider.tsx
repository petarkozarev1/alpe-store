'use client'

import Image from 'next/image'
import { useState } from 'react'

export default function CompareSlider({
  beforeSrc,
  afterSrc,
  beforeAlt,
  afterAlt,
  beforeLabel,
  afterLabel,
  label,
}: {
  beforeSrc: string
  afterSrc: string
  beforeAlt: string
  afterAlt: string
  beforeLabel: string
  afterLabel: string
  label: string
}) {
  const [value, setValue] = useState(58)

  return (
    <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-sand sm:aspect-[16/10]">
      <Image src={afterSrc} alt={afterAlt} fill sizes="(min-width: 768px) 70vw, 100vw" className="object-cover" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}>
        <Image src={beforeSrc} alt={beforeAlt} fill sizes="(min-width: 768px) 70vw, 100vw" className="object-cover" />
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 w-px bg-linen" style={{ left: `${value}%` }}>
        <span className="absolute left-1/2 top-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-linen text-onyx shadow">
          ↔
        </span>
      </div>
      <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-onyx/80 px-3 py-1 font-sans text-[10px] uppercase tracking-widest text-linen">{beforeLabel}</span>
      <span className="pointer-events-none absolute right-4 top-4 rounded-full bg-linen/90 px-3 py-1 font-sans text-[10px] uppercase tracking-widest text-onyx">{afterLabel}</span>
      <label className="absolute inset-x-0 bottom-0 p-4">
        <span className="sr-only">{label}</span>
        <input
          type="range"
          min={8}
          max={92}
          value={value}
          aria-valuetext={`${beforeLabel} ${value}%, ${afterLabel} ${100 - value}%`}
          onChange={(event) => setValue(Number(event.target.value))}
          className="w-full accent-gold"
        />
      </label>
    </div>
  )
}
