// Server-side source of truth for what a download costs. The amount is
// never trusted from the client -- only this productId -> amount mapping
// is used when creating a Razorpay order, so a tampered client request
// can't pay less than the real price.
//
// TEMP: amounts set to ₹1 / ₹2 for live-checkout testing. Revert to
// 19900 / 24900 (₹199 / ₹249) before real customers use this.
export const PRODUCTS = {
  stamp_download: { amount: 100, currency: 'INR', description: 'Stamp download (PNG/SVG)' },
  stamped_pdf_download: { amount: 200, currency: 'INR', description: 'Stamped PDF download' },
}
