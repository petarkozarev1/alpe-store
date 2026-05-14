import { render, screen, fireEvent } from '@testing-library/react'
import FaqSection from '@/components/landing/FaqSection'
import { faqs } from '@/lib/data/content'

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
  expect(screen.queryByText(faqs[0].answer)).not.toBeInTheDocument()
})

test('clicking a question reveals the answer', () => {
  render(<FaqSection />)
  fireEvent.click(screen.getByText(faqs[0].question))
  expect(screen.getByText(faqs[0].answer)).toBeInTheDocument()
})

test('clicking open question closes it', () => {
  render(<FaqSection />)
  const question = screen.getByText(faqs[0].question)
  fireEvent.click(question)
  fireEvent.click(question)
  expect(screen.queryByText(faqs[0].answer)).not.toBeInTheDocument()
})
