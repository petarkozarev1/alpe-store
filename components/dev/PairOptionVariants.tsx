'use client'

import { useState, type CSSProperties } from 'react'
import { usePricingSnapshot } from '@/components/pricing/PricingProvider'

type Count = 1 | 2

const cream = '#fff8f2'
const ink = '#1C0F0A'
const tan = '#B8906A'
const linen = '#EDE4D6'
const muted = 'rgba(28,15,10,0.72)'

function money(value: number) {
  return `€${value.toFixed(2)}`
}

function Radio({ checked }: { checked: boolean }) {
  return (
    <input
      type="radio"
      readOnly
      checked={checked}
      tabIndex={-1}
      aria-hidden="true"
      style={{ width: 18, height: 18, accentColor: ink, flexShrink: 0 }}
    />
  )
}

function usePairFacts() {
  const pricing = usePricingSnapshot()
  const single = pricing.single
  const two = pricing.double
  const separate = pricing.regularDouble
  const save = +((separate - two).toFixed(2))
  const percent = Math.round((save / separate) * 100)
  const perPair = (Math.floor(Math.round(two * 100) / 2) / 100)
  const promo = pricing.promo
  return { single, two, separate, save, percent, perPair, promo }
}

function CardButton({
  selected,
  onSelect,
  label,
  children,
  style,
}: {
  selected: boolean
  onSelect: () => void
  label: string
  children: React.ReactNode
  style?: CSSProperties
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={label}
      onClick={onSelect}
      style={{
        position: 'relative',
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        border: `1.5px solid ${selected ? ink : 'rgba(28,15,10,0.1)'}`,
        borderRadius: 12,
        padding: '16px 18px',
        cursor: 'pointer',
        background: selected ? 'rgba(28,15,10,0.04)' : cream,
        boxShadow: selected ? `0 0 0 1px ${ink}` : 'none',
        textAlign: 'left',
        fontFamily: 'var(--font-raleway), sans-serif',
        ...style,
      }}
    >
      {children}
    </button>
  )
}

function VariantFrame({
  id,
  letter,
  title,
  children,
}: {
  id: string
  letter: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section id={id} data-variant={letter} style={{ padding: '28px 0 8px' }}>
      <p style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: 72, lineHeight: 0.9, color: ink, margin: 0 }}>{letter}</p>
      <p style={{ fontFamily: 'var(--font-raleway), sans-serif', fontSize: 15, color: muted, margin: '8px 0 18px', maxWidth: 520 }}>{title}</p>
      <div style={{ maxWidth: 440 }}>{children}</div>
    </section>
  )
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(28,15,10,0.8)', fontWeight: 500, marginBottom: 12 }}>Колко чифта?</div>
      <div role="radiogroup" aria-label={label} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{children}</div>
    </div>
  )
}

