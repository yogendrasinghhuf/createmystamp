import type { StampProject, StampElement } from '../types/stamp'
import type { TemplateCategory } from './templateCategories'

export interface StampTemplate {
  id: string
  name: string
  category: TemplateCategory
  project: Omit<StampProject, 'id' | 'updatedAt'>
}

function text(overrides: Partial<Extract<StampElement, { type: 'text' }>>): StampElement {
  return {
    id: overrides.id ?? crypto.randomUUID(),
    type: 'text',
    x: 0,
    y: 0,
    rotation: 0,
    scale: 1,
    zIndex: 1,
    text: 'TEXT',
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontSize: 6,
    fontWeight: 600,
    letterSpacing: 0,
    align: 'center',
    color: '#2B2A28',
    multiline: false,
    ...overrides,
  } as StampElement
}

function curvedText(overrides: Partial<Extract<StampElement, { type: 'curvedText' }>>): StampElement {
  return {
    id: overrides.id ?? crypto.randomUUID(),
    type: 'curvedText',
    x: 0,
    y: 0,
    rotation: 0,
    scale: 1,
    zIndex: 1,
    text: 'CURVED TEXT',
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontSize: 5,
    fontWeight: 600,
    letterSpacing: 1,
    color: '#2B2A28',
    radius: 16,
    startAngle: 0,
    direction: 'clockwise',
    ...overrides,
  } as StampElement
}

function shape(overrides: Partial<Extract<StampElement, { type: 'shape' }>>): StampElement {
  return {
    id: overrides.id ?? crypto.randomUUID(),
    type: 'shape',
    x: 0,
    y: 0,
    rotation: 0,
    scale: 1,
    zIndex: 0,
    shape: 'circle',
    width: 16,
    height: 16,
    strokeColor: '#2B2A28',
    strokeWidth: 1,
    fillColor: '#2B2A28',
    filled: false,
    ...overrides,
  } as StampElement
}

function qrCode(overrides: Partial<Extract<StampElement, { type: 'qrCode' }>>): StampElement {
  return {
    id: overrides.id ?? crypto.randomUUID(),
    type: 'qrCode',
    x: 0,
    y: 0,
    rotation: 0,
    scale: 1,
    zIndex: 1,
    content: 'https://example.com',
    contentType: 'text',
    size: 16,
    color: '#2B2A28',
    ...overrides,
  } as StampElement
}

