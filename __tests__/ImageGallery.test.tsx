import { fireEvent, render, screen } from '@testing-library/react'
import ImageGallery from '@/components/product/ImageGallery'

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ fill: _fill, priority: _priority, ...props }: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; priority?: boolean }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} />
  ),
}))

test('renders uncropped 4:3 thumbnails and updates the active image', () => {
  render(<ImageGallery images={['/one.png', '/two.png', '/three.png']} alt="ALPÉ Daily" />)

  const first = screen.getByRole('button', { name: 'View image 1' })
  const second = screen.getByRole('button', { name: 'View image 2' })
  const secondImage = screen.getByAltText('ALPÉ Daily 2')

  expect(first).toHaveClass('aspect-[4/3]')
  expect(first).toHaveAttribute('aria-pressed', 'true')
  expect(secondImage).toHaveClass('object-contain')

  fireEvent.click(second)

  expect(first).toHaveAttribute('aria-pressed', 'false')
  expect(second).toHaveAttribute('aria-pressed', 'true')
  expect(screen.getByAltText('ALPÉ Daily')).toHaveAttribute('src', '/two.png')
})
