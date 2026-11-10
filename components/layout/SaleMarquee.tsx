const COPIES = 6

/**
 * Seamless sale bar. Two identical groups scroll by exactly half the track,
 * so the loop has no gap. The phrase is repeated so each group is wider than
 * a desktop viewport.
 */
export default function SaleMarquee({ text }: { text: string }) {
  const phrase = `✦ ${text}`
  return (
    <div className="sale-marquee w-full bg-onyx overflow-hidden py-2" role="region" aria-label={text}>
      <div className="sale-marquee-track" aria-hidden="true">
        {[0, 1].map(group => (
          <div key={group} className={group === 0 ? 'sale-marquee-group' : 'sale-marquee-group sale-marquee-group-copy'}>
            {Array.from({ length: COPIES }, (_, index) => (
              <span
                key={index}
                className={index === 0
                  ? 'sale-marquee-item font-sans text-[11px] font-bold uppercase tracking-widest text-gold'
                  : 'sale-marquee-item sale-marquee-item-repeat font-sans text-[11px] font-bold uppercase tracking-widest text-gold'}
              >
                {phrase}
              </span>
            ))}
          </div>
        ))}
      </div>
      <style>{`
        .sale-marquee-track {
          display: flex;
          width: max-content;
          animation: sale-marquee 36s linear infinite;
        }
        .sale-marquee-group {
          display: flex;
          flex: none;
          align-items: center;
          min-width: 100%;
        }
        .sale-marquee-item {
          white-space: nowrap;
          padding: 0 2.5rem;
        }
        .sale-marquee:hover .sale-marquee-track,
        .sale-marquee:focus-within .sale-marquee-track {
          animation-play-state: paused;
        }
        @keyframes sale-marquee {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-50%, 0, 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .sale-marquee-track {
            animation: none;
            transform: none;
            width: 100%;
            justify-content: center;
          }
          .sale-marquee-group {
            min-width: 0;
            width: 100%;
            justify-content: center;
          }
          .sale-marquee-group-copy,
          .sale-marquee-item-repeat {
            display: none;
          }
          .sale-marquee-item {
            white-space: normal;
            text-align: center;
            padding: 0 1rem;
          }
        }
      `}</style>
    </div>
  )
}
