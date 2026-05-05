import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Политика за поверителност | ALPÉ',
  description: 'Как ALPÉ обработва вашите лични данни. GDPR съответствие.',
}

export default function PrivacyPage() {
  return (
    <main className="bg-parchment text-iron min-h-screen">
      <section className="max-w-content mx-auto px-6 md:px-10 pt-32 pb-20">
        <span className="font-sans text-xs uppercase tracking-widest text-stone">Правна информация</span>
        <h1 className="font-serif text-4xl md:text-5xl text-iron mt-4 mb-6 leading-tight">
          Политика за поверителност
        </h1>
        <p className="font-sans text-xs text-stone/60 mb-12">Последна актуализация: май 2026</p>

        <div className="max-w-2xl flex flex-col gap-10 font-sans text-sm text-stone leading-relaxed">
          <section>
            <h2 className="font-serif text-xl text-iron mb-3">Какви данни събираме</h2>
            <p>При поръчка събираме: имена, адрес за доставка, имейл адрес и телефон. Не събираме банкови данни — плащанията се обработват от Stripe, който работи под EU стандарти.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-iron mb-3">Как използваме данните</h2>
            <p>Данните ви се използват единствено за обработка на поръчката и доставка. Не продаваме данните ви на трети страни. Имейл адресът може да бъде използван за изпращане на информация за поръчката и, с ваше съгласие, за маркетингови съобщения.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-iron mb-3">Бисквитки</h2>
            <p>Използваме минимален набор от бисквитки за функционирането на сайта (кошница, сесия). Не използваме tracking бисквитки на трети страни без ваше съгласие.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-iron mb-3">Вашите права (GDPR)</h2>
            <p>Имате право да поискате достъп, коригиране или изтриване на личните си данни. Изпратете заявка на <a href="mailto:hello@alpe.bg" className="text-iron hover:text-gold transition-colors underline underline-offset-4 decoration-gold/50">hello@alpe.bg</a> и ще отговорим в рамките на 30 дни.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-iron mb-3">Съхранение на данни</h2>
            <p>Данните за поръчки се пазят за срок от 5 години съгласно българското счетоводно законодателство. След този срок данните се изтриват.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-iron mb-3">Контакт</h2>
            <p>За въпроси относно поверителността: <a href="mailto:hello@alpe.bg" className="text-iron hover:text-gold transition-colors underline underline-offset-4 decoration-gold/50">hello@alpe.bg</a></p>
          </section>
        </div>
      </section>
    </main>
  )
}
