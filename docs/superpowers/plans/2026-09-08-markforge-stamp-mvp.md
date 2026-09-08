# MarkForge Stamp Studio MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete, client-only MVP of "MarkForge" — an online custom-stamp design tool with an SVG-based editor (shapes, text, curved text, images, ink preview), ~15 original templates, PNG/SVG export, localStorage persistence, and a responsive marketing site with legal/informational pages.

**Architecture:** React + TypeScript + Vite SPA, styled with Tailwind CSS, single Zustand store driving a live SVG canvas. No backend, no auth, no database — `localStorage` is the only persistence. React Router handles the small set of pages. The editor's data model (`StampElement` discriminated union) is the single source of truth consumed by the canvas renderer, properties panel, export pipeline, and template loader alike.

**Tech Stack:** React 18, TypeScript (strict), Vite, Tailwind CSS, Zustand, lucide-react, react-router-dom. No test framework requested/needed for this MVP — verification is via `tsc --noEmit`, `vite build`, and manual dev-server walkthroughs (documented per task).

**Spec:** `C:\proj_stamp\Requirements.docx` (full text captured in the design conversation) — the original product spec. This plan implements it directly; no separate spec doc was written (a locked spec already existed).

## Global Constraints

- Client-side only: no backend, no database, no auth, no CI/CD, no payments, no analytics.
- No PDF export (decided: PNG + SVG only for this MVP).
- Fonts: system font stacks only, no bundled/Google Fonts.
- Icons: `lucide-react` (ISC licensed).
- State: single Zustand store (`useStampStore`), not React Context/prop drilling.
- Brand working name: **MarkForge** — code must not hardcode the name in ways that block an easy rename (keep it in one config/constants spot plus normal copy).
- Visual identity: warm off-white background, charcoal text, one distinctive accent color, strong typography, generous whitespace, subtle borders, light shadow, rounded components. Must NOT resemble a traditional rubber-stamp site or copy any reference competitor's branding/layout/art.
- Original content only: no copied copy, templates, art, icons (beyond licensed lucide-react), or layouts from competitor sites. No real government/court/bank seals or insignia in templates or examples.
- ~15 original templates across categories: Business, Address, Packaging, Personal, Creative, Teacher, Monogram, Date.
- Uploaded SVGs must be sanitized (strip scripts, event handlers, external references) before rendering.
- Mobile: editor must use a genuinely different mobile layout (bottom toolbar + bottom sheet), not a shrunk desktop layout; comfortable touch targets.
- Basic SEO: page titles, meta descriptions, Open Graph tags per page, `robots.txt`, `sitemap.xml`.
- No fake buttons, no non-functional controls — every visible control must work.
- Code quality: small reusable components, clear TypeScript types, no unnecessary abstractions/dependencies.

---

## File Structure

```
proj_stamp/
  index.html
  package.json, tsconfig.json, vite.config.ts, tailwind.config.ts, postcss.config.js
  public/
    robots.txt
    sitemap.xml
  src/
    main.tsx
    App.tsx                       # Router setup
    index.css                     # Tailwind directives + base styles
    config/
      brand.ts                    # { name, tagline, accentColor } — single rename point
    types/
      stamp.ts                    # StampElement union, StampShape, InkSettings, StampProject
    lib/
      id.ts                       # uid() helper
      geometry.ts                 # rotation/point math shared by canvas + curved text
      curvedText.ts               # arc path generation for curved text
      sanitizeSvg.ts              # SVG upload sanitizer
      history.ts                  # undo/redo stack helper (generic)
      persistence.ts              # localStorage save/load/clear for StampProject
      exportPng.ts                # SVG string -> PNG blob at 1x/2x/3x
      exportSvg.ts                # live SVG -> standalone SVG string
      svgSerialize.ts             # shared helper: clone canvas SVG minus editor chrome
    store/
      useStampStore.ts            # Zustand store: project state, selection, history actions
    data/
      fonts.ts                    # curated system font stack list
      templates.ts                # ~15 template definitions
      templateCategories.ts       # category labels/order
    components/
      ui/
        Button.tsx
        IconButton.tsx
        Panel.tsx
        Slider.tsx
        ColorSwatch.tsx
        Select.tsx
        Tabs.tsx
      layout/
        Header.tsx
        Footer.tsx
        PageShell.tsx              # shared max-width/padding wrapper + SEO head tags
      editor/
        StampCanvas.tsx            # SVG canvas: renders elements, selection handles, pan/zoom
        CanvasElementView.tsx      # renders one StampElement as SVG node(s)
        SelectionOverlay.tsx       # selection box + rotate/resize handles
        Toolbar.tsx                # desktop left tool rail (add shape/text/image)
        LayerList.tsx              # layer order list with reordering
        PropertiesPanel.tsx        # desktop right panel; dispatches to sub-panels below
        TextProperties.tsx
        CurvedTextProperties.tsx
        ShapeProperties.tsx
        ImageProperties.tsx
        StampSettingsPanel.tsx     # shape/dimensions/ink settings
        InkPreviewControls.tsx
        ExportPanel.tsx
        MobileToolbar.tsx          # bottom icon bar (mobile)
        MobileBottomSheet.tsx      # slide-up sheet wrapping PropertiesPanel content (mobile)
        EditorTopBar.tsx           # New/Save/Load/Reset + undo/redo buttons
      templates/
        TemplateCard.tsx
        TemplateGrid.tsx
      home/
        Hero.tsx
        HowItWorksSection.tsx
        FeaturesSection.tsx
        TemplatesPreviewSection.tsx
        ExportSection.tsx
        UseCasesSection.tsx
        FaqPreviewSection.tsx
        FinalCtaSection.tsx
    pages/
      HomePage.tsx
      StampStudioPage.tsx
      TemplatesPage.tsx
      HowItWorksPage.tsx
      FaqPage.tsx
      PrivacyPage.tsx
      TermsPage.tsx
      ResponsibleUsePage.tsx
      NotFoundPage.tsx
```

---

## Task 1: Project Scaffold (Vite + React + TS + Tailwind)

**Files:**
- Create: `package.json`, `tsconfig.json`, `tsconfig.node.json`, `vite.config.ts`, `tailwind.config.ts`, `postcss.config.js`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/index.css`, `.gitignore`
- Create: `src/config/brand.ts`

**Interfaces:**
- Produces: `BRAND` constant (`{ name: string; tagline: string; accent: string }`) importable from `src/config/brand.ts`, used by Header/Footer/pages for the site name and accent color everywhere so a rename touches one file.
- Produces: Tailwind theme tokens `bg-paper` (warm off-white), `text-ink` (charcoal), `text-accent`/`bg-accent`/`border-accent` (the one accent color), configured in `tailwind.config.ts`.

- [ ] **Step 1: Scaffold the Vite project**

Run:
```bash
cd /c/proj_stamp
npm create vite@latest . -- --template react-ts
```
When prompted about the non-empty directory (Requirements.docx present), choose to continue/ignore — do not delete `Requirements.docx`.

- [ ] **Step 2: Install dependencies**

```bash
npm install
npm install zustand lucide-react react-router-dom
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

- [ ] **Step 3: Configure Tailwind theme tokens**

Edit `tailwind.config.ts`:
```ts
import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#FAF7F2',
        ink: '#2B2A28',
        accent: {
          DEFAULT: '#C4571F',
          light: '#E08A4F',
          dark: '#9A4315',
        },
        line: '#E4DFD6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Segoe UI', 'Arial', 'sans-serif'],
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        mono: ['Consolas', 'Menlo', 'monospace'],
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
} satisfies Config
```

Note: `Inter` in the sans stack resolves to the user's installed Inter or falls back to system fonts — no font files are bundled, per the system-font-stack decision.

- [ ] **Step 4: Set up base CSS**

Edit `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html, body, #root {
  height: 100%;
}

body {
  @apply bg-paper text-ink antialiased;
}
```

- [ ] **Step 5: Create the brand config**

Create `src/config/brand.ts`:
```ts
export const BRAND = {
  name: 'MarkForge',
  tagline: 'Make your mark.',
  supportingCopy:
    'Design a clean, professional stamp in your browser. Customize it, preview it, and export it when you\'re ready.',
  accent: '#C4571F',
} as const
```

- [ ] **Step 6: Wire up router shell**

Create `src/App.tsx`:
```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import StampStudioPage from './pages/StampStudioPage'
import TemplatesPage from './pages/TemplatesPage'
import HowItWorksPage from './pages/HowItWorksPage'
import FaqPage from './pages/FaqPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'
import ResponsibleUsePage from './pages/ResponsibleUsePage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/studio" element={<StampStudioPage />} />
        <Route path="/templates" element={<TemplatesPage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/responsible-use" element={<ResponsibleUsePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
```

This will fail to compile until pages exist — that's expected; Task 2 stubs them all so the app builds.

- [ ] **Step 7: Commit**

```bash
cd /c/proj_stamp
git init
git add -A
git commit -m "chore: scaffold Vite+React+TS+Tailwind project with brand config"
```

---

## Task 2: Core Types, Placeholder Pages, and App Boots

**Files:**
- Create: `src/types/stamp.ts`
- Create: `src/pages/HomePage.tsx`, `src/pages/StampStudioPage.tsx`, `src/pages/TemplatesPage.tsx`, `src/pages/HowItWorksPage.tsx`, `src/pages/FaqPage.tsx`, `src/pages/PrivacyPage.tsx`, `src/pages/TermsPage.tsx`, `src/pages/ResponsibleUsePage.tsx`, `src/pages/NotFoundPage.tsx` (stubs)
- Create: `src/components/layout/PageShell.tsx`, `src/components/layout/Header.tsx`, `src/components/layout/Footer.tsx`

**Interfaces:**
- Produces (from `src/types/stamp.ts`):
  ```ts
  export type StampShapeKind = 'circle' | 'oval' | 'rectangle' | 'roundedRectangle' | 'badge'

  export interface StampDimensions { width: number; height: number } // mm, canvas units

  export interface InkSettings {
    mode: 'clean' | 'ink'
    color: string
    opacity: number   // 0-1
    distress: number  // 0-1
  }

  export interface ElementCommon {
    id: string
    x: number
    y: number
    rotation: number   // degrees
    scale: number
    zIndex: number
  }

  export interface TextElement extends ElementCommon {
    type: 'text'
    text: string
    fontFamily: string
    fontSize: number
    fontWeight: number
    letterSpacing: number
    align: 'left' | 'center' | 'right'
    color: string
    multiline: boolean
  }

  export interface CurvedTextElement extends ElementCommon {
    type: 'curvedText'
    text: string
    fontFamily: string
    fontSize: number
    fontWeight: number
    letterSpacing: number
    color: string
    radius: number
    startAngle: number   // degrees, 0 = top, clockwise
    direction: 'clockwise' | 'counterclockwise'
  }

  export type ShapeKind = 'circle' | 'rectangle' | 'roundedRectangle' | 'line'

  export interface ShapeElement extends ElementCommon {
    type: 'shape'
    shape: ShapeKind
    width: number
    height: number
    strokeColor: string
    strokeWidth: number
    fillColor: string
    filled: boolean
    cornerRadius?: number  // roundedRectangle only
  }

  export interface ImageElement extends ElementCommon {
    type: 'image'
    src: string       // data URL (sanitized if SVG)
    width: number
    height: number
    isSvg: boolean
  }

  export type StampElement = TextElement | CurvedTextElement | ShapeElement | ImageElement

  export interface StampProject {
    id: string
    name: string
    shape: StampShapeKind
    dimensions: StampDimensions
    elements: StampElement[]
    ink: InkSettings
    updatedAt: number
  }
  ```
- Produces: `PageShell` component with props `{ title: string; description: string; children: ReactNode }` that sets `document.title` and a meta description tag (used by every page for basic SEO), plus renders `Header`/`Footer` around children.

- [ ] **Step 1: Write the types file**

Create `src/types/stamp.ts` with the exact interfaces shown above.

- [ ] **Step 2: Build PageShell for per-page SEO**

Create `src/components/layout/PageShell.tsx`:
```tsx
import { useEffect, type ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'

interface PageShellProps {
  title: string
  description: string
  children: ReactNode
}

export default function PageShell({ title, description, children }: PageShellProps) {
  useEffect(() => {
    document.title = title
    let meta = document.querySelector('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', 'description')
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', description)

    let ogTitle = document.querySelector('meta[property="og:title"]')
    if (!ogTitle) {
      ogTitle = document.createElement('meta')
      ogTitle.setAttribute('property', 'og:title')
      document.head.appendChild(ogTitle)
    }
    ogTitle.setAttribute('content', title)

    let ogDesc = document.querySelector('meta[property="og:description"]')
    if (!ogDesc) {
      ogDesc = document.createElement('meta')
      ogDesc.setAttribute('property', 'og:description')
      document.head.appendChild(ogDesc)
    }
    ogDesc.setAttribute('content', description)
  }, [title, description])

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
```

- [ ] **Step 3: Build Header and Footer**

Create `src/components/layout/Header.tsx`:
```tsx
import { Link, NavLink } from 'react-router-dom'
import { BRAND } from '../../config/brand'

const navLinks = [
  { to: '/studio', label: 'Stamp Studio' },
  { to: '/templates', label: 'Templates' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/faq', label: 'FAQ' },
]

export default function Header() {
  return (
    <header className="border-b border-line bg-paper">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-lg font-semibold tracking-tight text-ink">
          {BRAND.name}
        </Link>
        <nav className="hidden gap-6 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive ? 'text-accent' : 'text-ink/70 hover:text-ink'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <Link
          to="/studio"
          className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-accent"
        >
          Open Stamp Studio
        </Link>
      </div>
    </header>
  )
}
```

Create `src/components/layout/Footer.tsx`:
```tsx
import { Link } from 'react-router-dom'
import { BRAND } from '../../config/brand'

const legalLinks = [
  { to: '/privacy', label: 'Privacy' },
  { to: '/terms', label: 'Terms' },
  { to: '/responsible-use', label: 'Responsible Use' },
]

export default function Footer() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 text-sm text-ink/60 md:flex-row md:items-center md:justify-between">
        <p>&copy; {new Date().getFullYear()} {BRAND.name}. All rights reserved.</p>
        <nav className="flex gap-4">
          {legalLinks.map((link) => (
            <Link key={link.to} to={link.to} className="hover:text-ink">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}
```

- [ ] **Step 4: Stub every page with PageShell**

Create each page file following this pattern (shown for `HowItWorksPage`; repeat for `FaqPage`, `PrivacyPage`, `TermsPage`, `ResponsibleUsePage`, `TemplatesPage`, `StampStudioPage` with appropriate title/description — real content added in later tasks):

```tsx
// src/pages/HowItWorksPage.tsx
import PageShell from '../components/layout/PageShell'
import { BRAND } from '../config/brand'

export default function HowItWorksPage() {
  return (
    <PageShell
      title={`How It Works — ${BRAND.name}`}
      description="See how to design, customize, and export a custom stamp online in minutes."
    >
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-semibold">How It Works</h1>
      </div>
    </PageShell>
  )
}
```

Create `src/pages/NotFoundPage.tsx`:
```tsx
import { Link } from 'react-router-dom'
import PageShell from '../components/layout/PageShell'

export default function NotFoundPage() {
  return (
    <PageShell title="Page not found" description="This page does not exist.">
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="text-2xl font-semibold">Page not found</h1>
        <Link to="/" className="mt-4 inline-block text-accent underline">
          Back home
        </Link>
      </div>
    </PageShell>
  )
}
```

`HomePage` and `StampStudioPage` get fleshed out in Tasks 11 and 12 respectively — for now stub them the same minimal way so the app compiles and routes resolve.

- [ ] **Step 5: Wire main.tsx**

Create `src/main.tsx`:
```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- [ ] **Step 6: Verify the app builds and boots**

Run:
```bash
cd /c/proj_stamp
npx tsc --noEmit
npm run build
```
Expected: both succeed with no errors.

Then run `npm run dev` and open the printed local URL — verify the header/footer render and each nav link routes to its stub page without a console error. Stop the dev server after checking.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add stamp types, page routing shell, header/footer"
```

---

## Task 3: Geometry, ID, and Curved-Text Math Utilities

