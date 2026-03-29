'use client'

const lowItems = [
  { name: 'Fanta 500ml', qty: 12, reorder: 30 },
  { name: 'Mentos Roll', qty: 5, reorder: 50 },
  { name: 'Paracetamol 500mg', qty: 0, reorder: 200 },
  { name: 'Fair & White Cream', qty: 18, reorder: 25 },
  { name: 'Sunlight Soap', qty: 8, reorder: 40 },
]

export default function LowStockAlert({ compact }: { compact?: boolean }) {
  return (
    <div className="card overflow-hidden h-full">
      <div className="px-5 py-4 border-b border-base flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: 'var(--color-danger)' }}
          />
          <h3 className="font-semibold text-primary text-sm">Low Stock Alerts</h3>
        </div>
        <a href="/inventory" className="text-xs text-accent hover:underline font-medium">
          View all
        </a>
      </div>

      <div className="divide-y divide-base">
        {lowItems.map(item => {
          const pct = Math.min(100, Math.round((item.qty / item.reorder) * 100))
          const isOut = item.qty === 0

          return (
            <div key={item.name} className="px-5 py-3.5">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-sm font-medium text-primary">{item.name}</p>
                <span
                  className="text-xs font-semibold"
                  style={{ color: isOut ? 'var(--color-danger)' : 'var(--color-highlight)' }}
                >
                  {isOut ? 'Out' : `${item.qty} left`}
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-surface-3)' }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: isOut ? 'var(--color-danger)' : 'var(--color-highlight)',
                  }}
                />
              </div>

              {!compact && (
                <p className="text-xs text-muted mt-1">Reorder at {item.reorder} units</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