export default function PairOptionVariants() {
  const { single, two, separate, save, percent, perPair, promo } = usePairFacts()
  const code = promo?.code ?? 'BLACK15'
  const promoPrice = promo?.singlePairPrice ?? 50.99
  const promoPercent = promo?.percent ?? 15
  const [a, setA] = useState<Count>(1)
  const [b, setB] = useState<Count>(1)
  const [c, setC] = useState<Count>(1)
  const [d, setD] = useState<Count>(2)

  return (
    <div style={{ background: '#FFF0E0', color: ink, minHeight: '100vh' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '112px 20px 72px' }}>
        <p style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: tan, fontWeight: 600, margin: 0 }}>Чернова · не е на сайта</p>
        <h1 style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontWeight: 500, fontSize: 44, lineHeight: 1, margin: '10px 0 8px' }}>Колко чифта?</h1>
        <p style={{ fontSize: 14, color: muted, margin: '0 0 8px', maxWidth: 520 }}>Четири варианта за отстъпките. Живият избор на продуктовата страница не е пипан.</p>

        <VariantFrame id="variant-a" letter="A" title="Зачеркнати €119.98 до €89.99 и бадж „Спестяваш €29.99“.">
          <Group label="Вариант A">
            <CardButton selected={a === 1} onSelect={() => setA(1)} label={`1 чифт, ${money(single)}`}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <Radio checked={a === 1} />
                <span>
                  <span style={{ display: 'block', fontSize: 15, fontWeight: 500 }}>1 чифт</span>
                  <span style={{ display: 'block', fontSize: 12, color: muted, marginTop: 2 }}>Избраните от вас очила</span>
                  <span style={{ display: 'inline-block', marginTop: 6, fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '3px 10px', borderRadius: 100, background: '#FFF0E0', color: '#a05a00' }}>Код {code}: {money(promoPrice)}</span>
                </span>
              </span>
              <span style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: 22 }}>{money(single)}</span>
            </CardButton>
            <CardButton selected={a === 2} onSelect={() => setA(2)} label={`2 чифта, ${money(two)}`}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <Radio checked={a === 2} />
                <span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 15, fontWeight: 500 }}>2 чифта</span>
                    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', padding: '3px 9px', borderRadius: 4, background: tan, color: linen }}>Най-популярни</span>
                  </span>
                  <span style={{ display: 'block', fontSize: 12, color: muted, marginTop: 2 }}>Защита за целия ден</span>
                  <span style={{ display: 'inline-block', marginTop: 8, fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', padding: '5px 10px', borderRadius: 100, background: tan, color: linen }}>Спестяваш {money(save)}</span>
                </span>
              </span>
              <span style={{ textAlign: 'right' }}>
                <span style={{ display: 'block', fontSize: 12, color: '#9B7B68', textDecoration: 'line-through' }}>{money(separate)}</span>
                <span style={{ display: 'block', fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: 28, lineHeight: 1 }}>{money(two)}</span>
              </span>
            </CardButton>
          </Group>
        </VariantFrame>

        <VariantFrame id="variant-b" letter="B" title="Голям бадж −25% на картата за два чифта.">
          <Group label="Вариант B">
            <CardButton selected={b === 1} onSelect={() => setB(1)} label={`1 чифт, ${money(single)}`}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <Radio checked={b === 1} />
                <span>
                  <span style={{ display: 'block', fontSize: 15, fontWeight: 500 }}>1 чифт</span>
                  <span style={{ display: 'block', fontSize: 12, color: muted, marginTop: 2 }}>Избраните от вас очила</span>
                </span>
              </span>
              <span style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: 22 }}>{money(single)}</span>
            </CardButton>
            <CardButton selected={b === 2} onSelect={() => setB(2)} label={`2 чифта, ${money(two)}, минус ${percent} процента`}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <Radio checked={b === 2} />
                <span style={{ display: 'flex', width: 72, height: 72, borderRadius: 12, background: tan, color: linen, alignItems: 'center', justifyContent: 'center', flexDirection: 'column', flexShrink: 0 }}>
                  <span style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: 28, lineHeight: 1 }}>−{percent}%</span>
                </span>
                <span>
                  <span style={{ display: 'block', fontSize: 15, fontWeight: 500 }}>2 чифта</span>
                  <span style={{ display: 'block', fontSize: 12, color: muted, marginTop: 2 }}>спрямо {money(separate)} поотделно</span>
                  <span style={{ display: 'block', fontSize: 12, color: muted }}>Вторият чифт на половин цена</span>
                </span>
              </span>
              <span style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: 28 }}>{money(two)}</span>
            </CardButton>
          </Group>
        </VariantFrame>

        <VariantFrame id="variant-c" letter="C" title="Цена на чифт: €44.99 за двата, срещу €59.99 за един.">
          <Group label="Вариант C">
            <CardButton selected={c === 1} onSelect={() => setC(1)} label={`1 чифт, ${money(single)} на чифт`}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <Radio checked={c === 1} />
                <span>
                  <span style={{ display: 'block', fontSize: 15, fontWeight: 500 }}>1 чифт</span>
                  <span style={{ display: 'block', fontSize: 12, color: muted, marginTop: 2 }}>С код {code}: {money(promoPrice)} / чифт</span>
                </span>
              </span>
              <span style={{ textAlign: 'right' }}>
                <span style={{ display: 'block', fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: 28, lineHeight: 1 }}>{money(single)}</span>
                <span style={{ display: 'block', fontSize: 12, color: muted }}>/ чифт</span>
              </span>
            </CardButton>
            <CardButton selected={c === 2} onSelect={() => setC(2)} label={`2 чифта, ${money(perPair)} на чифт, общо ${money(two)}`}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <Radio checked={c === 2} />
                <span>
                  <span style={{ display: 'block', fontSize: 15, fontWeight: 500 }}>2 чифта</span>
                  <span style={{ display: 'block', fontSize: 12, color: muted, marginTop: 2 }}>Общо {money(two)} · поотделно {money(separate)}</span>
                </span>
              </span>
              <span style={{ textAlign: 'right' }}>
                <span style={{ display: 'block', fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: 32, lineHeight: 0.95 }}>{money(perPair)}</span>
                <span style={{ display: 'block', fontSize: 12, fontWeight: 600, color: tan }}>/ чифт</span>
              </span>
            </CardButton>
          </Group>
        </VariantFrame>

        <VariantFrame id="variant-d" letter="D" title="Лента в ъгъла, двата чифта са препоръчани, а BLACK15 е само върху един чифт.">
          <Group label="Вариант D">
            <CardButton selected={d === 1} onSelect={() => setD(1)} label={`1 чифт с код ${code}, ${money(promoPrice)}`}>
              <span style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <Radio checked={d === 1} />
                <span>
                  <span style={{ display: 'block', fontSize: 15, fontWeight: 500 }}>1 чифт</span>
                  <span style={{ display: 'block', marginTop: 6, fontSize: 13, fontWeight: 600, color: ink }}>С код {code}: {money(promoPrice)} (−{promoPercent}%)</span>
                  <span style={{ display: 'block', fontSize: 12, color: muted, marginTop: 2 }}>Кодът важи само за 1 чифт</span>
                </span>
              </span>
              <span style={{ textAlign: 'right' }}>
                <span style={{ display: 'block', fontSize: 13, color: '#9B7B68', textDecoration: 'line-through' }}>{money(single)}</span>
                <span style={{ display: 'block', fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: 28, lineHeight: 1 }}>{money(promoPrice)}</span>
              </span>
            </CardButton>
            <CardButton
              selected={d === 2}
              onSelect={() => setD(2)}
              label={`2 чифта, ${money(two)}, безплатна доставка`}
              style={{
                overflow: 'hidden',
                alignItems: 'flex-start',
                border: `2px solid ${tan}`,
                background: d === 2 ? '#F5DFC5' : linen,
                boxShadow: d === 2 ? `0 0 0 1px ${tan}` : 'none',
                paddingTop: 22,
                paddingRight: 22,
              }}
            >
              <span style={{ position: 'absolute', top: 16, right: -36, transform: 'rotate(32deg)', background: tan, color: linen, fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '4px 40px' }}>Най-популярни</span>
              <span style={{ display: 'flex', alignItems: 'flex-start', gap: 14, paddingRight: 72 }}>
                <Radio checked={d === 2} />
                <span>
                  <span style={{ display: 'block', fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: 26, lineHeight: 1 }}>2 чифта</span>
                  <span style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 6 }}>
                    <span style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: 32, lineHeight: 1 }}>{money(two)}</span>
                    <span style={{ fontSize: 13, color: '#9B7B68', textDecoration: 'line-through' }}>{money(separate)}</span>
                  </span>
                  <span style={{ display: 'block', fontSize: 12, color: muted, marginTop: 4 }}>Вторият чифт на половин цена</span>
                  <span style={{ display: 'inline-block', marginTop: 8, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: 100, background: ink, color: linen }}>Безплатна доставка</span>
                </span>
              </span>
            </CardButton>
          </Group>
        </VariantFrame>
      </div>
    </div>
  )
}
