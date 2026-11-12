'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { usePricingSnapshot } from '@/components/pricing/PricingProvider'

type Count = 1 | 2

function money(value: number) {
  return `€${value.toFixed(2)}`
}

function usePairFacts() {
  const pricing = usePricingSnapshot()
  const single = pricing.single
  const two = pricing.double
  const separate = pricing.regularDouble
  const save = +((separate - two).toFixed(2))
  const percent = Math.round((save / separate) * 100)
  const perPair = Math.floor(Math.round(two * 100) / 2) / 100
  const promo = pricing.promo
  return { single, two, separate, save, percent, perPair, promo }
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

function Frame({ letter, title, children }: { letter: string; title: string; children: ReactNode }) {
  return (
    <section id={`variant-${letter.toLowerCase()}`} data-variant={letter} className="pd-frame">
      <p className="pd-letter">{letter}</p>
      <p className="pd-blurb">{title}</p>
      {children}
    </section>
  )
}

export default function PairOptionVariants() {
  const { single, two, separate, save, percent, perPair, promo } = usePairFacts()
  const code = promo?.code ?? 'BLACK15'
  const promoPrice = promo?.singlePairPrice ?? 50.99
  const promoPercent = promo?.percent ?? 15
  const [e, setE] = useState<Count>(2)
  const [f, setF] = useState<Count>(2)
  const [g, setG] = useState<Count>(1)
  const [h, setH] = useState<Count>(2)
  const [copied, setCopied] = useState(false)
  const counted = useCount(f === 2, separate, two)
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
    <div className="pd-page">
      <style>{css}</style>
      <div className="pd-wrap">
        <p className="pd-kicker">Чернова · не е на сайта</p>
        <h1>Колко чифта?</h1>
        <p className="pd-intro">Четири нови посоки. Живият избор на продуктовата страница не е пипан.</p>

        <Frame letter="E" title="Две високи карти. Двата чифта са по-големи, тъмни, със спестяването отпред.">
          <div className="pd-e" role="radiogroup" aria-label="Вариант E">
            <button type="button" role="radio" aria-checked={e === 1} className={`pd-ecard ${e === 1 ? 'is-on' : ''}`} onClick={() => setE(1)}>
              <span className="pd-eimgs pd-eimgs-one">
                <img src="/images/shop/shop-daily-2.png" alt="Един чифт AMPÉ" />
              </span>
              <span className="pd-ecopy">
                <span className="pd-ename">1 чифт</span>
                <span className="pd-eprice">{money(single)}</span>
                <span className="pd-echip">С код {code}: {money(promoPrice)}</span>
              </span>
            </button>
            <button type="button" role="radio" aria-checked={e === 2} className={`pd-ecard pd-ecard-two ${e === 2 ? 'is-on' : ''}`} onClick={() => setE(2)}>
              <span className="pd-eimgs pd-eimgs-two">
                <img src="/images/shop/shop-daily-2.png" alt="" />
                <img src="/images/shop/shop-evening-2.png" alt="Два чифта AMPÉ, дневни и вечерни" />
              </span>
              <span className="pd-ecopy">
                <span className="pd-eflag">Най-популярни</span>
                <span className="pd-ename">2 чифта</span>
                <span className="pd-eprice">{money(two)}</span>
                <span className="pd-ewas">{money(separate)} поотделно</span>
                <span className="pd-esave">Спестяваш {money(save)}</span>
                <span className="pd-eship">Безплатна доставка</span>
              </span>
            </button>
          </div>
        </Frame>

        <Frame letter="F" title="Лентата се свива от €119.98 до €89.99. Отдолу е цената на чифт.">
          <div className="pd-f" role="radiogroup" aria-label="Вариант F">
            <button type="button" role="radio" aria-checked={f === 2} className={`pd-fpanel ${f === 2 ? 'is-on' : ''}`} onClick={() => setF(2)}>
              <span className="pd-fends">
                <span>
                  <span className="pd-flabel">Поотделно</span>
                  <span className={`pd-fwas ${f === 2 ? 'is-struck' : ''}`}>{money(separate)}</span>
                </span>
                <span className="pd-fsave">Спестяваш {money(save)}</span>
                <span className="pd-fnow">
                  <span className="pd-flabel">Заедно</span>
                  <span className="pd-fnum">{f === 2 ? money(counted) : money(separate)}</span>
                </span>
              </span>
              <span className="pd-ftrack" aria-hidden="true">
                <span className="pd-ffill" style={{ width: f === 2 ? `${fill}%` : '100%' }} />
                <span className="pd-fgap" />
              </span>
              <span className="pd-fper">{money(perPair)} / чифт · −{percent}%</span>
              <span className="pd-fship">Безплатна доставка за 2 чифта</span>
            </button>
            <button type="button" role="radio" aria-checked={f === 1} className={`pd-fone ${f === 1 ? 'is-on' : ''}`} onClick={() => setF(1)}>
              <span>1 чифт</span>
              <span>{money(single)} · с код {code} {money(promoPrice)}</span>
            </button>
          </div>
        </Frame>

        <Frame letter="G" title="Превключвател 1 / 2. Под него панелът се сменя: билет с кода, или спестяването и доставката.">
          <div className="pd-g">
            <div className="pd-gtoggle" role="radiogroup" aria-label="Вариант G">
              <button type="button" role="radio" aria-checked={g === 1} className={g === 1 ? 'is-on' : ''} onClick={() => setG(1)}>1 чифт</button>
              <button type="button" role="radio" aria-checked={g === 2} className={g === 2 ? 'is-on' : ''} onClick={() => setG(2)}>2 чифта</button>
            </div>
            <div className={`pd-gpanel ${g === 2 ? 'is-two' : 'is-one'}`}>
              {g === 1 ? (
                <button type="button" className="pd-ticket" onClick={copyCode}>
                  <span className="pd-ticket-side">
                    <span>Код · само 1 чифт</span>
                    <strong>{code}</strong>
                  </span>
                  <span className="pd-ticket-main">
                    <span className="pd-ticket-was">{money(single)}</span>
                    <span className="pd-ticket-now">{money(promoPrice)}</span>
                    <span className="pd-ticket-off">−{promoPercent}%</span>
                    <span className="pd-ticket-act">{copied ? 'Копирано' : 'Копирай кода'}</span>
                  </span>
                </button>
              ) : (
                <div className="pd-gsum">
                  <p className="pd-geyebrow">Два чифта</p>
                  <p className="pd-gprice">{money(two)}</p>
                  <p className="pd-gwas">{money(separate)} поотделно</p>
                  <ul>
                    <li>Спестяваш {money(save)}</li>
                    <li>−{percent}% · {money(perPair)} / чифт</li>
                    <li>Безплатна доставка</li>
                  </ul>
                  <p className="pd-gnote">Код {code} е само за 1 чифт и става {money(promoPrice)}.</p>
                </div>
              )}
            </div>
          </div>
        </Frame>

        <Frame letter="H" title="Големи цифри, тънка линия и печат за офертата.">
          <div className="pd-h" role="radiogroup" aria-label="Вариант H">
            <button type="button" role="radio" aria-checked={h === 1} className={`pd-hcol ${h === 1 ? 'is-on' : ''}`} onClick={() => setH(1)}>
              <span className="pd-hlabel">Един чифт</span>
              <span className="pd-hnum">{money(promoPrice)}</span>
              <span className="pd-hrule" />
              <span className="pd-hmeta"><s>{money(single)}</s> с код {code}</span>
              <span className="pd-hmeta">−{promoPercent}% · само за 1 чифт</span>
            </button>
            <button type="button" role="radio" aria-checked={h === 2} className={`pd-hcol pd-hhero ${h === 2 ? 'is-on' : ''}`} onClick={() => setH(2)}>
              <span className={`pd-stamp ${h === 2 ? 'is-on' : ''}`}>
                <span>−{percent}%</span>
                <small>{money(save)}</small>
              </span>
              <span className="pd-hlabel">Два чифта</span>
              <span className="pd-hnum">{money(two)}</span>
              <span className="pd-hrule" />
              <span className="pd-hmeta"><s>{money(separate)}</s> поотделно</span>
              <span className="pd-hmeta">{money(perPair)} / чифт</span>
              <span className="pd-hship">Безплатна доставка</span>
            </button>
          </div>
        </Frame>
      </div>
    </div>
  )
}

