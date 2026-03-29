import {
  formatCurrency,
  formatDate,
  formatAccountNumber,
  formatTransactionAmount,
} from './formatting'

describe('formatCurrency', () => {
  it('formats VND amount with dot separators and dong symbol', () => {
    const result = formatCurrency(25000000, 'VND')
    expect(result).toContain('25.000.000')
    expect(result).toContain('₫')
  })

  it('defaults to VND and formats zero', () => {
    const result = formatCurrency(0)
    expect(result).toContain('0')
  })

  it('formats negative amounts', () => {
    const result = formatCurrency(-500000)
    expect(result).toContain('500.000')
  })
})

describe('formatDate', () => {
  it('formats date in short format with day, month, year', () => {
    const result = formatDate(new Date('2026-03-29T10:30:00'), 'short')
    expect(result).toContain('29')
    expect(result).toContain('03')
    expect(result).toContain('2026')
  })

  it('formats time-only output', () => {
    const result = formatDate('2026-03-29T14:30:00', 'time')
    expect(result).toContain('14:30')
  })

  it('formats long date with year', () => {
    const result = formatDate('2026-03-29', 'long')
    expect(result).toContain('2026')
  })

  it('handles string input the same as Date input', () => {
    const dateStr = '2026-03-29T10:30:00'
    const fromString = formatDate(dateStr, 'short')
    const fromDate = formatDate(new Date(dateStr), 'short')
    expect(fromString).toBe(fromDate)
  })
})

describe('formatAccountNumber', () => {
  it('masks all but last 4 digits', () => {
    expect(formatAccountNumber('1234567890')).toBe('**** **** 7890')
  })

  it('masks short account number keeping last 4', () => {
    expect(formatAccountNumber('0001')).toBe('**** **** 0001')
  })
})

describe('formatTransactionAmount', () => {
  it('prefixes deposit with +', () => {
    const result = formatTransactionAmount(1000000, 'deposit')
    expect(result).toMatch(/^\+/)
  })

  it('prefixes withdrawal with -', () => {
    const result = formatTransactionAmount(500000, 'withdrawal')
    expect(result).toMatch(/^-/)
  })

  it('prefixes transfer with -', () => {
    const result = formatTransactionAmount(200000, 'transfer')
    expect(result).toMatch(/^-/)
  })
})
