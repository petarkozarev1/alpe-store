import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Връщане | ALPÉ',
  description: '7 нощи проба. Не ти харесва — връщаш ги. Без въпроси. Процесът е лесен.',
}

const steps = [
  { num: '01', title: 'Носи ги 7 нощи', body: 'Дай им истински шанс — поне 7 вечери пред екрана. Повечето хора усещат разлика до тогава.' },
  { num: '02', title: 'Пиши ни', body: 'Ако не си доволен, изпрати имейл на returns@alpe.bg. Казваш само поръчката си — без обяснения.' },
  { num: '03', title: 'Изпрати ги обратно', body: 'Ние покриваме разходите за обратна доставка. Поставяш ги в оригиналната кутия и ги пускаш по поща.' },
  { num: '04', title: 'Получаваш парите си', body: 'Пълно възстановяване в рамките на 5 работни дни след получаване на пратката.' },
]

export default function ReturnsPage() {
  return (
    <main className="bg-parchment text-iron min-h-screen">
      <section className="max-w-content mx-auto px-6 md:px-10 pt-32 pb-20">
        <span className="font-sans text-xs uppercase tracking-widest text-stone">Политика за връщане</span>
        <h1 className="font-serif text-4xl md:text-5xl text-iron mt-4 mb-6 leading-tight">
          7 нощи проба.<br />Не ти харесва — връщаш ги.
        </h1>
        <p className="font-sans text-base text-stone max-w-xl leading-relaxed mb-16">
          Без малък шрифт. Без „само при определени условия&rdquo;. Ако не усетиш разлика след 7 нощи, получаваш парите си обратно.
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
            href="mailto:returns@alpe.bg"
            className="font-sans text-sm text-iron hover:text-gold transition-colors underline underline-offset-4 decoration-gold/50"
          >
            returns@alpe.bg
          </a>
        </div>
      </section>
    </main>
  )
}