const css = `
.pd-page { background: #FFF0E0; color: #1C0F0A; min-height: 100vh; }
.pd-wrap { max-width: 980px; margin: 0 auto; padding: 112px 24px 80px; }
.pd-kicker { margin: 0; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #B8906A; font-weight: 600; }
.pd-page h1 { font-family: var(--font-cormorant), Georgia, serif; font-weight: 500; font-size: 56px; line-height: 0.95; margin: 10px 0 8px; }
.pd-intro { margin: 0 0 12px; max-width: 460px; color: rgba(28,15,10,0.72); font-size: 15px; }
.pd-frame { padding: 36px 0 12px; }
.pd-letter { margin: 0; font-family: var(--font-cormorant), Georgia, serif; font-size: 72px; line-height: 0.85; }
.pd-blurb { margin: 8px 0 18px; max-width: 560px; color: rgba(28,15,10,0.72); font-size: 15px; }
.pd-page button { font-family: var(--font-raleway), sans-serif; color: inherit; }

.pd-e { display: grid; grid-template-columns: 0.86fr 1.14fr; gap: 16px; align-items: stretch; }
.pd-ecard { display: flex; flex-direction: column; text-align: left; border: 1px solid rgba(28,15,10,0.12); border-radius: 18px; background: #FFFBF5; padding: 14px; cursor: pointer; transition: transform 0.35s ease, box-shadow 0.35s ease; }
.pd-ecard.is-on { transform: translateY(-6px); box-shadow: 0 18px 40px rgba(45,14,4,0.12); }
.pd-ecard-two { background: #2D0E04; color: #EDE4D6; border-color: #2D0E04; min-height: 460px; }
.pd-ecard-two.is-on { box-shadow: 0 22px 50px rgba(45,14,4,0.28); }
.pd-eimgs { display: block; background: #F5DFC5; border-radius: 12px; overflow: hidden; height: 210px; position: relative; }
.pd-eimgs img { width: 100%; height: 100%; object-fit: contain; object-position: center; background: #F5DFC5; }
.pd-eimgs-one img { object-fit: cover; object-position: center 36%; }
.pd-eimgs-two { height: 250px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; background: transparent; }
.pd-eimgs-two img { border-radius: 10px; object-fit: cover; object-position: center 30%; }
.pd-ecopy { display: flex; flex-direction: column; align-items: flex-start; padding: 16px 8px 8px; }
.pd-ename { font-family: var(--font-cormorant), Georgia, serif; font-size: 32px; line-height: 1; }
.pd-eprice { font-family: var(--font-cormorant), Georgia, serif; font-size: 42px; line-height: 1; margin-top: 6px; }
.pd-ecard-two .pd-eprice { font-size: 56px; color: #EDE4D6; }
.pd-ewas { margin-top: 4px; color: rgba(237,228,214,0.62); text-decoration: line-through; font-size: 13px; }
.pd-esave { margin-top: 12px; background: #C4A266; color: #2D0E04; font-weight: 700; letter-spacing: 0.04em; border-radius: 999px; padding: 7px 12px; font-size: 13px; }
.pd-eship { margin-top: 8px; font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; color: #EDE4D6; }
.pd-eflag { font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; color: #C4A266; font-weight: 700; margin-bottom: 8px; }
.pd-echip { margin-top: 10px; font-size: 12px; color: #7C3018; background: #F5DFC5; border-radius: 999px; padding: 4px 10px; }

.pd-f { max-width: 640px; }
.pd-fpanel, .pd-fone { width: 100%; text-align: left; cursor: pointer; border-radius: 18px; }
.pd-fpanel { display: block; background: #FFFBF5; border: 1px solid rgba(28,15,10,0.1); padding: 22px 22px 18px; transition: box-shadow 0.35s ease, transform 0.35s ease; }
.pd-fpanel.is-on { transform: translateY(-4px); box-shadow: 0 16px 36px rgba(45,14,4,0.1); border-color: #B8906A; }
.pd-fends { display: flex; justify-content: space-between; align-items: flex-end; gap: 12px; }
.pd-flabel { display: block; font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: #9B7B68; }
.pd-fwas { display: inline-block; position: relative; font-family: var(--font-cormorant), Georgia, serif; font-size: 28px; color: #9B7B68; }
.pd-fwas.is-struck::after { content: ''; position: absolute; left: 0; right: 0; top: 54%; height: 2px; background: #B8906A; transform-origin: left; animation: pd-strike 0.7s ease forwards; }
.pd-fsave { background: #2D0E04; color: #EDE4D6; border-radius: 999px; padding: 8px 12px; font-size: 13px; font-weight: 600; }
.pd-fnum { font-family: var(--font-cormorant), Georgia, serif; font-size: 48px; line-height: 0.9; }
.pd-fnow { text-align: right; }
.pd-ftrack { display: flex; height: 14px; margin: 16px 0 10px; border-radius: 999px; overflow: hidden; background: #EDE4D6; }
.pd-ffill { display: block; height: 100%; background: #2D0E04; width: 100%; transition: width 0.7s ease; }
.pd-fgap { flex: 1; background: #B8906A; }
.pd-fper { display: block; font-family: var(--font-cormorant), Georgia, serif; font-size: 28px; }
.pd-fship { display: block; margin-top: 4px; font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; color: #7C3018; }
.pd-fone { margin-top: 10px; display: flex; justify-content: space-between; gap: 12px; padding: 14px 16px; background: transparent; border: 1px solid rgba(28,15,10,0.14); font-size: 14px; }
.pd-fone.is-on { background: #FFFBF5; border-color: #1C0F0A; }

.pd-g { max-width: 460px; }
.pd-gtoggle { display: grid; grid-template-columns: 1fr 1fr; padding: 4px; background: #EDE4D6; border-radius: 999px; }
.pd-gtoggle button { border: 0; background: transparent; border-radius: 999px; padding: 12px 8px; cursor: pointer; font-size: 14px; font-weight: 600; }
.pd-gtoggle button.is-on { background: #2D0E04; color: #EDE4D6; }
.pd-gpanel { margin-top: 14px; }
.pd-ticket { width: 100%; display: flex; flex-direction: column; border: 0; padding: 0; cursor: pointer; background: #FFFBF5; border-radius: 16px; overflow: hidden; box-shadow: 0 14px 32px rgba(45,14,4,0.1); text-align: left; transition: transform 0.3s ease; }
.pd-ticket:hover { transform: translateY(-3px) rotate(-0.4deg); }
.pd-ticket-side { background: #B8906A; color: #EDE4D6; display: flex; flex-direction: row; align-items: baseline; justify-content: space-between; gap: 12px; padding: 16px 18px 14px; border-bottom: 2px dashed rgba(237,228,214,0.75); }
.pd-ticket-side span { font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; }
.pd-ticket-side strong { font-family: var(--font-cormorant), Georgia, serif; font-size: 34px; font-weight: 500; letter-spacing: 0.08em; line-height: 1; }
.pd-ticket-main { padding: 16px 18px; display: flex; flex-direction: column; align-items: flex-start; }
.pd-ticket-was { color: #9B7B68; text-decoration: line-through; font-size: 14px; }
.pd-ticket-now { font-family: var(--font-cormorant), Georgia, serif; font-size: 52px; line-height: 0.9; }
.pd-ticket-off { margin-top: 4px; font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; color: #7C3018; }
.pd-ticket-act { margin-top: 10px; font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; border-bottom: 1px solid #1C0F0A; }
.pd-gsum { background: #2D0E04; color: #EDE4D6; border-radius: 18px; padding: 22px 22px 18px; }
.pd-geyebrow { margin: 0; letter-spacing: 0.16em; text-transform: uppercase; font-size: 11px; color: #C4A266; }
.pd-gprice { margin: 8px 0 0; font-family: var(--font-cormorant), Georgia, serif; font-size: 64px; line-height: 0.9; }
.pd-gwas { margin: 0; color: rgba(237,228,214,0.55); text-decoration: line-through; }
.pd-gsum ul { margin: 14px 0 0; padding: 0; list-style: none; }
.pd-gsum li { padding: 8px 0; border-top: 1px solid rgba(237,228,214,0.18); font-size: 15px; }
.pd-gnote { margin: 12px 0 0; font-size: 12px; color: rgba(237,228,214,0.7); }

.pd-h { display: grid; grid-template-columns: 0.8fr 1.2fr; gap: 0; max-width: 760px; border-top: 1px solid rgba(28,15,10,0.2); }
.pd-hcol { position: relative; text-align: left; background: transparent; border: 0; border-bottom: 1px solid rgba(28,15,10,0.2); padding: 28px 22px 24px; cursor: pointer; }
.pd-hhero { border-left: 1px solid rgba(28,15,10,0.2); }
.pd-hlabel { display: block; font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase; color: #9B7B68; }
.pd-hnum { display: block; margin-top: 10px; font-family: var(--font-cormorant), Georgia, serif; font-size: 68px; line-height: 0.86; font-weight: 500; }
.pd-hhero .pd-hnum { font-size: 92px; }
.pd-hrule { display: block; height: 1px; width: 0; margin: 14px 0; background: #1C0F0A; transition: width 0.45s ease; }
.pd-hcol.is-on .pd-hrule { width: 72px; }
.pd-hmeta { display: block; font-size: 14px; color: rgba(28,15,10,0.75); margin-top: 4px; }
.pd-hmeta s { color: #9B7B68; }
.pd-hship { display: inline-block; margin-top: 14px; letter-spacing: 0.14em; text-transform: uppercase; font-size: 11px; font-weight: 700; color: #7C3018; }
.pd-stamp { position: absolute; right: 18px; top: 22px; width: 92px; height: 92px; border: 1.5px solid #B8906A; border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #B8906A; transform: rotate(-8deg) scale(0.92); opacity: 0.55; }
.pd-stamp.is-on { animation: pd-stamp 0.6s ease forwards; }
.pd-stamp span { font-family: var(--font-cormorant), Georgia, serif; font-size: 28px; line-height: 1; }
.pd-stamp small { font-size: 11px; letter-spacing: 0.04em; }
.pd-hcol.is-on { background: rgba(255,251,245,0.55); }

@keyframes pd-strike { from { transform: scaleX(0); } to { transform: scaleX(1); } }
@keyframes pd-stamp { from { transform: rotate(-18deg) scale(0.8); opacity: 0; } to { transform: rotate(-8deg) scale(1); opacity: 1; } }

@media (hover: hover) {
  .pd-ecard:hover, .pd-fpanel:hover, .pd-hcol:hover { transform: translateY(-4px); }
  .pd-ecard.is-on:hover, .pd-ecard-two.is-on:hover { transform: translateY(-8px); }
}
@media (max-width: 720px) {
  .pd-e, .pd-h { grid-template-columns: 1fr; }
  .pd-hhero { border-left: 0; border-top: 1px solid rgba(28,15,10,0.2); }
  .pd-hhero .pd-hnum { font-size: 72px; }
  .pd-ecard-two { min-height: 0; }
  .pd-fends { flex-wrap: wrap; }
  .pd-stamp { width: 76px; height: 76px; }
}
@media (prefers-reduced-motion: reduce) {
  .pd-page *, .pd-page *::after {
    animation: none !important;
    transition: none !important;
  }
  .pd-fwas.is-struck::after { transform: scaleX(1); }
  .pd-stamp.is-on { transform: rotate(-8deg) scale(1); opacity: 1; }
  .pd-hcol.is-on .pd-hrule { width: 72px; }
}
`
