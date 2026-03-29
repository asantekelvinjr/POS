/**
 * Format a number as Ghana cedis
 */
export function formatGHS(amount: number): string {
  return `GHS ${amount.toLocaleString('en-GH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

/**
 * Format a date string for Ghanaian locale
 */
export function formatDate(dateString: string, options?: Intl.DateTimeFormatOptions): string {
  return new Date(dateString).toLocaleDateString('en-GH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  })
}

/**
 * Format date + time
 */
export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('en-GH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Generate a transaction code
 */
export function generateTransactionCode(): string {
  const date = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  const datePart = `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`
  const rand = Math.floor(Math.random() * 9000) + 1000
  return `TXN-${datePart}-${rand}`
}

/**
 * Truncate a string to n characters
 */
export function truncate(str: string, n: number): string {
  return str.length > n ? `${str.slice(0, n)}…` : str
}

/**
 * Calculate percentage change
 */
export function percentChange(current: number, previous: number): number {
  if (previous === 0) return 0
  return ((current - previous) / previous) * 100
}

/**
 * Debounce a function call
 */
export function debounce<T extends (...args: unknown[]) => void>(fn: T, ms: number): T {
  let timer: ReturnType<typeof setTimeout>
  return ((...args: unknown[]) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), ms)
  }) as T
}

/**
 * Ghana phone number validation (0XX XXXXXXX)
 */
export function isValidGhanaPhone(phone: string): boolean {
  return /^0[2345][0-9]{8}$/.test(phone.replace(/\s/g, ''))
}

/**
 * Compute VAT for Ghana (15%)
 */
export function computeVAT(amount: number): { subtotal: number; vat: number; total: number } {
  const vat = amount * 0.15
  return { subtotal: amount, vat, total: amount + vat }
}
