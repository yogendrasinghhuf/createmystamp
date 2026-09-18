// Server-side source of truth for what a download costs. The amount is
// never trusted from the client -- only this productId -> amount mapping
// is used when creating a Razorpay order, so a tampered client request
// can't pay less than the real price.
export const PRODUCTS = {
  stamp_download: { amount: 19900, currency: 'INR', description: 'Stamp download (PNG/SVG)' },
  stamped_pdf_download: { amount: 24900, currency: 'INR', description: 'Stamped PDF download' },
}
