import { API_BASE_URL } from '../config/brand'

export type ProductId = 'stamp_download' | 'stamped_pdf_download'

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open(): void }
  }
}

interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  order_id: string
  name: string
  description: string
  handler: (response: RazorpayHandlerResponse) => void
  modal?: { ondismiss?: () => void }
  theme?: { color?: string }
}

interface RazorpayHandlerResponse {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

let checkoutScriptPromise: Promise<void> | null = null

function loadCheckoutScript(): Promise<void> {
  if (window.Razorpay) return Promise.resolve()
  if (checkoutScriptPromise) return checkoutScriptPromise

  checkoutScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Could not load the payment form. Check your connection and try again.'))
    document.body.appendChild(script)
  })
  return checkoutScriptPromise
}

async function createOrder(productId: ProductId) {
  const res = await fetch(`${API_BASE_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId }),
  })
  if (!res.ok) throw new Error('Could not start the payment. Please try again.')
  return (await res.json()) as { orderId: string; amount: number; currency: string; keyId: string }
}

async function verifyPayment(response: RazorpayHandlerResponse) {
  const res = await fetch(`${API_BASE_URL}/api/payments/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(response),
  })
  if (!res.ok) return false
  const data = (await res.json()) as { verified: boolean }
  return data.verified
}

/**
 * Opens Razorpay Checkout for the given product and resolves once payment
 * is verified server-side. Resolves to false if the user closes the
 * checkout without paying; rejects if the order couldn't be created or
 * verification failed after a successful-looking payment.
 */
export async function payForProduct(productId: ProductId, description: string): Promise<boolean> {
  await loadCheckoutScript()
  const order = await createOrder(productId)

  return new Promise((resolve, reject) => {
    const checkout = new window.Razorpay({
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      order_id: order.orderId,
      name: 'Create My Stamp',
      description,
      handler: (response) => {
        verifyPayment(response).then(resolve).catch(reject)
      },
      modal: {
        ondismiss: () => resolve(false),
      },
      theme: { color: '#C4571F' },
    })
    checkout.open()
  })
}
