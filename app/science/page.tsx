import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Науката | ALPÉ',
  description: 'Как синята светлина влияе на очите и съня. Научните факти зад ALPÉ.',
}

const facts = [
  {
    title: 'Синята светлина блокира мелатонина',
    body: 'Мелатонинът е хормонът, който казва на тялото ти "лягай си". Синята светлина от екраните го потиска с до 50% — дори след 20 минути гледане вечерта. Резултатът: лежиш в леглото, но мозъкът ти е буден.',
  },
  {
    title: 'Очите не са направени за екрани',
    body: 'Когато гледаш екран, мигаш 3 пъти по-малко от нормалното. Това изсушава очите и причинява умора. Лещите с антирефлексно покритие намаляват тоя стрес значително.',
  },
  {
    title: 'EU сертификацията е строга',
    body: 'EU стандартите за оптични филтри (EN ISO 12312) изискват независими лабораторни тестове. Не е достатъчно да напишеш "блокира синя светлина" на кутията — трябва да го докажеш. Лещите на ALPÉ са преминали тези тестове.',
  },
  {
    title: '7 нощи са достатъчни',
    body: 'Повечето хора усещат разлика в умората на очите още след 3-4 дни. Качеството на съня се подобрява след около седмица.',
  },
]

export default function SciencePage() {
  return (
    <main className="bg-parchment text-iron min-h-screen">
      <section className="max-w-content mx-auto px-6 md:px-10 pt-32 pb-20">
        <span className="font-sans text-xs uppercase tracking-widest text-stone">Науката зад ALPÉ</span>
        <h1 className="font-serif text-4xl md:text-5xl text-iron mt-4 mb-6 leading-tight">
          Не е магия.<br />Просто физика.
        </h1>
        <p className="font-sans text-base text-stone max-w-xl leading-relaxed mb-16">
          Синята светлина е реална. Умората е реална. Решението е просто — ако знаеш как работи.
        </p>

        <div className="flex flex-col gap-10 max-w-2xl">
          {facts.map((f, i) => (
            <div key={f.title} className="flex gap-6">
              <span className="font-serif text-4xl text-gold/40 leading-none mt-1">{i + 1}</span>
              <div>
                <h2 className="font-serif text-xl text-iron mb-2">{f.title}</h2>
                <p className="font-sans text-sm text-stone leading-relaxed">{f.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <Link
            href="/#products"
            className="inline-block font-sans text-sm bg-onyx text-linen px-8 py-3 rounded-full hover:bg-iron transition-colors"
          >
            Вземи си чифт →
          </Link>
        </div>
      </section>
    </main>
  )
}
