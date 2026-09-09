import { Children, cloneElement, isValidElement } from 'react'
import type { Locale } from '@/lib/i18n/config'
import { translate } from '@/lib/i18n/translations'
import { localizedPath } from '@/lib/i18n/routing'

const translatableProps = ['aria-label', 'alt', 'placeholder', 'title'] as const

/** Localizes server-rendered copy while preserving the original component structure. */
export function localizeContent(locale: Locale, node: React.ReactNode): React.ReactNode {
  if (locale === 'bg') return node
  if (typeof node === 'string') return localizeText(locale, node)
  if (Array.isArray(node)) return node.map(child => localizeContent(locale, child))
  if (!isValidElement<Record<string, unknown>>(node)) return node

  const props: Record<string, unknown> = {}
  for (const name of translatableProps) {
    if (typeof node.props[name] === 'string') props[name] = translate(locale, node.props[name] as string)
  }
  if (typeof node.props.href === 'string' && node.props.href.startsWith('/')) {
    props.href = localizedPath(node.props.href, locale)
  }
  if ('children' in node.props) {
    props.children = Children.map(node.props.children as React.ReactNode, child => localizeContent(locale, child))
  }
  return cloneElement(node, props)
}

function localizeText(locale: Locale, source: string) {
  const leading = source.match(/^\s*/)?.[0] ?? ''
  const trailing = source.match(/\s*$/)?.[0] ?? ''
  const value = source.trim()
  return value ? `${leading}${translate(locale, value)}${trailing}` : source
}
