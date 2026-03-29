'use client'

const summaryCards = [
  {
    label: 'Cash Sales',
    value: 'GHS 2,140.00',
    sub: '44% of revenue',
    icon: '💵',
    color: 'var(--color-success)',
    bg: 'var(--color-success-light)',
  },
  {
    label: 'Mobile Money',
    value: 'GHS 1,820.50',
    sub: '38% of revenue',
    icon: '📱',
    color: 'var(--color-accent)',
    bg: 'var(--color-accent-light)',
  },
  {
    label: 'Card Payments',
    value: 'GHS 860.00',
    sub: '18% of revenue',
    icon: '💳',
    color: 'var(--color-info)',
    bg: 'var(--color-info-light)',
  },
]

const detailedCards = [
  {
    label: 'Gross Profit',
    value: 'GHS 1,340.20',
    sub: '27.8% margin',
    color: 'var(--color-success)',
    bg: 'var(--color-success-light)',
  },
  {
    label: 'Refunds',
    value: 'GHS 210.75',
    sub: '1 transaction',
    color: 'var(--color-danger)',
    bg: 'var(--color-danger-light)',
  },
  {
    label: 'Net Revenue',
    value: 'GHS 4,609.75',
    sub: 'After refunds',
    color: 'var(--color-accent)',
    bg: 'var(--color-accent-light)',
  },
  {
    label: 'Items Sold',
    value: '342',
    sub: 'Across 18 categories',
    color: 'var(--color-info)',
    bg: 'var(--color-info-light)',
  },
]

export default function SalesSummary({ detailed }: { detailed?: boolean }) {
  const cards = detailed ? detailedCards : summaryCards

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-primary">
        {detailed ? 'Financial Summary' : 'Sales by Payment Method'}
      </h3>

      <div className={`grid gap-4 ${detailed ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-3'}`}>
        {cards.map(card => (
          <div key={card.label} className="card p-5">
            <div className="flex items-start justify-between gap-2 mb-3">
              <p className="text-sm font-medium text-secondary leading-snug">{card.label}</p>
              {'icon' in card && (
                <span className="text-lg">{(card as typeof summaryCards[0]).icon}</span>
              )}
            </div>

            <p className="text-xl font-bold text-primary mb-1">{card.value}</p>

            <div className="flex items-center gap-1.5">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: card.color }}
              />
              <p className="text-xs text-muted">{card.sub}</p>
            </div>

            {/* Mini progress bar */}
            {'icon' in card && (
              <div className="mt-3 h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-surface-3)' }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: card.label === 'Cash Sales' ? '44%' :
                      card.label === 'Mobile Money' ? '38%' : '18%',
                    backgroundColor: card.color,
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
