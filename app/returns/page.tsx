import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Връщане | ALPÉ',
  description: '10 дена тест. Не ви харесват — връщате ги. Без въпроси.',
}

const steps = [
  { num: '01', title: 'Носете ги поне 10 дена', body: 'Дайте им реален шанс. Системно, поне 10 дена пред екрана. Повечето хора усещат разлика до тогава.' },
  { num: '02', title: 'Пишете ни', body: 'Ако не сте доволни, изпратете имейл на info@alpe.bg. Кажете само номера на поръчката си.' },
  { num: '03', title: 'Изпратете ги обратно', body: 'Поставяте ги в оригиналната кутия и ги изпращате обратно при куриера.' },
  { num: '04', title: 'Получавате парите си', body: 'Пълно възстановяване до 10 работни дни след получаване на пратката.' },
]

export default function ReturnsPage() {
  return (
    <main className="bg-parchment text-iron min-h-screen">
      <section className="max-w-content mx-auto px-6 md:px-10 pt-32 pb-20">
        <span className="font-sans text-xs uppercase tracking-widest text-stone">Политика за връщане</span>
        <h1 className="font-serif text-4xl md:text-5xl text-iron mt-4 mb-6 leading-tight">
          10 дена тест.<br />Не ви харесват? Връщате ги.
        </h1>
        <p className="font-sans text-base text-stone max-w-xl leading-relaxed mb-16">
          Без малък шрифт. Без „само при определени условия&rdquo;. Ако не усетите разлика до 14 дена, получавате парите си обратно.
        </p>

        <div className="flex flex-col gap-10 max-w-2xl mb-16">
          {steps.map(s => (
            <div key={s.num} className="flex gap-6">
              <span className="font-serif text-4xl text-gold/40 leading-none">{s.num}</span>
              <div>
                <h2 className="font-serif text-xl text-iron mb-2">{s.title}</h2>
                <p className="font-sans text-sm text-stone leading-relaxed">{s.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-sand/40 rounded-2xl p-8 max-w-xl">
          <h3 className="font-serif text-xl text-iron mb-2">Имате въпрос за връщане?</h3>
          <p className="font-sans text-sm text-stone mb-4">Пишете ни директно — отговаряме в рамките на 24 часа.</p>
          <a
            href="mailto:info@alpe.bg"
            className="font-sans text-sm text-iron hover:text-gold transition-colors underline underline-offset-4 decoration-gold/50"
          >
            info@alpe.bg
          </a>
        </div>
      </section>
    </main>
  )
}
