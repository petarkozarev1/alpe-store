'use client'

import { useLocale } from '@/components/i18n/LocaleProvider'
import { usePricingSnapshot } from '@/components/pricing/PricingProvider'

type Count = 1 | 2

function money(value: number) {
  return `€${value.toFixed(2)}`
}

export default function PairSelector({
  value,
  onChange,
}: {
  value: Count
  onChange: (next: Count) => void
}) {
  const locale = useLocale()
  const en = locale === 'en'
  const pricing = usePricingSnapshot()
  const single = pricing.single
  const two = pricing.double
  const separate = pricing.regularDouble
  const save = +((separate - two).toFixed(2))
  const percent = Math.round((save / separate) * 100)
  const promo = pricing.promo
  const promoPrice = promo?.singlePairPrice ?? single
  const promoPercent = promo?.percent ?? 15
  const code = promo?.code ?? 'BLACK15'

  const pairLabel = (n: Count) => (en ? `${n} ${n === 1 ? 'pair' : 'pairs'}` : `${n} чифт${n > 1 ? 'а' : ''}`)
  const payable = (n: Count) => (n === 1 && promo ? promoPrice : n === 1 ? single : two)

  return (
    <div className="ps" role="radiogroup" aria-label={en ? 'How many pairs?' : 'Колко чифта?'}>
      <style>{css}</style>
      {([1, 2] as const).map(n => {
        const on = value === n
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={on}
            aria-label={`${pairLabel(n)}, ${money(payable(n))}`}
            className={on ? 'is-on' : ''}
            onClick={() => onChange(n)}
          >
            <input type="radio" readOnly checked={on} tabIndex={-1} aria-hidden="true" />
            <span className="ps-copy">
              <span className="ps-name">{pairLabel(n)}</span>
              <span className="ps-sub">{n === 1 ? (en ? 'Your selected glasses' : 'Избраните от вас очила') : (en ? 'All-day coverage' : 'Защита за целия ден')}</span>
            </span>
            <span className="ps-price">
              {n === 1 && promo ? (
                <span className="ps-row">
                  <s className="ps-was">{money(single)}</s>
                  <span className="ps-now">{money(promoPrice)}</span>
                </span>
              ) : n === 2 && two < separate ? (
                <>
                  <span className="ps-row">
                    <s className="ps-was">{money(separate)}</s>
                    <span className="ps-now">{money(two)}</span>
                  </span>
                  <span className="ps-save">{en ? `Save ${money(save)} · −${percent}%` : `Спестяваш ${money(save)} · −${percent}%`}</span>
                </>
              ) : (
                <span className="ps-now">{money(n === 1 ? single : two)}</span>
              )}
            </span>
            {n === 1 && promo && (
              <span className="ps-tag ps-tag-a">{code} · −{promoPercent}%</span>
            )}
            {n === 2 && (
              <>
                <span className="ps-tag ps-tag-a ps-tag-split">
                  <span className="ps-bf">Black Friday</span>
                  <span>{en ? 'Most popular' : 'Най-популярни'}</span>
                </span>
                {two < separate && (
                  <span className="ps-tag ps-tag-b">{en ? 'Second pair at 50% off' : 'Вторият чифт на половин цена'}</span>
                )}
              </>
            )}
          </button>
        )
      })}
    </div>
  )
}

const css = `
.ps {
  display: flex;
  flex-direction: column;
  gap: 22px;
  margin: 0 0 12px;
  padding: 12px 0 14px;
}
.ps button {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  overflow: visible;
  border: 1.5px solid rgba(28,15,10,0.1);
  border-radius: 12px;
  padding: 16px 18px;
  background: #fff8f2;
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  box-shadow: none;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
}
.ps button.is-on {
  border-color: #1C0F0A;
  background: rgba(28,15,10,0.04);
  box-shadow: 0 0 0 1px #1C0F0A;
}
.ps button:focus-visible {
  outline: 2px solid #B8906A;
  outline-offset: 3px;
}
.ps input {
  width: 18px;
  height: 18px;
  margin: 0;
  accent-color: #1C0F0A;
  flex-shrink: 0;
}
.ps-copy {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  flex: 1;
}
.ps-name {
  font-size: 15px;
  font-weight: 500;
  color: #1C0F0A;
}
.ps-sub {
  font-size: 12px;
  color: rgba(28,15,10,0.8);
  white-space: nowrap;
}
.ps-price {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  flex-shrink: 0;
}
.ps-row {
  display: flex;
  align-items: baseline;
  justify-content: flex-end;
  gap: 8px;
}
.ps-was {
  font-family: var(--font-cormorant), Georgia, serif;
  font-size: 16px;
  font-weight: 500;
  color: #9B7B68;
  text-decoration: line-through;
  text-decoration-thickness: 1.5px;
}
.ps-now {
  font-family: var(--font-cormorant), Georgia, serif;
  font-size: 30px;
  line-height: 0.95;
  font-weight: 600;
  color: #2D0E04;
}
.ps-save {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.02em;
  line-height: 1.375;
  white-space: nowrap;
  color: #B8906A;
}
.ps-tag {
  position: absolute;
  z-index: 1;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  line-height: 1;
  white-space: nowrap;
  background: #B8906A;
  color: #EDE4D6;
  border-radius: 999px;
  padding: 6px 12px;
}
.ps-tag-split {
  display: inline-flex;
  align-items: stretch;
  padding: 0;
  overflow: hidden;
}
.ps-tag-split > span {
  padding: 6px 11px;
}
.ps-bf {
  background: #2D0E04;
  color: #EDE4D6;
}
.ps-tag-a {
  top: 0;
  right: 16px;
  transform: translateY(-50%);
}
.ps-tag-b {
  bottom: 0;
  left: 46px;
  transform: translateY(50%);
}
`
