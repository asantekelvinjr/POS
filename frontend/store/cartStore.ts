import { create } from 'zustand'
import { CartItem } from '@/types/sale'
import { Product } from '@/types/product'

const TAX_RATE = 0.15 // Ghana VAT 15%

interface CartState {
  cartItems: CartItem[]
  customerId: number | null
  discountAmount: number

  addItem: (product: Product) => void
  removeItem: (productId: number) => void
  updateQty: (productId: number, qty: number) => void
  clearCart: () => void
  setCustomer: (id: number | null) => void
  setDiscount: (amount: number) => void

  // Computed
  subtotal: number
  tax: number
  total: number
  itemCount: number
}

export const useCartStore = create<CartState>()((set, get) => ({
  cartItems: [],
  customerId: null,
  discountAmount: 0,

  addItem: (product: Product) => {
    set(state => {
      const existing = state.cartItems.find(i => i.id === product.id)
      if (existing) {
        return {
          cartItems: state.cartItems.map(i =>
            i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        }
      }
      return {
        cartItems: [
          ...state.cartItems,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            category: product.category,
            barcode: product.barcode,
          },
        ],
      }
    })
  },

  removeItem: (productId: number) => {
    set(state => ({
      cartItems: state.cartItems.filter(i => i.id !== productId),
    }))
  },

  updateQty: (productId: number, qty: number) => {
    if (qty <= 0) {
      get().removeItem(productId)
      return
    }
    set(state => ({
      cartItems: state.cartItems.map(i =>
        i.id === productId ? { ...i, quantity: qty } : i
      ),
    }))
  },

  clearCart: () => set({ cartItems: [], discountAmount: 0, customerId: null }),

  setCustomer: (id) => set({ customerId: id }),

  setDiscount: (amount) => set({ discountAmount: amount }),

  get subtotal() {
    return get().cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
  },

  get tax() {
    const sub = get().cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
    return sub * TAX_RATE
  },

  get total() {
    const sub = get().cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
    const tax = sub * TAX_RATE
    return sub + tax - get().discountAmount
  },

  get itemCount() {
    return get().cartItems.reduce((sum, i) => sum + i.quantity, 0)
  },
}))
