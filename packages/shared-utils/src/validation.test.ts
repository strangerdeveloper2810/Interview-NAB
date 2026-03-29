import { isValidEmail, isValidPassword } from './validation'

describe('isValidEmail', () => {
  it('accepts standard email', () => {
    expect(isValidEmail('user@example.com')).toBe(true)
  })

  it('accepts email with plus tag and subdomain', () => {
    expect(isValidEmail('user+tag@sub.domain.com')).toBe(true)
  })

  it('rejects empty string', () => {
    expect(isValidEmail('')).toBe(false)
  })

  it('rejects string without @', () => {
    expect(isValidEmail('not-an-email')).toBe(false)
  })

  it('rejects missing local part', () => {
    expect(isValidEmail('@example.com')).toBe(false)
  })

  it('rejects missing domain', () => {
    expect(isValidEmail('user@')).toBe(false)
  })

  it('rejects email with spaces', () => {
    expect(isValidEmail('user @example.com')).toBe(false)
  })

  it('trims whitespace before validating', () => {
    expect(isValidEmail(' user@example.com ')).toBe(true)
  })
})

describe('isValidPassword', () => {
  it('accepts password with 8+ chars, uppercase, and number', () => {
    expect(isValidPassword('Password1')).toBe(true)
  })

  it('rejects password shorter than 8 characters', () => {
    expect(isValidPassword('short1A')).toBe(false)
  })

  it('rejects password without uppercase letter', () => {
    expect(isValidPassword('password1')).toBe(false)
  })

  it('rejects password without number', () => {
    expect(isValidPassword('Password')).toBe(false)
  })

  it('rejects empty string', () => {
    expect(isValidPassword('')).toBe(false)
  })
})