export const TEMPLATES: StampTemplate[] = [
  {
    id: 'business-northpine',
    name: 'North & Pine Co.',
    category: 'Business',
    project: {
      name: 'North & Pine Co.',
      shape: 'circle',
      dimensions: { width: 40, height: 40 },
      ink: { mode: 'clean', color: '#2B2A28', opacity: 0.85, distress: 0.15 },
      elements: [
        curvedText({ text: 'NORTH & PINE CO.', radius: 14, startAngle: 303, fontSize: 2.6, letterSpacing: 0.2 }),
        text({ text: 'EST. 2026', y: 1, fontSize: 4, letterSpacing: 1.5 }),
        shape({ shape: 'circle', width: 34, height: 34, strokeWidth: 0.8 }),
      ],
    },
  },
  {
    id: 'business-cobalt',
    name: 'Cobalt & Finch Studio',
    category: 'Business',
    project: {
      name: 'Cobalt & Finch Studio',
      shape: 'rectangle',
      dimensions: { width: 55, height: 25 },
      ink: { mode: 'clean', color: '#2B2A28', opacity: 0.85, distress: 0.15 },
      elements: [
        text({ text: 'COBALT & FINCH', y: -4, fontSize: 4, fontWeight: 700, letterSpacing: 0.5 }),
        text({ text: 'STUDIO', y: 4, fontSize: 3.2, letterSpacing: 3 }),
      ],
    },
  },
  {
    id: 'address-harbor',
    name: 'Harborview Returns',
    category: 'Address',
    project: {
      name: 'Harborview Returns',
      shape: 'rectangle',
      dimensions: { width: 60, height: 30 },
      ink: { mode: 'clean', color: '#2B2A28', opacity: 0.85, distress: 0.1 },
      elements: [
        text({ text: 'HARBORVIEW LANE 42', y: -6, fontSize: 4.5, align: 'left', x: -25 }),
        text({ text: 'PORTVILLE, ST 00000', y: 0, fontSize: 4, align: 'left', x: -25 }),
        text({ text: 'RETURN TO SENDER', y: 8, fontSize: 3, align: 'left', x: -25, letterSpacing: 1 }),
      ],
    },
  },
  {
    id: 'address-oakline',
    name: 'Oakline Residence',
    category: 'Address',
    project: {
      name: 'Oakline Residence',
      shape: 'roundedRectangle',
      dimensions: { width: 50, height: 22 },
      ink: { mode: 'clean', color: '#2B2A28', opacity: 0.85, distress: 0.1 },
      elements: [
        text({ text: 'THE OAKLINE RESIDENCE', y: -3, fontSize: 3.2, fontWeight: 700 }),
        text({ text: '18 MAPLE COURT', y: 4, fontSize: 3.4 }),
      ],
    },
  },
  {
    id: 'packaging-fragile',
    name: 'Handle With Care',
    category: 'Packaging',
    project: {
      name: 'Handle With Care',
      shape: 'rectangle',
      dimensions: { width: 50, height: 26 },
      ink: { mode: 'ink', color: '#8B2E1F', opacity: 0.8, distress: 0.35 },
      elements: [
        text({ text: 'HANDLE WITH CARE', y: -4, fontSize: 2.9, fontWeight: 700, letterSpacing: 0.5 }),
        shape({ shape: 'line', width: 36, height: 0.5, y: 0 }),
        text({ text: 'THIS SIDE UP', y: 6, fontSize: 3.3, letterSpacing: 1 }),
      ],
    },
  },
  {
    id: 'packaging-madeby',
    name: 'Made By Hand',
    category: 'Creative',
    project: {
      name: 'Made By Hand',
      shape: 'circle',
      dimensions: { width: 35, height: 35 },
      ink: { mode: 'ink', color: '#2B2A28', opacity: 0.75, distress: 0.4 },
      elements: [
        curvedText({ text: 'MADE BY HAND', radius: 12.5, startAngle: 300, fontSize: 3.2, letterSpacing: 0.3 }),
        text({ text: 'SLOWLY MADE', y: 3, fontSize: 3.2, letterSpacing: 0.3 }),
      ],
    },
  },
  {
    id: 'personal-signature',
    name: 'Personal Signature Mark',
    category: 'Personal',
    project: {
      name: 'Personal Signature Mark',
      shape: 'oval',
      dimensions: { width: 45, height: 28 },
      ink: { mode: 'clean', color: '#2B2A28', opacity: 0.85, distress: 0.15 },
      elements: [
        text({ text: 'AVERY QUINN', y: -2, fontSize: 5, fontWeight: 500 }),
        text({ text: 'PERSONAL COPY', y: 6, fontSize: 3, letterSpacing: 1 }),
      ],
    },
  },
  {
    id: 'creative-sunburst',
    name: 'Sunburst Notes',
    category: 'Creative',
    project: {
      name: 'Sunburst Notes',
      shape: 'badge',
      dimensions: { width: 36, height: 36 },
      ink: { mode: 'ink', color: '#C4571F', opacity: 0.8, distress: 0.3 },
      elements: [
        shape({ shape: 'circle', width: 30, height: 30, strokeWidth: 1.4 }),
        text({ text: 'HAND MADE', y: 0, fontSize: 3.4, fontWeight: 700, letterSpacing: 0.2 }),
        text({ text: 'WITH JOY', y: 6, fontSize: 3, letterSpacing: 1 }),
      ],
    },
  },
  {
    id: 'creative-thankyou',
    name: 'Thank You Burst',
    category: 'Creative',
    project: {
      name: 'Thank You Burst',
      shape: 'badge',
      dimensions: { width: 32, height: 32 },
      ink: { mode: 'ink', color: '#1F7A3D', opacity: 0.8, distress: 0.25 },
      outlineSuppressed: true,
      elements: [
        shape({ shape: 'circle', width: 32, height: 32, strokeColor: '#1F7A3D', strokeWidth: 1.2, filled: false }),
        shape({ shape: 'circle', width: 23, height: 23, strokeWidth: 0.6, strokeColor: '#1F7A3D' }),
        curvedText({ text: 'THANK YOU', radius: 12.7, startAngle: 322, fontSize: 2.8, fontWeight: 700, letterSpacing: 0.2, color: '#1F7A3D' }),
        text({ text: 'SO MUCH', y: 2, fontSize: 3, color: '#1F7A3D' }),
      ],
    },
  },
  {
    id: 'teacher-greatjob',
    name: 'Great Job Badge',
    category: 'Teacher',
    project: {
      name: 'Great Job Badge',
      shape: 'badge',
      dimensions: { width: 32, height: 32 },
      ink: { mode: 'clean', color: '#1F7A3D', opacity: 0.85, distress: 0.1 },
      outlineSuppressed: true,
      elements: [
        shape({ shape: 'circle', width: 32, height: 32, strokeColor: '#1F7A3D', strokeWidth: 1.2, filled: false }),
        shape({ shape: 'circle', width: 28, height: 28, strokeWidth: 1.2, strokeColor: '#1F7A3D' }),
        text({ text: 'GREAT', y: -3, fontSize: 5, fontWeight: 700, color: '#1F7A3D' }),
        text({ text: 'JOB!', y: 4, fontSize: 5, fontWeight: 700, color: '#1F7A3D' }),
      ],
    },
  },
  {
    id: 'teacher-graded',
    name: 'Reviewed By Teacher',
    category: 'Teacher',
    project: {
      name: 'Reviewed By Teacher',
      shape: 'rectangle',
      dimensions: { width: 48, height: 20 },
      ink: { mode: 'clean', color: '#2B6F4C', opacity: 0.85, distress: 0.1 },
      elements: [
        text({ text: 'REVIEWED', y: -3, fontSize: 4.5, fontWeight: 700, letterSpacing: 1 }),
        text({ text: 'MS. RAMIREZ’S CLASS', y: 4, fontSize: 2.6, letterSpacing: 0.3 }),
      ],
    },
  },
  {
    id: 'monogram-classic',
    name: 'Classic Monogram',
    category: 'Monogram',
    project: {
      name: 'Classic Monogram',
      shape: 'circle',
      dimensions: { width: 34, height: 34 },
      ink: { mode: 'clean', color: '#2B2A28', opacity: 0.85, distress: 0.1 },
      elements: [
        shape({ shape: 'circle', width: 30, height: 30, strokeWidth: 0.8 }),
        text({ text: 'SEAL', x: 0.2, y: 2.4, fontSize: 7, fontWeight: 500, letterSpacing: 1 }),
      ],
    },
  },
  {
    id: 'monogram-interlock',
    name: 'Fragile Label',
    category: 'Packaging',
    project: {
      name: 'Fragile Label',
      shape: 'oval',
      dimensions: { width: 32, height: 24 },
      ink: { mode: 'clean', color: '#C4282D', opacity: 0.85, distress: 0.1 },
      outlineSuppressed: true,
      elements: [
        shape({ shape: 'oval', width: 32, height: 24, strokeColor: '#C4282D', strokeWidth: 1.2, filled: false }),
        text({ text: 'FRAGILE', x: 0.2, y: 1.2, fontSize: 4.6, fontWeight: 600, letterSpacing: 0.4, align: 'center', color: '#C4282D' }),
      ],
    },
  },
  {
    id: 'date-received',
    name: 'Date Received Stamp',
    category: 'Date',
    project: {
      name: 'Date Received Stamp',
      shape: 'rectangle',
      dimensions: { width: 46, height: 22 },
      ink: { mode: 'ink', color: '#1F4E8B', opacity: 0.8, distress: 0.2 },
      elements: [
        text({ text: 'RECEIVED', y: -4, fontSize: 5, fontWeight: 700, letterSpacing: 2 }),
        shape({ shape: 'line', width: 34, height: 0.5, y: 0 }),
        text({ text: 'DATE: __ / __ / __', y: 6, fontSize: 3.4 }),
      ],
    },
  },
  {
    id: 'indian-company-seal',
    name: 'Company Round Seal',
    category: 'Business',
    project: {
      name: 'Company Round Seal',
      shape: 'circle',
      dimensions: { width: 40, height: 40 },
      ink: { mode: 'ink', color: '#1F4E8B', opacity: 0.85, distress: 0.2 },
      elements: [
        shape({ shape: 'circle', width: 34, height: 34, strokeWidth: 0.8 }),
        curvedText({ text: 'SHREE ENTERPRISES', radius: 14, startAngle: 295, fontSize: 2.8, letterSpacing: 0.2 }),
        text({ text: 'PROPRIETOR', y: -1, fontSize: 3.4, letterSpacing: 1 }),
        text({ text: 'GSTIN 27ABCDE1234F1Z5', y: 6, fontSize: 2.3, letterSpacing: 0 }),
      ],
    },
  },
  {
    id: 'indian-received-with-thanks',
    name: 'Received With Thanks',
    category: 'Legal',
    project: {
      name: 'Received With Thanks',
      shape: 'rectangle',
      dimensions: { width: 55, height: 26 },
      ink: { mode: 'ink', color: '#8B2E1F', opacity: 0.8, distress: 0.25 },
      elements: [
        text({ text: 'RECEIVED WITH THANKS', y: -7, fontSize: 3, fontWeight: 700, letterSpacing: 0.3 }),
        shape({ shape: 'line', width: 44, height: 0.5, y: -1 }),
        text({ text: 'AMOUNT: ₹ __________', y: 4, fontSize: 3.4, align: 'left', x: -22 }),
        text({ text: 'DATE: __ / __ / __', y: 10, fontSize: 3, align: 'left', x: -22 }),
      ],
    },
  },
  {
    id: 'indian-proprietor-signature',
    name: 'Authorised Signatory',
    category: 'Legal',
    project: {
      name: 'Authorised Signatory',
      shape: 'rectangle',
      dimensions: { width: 50, height: 22 },
      ink: { mode: 'clean', color: '#2B2A28', opacity: 0.85, distress: 0.1 },
      elements: [
        text({ text: 'RAJ TRADING CO.', y: -5, fontSize: 3.8, fontWeight: 700, letterSpacing: 0.5 }),
        shape({ shape: 'line', width: 40, height: 0.5, y: 0 }),
        text({ text: 'AUTHORISED SIGNATORY', y: 6, fontSize: 2.6, letterSpacing: 0.5 }),
      ],
    },
  },
  {
    id: 'indian-advocate-seal',
    name: 'Advocate Oval Seal',
    category: 'Legal',
    project: {
      name: 'Advocate Oval Seal',
      shape: 'oval',
      dimensions: { width: 48, height: 30 },
      ink: { mode: 'ink', color: '#2B2A28', opacity: 0.85, distress: 0.2 },
      elements: [
        text({ text: 'ADV. SUNITA MEHTA', y: -3, fontSize: 3.4, fontWeight: 700, letterSpacing: 0.3 }),
        text({ text: 'B.A. LL.B, ADVOCATE', y: 3, fontSize: 2.6, letterSpacing: 0.3 }),
        text({ text: 'HIGH COURT, MUMBAI', y: 8, fontSize: 2.7, letterSpacing: 0.3 }),
      ],
    },
  },
  {
    id: 'indian-stamp-makers-gst',
    name: 'GST Business Seal',
    category: 'Business',
    project: {
      name: 'GST Business Seal',
      shape: 'circle',
      dimensions: { width: 40, height: 40 },
      ink: { mode: 'clean', color: '#2B2A28', opacity: 0.85, distress: 0.15 },
      elements: [
        shape({ shape: 'circle', width: 34, height: 34, strokeWidth: 0.6 }),
        shape({ shape: 'circle', width: 22, height: 22, strokeWidth: 0.6 }),
        curvedText({ text: 'STAMP MAKERS INDIA', radius: 14.5, startAngle: 306, fontSize: 2.2, letterSpacing: 0.2 }),
        curvedText({
          text: 'MANANTHAVADY',
          radius: 14.5,
          startAngle: 221,
          direction: 'counterclockwise',
          fontSize: 2.6,
          letterSpacing: 0.2,
        }),
        text({ text: '2026', y: 1, fontSize: 6, fontWeight: 600, letterSpacing: 1 }),
      ],
    },
  },
  {
    id: 'office-paid',
    name: 'Paid Stamp',
    category: 'Office',
    project: {
      name: 'Paid Stamp',
      shape: 'rectangle',
      dimensions: { width: 45, height: 17 },
      ink: { mode: 'ink', color: '#C4282D', opacity: 0.85, distress: 0.3 },
      outlineSuppressed: true,
      elements: [
        shape({
          shape: 'rectangle',
          width: 45,
          height: 17,
          rotation: -45,
          strokeColor: '#C4282D',
          strokeWidth: 2,
          filled: false,
        }),
        text({
          text: 'PAID',
          x: 4,
          y: 1,
          rotation: -45,
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: 1.5,
          color: '#C4282D',
        }),
      ],
    },
  },
  {
    id: 'office-approved',
    name: 'Approved Stamp',
    category: 'Office',
    project: {
      name: 'Approved Stamp',
      shape: 'rectangle',
      dimensions: { width: 44, height: 20 },
      ink: { mode: 'ink', color: '#1F7A3D', opacity: 0.8, distress: 0.3 },
      outlineSuppressed: true,
      elements: [
        shape({ shape: 'rectangle', width: 44, height: 20, strokeColor: '#1F7A3D', strokeWidth: 1.2, filled: false }),
        text({ text: 'APPROVED', y: 1, fontSize: 6, fontWeight: 700, letterSpacing: 1, color: '#1F7A3D' }),
      ],
    },
  },
  {
    id: 'office-certified',
    name: 'Certified Stamp',
    category: 'Legal',
    project: {
      name: 'Certified Stamp',
      shape: 'rectangle',
      dimensions: { width: 32, height: 32 },
      ink: { mode: 'ink', color: '#8B2E1F', opacity: 0.8, distress: 0.3 },
      elements: [
        shape({ shape: 'octagon', width: 30, height: 30, strokeWidth: 1 }),
        text({ text: 'CERTIFIED', y: -2, fontSize: 3.4, fontWeight: 700, letterSpacing: 0.6 }),
        text({ text: 'TRUE COPY', y: 3, fontSize: 3, letterSpacing: 0.6 }),
      ],
    },
  },
  {
    id: 'office-received-ledger',
    name: 'Received Ledger',
    category: 'Office',
    project: {
      name: 'Received Ledger',
      shape: 'rectangle',
      dimensions: { width: 52, height: 32 },
      ink: { mode: 'ink', color: '#1F4E8B', opacity: 0.8, distress: 0.25 },
      outlineSuppressed: true,
      elements: [
        shape({ shape: 'rectangle', width: 52, height: 32, strokeColor: '#1F4E8B', strokeWidth: 1.2, filled: false }),
        text({ text: 'RECEIVED', y: -10, fontSize: 4.2, fontWeight: 700, letterSpacing: 1, color: '#1F4E8B' }),
        shape({ shape: 'line', width: 42, height: 0.5, y: -5, strokeColor: '#1F4E8B' }),
        text({ text: 'BY: ______________', y: -1, fontSize: 3, align: 'left', x: -21, color: '#1F4E8B' }),
        text({ text: 'DATE: __ / __ / __', y: 5, fontSize: 3, align: 'left', x: -21, color: '#1F4E8B' }),
        text({ text: 'AMOUNT: ____________', y: 11, fontSize: 3, align: 'left', x: -21, color: '#1F4E8B' }),
      ],
    },
  },
  {
    id: 'office-authorised-signatory-oval',
    name: 'Authorised Signatory Triangle',
    category: 'Legal',
    project: {
      name: 'Authorised Signatory Triangle',
      shape: 'triangle',
      dimensions: { width: 50, height: 45 },
      ink: { mode: 'ink', color: '#1F4E8B', opacity: 0.85, distress: 0.2 },
      elements: [
        text({ text: 'Authorised', y: 3, fontSize: 3.2, fontWeight: 600 }),
        text({ text: 'Signatory', y: 8, fontSize: 3.2, fontWeight: 600 }),
        text({ text: 'YOUR COMPANY PVT. LTD.', y: 16, fontSize: 2.4, letterSpacing: 0.1 }),
      ],
    },
  },
  {
    id: 'office-bank-branch',
    name: 'Bank Branch Stamp',
    category: 'Business',
    project: {
      name: 'Bank Branch Stamp',
      shape: 'circle',
      dimensions: { width: 42, height: 42 },
      ink: { mode: 'ink', color: '#1F4E8B', opacity: 0.85, distress: 0.2 },
      elements: [
        shape({ shape: 'circle', width: 36, height: 36, strokeWidth: 0.8 }),
        curvedText({ text: 'INDIA BANK LIMITED', radius: 15.5, startAngle: 306, fontSize: 2.4, letterSpacing: 0.2 }),
        curvedText({
          text: 'MUMBAI BRANCH',
          radius: 15.5,
          startAngle: 225,
          direction: 'counterclockwise',
          fontSize: 2.8,
          letterSpacing: 0.2,
        }),
        text({ text: 'BRANCH 0004', y: -3, fontSize: 3, fontWeight: 600, letterSpacing: 0.3 }),
        text({ text: 'DATE: __________', y: 3, fontSize: 2.6 }),
      ],
    },
  },
  {
    id: 'office-courier-logistics',
    name: 'Courier Logistics Stamp',
    category: 'Business',
    project: {
      name: 'Courier Logistics Stamp',
      shape: 'circle',
      dimensions: { width: 44, height: 44 },
      ink: { mode: 'ink', color: '#1F4E8B', opacity: 0.85, distress: 0.2 },
      elements: [
        shape({ shape: 'circle', width: 38, height: 38, strokeWidth: 0.8 }),
        shape({ shape: 'circle', width: 26, height: 26, strokeWidth: 0.6 }),
        curvedText({ text: 'FTFC COURIER SERVICES', radius: 16.5, startAngle: 309, fontSize: 2, letterSpacing: 0.2 }),
        curvedText({
          text: 'PVT. LTD.',
          radius: 16.5,
          startAngle: 208,
          direction: 'counterclockwise',
          fontSize: 2.4,
          letterSpacing: 0.4,
        }),
        text({ text: 'LOCAL &', y: -2, fontSize: 3, letterSpacing: 0.3 }),
        text({ text: 'INTERNATIONAL', y: 3, fontSize: 2, letterSpacing: 0 }),
      ],
    },
  },
  {
    id: 'office-qr-verify',
    name: 'QR Verify Stamp',
    category: 'Office',
    project: {
      name: 'QR Verify Stamp',
      shape: 'rectangle',
      dimensions: { width: 42, height: 50 },
      ink: { mode: 'clean', color: '#1F4E8B', opacity: 0.85, distress: 0.1 },
      elements: [
        text({ text: 'YOUR COMPANY', y: -19, fontSize: 3, fontWeight: 700, letterSpacing: 0.3 }),
        qrCode({ content: 'https://example.com', contentType: 'text', size: 24, y: -2 }),
        text({ text: 'SCAN TO VERIFY', y: 18, fontSize: 2.6, letterSpacing: 0.5 }),
      ],
    },
  },
  {
    id: 'office-company-partner',
    name: 'Company Partner Frame',
    category: 'Business',
    project: {
      name: 'Company Partner Frame',
      shape: 'rectangle',
      dimensions: { width: 50, height: 24 },
      ink: { mode: 'clean', color: '#1F4E8B', opacity: 0.85, distress: 0.1 },
      elements: [
        text({ text: 'StampJam Technologies', y: -6, fontSize: 2.9, fontWeight: 700, letterSpacing: 0.2 }),
        text({ text: '__________  Partner', y: 5, fontSize: 3.2, align: 'right', x: 22 }),
      ],
    },
  },
  {
    id: 'office-address-frame',
    name: 'Address Stamp Frame',
    category: 'Address',
    project: {
      name: 'Address Stamp Frame',
      shape: 'rectangle',
      dimensions: { width: 48, height: 30 },
      ink: { mode: 'clean', color: '#1F4E8B', opacity: 0.85, distress: 0.1 },
      elements: [
        text({ text: 'SAMPLE ADDRESS STAMP', y: -9, fontSize: 2.8, fontWeight: 700, letterSpacing: 0.3 }),
        text({ text: 'ADDRESS LINE 1', y: -3, fontSize: 2.8 }),
        text({ text: 'STREET NAME', y: 1, fontSize: 2.8 }),
        text({ text: 'ZIP CODE', y: 5, fontSize: 2.8 }),
        text({ text: '022 - 20040024', y: 9, fontSize: 2.8, fontWeight: 600 }),
      ],
    },
  },
  {
    id: 'office-true-copy-block',
    name: 'True Copy Certification',
    category: 'Legal',
    project: {
      name: 'True Copy Certification',
      shape: 'rectangle',
      dimensions: { width: 66, height: 40 },
      ink: { mode: 'clean', color: '#2B2A28', opacity: 0.85, distress: 0.1 },
      elements: [
        text({
          text: 'I have viewed the original document',
          y: -14,
          fontSize: 2.6,
          align: 'left',
          x: -31,
        }),
        text({
          text: '& certify this to be a true copy',
          y: -10,
          fontSize: 2.6,
          align: 'left',
          x: -31,
        }),
        text({ text: 'Signed: ____________  Date: ________', y: -1, fontSize: 2.4, align: 'left', x: -31 }),
        text({ text: 'Name: ____________  Position: ______', y: 5, fontSize: 2.4, align: 'left', x: -31 }),
        text({ text: 'Registration number: __________', y: 11, fontSize: 2.4, align: 'left', x: -31 }),
      ],
    },
  },
]
