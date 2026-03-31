import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const PAYSTACK_BASE_URL = 'https://api.paystack.co'

export const paystackClient = axios.create({
  baseURL: PAYSTACK_BASE_URL,
  headers: {
    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    'Content-Type': 'application/json',
  },
})

export const PAYSTACK_PUBLIC_KEY = process.env.PAYSTACK_PUBLIC_KEY || ''

// Paystack API response types
export interface PaystackVerifyResponse {
  status: boolean
  message: string
  data: {
    status: 'success' | 'failed' | 'abandoned'
    reference: string
    amount: number       // in kobo/pesewas
    currency: string
    paid_at: string
    channel: string
    customer: {
      email: string
      phone: string | null
    }
    metadata: Record<string, unknown>
  }
}

export interface PaystackInitResponse {
  status: boolean
  message: string
  data: {
    authorization_url: string
    access_code: string
    reference: string
  }
}
