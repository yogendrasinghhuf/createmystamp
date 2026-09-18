# createmystamp-server

Minimal backend for Razorpay payments. The frontend (Vite app in the repo
root) is entirely static and never sees the Razorpay key secret; this
service is the only thing that creates orders and verifies payment
signatures.

## Endpoints

- `POST /api/orders` — body `{ "productId": "stamp_download" | "stamped_pdf_download" }`, returns a Razorpay order. The amount is looked up server-side from `src/products.js`, never trusted from the client.
- `POST /api/payments/verify` — body `{ razorpay_order_id, razorpay_payment_id, razorpay_signature }`, returns `{ verified: true|false }`.

## Deploying to Render

1. New Web Service → connect this GitHub repo.
2. Root Directory: `server`
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Environment variables:
   - `RAZORPAY_KEY_ID` — your live Key ID
   - `RAZORPAY_KEY_SECRET` — your live Key Secret
   - `ALLOWED_ORIGIN` — the deployed frontend's origin, e.g. `https://createmystamp.com` (comma-separate if there's more than one, e.g. staging + prod)

## Local development

```
cd server
cp .env.example .env   # fill in RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET
npm install
npm run dev
```
