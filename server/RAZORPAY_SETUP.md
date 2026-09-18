# Razorpay Integration Setup Guide

This guide walks through setting up Razorpay for Create My Stamp. The
backend lives in `server/` (deployed separately from the static frontend);
see `server/README.md` for the Render deployment steps.

## Step 1: Razorpay account + KYC

Same as any Razorpay project — sign up at https://razorpay.com/, verify
email/phone, and complete KYC before switching to Live Mode.

## Step 2: Get API keys

1. Dashboard → https://dashboard.razorpay.com/
2. Toggle Test/Live mode in the sidebar
3. **Settings → API Keys** → generate keys
   - Test: `rzp_test_...` Key ID + secret
   - Live: `rzp_live_...` Key ID + secret

## Step 3: Configure the backend (`server/`)

```bash
cd server
cp .env.example .env
```

Edit `.env`:
```env
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXX
RAZORPAY_KEY_SECRET=YYYYYYYYYYYYYYYY
ALLOWED_ORIGIN=http://localhost:5173
PORT=4000
```

**Difference from a typical setup**: the frontend does *not* hardcode the
Key ID anywhere. `POST /api/orders` returns `keyId` (the public Key ID)
in its response, and `src/lib/razorpay.ts` uses that value to open
Checkout. This means switching test → live keys only touches the
backend's env vars — no frontend file needs editing or redeploying.

## Step 4: Configure the frontend

The frontend only needs to know where the backend lives:

```bash
cp .env.example .env
```
```env
VITE_API_BASE_URL=http://localhost:4000
```

In production this points at wherever `server/` is deployed (e.g. a
Render URL), set as an environment variable on whatever hosts the
static frontend build.

## Step 5: Run locally

```bash
# Terminal 1 - backend
cd server && npm install && npm run dev

# Terminal 2 - frontend
npm install && npm run dev
```

Open the app, go to Stamp Studio, click "Download". Checkout should
open using the Test Mode key.

### Test cards

- **Success**: 4111 1111 1111 1111, any future expiry, any CVV
- **Failure**: 4000 0000 0000 0002
- **UPI success**: `success@razorpay`

## Step 6: Webhooks (optional)

Not implemented in `server/src/index.js` yet. If you want payment
confirmation independent of the browser staying open (e.g. for
reconciliation), add a `POST /api/webhook` route that verifies the
`X-Razorpay-Signature` header against `RAZORPAY_WEBHOOK_SECRET`,
configured in the Razorpay dashboard under **Settings → Webhooks**.

## Step 7: Going live

- [ ] KYC complete, Live Mode enabled
- [ ] `server/.env` (or the Render env vars) switched to
      `rzp_live_...` Key ID + Secret
- [ ] `ALLOWED_ORIGIN` set to the real frontend domain (`https://createmystamp.com`)
- [ ] `VITE_API_BASE_URL` on the frontend points at the deployed backend
- [ ] Test a real ₹1 transaction before announcing launch

## Payment flow

```
User clicks Download / Download stamped PDF
    ↓
Frontend calls POST /api/orders { productId }
    ↓
Backend looks up the price server-side, creates a Razorpay order
    ↓
Frontend opens Razorpay Checkout with the returned order + keyId
    ↓
User pays
    ↓
Frontend calls POST /api/payments/verify with Razorpay's response
    ↓
Backend recomputes the HMAC signature and confirms it matches
    ↓
If verified: the PNG/SVG/PDF export runs and downloads
```

## Security notes specific to this integration

- The amount charged is never sent by the client — `productId` maps to
  a price in `server/src/products.js` only. A tampered request can't
  pay less.
- `RAZORPAY_KEY_SECRET` only ever exists as a backend environment
  variable, never in the repo or in any frontend bundle.
- Signature comparison uses `crypto.timingSafeEqual` to avoid timing
  attacks on the verification endpoint.

## Troubleshooting

- **"Unknown productId"** — the frontend is passing something other
  than `stamp_download` / `stamped_pdf_download`; check `payForProduct`
  call sites.
- **Checkout won't open** — check the browser console; `loadCheckoutScript`
  in `src/lib/razorpay.ts` fails if `checkout.razorpay.com` is blocked
  by an ad blocker or offline.
- **Verification always fails** — `RAZORPAY_KEY_SECRET` on the backend
  doesn't match the key used to create the order (e.g. mixing test and
  live keys between two deploys).
- **CORS error calling `/api/orders`** — `ALLOWED_ORIGIN` on the backend
  doesn't match the frontend's actual origin.
