import type { StampProject, StampElement } from '../types/stamp'
import type { TemplateCategory } from './templateCategories'

export interface StampTemplate {
  id: string
  name: string
  category: TemplateCategory
  project: Omit<StampProject, 'id' | 'updatedAt'>
}

// Shared fallback used by the text()/shape()/curvedText()/qrCode() builders
// below when a template doesn't specify its own color. Templates that never
// override it should render in their project's ink color rather than this
// literal, so resolveTemplateElementColors() swaps it back out at load time.
const DEFAULT_ELEMENT_COLOR = '#2B2A28'

// Fills in any element still using the shared default color with the
// project's own ink color, so every object in a template loads matching its
// intended design color instead of silently defaulting to dark.
export function resolveTemplateElementColors(
  project: Omit<StampProject, 'id' | 'updatedAt'>,
): Omit<StampProject, 'id' | 'updatedAt'> {
  const inkColor = project.ink.color
  if (inkColor === DEFAULT_ELEMENT_COLOR) return project
  return {
    ...project,
    elements: project.elements.map((element) => {
      if (element.type === 'image') return element
      if (element.type === 'shape') {
        return {
          ...element,
          strokeColor: element.strokeColor === DEFAULT_ELEMENT_COLOR ? inkColor : element.strokeColor,
          fillColor: element.fillColor === DEFAULT_ELEMENT_COLOR ? inkColor : element.fillColor,
        }
      }
      return {
        ...element,
        color: element.color === DEFAULT_ELEMENT_COLOR ? inkColor : element.color,
      }
    }),
  }
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
      dimensions: { width: 38, height: 38 },
      ink: { mode: 'clean', color: '#1F4E8B', opacity: 0.85, distress: 0.15 },
      outlineSuppressed: true,
      elements: [
        shape({ shape: 'circle', width: 38, height: 38, strokeWidth: 1.2 }),
        curvedText({ text: 'NORTH & PINE CO.', radius: 13.3, startAngle: 303, fontSize: 2.5, letterSpacing: 0.2 }),
        text({ text: 'EST. 2026', y: 1, fontSize: 3.8, letterSpacing: 1.4 }),
        shape({ shape: 'circle', width: 32.3, height: 32.3, strokeWidth: 0.8 }),
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
      dimensions: { width: 38, height: 25 },
      ink: { mode: 'clean', color: '#1F4E8B', opacity: 0.85, distress: 0.15 },
      outlineSuppressed: true,
      elements: [
        shape({ shape: 'rectangle', width: 38, height: 25, strokeColor: '#1F4E8B', strokeWidth: 1.2, filled: false }),
        text({ text: 'COBALT & FINCH', y: -4, fontSize: 2.8, fontWeight: 700, letterSpacing: 0.3, color: '#1F4E8B' }),
        text({ text: 'STUDIO', y: 4, fontSize: 2.4, letterSpacing: 2, color: '#1F4E8B' }),
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
      dimensions: { width: 38, height: 30 },
      ink: { mode: 'clean', color: '#1F4E8B', opacity: 0.85, distress: 0.1 },
      outlineSuppressed: true,
      elements: [
        shape({ shape: 'rectangle', width: 38, height: 30, strokeWidth: 1.2 }),
        text({ text: 'HARBORVIEW LANE 42', y: -6, fontSize: 2.9, align: 'left', x: -15.8 }),
        text({ text: 'PORTVILLE, ST 00000', y: 0, fontSize: 2.5, align: 'left', x: -15.8 }),
        text({ text: 'RETURN TO SENDER', y: 8, fontSize: 1.9, align: 'left', x: -15.8, letterSpacing: 0.6 }),
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
      dimensions: { width: 38, height: 22 },
      ink: { mode: 'clean', color: '#1F4E8B', opacity: 0.85, distress: 0.1 },
      outlineSuppressed: true,
      elements: [
        shape({ shape: 'roundedRectangle', width: 38, height: 22, cornerRadius: 5, strokeWidth: 1.2 }),
        text({ text: 'THE OAKLINE RESIDENCE', y: -3, fontSize: 2.4, fontWeight: 700 }),
        text({ text: '18 MAPLE COURT', y: 4, fontSize: 2.6 }),
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
      dimensions: { width: 38, height: 26 },
      ink: { mode: 'ink', color: '#C4282D', opacity: 0.8, distress: 0.35 },
      outlineSuppressed: true,
      elements: [
        shape({ shape: 'rectangle', width: 38, height: 26, strokeColor: '#C4282D', strokeWidth: 1.2, filled: false }),
        text({ text: 'HANDLE WITH CARE', y: -4, fontSize: 2.2, fontWeight: 700, letterSpacing: 0.3, color: '#C4282D' }),
        shape({ shape: 'line', width: 27, height: 0.5, y: 0, strokeColor: '#C4282D' }),
        text({ text: 'THIS SIDE UP', y: 6, fontSize: 2.5, letterSpacing: 0.7, color: '#C4282D' }),
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
      dimensions: { width: 38, height: 38 },
      ink: { mode: 'ink', color: '#1F4E8B', opacity: 0.75, distress: 0.4 },
      outlineSuppressed: true,
      elements: [
        shape({ shape: 'circle', width: 38, height: 38, strokeWidth: 1.2 }),
        curvedText({ text: 'MADE BY HAND', radius: 13.6, startAngle: 300, fontSize: 3.4, letterSpacing: 0.3 }),
        text({ text: 'SLOWLY MADE', y: 3.3, fontSize: 3.4, letterSpacing: 0.3 }),
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
      dimensions: { width: 38, height: 23.6 },
      ink: { mode: 'clean', color: '#1F4E8B', opacity: 0.85, distress: 0.15 },
      outlineSuppressed: true,
      elements: [
        shape({ shape: 'oval', width: 38, height: 23.6, strokeWidth: 1.2 }),
        text({ text: 'AVERY QUINN', y: -1.7, fontSize: 4.2, fontWeight: 500 }),
        text({ text: 'PERSONAL COPY', y: 5.1, fontSize: 2.5, letterSpacing: 1 }),
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
      dimensions: { width: 38, height: 38 },
      ink: { mode: 'ink', color: '#C4571F', opacity: 0.8, distress: 0.3 },
      outlineSuppressed: true,
      elements: [
        shape({ shape: 'circle', width: 38, height: 38, strokeWidth: 1.2 }),
        shape({ shape: 'circle', width: 31.7, height: 31.7, strokeWidth: 1.4 }),
        text({ text: 'HAND MADE', y: 0, fontSize: 3.6, fontWeight: 700, letterSpacing: 0.2 }),
        text({ text: 'WITH JOY', y: 6.3, fontSize: 3.2, letterSpacing: 1 }),
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
      dimensions: { width: 38, height: 38 },
      ink: { mode: 'ink', color: '#1F7A3D', opacity: 0.8, distress: 0.25 },
      outlineSuppressed: true,
      elements: [
        shape({ shape: 'circle', width: 38, height: 38, strokeColor: '#1F7A3D', strokeWidth: 1.2, filled: false }),
        shape({ shape: 'circle', width: 27.3, height: 27.3, strokeWidth: 0.6, strokeColor: '#1F7A3D' }),
        curvedText({ text: 'THANK YOU', radius: 15.1, startAngle: 322, fontSize: 3.3, fontWeight: 700, letterSpacing: 0.2, color: '#1F7A3D' }),
        text({ text: 'SO MUCH', y: 2.4, fontSize: 3.6, color: '#1F7A3D' }),
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
      dimensions: { width: 38, height: 38 },
      ink: { mode: 'clean', color: '#1F7A3D', opacity: 0.85, distress: 0.1 },
      outlineSuppressed: true,
      elements: [
        shape({ shape: 'circle', width: 38, height: 38, strokeColor: '#1F7A3D', strokeWidth: 1.2, filled: false }),
        shape({ shape: 'circle', width: 33.3, height: 33.3, strokeWidth: 1.2, strokeColor: '#1F7A3D' }),
        text({ text: 'GREAT', y: -3.6, fontSize: 5.9, fontWeight: 700, color: '#1F7A3D' }),
        text({ text: 'JOB!', y: 4.8, fontSize: 5.9, fontWeight: 700, color: '#1F7A3D' }),
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
      dimensions: { width: 38, height: 20 },
      ink: { mode: 'clean', color: '#1F4E8B', opacity: 0.85, distress: 0.1 },
      outlineSuppressed: true,
      elements: [
        shape({ shape: 'rectangle', width: 38, height: 20, strokeColor: '#1F4E8B', strokeWidth: 1.2, filled: false }),
        text({ text: 'REVIEWED', y: -3, fontSize: 3.6, fontWeight: 700, letterSpacing: 0.8, color: '#1F4E8B' }),
        text({ text: 'MS. RAMIREZ’S CLASS', y: 4, fontSize: 2, letterSpacing: 0.2, color: '#1F4E8B' }),
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
      dimensions: { width: 38, height: 38 },
      ink: { mode: 'clean', color: '#1F7A3D', opacity: 0.85, distress: 0.1 },
      outlineSuppressed: true,
      elements: [
        shape({ shape: 'circle', width: 38, height: 38, strokeColor: '#1F7A3D', strokeWidth: 1.2, filled: false }),
        shape({ shape: 'circle', width: 33.5, height: 33.5, strokeWidth: 0.8, strokeColor: '#1F7A3D' }),
        text({ text: 'SEAL', x: 0.2, y: 2.7, fontSize: 7.8, fontWeight: 500, letterSpacing: 1, color: '#1F7A3D' }),
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
      dimensions: { width: 38, height: 28.5 },
      ink: { mode: 'clean', color: '#C4282D', opacity: 0.85, distress: 0.1 },
      outlineSuppressed: true,
      elements: [
        shape({ shape: 'oval', width: 38, height: 28.5, strokeColor: '#C4282D', strokeWidth: 1.2, filled: false }),
        text({ text: 'FRAGILE', x: 0.2, y: 1.4, fontSize: 5.5, fontWeight: 600, letterSpacing: 0.4, align: 'center', color: '#C4282D' }),
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
      dimensions: { width: 38, height: 22 },
      ink: { mode: 'ink', color: '#1F4E8B', opacity: 0.8, distress: 0.2 },
      outlineSuppressed: true,
      elements: [
        shape({ shape: 'rectangle', width: 38, height: 22, strokeWidth: 1.2 }),
        text({ text: 'RECEIVED', y: -4, fontSize: 4.1, fontWeight: 700, letterSpacing: 1.6 }),
        shape({ shape: 'line', width: 28, height: 0.5, y: 0 }),
        text({ text: 'DATE: __ / __ / __', y: 6, fontSize: 2.8 }),
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
      dimensions: { width: 38, height: 38 },
      ink: { mode: 'ink', color: '#1F4E8B', opacity: 0.85, distress: 0.2 },
      outlineSuppressed: true,
      elements: [
        shape({ shape: 'circle', width: 38, height: 38, strokeWidth: 1.2 }),
        shape({ shape: 'circle', width: 32.3, height: 32.3, strokeWidth: 0.8 }),
        curvedText({ text: 'SHREE ENTERPRISES', radius: 13.3, startAngle: 295, fontSize: 2.7, letterSpacing: 0.2 }),
        text({ text: 'PROPRIETOR', y: -1, fontSize: 3.2, letterSpacing: 1 }),
        text({ text: 'GSTIN 27ABCDE1234F1Z5', y: 5.7, fontSize: 2.2, letterSpacing: 0 }),
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
      dimensions: { width: 38, height: 26 },
      ink: { mode: 'ink', color: '#8B2E1F', opacity: 0.8, distress: 0.25 },
      outlineSuppressed: true,
      elements: [
        shape({ shape: 'rectangle', width: 38, height: 26, strokeWidth: 1.2 }),
        text({ text: 'RECEIVED WITH THANKS', y: -7, fontSize: 2.1, fontWeight: 700, letterSpacing: 0.2 }),
        shape({ shape: 'line', width: 30, height: 0.5, y: -1 }),
        text({ text: 'AMOUNT: ₹ __________', y: 4, fontSize: 2.3, align: 'left', x: -15.2 }),
        text({ text: 'DATE: __ / __ / __', y: 10, fontSize: 2.1, align: 'left', x: -15.2 }),
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
      dimensions: { width: 38, height: 22 },
      ink: { mode: 'clean', color: '#1F4E8B', opacity: 0.85, distress: 0.1 },
      outlineSuppressed: true,
      elements: [
        shape({ shape: 'rectangle', width: 38, height: 22, strokeWidth: 1.2 }),
        text({ text: 'RAJ TRADING CO.', y: -5, fontSize: 2.9, fontWeight: 700, letterSpacing: 0.3 }),
        shape({ shape: 'line', width: 30, height: 0.5, y: 0 }),
        text({ text: 'AUTHORISED SIGNATORY', y: 6, fontSize: 1.9, letterSpacing: 0.3 }),
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
      dimensions: { width: 38, height: 23.75 },
      ink: { mode: 'ink', color: '#1F4E8B', opacity: 0.85, distress: 0.2 },
      outlineSuppressed: true,
      elements: [
        shape({ shape: 'oval', width: 38, height: 23.75, strokeWidth: 1.2 }),
        text({ text: 'ADV. SUNITA MEHTA', y: -2.4, fontSize: 2.7, fontWeight: 700, letterSpacing: 0.3 }),
        text({ text: 'B.A. LL.B, ADVOCATE', y: 2.4, fontSize: 2.1, letterSpacing: 0.3 }),
        text({ text: 'HIGH COURT, MUMBAI', y: 6.3, fontSize: 2.1, letterSpacing: 0.3 }),
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
      dimensions: { width: 38, height: 38 },
      ink: { mode: 'clean', color: '#1F4E8B', opacity: 0.85, distress: 0.15 },
      outlineSuppressed: true,
      elements: [
        shape({ shape: 'circle', width: 38, height: 38, strokeWidth: 1.2 }),
        shape({ shape: 'circle', width: 32.3, height: 32.3, strokeWidth: 0.6 }),
        shape({ shape: 'circle', width: 20.9, height: 20.9, strokeWidth: 0.6 }),
        curvedText({ text: 'STAMP MAKERS INDIA', radius: 13.8, startAngle: 306, fontSize: 2.1, letterSpacing: 0.2 }),
        curvedText({
          text: 'MANANTHAVADY',
          radius: 13.8,
          startAngle: 221,
          direction: 'counterclockwise',
          fontSize: 2.5,
          letterSpacing: 0.2,
        }),
        text({ text: '2026', y: 1, fontSize: 5.7, fontWeight: 600, letterSpacing: 1 }),
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
      dimensions: { width: 48, height: 48 },
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
      dimensions: { width: 38, height: 20 },
      ink: { mode: 'ink', color: '#1F7A3D', opacity: 0.8, distress: 0.3 },
      outlineSuppressed: true,
      elements: [
        shape({ shape: 'roundedRectangle', width: 38, height: 20, cornerRadius: 4, strokeColor: '#1F7A3D', strokeWidth: 1.2, filled: false }),
        text({ text: 'APPROVED', y: 1, fontSize: 5.2, fontWeight: 700, letterSpacing: 0.8, color: '#1F7A3D' }),
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
      dimensions: { width: 38, height: 32 },
      ink: { mode: 'ink', color: '#8B2E1F', opacity: 0.8, distress: 0.3 },
      outlineSuppressed: true,
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
      dimensions: { width: 38, height: 32 },
      ink: { mode: 'ink', color: '#1F4E8B', opacity: 0.8, distress: 0.25 },
      outlineSuppressed: true,
      elements: [
        shape({ shape: 'rectangle', width: 38, height: 32, strokeColor: '#1F4E8B', strokeWidth: 1.2, filled: false }),
        text({ text: 'RECEIVED', y: -10, fontSize: 3.1, fontWeight: 700, letterSpacing: 0.7, color: '#1F4E8B' }),
        shape({ shape: 'line', width: 31, height: 0.5, y: -5, strokeColor: '#1F4E8B' }),
        text({ text: 'BY: ______________', y: -1, fontSize: 2.2, align: 'left', x: -15.4, color: '#1F4E8B' }),
        text({ text: 'DATE: __ / __ / __', y: 5, fontSize: 2.2, align: 'left', x: -15.4, color: '#1F4E8B' }),
        text({ text: 'AMOUNT: ____________', y: 11, fontSize: 2.2, align: 'left', x: -15.4, color: '#1F4E8B' }),
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
      dimensions: { width: 38, height: 45 },
      ink: { mode: 'ink', color: '#1F4E8B', opacity: 0.85, distress: 0.2 },
      outlineSuppressed: true,
      elements: [
        shape({ shape: 'triangle', width: 38, height: 45, strokeWidth: 1.2 }),
        text({ text: 'Authorised', y: 3, fontSize: 2.4, fontWeight: 600 }),
        text({ text: 'Signatory', y: 8, fontSize: 2.4, fontWeight: 600 }),
        text({ text: 'YOUR COMPANY PVT. LTD.', y: 16, fontSize: 1.8, letterSpacing: 0.1 }),
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
      dimensions: { width: 38, height: 38 },
      ink: { mode: 'ink', color: '#1F4E8B', opacity: 0.85, distress: 0.2 },
      outlineSuppressed: true,
      elements: [
        shape({ shape: 'circle', width: 38, height: 38, strokeWidth: 1.2 }),
        shape({ shape: 'circle', width: 32.6, height: 32.6, strokeWidth: 0.8 }),
        curvedText({ text: 'INDIA BANK LIMITED', radius: 14, startAngle: 306, fontSize: 2.2, letterSpacing: 0.2 }),
        curvedText({
          text: 'MUMBAI BRANCH',
          radius: 14,
          startAngle: 225,
          direction: 'counterclockwise',
          fontSize: 2.5,
          letterSpacing: 0.2,
        }),
        text({ text: 'BRANCH 0004', y: -2.7, fontSize: 2.7, fontWeight: 600, letterSpacing: 0.3 }),
        text({ text: 'DATE: __________', y: 2.7, fontSize: 2.4 }),
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
      dimensions: { width: 38, height: 38 },
      ink: { mode: 'ink', color: '#1F4E8B', opacity: 0.85, distress: 0.2 },
      outlineSuppressed: true,
      elements: [
        shape({ shape: 'circle', width: 38, height: 38, strokeWidth: 1.2 }),
        shape({ shape: 'circle', width: 32.8, height: 32.8, strokeWidth: 0.8 }),
        shape({ shape: 'circle', width: 22.5, height: 22.5, strokeWidth: 0.6 }),
        curvedText({ text: 'FTFC COURIER SERVICES', radius: 14.3, startAngle: 309, fontSize: 1.7, letterSpacing: 0.2 }),
        curvedText({
          text: 'PVT. LTD.',
          radius: 14.3,
          startAngle: 208,
          direction: 'counterclockwise',
          fontSize: 2.1,
          letterSpacing: 0.4,
        }),
        text({ text: 'LOCAL &', y: -1.7, fontSize: 2.6, letterSpacing: 0.3 }),
        text({ text: 'INTERNATIONAL', y: 2.6, fontSize: 1.7, letterSpacing: 0 }),
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
      dimensions: { width: 38, height: 50 },
      ink: { mode: 'clean', color: '#1F4E8B', opacity: 0.85, distress: 0.1 },
      outlineSuppressed: true,
      elements: [
        shape({ shape: 'rectangle', width: 38, height: 50, strokeWidth: 1.2 }),
        text({ text: 'YOUR COMPANY', y: -19, fontSize: 2.7, fontWeight: 700, letterSpacing: 0.2 }),
        qrCode({ content: 'https://example.com', contentType: 'text', size: 22, y: -2 }),
        text({ text: 'SCAN TO VERIFY', y: 18, fontSize: 2.3, letterSpacing: 0.4 }),
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
      dimensions: { width: 38, height: 24 },
      ink: { mode: 'clean', color: '#1F4E8B', opacity: 0.85, distress: 0.1 },
      outlineSuppressed: true,
      elements: [
        shape({ shape: 'rectangle', width: 38, height: 24, strokeWidth: 1.2 }),
        text({ text: 'StampJam Technologies', y: -6, fontSize: 2.2, fontWeight: 700, letterSpacing: 0.1 }),
        text({ text: '__________  Partner', y: 5, fontSize: 2.4, align: 'right', x: 16.7 }),
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
      dimensions: { width: 38, height: 30 },
      ink: { mode: 'clean', color: '#1F4E8B', opacity: 0.85, distress: 0.1 },
      outlineSuppressed: true,
      elements: [
        shape({ shape: 'rectangle', width: 38, height: 30, strokeWidth: 1.2 }),
        text({ text: 'SAMPLE ADDRESS STAMP', y: -9, fontSize: 2.2, fontWeight: 700, letterSpacing: 0.2 }),
        text({ text: 'ADDRESS LINE 1', y: -3, fontSize: 2.2 }),
        text({ text: 'STREET NAME', y: 1, fontSize: 2.2 }),
        text({ text: 'ZIP CODE', y: 5, fontSize: 2.2 }),
        text({ text: '022 - 20040024', y: 9, fontSize: 2.2, fontWeight: 600 }),
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
      ink: { mode: 'clean', color: '#1F4E8B', opacity: 0.85, distress: 0.1 },
      outlineSuppressed: true,
      elements: [
        shape({ shape: 'rectangle', width: 66, height: 40, strokeWidth: 1.2 }),
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
