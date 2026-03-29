'use client'

import { use } from 'react'
import Badge from '@/components/ui/Badge'

const mockHistory = [
  { id: 'TXN-001', date: '2024-04-10', items: 4, total: 120.00, method: 'Cash' },
  { id: 'TXN-002', date: '2024-04-05', items: 2, total: 85.50, method: 'MTN MoMo' },
  { id: 'TXN-003', date: '2024-03-30', items: 7, total: 432.00, method: 'Card' },
]

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted">
        <a href="/customers" className="hover:text-accent transition-pos">Customers</a>
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        <span className="text-primary font-medium">Customer #{id}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile card */}
        <div className="card p-6 text-center space-y-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl text-white mx-auto" style={{ backgroundColor: 'var(--color-accent)' }}>
            KA
          </div>
          <div>
            <h2 className="font-bold text-xl text-primary" style={{ fontFamily: 'var(--font-display)' }}>Kwame Asante</h2>
            <p className="text-secondary text-sm mt-1">Customer since Jan 2024</p>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-center gap-2 text-secondary">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
              0244123456
            </div>
            <div className="flex items-center justify-center gap-2 text-secondary">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
              kwame@gmail.com
            </div>
          </div>
          <div className="pt-2 border-t border-base">
            <Badge variant="accent">120 Loyalty Points</Badge>
          </div>
        </div>

        {/* Stats */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { label: 'Total Spent', value: 'GHS 1,240.50', color: 'var(--color-accent)' },
            { label: 'Total Visits', value: '12', color: 'var(--color-info)' },
            { label: 'Avg. Order', value: 'GHS 103.37', color: 'var(--color-success)' },
          ].map(s => (
            <div key={s.label} className="card p-5">
              <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-sm text-secondary mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Purchase history */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-base">
          <h3 className="font-semibold text-primary">Purchase History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-2 text-left">
                {['Transaction', 'Date', 'Items', 'Total', 'Method'].map(h => (
                  <th key={h} className="px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-base">
              {mockHistory.map(t => (
                <tr key={t.id} className="hover:bg-surface-2 transition-pos">
                  <td className="px-6 py-4 font-mono text-accent">{t.id}</td>
                  <td className="px-6 py-4 text-secondary">{t.date}</td>
                  <td className="px-6 py-4 text-secondary">{t.items}</td>
                  <td className="px-6 py-4 font-semibold text-primary">GHS {t.total.toFixed(2)}</td>
                  <td className="px-6 py-4"><Badge variant="info">{t.method}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
