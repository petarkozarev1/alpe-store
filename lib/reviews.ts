/**
 * DRAFT REVIEWS: placeholders pending owner approval/replacement with real customer reviews before go-live.
 * Do not present these as a counted review total. The only customer-count claim on the site is 1000+.
 */

/** Flip to true only after the owner approves real customer reviews for production. */
export const REVIEWS_APPROVED = false

/** Unapproved quotes stay on preview and local builds. Production must not render them. */
export function reviewsArePublic(env: string | undefined = process.env.VERCEL_ENV): boolean {
  if (REVIEWS_APPROVED) return true
  return env !== 'production'
}

export type ReviewProduct = 'day' | 'evening' | 'both'

export interface DraftReview {
  id: string
  name: string
  city: string
  product: ReviewProduct
  stars: 5
  bg: string
  en: string
}

export const DRAFT_REVIEWS: DraftReview[] = [
  {
    id: 'maria-d',
    name: 'Мария Д.',
    city: 'София',
    product: 'day',
    stars: 5,
    bg: 'Цял ден съм на лаптоп. След седмица с дневния чифт очите не парят към 17:00.',
    en: 'I am on a laptop all day. After a week with the Day pair my eyes no longer burn by 5pm.',
  },
  {
    id: 'ivan-p',
    name: 'Иван П.',
    city: 'Пловдив',
    product: 'evening',
    stars: 5,
    bg: 'Слагам вечерния чифт два часа преди лягане. Заспивам по-бързо, без да скролвам до полунощ.',
    en: 'I put the Evening pair on two hours before bed. I fall asleep faster instead of scrolling until midnight.',
  },
  {
    id: 'nikol-s',
    name: 'Никол С.',
    city: 'Варна',
    product: 'day',
    stars: 5,
    bg: 'Главоболието след дълги срещи намаля. Рамката е лека и не ме притиска.',
    en: 'The headache after long meetings eased off. The frame is light and does not pinch.',
  },
  {
    id: 'georgi-t',
    name: 'Георги Т.',
    city: 'Бургас',
    product: 'evening',
    stars: 5,
    bg: 'Оранжевите стъкла изглеждат силни в началото. След три вечери свикнах и спя по-спокойно.',
    en: 'The orange lenses look strong at first. After three evenings I got used to them and I sleep more calmly.',
  },
  {
    id: 'elena-k',
    name: 'Елена К.',
    city: 'София',
    product: 'day',
    stars: 5,
    bg: 'Жълтият чифт не ми разваля цветовете на екрана. Нося го от сутрин до късен следобед.',
    en: 'The yellow pair does not wreck my screen colours. I wear it from morning until late afternoon.',
  },
  {
    id: 'petya-v',
    name: 'Петя В.',
    city: 'Стара Загора',
    product: 'evening',
    stars: 5,
    bg: 'Гледам сериали в леглото. С вечерния чифт не се въртя толкова преди да заспя.',
    en: 'I watch series in bed. With the Evening pair I do not toss as much before I fall asleep.',
  },
  {
    id: 'desi-r',
    name: 'Десислава Р.',
    city: 'Русе',
    product: 'both',
    stars: 5,
    bg: 'Взех два чифта. Дневният е за офиса, вечерният остава на нощното шкафче.',
    en: 'I bought two pairs. The Day pair stays at the office and the Evening pair stays on the nightstand.',
  },
  {
    id: 'stefan-n',
    name: 'Стефан Н.',
    city: 'Пловдив',
    product: 'day',
    stars: 5,
    bg: 'След осем часа в таблици очите ми тежаха. Сега издържам работния ден без да ги търкам.',
    en: 'After eight hours in spreadsheets my eyes felt heavy. I now get through the workday without rubbing them.',
  },
]

export function reviewProductLabel(product: ReviewProduct, locale: 'bg' | 'en') {
  if (product === 'evening') return locale === 'en' ? 'Evening pair' : 'Вечерен чифт'
  if (product === 'both') return locale === 'en' ? 'Day + Evening' : 'Дневен + вечерен'
  return locale === 'en' ? 'Day pair' : 'Дневен чифт'
}
