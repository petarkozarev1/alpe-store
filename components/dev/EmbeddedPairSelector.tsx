'use client'

import { useEffect, useState } from 'react'
import { usePricingSnapshot } from '@/components/pricing/PricingProvider'

export type PairVariant = 'E' | 'F' | 'G' | 'H'
type Count = 1 | 2

function money(value: number) {
  return `€${value.toFixed(2)}`
}

function useCount(active: boolean, from: number, to: number) {
  const [value, setValue] = useState(to)
  useEffect(() => {
    if (!active) {
      setValue(from)
      return
    }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setValue(to)
      return
    }
    let frame = 0
    const started = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - started) / 700)
      const eased = 1 - (1 - t) ** 3
      setValue(from + (to - from) * eased)
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    setValue(from)
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [active, from, to])
  return value
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
  const pricing = usePricingSnapshot()
  const single = pricing.single
  const two = pricing.double
  const separate = pricing.regularDouble
  const save = +((separate - two).toFixed(2))
  const percent = Math.round((save / separate) * 100)
  const perPair = Math.floor(Math.round(two * 100) / 2) / 100
  const code = pricing.promo?.code ?? 'BLACK15'
  const promoPrice = pricing.promo?.singlePairPrice ?? 50.99
  const promoPercent = pricing.promo?.percent ?? 15
  const [copied, setCopied] = useState(false)
  const counted = useCount(variant === 'F' && value === 2, separate, two)
  const fill = Math.round((two / separate) * 100)

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="pe" data-pair-variant={variant}>
      <style>{css}</style>
      {variant === 'E' && (
        <div className="pe-e" role="radiogroup" aria-label="Колко чифта?">
          <button type="button" role="radio" aria-checked={value === 1} className={`pe-ecard ${value === 1 ? 'is-on' : ''}`} onClick={() => onChange(1)}>
            <span className="pe-eimgs pe-eimgs-one"><img src="/images/shop/shop-daily-2.png" alt="Един чифт AMPÉ" /></span>
            <span className="pe-ecopy">
              <span className="pe-ename">1 чифт</span>
              <span className="pe-eprice">{money(single)}</span>
              <span className="pe-echip">С код {code}: {money(promoPrice)}</span>
            </span>
          </button>
          <button type="button" role="radio" aria-checked={value === 2} className={`pe-ecard pe-ecard-two ${value === 2 ? 'is-on' : ''}`} onClick={() => onChange(2)}>
            <span className="pe-eimgs pe-eimgs-two">
              <img src="/images/shop/shop-daily-2.png" alt="" />
              <img src="/images/shop/shop-evening-2.png" alt="Два чифта AMPÉ" />
            </span>
            <span className="pe-ecopy">
              <span className="pe-eflag">Най-популярни</span>
              <span className="pe-ename">2 чифта</span>
              <span className="pe-eprice">{money(two)}</span>
              <span className="pe-ewas">{money(separate)} поотделно</span>
              <span className="pe-esave">Спестяваш {money(save)}</span>
              <span className="pe-eship">Безплатна доставка</span>
            </span>
          </button>
        </div>
      )}
      {variant === 'F' && (
        <div className="pe-f" role="radiogroup" aria-label="Колко чифта?">
          <button type="button" role="radio" aria-checked={value === 2} className={`pe-fpanel ${value === 2 ? 'is-on' : ''}`} onClick={() => onChange(2)}>
            <span className="pe-fends">
              <span>
                <span className="pe-flabel">Поотделно</span>
                <span className={`pe-fwas ${value === 2 ? 'is-struck' : ''}`}>{money(separate)}</span>
              </span>
              <span className="pe-fsave">Спестяваш {money(save)}</span>
              <span className="pe-fnow">
                <span className="pe-flabel">Заедно</span>
                <span className="pe-fnum">{value === 2 ? money(counted) : money(separate)}</span>
              </span>
            </span>
            <span className="pe-ftrack" aria-hidden="true">
              <span className="pe-ffill" style={{ width: value === 2 ? `${fill}%` : '100%' }} />
            </span>
            <span className="pe-fper">{money(perPair)} / чифт · −{percent}%</span>
            <span className="pe-fship">Безплатна доставка за 2 чифта</span>
          </button>
          <button type="button" role="radio" aria-checked={value === 1} className={`pe-fone ${value === 1 ? 'is-on' : ''}`} onClick={() => onChange(1)}>
            <span>1 чифт</span>
            <span>{money(single)} · с код {code} {money(promoPrice)}</span>
          </button>
        </div>
      )}
      {variant === 'G' && (
        <div className="pe-g">
          <div className="pe-gtoggle" role="radiogroup" aria-label="Колко чифта?">
            <button type="button" role="radio" aria-checked={value === 1} className={value === 1 ? 'is-on' : ''} onClick={() => onChange(1)}>1 чифт</button>
            <button type="button" role="radio" aria-checked={value === 2} className={value === 2 ? 'is-on' : ''} onClick={() => onChange(2)}>2 чифта</button>
          </div>
          {value === 1 ? (
            <button type="button" className="pe-ticket" onClick={copyCode}>
              <span className="pe-ticket-side">
                <span>Код · само 1 чифт</span>
                <strong>{code}</strong>
              </span>
              <span className="pe-ticket-main">
                <span className="pe-ticket-was">{money(single)}</span>
                <span className="pe-ticket-now">{money(promoPrice)}</span>
                <span className="pe-ticket-off">−{promoPercent}%</span>
                <span className="pe-ticket-act">{copied ? 'Копирано' : 'Копирай кода'}</span>
              </span>
            </button>
          ) : (
            <div className="pe-gsum">
              <p className="pe-geyebrow">Два чифта</p>
              <p className="pe-gprice">{money(two)}</p>
              <p className="pe-gwas">{money(separate)} поотделно</p>
              <ul>
                <li>Спестяваш {money(save)}</li>
                <li>−{percent}% · {money(perPair)} / чифт</li>
                <li>Безплатна доставка</li>
              </ul>
            </div>
          )}
        </div>
      )}
      {variant === 'H' && (
        <div className="pe-h" role="radiogroup" aria-label="Колко чифта?">
          <button type="button" role="radio" aria-checked={value === 1} className={`pe-hcol ${value === 1 ? 'is-on' : ''}`} onClick={() => onChange(1)}>
            <span className="pe-hlabel">Един чифт</span>
            <span className="pe-hnum">{money(promoPrice)}</span>
            <span className="pe-hrule" />
            <span className="pe-hmeta"><s>{money(single)}</s> с код {code}</span>
            <span className="pe-hmeta">−{promoPercent}% · само за 1 чифт</span>
          </button>
          <button type="button" role="radio" aria-checked={value === 2} className={`pe-hcol pe-hhero ${value === 2 ? 'is-on' : ''}`} onClick={() => onChange(2)}>
            <span className={`pe-stamp ${value === 2 ? 'is-on' : ''}`}><span>−{percent}%</span><small>{money(save)}</small></span>
            <span className="pe-hlabel">Два чифта</span>
            <span className="pe-hnum">{money(two)}</span>
            <span className="pe-hrule" />
            <span className="pe-hmeta"><s>{money(separate)}</s> поотделно</span>
            <span className="pe-hmeta">{money(perPair)} / чифт</span>
            <span className="pe-hship">Безплатна доставка</span>
          </button>
        </div>
      )}
    </div>
  )
}

