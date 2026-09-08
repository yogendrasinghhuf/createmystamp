# MarkForge Redesign & Single-Page Consolidation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the shape-default bug (oval/circle not visually updating on selection), consolidate the marketing site into a single page with the Stamp Studio editor embedded inline, add one-click "Top text" / "Bottom text" / "Add icon" shortcuts to the editor toolbar, and give the whole visual design a more polished, appealing look — all within the existing system-fonts-only, client-only architecture.

**Architecture:** No new dependencies, no new pages beyond the existing legal routes (Privacy/Terms/Responsible Use stay as separate routes; everything else collapses into `/`). The single home page becomes: a compact hero, the live `StampCanvas`+`Toolbar`+`PropertiesPanel`+`ExportPanel` editor embedded directly (same components used by the old `/studio` route, now rendered inline instead of behind a route), then anchor-linked sections (Templates, How it Works, FAQ) on the same page. `/studio` and `/templates` routes are removed; their content merges into `/` (studio embedded, templates becomes an in-page section using the existing `TemplateGrid`). The Header's nav becomes in-page anchor links (`#editor`, `#templates`, `#how-it-works`, `#faq`) plus the three legal "quick links" in the footer (already existing). Visual redesign touches `tailwind.config.ts` theme tokens and the shared UI primitives / home section components / studio chrome, staying within system-font-stack constraints.

**Tech Stack:** Same as before — React, TypeScript, Vite, Tailwind CSS, Zustand, lucide-react, react-router-dom. No new dependencies.

**Spec:** This plan is self-contained; it amends the original MVP built per `docs/superpowers/plans/2026-09-08-markforge-stamp-mvp.md` in response to direct user feedback (see conversation). No separate spec doc.

## Global Constraints

- No backend, no database, no auth — still fully client-side.
- System font stacks only — no bundled/Google Fonts (explicitly reaffirmed by the user for this round).
- Icons: lucide-react only.
- Brand name centralized in `src/config/brand.ts` — no hardcoded "MarkForge" strings.
- Single Zustand store (`useStampStore`) remains the only state mechanism — no new state libraries.
- Legal pages (Privacy, Terms, Responsible Use) remain separate routes reachable via footer "quick links" — do not fold these into the single page.
- No fake/non-functional controls — every new button (Top text, Bottom text, Add icon) must actually work end-to-end.
- Preserve all existing editor functionality (drag/resize/rotate/zoom/pan, undo/redo coalescing, ink preview, export, mobile bottom-sheet layout) — this plan modifies layout/composition, not the underlying editor mechanics, except where a task explicitly changes store/toolbar behavior.
- Mobile responsiveness must be preserved/improved, not regressed, by the single-page consolidation.

---

## File Structure

```
src/
  App.tsx                          # MODIFY: remove /studio and /templates routes
  pages/
    HomePage.tsx                   # MODIFY: full rewrite — hero, embedded editor, templates section, info sections
    StampStudioPage.tsx            # DELETE (content merges into HomePage.tsx / a shared StampStudioSection)
    TemplatesPage.tsx              # DELETE (content merges into a shared TemplatesSection)
  components/
    layout/
      Header.tsx                   # MODIFY: nav becomes in-page anchors, no more /studio /templates links
    home/
      Hero.tsx                     # MODIFY: visual polish, more compact (editor now takes the spotlight below)
      StampStudioSection.tsx       # CREATE: wraps the embedded editor (desktop 3-col + mobile bottom-sheet), extracted from old StampStudioPage body
      TemplatesSection.tsx         # CREATE: in-page templates browser, extracted from old TemplatesPage body
      HowItWorksSection.tsx        # MODIFY: visual polish only
      FeaturesSection.tsx          # MODIFY: visual polish only
      ExportSection.tsx            # MODIFY: visual polish only
      UseCasesSection.tsx          # MODIFY: visual polish only
      FaqPreviewSection.tsx        # MODIFY: visual polish only, link becomes internal anchor to FaqSection below (or stays as-is if FAQ full page still exists — see Task 4 decision)
      FinalCtaSection.tsx          # MODIFY: CTA now scrolls to #editor instead of routing to /studio
    editor/
      Toolbar.tsx                  # MODIFY: add Top text / Bottom text / Add icon buttons
      IconPickerPopover.tsx        # CREATE: small popover for picking a lucide icon to insert
    ui/
      Button.tsx                   # MODIFY: visual polish (shadow/weight tweaks)
    templates/
      (TemplateGrid.tsx, TemplateCard.tsx unchanged — reused as-is inside TemplatesSection)
  store/
    useStampStore.ts               # MODIFY: setShape sets shape-appropriate default dimensions
  data/
    shapeDefaults.ts                # CREATE: per-shape default dimensions lookup, shared by store and StampSettingsPanel
  lib/
    icons.ts                        # CREATE: curated list of lucide-react icon components usable as stamp elements
  tailwind.config.ts                # MODIFY: refined color/spacing/shadow tokens (system fonts unchanged)
```

Pages removed: `src/pages/StampStudioPage.tsx`, `src/pages/TemplatesPage.tsx`. Pages kept as-is (no route change): `HowItWorksPage.tsx`, `FaqPage.tsx`, `PrivacyPage.tsx`, `TermsPage.tsx`, `ResponsibleUsePage.tsx`, `NotFoundPage.tsx` — see Task 4 for the decision on whether How It Works / FAQ keep standalone routes too or fold into anchors (resolved below: they fold into anchors on the home page section, and their standalone routes are removed since the user said "keep only one page, except quick links" — "quick links" refers specifically to the legal pages, which is the only category explicitly called out as an exception).

---

## Task 1: Fix Shape-Default Bug (Oval/Circle/Rectangle Default Dimensions)

**Files:**
- Create: `src/data/shapeDefaults.ts`
- Modify: `src/store/useStampStore.ts`
- Modify: `src/components/editor/StampSettingsPanel.tsx`

