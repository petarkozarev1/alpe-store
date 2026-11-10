import { render, screen } from '@testing-library/react'
import { REVIEWS_APPROVED, reviewsArePublic } from '@/lib/reviews'
import { ReviewQuotes, ReviewSection } from '@/components/proof/ReviewQuotes'

const mockGate = { open: true }

jest.mock('@/lib/reviews', () => {
  const actual = jest.requireActual('@/lib/reviews')
  return {
    ...actual,
    reviewsArePublic: () => mockGate.open,
  }
})

describe('draft review guard', () => {
  it('blocks unapproved quotes on production and keeps them on preview', () => {
    const actual = jest.requireActual('@/lib/reviews') as {
      REVIEWS_APPROVED: boolean
      reviewsArePublic: (env?: string) => boolean
    }
    expect(actual.REVIEWS_APPROVED).toBe(false)
    expect(REVIEWS_APPROVED).toBe(false)
    expect(actual.reviewsArePublic('production')).toBe(false)
    expect(actual.reviewsArePublic('preview')).toBe(true)
    expect(actual.reviewsArePublic('development')).toBe(true)
    expect(actual.reviewsArePublic(undefined)).toBe(true)
  })

  it('hides every quote section when the guard is closed', () => {
    mockGate.open = false
    const { rerender } = render(<ReviewSection locale="bg" />)
    expect(screen.queryByText('Какво казват клиентите')).not.toBeInTheDocument()
    expect(screen.queryByText(/Цял ден съм на лаптоп/)).not.toBeInTheDocument()
    rerender(<ReviewQuotes locale="bg" limit={3} />)
    expect(screen.queryByText(/Цял ден съм на лаптоп/)).not.toBeInTheDocument()
  })

  it('shows a DRAFT tag on the review heading outside production', () => {
    mockGate.open = true
    render(<ReviewSection locale="bg" />)
    expect(screen.getByRole('heading', { name: /Какво казват клиентите/ })).toBeInTheDocument()
    expect(screen.getByText('DRAFT')).toBeInTheDocument()
    expect(screen.getByText(/Цял ден съм на лаптоп/)).toBeInTheDocument()
  })
})
