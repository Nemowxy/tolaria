import '@testing-library/jest-dom/vitest'
import { afterEach, vi } from 'vitest'
import { createElement, type ReactNode, type ComponentType } from 'react'

// Mock react-i18next to return English translations
vi.mock('react-i18next', async () => {
  const actual = await vi.importActual('react-i18next')
  const enTranslations = await import('../../locales/en/translation.json')

  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string, params?: Record<string, unknown>) => {
        const keys = key.split('.')
        let value: unknown = enTranslations.default

        // Navigate to the parent object
        for (let i = 0; i < keys.length - 1; i++) {
          if (value && typeof value === 'object' && keys[i] in value) {
            value = (value as Record<string, unknown>)[keys[i]]
          } else {
            return key
          }
        }

        const lastKey = keys[keys.length - 1]

        // Handle pluralization: check for _one/_other suffixes
        if (value && typeof value === 'object' && params && 'count' in params) {
          const count = params.count as number
          const pluralSuffix = count === 1 ? '_one' : '_other'
          const pluralKey = `${lastKey}${pluralSuffix}`

          if (pluralKey in value) {
            const pluralValue = (value as Record<string, unknown>)[pluralKey]
            if (typeof pluralValue === 'string') {
              // Handle interpolation
              return Object.entries(params).reduce(
                (str, [paramKey, paramValue]) =>
                  str.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(paramValue)),
                pluralValue
              )
            }
          }
        }

        // Get the final value
        if (value && typeof value === 'object' && lastKey in value) {
          value = (value as Record<string, unknown>)[lastKey]
        } else {
          return key
        }

        // Handle interpolation
        if (typeof value === 'string' && params) {
          return Object.entries(params).reduce(
            (str, [paramKey, paramValue]) =>
              str.replace(new RegExp(`{{${paramKey}}}`, 'g'), String(paramValue)),
            value
          )
        }

        return typeof value === 'string' ? value : key
      },
      i18n: {
        language: 'en',
        changeLanguage: vi.fn(),
      },
    }),
    Trans: ({ i18nKey, values, components, children }: {
      i18nKey?: string
      values?: Record<string, unknown>
      components?: Record<string, ReactNode>
      children?: ReactNode
    }) => {
      if (!i18nKey) return children

      const keys = i18nKey.split('.')
      let value: unknown = enTranslations.default

      // Navigate to the translation value
      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = (value as Record<string, unknown>)[k]
        } else {
          return i18nKey
        }
      }

      if (typeof value !== 'string') return i18nKey

      // Handle interpolation with components (e.g., <strong>{{name}}</strong>)
      let result: ReactNode = value
      if (values) {
        result = Object.entries(values).reduce(
          (str, [key, val]) => {
            if (typeof str !== 'string') return str
            return str.replace(new RegExp(`{{${key}}}`, 'g'), String(val))
          },
          result as string
        )
      }

      // Handle component interpolation (e.g., <strong>text</strong>)
      if (components && typeof result === 'string') {
        const parts: ReactNode[] = []
        const remaining = result
        let key = 0

        // Simple regex to match <tag>content</tag>
        const tagRegex = /<(\w+)>(.*?)<\/\1>/g
        let lastIndex = 0
        let match: RegExpExecArray | null

        while ((match = tagRegex.exec(result)) !== null) {
          // Add text before the tag
          if (match.index > lastIndex) {
            parts.push(remaining.slice(lastIndex, match.index))
          }

          const [, tagName, content] = match
          const component = components[tagName]

          if (component && typeof component === 'object' && 'type' in component) {
            // Clone the component with the content as children
            parts.push(createElement((component as { type: ComponentType }).type, { key: key++ }, content))
          } else {
            parts.push(content)
          }

          lastIndex = match.index + match[0].length
        }

        // Add remaining text
        if (lastIndex < result.length) {
          parts.push(result.slice(lastIndex))
        }

        return parts.length > 0 ? createElement('span', null, ...parts) : result
      }

      return result
    },
  }
})

