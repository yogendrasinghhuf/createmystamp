import crypto from 'node:crypto'
import express from 'express'
import cors from 'cors'
import Razorpay from 'razorpay'
import { PRODUCTS } from './products.js'

const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, ALLOWED_ORIGIN, PORT } = process.env

if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
  throw new Error('RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set')
}

const razorpay = new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET })

const app = express()
app.use(express.json())
app.use(cors({ origin: ALLOWED_ORIGIN ? ALLOWED_ORIGIN.split(',') : true }))

app.get('/health', (_req, res) => {
  res.json({ ok: true })
})

app.post('/api/orders', async (req, res) => {
  const { productId } = req.body ?? {}
  const product = PRODUCTS[productId]
  if (!product) {
    res.status(400).json({ error: 'Unknown productId' })
    return
  }

  try {
    const order = await razorpay.orders.create({
      amount: product.amount,
      currency: product.currency,
      notes: { productId },
    })
    res.json({ orderId: order.id, amount: order.amount, currency: order.currency, keyId: RAZORPAY_KEY_ID })
  } catch (err) {
    console.error('Failed to create Razorpay order', err)
    res.status(502).json({ error: 'Could not create order' })
  }
})

app.post('/api/payments/verify', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body ?? {}
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    res.status(400).json({ error: 'Missing payment fields' })
    return
  }

  const expectedSignature = crypto
    .createHmac('sha256', RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex')

  const isValid =
    expectedSignature.length === razorpay_signature.length &&
    crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(razorpay_signature))

  if (!isValid) {
    res.status(400).json({ verified: false })
    return
  }

  res.json({ verified: true })
})

const port = PORT || 4000
app.listen(port, () => {
  console.log(`createmystamp-server listening on port ${port}`)
})