**Interfaces:**
- Produces: `SHAPE_DEFAULT_DIMENSIONS: Record<StampShapeKind, StampDimensions>` from `src/data/shapeDefaults.ts`, consumed by `useStampStore.ts`'s `setShape` action.
- Consumes: `StampShapeKind`, `StampDimensions` types from `src/types/stamp.ts` (unchanged).

- [ ] **Step 1: Create the shape-defaults lookup**

Create `src/data/shapeDefaults.ts`:
```ts
import type { StampShapeKind, StampDimensions } from '../types/stamp'

export const SHAPE_DEFAULT_DIMENSIONS: Record<StampShapeKind, StampDimensions> = {
  circle: { width: 40, height: 40 },
  badge: { width: 40, height: 40 },
  oval: { width: 50, height: 35 },
  rectangle: { width: 60, height: 35 },
  roundedRectangle: { width: 60, height: 35 },
}
```

- [ ] **Step 2: Update `setShape` to apply the matching default dimensions**

Modify `src/store/useStampStore.ts` — add the import:
```ts
import { SHAPE_DEFAULT_DIMENSIONS } from '../data/shapeDefaults'
```

Replace the `setShape` action:
```ts
  setShape: (shape) =>
    set((state) =>
      withUpdatedProject(state, (p) => ({
        ...p,
        shape,
        dimensions: SHAPE_DEFAULT_DIMENSIONS[shape],
      })),
    ),
```

This means selecting a new shape always resets dimensions to that shape's default — matches the user's explicit choice ("Yes, distinct default per shape"). Users can still fine-tune width/height afterward via the existing sliders in `StampSettingsPanel`.

- [ ] **Step 3: Have `StampSettingsPanel` use the same lookup for consistency (optional display only, not required for the fix)**

No code change strictly required here since the panel already reads `project.dimensions` reactively and will reflect the new values automatically once `setShape` updates the store. Just confirm by reading `src/components/editor/StampSettingsPanel.tsx` that its sliders derive `value={project.dimensions.width}` (they do, per current code) — no edit needed. Skip to verification.

- [ ] **Step 4: Verify build**

```bash
npx tsc --noEmit
npm run build
```
Expected: both succeed.

- [ ] **Step 5: Manual verification**

