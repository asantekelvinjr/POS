import { useCartStore } from '@/store/cartStore'

const TAX_RATE = parseFloat(process.env.NEXT_PUBLIC_VAT_RATE || '0.15')

export function useCart() {
  const store = useCartStore()
  const subtotal  = store.cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const tax       = subtotal * TAX_RATE
  const discount  = store.discountAmount
  const total     = subtotal + tax - discount
  const itemCount = store.cartItems.reduce((sum, i) => sum + i.quantity, 0)
  return {
    cartItems: store.cartItems,
    customerId: store.customerId,
    discountAmount: discount,
    subtotal, tax, total, itemCount,
    addItem:     store.addItem,
    removeItem:  store.removeItem,
    updateQty:   store.updateQty,
    clearCart:   store.clearCart,
    setCustomer: store.setCustomer,
    setDiscount: store.setDiscount,
  }
}
