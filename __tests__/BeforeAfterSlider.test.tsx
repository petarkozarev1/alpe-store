import { render, screen } from '@testing-library/react'
import BeforeAfterSlider from '@/components/landing/BeforeAfterSlider'

test('renders Before and After labels', () => {
  render(
    <BeforeAfterSlider
      beforeImage="/before.jpg"
      afterImage="/after.jpg"
      beforeLabel="Before"
      afterLabel="After"
    />
  )
  expect(screen.getByText('Before')).toBeInTheDocument()
  expect(screen.getByText('After')).toBeInTheDocument()
})
