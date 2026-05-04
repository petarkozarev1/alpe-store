const items = [
  { icon: '☆', title: 'BS EN ISO 12312-1', sub: 'EU оптична безопасност' },
  { icon: '◷', title: 'ANSI Z80.3', sub: 'Американски стандарт' },
  { icon: '◉', title: 'AS/NZS 1067.1', sub: 'Австралийски стандарт' },
  { icon: '◈', title: 'UV400 ЗАЩИТА', sub: 'Пълна UV блокада' },
  { icon: '◎', title: 'GREEN LIGHT BLOCK', sub: '500–560nm филтър' },
]

export default function CertStrip() {
  return (
    <div className="w-full bg-onyx py-4 overflow-x-auto">
      <div className="min-w-max max-w-content mx-auto px-6 md:px-10 flex items-center justify-center divide-x divide-stone/20">
        {items.map((item) => (
          <div key={item.title} className="flex items-center gap-3 px-5 md:px-8 first:pl-0 last:pr-0">
            <span className="text-gold text-base leading-none">{item.icon}</span>
            <div>
              <p className="font-sans text-xs font-semibold text-linen tracking-wide">{item.title}</p>
              <p className="font-sans text-[10px] text-stone mt-0.5">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