**Files:**
- Create: `src/lib/id.ts`
- Create: `src/lib/geometry.ts`
- Create: `src/lib/curvedText.ts`

**Interfaces:**
- Produces: `uid(): string` from `src/lib/id.ts`.
- Produces from `src/lib/geometry.ts`:
  ```ts
  export function degToRad(deg: number): number
  export function rotatePoint(px: number, py: number, cx: number, cy: number, angleDeg: number): { x: number; y: number }
  export function clamp(value: number, min: number, max: number): number
  ```
- Produces from `src/lib/curvedText.ts`:
  ```ts
  export function buildCurvedTextArcPath(radius: number, startAngleDeg: number, direction: 'clockwise' | 'counterclockwise'): string
  // Returns an SVG path `d` string for a circular arc suitable for <textPath>,
  // centered at (0,0) in the element's local coordinate space, spanning 300
  // degrees from startAngleDeg in the given direction (leaves a gap so the
  // path isn't a closed loop, which SVG textPath handles better).
  ```

- [ ] **Step 1: Write id.ts**

```ts
// src/lib/id.ts
export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}
```

- [ ] **Step 2: Write geometry.ts**

```ts
// src/lib/geometry.ts
export function degToRad(deg: number): number {
  return (deg * Math.PI) / 180
}

export function rotatePoint(
  px: number,
  py: number,
  cx: number,
  cy: number,
  angleDeg: number,
): { x: number; y: number } {
  const rad = degToRad(angleDeg)
  const cos = Math.cos(rad)
  const sin = Math.sin(rad)
  const dx = px - cx
  const dy = py - cy
  return {
    x: cx + dx * cos - dy * sin,
    y: cy + dx * sin + dy * cos,
  }
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}
```

- [ ] **Step 3: Write curvedText.ts**

```ts
// src/lib/curvedText.ts
import { degToRad } from './geometry'

export function buildCurvedTextArcPath(
  radius: number,
  startAngleDeg: number,
  direction: 'clockwise' | 'counterclockwise',
): string {
  const sweepDeg = 300 // leave a 60-degree gap so it's an open arc, not a closed loop
  const endAngleDeg =
    direction === 'clockwise' ? startAngleDeg + sweepDeg : startAngleDeg - sweepDeg

  const start = {
    x: radius * Math.cos(degToRad(startAngleDeg - 90)),
    y: radius * Math.sin(degToRad(startAngleDeg - 90)),
  }
  const end = {
    x: radius * Math.cos(degToRad(endAngleDeg - 90)),
    y: radius * Math.sin(degToRad(endAngleDeg - 90)),
  }

  const largeArcFlag = sweepDeg > 180 ? 1 : 0
  const sweepFlag = direction === 'clockwise' ? 1 : 0

  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${end.x} ${end.y}`
}
```

- [ ] **Step 4: Sanity-check the math in the dev console**

Run `npm run dev`, open the browser devtools console on any page, and paste (adjust the relative import isn't available in console, so instead temporarily log from `App.tsx`'s top level during dev, then remove):
```ts
console.log(buildCurvedTextArcPath(50, 0, 'clockwise'))
```
Expected: a string starting with `M` and containing `A 50 50 0 1 1`. Remove the temporary console.log before committing.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add geometry and curved-text arc math utilities"
```

---

## Task 4: Zustand Store with Undo/Redo

**Files:**
- Create: `src/lib/history.ts`
- Create: `src/store/useStampStore.ts`

**Interfaces:**
- Consumes: `StampProject`, `StampElement` types from `src/types/stamp.ts` (Task 2); `uid` from `src/lib/id.ts` (Task 3).
- Produces:
  ```ts
  // src/lib/history.ts
  export interface HistoryState<T> {
    past: T[]
    present: T
    future: T[]
  }
  export function pushHistory<T>(history: HistoryState<T>, next: T): HistoryState<T>
  export function undoHistory<T>(history: HistoryState<T>): HistoryState<T>
  export function redoHistory<T>(history: HistoryState<T>): HistoryState<T>
  ```
  ```ts
  // src/store/useStampStore.ts
  export interface StampStore {
    project: StampProject
    selectedIds: string[]
    canUndo: boolean
    canRedo: boolean
    setShape: (shape: StampShapeKind) => void
    setDimensions: (dimensions: StampDimensions) => void
    setInk: (ink: Partial<InkSettings>) => void
    addElement: (element: StampElement) => void
    updateElement: (id: string, patch: Partial<StampElement>) => void
    removeElement: (id: string) => void
    duplicateElement: (id: string) => void
    reorderElement: (id: string, direction: 'up' | 'down') => void
    select: (ids: string[]) => void
    undo: () => void
    redo: () => void
    loadProject: (project: StampProject) => void
    resetProject: () => void
  }
  export function createDefaultProject(): StampProject
  export const useStampStore: UseBoundStore<StoreApi<StampStore>>
  ```
  Every later editor component (Canvas, Toolbar, PropertiesPanel, LayerList, ExportPanel, templates loader, persistence autosave) consumes `useStampStore` by these exact action names.

- [ ] **Step 1: Write the generic history helper**

Create `src/lib/history.ts`:
```ts
export interface HistoryState<T> {
  past: T[]
  present: T
  future: T[]
}

const MAX_HISTORY = 50

export function pushHistory<T>(history: HistoryState<T>, next: T): HistoryState<T> {
  return {
    past: [...history.past, history.present].slice(-MAX_HISTORY),
    present: next,
    future: [],
  }
}

export function undoHistory<T>(history: HistoryState<T>): HistoryState<T> {
  if (history.past.length === 0) return history
  const previous = history.past[history.past.length - 1]
  return {
    past: history.past.slice(0, -1),
    present: previous,
    future: [history.present, ...history.future],
  }
}

export function redoHistory<T>(history: HistoryState<T>): HistoryState<T> {
  if (history.future.length === 0) return history
  const next = history.future[0]
  return {
    past: [...history.past, history.present],
    present: next,
    future: history.future.slice(1),
  }
}
```

- [ ] **Step 2: Write createDefaultProject and the store**

Create `src/store/useStampStore.ts`:
```ts
import { create } from 'zustand'
import type { StampProject, StampElement, StampShapeKind, StampDimensions, InkSettings } from '../types/stamp'
import { uid } from '../lib/id'
import { pushHistory, undoHistory, redoHistory, type HistoryState } from '../lib/history'

export function createDefaultProject(): StampProject {
  return {
    id: uid(),
    name: 'Untitled stamp',
    shape: 'circle',
    dimensions: { width: 40, height: 40 },
    elements: [],
    ink: { mode: 'clean', color: '#2B2A28', opacity: 0.85, distress: 0.2 },
    updatedAt: Date.now(),
  }
}

interface StampStoreState {
  history: HistoryState<StampProject>
  selectedIds: string[]
}

export interface StampStore {
  project: StampProject
  selectedIds: string[]
  canUndo: boolean
  canRedo: boolean
  setShape: (shape: StampShapeKind) => void
  setDimensions: (dimensions: StampDimensions) => void
  setInk: (ink: Partial<InkSettings>) => void
  addElement: (element: StampElement) => void
  updateElement: (id: string, patch: Partial<StampElement>) => void
  removeElement: (id: string) => void
  duplicateElement: (id: string) => void
  reorderElement: (id: string, direction: 'up' | 'down') => void
  select: (ids: string[]) => void
  undo: () => void
  redo: () => void
  loadProject: (project: StampProject) => void
  resetProject: () => void
}

function withUpdatedProject(
  state: StampStoreState,
  mutate: (project: StampProject) => StampProject,
): Partial<StampStoreState> {
  const next = { ...mutate(state.history.present), updatedAt: Date.now() }
  return { history: pushHistory(state.history, next) }
}

export const useStampStore = create<StampStore & StampStoreState>((set, get) => ({
  history: { past: [], present: createDefaultProject(), future: [] },
  selectedIds: [],
  get project() {
    return get().history.present
  },
  get canUndo() {
    return get().history.past.length > 0
  },
  get canRedo() {
    return get().history.future.length > 0
  },

  setShape: (shape) =>
    set((state) => withUpdatedProject(state, (p) => ({ ...p, shape }))),

  setDimensions: (dimensions) =>
    set((state) => withUpdatedProject(state, (p) => ({ ...p, dimensions }))),

  setInk: (ink) =>
    set((state) =>
      withUpdatedProject(state, (p) => ({ ...p, ink: { ...p.ink, ...ink } })),
    ),

  addElement: (element) =>
    set((state) =>
      withUpdatedProject(state, (p) => ({ ...p, elements: [...p.elements, element] })),
    ),

  updateElement: (id, patch) =>
    set((state) =>
      withUpdatedProject(state, (p) => ({
        ...p,
        elements: p.elements.map((el) =>
          el.id === id ? ({ ...el, ...patch } as StampElement) : el,
        ),
      })),
    ),

  removeElement: (id) =>
    set((state) => ({
      ...withUpdatedProject(state, (p) => ({
        ...p,
        elements: p.elements.filter((el) => el.id !== id),
      })),
      selectedIds: state.selectedIds.filter((sid) => sid !== id),
    })),

  duplicateElement: (id) =>
    set((state) =>
      withUpdatedProject(state, (p) => {
        const original = p.elements.find((el) => el.id === id)
        if (!original) return p
        const copy: StampElement = {
          ...original,
          id: uid(),
          x: original.x + 4,
          y: original.y + 4,
          zIndex: Math.max(...p.elements.map((el) => el.zIndex), 0) + 1,
        }
        return { ...p, elements: [...p.elements, copy] }
      }),
    ),

  reorderElement: (id, direction) =>
    set((state) =>
      withUpdatedProject(state, (p) => {
        const sorted = [...p.elements].sort((a, b) => a.zIndex - b.zIndex)
        const index = sorted.findIndex((el) => el.id === id)
        const swapWith = direction === 'up' ? index + 1 : index - 1
        if (index === -1 || swapWith < 0 || swapWith >= sorted.length) return p
        const a = sorted[index]
        const b = sorted[swapWith]
        const az = a.zIndex
        const bz = b.zIndex
        return {
          ...p,
          elements: p.elements.map((el) => {
            if (el.id === a.id) return { ...el, zIndex: bz }
            if (el.id === b.id) return { ...el, zIndex: az }
            return el
          }),
        }
      }),
    ),

  select: (ids) => set({ selectedIds: ids }),

  undo: () => set((state) => ({ history: undoHistory(state.history), selectedIds: [] })),
  redo: () => set((state) => ({ history: redoHistory(state.history), selectedIds: [] })),

  loadProject: (project) =>
    set(() => ({ history: { past: [], present: project, future: [] }, selectedIds: [] })),

  resetProject: () =>
    set(() => ({
      history: { past: [], present: createDefaultProject(), future: [] },
      selectedIds: [],
    })),
}))
```

Note: Zustand's `create` doesn't support getter properties in the returned object literal the way plain objects do in all TS configs reliably at runtime for subscriptions — replace the three getters (`project`, `canUndo`, `canRedo`) with plain derived selectors instead, since components should select them directly. Correct this in Step 3.

- [ ] **Step 3: Fix store shape to avoid getter pitfalls — use plain fields + selector functions**

