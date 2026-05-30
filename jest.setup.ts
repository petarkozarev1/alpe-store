import '@testing-library/jest-dom'

// Polyfill TextEncoder/TextDecoder for packages (e.g. postal-mime via resend) that
// use the Web Encoding API, which jsdom does not expose in older Jest setups.
if (typeof globalThis.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util')
  globalThis.TextEncoder = TextEncoder
  globalThis.TextDecoder = TextDecoder
}
