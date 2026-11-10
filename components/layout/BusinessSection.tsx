import { businessOrderMailto, EMAILS } from '@/lib/brand'

export default function BusinessSection({ locale }: { locale: 'bg' | 'en' }) {
  const en = locale === 'en'
  return (
    <section id="business" className="w-full bg-parchment py-20 border-t border-iron/10">
      <div className="max-w-content mx-auto px-6 text-center md:px-10">
        <span className="font-sans text-xs uppercase tracking-widest text-stone">
          {en ? 'For businesses' : 'За бизнеса'}
        </span>
        <h2 className="font-serif text-3xl md:text-4xl text-iron mt-3 mb-4 leading-tight">
          {en ? 'Custom and bulk orders' : 'Индивидуални и групови поръчки'}
        </h2>
        <p className="font-sans text-sm text-stone max-w-xl mx-auto leading-relaxed mb-6">
          {en
            ? 'Equipping an office, a team, or a client gift? Email us for a custom quote and special prices on larger orders.'
            : 'Обзавеждате офис, екип или подаръци за клиенти? Пишете ни за индивидуална оферта и специални цени при по-големи количества.'}
        </p>
        <a
          href={businessOrderMailto(locale)}
          className="inline-block font-sans text-sm font-semibold bg-onyx text-linen px-6 py-3 rounded-full hover:bg-iron transition-colors"
        >
          {en ? `Email ${EMAILS.hello}` : `Пишете на ${EMAILS.hello}`}
        </a>
      </div>
    </section>
  )
}