Replace the store body so `project`, `canUndo`, `canRedo` are NOT getters on the store object (Zustand doesn't reactively track plain JS getters for re-renders). Instead, export small selector hooks:

Edit `src/store/useStampStore.ts` — remove the three `get ...()` entries from the returned store object, and append at the end of the file:
```ts
export const useProject = () => useStampStore((s) => s.history.present)
export const useCanUndo = () => useStampStore((s) => s.history.past.length > 0)
export const useCanRedo = () => useStampStore((s) => s.history.future.length > 0)
export const useSelectedIds = () => useStampStore((s) => s.selectedIds)
```

Also remove `project: StampProject`, `canUndo: boolean`, `canRedo: boolean` from the `StampStore` interface (they're no longer store fields) — the interface now only lists action methods and `selectedIds`. Update the `StampStoreState`/`StampStore` intersection type in the `create<...>` call accordingly (drop the getters from the object literal, keep `history` and `selectedIds` as real fields).

All later tasks that need the current project or undo/redo flags MUST use `useProject()`, `useCanUndo()`, `useCanRedo()`, `useSelectedIds()` — not `useStampStore((s) => s.project)`.

- [ ] **Step 4: Verify it compiles**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 5: Manual smoke test via a temporary debug page**

Temporarily add to `StampStudioPage.tsx` a button that calls `useStampStore.getState().addElement(...)` with a minimal text element and logs `useStampStore.getState().project` to console, click it in the browser, confirm the element appears in the logged project and that calling `.undo()` from the console reverts it. Remove the temporary button/log after confirming (real UI comes in later tasks).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add Zustand stamp store with undo/redo history"
```

---

## Task 5: SVG Sanitizer for Uploaded Images

**Files:**
- Create: `src/lib/sanitizeSvg.ts`

**Interfaces:**
- Produces: `sanitizeSvgString(raw: string): string | null` — returns a cleaned SVG markup string, or `null` if the input isn't a parseable SVG. Used by the image upload flow (Task 9).

- [ ] **Step 1: Write the sanitizer**

```ts
// src/lib/sanitizeSvg.ts
const DISALLOWED_TAGS = ['script', 'foreignObject', 'iframe', 'embed', 'object']

export function sanitizeSvgString(raw: string): string | null {
  const parser = new DOMParser()
  const doc = parser.parseFromString(raw, 'image/svg+xml')
  const parserError = doc.querySelector('parsererror')
  if (parserError) return null

  const svgEl = doc.documentElement
  if (svgEl.tagName.toLowerCase() !== 'svg') return null

  for (const tagName of DISALLOWED_TAGS) {
    doc.querySelectorAll(tagName).forEach((node) => node.remove())
  }

  const allElements = doc.querySelectorAll('*')
  allElements.forEach((el) => {
    ;[...el.attributes].forEach((attr) => {
      const name = attr.name.toLowerCase()
      const value = attr.value.trim().toLowerCase()
      if (name.startsWith('on')) {
        el.removeAttribute(attr.name)
      }
      if ((name === 'href' || name === 'xlink:href') && !value.startsWith('#')) {
        el.removeAttribute(attr.name)
      }
      if (value.startsWith('javascript:')) {
        el.removeAttribute(attr.name)
      }
    })
  })

  return new XMLSerializer().serializeToString(svgEl)
}
```

- [ ] **Step 2: Manual verification with a crafted malicious SVG**

Create a temporary test file `scratch-malicious.svg` (not committed) with content:
```xml
<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"><script>alert(2)</script><circle cx="10" cy="10" r="5" onclick="alert(3)"/></svg>
```
In a scratch script or the browser console (via a temporary button in `StampStudioPage`), call `sanitizeSvgString(rawText)` on its contents and confirm the returned string contains neither `<script`, `onload`, nor `onclick`. Delete the temporary SVG file and any temporary test code afterward.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add SVG upload sanitizer stripping scripts and event handlers"
```

---

## Task 6: Persistence (localStorage autosave/load/reset)

**Files:**
- Create: `src/lib/persistence.ts`

**Interfaces:**
- Consumes: `StampProject` type (Task 2).
- Produces:
  ```ts
  export const STORAGE_KEY = 'markforge:project'
  export function saveProject(project: StampProject): void
  export function loadProject(): StampProject | null
  export function clearProject(): void
  ```

- [ ] **Step 1: Write persistence.ts**

```ts
// src/lib/persistence.ts
import type { StampProject } from '../types/stamp'

export const STORAGE_KEY = 'markforge:project'

export function saveProject(project: StampProject): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(project))
  } catch {
    // localStorage unavailable (private mode, quota) — fail silently, autosave is best-effort
  }
}

export function loadProject(): StampProject | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as StampProject
  } catch {
    return null
  }
}

export function clearProject(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}
```

- [ ] **Step 2: Manual verification**

In the browser devtools console (any page running dev server), run:
```js
localStorage.setItem('markforge:project', JSON.stringify({ id: 'x', name: 'test' }))
```
Confirm `loadProject()` (via a temporary console-exposed import or temporary button) returns an object with `name: 'test'`. This wiring is exercised end-to-end for real once `EditorTopBar` (Task 10) and the autosave effect (Task 12) exist — this task only proves the raw read/write/clear functions work correctly against `localStorage`.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add localStorage persistence helpers for stamp projects"
```

---

## Task 7: Canvas Rendering — Shapes, Text, and Curved Text

**Files:**
- Create: `src/components/editor/CanvasElementView.tsx`
- Create: `src/components/editor/StampCanvas.tsx`

**Interfaces:**
- Consumes: `StampElement`, `StampProject` types (Task 2); `useProject`, `useSelectedIds`, `useStampStore` (Task 4); `buildCurvedTextArcPath` (Task 3).
- Produces:
  - `CanvasElementView(props: { element: StampElement; isSelected: boolean; onPointerDownSelect: (id: string, e: React.PointerEvent) => void })` — renders one element as SVG.
  - `StampCanvas()` — the full canvas component (no props; reads store directly), rendering the stamp outline (per `shape`), all elements sorted by `zIndex`, and wiring click-to-select. Exported as default. Later tasks (8: selection/move/rotate; 12: page assembly) build on top of this component's DOM structure — specifically, `StampCanvas` renders a `<svg id="stamp-canvas-svg" viewBox="...">` root that Task 13 (export) queries by that id.

- [ ] **Step 1: Write CanvasElementView**

```tsx
// src/components/editor/CanvasElementView.tsx
import type { StampElement } from '../../types/stamp'
import { buildCurvedTextArcPath } from '../../lib/curvedText'

interface CanvasElementViewProps {
  element: StampElement
  isSelected: boolean
  onPointerDownSelect: (id: string, e: React.PointerEvent) => void
}

export default function CanvasElementView({
  element,
  isSelected,
  onPointerDownSelect,
}: CanvasElementViewProps) {
  const transform = `translate(${element.x} ${element.y}) rotate(${element.rotation}) scale(${element.scale})`

  if (element.type === 'text') {
    return (
      <g
        transform={transform}
        onPointerDown={(e) => onPointerDownSelect(element.id, e)}
        style={{ cursor: 'move' }}
      >
        <text
          fontFamily={element.fontFamily}
          fontSize={element.fontSize}
          fontWeight={element.fontWeight}
          letterSpacing={element.letterSpacing}
          textAnchor={element.align === 'left' ? 'start' : element.align === 'right' ? 'end' : 'middle'}
          fill={element.color}
        >
          {element.multiline
            ? element.text.split('\n').map((line, i) => (
                <tspan key={i} x={0} dy={i === 0 ? 0 : element.fontSize * 1.2}>
                  {line}
                </tspan>
              ))
            : element.text}
        </text>
        {isSelected && <SelectionMarker />}
      </g>
    )
  }

  if (element.type === 'curvedText') {
    const pathId = `curve-${element.id}`
    const pathD = buildCurvedTextArcPath(element.radius, element.startAngle, element.direction)
    return (
      <g
        transform={transform}
        onPointerDown={(e) => onPointerDownSelect(element.id, e)}
        style={{ cursor: 'move' }}
      >
        <defs>
          <path id={pathId} d={pathD} />
        </defs>
        <text
          fontFamily={element.fontFamily}
          fontSize={element.fontSize}
          fontWeight={element.fontWeight}
          letterSpacing={element.letterSpacing}
          fill={element.color}
        >
          <textPath href={`#${pathId}`} startOffset="0%">
            {element.text}
          </textPath>
        </text>
        {isSelected && <SelectionMarker />}
      </g>
    )
  }

  if (element.type === 'shape') {
    return (
      <g
        transform={transform}
        onPointerDown={(e) => onPointerDownSelect(element.id, e)}
        style={{ cursor: 'move' }}
      >
        <ShapePrimitive element={element} />
        {isSelected && <SelectionMarker />}
      </g>
    )
  }

  // image
  return (
    <g
      transform={transform}
      onPointerDown={(e) => onPointerDownSelect(element.id, e)}
      style={{ cursor: 'move' }}
    >
      <image
        href={element.src}
        width={element.width}
        height={element.height}
        x={-element.width / 2}
        y={-element.height / 2}
      />
      {isSelected && <SelectionMarker />}
    </g>
  )
}

function ShapePrimitive({ element }: { element: Extract<StampElement, { type: 'shape' }> }) {
  const fill = element.filled ? element.fillColor : 'none'
  if (element.shape === 'circle') {
    return (
      <circle
        r={element.width / 2}
        fill={fill}
        stroke={element.strokeColor}
        strokeWidth={element.strokeWidth}
      />
    )
  }
  if (element.shape === 'line') {
    return (
      <line
        x1={-element.width / 2}
        y1={0}
        x2={element.width / 2}
        y2={0}
        stroke={element.strokeColor}
        strokeWidth={element.strokeWidth}
      />
    )
  }
  return (
    <rect
      x={-element.width / 2}
      y={-element.height / 2}
      width={element.width}
      height={element.height}
      rx={element.shape === 'roundedRectangle' ? element.cornerRadius ?? 8 : 0}
      fill={fill}
      stroke={element.strokeColor}
      strokeWidth={element.strokeWidth}
    />
  )
}

function SelectionMarker() {
  return <circle r={2} fill="#C4571F" />
}
```

- [ ] **Step 2: Write StampCanvas with the stamp outline**

```tsx
// src/components/editor/StampCanvas.tsx
import { useProject, useSelectedIds, useStampStore } from '../../store/useStampStore'
import CanvasElementView from './CanvasElementView'

function StampOutline({ shape, width, height }: { shape: string; width: number; height: number }) {
  const stroke = '#2B2A28'
  const strokeWidth = 1.2
  if (shape === 'circle' || shape === 'badge') {
    return <circle r={Math.min(width, height) / 2} fill="none" stroke={stroke} strokeWidth={strokeWidth} />
  }
  if (shape === 'oval') {
    return <ellipse rx={width / 2} ry={height / 2} fill="none" stroke={stroke} strokeWidth={strokeWidth} />
  }
  const rx = shape === 'roundedRectangle' ? 10 : 0
  return (
    <rect
      x={-width / 2}
      y={-height / 2}
      width={width}
      height={height}
      rx={rx}
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
    />
  )
}

export default function StampCanvas() {
  const project = useProject()
  const selectedIds = useSelectedIds()
  const select = useStampStore((s) => s.select)

  const padding = 10
  const viewWidth = project.dimensions.width + padding * 2
  const viewHeight = project.dimensions.height + padding * 2
  const sorted = [...project.elements].sort((a, b) => a.zIndex - b.zIndex)

  return (
    <svg
      id="stamp-canvas-svg"
      viewBox={`${-viewWidth / 2} ${-viewHeight / 2} ${viewWidth} ${viewHeight}`}
      width="100%"
      height="100%"
      onPointerDown={() => select([])}
    >
      <g transform="translate(0,0)">
        <StampOutline shape={project.shape} width={project.dimensions.width} height={project.dimensions.height} />
        {sorted.map((element) => (
          <CanvasElementView
            key={element.id}
            element={element}
            isSelected={selectedIds.includes(element.id)}
            onPointerDownSelect={(id, e) => {
              e.stopPropagation()
              select([id])
            }}
          />
        ))}
      </g>
    </svg>
  )
}
```

- [ ] **Step 3: Manual smoke test**

Temporarily render `<StampCanvas />` inside `StampStudioPage`, use the store's `addElement` from a temporary button (a text element and a shape element with distinct positions), and confirm in the browser that both render inside the circular outline and clicking one shows the small orange selection marker while clicking empty canvas clears selection. Remove temporary buttons after confirming (real toolbar arrives in Task 9).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add SVG stamp canvas rendering shapes, text, curved text, images"
```

---

## Task 8: Selection, Move, Resize, Rotate, Zoom/Pan

**Files:**
- Create: `src/components/editor/SelectionOverlay.tsx`
- Modify: `src/components/editor/StampCanvas.tsx` (add pointer-drag move/rotate/resize handling and zoom/pan state)

**Interfaces:**
- Consumes: `rotatePoint`, `clamp` (Task 3); `useStampStore`'s `updateElement` (Task 4).
- Produces: `StampCanvas` now supports dragging a selected element to move it, dragging a corner handle to resize (uniform `scale`), dragging a rotate handle to rotate, mouse-wheel zoom, and space+drag (or middle-mouse) pan. Selection handles are rendered by `SelectionOverlay(props: { element: StampElement; viewScale: number; onResize, onRotate })`.

- [ ] **Step 1: Write SelectionOverlay**

```tsx
// src/components/editor/SelectionOverlay.tsx
import type { StampElement } from '../../types/stamp'

interface SelectionOverlayProps {
  element: StampElement
  onResizeStart: (e: React.PointerEvent) => void
  onRotateStart: (e: React.PointerEvent) => void
}

function boundingSize(element: StampElement): { width: number; height: number } {
  if (element.type === 'text' || element.type === 'curvedText') {
    const approxWidth = element.text.length * element.fontSize * 0.6
    return { width: approxWidth, height: element.fontSize * 1.5 }
  }
  if (element.type === 'shape') return { width: element.width, height: element.height }
  return { width: element.width, height: element.height }
}

export default function SelectionOverlay({ element, onResizeStart, onRotateStart }: SelectionOverlayProps) {
  const { width, height } = boundingSize(element)
  const halfW = (width * element.scale) / 2
  const halfH = (height * element.scale) / 2

  return (
    <g transform={`translate(${element.x} ${element.y}) rotate(${element.rotation})`}>
      <rect
        x={-halfW}
        y={-halfH}
        width={halfW * 2}
        height={halfH * 2}
        fill="none"
        stroke="#C4571F"
        strokeDasharray="3 2"
        strokeWidth={0.6}
      />
      <circle
        cx={halfW}
        cy={halfH}
        r={2.2}
        fill="#C4571F"
        style={{ cursor: 'nwse-resize' }}
        onPointerDown={(e) => {
          e.stopPropagation()
          onResizeStart(e)
        }}
      />
      <circle
        cx={0}
        cy={-halfH - 6}
        r={2.2}
        fill="#2B2A28"
        style={{ cursor: 'grab' }}
        onPointerDown={(e) => {
          e.stopPropagation()
          onRotateStart(e)
        }}
      />
      <line x1={0} y1={-halfH} x2={0} y2={-halfH - 6} stroke="#2B2A28" strokeWidth={0.5} />
    </g>
  )
}
```

- [ ] **Step 2: Add drag-move, resize, rotate, zoom, pan to StampCanvas**

Modify `src/components/editor/StampCanvas.tsx` — replace its body with:

```tsx
import { useRef, useState } from 'react'
import { useProject, useSelectedIds, useStampStore } from '../../store/useStampStore'
import CanvasElementView from './CanvasElementView'
import SelectionOverlay from './SelectionOverlay'
import { clamp } from '../../lib/geometry'

function StampOutline({ shape, width, height }: { shape: string; width: number; height: number }) {
  const stroke = '#2B2A28'
  const strokeWidth = 1.2
  if (shape === 'circle' || shape === 'badge') {
    return <circle r={Math.min(width, height) / 2} fill="none" stroke={stroke} strokeWidth={strokeWidth} />
  }
  if (shape === 'oval') {
    return <ellipse rx={width / 2} ry={height / 2} fill="none" stroke={stroke} strokeWidth={strokeWidth} />
  }
  const rx = shape === 'roundedRectangle' ? 10 : 0
  return (
    <rect
      x={-width / 2}
      y={-height / 2}
      width={width}
      height={height}
      rx={rx}
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
    />
  )
}

type DragMode =
  | { kind: 'move'; id: string; startX: number; startY: number; originX: number; originY: number }
  | { kind: 'resize'; id: string; originScale: number; centerX: number; centerY: number; startDist: number }
  | { kind: 'rotate'; id: string; centerX: number; centerY: number }
  | { kind: 'pan'; startClientX: number; startClientY: number; originPanX: number; originPanY: number }
  | null

export default function StampCanvas() {
  const project = useProject()
  const selectedIds = useSelectedIds()
  const select = useStampStore((s) => s.select)
  const updateElement = useStampStore((s) => s.updateElement)

  const svgRef = useRef<SVGSVGElement>(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const drag = useRef<DragMode>(null)

  const padding = 10
  const viewWidth = (project.dimensions.width + padding * 2) / zoom
  const viewHeight = (project.dimensions.height + padding * 2) / zoom
  const sorted = [...project.elements].sort((a, b) => a.zIndex - b.zIndex)
  const selectedElement = project.elements.find((el) => el.id === selectedIds[0])

  function toSvgPoint(clientX: number, clientY: number): { x: number; y: number } {
    const svg = svgRef.current
    if (!svg) return { x: 0, y: 0 }
    const pt = svg.createSVGPoint()
    pt.x = clientX
    pt.y = clientY
    const ctm = svg.getScreenCTM()
    if (!ctm) return { x: 0, y: 0 }
    const transformed = pt.matrixTransform(ctm.inverse())
    return { x: transformed.x, y: transformed.y }
  }

  function handleElementPointerDown(id: string, e: React.PointerEvent) {
    e.stopPropagation()
    select([id])
    const el = project.elements.find((it) => it.id === id)
    if (!el) return
    const p = toSvgPoint(e.clientX, e.clientY)
    drag.current = { kind: 'move', id, startX: p.x, startY: p.y, originX: el.x, originY: el.y }
    ;(e.target as Element).setPointerCapture(e.pointerId)
  }

  function handleResizeStart(id: string, e: React.PointerEvent) {
    const el = project.elements.find((it) => it.id === id)
    if (!el) return
    const p = toSvgPoint(e.clientX, e.clientY)
    const dist = Math.hypot(p.x - el.x, p.y - el.y)
    drag.current = { kind: 'resize', id, originScale: el.scale, centerX: el.x, centerY: el.y, startDist: dist || 1 }
  }

  function handleRotateStart(id: string, e: React.PointerEvent) {
    const el = project.elements.find((it) => it.id === id)
    if (!el) return
    drag.current = { kind: 'rotate', id, centerX: el.x, centerY: el.y }
  }

  function handlePointerMove(e: React.PointerEvent) {
    const d = drag.current
    if (!d) return
    const p = toSvgPoint(e.clientX, e.clientY)

    if (d.kind === 'move') {
      updateElement(d.id, { x: d.originX + (p.x - d.startX), y: d.originY + (p.y - d.startY) } as never)
    } else if (d.kind === 'resize') {
      const dist = Math.hypot(p.x - d.centerX, p.y - d.centerY)
      const nextScale = clamp((dist / d.startDist) * d.originScale, 0.2, 6)
      updateElement(d.id, { scale: nextScale } as never)
    } else if (d.kind === 'rotate') {
      const angleRad = Math.atan2(p.y - d.centerY, p.x - d.centerX)
      const angleDeg = (angleRad * 180) / Math.PI + 90
      updateElement(d.id, { rotation: angleDeg } as never)
    } else if (d.kind === 'pan') {
      setPan({
        x: d.originPanX + (e.clientX - d.startClientX),
        y: d.originPanY + (e.clientY - d.startClientY),
      })
    }
  }

  function handlePointerUp() {
    drag.current = null
  }

  function handleCanvasPointerDown(e: React.PointerEvent) {
    if (e.button === 1 || e.shiftKey) {
      drag.current = { kind: 'pan', startClientX: e.clientX, startClientY: e.clientY, originPanX: pan.x, originPanY: pan.y }
      return
    }
    select([])
  }

  function handleWheel(e: React.WheelEvent) {
    e.preventDefault()
    setZoom((z) => clamp(z - e.deltaY * 0.001, 0.4, 4))
  }

  return (
    <svg
      id="stamp-canvas-svg"
      ref={svgRef}
      viewBox={`${-viewWidth / 2 - pan.x} ${-viewHeight / 2 - pan.y} ${viewWidth} ${viewHeight}`}
      width="100%"
      height="100%"
      onPointerDown={handleCanvasPointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onWheel={handleWheel}
      style={{ touchAction: 'none' }}
    >
      <StampOutline shape={project.shape} width={project.dimensions.width} height={project.dimensions.height} />
      {sorted.map((element) => (
        <CanvasElementView
          key={element.id}
          element={element}
          isSelected={selectedIds.includes(element.id)}
          onPointerDownSelect={handleElementPointerDown}
        />
      ))}
      {selectedElement && (
        <SelectionOverlay
          element={selectedElement}
          onResizeStart={(e) => handleResizeStart(selectedElement.id, e)}
          onRotateStart={(e) => handleRotateStart(selectedElement.id, e)}
        />
      )}
    </svg>
  )
}
```

Note: the `as never` casts on `updateElement` patches are necessary because `Partial<StampElement>` on a discriminated union narrows awkwardly for cross-cutting fields (`x`, `y`, `scale`, `rotation`) that exist on every variant — this is a deliberate, narrow, documented cast, not a general escape hatch. Do not use `as never` elsewhere in the codebase.

- [ ] **Step 3: Manual verification**

Run `npm run dev`, navigate to the studio page (still using the Task 7 temporary add-element buttons if not yet removed, or re-add one quickly), and verify: dragging a selected element moves it; dragging its corner handle scales it; dragging its top handle rotates it; mouse wheel zooms in/out; holding Shift and dragging pans the canvas.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add move/resize/rotate drag interactions and zoom/pan to canvas"
```

---

## Task 9: Toolbar, Adding Elements, Image Upload

**Files:**
- Create: `src/components/editor/Toolbar.tsx`
- Create: `src/components/ui/IconButton.tsx`, `src/components/ui/Button.tsx`
- Create: `src/data/fonts.ts`

**Interfaces:**
- Consumes: `useStampStore().addElement`, `uid`, `sanitizeSvgString`.
- Produces: `Toolbar()` — buttons that call `addElement` with sensible default `TextElement`/`CurvedTextElement`/`ShapeElement` objects (centered at 0,0, zIndex = current max + 1), plus an image upload button (`<input type="file" accept="image/png,image/jpeg,image/svg+xml">`) that reads the file, sanitizes SVGs, converts to a data URL, and calls `addElement` with an `ImageElement`. Exposes `FONT_STACKS: string[]` from `src/data/fonts.ts` for later use by `TextProperties`/`CurvedTextProperties`.

- [ ] **Step 1: Write font stack data**

```ts
// src/data/fonts.ts
export const FONT_STACKS: { label: string; value: string }[] = [
  { label: 'Sans', value: 'Arial, Helvetica, sans-serif' },
  { label: 'Sans (Rounded)', value: 'Verdana, Geneva, sans-serif' },
  { label: 'Serif', value: 'Georgia, Cambria, "Times New Roman", serif' },
  { label: 'Serif (Classic)', value: '"Times New Roman", Times, serif' },
  { label: 'Monospace', value: 'Consolas, Menlo, monospace' },
]
```

- [ ] **Step 2: Write small UI primitives**

```tsx
// src/components/ui/Button.tsx
import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-ink text-paper hover:bg-accent',
  secondary: 'bg-transparent border border-line text-ink hover:border-ink',
  ghost: 'bg-transparent text-ink hover:bg-line/50',
}

export default function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`rounded-full px-4 py-2 text-sm font-medium transition-colors disabled:opacity-40 ${variantClasses[variant]} ${className}`}
      {...props}
    />
  )
}
```

```tsx
// src/components/ui/IconButton.tsx
import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode
  label: string
  active?: boolean
}

