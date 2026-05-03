import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Контакт | ALPÉ',
  description: 'Свържете се с ALPÉ. Отговаряме в рамките на 24 часа.',
}

const contacts = [
  { label: 'Общи въпроси', email: 'hello@alpe.bg', desc: 'Въпроси за продуктите, поръчки, доставка.' },
  { label: 'Поддръжка', email: 'support@alpe.bg', desc: 'Проблем с поръчка или доставка.' },
  { label: 'Медии', email: 'press@alpe.bg', desc: 'Журналисти и партньорства.' },
  { label: 'Връщане', email: 'returns@alpe.bg', desc: 'Заявка за връщане на продукт.' },
]

export default function ContactPage() {
  return (
    <main className="bg-parchment text-iron min-h-screen">
      <section className="max-w-content mx-auto px-6 md:px-10 pt-32 pb-20">
        <span className="font-sans text-xs uppercase tracking-widest text-stone">Контакт</span>
        <h1 className="font-serif text-4xl md:text-5xl text-iron mt-4 mb-6 leading-tight">
          Пишете ни.
        </h1>
        <p className="font-sans text-base text-stone max-w-xl leading-relaxed mb-16">
          Отговаряме на всеки имейл в рамките на 24 часа в работни дни. Не сме чатбот — пише ви реален човек.
        </p>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl">
          {contacts.map(c => (
            <div key={c.label} className="border border-iron/20 rounded-2xl p-6 flex flex-col gap-3">
              <span className="font-sans text-[10px] uppercase tracking-widest text-stone/60">{c.label}</span>
              <a
                href={`mailto:${c.email}`}
                className="font-serif text-lg text-iron hover:text-gold transition-colors"
              >
                {c.email}
              </a>
              <p className="font-sans text-xs text-stone">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
