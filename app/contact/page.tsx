import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Контакт | ALPÉ',
  description: 'Свържете се с ALPÉ. Отговаряме в рамките на 24 часа.',
}

export default function ContactPage() {
  return (
    <main className="bg-parchment text-iron min-h-screen">
      <section className="max-w-content mx-auto px-6 md:px-10 pt-32 pb-20">
        <span className="font-sans text-xs uppercase tracking-widest text-stone">Контакт</span>
        <h1 className="font-serif text-4xl md:text-5xl text-iron mt-4 mb-6 leading-tight">
          Пишете ни.
        </h1>
        <p className="font-sans text-base text-stone max-w-xl leading-relaxed mb-16">
          Отговаряме на всеки имейл в рамките на 24 часа в работни дни.
        </p>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl">
          {/* Общи въпроси */}
          <div className="border border-iron/20 rounded-2xl p-6 flex flex-col gap-3">
            <span className="font-sans text-[10px] uppercase tracking-widest text-stone/60">Общи въпроси</span>
            <a href="mailto:hello@alpe.bg" className="font-serif text-lg text-iron hover:text-gold transition-colors">
              hello@alpe.bg
            </a>
            <p className="font-sans text-xs text-stone">Въпроси за продуктите, поръчки, доставка.</p>
          </div>

          {/* Поддръжка */}
          <div className="border border-iron/20 rounded-2xl p-6 flex flex-col gap-3">
            <span className="font-sans text-[10px] uppercase tracking-widest text-stone/60">Поддръжка</span>
            <a href="mailto:support@alpe.bg" className="font-serif text-lg text-iron hover:text-gold transition-colors">
              support@alpe.bg
            </a>
            <p className="font-sans text-xs text-stone">Проблем с поръчка или доставка.</p>
          </div>

          {/* Социални мрежи */}
          <div className="border border-iron/20 rounded-2xl p-6 flex flex-col gap-3">
            <span className="font-sans text-[10px] uppercase tracking-widest text-stone/60">Социални мрежи</span>
            <div className="flex flex-col gap-2">
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-serif text-lg text-iron hover:text-gold transition-colors flex items-center gap-2"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
                </svg>
                Instagram
              </a>
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-serif text-lg text-iron hover:text-gold transition-colors flex items-center gap-2"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                </svg>
                Facebook
              </a>
            </div>
          </div>

          {/* Връщане */}
          <div className="border border-iron/20 rounded-2xl p-6 flex flex-col gap-3">
            <span className="font-sans text-[10px] uppercase tracking-widest text-stone/60">Връщане</span>
            <a href="mailto:returns@alpe.bg" className="font-serif text-lg text-iron hover:text-gold transition-colors">
              returns@alpe.bg
            </a>
            <p className="font-sans text-xs text-stone">Заявка за връщане на продукт.</p>
          </div>
        </div>
      </section>
    </main>
  )
}
