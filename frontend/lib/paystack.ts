'use client'

declare global {
  interface Window {
    PaystackPop: {
      setup: (config: PaystackConfig) => { openIframe: () => void }
    }
  }
}

interface PaystackConfig {
  key: string
  email: string
  amount: number // in pesewas (kobo × 100)
  currency: string
  channels?: string[]
  metadata?: Record<string, unknown>
  callback: (response: { reference: string }) => void
  onClose: () => void
}

interface InitPaymentOptions {
  email: string
  amount: number // in pesewas
  currency?: string
  channels?: string[]
  metadata?: Record<string, unknown>
  onSuccess: (reference: string) => void
  onClose: () => void
}

function loadPaystackScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.PaystackPop) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = 'https://js.paystack.co/v1/inline.js'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Paystack'))
    document.head.appendChild(script)
  })
}

export function usePaystack() {
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || ''

  async function initializePayment(options: InitPaymentOptions) {
    await loadPaystackScript()

    const handler = window.PaystackPop.setup({
      key: publicKey,
      email: options.email,
      amount: options.amount,
      currency: options.currency || 'GHS',
      channels: options.channels || ['card', 'mobile_money', 'bank'],
      metadata: options.metadata || {},
      callback: (response) => {
        options.onSuccess(response.reference)
      },
      onClose: options.onClose,
    })

    handler.openIframe()
  }

  return { initializePayment }
}