// Stub fetch to prevent jsdom@28 + Node 22 undici incompatibility.
// jsdom's JSDOMDispatcher passes an onError handler that Node 22's bundled
// undici rejects with InvalidArgumentError (UND_ERR_INVALID_ARG).
// Tests should never make real network requests — individual tests can
// override this stub via vi.mocked(fetch).mockImplementation(...).
globalThis.fetch = vi.fn(() =>
  Promise.resolve(new Response(null, { status: 418 })),
) as typeof globalThis.fetch

// Stub WebSocket to prevent Node 22 + undici WebSocket incompatibility.
// undici's WebSocket dispatchEvent crashes with "The event argument must be
// an instance of Event" when running in jsdom environment.
// Tests should never open real WebSocket connections.
globalThis.WebSocket = class MockWebSocket {
  static CONNECTING = 0
  static OPEN = 1
  static CLOSING = 2
  static CLOSED = 3
  readyState = MockWebSocket.OPEN
  onopen: ((event: Event) => void) | null = null
  onclose: ((event: CloseEvent) => void) | null = null
  onmessage: ((event: MessageEvent) => void) | null = null
  onerror: ((event: Event) => void) | null = null
  constructor(/* url: string, protocols?: string | string[] */) {
    // No-op: don't open real connections in tests
  }
  send(/* data: unknown */) {}
  close() { this.readyState = MockWebSocket.CLOSED }
  addEventListener() {}
  removeEventListener() {}
  dispatchEvent() { return true }
} as unknown as typeof WebSocket

// Mock scrollIntoView for jsdom (not implemented)
Element.prototype.scrollIntoView = vi.fn()

// Mock ResizeObserver for jsdom (not implemented)
globalThis.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
} as unknown as typeof ResizeObserver

// Mock IntersectionObserver for jsdom (not implemented)
globalThis.IntersectionObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
} as unknown as typeof IntersectionObserver

// Mock @tauri-apps/plugin-opener for test environment
vi.mock('@tauri-apps/plugin-opener', () => ({
  openUrl: vi.fn(),
}))

afterEach(() => {
  vi.clearAllTimers()
  vi.useRealTimers()
})

// Mock react-day-picker: Calendar component uses DayPicker which needs real DOM APIs not available in jsdom
vi.mock('react-day-picker', () => ({
  DayPicker: () => null,
  getDefaultClassNames: () => ({}),
}))

function getVirtualizedIndexes(length: number): number[] {
  if (length <= 200) return Array.from({ length }, (_, index) => index)

  const edgeSize = 50
  return [
    ...Array.from({ length: edgeSize }, (_, index) => index),
    ...Array.from({ length: edgeSize }, (_, index) => length - edgeSize + index),
  ]
}

// Mock react-virtuoso: JSDOM has no real viewport, so render a representative window for large lists.
vi.mock('react-virtuoso', () => ({
  Virtuoso: ({ data, itemContent, components }: {
    data?: unknown[]
    itemContent?: (index: number, item: unknown) => ReactNode
    components?: { Header?: ComponentType }
  }) => {
    const Header = components?.Header
    const resolvedData = data ?? []
    const renderedIndexes = getVirtualizedIndexes(resolvedData.length)
    return createElement('div', { 'data-testid': 'virtuoso-mock' },
      Header ? createElement(Header) : null,
      renderedIndexes.map((index) =>
        createElement('div', { key: index }, itemContent?.(index, resolvedData[index]))
      )
    )
  },
  GroupedVirtuoso: ({ groupCounts, groupContent, itemContent }: {
    groupCounts: number[]
    groupContent: (index: number) => ReactNode
    itemContent: (index: number, groupIndex: number) => ReactNode
  }) => {
    let globalIndex = 0
    return createElement('div', { 'data-testid': 'grouped-virtuoso-mock' },
      groupCounts?.map((count: number, groupIndex: number) => {
        const items = []
        for (let i = 0; i < count; i++) {
          items.push(createElement('div', { key: globalIndex }, itemContent(globalIndex, groupIndex)))
          globalIndex++
        }
        return createElement('div', { key: `group-${groupIndex}` },
          groupContent(groupIndex),
          ...items
        )
      })
    )
  },
}))
