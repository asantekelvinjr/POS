import { withTransaction } from '../config/db'
import { SaleModel } from '../models/sale.model'
import { InventoryModel } from '../models/inventory.model'
import { PaymentModel } from '../models/payment.model'
import { CustomerModel } from '../models/customer.model'
import { ProductModel } from '../models/product.model'
import { AppError } from '../middleware/errorHandler'
import { env } from '../config/env'

interface CartItem {
  productId: number
  quantity: number
  price?: number // override price if provided, else use product price
}

interface CreateSaleInput {
  userId: number
  customerId?: number
  items: CartItem[]
  paymentMethod: 'cash' | 'momo' | 'card'
  amountTendered?: number   // for cash
  paystackRef?: string      // for momo/card
  discountAmount?: number
  notes?: string
}

export const SalesService = {
  async createSale(input: CreateSaleInput) {
    return withTransaction(async (client) => {
      // 1. Validate and price each item
      const resolvedItems = await Promise.all(
        input.items.map(async (item) => {
          const product = await ProductModel.findById(item.productId)
          if (!product) throw new AppError(`Product ID ${item.productId} not found`, 404)
          if (!product.is_active) throw new AppError(`Product "${product.name}" is not available`, 400)

          return {
            productId: product.id,
            productName: product.name,
            unitPrice: item.price ?? Number(product.price),
            quantity: item.quantity,
            discount: 0,
            lineTotal: (item.price ?? Number(product.price)) * item.quantity,
          }
        })
      )

      // 2. Deduct stock inside the transaction (atomic — will roll back on failure)
      for (const item of resolvedItems) {
        await InventoryModel.deductStock(item.productId, item.quantity, client)
      }

      // 3. Calculate totals
      const subtotal = resolvedItems.reduce((sum, i) => sum + i.lineTotal, 0)
      const discountAmount = input.discountAmount || 0
      const taxAmount = (subtotal - discountAmount) * env.vatRate
      const totalAmount = subtotal - discountAmount + taxAmount

      // 4. Generate transaction code
      const now = new Date()
      const pad = (n: number) => String(n).padStart(2, '0')
      const datePart = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`
      const rand = Math.floor(Math.random() * 9000) + 1000
      const transactionCode = `TXN-${datePart}-${rand}`

      // 5. Insert sale
      const sale = await SaleModel.create(
        {
          transactionCode,
          userId: input.userId,
          customerId: input.customerId,
          subtotal,
          discountAmount,
          taxAmount,
          totalAmount,
          paymentMethod: input.paymentMethod,
          notes: input.notes,
        },
        client
      )

      // 6. Insert sale items
      await SaleModel.createItems(
        resolvedItems.map((i) => ({
          sale_id: sale.id,
          product_id: i.productId,
          product_name: i.productName,
          quantity: i.quantity,
          unit_price: i.unitPrice,
          discount: i.discount,
          line_total: i.lineTotal,
        })),
        client
      )

      // 7. Insert payment record
      const changeGiven =
        input.paymentMethod === 'cash' && input.amountTendered
          ? Math.max(0, input.amountTendered - totalAmount)
          : undefined

      await PaymentModel.create(
        {
          saleId: sale.id,
          paystackRef: input.paystackRef,
          amountPaid: totalAmount,
          amountTendered: input.amountTendered,
          changeGiven,
          method: input.paymentMethod,
          status: input.paystackRef ? 'pending' : 'success',
        },
        client
      )

      // 8. Update customer loyalty points if customer provided
      if (input.customerId) {
        const points = Math.floor(totalAmount / 10) // 1 point per GHS 10
        await CustomerModel.addLoyaltyPoints(input.customerId, points)
      }

      return {
        saleId: sale.id,
        transactionCode,
        total: totalAmount,
        change: changeGiven || 0,
        items: resolvedItems,
      }
    })
  },

  async getSaleWithItems(saleId: number) {
    const sale = await SaleModel.findById(saleId)
    if (!sale) throw new AppError('Sale not found', 404)

    const items = await SaleModel.getItems(saleId)
    const payment = await PaymentModel.findBySaleId(saleId)

    return { ...sale, items, payment }
  },

  async getDailySummary(date?: string) {
    return SaleModel.getDailySummary(date)
  },

  async getWeeklySummary() {
    return SaleModel.getWeeklySummary()
  },
}
