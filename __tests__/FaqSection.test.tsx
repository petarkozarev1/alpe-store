import { render, screen, fireEvent } from '@testing-library/react'
import FaqSection from '@/components/landing/FaqSection'

jest.mock('framer-motion', () => {
  const el = (tag: string) => ({ children, ...props }: any) => {
    const Tag = tag as keyof JSX.IntrinsicElements
    return <Tag {...props}>{children}</Tag>
  }
  const motion = Object.assign((C: any) => C, {
    div: el('div'),
    span: el('span'),
    h2: el('h2'),
    button: el('button'),
    blockquote: el('blockquote'),
  })
  return {
    motion,
    AnimatePresence: ({ children }: any) => <>{children}</>,
  }
})

test('FAQ answer is hidden by default', () => {
  render(<FaqSection />)
  expect(screen.queryByText(/Most users notice/)).not.toBeInTheDocument()
})

test('clicking a question reveals the answer', () => {
  render(<FaqSection />)
  fireEvent.click(screen.getByText('How long before I start seeing results?'))
  expect(screen.getByText(/Most users notice/)).toBeInTheDocument()
})

test('clicking open question closes it', () => {
  render(<FaqSection />)
  const question = screen.getByText('How long before I start seeing results?')
  fireEvent.click(question)
  fireEvent.click(question)
  expect(screen.queryByText(/Most users notice/)).not.toBeInTheDocument()
})
