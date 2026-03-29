export function formatCurrency(amount: number, currency = 'VND'): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function formatDate(date: Date | string, format: 'short' | 'long' | 'time' = 'short'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  if (format === 'time') {
    return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  }
  if (format === 'long') {
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' })
  }
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
    + ' ' + d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
}

export function formatAccountNumber(accountNumber: string): string {
  const last4 = accountNumber.slice(-4)
  return `**** **** ${last4}`
}

export function formatTransactionAmount(
  amount: number,
  type: 'deposit' | 'withdrawal' | 'transfer',
  currency = 'VND'
): string {
  const formatted = formatCurrency(Math.abs(amount), currency)
  const sign = type === 'deposit' ? '+' : '-'
  return `${sign}${formatted}`
}