export default function IconButton({ icon, label, active, className = '', ...props }: IconButtonProps) {
  return (
    <button
      aria-label={label}
      title={label}
      className={`flex min-h-11 min-w-11 items-center justify-center rounded-xl2 border transition-colors ${
        active ? 'border-accent bg-accent/10 text-accent' : 'border-line text-ink hover:border-ink'
      } ${className}`}
      {...props}
    >
      {icon}
    </button>
  )
}
```

- [ ] **Step 3: Write Toolbar**

```tsx
// src/components/editor/Toolbar.tsx
import { useRef } from 'react'
import { Type, TextCursorInput, Circle, Square, RectangleHorizontal, Minus, Image as ImageIcon } from 'lucide-react'
import { useStampStore, useProject } from '../../store/useStampStore'
import { uid } from '../../lib/id'
import { sanitizeSvgString } from '../../lib/sanitizeSvg'
import IconButton from '../ui/IconButton'
import type { StampElement } from '../../types/stamp'

export default function Toolbar() {
  const project = useProject()
  const addElement = useStampStore((s) => s.addElement)
  const select = useStampStore((s) => s.select)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function nextZIndex(): number {
    return project.elements.length === 0 ? 1 : Math.max(...project.elements.map((el) => el.zIndex)) + 1
  }

  function addAndSelect(element: StampElement) {
    addElement(element)
    select([element.id])
  }

  function handleAddText() {
    addAndSelect({
      id: uid(),
      type: 'text',
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1,
      zIndex: nextZIndex(),
      text: 'YOUR TEXT',
      fontFamily: 'Arial, Helvetica, sans-serif',
      fontSize: 6,
      fontWeight: 600,
      letterSpacing: 0,
      align: 'center',
      color: '#2B2A28',
      multiline: false,
    })
  }

  function handleAddCurvedText() {
    addAndSelect({
      id: uid(),
      type: 'curvedText',
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1,
      zIndex: nextZIndex(),
      text: 'CURVED TEXT HERE',
      fontFamily: 'Arial, Helvetica, sans-serif',
      fontSize: 5,
      fontWeight: 600,
      letterSpacing: 1,
      color: '#2B2A28',
      radius: Math.min(project.dimensions.width, project.dimensions.height) / 2 - 6,
      startAngle: 0,
      direction: 'clockwise',
    })
  }

  function handleAddShape(shape: 'circle' | 'rectangle' | 'roundedRectangle' | 'line') {
    addAndSelect({
      id: uid(),
      type: 'shape',
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1,
      zIndex: nextZIndex(),
      shape,
      width: shape === 'line' ? 20 : 16,
      height: shape === 'line' ? 0.5 : 16,
      strokeColor: '#2B2A28',
      strokeWidth: 1,
      fillColor: '#2B2A28',
      filled: false,
      cornerRadius: shape === 'roundedRectangle' ? 3 : undefined,
    })
  }

  function handleFileChosen(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()

    if (file.type === 'image/svg+xml') {
      reader.onload = () => {
        const raw = reader.result as string
        const cleaned = sanitizeSvgString(raw)
        if (!cleaned) return
        const dataUrl = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(cleaned)))}`
        addAndSelect({
          id: uid(),
          type: 'image',
          x: 0,
          y: 0,
          rotation: 0,
          scale: 1,
          zIndex: nextZIndex(),
          src: dataUrl,
          width: 20,
          height: 20,
          isSvg: true,
        })
      }
      reader.readAsText(file)
    } else {
      reader.onload = () => {
        addAndSelect({
          id: uid(),
          type: 'image',
          x: 0,
          y: 0,
          rotation: 0,
          scale: 1,
          zIndex: nextZIndex(),
          src: reader.result as string,
          width: 20,
          height: 20,
          isSvg: false,
        })
      }
      reader.readAsDataURL(file)
    }
    e.target.value = ''
  }

  return (
    <div className="flex flex-col gap-2 p-3">
      <IconButton icon={<Type size={18} />} label="Add text" onClick={handleAddText} />
      <IconButton icon={<TextCursorInput size={18} />} label="Add curved text" onClick={handleAddCurvedText} />
      <IconButton icon={<Circle size={18} />} label="Add circle" onClick={() => handleAddShape('circle')} />
      <IconButton icon={<RectangleHorizontal size={18} />} label="Add rectangle" onClick={() => handleAddShape('rectangle')} />
      <IconButton icon={<Square size={18} />} label="Add rounded rectangle" onClick={() => handleAddShape('roundedRectangle')} />
      <IconButton icon={<Minus size={18} />} label="Add line" onClick={() => handleAddShape('line')} />
      <IconButton icon={<ImageIcon size={18} />} label="Upload image" onClick={() => fileInputRef.current?.click()} />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/svg+xml"
        className="hidden"
        onChange={handleFileChosen}
      />
    </div>
  )
}
```

- [ ] **Step 2: Manual verification**

Temporarily render `<Toolbar />` next to `<StampCanvas />` in `StampStudioPage`. In the dev server, click each add button and confirm the element appears centered on canvas and is auto-selected (dashed selection box visible). Upload a small PNG and a small SVG file and confirm both render. Upload an SVG containing `<script>alert(1)</script>` and confirm no alert fires and the shape still renders.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add editor toolbar for adding text, curved text, shapes, images"
```

---

## Task 10: Properties Panel (Text, Curved Text, Shape, Image, Stamp Settings)

**Files:**
- Create: `src/components/ui/Slider.tsx`, `src/components/ui/ColorSwatch.tsx`, `src/components/ui/Select.tsx`
- Create: `src/components/editor/TextProperties.tsx`
- Create: `src/components/editor/CurvedTextProperties.tsx`
- Create: `src/components/editor/ShapeProperties.tsx`
- Create: `src/components/editor/ImageProperties.tsx`
- Create: `src/components/editor/StampSettingsPanel.tsx`
- Create: `src/components/editor/InkPreviewControls.tsx`
- Create: `src/components/editor/PropertiesPanel.tsx`
- Create: `src/components/editor/LayerList.tsx`

**Interfaces:**
- Consumes: `useSelectedIds`, `useProject`, `useStampStore().updateElement/removeElement/duplicateElement/reorderElement/setShape/setDimensions/setInk` (Task 4); `FONT_STACKS` (Task 9).
- Produces: `PropertiesPanel()` — shows `StampSettingsPanel` + `InkPreviewControls` when nothing is selected, or the matching type-specific properties editor (`TextProperties` / `CurvedTextProperties` / `ShapeProperties` / `ImageProperties`) plus delete/duplicate/layer-order buttons when one element is selected. This same content is reused by `MobileBottomSheet` in Task 14 — keep `PropertiesPanel` free of any desktop-only layout assumptions (no fixed widths, no `md:` classes inside it).

- [ ] **Step 1: Write Slider, ColorSwatch, Select UI primitives**

```tsx
// src/components/ui/Slider.tsx
interface SliderProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
}

export default function Slider({ label, value, min, max, step = 1, onChange }: SliderProps) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="flex justify-between text-ink/70">
        <span>{label}</span>
        <span>{value}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="accent-accent"
      />
    </label>
  )
}
```

```tsx
// src/components/ui/ColorSwatch.tsx
interface ColorSwatchProps {
  label: string
  value: string
  onChange: (value: string) => void
}

export default function ColorSwatch({ label, value, onChange }: ColorSwatchProps) {
  return (
    <label className="flex items-center justify-between text-sm">
      <span className="text-ink/70">{label}</span>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-8 cursor-pointer rounded border border-line"
      />
    </label>
  )
}
```

```tsx
// src/components/ui/Select.tsx
interface SelectOption {
  label: string
  value: string
}

interface SelectProps {
  label: string
  value: string
  options: SelectOption[]
  onChange: (value: string) => void
}

export default function Select({ label, value, options, onChange }: SelectProps) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-ink/70">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-line bg-paper px-2 py-2"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  )
}
```

- [ ] **Step 2: Write TextProperties**

```tsx
// src/components/editor/TextProperties.tsx
import type { TextElement } from '../../types/stamp'
import { useStampStore } from '../../store/useStampStore'
import { FONT_STACKS } from '../../data/fonts'
import Slider from '../ui/Slider'
import ColorSwatch from '../ui/ColorSwatch'
import Select from '../ui/Select'

export default function TextProperties({ element }: { element: TextElement }) {
  const updateElement = useStampStore((s) => s.updateElement)
  const patch = (p: Partial<TextElement>) => updateElement(element.id, p)

  return (
    <div className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-ink/70">Text</span>
        {element.multiline ? (
          <textarea
            value={element.text}
            onChange={(e) => patch({ text: e.target.value })}
            className="rounded-lg border border-line bg-paper px-2 py-2"
            rows={3}
          />
        ) : (
          <input
            value={element.text}
            onChange={(e) => patch({ text: e.target.value })}
            className="rounded-lg border border-line bg-paper px-2 py-2"
          />
        )}
      </label>
      <label className="flex items-center gap-2 text-sm text-ink/70">
        <input
          type="checkbox"
          checked={element.multiline}
          onChange={(e) => patch({ multiline: e.target.checked })}
        />
        Multi-line
      </label>
      <Select
        label="Font"
        value={element.fontFamily}
        options={FONT_STACKS.map((f) => ({ label: f.label, value: f.value }))}
        onChange={(fontFamily) => patch({ fontFamily })}
      />
      <Slider label="Size" value={element.fontSize} min={2} max={20} step={0.5} onChange={(fontSize) => patch({ fontSize })} />
      <Slider label="Weight" value={element.fontWeight} min={300} max={900} step={100} onChange={(fontWeight) => patch({ fontWeight })} />
      <Slider
        label="Letter spacing"
        value={element.letterSpacing}
        min={-2}
        max={10}
        step={0.1}
        onChange={(letterSpacing) => patch({ letterSpacing })}
      />
      <Select
        label="Align"
        value={element.align}
        options={[
          { label: 'Left', value: 'left' },
          { label: 'Center', value: 'center' },
          { label: 'Right', value: 'right' },
        ]}
        onChange={(align) => patch({ align: align as TextElement['align'] })}
      />
      <ColorSwatch label="Color" value={element.color} onChange={(color) => patch({ color })} />
      <Slider label="Rotation" value={element.rotation} min={-180} max={180} onChange={(rotation) => patch({ rotation })} />
    </div>
  )
}
```

- [ ] **Step 3: Write CurvedTextProperties**

```tsx
// src/components/editor/CurvedTextProperties.tsx
import type { CurvedTextElement } from '../../types/stamp'
import { useStampStore } from '../../store/useStampStore'
import { FONT_STACKS } from '../../data/fonts'
import Slider from '../ui/Slider'
import ColorSwatch from '../ui/ColorSwatch'
import Select from '../ui/Select'

export default function CurvedTextProperties({ element }: { element: CurvedTextElement }) {
  const updateElement = useStampStore((s) => s.updateElement)
  const patch = (p: Partial<CurvedTextElement>) => updateElement(element.id, p)

  return (
    <div className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-ink/70">Text</span>
        <input
          value={element.text}
          onChange={(e) => patch({ text: e.target.value })}
          className="rounded-lg border border-line bg-paper px-2 py-2"
        />
      </label>
      <Select
        label="Font"
        value={element.fontFamily}
        options={FONT_STACKS.map((f) => ({ label: f.label, value: f.value }))}
        onChange={(fontFamily) => patch({ fontFamily })}
      />
      <Slider label="Size" value={element.fontSize} min={2} max={16} step={0.5} onChange={(fontSize) => patch({ fontSize })} />
      <Slider
        label="Letter spacing"
        value={element.letterSpacing}
        min={-2}
        max={10}
        step={0.1}
        onChange={(letterSpacing) => patch({ letterSpacing })}
      />
      <Slider label="Radius" value={element.radius} min={5} max={80} onChange={(radius) => patch({ radius })} />
      <Slider
        label="Start position"
        value={element.startAngle}
        min={0}
        max={360}
        onChange={(startAngle) => patch({ startAngle })}
      />
      <Select
        label="Direction"
        value={element.direction}
        options={[
          { label: 'Clockwise', value: 'clockwise' },
          { label: 'Counter-clockwise', value: 'counterclockwise' },
        ]}
        onChange={(direction) => patch({ direction: direction as CurvedTextElement['direction'] })}
      />
      <ColorSwatch label="Color" value={element.color} onChange={(color) => patch({ color })} />
    </div>
  )
}
```

- [ ] **Step 4: Write ShapeProperties and ImageProperties**

```tsx
// src/components/editor/ShapeProperties.tsx
import type { ShapeElement } from '../../types/stamp'
import { useStampStore } from '../../store/useStampStore'
import Slider from '../ui/Slider'
import ColorSwatch from '../ui/ColorSwatch'

