import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Общи условия | ALPÉ',
  description: 'Общи условия за ползване на ALPÉ. Поръчки, доставка и връщане.',
}

export default function TermsPage() {
  return (
    <main className="bg-parchment text-iron min-h-screen">
      <section className="max-w-content mx-auto px-6 md:px-10 pt-32 pb-20">
        <span className="font-sans text-xs uppercase tracking-widest text-stone">Правна информация</span>
        <h1 className="font-serif text-4xl md:text-5xl text-iron mt-4 mb-6 leading-tight">
          Общи условия
        </h1>
        <p className="font-sans text-xs text-stone/60 mb-12">Последна актуализация: май 2026</p>

        <div className="max-w-2xl flex flex-col gap-10 font-sans text-sm text-stone leading-relaxed">
          <section>
            <h2 className="font-serif text-xl text-iron mb-3">1. Поръчки</h2>
            <p>Поръчките се считат за потвърдени след получаване на имейл от наша страна. Запазваме правото да откажем поръчка при изчерпана наличност или техническа грешка в цената.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-iron mb-3">2. Цени и плащане</h2>
            <p>Всички цени са в евро и включват ДДС. Плащанията се приемат чрез карта (Visa, Mastercard) и PayPal. Данните ви са защитени от Stripe — ние нямаме достъп до данните на картата ви.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-iron mb-3">3. Доставка</h2>
            <p>Доставяме в рамките на 3-5 работни дни в България. Безплатна доставка за поръчки над €50. За поръчки под €50 — такса от €4.99.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-iron mb-3">4. Връщане и замяна</h2>
            <p>Предлагаме 7-нощна гаранция за пробване. Ако не сте доволни, можете да върнете продукта в рамките на 7 дни от получаване. Продуктът трябва да е в оригинална опаковка и без видими повреди. Разходите за обратна доставка са за наша сметка.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-iron mb-3">5. Гаранция</h2>
            <p>Всички продукти ALPÉ имат 12-месечна гаранция срещу производствени дефекти. Гаранцията не покрива нормално износване или механични повреди.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-iron mb-3">6. Отговорност</h2>
            <p>Очилата ALPÉ са сертифицирани аксесоари за намаляване на излагането на синя светлина. Не са медицинско изделие и не заместват медицинска консултация.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-iron mb-3">7. Контакт</h2>
            <p>За въпроси: <a href="mailto:hello@alpe.bg" className="text-iron hover:text-gold transition-colors underline underline-offset-4 decoration-gold/50">hello@alpe.bg</a></p>
          </section>
        </div>
      </section>
    </main>
  )
}
