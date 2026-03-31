import { paystackClient, PaystackVerifyResponse, PaystackInitResponse } from '../config/paystack'
import { PaymentModel } from '../models/payment.model'
import { SalesService } from './sales.service'
import { AppError } from '../middleware/errorHandler'

export const PaystackService = {
  /**
   * Verify a Paystack transaction reference after frontend redirect.
   * Called by the backend after the user pays on Paystack.
   */
  async verifyAndRecordSale(data: {
    reference: string
    userId: number
    customerId?: number
    items: Array<{ productId: number; quantity: number }>
    discountAmount?: number
  }) {
    // 1. Check we haven't already processed this reference
    const existingPayment = await PaymentModel.findByPaystackRef(data.reference)
    if (existingPayment?.status === 'success') {
      throw new AppError('This payment has already been processed', 409)
    }

    // 2. Verify with Paystack API
    let paystackData: PaystackVerifyResponse['data']
    try {
      const res = await paystackClient.get<PaystackVerifyResponse>(
        `/transaction/verify/${data.reference}`
      )
      if (!res.data.status) throw new AppError('Paystack verification failed', 400)
      paystackData = res.data.data
    } catch (err: unknown) {
      if (err instanceof AppError) throw err
      throw new AppError('Could not verify payment with Paystack', 502)
    }

    // 3. Confirm it was actually successful
    if (paystackData.status !== 'success') {
      throw new AppError(`Payment was not successful (status: ${paystackData.status})`, 400)
    }

    // 4. Determine payment method from Paystack channel
    const methodMap: Record<string, 'momo' | 'card'> = {
      mobile_money: 'momo',
      card: 'card',
    }
    const paymentMethod = methodMap[paystackData.channel] || 'card'

    // 5. Create the sale and deduct stock
    const result = await SalesService.createSale({
      userId: data.userId,
      customerId: data.customerId,
      items: data.items,
      paymentMethod,
      paystackRef: data.reference,
      discountAmount: data.discountAmount,
    })

    // 6. Mark payment verified
    await PaymentModel.markVerified(data.reference)

    return {
      saleId: result.saleId,
      transactionCode: result.transactionCode,
      total: result.total,
      paystackRef: data.reference,
      channel: paystackData.channel,
    }
  },

  /**
   * Optional: Initialize a transaction server-side (useful for server-to-server flows).
   * The frontend Paystack popup handles most cases directly.
   */
  async initializeTransaction(data: {
    email: string
    amount: number // in pesewas
    currency?: string
    metadata?: Record<string, unknown>
  }) {
    try {
      const res = await paystackClient.post<PaystackInitResponse>('/transaction/initialize', {
        email: data.email,
        amount: data.amount,
        currency: data.currency || 'GHS',
        metadata: data.metadata || {},
      })
      return res.data.data
    } catch {
      throw new AppError('Failed to initialize Paystack transaction', 502)
    }
  },
}