export default function ShapeProperties({ element }: { element: ShapeElement }) {
  const updateElement = useStampStore((s) => s.updateElement)
  const patch = (p: Partial<ShapeElement>) => updateElement(element.id, p)

  return (
    <div className="flex flex-col gap-4">
      <Slider label="Width" value={element.width} min={2} max={80} onChange={(width) => patch({ width })} />
      {element.shape !== 'line' && (
        <Slider label="Height" value={element.height} min={2} max={80} onChange={(height) => patch({ height })} />
      )}
      <Slider
        label="Stroke width"
        value={element.strokeWidth}
        min={0.2}
        max={6}
        step={0.2}
        onChange={(strokeWidth) => patch({ strokeWidth })}
      />
      <ColorSwatch label="Stroke color" value={element.strokeColor} onChange={(strokeColor) => patch({ strokeColor })} />
      {element.shape !== 'line' && (
        <>
          <label className="flex items-center gap-2 text-sm text-ink/70">
            <input type="checkbox" checked={element.filled} onChange={(e) => patch({ filled: e.target.checked })} />
            Filled
          </label>
          {element.filled && (
            <ColorSwatch label="Fill color" value={element.fillColor} onChange={(fillColor) => patch({ fillColor })} />
          )}
        </>
      )}
      {element.shape === 'roundedRectangle' && (
        <Slider
          label="Corner radius"
          value={element.cornerRadius ?? 3}
          min={0}
          max={20}
          onChange={(cornerRadius) => patch({ cornerRadius })}
        />
      )}
      <Slider label="Rotation" value={element.rotation} min={-180} max={180} onChange={(rotation) => patch({ rotation })} />
    </div>
  )
}
```

```tsx
// src/components/editor/ImageProperties.tsx
import type { ImageElement } from '../../types/stamp'
import { useStampStore } from '../../store/useStampStore'
import Slider from '../ui/Slider'

export default function ImageProperties({ element }: { element: ImageElement }) {
  const updateElement = useStampStore((s) => s.updateElement)
  const patch = (p: Partial<ImageElement>) => updateElement(element.id, p)

  return (
    <div className="flex flex-col gap-4">
      <Slider label="Width" value={element.width} min={4} max={100} onChange={(width) => patch({ width })} />
      <Slider label="Height" value={element.height} min={4} max={100} onChange={(height) => patch({ height })} />
      <Slider label="Rotation" value={element.rotation} min={-180} max={180} onChange={(rotation) => patch({ rotation })} />
    </div>
  )
}
```

- [ ] **Step 5: Write StampSettingsPanel and InkPreviewControls**

```tsx
// src/components/editor/StampSettingsPanel.tsx
import { useProject, useStampStore } from '../../store/useStampStore'
import Select from '../ui/Select'
import Slider from '../ui/Slider'
import type { StampShapeKind } from '../../types/stamp'

const SHAPE_OPTIONS: { label: string; value: StampShapeKind }[] = [
  { label: 'Circle', value: 'circle' },
  { label: 'Oval', value: 'oval' },
  { label: 'Rectangle', value: 'rectangle' },
  { label: 'Rounded rectangle', value: 'roundedRectangle' },
  { label: 'Badge', value: 'badge' },
]

export default function StampSettingsPanel() {
  const project = useProject()
  const setShape = useStampStore((s) => s.setShape)
  const setDimensions = useStampStore((s) => s.setDimensions)

  return (
    <div className="flex flex-col gap-4">
      <Select
        label="Stamp shape"
        value={project.shape}
        options={SHAPE_OPTIONS}
        onChange={(shape) => setShape(shape as StampShapeKind)}
      />
      <Slider
        label="Width (mm)"
        value={project.dimensions.width}
        min={15}
        max={80}
        onChange={(width) => setDimensions({ ...project.dimensions, width })}
      />
      <Slider
        label="Height (mm)"
        value={project.dimensions.height}
        min={15}
        max={80}
        onChange={(height) => setDimensions({ ...project.dimensions, height })}
      />
    </div>
  )
}
```

```tsx
// src/components/editor/InkPreviewControls.tsx
import { useProject, useStampStore } from '../../store/useStampStore'
import Select from '../ui/Select'
import Slider from '../ui/Slider'
import ColorSwatch from '../ui/ColorSwatch'

export default function InkPreviewControls() {
  const project = useProject()
  const setInk = useStampStore((s) => s.setInk)

  return (
    <div className="flex flex-col gap-4">
      <Select
        label="Preview mode"
        value={project.ink.mode}
        options={[
          { label: 'Clean', value: 'clean' },
          { label: 'Ink', value: 'ink' },
        ]}
        onChange={(mode) => setInk({ mode: mode as 'clean' | 'ink' })}
      />
      {project.ink.mode === 'ink' && (
        <>
          <ColorSwatch label="Ink color" value={project.ink.color} onChange={(color) => setInk({ color })} />
          <Slider
            label="Opacity"
            value={project.ink.opacity}
            min={0.3}
            max={1}
            step={0.05}
            onChange={(opacity) => setInk({ opacity })}
          />
          <Slider
            label="Distress"
            value={project.ink.distress}
            min={0}
            max={1}
            step={0.05}
            onChange={(distress) => setInk({ distress })}
          />
        </>
      )}
    </div>
  )
}
```

- [ ] **Step 6: Write LayerList**

```tsx
// src/components/editor/LayerList.tsx
import { ArrowUp, ArrowDown, Trash2, Copy } from 'lucide-react'
import { useProject, useSelectedIds, useStampStore } from '../../store/useStampStore'
import IconButton from '../ui/IconButton'

function labelFor(element: { type: string }): string {
  switch (element.type) {
    case 'text':
      return 'Text'
    case 'curvedText':
      return 'Curved text'
    case 'shape':
      return 'Shape'
    case 'image':
      return 'Image'
    default:
      return 'Element'
  }
}