Run `npm run dev`. In Stamp Studio (embedded or standalone, whichever exists at this point in the plan's execution — Task 1 runs before the page consolidation, so `/studio` still exists), with nothing selected, change "Stamp shape" from Circle to Oval in the Stamp settings panel. Confirm the canvas outline immediately becomes visibly elliptical (wider than tall) without touching the width/height sliders. Switch to Rectangle, confirm it becomes a 60×35 rectangle immediately. Switch back to Circle, confirm it returns to a 40×40 circle immediately.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "fix: apply shape-appropriate default dimensions when switching stamp shape"
```

---

## Task 2: Icon Picker Data and Toolbar Shortcuts (Top Text / Bottom Text / Add Icon)

**Files:**
- Create: `src/lib/icons.ts`
- Create: `src/components/editor/IconPickerPopover.tsx`
- Modify: `src/components/editor/Toolbar.tsx`

**Interfaces:**
- Produces: `STAMP_ICONS: { name: string; Icon: LucideIcon }[]` from `src/lib/icons.ts` — a curated list of lucide-react icons suitable for stamps (star, check, heart, award, shield, flag, badge-check, sparkles, thumbs-up, gift — 10 total, generic/decorative, no brand-specific icons).
- Produces: `IconPickerPopover(props: { open: boolean; onClose: () => void; onSelect: (iconName: string) => void; anchorRef: RefObject<HTMLElement> })` — a small popover grid of icon buttons.
- Consumes: `useStampStore().addElement`, `uid()`, `ImageElement`-shaped data — icons are inserted as `ShapeElement`-incompatible custom SVG, so the cleanest representation is an `ImageElement` whose `src` is a data URL of the icon's SVG markup (rendered once via `renderToStaticMarkup`-free approach: construct the SVG string manually from the lucide icon's path data). See Step 2 for the exact mechanism chosen (data-URL of a minimal inline SVG using the icon's `path`/`d` attributes via lucide's raw SVG export), OR — simpler and preferred — represent the icon as a `ShapeElement` is NOT viable (icons are multi-path); instead use `ImageElement` with `isSvg: true` and a hand-built sanitized SVG string.

- [ ] **Step 1: Create the curated icon list using lucide-react's static SVG output**

lucide-react icons are React components, but we need raw SVG markup to embed as a stamp `ImageElement` (since `ImageElement.src` is a data URL, not a React node). lucide-react ships each icon's raw path data importable from `lucide-react/dist/esm/icons/*` is not a stable public API to rely on; instead, use `lucide-react`'s exported components with React's `renderToStaticMarkup` from `react-dom/server` (already a transitive dependency of `react-dom`, safe to import in a browser bundle for this synchronous string-building use case) to convert a chosen icon component into a real SVG string at insert-time, then sanitize it through the existing `sanitizeSvgString` (defense in depth, even though the source is our own trusted icon list) before embedding.

Create `src/lib/icons.ts`:
```ts
import {
  Star, Check, Heart, Award, Shield, Flag, BadgeCheck, Sparkles, ThumbsUp, Gift,
  type LucideIcon,
} from 'lucide-react'

export interface StampIconOption {
  name: string
  label: string
  Icon: LucideIcon
}

export const STAMP_ICONS: StampIconOption[] = [
  { name: 'star', label: 'Star', Icon: Star },
  { name: 'check', label: 'Check', Icon: Check },
  { name: 'heart', label: 'Heart', Icon: Heart },
  { name: 'award', label: 'Award', Icon: Award },
  { name: 'shield', label: 'Shield', Icon: Shield },
  { name: 'flag', label: 'Flag', Icon: Flag },
  { name: 'badge-check', label: 'Badge', Icon: BadgeCheck },
  { name: 'sparkles', label: 'Sparkles', Icon: Sparkles },
  { name: 'thumbs-up', label: 'Thumbs up', Icon: ThumbsUp },
  { name: 'gift', label: 'Gift', Icon: Gift },
]
```

- [ ] **Step 2: Write a helper to convert a lucide icon component to a sanitized SVG data URL**

Add to `src/lib/icons.ts` (same file):
```ts
import { renderToStaticMarkup } from 'react-dom/server'
import { createElement } from 'react'
import { sanitizeSvgString } from './sanitizeSvg'

export function iconToSvgDataUrl(Icon: LucideIcon, color: string): string | null {
  const markup = renderToStaticMarkup(
    createElement(Icon, { color, strokeWidth: 1.75, width: 24, height: 24 }),
  )
  const cleaned = sanitizeSvgString(markup)
  if (!cleaned) return null
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(cleaned)))}`
}
```

This reuses the existing, already-reviewed `sanitizeSvgString` from Task 5 of the original plan — belt-and-suspenders even though the source is our own icon list, and keeps a single sanitization code path for all SVG-sourced image elements in the app.

- [ ] **Step 3: Build the icon picker popover**

Create `src/components/editor/IconPickerPopover.tsx`:
```tsx
import { STAMP_ICONS } from '../../lib/icons'

interface IconPickerPopoverProps {
  open: boolean
  onClose: () => void
  onSelect: (iconName: string) => void
}

export default function IconPickerPopover({ open, onClose, onSelect }: IconPickerPopoverProps) {
  if (!open) return null

  return (
    <div className="absolute left-full top-0 z-20 ml-2 grid w-48 grid-cols-4 gap-2 rounded-xl2 border border-line bg-paper p-3 shadow-lg">
      {STAMP_ICONS.map(({ name, label, Icon }) => (
        <button
          key={name}
          type="button"
          aria-label={label}
          title={label}
          onClick={() => {
            onSelect(name)
            onClose()
          }}
          className="flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-line text-ink transition-colors hover:border-accent hover:text-accent"
        >
          <Icon size={18} />
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 4: Add Top text / Bottom text / Add icon buttons to Toolbar**

Modify `src/components/editor/Toolbar.tsx` — add imports:
```ts
import { useState } from 'react'
import { ArrowUpToLine, ArrowDownToLine, Sparkle } from 'lucide-react'
import { STAMP_ICONS, iconToSvgDataUrl } from '../../lib/icons'
import IconPickerPopover from './IconPickerPopover'
```

Add two new handler functions inside `Toolbar`, alongside the existing `handleAddCurvedText`:
```ts
  function handleAddTopText() {
    const radius = Math.min(project.dimensions.width, project.dimensions.height) / 2 - 6
    addAndSelect({
      id: uid(),
      type: 'curvedText',
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1,
      zIndex: nextZIndex(),
      text: 'TOP TEXT',
      fontFamily: 'Arial, Helvetica, sans-serif',
      fontSize: 5,
      fontWeight: 600,
      letterSpacing: 1,
      color: '#2B2A28',
      radius,
      startAngle: 210,
      direction: 'clockwise',
    })
  }

  function handleAddBottomText() {
    const radius = Math.min(project.dimensions.width, project.dimensions.height) / 2 - 6
    addAndSelect({
      id: uid(),
      type: 'curvedText',
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1,
      zIndex: nextZIndex(),
      text: 'BOTTOM TEXT',
      fontFamily: 'Arial, Helvetica, sans-serif',
      fontSize: 5,
      fontWeight: 600,
      letterSpacing: 1,
      color: '#2B2A28',
      radius,
      startAngle: 30,
      direction: 'counterclockwise',
    })
  }
```

Rationale for the exact angles: `buildCurvedTextArcPath` (from `src/lib/curvedText.ts`, unchanged) sweeps 300° starting at `startAngleDeg`, measuring 0° as the top (12 o'clock) and increasing clockwise. A `startAngle: 210` with `direction: 'clockwise'` places the arc's start point in the lower-left and sweeps up through the top — this positions text along the TOP of the circle reading left-to-right. A `startAngle: 30` with `direction: 'counterclockwise'` places the arc's start in the lower-right sweeping down through the bottom — positioning text along the BOTTOM reading left-to-right (not upside down). These exact values were chosen to match the existing arc-generation geometry in `curvedText.ts` (do not change that file); verify visually in Step 6 that top text reads upright along the top arc and bottom text reads upright (not mirrored) along the bottom arc, and adjust `startAngle`/`direction` empirically if the initial values don't produce the expected visual result — the geometry math is easy to get an off-by-90-or-180-degree error on, so treat these as a starting point to verify, not a guarantee.

Add the icon picker state and handler:
```ts
  const [iconPickerOpen, setIconPickerOpen] = useState(false)

  function handleSelectIcon(iconName: string) {
    const option = STAMP_ICONS.find((i) => i.name === iconName)
    if (!option) return
    const dataUrl = iconToSvgDataUrl(option.Icon, '#2B2A28')
    if (!dataUrl) return
    addAndSelect({
      id: uid(),
      type: 'image',
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1,
      zIndex: nextZIndex(),
      src: dataUrl,
      width: 12,
      height: 12,
      isSvg: true,
    })
  }
```

Update the returned JSX — add the new buttons after "Add curved text" and wrap the "Add icon" button in a `relative` container for the popover:
```tsx
  return (
    <div className="flex flex-col gap-2 p-3">
      <IconButton icon={<Type size={18} />} label="Add text" onClick={handleAddText} />
      <IconButton icon={<TextCursorInput size={18} />} label="Add curved text" onClick={handleAddCurvedText} />
      <IconButton icon={<ArrowUpToLine size={18} />} label="Add top text" onClick={handleAddTopText} />
      <IconButton icon={<ArrowDownToLine size={18} />} label="Add bottom text" onClick={handleAddBottomText} />
      <div className="relative">
        <IconButton icon={<Sparkle size={18} />} label="Add icon" onClick={() => setIconPickerOpen((v) => !v)} />
        <IconPickerPopover
          open={iconPickerOpen}
          onClose={() => setIconPickerOpen(false)}
          onSelect={handleSelectIcon}
        />
      </div>
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
```

- [ ] **Step 5: Verify build**

```bash
npx tsc --noEmit
npm run build
```
Expected: both succeed. If `react-dom/server`'s `renderToStaticMarkup` causes any SSR-related bundling warning in a client-only Vite app, confirm the build still completes — this function is synchronous and side-effect-free, safe to call in the browser; it does not require an actual server.

- [ ] **Step 6: Manual verification**

Run `npm run dev`, open Stamp Studio, click "Add top text" — confirm a curved text element appears along the TOP of the stamp outline, reading upright/left-to-right (not upside down). Click "Add bottom text" — confirm it appears along the BOTTOM, also reading upright. If either reads upside-down or appears on the wrong side, adjust the `startAngle`/`direction` values in Step 4 empirically (try swapping direction or adjusting startAngle by 180) until both read correctly, then re-verify. Click "Add icon", confirm the popover opens showing 10 icon buttons, click one (e.g. Star), confirm a star-shaped image element is inserted onto the canvas and auto-selected. Confirm clicking outside the popover or selecting an icon closes it.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add top text, bottom text, and icon picker shortcuts to editor toolbar"
```

---

## Task 3: Visual Design Refresh (Theme Tokens + Shared UI Primitives)

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `src/components/ui/Button.tsx`
- Modify: `src/index.css`

**Interfaces:**
- No new exports — this task only changes visual styling of existing components/tokens. All consumers of `Button`, Tailwind color/spacing tokens continue to work unchanged since class names (`bg-paper`, `text-ink`, `bg-accent`, etc.) are preserved; only their underlying values/treatment improve.

- [ ] **Step 1: Refine the color palette and add shadow/gradient tokens**

Modify `tailwind.config.ts`:
```ts
import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#FBF8F3',
        ink: '#221F1C',
        accent: {
          DEFAULT: '#C1571C',
          light: '#E2884C',
          dark: '#8F3F13',
        },
        line: '#E7E0D4',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Segoe UI', 'Arial', 'sans-serif'],
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        mono: ['Consolas', 'Menlo', 'monospace'],
      },
      borderRadius: {
        xl2: '1.25rem',
        xl3: '1.75rem',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(34, 31, 28, 0.04), 0 8px 24px -8px rgba(34, 31, 28, 0.10)',
        card: '0 1px 2px rgba(34, 31, 28, 0.05), 0 4px 16px -6px rgba(34, 31, 28, 0.08)',
      },
      backgroundImage: {
        'paper-fade': 'radial-gradient(circle at 20% 0%, rgba(193,87,28,0.06), transparent 45%)',
      },
    },
  },
  plugins: [],
} satisfies Config
```

The `paper-fade` background image is a subtle, purely-CSS radial gradient (no image asset, no font, no external request) — used later in Task 4's hero to break up the previously "flat" background the user flagged, while staying within the system-fonts/no-new-assets constraint.

- [ ] **Step 2: Elevate Button with a soft shadow and slightly bolder weight**

Modify `src/components/ui/Button.tsx`:
```tsx
import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-ink text-paper shadow-soft hover:bg-accent',
  secondary: 'bg-paper border border-line text-ink shadow-card hover:border-accent hover:text-accent',
  ghost: 'bg-transparent text-ink hover:bg-line/50',
}

export default function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`rounded-full px-5 py-2.5 text-sm font-semibold tracking-tight transition-all duration-150 disabled:opacity-40 ${variantClasses[variant]} ${className}`}
      {...props}
    />
  )
}
```

- [ ] **Step 3: Add a touch of global rhythm via base styles**

Modify `src/index.css` — check current content first, then ensure the body rule includes the new gradient-friendly background and slightly refined heading tracking. Read the current file, then update the `body` rule to:
```css
body {
  @apply bg-paper text-ink antialiased;
}

h1, h2, h3 {
  @apply tracking-tight;
}
```
(Keep the existing `@tailwind` directives and `html, body, #root { height: 100%; }` rule unchanged — only add/adjust the body/heading rules shown above; do not remove anything already present without checking it's safe to.)

- [ ] **Step 4: Verify build**

```bash
npx tsc --noEmit
npm run build
```
Expected: both succeed.

- [ ] **Step 5: Manual verification**

Run `npm run dev`, visually confirm buttons now have a subtle shadow and slightly bolder weight, confirm no visual regression (buttons still readable, still same rough size/shape, just refined). This is a foundational task other tasks build on visually — Task 4 does the bulk of the page-level visual work.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "style: refine color palette, shadows, and button treatment for visual polish"
```

---

## Task 4: Extract StampStudioSection and TemplatesSection Components

**Files:**
- Create: `src/components/home/StampStudioSection.tsx`
- Create: `src/components/home/TemplatesSection.tsx`
- Read (for reference, not modified in this task): current `src/pages/StampStudioPage.tsx`, current `src/pages/TemplatesPage.tsx`

**Interfaces:**
- Produces: `StampStudioSection()` — no props, renders the full editor (desktop 3-column + mobile bottom-sheet layout), reusing `EditorTopBar`, `Toolbar`, `StampCanvas`, `PropertiesPanel`, `ExportPanel`, `MobileToolbar`, `MobileBottomSheet`, `useEditorKeyboardShortcuts` exactly as `StampStudioPage.tsx` currently does — but without the `PageShell`/route-level wrapper (since it's now embedded in `HomePage.tsx`, which has its own single `PageShell`) and without the `skipAutoRestore` location-state logic (no longer needed once there's no separate `/templates` → `/studio` navigation — see Step 3 for how template-loading now works within the single page).
- Produces: `TemplatesSection()` — no props, renders the category filter + `TemplateGrid`, reusing the existing `TemplateCard`/`TemplateGrid` components from `src/components/templates/`. "Use Template" now scrolls the page to the embedded editor section (`#editor`) and loads the template into the store, instead of navigating to a separate route.

- [ ] **Step 1: Create StampStudioSection by adapting the current StampStudioPage body**

Read the current `src/pages/StampStudioPage.tsx` in full first (it may have evolved since the version shown in this plan's File Structure notes — always work from the actual current file).

Create `src/components/home/StampStudioSection.tsx` with the same internal logic as the current `StampStudioPage.tsx`, but:
- Remove the `PageShell` wrapper and its `title`/`description` props (home page sets these once, at the top level).
- Remove the `useLocation`/`skipAutoRestore` logic entirely (this task's Task 4 Step 3 replaces cross-page navigation with in-page scroll + direct store calls, so the autosave-clobber problem this logic solved no longer applies the same way — re-examine: the mount-time `loadFromStorage()` call still needs to run once when the section first mounts on page load, to restore an in-progress design after a refresh. Keep that part. Just remove the `skipAutoRestore` check since there's no more "navigated here from Templates" scenario to distinguish — Task 4 Step 3's `handleUse` calls `loadProject` directly while the section is already mounted, so no remount/reload race exists to guard against).
- Give the outer wrapping `<div>` an `id="editor"` so the header/hero/final-CTA can link to it via `#editor`.
- Keep everything else (EditorTopBar, desktop grid, mobile bottom-sheet layout, keyboard shortcuts, autosave debounce, delete-key handler) exactly as-is.

```tsx
import { useEffect, useState } from 'react'
import EditorTopBar from '../editor/EditorTopBar'
import Toolbar from '../editor/Toolbar'
import StampCanvas from '../editor/StampCanvas'
import PropertiesPanel from '../editor/PropertiesPanel'
import ExportPanel from '../editor/ExportPanel'
import MobileToolbar from '../editor/MobileToolbar'
import MobileBottomSheet from '../editor/MobileBottomSheet'
import { useEditorKeyboardShortcuts } from '../../lib/useEditorKeyboardShortcuts'
import { useProject, useSelectedIds, useStampStore } from '../../store/useStampStore'
import { saveProject, loadProject as loadFromStorage } from '../../lib/persistence'

export default function StampStudioSection() {
  const project = useProject()
  const selectedIds = useSelectedIds()
  const removeElement = useStampStore((s) => s.removeElement)
  const loadProject = useStampStore((s) => s.loadProject)
  const [mobileSheet, setMobileSheet] = useState<'none' | 'add' | 'properties' | 'export'>('none')

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
    <section id="editor" className="scroll-mt-20 border-t border-line bg-paper py-16">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-2xl font-semibold">Stamp Studio</h2>
        <p className="mt-2 text-ink/60">Design your stamp right here — no separate page, no account needed.</p>
      </div>
      <div className="mx-auto mt-8 flex h-[720px] max-w-6xl min-h-0 flex-col overflow-hidden rounded-xl3 border border-line shadow-card md:h-[640px]">
        <EditorTopBar />
        <div className="flex min-h-0 flex-1 flex-col md:grid md:grid-cols-[72px_1fr_320px]">
          <aside className="hidden min-h-0 overflow-y-auto border-r border-line md:block">
            <Toolbar />
          </aside>
          <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-line/20 p-4 md:p-8">
            <div className="aspect-square w-full max-w-sm md:max-w-xl">
              <StampCanvas />
            </div>
          </div>
          <aside className="hidden min-h-0 overflow-y-auto border-l border-line md:block">
            <PropertiesPanel />
            <div className="border-t border-line p-4">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink/50">Export</h3>
              <ExportPanel />
            </div>
          </aside>
        </div>
        <MobileToolbar
          onOpenAdd={() => setMobileSheet('add')}
          onOpenProperties={() => setMobileSheet('properties')}
          onOpenExport={() => setMobileSheet('export')}
        />
        <MobileBottomSheet title="Add element" open={mobileSheet === 'add'} onClose={() => setMobileSheet('none')}>
          <Toolbar />
        </MobileBottomSheet>
        <MobileBottomSheet title="Properties" open={mobileSheet === 'properties'} onClose={() => setMobileSheet('none')}>
          <PropertiesPanel />
        </MobileBottomSheet>
        <MobileBottomSheet title="Export" open={mobileSheet === 'export'} onClose={() => setMobileSheet('none')}>
          <ExportPanel />
        </MobileBottomSheet>
      </div>
    </section>
  )
}
```

Note: the fixed `h-[720px]`/`md:h-[640px]` on the editor's outer rounded container replaces the old full-viewport-height (`h-[calc(100vh-65px)]`) sizing from the standalone `/studio` route — since the editor is now one section among several on a scrolling page, it needs a bounded height rather than filling the viewport. Verify in Step 4 that this height comfortably fits the 3-column desktop layout and the mobile canvas+toolbar without visual cramping; adjust the pixel values if needed during manual verification.

- [ ] **Step 2: Create TemplatesSection by adapting the current TemplatesPage body**

Read the current `src/pages/TemplatesPage.tsx` in full first.

Create `src/components/home/TemplatesSection.tsx`:
```tsx
import { useState } from 'react'
import TemplateGrid from '../templates/TemplateGrid'
import { TEMPLATES, type StampTemplate } from '../../data/templates'
import { TEMPLATE_CATEGORIES } from '../../data/templateCategories'
import { useStampStore } from '../../store/useStampStore'
import { uid } from '../../lib/id'
import Button from '../ui/Button'

export default function TemplatesSection() {
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const loadProject = useStampStore((s) => s.loadProject)

  const filtered =
    activeCategory === 'All' ? TEMPLATES : TEMPLATES.filter((t) => t.category === activeCategory)

  function handleUse(template: StampTemplate) {
    loadProject({ ...template.project, id: uid(), updatedAt: Date.now() })
    document.getElementById('editor')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section id="templates" className="scroll-mt-20 border-t border-line bg-paper py-16">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-2xl font-semibold">Templates</h2>
        <p className="mt-2 text-ink/60">
          Start from an original layout and make it your own in the studio above.
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
    </section>
  )
}
```

Note the key behavior change from the old routed version: `handleUse` no longer calls `navigate('/studio')` (react-router navigation) — it calls `loadProject` directly (the `StampStudioSection` is already mounted on the same page) and then smooth-scrolls to `#editor`. This eliminates the entire class of "autosave clobbers the just-loaded template" bug that existed in the old routed version, since there's no remount of the studio section involved — it was already mounted and its store subscription picks up the new project immediately.

- [ ] **Step 3: Verify build**

```bash
npx tsc --noEmit
npm run build
```
Expected: both succeed. Note: at this point in the plan, `HomePage.tsx` doesn't render these new sections yet (that's Task 5) and the old `/studio`/`/templates` routes still exist — this task only creates the new section components, it does not yet wire them in or remove old files. Confirm the new files compile standalone without being imported anywhere yet (TypeScript will not error on an unused-but-valid file).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: extract StampStudioSection and TemplatesSection for single-page embedding"
```

---

## Task 5: Consolidate Routing — Single Home Page, Remove /studio and /templates

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/pages/HomePage.tsx`
- Modify: `src/components/layout/Header.tsx`
- Modify: `src/components/home/Hero.tsx`
- Modify: `src/components/home/FinalCtaSection.tsx`
- Modify: `src/components/home/TemplatesPreviewSection.tsx`
- Modify: `src/components/home/FaqPreviewSection.tsx`
- Modify: `src/pages/HowItWorksPage.tsx` and `src/pages/FaqPage.tsx` (content folds into the home page sections that already exist for them — see Step 5)
- Delete: `src/pages/StampStudioPage.tsx`
- Delete: `src/pages/TemplatesPage.tsx`

**Interfaces:**
- Consumes: `StampStudioSection`, `TemplatesSection` from Task 4.
- Produces: `HomePage.tsx` becomes the single page assembling Hero → StampStudioSection → TemplatesSection → HowItWorksSection → FeaturesSection → ExportSection → UseCasesSection → FaqPreviewSection (expanded to include full FAQ content, not just a preview — see Step 5) → FinalCtaSection, each with an `id` for anchor navigation. `App.tsx`'s route table shrinks to `/`, `/privacy`, `/terms`, `/responsible-use`, `*`.

- [ ] **Step 1: Update App.tsx routes**

Modify `src/App.tsx`:
```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'
import ResponsibleUsePage from './pages/ResponsibleUsePage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/responsible-use" element={<ResponsibleUsePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
```

- [ ] **Step 2: Update Header nav to in-page anchors**

Modify `src/components/layout/Header.tsx`:
```tsx
import { Link } from 'react-router-dom'
import { BRAND } from '../../config/brand'

const navLinks = [
  { to: '#editor', label: 'Stamp Studio' },
  { to: '#templates', label: 'Templates' },
  { to: '#how-it-works', label: 'How It Works' },
  { to: '#faq', label: 'FAQ' },
]

export default function Header() {
  return (
    <header className="border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-lg font-semibold tracking-tight text-ink">
          {BRAND.name}
        </Link>
        <nav className="hidden gap-6 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.to}
              href={link.to}
              className="text-sm font-medium text-ink/70 transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <a
          href="#editor"
          className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper shadow-soft transition-colors hover:bg-accent"
        >
          Open Stamp Studio
        </a>
      </div>
    </header>
  )
}
```

Note: plain `<a href="#...">` anchors are used instead of `NavLink`/`Link` with `to="#..."`, because these are same-page scroll anchors, not route changes — react-router's `Link` would still work for same-page hash anchors when already on `/`, but plain anchor tags are simpler and avoid ambiguity, and there are no other routes to navigate away from/back to for these particular links anymore. The logo `Link to="/"` stays a router link since `/privacy`, `/terms`, `/responsible-use` are still separate routes a user could be on when clicking the logo.

- [ ] **Step 3: Update Hero — remove /studio, /templates route links, point at anchors**

Modify `src/components/home/Hero.tsx` — replace the two `<Link>` buttons:
```tsx
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#editor">
            <Button>Open Stamp Studio</Button>
          </a>
          <a href="#templates">
            <Button variant="secondary">Browse Templates</Button>
          </a>
        </div>
```
Remove the now-unused `import { Link } from 'react-router-dom'` if `Link` is no longer used elsewhere in this file (check the full file — it should only have been used for these two buttons).

- [ ] **Step 4: Update FinalCtaSection to scroll to #editor instead of routing**

Modify `src/components/home/FinalCtaSection.tsx` — replace its `<Link to="/studio">` with `<a href="#editor">`, same pattern as Step 3. Remove the unused `Link` import if no longer needed in that file.

- [ ] **Step 5: Fold How It Works and FAQ into full home-page sections (not just previews), and delete their standalone pages' route usage**

The user's instruction was "keep only one page, except quick links" (quick links = the 3 legal pages). This means `HowItWorksPage.tsx` and `FaqPage.tsx` should no longer be separate routes — their content becomes the definitive home-page sections (replacing the shorter "preview" versions that used to link out to the full pages).

Read the current `src/pages/HowItWorksPage.tsx` and `src/pages/FaqPage.tsx` in full — they contain the fuller content (5 numbered steps for How It Works; 7 Q&A pairs for FAQ) versus the shorter home-page preview sections (`HowItWorksSection.tsx` has 3 steps; `FaqPreviewSection.tsx` has 3 Q&As with a "see all" link).

Modify `src/components/home/HowItWorksSection.tsx` to use the FULLER 5-step content from `HowItWorksPage.tsx`'s `steps` array instead of its own shorter 3-step array, and add `id="how-it-works"` plus `scroll-mt-20` to its `<section>`:
```tsx
const steps = [
  {
    title: '1. Choose a stamp shape',
    body: 'Start in the studio and pick a circle, oval, rectangle, rounded rectangle, or badge shape, then set its size.',
  },
  {
    title: '2. Add text and curved text',
    body: 'Add straight text or bend text along an arc, then adjust font, size, weight, spacing, and color from the properties panel.',
  },
  {
    title: '3. Layer in shapes and images',
    body: 'Add simple shapes, icons, or upload your own PNG, JPG, or SVG artwork, then arrange, resize, and rotate every element.',
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
```
Keep the rest of `HowItWorksSection.tsx`'s existing rendering structure (its own `<section>` wrapper, heading, grid), just swap in this 5-item array and change its grid from `md:grid-cols-3` to `md:grid-cols-2 lg:grid-cols-3` or similar to comfortably fit 5 items (use your judgment on a clean 5-item responsive grid, e.g. 1 column mobile / 2 columns tablet / 3 columns desktop with the 5th item wrapping naturally). Add `id="how-it-works"` and `scroll-mt-20` class to the `<section>` tag.

Rename `FaqPreviewSection.tsx` usage in `HomePage.tsx` to render the FULL FAQ list — modify `src/components/home/FaqPreviewSection.tsx` to use the fuller 7-item `faqs` array from `FaqPage.tsx` instead of its own 3-item array, remove the "See all questions" link (there's no separate FAQ page to link to anymore), and add `id="faq"` plus `scroll-mt-20` to its `<section>`.

Delete `src/pages/HowItWorksPage.tsx` and `src/pages/FaqPage.tsx` — their content has been merged into the home page sections above, and they're no longer referenced by any route (removed in Step 1).

- [ ] **Step 6: Update TemplatesPreviewSection or fold it away**

Since the home page will now have a full `TemplatesSection` (from Task 4) further down the page, the old `TemplatesPreviewSection.tsx` (which showed 3 templates with a "View all templates" link to `/templates`) becomes redundant. Delete `src/components/home/TemplatesPreviewSection.tsx` and remove its import/usage from `HomePage.tsx` (Step 7 assembles the final `HomePage.tsx` without it).

- [ ] **Step 7: Assemble the final HomePage.tsx**

Replace `src/pages/HomePage.tsx`:
```tsx
import PageShell from '../components/layout/PageShell'
import { BRAND } from '../config/brand'
import Hero from '../components/home/Hero'
import StampStudioSection from '../components/home/StampStudioSection'
import TemplatesSection from '../components/home/TemplatesSection'
import HowItWorksSection from '../components/home/HowItWorksSection'
import FeaturesSection from '../components/home/FeaturesSection'
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
      <StampStudioSection />
      <TemplatesSection />
      <HowItWorksSection />
      <FeaturesSection />
      <ExportSection />
      <UseCasesSection />
      <FaqPreviewSection />
      <FinalCtaSection />
    </PageShell>
  )
}
```

- [ ] **Step 8: Delete the now-unused standalone page files**

```bash
rm src/pages/StampStudioPage.tsx
rm src/pages/TemplatesPage.tsx
rm src/pages/HowItWorksPage.tsx
rm src/pages/FaqPage.tsx
rm src/components/home/TemplatesPreviewSection.tsx
```

- [ ] **Step 9: Update sitemap.xml to remove deleted routes**

Modify `public/sitemap.xml` — remove the `<url><loc>/studio</loc></url>`, `<url><loc>/templates</loc></url>`, `<url><loc>/how-it-works</loc></url>`, `<url><loc>/faq</loc></url>` entries, leaving only `/`, `/privacy`, `/terms`, `/responsible-use`.

- [ ] **Step 10: Update Footer if it references any now-deleted routes**

Read `src/components/layout/Footer.tsx`. It should only link to `/privacy`, `/terms`, `/responsible-use` per the original build (the "quick links" the user explicitly wants kept) — confirm this and leave unchanged if so. If it references `/studio`, `/templates`, `/how-it-works`, or `/faq` anywhere, update those to the corresponding `#anchor` on `/`.

- [ ] **Step 11: Verify build**

```bash
npx tsc --noEmit
npm run build
```
Expected: both succeed with zero errors, including zero "module not found" errors from any lingering import of the deleted page files. Grep to confirm no stale imports remain:
```bash
grep -rn "StampStudioPage\|TemplatesPage\|HowItWorksPage\|FaqPage\|TemplatesPreviewSection" src/
```
Expected: no matches (aside from this plan file itself, which isn't part of `src/`).

- [ ] **Step 12: Full manual verification of the consolidated single page**

Run `npm run dev`, load `/`. Confirm: Hero renders with working "Open Stamp Studio" (scrolls to embedded editor) and "Browse Templates" (scrolls to templates section) buttons; the embedded Stamp Studio editor is fully functional in place (add text, add shape, drag, undo/redo, export — the whole golden path from within the embedded section); the Templates section renders all 15 templates, filtering works, and clicking "Use Template" loads the template into the ALREADY-VISIBLE embedded editor above and smooth-scrolls up to it (confirm the canvas content actually changes to the template, without a page navigation/reload); How It Works section shows all 5 steps; FAQ section shows all 7 questions; header nav links smooth-scroll to the right sections; footer links to `/privacy`, `/terms`, `/responsible-use` still work as separate pages. Confirm refreshing the page preserves the in-progress design (autosave/restore still works for the embedded editor). Confirm no console errors.

- [ ] **Step 13: Commit**

```bash
git add -A
git commit -m "refactor: consolidate site into a single page with embedded editor and templates"
```

---

## Task 6: Hero and Section-Level Visual Polish Pass

**Files:**
- Modify: `src/components/home/Hero.tsx`
- Modify: `src/components/home/FeaturesSection.tsx`
- Modify: `src/components/home/ExportSection.tsx`
- Modify: `src/components/home/UseCasesSection.tsx`
- Modify: `src/components/home/FaqPreviewSection.tsx`
- Modify: `src/components/home/FinalCtaSection.tsx`
- Modify: `src/components/layout/Footer.tsx`

**Interfaces:**
- No new exports — purely visual/layout refinement of existing section components, using the theme tokens established in Task 3 (`shadow-soft`, `shadow-card`, `bg-paper-fade`, refined color tokens).

- [ ] **Step 1: Polish the Hero with the new background treatment and tighter composition**

Modify `src/components/home/Hero.tsx` — wrap the section in the new subtle gradient background and add a small eyebrow label above the headline for visual hierarchy:
```tsx
import { BRAND } from '../../config/brand'
import Button from '../ui/Button'

export default function Hero() {
  return (
    <section className="bg-paper-fade">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-2 md:items-center">
        <div>
          <span className="inline-block rounded-full border border-line bg-paper px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent shadow-card">
            Free · No login required
          </span>
          <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            {BRAND.tagline}
          </h1>
          <p className="mt-4 max-w-md text-lg text-ink/70">{BRAND.supportingCopy}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#editor">
              <Button>Open Stamp Studio</Button>
            </a>
            <a href="#templates">
              <Button variant="secondary">Browse Templates</Button>
            </a>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="flex h-64 w-64 items-center justify-center rounded-full border-2 border-ink/80 bg-paper shadow-soft">
            <svg viewBox="-50 -50 100 100" width="80%" height="80%">
              <circle r={44} fill="none" stroke="#221F1C" strokeWidth={1.2} />
              <path id="hero-arc" d="M -30 -20 A 34 34 0 1 1 30 -20" fill="none" />
              <text fontSize={5.5} fontWeight={700} letterSpacing={1.5} fill="#221F1C">
                <textPath href="#hero-arc" startOffset="8%">
                  NORTH &amp; PINE
                </textPath>
              </text>
              <text textAnchor="middle" y={4} fontSize={7} fontWeight={600} fill="#221F1C">
                N&amp;P
              </text>
              <text textAnchor="middle" y={16} fontSize={3.6} letterSpacing={2} fill="#221F1C">
                EST. 2026
              </text>
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}
```
(This supersedes Task 5 Step 3's edit to the same file — apply Task 5's anchor-link change AND this task's visual polish together; if executed as separate tasks in sequence, this step's version is the final one, already incorporating the `#editor`/`#templates` anchor links from Task 5.)

- [ ] **Step 2: Give section headings consistent eyebrow+heading treatment and cards more depth**

Modify `src/components/home/FeaturesSection.tsx` — update the card styling from plain `border border-line` to include the new shadow:
```tsx
            <div key={feature.title} className="rounded-xl2 border border-line bg-paper p-6 shadow-card transition-shadow hover:shadow-soft">
```
Apply the same `shadow-card hover:shadow-soft transition-shadow` treatment to the card `<div>` elements in `ExportSection.tsx` (its format cards) and `UseCasesSection.tsx` (its use-case `<li>` items — add `rounded-xl2 shadow-card` if not already rounded, adjusting from the plain bordered list-item look to match the more elevated look of the other cards). Read each file's current card markup before editing to ensure you're modifying the actual current class list, not guessing.

- [ ] **Step 3: Polish FaqPreviewSection's Q&A cards**

Modify `src/components/home/FaqPreviewSection.tsx` — apply `shadow-card` to the Q&A item containers (`rounded-xl2 border border-line p-5` → `rounded-xl2 border border-line bg-paper p-5 shadow-card`), consistent with the other card treatments.

- [ ] **Step 4: Polish FinalCtaSection's contrast**

Modify `src/components/home/FinalCtaSection.tsx` — confirm/adjust its dark (`bg-ink`) section still reads well against the refined `ink`/`paper` values from Task 3; if the secondary button override (`bg-paper text-ink hover:bg-accent hover:text-paper`) needs adjustment for contrast with the new palette, adjust it. Read the current file first.

- [ ] **Step 5: Add a subtle top border/shadow separation to the Footer**

Modify `src/components/layout/Footer.tsx` — no functional change, just confirm it still looks good against the refined palette; add `shadow-[0_-1px_0_0_theme(colors.line)]`-equivalent if the existing `border-t border-line` doesn't feel sufficient once other sections have shadows (use judgment — this is a minor polish step, don't over-engineer it).

- [ ] **Step 6: Verify build**

```bash
npx tsc --noEmit
npm run build
```
Expected: both succeed.

- [ ] **Step 7: Full visual manual verification**

Run `npm run dev`, load `/`, scroll through the entire page at desktop width (1440px) and mobile width (375px). Confirm: hero has the new eyebrow badge and subtle background gradient (not a flat, plain background); cards throughout the page (features, export options, FAQ) have a visible soft shadow that lifts them slightly off the background; buttons have a subtle shadow and read as more substantial/polished; overall the page should read as noticeably more crafted than a bare/generic template, using only color/spacing/shadow/hierarchy changes (no new fonts, no new images). Confirm no horizontal scroll at either width and no visual regression in the embedded editor section (Task 4/5's work).

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "style: polish hero, cards, and section visual hierarchy across the single page"
```

---

## Task 7: Final Verification Pass

**Files:** none created; this task only verifies and, if needed, makes small inline fixes to files from prior tasks in this plan.

- [ ] **Step 1: Full type-check and build**

```bash
npx tsc --noEmit
npm run build
```
Expected: zero errors.

- [ ] **Step 2: Full golden-path walkthrough on the consolidated single page**

Using browser automation if available: load `/`, use header nav / hero buttons to confirm anchor-scrolling works to Stamp Studio and Templates sections; in the embedded editor, change stamp shape (confirm the Task 1 fix — oval/rectangle immediately look correct); add top text, bottom text, and an icon via the new Task 2 shortcuts and confirm each renders correctly positioned and upright; drag an element and undo (confirm the whole drag reverts in one step, preserving the original plan's fix); export PNG and SVG; browse templates, use one, confirm it loads into the visible embedded editor immediately with a smooth scroll, no page reload, no autosave-clobber; refresh the page mid-edit and confirm the design persists; visit `/privacy`, `/terms`, `/responsible-use` and confirm those still work as separate pages reachable from the footer.

- [ ] **Step 3: Responsiveness check**

At 375px, 768px, 1440px: confirm no horizontal scroll anywhere on the single page, confirm the embedded editor's mobile bottom-sheet layout still works correctly within the single-page context (not just as a standalone route), confirm the templates grid and info sections reflow sensibly.

- [ ] **Step 4: No fake/non-functional controls check**

```bash
grep -rn "TODO\|FIXME\|not implemented\|coming soon" src/
```
Expected: no matches. Confirm the new Top text / Bottom text / Add icon buttons are fully functional (not decorative).

- [ ] **Step 5: Commit (if any fixes were needed)**

```bash
git add -A
git commit -m "chore: final verification pass for redesign and single-page consolidation"
```

If everything passes with zero changes needed, skip this commit and note that explicitly in your report.
