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
            <p>Доставяме в рамките на 1–3 работни дни в България. Безплатна доставка за поръчки над €50. За поръчки под €50 — такса от €4.99.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-iron mb-3">4. Връщане и замяна</h2>
            <p>Имате право да се откажете от договора в срок от <strong>14 календарни дни</strong> от получаване на продукта, без да посочвате причина — съгласно чл. 50 от Закона за защита на потребителите и Директива 2011/83/ЕС. За упражняване на правото на отказ се свържете с нас на hello@alpewear.com с номера на поръчката си. Продуктът трябва да е в оригинална опаковка и без видими повреди. Разходите за обратна доставка са за наша сметка.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-iron mb-3">5. Гаранция</h2>
            <p>Всички продукти ALPÉ имат <strong>24-месечна законова гаранция</strong> срещу производствени дефекти — съгласно чл. 112–114 от Закона за защита на потребителите и Директива 2019/771/ЕС. Гаранцията не покрива нормално износване или механични повреди причинени от потребителя.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-iron mb-3">6. Отговорност</h2>
            <p>Очилата ALPÉ са сертифицирани аксесоари за намаляване на излагането на синя светлина. Не са медицинско изделие и не заместват медицинска консултация.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-iron mb-3">7. Онлайн решаване на спорове</h2>
            <p>Съгласно Регламент (ЕС) № 524/2013, потребителите имат право да подават жалби чрез платформата за онлайн решаване на спорове на Европейската комисия: <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-iron hover:text-gold transition-colors underline underline-offset-4 decoration-gold/50">ec.europa.eu/consumers/odr</a>. Нашият имейл за целите на тази процедура: <a href="mailto:hello@alpewear.com" className="text-iron hover:text-gold transition-colors underline underline-offset-4 decoration-gold/50">hello@alpewear.com</a></p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-iron mb-3">8. Приложимо право</h2>
            <p>Тези общи условия се уреждат от българското право. Всички спорове се отнасят до компетентния български съд. Като потребител в ЕС вие запазвате всички права, предоставени от законодателството на вашата страна.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-iron mb-3">9. Контакт</h2>
            <p>За въпроси: <a href="mailto:hello@alpewear.com" className="text-iron hover:text-gold transition-colors underline underline-offset-4 decoration-gold/50">hello@alpewear.com</a></p>
          </section>
        </div>
      </section>
    </main>
  )
}
