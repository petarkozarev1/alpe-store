import { COMPANY, EMAILS } from '@/lib/brand'

export default function SellerDetails({ locale }: { locale: 'bg' | 'en' }) {
  const en = locale === 'en'
  return (
    <div className="max-w-2xl border border-iron/15 rounded-2xl p-6 mb-12 bg-sand/30">
      <h2 className="font-serif text-xl text-iron mb-3">{en ? 'Seller' : 'Продавач'}</h2>
      <p className="font-sans text-sm text-stone leading-relaxed">
        {en ? COMPANY.legalNameEn : COMPANY.legalNameBg}
        {en ? ` (${COMPANY.legalNameBg})` : ` (${COMPANY.legalNameEn})`}
        {' · '}
        {en ? 'Company ID' : 'ЕИК'} {COMPANY.eik}
      </p>
      <p className="font-sans text-sm text-stone leading-relaxed mt-2">
        {en ? COMPANY.cityLineEn : `${COMPANY.cityLineBg}, ${COMPANY.countryBg}`}
      </p>
      <p className="font-sans text-sm text-stone leading-relaxed mt-2">
        {en ? 'Managers' : 'Управители'}: {(en ? COMPANY.managersEn : COMPANY.managersBg).join(', ')}
      </p>
      <p className="font-sans text-sm text-stone leading-relaxed mt-2">
        <a href={COMPANY.phoneHref} className="text-iron underline underline-offset-4 decoration-gold/50">{COMPANY.phone}</a>
        {' · '}
        <a href={`mailto:${EMAILS.hello}`} className="text-iron underline underline-offset-4 decoration-gold/50">{EMAILS.hello}</a>
      </p>
      <p className="font-sans text-xs text-stone/80 mt-3">
        {en ? 'Prices are final.' : 'Цените са крайни.'}
      </p>
    </div>
  )
}