const css = `
.pe { margin-bottom: 24px; }
.pe button { font-family: var(--font-raleway), sans-serif; color: inherit; }
.pe-e { display: grid; grid-template-columns: 0.86fr 1.14fr; gap: 10px; }
.pe-ecard { display: flex; flex-direction: column; text-align: left; border: 1px solid rgba(28,15,10,0.12); border-radius: 16px; background: #FFFBF5; padding: 10px; cursor: pointer; transition: transform 0.35s ease, box-shadow 0.35s ease; }
.pe-ecard.is-on { transform: translateY(-4px); box-shadow: 0 14px 28px rgba(45,14,4,0.12); }
.pe-ecard-two { background: #2D0E04; color: #EDE4D6; border-color: #2D0E04; }
.pe-eimgs { display: block; background: #F5DFC5; border-radius: 10px; overflow: hidden; height: 120px; position: relative; }
.pe-eimgs img { width: 100%; height: 100%; object-fit: cover; object-position: center 36%; }
.pe-eimgs-two { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; background: transparent; height: 132px; }
.pe-ecopy { display: flex; flex-direction: column; align-items: flex-start; padding: 10px 4px 4px; }
.pe-ename { font-family: var(--font-cormorant), Georgia, serif; font-size: 22px; line-height: 1; }
.pe-eprice { font-family: var(--font-cormorant), Georgia, serif; font-size: 28px; line-height: 1; margin-top: 4px; }
.pe-ecard-two .pe-eprice { font-size: 36px; }
.pe-ewas { margin-top: 2px; color: rgba(237,228,214,0.62); text-decoration: line-through; font-size: 12px; }
.pe-esave { margin-top: 8px; background: #C4A266; color: #2D0E04; font-weight: 700; border-radius: 999px; padding: 5px 10px; font-size: 12px; }
.pe-eship { margin-top: 6px; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; }
.pe-eflag { font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase; color: #C4A266; font-weight: 700; margin-bottom: 4px; }
.pe-echip { margin-top: 8px; font-size: 11px; color: #7C3018; background: #F5DFC5; border-radius: 999px; padding: 3px 8px; }
.pe-fpanel, .pe-fone { width: 100%; text-align: left; cursor: pointer; border-radius: 16px; }
.pe-fpanel { display: block; background: #FFFBF5; border: 1px solid rgba(28,15,10,0.1); padding: 16px; transition: box-shadow 0.35s ease, transform 0.35s ease; }
.pe-fpanel.is-on { transform: translateY(-3px); box-shadow: 0 14px 28px rgba(45,14,4,0.1); border-color: #B8906A; }
.pe-fends { display: flex; justify-content: space-between; align-items: flex-end; gap: 8px; }
.pe-flabel { display: block; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: #9B7B68; }
.pe-fwas { display: inline-block; position: relative; font-family: var(--font-cormorant), Georgia, serif; font-size: 24px; color: #9B7B68; }
.pe-fwas.is-struck::after { content: ''; position: absolute; left: 0; right: 0; top: 54%; height: 2px; background: #B8906A; transform-origin: left; animation: pe-strike 0.7s ease forwards; }
.pe-fsave { background: #2D0E04; color: #EDE4D6; border-radius: 999px; padding: 6px 10px; font-size: 12px; font-weight: 600; }
.pe-fnum { font-family: var(--font-cormorant), Georgia, serif; font-size: 36px; line-height: 0.9; }
.pe-fnow { text-align: right; }
.pe-ftrack { display: block; height: 12px; margin: 12px 0 8px; border-radius: 999px; overflow: hidden; background: #B8906A; }
.pe-ffill { display: block; height: 100%; background: #2D0E04; transition: width 0.7s ease; }
.pe-fper { display: block; font-family: var(--font-cormorant), Georgia, serif; font-size: 24px; }
.pe-fship { display: block; margin-top: 2px; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #7C3018; }
.pe-fone { margin-top: 8px; display: flex; justify-content: space-between; gap: 8px; padding: 12px 14px; background: transparent; border: 1px solid rgba(28,15,10,0.14); font-size: 13px; }
.pe-fone.is-on { background: #FFFBF5; border-color: #1C0F0A; }
.pe-gtoggle { display: grid; grid-template-columns: 1fr 1fr; padding: 4px; background: #EDE4D6; border-radius: 999px; }
.pe-gtoggle button { border: 0; background: transparent; border-radius: 999px; padding: 11px 8px; cursor: pointer; font-size: 14px; font-weight: 600; }
.pe-gtoggle button.is-on { background: #2D0E04; color: #EDE4D6; }
.pe-ticket { width: 100%; display: flex; flex-direction: column; border: 0; padding: 0; margin-top: 12px; cursor: pointer; background: #FFFBF5; border-radius: 16px; overflow: hidden; box-shadow: 0 12px 28px rgba(45,14,4,0.1); text-align: left; }
.pe-ticket-side { background: #B8906A; color: #EDE4D6; display: flex; align-items: baseline; justify-content: space-between; gap: 12px; padding: 14px 16px; border-bottom: 2px dashed rgba(237,228,214,0.75); }
.pe-ticket-side span { font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; }
.pe-ticket-side strong { font-family: var(--font-cormorant), Georgia, serif; font-size: 32px; font-weight: 500; letter-spacing: 0.06em; line-height: 1; }
.pe-ticket-main { padding: 14px 16px; display: flex; flex-direction: column; align-items: flex-start; }
.pe-ticket-was { color: #9B7B68; text-decoration: line-through; font-size: 13px; }
.pe-ticket-now { font-family: var(--font-cormorant), Georgia, serif; font-size: 46px; line-height: 0.9; }
.pe-ticket-off { margin-top: 2px; font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; color: #7C3018; }
.pe-ticket-act { margin-top: 8px; font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; border-bottom: 1px solid #1C0F0A; }
.pe-gsum { margin-top: 12px; background: #2D0E04; color: #EDE4D6; border-radius: 16px; padding: 16px 16px 12px; }
.pe-geyebrow { margin: 0; letter-spacing: 0.16em; text-transform: uppercase; font-size: 11px; color: #C4A266; }
.pe-gprice { margin: 6px 0 0; font-family: var(--font-cormorant), Georgia, serif; font-size: 52px; line-height: 0.9; }
.pe-gwas { margin: 0; color: rgba(237,228,214,0.55); text-decoration: line-through; }
.pe-gsum ul { margin: 10px 0 0; padding: 0; list-style: none; }
.pe-gsum li { padding: 7px 0; border-top: 1px solid rgba(237,228,214,0.18); font-size: 14px; }
.pe-h { display: grid; grid-template-columns: 0.82fr 1.18fr; border-top: 1px solid rgba(28,15,10,0.2); }
.pe-hcol { position: relative; text-align: left; background: transparent; border: 0; border-bottom: 1px solid rgba(28,15,10,0.2); padding: 16px 12px 14px; cursor: pointer; }
.pe-hhero { border-left: 1px solid rgba(28,15,10,0.2); }
.pe-hlabel { display: block; font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: #9B7B68; }
.pe-hnum { display: block; margin-top: 6px; font-family: var(--font-cormorant), Georgia, serif; font-size: 40px; line-height: 0.86; font-weight: 500; }
.pe-hhero .pe-hnum { font-size: 52px; }
.pe-hrule { display: block; height: 1px; width: 0; margin: 10px 0; background: #1C0F0A; transition: width 0.45s ease; }
.pe-hcol.is-on .pe-hrule { width: 56px; }
.pe-hmeta { display: block; font-size: 13px; color: rgba(28,15,10,0.75); margin-top: 3px; }
.pe-hmeta s { color: #9B7B68; }
.pe-hship { display: inline-block; margin-top: 10px; letter-spacing: 0.12em; text-transform: uppercase; font-size: 10px; font-weight: 700; color: #7C3018; }
.pe-stamp { position: absolute; right: 8px; top: 10px; width: 68px; height: 68px; border: 1.5px solid #B8906A; border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #B8906A; transform: rotate(-8deg); }
.pe-stamp span { font-family: var(--font-cormorant), Georgia, serif; font-size: 20px; line-height: 1; }
.pe-stamp small { font-size: 10px; }
.pe-hcol.is-on { background: rgba(255,251,245,0.55); }
@keyframes pe-strike { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@media (max-width: 720px) {
  .pe-e, .pe-h { grid-template-columns: 1fr; }
  .pe-hhero { border-left: 0; border-top: 1px solid rgba(28,15,10,0.2); }
  .pe-fends { flex-wrap: wrap; }
}
@media (prefers-reduced-motion: reduce) {
  .pe *, .pe *::after { animation: none !important; transition: none !important; }
  .pe-fwas.is-struck::after { transform: scaleX(1); }
  .pe-hcol.is-on .pe-hrule { width: 56px; }
}
`