export default function LayerList() {
  const project = useProject()
  const selectedIds = useSelectedIds()
  const select = useStampStore((s) => s.select)
  const removeElement = useStampStore((s) => s.removeElement)
  const duplicateElement = useStampStore((s) => s.duplicateElement)
  const reorderElement = useStampStore((s) => s.reorderElement)

  const sorted = [...project.elements].sort((a, b) => b.zIndex - a.zIndex)

  if (sorted.length === 0) {
    return <p className="text-sm text-ink/50">No layers yet. Add an element to get started.</p>
  }

  return (
    <ul className="flex flex-col gap-2">
      {sorted.map((element) => {
        const isSelected = selectedIds.includes(element.id)
        return (
          <li
            key={element.id}
            className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm ${
              isSelected ? 'border-accent bg-accent/10' : 'border-line'
            }`}
          >
            <button className="text-left" onClick={() => select([element.id])}>
              {labelFor(element)}
            </button>
            <div className="flex gap-1">
              <IconButton icon={<ArrowUp size={14} />} label="Move layer up" onClick={() => reorderElement(element.id, 'up')} className="min-h-8 min-w-8" />
              <IconButton icon={<ArrowDown size={14} />} label="Move layer down" onClick={() => reorderElement(element.id, 'down')} className="min-h-8 min-w-8" />
              <IconButton icon={<Copy size={14} />} label="Duplicate layer" onClick={() => duplicateElement(element.id)} className="min-h-8 min-w-8" />
              <IconButton icon={<Trash2 size={14} />} label="Delete layer" onClick={() => removeElement(element.id)} className="min-h-8 min-w-8" />
            </div>
          </li>
        )
      })}
    </ul>
  )
}
```

- [ ] **Step 7: Assemble PropertiesPanel**

```tsx
// src/components/editor/PropertiesPanel.tsx
import { useProject, useSelectedIds } from '../../store/useStampStore'
import TextProperties from './TextProperties'
import CurvedTextProperties from './CurvedTextProperties'
import ShapeProperties from './ShapeProperties'
import ImageProperties from './ImageProperties'
import StampSettingsPanel from './StampSettingsPanel'
import InkPreviewControls from './InkPreviewControls'
import LayerList from './LayerList'

export default function PropertiesPanel() {
  const project = useProject()
  const selectedIds = useSelectedIds()
  const selected = project.elements.find((el) => el.id === selectedIds[0])

  return (
    <div className="flex flex-col gap-6 p-4">
      {selected ? (
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink/50">
            Element properties
          </h3>
          {selected.type === 'text' && <TextProperties element={selected} />}
          {selected.type === 'curvedText' && <CurvedTextProperties element={selected} />}
          {selected.type === 'shape' && <ShapeProperties element={selected} />}
          {selected.type === 'image' && <ImageProperties element={selected} />}
        </div>
      ) : (
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink/50">Stamp settings</h3>
          <StampSettingsPanel />
        </div>
      )}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink/50">Ink preview</h3>
        <InkPreviewControls />
      </div>
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink/50">Layers</h3>
        <LayerList />
      </div>
    </div>
  )
}
```

- [ ] **Step 8: Manual verification**

Temporarily assemble `Toolbar` + `StampCanvas` + `PropertiesPanel` in a 3-column flex layout inside `StampStudioPage`. Add a text element, confirm editing its text/font/size/color updates the canvas live. Add a curved-text element and confirm changing radius/start position visibly moves the arc. Add a shape and toggle fill. Reorder layers and confirm z-order changes on canvas. Delete and duplicate a layer.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: add properties panel for text, curved text, shapes, images, stamp settings, ink preview, layers"
```

---

## Task 11: Keyboard Shortcuts (Undo/Redo/Delete) and EditorTopBar (New/Save/Load/Reset)

**Files:**
- Create: `src/components/editor/EditorTopBar.tsx`
- Modify: `src/pages/StampStudioPage.tsx` (add keyboard shortcut effect — page assembly itself happens fully in Task 12, but the effect can be added to the stub now since it only needs the store)

**Interfaces:**
- Consumes: `useStampStore` (undo/redo/removeElement/loadProject/resetProject), `useCanUndo`, `useCanRedo`, `useSelectedIds`, `saveProject`/`loadProject` (persistence, Task 6), `createDefaultProject` (Task 4).
- Produces: `EditorTopBar()` rendering New/Save/Load/Reset and Undo/Redo buttons wired to the store and to `src/lib/persistence.ts`.

- [ ] **Step 1: Write EditorTopBar**

```tsx
// src/components/editor/EditorTopBar.tsx
import { Undo2, Redo2, FilePlus, Save, FolderOpen, RotateCcw } from 'lucide-react'
import { useStampStore, useCanUndo, useCanRedo, useProject } from '../../store/useStampStore'
import { saveProject, loadProject as loadFromStorage } from '../../lib/persistence'
import IconButton from '../ui/IconButton'

export default function EditorTopBar() {
  const project = useProject()
  const undo = useStampStore((s) => s.undo)
  const redo = useStampStore((s) => s.redo)
  const loadProject = useStampStore((s) => s.loadProject)
  const resetProject = useStampStore((s) => s.resetProject)
  const canUndo = useCanUndo()
  const canRedo = useCanRedo()

  function handleSave() {
    saveProject(project)
  }

  function handleLoad() {
    const saved = loadFromStorage()
    if (saved) loadProject(saved)
  }

  function handleReset() {
    if (window.confirm('Reset the current design? This cannot be undone.')) {
      resetProject()
    }
  }

  function handleNew() {
    if (window.confirm('Start a new design? Unsaved changes will be lost.')) {
      resetProject()
    }
  }

  return (
    <div className="flex items-center justify-between border-b border-line px-4 py-2">
      <div className="flex gap-2">
        <IconButton icon={<FilePlus size={18} />} label="New design" onClick={handleNew} />
        <IconButton icon={<Save size={18} />} label="Save" onClick={handleSave} />
        <IconButton icon={<FolderOpen size={18} />} label="Load" onClick={handleLoad} />
        <IconButton icon={<RotateCcw size={18} />} label="Reset" onClick={handleReset} />
      </div>
      <div className="flex gap-2">
        <IconButton icon={<Undo2 size={18} />} label="Undo" onClick={undo} disabled={!canUndo} />
        <IconButton icon={<Redo2 size={18} />} label="Redo" onClick={redo} disabled={!canRedo} />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Add a keyboard shortcut hook**

Create `src/lib/useEditorKeyboardShortcuts.ts`:
```ts
import { useEffect } from 'react'
import { useStampStore } from '../store/useStampStore'

export function useEditorKeyboardShortcuts() {
  const undo = useStampStore((s) => s.undo)
  const redo = useStampStore((s) => s.redo)
  const removeElement = useStampStore((s) => s.removeElement)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const isMod = e.ctrlKey || e.metaKey
      if (!isMod) return

      const target = e.target as HTMLElement
      const isEditingText = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA'
      if (isEditingText) return

      if (e.key.toLowerCase() === 'z' && e.shiftKey) {
        e.preventDefault()
        redo()
      } else if (e.key.toLowerCase() === 'z') {
        e.preventDefault()
        undo()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [undo, redo, removeElement])
}
```

Note: Delete-key-to-remove-selected-element is intentionally left out of this global hook because Delete/Backspace must not fire while a user is typing in any text input — Task 12's `StampStudioPage` wires a scoped Delete handler directly where the selected id is known, avoiding ambiguity here.

- [ ] **Step 3: Manual verification**

This hook is exercised fully once wired into `StampStudioPage` in Task 12. For now, verify it compiles:
```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add editor top bar (new/save/load/reset/undo/redo) and keyboard shortcuts hook"
```

---

## Task 12: Export Pipeline (SVG serialize, SVG export, PNG export)

**Files:**
- Create: `src/lib/svgSerialize.ts`
- Create: `src/lib/exportSvg.ts`
- Create: `src/lib/exportPng.ts`
- Create: `src/components/editor/ExportPanel.tsx`

**Interfaces:**
- Consumes: the `#stamp-canvas-svg` element rendered by `StampCanvas` (Task 7/8); `useProject`.
- Produces:
  ```ts
  // src/lib/svgSerialize.ts
  export function getCleanSvgString(dimensions: { width: number; height: number }): string
  // Clones #stamp-canvas-svg from the live DOM, strips selection-only nodes
  // (elements with data-selection-ui="true"), sets viewBox/width/height to
  // exactly match `dimensions` (mm treated as user units), and serializes.
  ```
  ```ts
  // src/lib/exportSvg.ts
  export function downloadSvg(svgString: string, filename: string): void
  ```
  ```ts
  // src/lib/exportPng.ts
  export async function exportSvgToPngBlob(svgString: string, widthPx: number, heightPx: number, transparent: boolean): Promise<Blob>
  export function downloadBlob(blob: Blob, filename: string): void
  ```
- `ExportPanel()` — UI with format toggle (PNG/SVG), PNG scale selector (1x/2x/3x), transparent-background checkbox (PNG only), and a Download button.

- [ ] **Step 1: Mark selection-only SVG nodes for exclusion**

Modify `src/components/editor/SelectionOverlay.tsx` — add `data-selection-ui="true"` to the outer `<g>`:
```tsx
export default function SelectionOverlay({ element, onResizeStart, onRotateStart }: SelectionOverlayProps) {
  const { width, height } = boundingSize(element)
  const halfW = (width * element.scale) / 2
  const halfH = (height * element.scale) / 2

  return (
    <g data-selection-ui="true" transform={`translate(${element.x} ${element.y}) rotate(${element.rotation})`}>
```
(Keep the rest of the file unchanged — only the opening tag of the returned `<g>` gains the attribute.)

- [ ] **Step 2: Write svgSerialize.ts**

```ts
// src/lib/svgSerialize.ts
export function getCleanSvgString(dimensions: { width: number; height: number }): string {
  const source = document.getElementById('stamp-canvas-svg') as SVGSVGElement | null
  if (!source) throw new Error('Canvas SVG not found')

  const clone = source.cloneNode(true) as SVGSVGElement
  clone.querySelectorAll('[data-selection-ui="true"]').forEach((node) => node.remove())

  const padding = 10
  const viewWidth = dimensions.width + padding * 2
  const viewHeight = dimensions.height + padding * 2

  clone.setAttribute('viewBox', `${-viewWidth / 2} ${-viewHeight / 2} ${viewWidth} ${viewHeight}`)
  clone.setAttribute('width', `${viewWidth}mm`)
  clone.setAttribute('height', `${viewHeight}mm`)
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')

  return new XMLSerializer().serializeToString(clone)
}
```

- [ ] **Step 3: Write exportSvg.ts**

```ts
// src/lib/exportSvg.ts
export function downloadSvg(svgString: string, filename: string): void {
  const blob = new Blob([svgString], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
```

- [ ] **Step 4: Write exportPng.ts**

```ts
// src/lib/exportPng.ts
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export async function exportSvgToPngBlob(
  svgString: string,
  widthPx: number,
  heightPx: number,
  transparent: boolean,
): Promise<Blob> {
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(svgBlob)

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = url
    })

    const canvas = document.createElement('canvas')
    canvas.width = widthPx
    canvas.height = heightPx
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas 2D context unavailable')

    if (!transparent) {
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, widthPx, heightPx)
    }

    ctx.drawImage(image, 0, 0, widthPx, heightPx)

    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob)
        else reject(new Error('PNG export failed'))
      }, 'image/png')
    })
  } finally {
    URL.revokeObjectURL(url)
  }
}
```

- [ ] **Step 5: Write ExportPanel**

```tsx
// src/components/editor/ExportPanel.tsx
import { useState } from 'react'
import { useProject } from '../../store/useStampStore'
import { getCleanSvgString } from '../../lib/svgSerialize'
import { downloadSvg } from '../../lib/exportSvg'
import { exportSvgToPngBlob, downloadBlob } from '../../lib/exportPng'
import { BRAND } from '../../config/brand'
import Button from '../ui/Button'
import Select from '../ui/Select'

const PX_PER_MM = 8 // baseline raster density before scale multiplier

export default function ExportPanel() {
  const project = useProject()
  const [format, setFormat] = useState<'png' | 'svg'>('png')
  const [scale, setScale] = useState<'1' | '2' | '3'>('2')
  const [transparent, setTransparent] = useState(true)
  const [busy, setBusy] = useState(false)

  async function handleExport() {
    setBusy(true)
    try {
      const svgString = getCleanSvgString(project.dimensions)
      const filenameBase = `${BRAND.name.toLowerCase()}-stamp-${project.id.slice(0, 6)}`

      if (format === 'svg') {
        downloadSvg(svgString, `${filenameBase}.svg`)
      } else {
        const padding = 10
        const widthMm = project.dimensions.width + padding * 2
        const heightMm = project.dimensions.height + padding * 2
        const multiplier = Number(scale)
        const widthPx = Math.round(widthMm * PX_PER_MM * multiplier)
        const heightPx = Math.round(heightMm * PX_PER_MM * multiplier)
        const blob = await exportSvgToPngBlob(svgString, widthPx, heightPx, transparent)
        downloadBlob(blob, `${filenameBase}@${scale}x.png`)
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Select
        label="Format"
        value={format}
        options={[
          { label: 'PNG', value: 'png' },
          { label: 'SVG (vector)', value: 'svg' },
        ]}
        onChange={(value) => setFormat(value as 'png' | 'svg')}
      />
      {format === 'png' && (
        <>
          <Select
            label="Scale"
            value={scale}
            options={[
              { label: '1x', value: '1' },
              { label: '2x', value: '2' },
              { label: '3x', value: '3' },
            ]}
            onChange={(value) => setScale(value as '1' | '2' | '3')}
          />
          <label className="flex items-center gap-2 text-sm text-ink/70">
            <input type="checkbox" checked={transparent} onChange={(e) => setTransparent(e.target.checked)} />
            Transparent background
          </label>
        </>
      )}
      <Button onClick={handleExport} disabled={busy}>
        {busy ? 'Exporting…' : 'Download'}
      </Button>
    </div>
  )
}
```

- [ ] **Step 6: Manual verification**

Temporarily render `<ExportPanel />` in `StampStudioPage` alongside the existing temporary editor assembly. Build a stamp with a couple of elements, export SVG and confirm the downloaded file opens correctly in a browser tab and matches the canvas. Export PNG at 2x with transparent background checked, confirm the downloaded PNG has a transparent background and no visible dashed selection box baked in (i.e., confirm the `data-selection-ui` stripping worked by exporting while an element is selected).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add SVG/PNG export pipeline with scale and transparency options"
```

---

## Task 13: Ink Preview Effect (Clean vs Ink Mode)

**Files:**
- Modify: `src/components/editor/StampCanvas.tsx` (wrap rendered content with an ink filter when `project.ink.mode === 'ink'`)

**Interfaces:**
- Consumes: `project.ink` (`InkSettings`) from the store.
- Produces: when ink mode is active, the canvas content renders through an SVG `feTurbulence` + `feDisplacementMap` filter for subtle distress, with opacity and color-based visual treatment reflecting `ink.opacity`/`ink.color`/`ink.distress`. Purely a rendering concern — no change to element data.

- [ ] **Step 1: Add the ink filter defs and conditional wrapper**

Modify `src/components/editor/StampCanvas.tsx` — inside the returned `<svg>`, add a `<defs>` block with the filter and wrap the outline+elements group in it conditionally:

```tsx
      <defs>
        <filter id="ink-distress-filter" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency={0.9}
            numOctaves={2}
            seed={3}
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={project.ink.distress * 6}
          />
        </filter>
      </defs>
      <g
        filter={project.ink.mode === 'ink' ? 'url(#ink-distress-filter)' : undefined}
        opacity={project.ink.mode === 'ink' ? project.ink.opacity : 1}
        style={project.ink.mode === 'ink' ? { color: project.ink.color } : undefined}
      >
        <StampOutline shape={project.shape} width={project.dimensions.width} height={project.dimensions.height} />
        {sorted.map((element) => (
          <CanvasElementView
            key={element.id}
            element={element}
            isSelected={selectedIds.includes(element.id)}
            onPointerDownSelect={handleElementPointerDown}
          />
        ))}
      </g>
```

Place this in place of the previous unwrapped `<StampOutline />` + `.map(...)` block, keeping `<SelectionOverlay>` rendering outside this group (unaffected by the ink filter, since it's editor UI, not stamp artwork).

- [ ] **Step 2: Manual verification**

In the running dev server, add a couple of elements, switch ink mode to "Ink" via the (temporary or real, if Task 10 is already assembled) `InkPreviewControls`, and confirm the stamp visibly gets a subtle wobble/distress and tinted opacity. Increase the Distress slider and confirm the wobble increases. Switch back to Clean and confirm the effect fully disappears.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add ink preview distress filter to stamp canvas"
```

---

## Task 14: Assemble StampStudioPage (Desktop Layout) — Remove All Temporary Scaffolding

**Files:**
- Modify: `src/pages/StampStudioPage.tsx` (full real implementation, replacing the Task 2 stub and any temporary debug code added in Tasks 4–13)

**Interfaces:**
- Consumes: `EditorTopBar`, `Toolbar`, `StampCanvas`, `PropertiesPanel` (all prior tasks), `useEditorKeyboardShortcuts`, `saveProject`, `useProject`, `useSelectedIds`, `useStampStore`.
- Produces: the fully working desktop 3-column editor page. Mobile layout is added on top of this in Task 15 (this task can ship a page that's usable-but-not-ideal on narrow screens; Task 15 makes it genuinely responsive).

- [ ] **Step 1: Write the real StampStudioPage**

```tsx
// src/pages/StampStudioPage.tsx
import { useEffect } from 'react'
import PageShell from '../components/layout/PageShell'
import EditorTopBar from '../components/editor/EditorTopBar'
import Toolbar from '../components/editor/Toolbar'
import StampCanvas from '../components/editor/StampCanvas'
import PropertiesPanel from '../components/editor/PropertiesPanel'
import { useEditorKeyboardShortcuts } from '../lib/useEditorKeyboardShortcuts'
import { useProject, useSelectedIds, useStampStore } from '../store/useStampStore'
import { saveProject, loadProject as loadFromStorage } from '../lib/persistence'

export default function StampStudioPage() {
  const project = useProject()
  const selectedIds = useSelectedIds()
  const removeElement = useStampStore((s) => s.removeElement)
  const loadProject = useStampStore((s) => s.loadProject)

  useEditorKeyboardShortcuts()

  useEffect(() => {
    const saved = loadFromStorage()
    if (saved) loadProject(saved)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => saveProject(project), 400)
    return () => clearTimeout(timeout)
  }, [project])

  useEffect(() => {
    function handleDeleteKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement
      const isEditingText = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA'
      if (isEditingText) return
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedIds[0]) {
        e.preventDefault()
        removeElement(selectedIds[0])
      }
    }
    window.addEventListener('keydown', handleDeleteKey)
    return () => window.removeEventListener('keydown', handleDeleteKey)
  }, [selectedIds, removeElement])

  return (
    <PageShell
      title="Stamp Studio — MarkForge"
      description="Design your custom stamp: choose a shape, add text and curved text, customize colors, preview the ink effect, and export as PNG or SVG."
    >
      <div className="flex h-[calc(100vh-65px)] flex-col">
        <EditorTopBar />
        <div className="hidden flex-1 md:grid md:grid-cols-[72px_1fr_320px]">
          <aside className="overflow-y-auto border-r border-line">
            <Toolbar />
          </aside>
          <div className="flex items-center justify-center overflow-hidden bg-line/20 p-8">
            <div className="aspect-square w-full max-w-xl">
              <StampCanvas />
            </div>
          </div>
          <aside className="overflow-y-auto border-l border-line">
            <PropertiesPanel />
          </aside>
        </div>
        <div className="flex flex-1 flex-col md:hidden">
          <div className="flex flex-1 items-center justify-center bg-line/20 p-4">
            <div className="aspect-square w-full max-w-sm">
              <StampCanvas />
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
```

Note: the `md:hidden` mobile branch here is a minimal placeholder (canvas only, no tools/properties reachable) — Task 15 replaces it with the real mobile bottom-toolbar + bottom-sheet layout. This task's job is to get the desktop experience fully correct and remove every piece of temporary debug code left over from Tasks 4–13.

- [ ] **Step 2: Sweep for leftover temporary code**

Search the codebase for temporary debug artifacts left during earlier tasks:
```bash
grep -rn "console.log" src/ || true
grep -rn "scratch-malicious" src/ || true
```
Remove any remaining temporary buttons, console logs, or debug-only imports found in `StampStudioPage.tsx` or elsewhere. Confirm `git status` shows no stray `scratch-*` files.

- [ ] **Step 3: Full golden-path manual verification**

Run `npm run build` then `npm run dev`. In the browser: go to Home, click "Open Stamp Studio", change stamp shape, add a text element and edit it, add a curved text element and adjust radius/start position, add a shape, upload an image, switch to Ink preview mode, reorder layers, undo twice then redo once, refresh the browser and confirm the design survived (autosave/reload), then export both SVG and PNG and confirm both downloads look correct.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: assemble full desktop Stamp Studio page with autosave and delete shortcut"
```

---

## Task 15: Mobile Editor Layout (Bottom Toolbar + Bottom Sheet)

**Files:**
- Create: `src/components/editor/MobileToolbar.tsx`
- Create: `src/components/editor/MobileBottomSheet.tsx`
- Modify: `src/pages/StampStudioPage.tsx` (replace the placeholder mobile branch)

**Interfaces:**
- Consumes: same `Toolbar`/`PropertiesPanel` content but rearranged; `useSelectedIds`.
- Produces: `MobileToolbar(props: { onOpenAdd: () => void; onOpenProperties: () => void })` — a fixed bottom icon bar with large touch targets. `MobileBottomSheet(props: { open: boolean; onClose: () => void; children: ReactNode })` — a slide-up panel over the canvas.

- [ ] **Step 1: Write MobileBottomSheet**

```tsx
// src/components/editor/MobileBottomSheet.tsx
import { X } from 'lucide-react'
import type { ReactNode } from 'react'

interface MobileBottomSheetProps {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}

export default function MobileBottomSheet({ open, title, onClose, children }: MobileBottomSheetProps) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-40 flex flex-col justify-end md:hidden">
      <div className="flex-1 bg-ink/30" onClick={onClose} />
      <div className="max-h-[70vh] overflow-y-auto rounded-t-2xl border-t border-line bg-paper p-4 shadow-lg">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink/50">{title}</h2>
          <button
            aria-label="Close"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-line/50"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Write MobileToolbar**

```tsx
// src/components/editor/MobileToolbar.tsx
import { Plus, Sliders, Layers } from 'lucide-react'

interface MobileToolbarProps {
  onOpenAdd: () => void
  onOpenProperties: () => void
  onOpenLayers: () => void
}

export default function MobileToolbar({ onOpenAdd, onOpenProperties, onOpenLayers }: MobileToolbarProps) {
  return (
    <div className="flex items-center justify-around border-t border-line bg-paper py-2 md:hidden">
      <button
        onClick={onOpenAdd}
        className="flex min-h-11 min-w-11 flex-col items-center gap-1 rounded-xl2 px-3 py-1 text-xs text-ink"
      >
        <Plus size={20} />
        Add
      </button>
      <button
        onClick={onOpenProperties}
        className="flex min-h-11 min-w-11 flex-col items-center gap-1 rounded-xl2 px-3 py-1 text-xs text-ink"
      >
        <Sliders size={20} />
        Edit
      </button>
      <button
        onClick={onOpenLayers}
        className="flex min-h-11 min-w-11 flex-col items-center gap-1 rounded-xl2 px-3 py-1 text-xs text-ink"
      >
        <Layers size={20} />
        Layers
      </button>
    </div>
  )
}
```

- [ ] **Step 3: Wire mobile layout into StampStudioPage**

Modify `src/pages/StampStudioPage.tsx` — add local sheet-visibility state and replace the mobile placeholder branch:

```tsx
import { useEffect, useState } from 'react'
// ...existing imports...
import MobileToolbar from '../components/editor/MobileToolbar'
import MobileBottomSheet from '../components/editor/MobileBottomSheet'
import Toolbar from '../components/editor/Toolbar'
import PropertiesPanel from '../components/editor/PropertiesPanel'
import ExportPanel from '../components/editor/ExportPanel'
```

Add inside the component, alongside existing hooks:
```tsx
  const [mobileSheet, setMobileSheet] = useState<'none' | 'add' | 'properties' | 'layers'>('none')
```

Replace the previous placeholder mobile `<div className="flex flex-1 flex-col md:hidden">...</div>` block with:
```tsx
        <div className="flex flex-1 flex-col md:hidden">
          <div className="flex flex-1 items-center justify-center bg-line/20 p-4">
            <div className="aspect-square w-full max-w-sm">
              <StampCanvas />
            </div>
          </div>
          <MobileToolbar
            onOpenAdd={() => setMobileSheet('add')}
            onOpenProperties={() => setMobileSheet('properties')}
            onOpenLayers={() => setMobileSheet('layers')}
          />
          <MobileBottomSheet title="Add element" open={mobileSheet === 'add'} onClose={() => setMobileSheet('none')}>
            <Toolbar />
          </MobileBottomSheet>
          <MobileBottomSheet title="Properties" open={mobileSheet === 'properties'} onClose={() => setMobileSheet('none')}>
            <PropertiesPanel />
          </MobileBottomSheet>
          <MobileBottomSheet title="Export" open={mobileSheet === 'layers'} onClose={() => setMobileSheet('none')}>
            <ExportPanel />
          </MobileBottomSheet>
        </div>
```

Also add `ExportPanel` to the desktop right-hand `PropertiesPanel` column area — modify the desktop `<aside>` wrapping `PropertiesPanel` to stack `ExportPanel` below it:
```tsx
          <aside className="overflow-y-auto border-l border-line">
            <PropertiesPanel />
            <div className="border-t border-line p-4">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink/50">Export</h3>
              <ExportPanel />
            </div>
          </aside>
```

(This is the first time `ExportPanel` is wired into the real page — earlier tasks only smoke-tested it standalone.)

- [ ] **Step 4: Manual verification at mobile width**

Run `npm run dev`, open browser devtools responsive mode at ~375px width, navigate to Stamp Studio, confirm: canvas is visible and usable, tapping "Add" opens a bottom sheet with the toolbar buttons (tap one, confirm it adds an element and the sheet can be closed), tapping "Edit" opens properties for the current selection, tapping the third button opens the export sheet and a PNG export succeeds from mobile width. Confirm all tap targets feel comfortably sized (buttons are at least 44x44 CSS px, matching the `min-h-11 min-w-11` class used throughout).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add responsive mobile editor layout with bottom toolbar and bottom sheets"
```

---

## Task 16: Template Data (~15 Original Templates)

**Files:**
- Create: `src/data/templateCategories.ts`
- Create: `src/data/templates.ts`

**Interfaces:**
- Produces:
  ```ts
  // src/data/templateCategories.ts
  export type TemplateCategory =
    | 'Business' | 'Address' | 'Packaging' | 'Personal'
    | 'Creative' | 'Teacher' | 'Monogram' | 'Date'
  export const TEMPLATE_CATEGORIES: TemplateCategory[]
  ```
  ```ts
  // src/data/templates.ts
  export interface StampTemplate {
    id: string
    name: string
    category: TemplateCategory
    project: Omit<StampProject, 'id' | 'updatedAt'>
  }
  export const TEMPLATES: StampTemplate[]
  ```

- [ ] **Step 1: Write templateCategories.ts**

```ts
// src/data/templateCategories.ts
export type TemplateCategory =
  | 'Business'
  | 'Address'
  | 'Packaging'
  | 'Personal'
  | 'Creative'
  | 'Teacher'
  | 'Monogram'
  | 'Date'

export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  'Business',
  'Address',
  'Packaging',
  'Personal',
  'Creative',
  'Teacher',
  'Monogram',
  'Date',
]
```

- [ ] **Step 2: Write 15 original template definitions**

Create `src/data/templates.ts`. Each template is a full `StampProject` (minus `id`/`updatedAt`, generated at load time). Use only fictional names/content, original layouts:

```ts
// src/data/templates.ts
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
        text({ text: 'MS. RAMIREZ\u2019S CLASS', y: 4, fontSize: 3, letterSpacing: 1 }),
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
      elements: [text({ text: 'M \u00b7 K', y: 0, fontSize: 8, fontWeight: 600, letterSpacing: 2 })],
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
```

That's 15 templates across the required 8 categories (Business x2, Address x2, Packaging x2, Personal x2, Creative x2, Teacher x2, Monogram x2, Date x1). All names/content are fictional and original.

- [ ] **Step 2: Verify it compiles**

```bash
npx tsc --noEmit
```
Expected: no errors. Fix any type mismatches between the helper functions' partial overrides and the strict `StampElement` union if TS complains (the `as StampElement` casts inside each helper are there specifically to allow the partial-override pattern; if a specific literal type like `align` or `direction` fails to narrow, ensure the overrides object uses the literal type, not a widened `string`).

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add 15 original stamp templates across all required categories"
```

---

## Task 17: Templates Page and "Use Template" Wiring

**Files:**
- Create: `src/components/templates/TemplateCard.tsx`
- Create: `src/components/templates/TemplateGrid.tsx`
- Modify: `src/pages/TemplatesPage.tsx` (replace stub)
- Modify: `src/lib/id.ts` — no change needed (already generic); instead modify `src/data/templates.ts` consumers to generate ids at load time via `uid()`

**Interfaces:**
- Consumes: `TEMPLATES`, `TEMPLATE_CATEGORIES` (Task 16); `useStampStore().loadProject`; `uid`.
- Produces: `TemplateCard(props: { template: StampTemplate; onUse: (template: StampTemplate) => void })`; `TemplateGrid(props: { templates: StampTemplate[]; onUse: (template: StampTemplate) => void })`. `TemplatesPage` filters by category and navigates to `/studio` after loading the chosen template into the store.

- [ ] **Step 1: Write a tiny template thumbnail renderer and TemplateCard**

Create `src/components/templates/TemplateCard.tsx`:
```tsx
import type { StampTemplate } from '../../data/templates'
import Button from '../ui/Button'

function MiniOutline({ shape, width, height }: { shape: string; width: number; height: number }) {
  const stroke = '#2B2A28'
  if (shape === 'circle' || shape === 'badge') {
    return <circle r={Math.min(width, height) / 2} fill="none" stroke={stroke} strokeWidth={1} />
  }
  if (shape === 'oval') {
    return <ellipse rx={width / 2} ry={height / 2} fill="none" stroke={stroke} strokeWidth={1} />
  }
  return (
    <rect
      x={-width / 2}
      y={-height / 2}
      width={width}
      height={height}
      rx={shape === 'roundedRectangle' ? 6 : 0}
      fill="none"
      stroke={stroke}
      strokeWidth={1}
    />
  )
}

export default function TemplateCard({
  template,
  onUse,
}: {
  template: StampTemplate
  onUse: (template: StampTemplate) => void
}) {
  const { shape, dimensions } = template.project
  const padding = 10
  const viewWidth = dimensions.width + padding * 2
  const viewHeight = dimensions.height + padding * 2
  const firstTextEl = template.project.elements.find((el) => el.type === 'text' || el.type === 'curvedText')

  return (
    <div className="flex flex-col gap-3 rounded-xl2 border border-line bg-paper p-4 shadow-sm">
      <div className="flex aspect-square items-center justify-center rounded-lg bg-line/20">
        <svg viewBox={`${-viewWidth / 2} ${-viewHeight / 2} ${viewWidth} ${viewHeight}`} width="70%" height="70%">
          <MiniOutline shape={shape} width={dimensions.width} height={dimensions.height} />
          {firstTextEl && (
            <text textAnchor="middle" fontSize={5} fontWeight={600} fill="#2B2A28">
              {'text' in firstTextEl ? firstTextEl.text : ''}
            </text>
          )}
        </svg>
      </div>
      <div>
        <p className="text-sm font-semibold text-ink">{template.name}</p>
        <p className="text-xs text-ink/50">{template.category}</p>
      </div>
      <Button variant="secondary" onClick={() => onUse(template)}>
        Use Template
      </Button>
    </div>
  )
}
```

- [ ] **Step 2: Write TemplateGrid**

```tsx
// src/components/templates/TemplateGrid.tsx
import type { StampTemplate } from '../../data/templates'
import TemplateCard from './TemplateCard'

export default function TemplateGrid({
  templates,
  onUse,
}: {
  templates: StampTemplate[]
  onUse: (template: StampTemplate) => void
}) {
  if (templates.length === 0) {
    return <p className="text-sm text-ink/50">No templates in this category yet.</p>
  }
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {templates.map((template) => (
        <TemplateCard key={template.id} template={template} onUse={onUse} />
      ))}
    </div>
  )
}
```

- [ ] **Step 3: Write the real TemplatesPage**

```tsx
// src/pages/TemplatesPage.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageShell from '../components/layout/PageShell'
import TemplateGrid from '../components/templates/TemplateGrid'
import { TEMPLATES, type StampTemplate } from '../data/templates'
import { TEMPLATE_CATEGORIES } from '../data/templateCategories'
import { useStampStore } from '../store/useStampStore'
import { uid } from '../lib/id'
import Button from '../components/ui/Button'

export default function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const loadProject = useStampStore((s) => s.loadProject)
  const navigate = useNavigate()

  const filtered =
    activeCategory === 'All' ? TEMPLATES : TEMPLATES.filter((t) => t.category === activeCategory)

  function handleUse(template: StampTemplate) {
    loadProject({ ...template.project, id: uid(), updatedAt: Date.now() })
    navigate('/studio')
  }

  return (
    <PageShell
      title="Templates — MarkForge"
      description="Browse original stamp templates for business, address, packaging, personal, creative, teacher, monogram, and date stamps."
    >
      <div className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="text-3xl font-semibold">Templates</h1>
        <p className="mt-2 text-ink/60">
          Start from an original layout and make it your own in Stamp Studio.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Button
            variant={activeCategory === 'All' ? 'primary' : 'secondary'}
            onClick={() => setActiveCategory('All')}
          >
            All
          </Button>
          {TEMPLATE_CATEGORIES.map((category) => (
            <Button
              key={category}
              variant={activeCategory === category ? 'primary' : 'secondary'}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
        <div className="mt-8">
          <TemplateGrid templates={filtered} onUse={handleUse} />
        </div>
      </div>
    </PageShell>
  )
}
```

- [ ] **Step 4: Manual verification**

Run `npm run dev`, go to `/templates`, confirm all 15 templates render with a recognizable mini preview and correct category, filter by a couple of categories, click "Use Template" on one and confirm it navigates to `/studio` with that template's shape/text/elements loaded onto the canvas exactly.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add templates page with category filtering and use-template flow"
```

---

## Task 18: Home Page (Hero, Sections, Original Copy)

**Files:**
- Create: `src/components/home/Hero.tsx`, `HowItWorksSection.tsx`, `FeaturesSection.tsx`, `TemplatesPreviewSection.tsx`, `ExportSection.tsx`, `UseCasesSection.tsx`, `FaqPreviewSection.tsx`, `FinalCtaSection.tsx`
- Modify: `src/pages/HomePage.tsx` (replace stub)

**Interfaces:**
- Consumes: `BRAND` config; `TEMPLATES` (for the templates preview section, showing e.g. 3 cards); `Link` from react-router-dom.
- Produces: no cross-task interfaces beyond assembling `HomePage`; each section component takes no props (static original copy).

- [ ] **Step 1: Write Hero with an original stamp preview**

```tsx
// src/components/home/Hero.tsx
import { Link } from 'react-router-dom'
import { BRAND } from '../../config/brand'
import Button from '../ui/Button'

export default function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-2 md:items-center">
      <div>
        <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
          {BRAND.tagline}
        </h1>
        <p className="mt-4 max-w-md text-lg text-ink/70">{BRAND.supportingCopy}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/studio">
            <Button>Open Stamp Studio</Button>
          </Link>
          <Link to="/templates">
            <Button variant="secondary">Browse Templates</Button>
          </Link>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <div className="flex h-64 w-64 items-center justify-center rounded-full border-2 border-ink/80 bg-paper shadow-md">
          <svg viewBox="-50 -50 100 100" width="80%" height="80%">
            <circle r={44} fill="none" stroke="#2B2A28" strokeWidth={1.2} />
            <path id="hero-arc" d="M -30 -20 A 34 34 0 1 1 30 -20" fill="none" />
            <text fontSize={5.5} fontWeight={700} letterSpacing={1.5} fill="#2B2A28">
              <textPath href="#hero-arc" startOffset="8%">
                NORTH &amp; PINE
              </textPath>
            </text>
            <text textAnchor="middle" y={4} fontSize={7} fontWeight={600} fill="#2B2A28">
              N&amp;P
            </text>
            <text textAnchor="middle" y={16} fontSize={3.6} letterSpacing={2} fill="#2B2A28">
              EST. 2026
            </text>
          </svg>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Write the remaining home sections with original copy**

```tsx
// src/components/home/HowItWorksSection.tsx
const steps = [
  { title: 'Pick a shape', body: 'Start blank or choose a circle, oval, rectangle, rounded rectangle, or badge.' },
  { title: 'Add your details', body: 'Drop in text, curved text, shapes, or your own artwork, then arrange them on the canvas.' },
  { title: 'Export and use', body: 'Preview the clean or inked look, then download a crisp PNG or scalable SVG.' },
]

export default function HowItWorksSection() {
  return (
    <section className="border-t border-line bg-paper py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-2xl font-semibold">How it works</h2>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.title} className="rounded-xl2 border border-line p-6">
              <span className="text-sm font-semibold text-accent">0{i + 1}</span>
              <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-ink/60">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

```tsx
// src/components/home/FeaturesSection.tsx
const features = [
  { title: 'True curved text', body: 'Bend text along a real arc with control over radius, spacing, and start position.' },
  { title: 'Layered composition', body: 'Stack text, shapes, and images with full control over order, rotation, and size.' },
  { title: 'Ink preview', body: 'Toggle a clean digital look or a subtle inked, stamped texture before you export.' },
  { title: 'Undo-friendly', body: 'Every change is tracked, so you can experiment freely and step back anytime.' },
]

export default function FeaturesSection() {
  return (
    <section className="border-t border-line bg-paper py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-2xl font-semibold">Editor features</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-xl2 border border-line p-6">
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-ink/60">{feature.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

```tsx
// src/components/home/TemplatesPreviewSection.tsx
import { Link } from 'react-router-dom'
import { TEMPLATES } from '../../data/templates'
import Button from '../ui/Button'

export default function TemplatesPreviewSection() {
  const preview = TEMPLATES.slice(0, 3)
  return (
    <section className="border-t border-line bg-paper py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Start from a template</h2>
          <Link to="/templates">
            <Button variant="ghost">View all templates</Button>
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {preview.map((template) => (
            <div key={template.id} className="rounded-xl2 border border-line p-6">
              <p className="text-sm font-semibold">{template.name}</p>
              <p className="mt-1 text-xs text-ink/50">{template.category}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

```tsx
// src/components/home/ExportSection.tsx
const formats = [
  { title: 'PNG', body: 'Raster export at 1x, 2x, or 3x, with optional transparent background.' },
  { title: 'SVG', body: 'Clean vector output that preserves your exact artwork for resizing later.' },
]

export default function ExportSection() {
  return (
    <section className="border-t border-line bg-paper py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-2xl font-semibold">Export options</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {formats.map((format) => (
            <div key={format.title} className="rounded-xl2 border border-line p-6">
              <h3 className="text-lg font-semibold">{format.title}</h3>
              <p className="mt-2 text-sm text-ink/60">{format.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

```tsx
// src/components/home/UseCasesSection.tsx
const useCases = [
  'Small business receipts and packaging',
  'Return-address marks for personal mail',
  'Classroom feedback and encouragement marks',
  'Monogrammed personal stationery',
  'Creative project branding',
]

export default function UseCasesSection() {
  return (
    <section className="border-t border-line bg-paper py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-2xl font-semibold">Use cases</h2>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {useCases.map((useCase) => (
            <li key={useCase} className="rounded-lg border border-line px-4 py-3 text-sm text-ink/70">
              {useCase}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
```

```tsx
// src/components/home/FaqPreviewSection.tsx
import { Link } from 'react-router-dom'

const faqs = [
  { q: 'Do I need an account?', a: 'No. Stamp Studio works entirely in your browser, and your project is saved locally on your device.' },
  { q: 'Can I use my own artwork?', a: 'Yes, upload a PNG, JPG, or SVG and position it anywhere on your stamp.' },
  { q: 'What file formats can I export?', a: 'PNG at multiple resolutions, and SVG for scalable vector use.' },
]

export default function FaqPreviewSection() {
  return (
    <section className="border-t border-line bg-paper py-20">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="text-2xl font-semibold">Frequently asked questions</h2>
        <div className="mt-8 flex flex-col gap-4">
          {faqs.map((faq) => (
            <div key={faq.q} className="rounded-xl2 border border-line p-5">
              <p className="font-medium">{faq.q}</p>
              <p className="mt-1 text-sm text-ink/60">{faq.a}</p>
            </div>
          ))}
        </div>
        <Link to="/faq" className="mt-6 inline-block text-sm text-accent underline">
          See all questions
        </Link>
      </div>
    </section>
  )
}
```

```tsx
// src/components/home/FinalCtaSection.tsx
import { Link } from 'react-router-dom'
import Button from '../ui/Button'

export default function FinalCtaSection() {
  return (
    <section className="border-t border-line bg-ink py-20 text-paper">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-3xl font-semibold">Ready to make your mark?</h2>
        <p className="mt-3 text-paper/70">
          Open Stamp Studio and have a finished design in minutes.
        </p>
        <Link to="/studio" className="mt-8 inline-block">
          <Button className="bg-paper text-ink hover:bg-accent hover:text-paper">
            Open Stamp Studio
          </Button>
        </Link>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Assemble HomePage**

```tsx
// src/pages/HomePage.tsx
import PageShell from '../components/layout/PageShell'
import { BRAND } from '../config/brand'
import Hero from '../components/home/Hero'
import HowItWorksSection from '../components/home/HowItWorksSection'
import FeaturesSection from '../components/home/FeaturesSection'
import TemplatesPreviewSection from '../components/home/TemplatesPreviewSection'
import ExportSection from '../components/home/ExportSection'
import UseCasesSection from '../components/home/UseCasesSection'
import FaqPreviewSection from '../components/home/FaqPreviewSection'
import FinalCtaSection from '../components/home/FinalCtaSection'

export default function HomePage() {
  return (
    <PageShell
      title={`${BRAND.name} — Online Stamp Maker`}
      description="Design a custom stamp online: choose a shape, add text and curved text, preview the ink effect, and export as PNG or SVG. No login required."
    >
      <Hero />
      <HowItWorksSection />
      <FeaturesSection />
      <TemplatesPreviewSection />
      <ExportSection />
      <UseCasesSection />
      <FaqPreviewSection />
      <FinalCtaSection />
    </PageShell>
  )
}
```

- [ ] **Step 4: Manual verification**

Run `npm run dev`, load `/`, confirm all sections render with original copy and the hero stamp preview shows "NORTH & PINE" / "EST. 2026" fictional content, confirm both hero buttons navigate correctly, and confirm the page looks reasonable at both desktop and mobile widths (stack cleanly, no horizontal scroll).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: build home page with hero, feature sections, and original copy"
```

---

## Task 19: How It Works, FAQ, Privacy, Terms, Responsible Use Pages

**Files:**
- Modify: `src/pages/HowItWorksPage.tsx`, `src/pages/FaqPage.tsx`, `src/pages/PrivacyPage.tsx`, `src/pages/TermsPage.tsx`, `src/pages/ResponsibleUsePage.tsx` (replace stubs with full content)

**Interfaces:**
- Consumes: `PageShell`, `BRAND`.
- Produces: no new cross-task interfaces — these are leaf content pages.

- [ ] **Step 1: Write HowItWorksPage**

```tsx
// src/pages/HowItWorksPage.tsx
import { Link } from 'react-router-dom'
import PageShell from '../components/layout/PageShell'
import { BRAND } from '../config/brand'
import Button from '../components/ui/Button'

const steps = [
  {
    title: '1. Choose a stamp shape',
    body: 'Start in Stamp Studio and pick a circle, oval, rectangle, rounded rectangle, or badge shape, then set its size.',
  },
  {
    title: '2. Add text and curved text',
    body: 'Add straight text or bend text along an arc, then adjust font, size, weight, spacing, and color from the properties panel.',
  },
  {
    title: '3. Layer in shapes and images',
    body: 'Add simple shapes or upload your own PNG, JPG, or SVG artwork, then arrange, resize, and rotate every element.',
  },
  {
    title: '4. Preview the ink effect',
    body: 'Switch between a clean digital preview and a subtle inked, stamped look before you finalize your design.',
  },
  {
    title: '5. Export your stamp',
    body: 'Download your finished stamp as a PNG at 1x, 2x, or 3x resolution, or as a scalable SVG.',
  },
]

export default function HowItWorksPage() {
  return (
    <PageShell
      title={`How It Works — ${BRAND.name}`}
      description="See how to design, customize, and export a custom stamp online in minutes with MarkForge."
    >
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-semibold">How It Works</h1>
        <div className="mt-10 flex flex-col gap-8">
          {steps.map((step) => (
            <div key={step.title}>
              <h2 className="text-lg font-semibold">{step.title}</h2>
              <p className="mt-1 text-ink/60">{step.body}</p>
            </div>
          ))}
        </div>
        <Link to="/studio" className="mt-10 inline-block">
          <Button>Open Stamp Studio</Button>
        </Link>
      </div>
    </PageShell>
  )
}
```

- [ ] **Step 2: Write FaqPage**

```tsx
// src/pages/FaqPage.tsx
import PageShell from '../components/layout/PageShell'
import { BRAND } from '../config/brand'

const faqs = [
  { q: 'Do I need to create an account?', a: 'No. Every feature works without signing up, and your in-progress design is saved locally in your browser.' },
  { q: 'Is my design uploaded anywhere?', a: `${BRAND.name} runs entirely in your browser. Nothing about your design is sent to a server.` },
  { q: 'What image formats can I upload?', a: 'You can upload PNG, JPG, or SVG files. Uploaded SVG files are automatically cleaned of scripts before use.' },
  { q: 'Can I undo mistakes?', a: 'Yes, use Ctrl/Cmd+Z to undo and Ctrl/Cmd+Shift+Z to redo, or the undo/redo buttons in the editor.' },
  { q: 'What can I export?', a: 'PNG (at 1x, 2x, or 3x, with optional transparency) and SVG (true vector artwork).' },
  { q: 'Will my work survive a page refresh?', a: 'Yes, your current project autosaves to your browser and reloads automatically.' },
  { q: 'Can I use this for official government or legal seals?', a: 'No. See our Responsible Use page — this tool is intended for legitimate design and creative or document workflows only.' },
]

export default function FaqPage() {
  return (
    <PageShell
      title={`FAQ — ${BRAND.name}`}
      description="Answers to common questions about designing, exporting, and saving custom stamps with MarkForge."
    >
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-semibold">Frequently Asked Questions</h1>
        <div className="mt-10 flex flex-col gap-6">
          {faqs.map((faq) => (
            <div key={faq.q} className="border-b border-line pb-6">
              <p className="font-medium">{faq.q}</p>
              <p className="mt-2 text-ink/60">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  )
}
```

- [ ] **Step 3: Write PrivacyPage**

```tsx
// src/pages/PrivacyPage.tsx
import PageShell from '../components/layout/PageShell'
import { BRAND } from '../config/brand'

export default function PrivacyPage() {
  return (
    <PageShell
      title={`Privacy Policy — ${BRAND.name}`}
      description={`Placeholder privacy policy for ${BRAND.name}, an in-browser stamp design tool.`}
    >
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-semibold">Privacy Policy</h1>
        <p className="mt-4 text-sm text-ink/50">
          This is a placeholder policy for the {BRAND.name} MVP. It should be reviewed by a
          qualified lawyer before this product is used commercially or launched publicly.
        </p>
        <div className="mt-8 flex flex-col gap-6 text-ink/70">
          <section>
            <h2 className="text-lg font-semibold text-ink">What we collect</h2>
            <p className="mt-2">
              {BRAND.name} runs entirely in your browser. We do not operate a backend server, and
              we do not collect, transmit, or store your stamp designs, uploaded images, or
              personal information on any server.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-ink">Local storage</h2>
            <p className="mt-2">
              Your current project is saved using your browser&rsquo;s local storage so that it
              survives a page refresh. This data stays on your device and is never transmitted
              anywhere. Clearing your browser data will remove it.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-ink">Cookies and analytics</h2>
            <p className="mt-2">This MVP does not use cookies or analytics tracking.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-ink">Changes to this policy</h2>
            <p className="mt-2">
              This placeholder policy may change as {BRAND.name} evolves. Check back for updates.
            </p>
          </section>
        </div>
      </div>
    </PageShell>
  )
}
```

- [ ] **Step 4: Write TermsPage**

```tsx
// src/pages/TermsPage.tsx
import PageShell from '../components/layout/PageShell'
import { BRAND } from '../config/brand'

export default function TermsPage() {
  return (
    <PageShell
      title={`Terms of Use — ${BRAND.name}`}
      description={`Placeholder terms of use for ${BRAND.name}, an in-browser stamp design tool.`}
    >
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-semibold">Terms of Use</h1>
        <p className="mt-4 text-sm text-ink/50">
          This is a placeholder terms document for the {BRAND.name} MVP. It should be reviewed by
          a qualified lawyer before this product is used commercially or launched publicly.
        </p>
        <div className="mt-8 flex flex-col gap-6 text-ink/70">
          <section>
            <h2 className="text-lg font-semibold text-ink">Using the tool</h2>
            <p className="mt-2">
              {BRAND.name} is provided as a design tool for creating custom stamp artwork for
              legitimate personal, educational, and business use. By using this tool, you agree to
              use it responsibly and lawfully.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-ink">Your content</h2>
            <p className="mt-2">
              Any text, images, or designs you create or upload remain yours. Since {BRAND.name}
              runs client-side, we do not host or claim any rights to your designs.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-ink">Prohibited use</h2>
            <p className="mt-2">
              You may not use {BRAND.name} to create fraudulent official seals, identity documents,
              or credentials. See our Responsible Use page for details.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-ink">No warranty</h2>
            <p className="mt-2">
              {BRAND.name} is provided "as is" without warranties of any kind, express or implied.
            </p>
          </section>
        </div>
      </div>
    </PageShell>
  )
}
```

- [ ] **Step 5: Write ResponsibleUsePage**

```tsx
// src/pages/ResponsibleUsePage.tsx
import PageShell from '../components/layout/PageShell'
import { BRAND } from '../config/brand'

const prohibited = [
  'Government seals or insignia',
  'Court seals or official judicial marks',
  'Bank or financial institution seals',
  'Identity documents (passports, licenses, ID cards)',
  'Professional credentials or licenses you do not hold',
  'Official certificates issued by an institution you do not represent',
]

export default function ResponsibleUsePage() {
  return (
    <PageShell
      title={`Responsible Use — ${BRAND.name}`}
      description={`Guidelines for responsible, legitimate use of ${BRAND.name}'s stamp design tool.`}
    >
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-semibold">Responsible Use</h1>
        <p className="mt-4 text-ink/70">
          {BRAND.name} is a general-purpose design tool intended for legitimate creative and
          document workflows &mdash; things like business stamps, address marks, packaging
          notes, classroom feedback, and personal monograms.
        </p>
        <p className="mt-4 text-ink/70">
          {BRAND.name} is not a specialized tool for producing official or legally significant
          seals, and it must not be used to create fraudulent versions of:
        </p>
        <ul className="mt-6 flex flex-col gap-2">
          {prohibited.map((item) => (
            <li key={item} className="rounded-lg border border-line px-4 py-3 text-sm text-ink/70">
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-6 text-ink/70">
          None of our templates reproduce real government insignia, and none are designed to
          imitate an official seal. If you are unsure whether your intended use is appropriate,
          consult a legal professional in your jurisdiction before proceeding.
        </p>
      </div>
    </PageShell>
  )
}
```

- [ ] **Step 6: Manual verification**

Run `npm run dev`, visit `/how-it-works`, `/faq`, `/privacy`, `/terms`, `/responsible-use` and confirm each renders full content with no leftover stub text, and that page titles update correctly (check the browser tab title on each).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add full content for how-it-works, faq, privacy, terms, and responsible-use pages"
```

---

## Task 20: SEO Basics (robots.txt, sitemap.xml, index.html meta)

**Files:**
- Create: `public/robots.txt`
- Create: `public/sitemap.xml`
- Modify: `index.html`

**Interfaces:**
- No cross-task interfaces — static files and a static HTML head.

- [ ] **Step 1: Write robots.txt**

Create `public/robots.txt`:
```
User-agent: *
Allow: /

Sitemap: /sitemap.xml
```

- [ ] **Step 2: Write sitemap.xml**

Create `public/sitemap.xml`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>/</loc></url>
  <url><loc>/studio</loc></url>
  <url><loc>/templates</loc></url>
  <url><loc>/how-it-works</loc></url>
  <url><loc>/faq</loc></url>
  <url><loc>/privacy</loc></url>
  <url><loc>/terms</loc></url>
  <url><loc>/responsible-use</loc></url>
</urlset>
```

Note: `<loc>` entries are left as root-relative paths since the production domain is unknown at this stage; whoever deploys this should prefix each with the real domain before going live — this is a placeholder acceptable for an MVP, not a bug to fix now.

- [ ] **Step 3: Update index.html head**

Read the current `index.html` (generated by Vite scaffolding) and update its `<head>` to include a default title/description/OG tags (overridden per-page by `PageShell` at runtime, but present for the initial HTML payload and for any crawler that doesn't execute JS):

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MarkForge — Online Stamp Maker</title>
    <meta
      name="description"
      content="Design a custom stamp online: choose a shape, add text and curved text, preview the ink effect, and export as PNG or SVG. No login required."
    />
    <meta property="og:title" content="MarkForge — Online Stamp Maker" />
    <meta
      property="og:description"
      content="Design a custom stamp online: choose a shape, add text and curved text, preview the ink effect, and export as PNG or SVG."
    />
    <meta property="og:type" content="website" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

(Keep whatever favicon reference Vite scaffolded — replacing `/vite.svg` with a real MarkForge favicon is out of scope for this MVP per YAGNI; a placeholder icon is fine.)

- [ ] **Step 4: Verify build still succeeds**

```bash
npm run build
```
Expected: succeeds, `dist/` contains `robots.txt` and `sitemap.xml` copied from `public/`.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add basic SEO — robots.txt, sitemap.xml, default meta tags"
```

---

## Task 21: Final Full-App Verification and Originality Review

**Files:** none created; this task only verifies and, if needed, makes small inline fixes to files from prior tasks.

- [ ] **Step 1: Full type-check and build**

```bash
cd /c/proj_stamp
npx tsc --noEmit
npm run build
```
Expected: both succeed with zero errors. If there are errors, fix them in the relevant existing files (do not introduce new abstractions to work around them — fix the actual type mismatch).

- [ ] **Step 2: Full golden-path walkthrough**

Run `npm run dev` and manually execute the exact journey called out in the spec:
Home → Open Stamp Studio → Choose stamp shape → Add/edit text → Add curved text → Customize design → Preview (toggle Ink mode) → Export PNG/SVG.

Also verify: Templates page → Use Template → lands in Studio with that template loaded; refreshing the Studio page mid-edit preserves the design; Undo/Redo via both buttons and keyboard shortcuts; deleting a selected layer via the Delete key and via the layer list trash icon; New/Save/Load/Reset buttons all behave as expected (with confirmation dialogs on destructive actions).

- [ ] **Step 3: Responsiveness check**

Using browser devtools responsive mode, check three widths (e.g. 375px, 768px, 1440px) for: Home page (no horizontal scroll, sections stack sensibly), Stamp Studio (mobile bottom toolbar + sheets work, desktop 3-column layout works, no dead zone in between), Templates page (grid reflows from 1 to 3 columns).

- [ ] **Step 4: No fake/non-functional controls check**

Grep for any leftover placeholder handlers:
```bash
grep -rn "TODO\|FIXME\|not implemented\|coming soon" src/ || true
```
Expected: no results. If any are found, either implement them or remove the control — the spec explicitly forbids fake buttons.

- [ ] **Step 5: Originality self-review**

Read back through `src/data/templates.ts`, `src/components/home/*`, and page copy in Task 19 and confirm: no real company/government names, no copied headline phrasing from the competitor URLs mentioned in the spec (they were never fetched or viewed during this plan's execution — all copy here was written from scratch per the design conversation), no real seals/insignia referenced. Confirm `src/config/brand.ts` is the single place the name "MarkForge" is defined as data (page copy strings that literally say "MarkForge" via `${BRAND.name}` interpolation are fine and expected; a hardcoded literal "MarkForge" string outside of `brand.ts`-driven interpolation in a new file would indicate a rename hazard — check for stray hardcoded occurrences):
```bash
grep -rn "MarkForge" src/ | grep -v "BRAND.name" | grep -v "config/brand.ts"
```
Any hits here (besides expected ones like the `brand.ts` file itself or comments) should be replaced with `BRAND.name` interpolation.

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "chore: final verification pass — build, golden path, responsiveness, originality review"
```

---

## Self-Review Notes (completed during plan authoring)

- **Spec coverage:** shapes ✓(Task 9/16), text controls ✓(Task 10), curved text ✓(Task 3/7/10), shapes ✓(Task 9/10), image upload+sanitize ✓(Task 5/9), canvas select/move/resize/rotate/delete/duplicate/layer/zoom/pan ✓(Task 7/8/10), undo/redo+shortcuts ✓(Task 4/11/14), ink preview ✓(Task 13), templates ✓(Task 16/17), export PNG/SVG ✓(Task 12), localStorage New/Save/Load/Reset ✓(Task 6/11/14), responsible use page ✓(Task 19), mobile layout ✓(Task 15), SEO ✓(Task 20), legal pages ✓(Task 19), home page sections ✓(Task 18). PDF intentionally excluded per decision. Fonts intentionally system-stack only per decision.
- **Placeholder scan:** no TBD/TODO left in any task step; Task 21 Step 4 double-checks this against the actual codebase at the end.
- **Type consistency:** `StampElement` union (Task 2) is used identically by store (Task 4), canvas (Task 7/8), properties (Task 10), templates (Task 16) — action names (`addElement`, `updateElement`, `removeElement`, `duplicateElement`, `reorderElement`, `setShape`, `setDimensions`, `setInk`, `select`, `undo`, `redo`, `loadProject`, `resetProject`) are consistent across every consuming task.
