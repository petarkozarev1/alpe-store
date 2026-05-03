import type { Metadata } from 'next'
import Link from 'next/link'
import { faqs, faqSectionContent } from '@/lib/data/content'

export const metadata: Metadata = {
  title: 'Въпроси | ALPÉ',
  description: 'Отговори на най-честите въпроси за очилата ALPÉ за синя светлина.',
}

export default function FaqsPage() {
  return (
    <main className="bg-parchment text-iron min-h-screen">
      <section className="max-w-content mx-auto px-6 md:px-10 pt-32 pb-20">
        <span className="font-sans text-xs uppercase tracking-widest text-stone">
          {faqSectionContent.badge}
        </span>
        <h1 className="font-serif text-4xl md:text-5xl text-iron mt-4 mb-12 leading-tight">
          {faqSectionContent.headline}
        </h1>

        <div className="flex flex-col gap-6 max-w-2xl">
          {faqs.map((faq) => (
            <div key={faq.question} className="border-b border-iron/20 pb-6">
              <h2 className="font-serif text-lg text-iron mb-3">{faq.question}</h2>
              <p className="font-sans text-sm text-stone leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <p className="font-sans text-sm text-stone mb-4">Имате друг въпрос?</p>
          <Link
            href="/contact"
            className="inline-block font-sans text-sm bg-onyx text-linen px-8 py-3 rounded-full hover:bg-iron transition-colors"
          >
            Свържете се с нас
          </Link>
        </div>
      </section>
    </main>
  )
}
