'use client'

import SalesChart from '@/components/reports/SalesChart'

export default function SalesReportPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-sm text-muted mb-2">
          <a href="/reports" className="hover:text-accent transition-pos">Reports</a>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <span className="text-primary font-medium">Sales Report</span>
        </div>
        <h1 className="text-2xl font-bold text-primary" style={{ fontFamily: 'var(--font-display)' }}>Sales Report</h1>
        <p className="text-secondary mt-1">Detailed sales performance and transaction history</p>
      </div>
      <SalesChart detailed />
    </div>
  )
}
