import { ReactNode } from 'react'

type BadgeVariant = 'default' | 'accent' | 'success' | 'warning' | 'danger' | 'info'

const styles: Record<BadgeVariant, { bg: string; color: string }> = {
  default:  { bg: 'var(--color-surface-2)',      color: 'var(--color-text-secondary)' },
  accent:   { bg: 'var(--color-accent-light)',    color: 'var(--color-accent)' },
  success:  { bg: 'var(--color-success-light)',   color: 'var(--color-success)' },
  warning:  { bg: 'var(--color-highlight-light)', color: 'var(--color-highlight)' },
  danger:   { bg: 'var(--color-danger-light)',    color: 'var(--color-danger)' },
  info:     { bg: 'var(--color-info-light)',      color: 'var(--color-info)' },
}

export default function Badge({
  children,
  variant = 'default',
}: {
  children: ReactNode
  variant?: BadgeVariant
}) {
  const s = styles[variant]
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
      style={{ backgroundColor: s.bg, color: s.color }}
    >
      {children}
    </span>
  )
}
