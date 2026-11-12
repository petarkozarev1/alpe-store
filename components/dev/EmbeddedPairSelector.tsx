'use client'

import { useLocale } from '@/components/i18n/LocaleProvider'
import { usePricingSnapshot } from '@/components/pricing/PricingProvider'

export type PairVariant = 'R1' | 'R2' | 'R3'
type Count = 1 | 2

function money(value: number) {
  return `€${value.toFixed(2)}`
}

export default function EmbeddedPairSelector({
  variant,
  value,
  onChange,
}: {
  variant: PairVariant
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
    <div className={`pe pe-${variant.toLowerCase()}`} data-pair-variant={variant} role="radiogroup" aria-label={en ? 'How many pairs?' : 'Колко чифта?'}>
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
            <span className="pe-copy">
              <span className="pe-name">{pairLabel(n)}</span>
              <span className="pe-sub">{n === 1 ? (en ? 'Your selected glasses' : 'Избраните от вас очила') : (en ? 'All-day coverage' : 'Защита за целия ден')}</span>
            </span>
            <span className="pe-price">
              {n === 1 && promo ? (
                <span className="pe-row">
                  <s className="pe-was">{money(single)}</s>
                  <span className="pe-now">{money(promoPrice)}</span>
                </span>
              ) : n === 2 && two < separate ? (
                <>
                  <span className="pe-row">
                    <s className="pe-was">{money(separate)}</s>
                    <span className="pe-now">{money(two)}</span>
                    <span className="pe-pct">−{percent}%</span>
                  </span>
                  <span className="pe-save">{en ? `Save ${money(save)}` : `Спестяваш ${money(save)}`}{variant === 'R1' ? ` · −${percent}%` : ''}</span>
                </>
              ) : (
                <span className="pe-now">{money(n === 1 ? single : two)}</span>
              )}
            </span>
            {n === 1 && promo && (
              <span className="pe-tag pe-tag-a">{code} · −{promoPercent}%</span>
            )}
            {n === 2 && (
              <>
                <span className="pe-tag pe-tag-a">{en ? 'Most popular' : 'Най-популярни'}</span>
                {two < separate && (
                  <span className="pe-tag pe-tag-b">{en ? 'Second pair at 50% off' : 'Вторият чифт на половин цена'}</span>
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
.pe {
  display: flex;
  flex-direction: column;
  gap: 22px;
  margin: 0 0 12px;
  padding: 12px 0 14px;
}
.pe button {
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
.pe button.is-on {
  border-color: #1C0F0A;
  background: rgba(28,15,10,0.04);
  box-shadow: 0 0 0 1px #1C0F0A;
}
.pe button:focus-visible {
  outline: 2px solid #B8906A;
  outline-offset: 3px;
}
.pe input {
  width: 18px;
  height: 18px;
  margin: 0;
  accent-color: #1C0F0A;
  flex-shrink: 0;
}
.pe-copy {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  flex: 1;
}
.pe-name {
  font-size: 15px;
  font-weight: 500;
  color: #1C0F0A;
}
.pe-sub {
  font-size: 12px;
  color: rgba(28,15,10,0.8);
}
.pe-price {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  flex-shrink: 0;
}
.pe-row {
  display: flex;
  align-items: baseline;
  justify-content: flex-end;
  gap: 8px;
}
.pe-was {
  font-family: var(--font-cormorant), Georgia, serif;
  font-size: 16px;
  font-weight: 500;
  color: #9B7B68;
  text-decoration: line-through;
  text-decoration-thickness: 1.5px;
}
.pe-now {
  font-family: var(--font-cormorant), Georgia, serif;
  font-size: 30px;
  line-height: 0.95;
  font-weight: 600;
  color: #2D0E04;
}
.pe-save {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #7C3018;
}
.pe-tag {
  position: absolute;
  z-index: 1;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  line-height: 1;
  white-space: nowrap;
}

/* R1 — tan pills sitting on the border. Savings stay in the price, in tan. */
.pe-r1 .pe-tag {
  background: #B8906A;
  color: #EDE4D6;
  border-radius: 999px;
  padding: 5px 10px;
}
.pe-r1 .pe-tag-a {
  top: 0;
  right: 16px;
  transform: translateY(-50%);
}
.pe-r1 .pe-tag-b {
  bottom: 0;
  left: 46px;
  transform: translateY(50%);
}
.pe-r1 .pe-pct { display: none; }
.pe-r1 .pe-save { color: #B8906A; }

/* R2 — dark ribbons folded over the left corners. Percent is an onyx chip. */
.pe-r2 { gap: 30px; padding-top: 30px; padding-bottom: 32px; }
.pe-r2 .pe-tag {
  background: #2D0E04;
  color: #EDE4D6;
  padding: 6px 11px 6px 12px;
}
.pe-r2 .pe-tag-a {
  top: 0;
  left: 16px;
  transform: translateY(-100%);
  border-radius: 3px 3px 3px 0;
}
.pe-r2 .pe-tag-a::before {
  content: "";
  position: absolute;
  left: 0;
  top: 100%;
  border-left: 7px solid #7C3018;
  border-bottom: 6px solid transparent;
}
.pe-r2 .pe-tag-b {
  bottom: 0;
  left: 16px;
  transform: translateY(100%);
  border-radius: 0 3px 3px 3px;
}
.pe-r2 .pe-tag-b::before {
  content: "";
  position: absolute;
  left: 0;
  bottom: 100%;
  border-left: 7px solid #7C3018;
  border-top: 6px solid transparent;
}
.pe-r2 .pe-pct {
  background: #2D0E04;
  color: #EDE4D6;
  border-radius: 999px;
  padding: 3px 7px;
  font-family: var(--font-raleway), sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.06em;
  line-height: 1.2;
}
.pe-r2 .pe-now { font-size: 32px; }

/* R3 — notched tickets overlapping the edge. Percent is a small ticket too. */
.pe-r3 .pe-tag {
  background: #EDE4D6;
  color: #7C3018;
  box-shadow: inset 0 0 0 1px #B8906A;
  padding: 6px 14px;
  -webkit-mask:
    radial-gradient(circle 4.5px at left, transparent 4.5px, #000 5px) left center / 12px 100% no-repeat,
    radial-gradient(circle 4.5px at right, transparent 4.5px, #000 5px) right center / 12px 100% no-repeat,
    linear-gradient(#000, #000) center / calc(100% - 10px) 100% no-repeat;
  mask:
    radial-gradient(circle 4.5px at left, transparent 4.5px, #000 5px) left center / 12px 100% no-repeat,
    radial-gradient(circle 4.5px at right, transparent 4.5px, #000 5px) right center / 12px 100% no-repeat,
    linear-gradient(#000, #000) center / calc(100% - 10px) 100% no-repeat;
}
.pe-r3 .pe-tag-a {
  top: 0;
  right: 14px;
  transform: translateY(-55%);
}
.pe-r3 .pe-tag-b {
  bottom: 0;
  left: 46px;
  transform: translateY(55%);
}
.pe-r3 .pe-pct {
  font-family: var(--font-raleway), sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #7C3018;
  background: #EDE4D6;
  box-shadow: inset 0 0 0 1px #B8906A;
  border-radius: 2px;
  padding: 2px 7px;
  line-height: 1.3;
  -webkit-mask:
    radial-gradient(circle 3px at left, transparent 3px, #000 3.5px) left center / 8px 100% no-repeat,
    radial-gradient(circle 3px at right, transparent 3px, #000 3.5px) right center / 8px 100% no-repeat,
    linear-gradient(#000, #000) center / calc(100% - 6px) 100% no-repeat;
  mask:
    radial-gradient(circle 3px at left, transparent 3px, #000 3.5px) left center / 8px 100% no-repeat,
    radial-gradient(circle 3px at right, transparent 3px, #000 3.5px) right center / 8px 100% no-repeat,
    linear-gradient(#000, #000) center / calc(100% - 6px) 100% no-repeat;
}
`
