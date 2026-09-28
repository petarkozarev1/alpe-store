'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { CheckoutElementsProvider, PaymentElement, useCheckoutElements } from '@stripe/react-stripe-js/checkout'
import { useLocale, useTranslations } from '@/components/i18n/LocaleProvider'
import { localizeContent } from '@/components/i18n/LocalizedContent'
import { localizeCartVariantLabel } from '@/lib/i18n/cart'
import { useCartStore } from '@/lib/store/cartStore'
import { setPixelUser } from '@/components/analytics/MetaPixel'
import { getStripeClient } from '@/lib/stripe-client'
import { countPairs, priceForPairs, naiveSubtotal } from '@/lib/pricing'
import { getPromo, promoDiscount } from '@/lib/promo'

/* ── constants ─────────────────────────────────────── */
const DELIVERY_PRICE = 4.99
const COD_FEE = 1.0
const BGN_RATE = 1.95583

const DELIVERY = [
  { id: 'speedy',  label: 'Спиди',    badge: 'ПРЕПОРЪЧАНО', requiresOffice: true,  officePlaceholder: 'напр. Спиди офис Сердика, бул. Сливница 2, София',       officeLink: 'https://www.speedy.bg/bg/office-search', availableOnCod: true },
  { id: 'econt',   label: 'Еконт',    badge: null,          requiresOffice: true,  officePlaceholder: 'напр. Еконт Сердика, бул. Сливница 2, София',           officeLink: 'https://www.econt.com/services/offices.html', availableOnCod: true },
  { id: 'boxnow',  label: 'BoxNow',   badge: null,          requiresOffice: true,  officePlaceholder: 'напр. BoxNow Mall of Sofia, бул. Климент Охридски',     officeLink: 'https://boxnow.bg/lockers', availableOnCod: false },
  { id: 'pigeon',  label: 'Pigeon Express', badge: null,      requiresOffice: true,  officePlaceholder: 'напр. Pigeon Express локер НДК, пл. България 1, София', officeLink: 'https://pigeonexpress.com', availableOnCod: true },
]

const COD_PREFERRED_COURIER = 'pigeon'
