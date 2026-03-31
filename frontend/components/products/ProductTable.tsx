'use client'
import Link from 'next/link'
import Badge from '@/components/ui/Badge'
import { Product } from '@/types/product'

interface ProductTableProps { products: Product[]; loading?: boolean }

export default function ProductTable({ products, loading }: ProductTableProps) {
  if (loading) {
    return (
      <div className="card overflow-hidden">
        <div className="divide-y divide-base">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="px-6 py-4 flex gap-4">
              <div className="w-10 h-10 rounded-pos-md animate-pulse" style={{ backgroundColor: 'var(--color-surface-3)' }}/>
              <div className="flex-1 space-y-2">
                <div className="h-4 rounded-pos-sm animate-pulse" style={{ backgroundColor: 'var(--color-surface-3)', width: '40%' }}/>
                <div className="h-3 rounded-pos-sm animate-pulse" style={{ backgroundColor: 'var(--color-surface-3)', width: '25%' }}/>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-2 text-left">
              {['Product', 'Category', 'Price', 'Cost', 'Stock', 'Barcode', ''].map(h => (
                <th key={h} className="px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-base">
            {products.length === 0 ? (
              <tr><td colSpan={7} className="px-6 py-12 text-center text-muted">No products found</td></tr>
            ) : products.map(product => (
              <tr key={product.id} className="hover:bg-surface-2 transition-pos">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-pos-md flex items-center justify-center font-bold text-sm shrink-0" style={{ backgroundColor: 'var(--color-accent-light)', color: 'var(--color-accent)' }}>
                      {product.name[0]}
                    </div>
                    <div>
                      <p className="font-medium text-primary">{product.name}</p>
                      {product.description && <p className="text-xs text-muted truncate max-w-xs">{product.description}</p>}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-secondary">{product.category}</td>
                <td className="px-6 py-4 font-semibold text-primary">GHS {Number(product.price).toFixed(2)}</td>
                <td className="px-6 py-4 text-secondary">{product.costPrice ? `GHS ${Number(product.costPrice).toFixed(2)}` : '—'}</td>
                <td className="px-6 py-4">
                  <Badge variant={product.quantity === 0 ? 'danger' : product.quantity <= 10 ? 'warning' : 'success'}>
                    {product.quantity === 0 ? 'Out of stock' : `${product.quantity} units`}
                  </Badge>
                </td>
                <td className="px-6 py-4 font-mono text-xs text-muted">{product.barcode || '—'}</td>
                <td className="px-6 py-4">
                  <Link href={`/products/${product.id}`} className="text-accent hover:underline text-xs font-medium">Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
