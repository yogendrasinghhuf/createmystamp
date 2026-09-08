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
        curvedText({ text: 'NORTH & PINE CO.', radius: 16, startAngle: 200, fontSize: 4.2 }),
        text({ text: 'EST. 2026', y: 0, fontSize: 5, letterSpacing: 2 }),
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
        text({ text: 'COBALT & FINCH', y: -4, fontSize: 5.5, fontWeight: 700, letterSpacing: 1 }),
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
        text({ text: 'RETURN TO SENDER', y: 8, fontSize: 3.2, align: 'left', x: -25, letterSpacing: 1.5 }),
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
        text({ text: 'THE OAKLINE RESIDENCE', y: -3, fontSize: 4, fontWeight: 700 }),
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
        text({ text: 'HANDLE WITH CARE', y: -4, fontSize: 5, fontWeight: 700, letterSpacing: 1.5 }),
        shape({ shape: 'line', width: 36, height: 0.5, y: 0 }),
        text({ text: 'THIS SIDE UP', y: 6, fontSize: 3.5, letterSpacing: 2 }),
      ],
    },
  },
  {
    id: 'packaging-madeby',
    name: 'Made By Hand',
    category: 'Packaging',
    project: {
      name: 'Made By Hand',
      shape: 'circle',
      dimensions: { width: 35, height: 35 },
      ink: { mode: 'ink', color: '#2B2A28', opacity: 0.75, distress: 0.4 },
      elements: [
        curvedText({ text: 'MADE BY HAND', radius: 14, startAngle: 200, fontSize: 3.8 }),
        text({ text: 'SLOWLY MADE', y: 2, fontSize: 3.6, letterSpacing: 1 }),
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
        text({ text: 'AVERY QUINN', y: -2, fontSize: 5.5, fontWeight: 500 }),
        text({ text: 'PERSONAL COPY', y: 6, fontSize: 3, letterSpacing: 2 }),
      ],
    },
  },
  {
    id: 'personal-bookplate',
    name: 'From the Library Of',
    category: 'Personal',
    project: {
      name: 'From the Library Of',
      shape: 'circle',
      dimensions: { width: 38, height: 38 },
      ink: { mode: 'clean', color: '#2B2A28', opacity: 0.85, distress: 0.15 },
      elements: [
        curvedText({ text: 'FROM THE LIBRARY OF', radius: 15, startAngle: 200, fontSize: 3.6 }),
        text({ text: 'R. ASHWORTH', y: 2, fontSize: 4.5, fontWeight: 500 }),
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
        text({ text: 'HAND MADE', y: 0, fontSize: 4.2, fontWeight: 700, letterSpacing: 1 }),
        text({ text: 'WITH JOY', y: 6, fontSize: 3, letterSpacing: 2 }),
      ],
    },
  },
  {
    id: 'creative-thankyou',
    name: 'Thank You Burst',
    category: 'Creative',
    project: {
      name: 'Thank You Burst',
      shape: 'circle',
      dimensions: { width: 32, height: 32 },
      ink: { mode: 'ink', color: '#2B2A28', opacity: 0.8, distress: 0.25 },
      elements: [
        curvedText({ text: 'THANK YOU', radius: 12, startAngle: 200, fontSize: 3.8, fontWeight: 700 }),
        text({ text: 'SO MUCH', y: 2, fontSize: 3.4 }),
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
      ink: { mode: 'clean', color: '#2B2A28', opacity: 0.85, distress: 0.1 },
      elements: [
        shape({ shape: 'circle', width: 28, height: 28, strokeWidth: 1.2 }),
        text({ text: 'GREAT', y: -3, fontSize: 5, fontWeight: 700 }),
        text({ text: 'JOB!', y: 4, fontSize: 5, fontWeight: 700 }),
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
        text({ text: 'MS. RAMIREZ’S CLASS', y: 4, fontSize: 3, letterSpacing: 1 }),
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
        text({ text: 'J R L', y: 0, fontSize: 8, fontWeight: 500, letterSpacing: 4 }),
      ],
    },
  },
  {
    id: 'monogram-interlock',
    name: 'Interlock Initials',
    category: 'Monogram',
    project: {
      name: 'Interlock Initials',
      shape: 'oval',
      dimensions: { width: 32, height: 24 },
      ink: { mode: 'clean', color: '#2B2A28', opacity: 0.85, distress: 0.1 },
      elements: [text({ text: 'M · K', y: 0, fontSize: 8, fontWeight: 600, letterSpacing: 2 })],
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
]
