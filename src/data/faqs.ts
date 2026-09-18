import { BRAND } from '../config/brand'

export interface Faq {
  q: string
  a: string
}

// Single source of truth for the FAQ: rendered on the home page and also
// emitted as FAQPage structured data (JSON-LD) so search engines can show
// these as rich results.
export const FAQS: Faq[] = [
  {
    q: `What is ${BRAND.name}?`,
    a: `${BRAND.name} is a free online stamp maker. Design a custom rubber-stamp style mark in your browser - round, oval, rectangular or badge shaped - with straight and curved text, icons and shapes, then download it as a PNG or SVG, or stamp it straight onto the pages of your own PDF.`,
  },
  {
    q: 'Do I need to create an account?',
    a: 'No. Every feature of the stamp maker works without signing up, and your in-progress design is saved locally in your browser so you can come back to it.',
  },
  {
    q: 'Is my stamp design or my PDF uploaded anywhere?',
    a: `No. ${BRAND.name} runs entirely in your browser. Your stamp design, any images you add, and any PDF you open in "Add to My PDF" stay on your device - nothing is sent to a server.`,
  },
  {
    q: 'Can I start from a ready-made stamp template?',
    a: 'Yes. Browse the Templates section for business seals, address stamps, "Received" and "Paid" marks, teacher stamps, monograms and more. Pick one to load it into Stamp Studio, then change the text, colors, shapes and size to make it yours.',
  },
  {
    q: 'How do I add a stamp to a PDF?',
    a: 'Open "Add to My PDF", upload your PDF, and drag your stamp from the sidebar onto any page. You can place the same stamp as many times as you like, mix different stamp designs on one document, move and resize each one, and then download the stamped PDF.',
  },
  {
    q: 'Can I stamp more than one page, or use more than one stamp on a document?',
    a: 'Yes. Place as many stamps as you need across every page of the PDF, and switch between your own design and any template while you work - each placed stamp keeps the design it had when you dropped it.',
  },
  {
    q: 'What does a download cost?',
    a: `Downloads are priced per file: a finished stamp (PNG or SVG) costs ${BRAND.stampDownloadPrice}, and a stamped PDF costs ${BRAND.stampedPdfDownloadPrice}. Designing, previewing, editing and placing stamps is free - you only pay when you download the final file.`,
  },
  {
    q: 'Can I make a dashed or dotted stamp border?',
    a: 'Yes. Select any shape and use the "Dashed stroke" slider to turn its outline into evenly spaced dashes. Every dash around the shape stays the same length, and you can control the dash size as well as the stroke width and color.',
  },
  {
    q: 'What image formats can I upload into a stamp?',
    a: 'You can add PNG, JPG or SVG files to your stamp design. Uploaded SVG files are automatically cleaned of scripts before use.',
  },
  {
    q: 'What formats can I export?',
    a: 'A finished stamp downloads as a PNG (1x, 2x or 3x resolution, with an optional transparent background) or as a true-vector SVG. A stamped document downloads as a standard PDF with your stamps embedded at their exact position and size.',
  },
  {
    q: 'Can I undo mistakes?',
    a: 'Yes. Use Ctrl/Cmd+Z to undo and Ctrl/Cmd+Shift+Z to redo, or the undo/redo buttons in the editor. Placed PDF stamps can be removed with the Delete or Backspace key.',
  },
  {
    q: 'Will my work survive a page refresh?',
    a: 'Your Stamp Studio design autosaves to your browser and reloads automatically. PDFs you open in "Add to My PDF" stay only for the current session and are not stored.',
  },
  {
    q: 'Can I use this to make official government, court or bank seals?',
    a: 'No. See our Responsible Use page - this tool is intended for legitimate business, creative, educational and personal document workflows only.',
  },
]
