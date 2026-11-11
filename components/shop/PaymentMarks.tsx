const marks = [
  { src: '/images/payments/visa.svg', alt: 'Visa', width: 46 },
  { src: '/images/payments/mastercard.svg', alt: 'Mastercard', width: 24 },
  { src: '/images/payments/apple-pay.svg', alt: 'Apple Pay', width: 36 },
  { src: '/images/payments/google-pay.svg', alt: 'Google Pay', width: 50 },
  { src: '/images/payments/revolut-pay.svg', alt: 'Revolut Pay', width: 52 },
] as const

export function PaymentMarks() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, margin: '14px 0 0', flexWrap: 'wrap' }}>
      {marks.map(mark => (
        <span
          key={mark.alt}
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: 28, padding: '0 8px', border: '1px solid rgba(28,15,10,0.12)', borderRadius: 6, background: '#fff8f2' }}
        >
          <img src={mark.src} alt={mark.alt} width={mark.width} height={15} style={{ display: 'block', height: 15, width: 'auto' }} />
        </span>
      ))}
    </div>
  )
}
