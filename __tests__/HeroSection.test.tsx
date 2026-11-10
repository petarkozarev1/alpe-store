import { render, screen } from '@testing-library/react'
import { statSync } from 'node:fs'
import path from 'node:path'
import HeroSection from '@/components/landing/HeroSection'

jest.mock('framer-motion', () => ({
  motion: {
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

jest.mock('@/components/ui/Button', () => function MockButton({ label }: { label: string }) {
  return <button>{label}</button>
})

test('uses the new lightweight-loading hero preview and respects reduced motion', () => {
  const { container } = render(<HeroSection />)
  const video = container.querySelector('video')

  expect(video).toHaveAttribute('src', '/videos/alpe-hero-web.mp4')
  expect(video).toHaveAttribute('preload', 'metadata')
  expect(video).toHaveClass('motion-reduce:hidden')
  expect(video).toHaveClass('absolute', 'inset-0', 'object-cover')
  expect(video).toHaveClass('object-[68%_center]', 'md:object-center')
  expect(video).not.toHaveClass('object-contain')
  expect(container.querySelector('[data-testid="hero-content"]')).toHaveClass(
    'min-h-[calc(100svh-97px)]',
  )
  expect(container.querySelectorAll('video')).toHaveLength(1)
  expect(statSync(path.join(process.cwd(), 'public/videos/alpe-hero-web.mp4')).size).toBeLessThan(2 * 1024 * 1024)
})

test('does not show a standalone ALPE label over the hero video', () => {
  render(<HeroSection />)

  expect(screen.queryByText(/^ALPE$/)).not.toBeInTheDocument()
})
