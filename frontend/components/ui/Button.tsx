'use client'

import { ReactNode } from 'react'
import Link from 'next/link'

type Variant = 'accent' | 'ghost' | 'danger' | 'outline'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps {
  children: ReactNode
  variant?: Variant
  size?: Size
  loading?: boolean
  disabled?: boolean
  fullWidth?: boolean
  href?: string
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
  className?: string
}

const variantStyles: Record<Variant, { bg: string; text: string; border: string; hover: string }> = {
  accent: {
    bg: 'var(--color-accent)',
    text: 'white',
    border: 'transparent',
    hover: 'var(--color-accent-hover)',
  },
  ghost: {
    bg: 'transparent',
    text: 'var(--color-text-secondary)',
    border: 'var(--color-border)',
    hover: 'var(--color-surface-2)',
  },
  danger: {
    bg: 'var(--color-danger)',
    text: 'white',
    border: 'transparent',
    hover: 'var(--color-danger-hover)',
  },
  outline: {
    bg: 'transparent',
    text: 'var(--color-accent)',
    border: 'var(--color-accent)',
    hover: 'var(--color-accent-light)',
  },
}

const sizeStyles: Record<Size, string> = {
  sm: 'px-3.5 py-2 text-sm gap-1.5',
  md: 'px-4 py-2.5 text-sm gap-2',
  lg: 'px-5 py-3 text-base gap-2',
}

export default function Button({
  children,
  variant = 'accent',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  href,
  type = 'button',
  onClick,
  className = '',
}: ButtonProps) {
  const v = variantStyles[variant]
  const s = sizeStyles[size]
  const isDisabled = disabled || loading

  const baseStyle = {
    backgroundColor: v.bg,
    color: v.text,
    border: `1px solid ${v.border}`,
    borderRadius: 'var(--radius-md)',
    fontWeight: 600,
    transition: 'all 0.18s ease',
    opacity: isDisabled ? 0.5 : 1,
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    width: fullWidth ? '100%' : undefined,
  }

  const content = (
    <>
      {loading && (
        <svg className="w-4 h-4 animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </>
  )

  const classes = `inline-flex items-center justify-center font-semibold transition-pos ${s} ${className}`

  if (href && !isDisabled) {
    return (
      <Link href={href} className={classes} style={baseStyle}>
        {content}
      </Link>
    )
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={classes}
      style={baseStyle}
      onMouseEnter={e => {
        if (!isDisabled) (e.currentTarget as HTMLButtonElement).style.backgroundColor = v.hover
      }}
      onMouseLeave={e => {
        if (!isDisabled) (e.currentTarget as HTMLButtonElement).style.backgroundColor = v.bg
      }}
    >
      {content}
    </button>
  )
}
