# Editor-as-Hero Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Stamp Studio editor the visual hero of the home page — full width, immediately below a slim headline strip, fully visible on load without scrolling on typical desktop screens — and give the editor's toolbar icons colored category backgrounds, replacing the current large marketing hero + boxed mid-page editor layout.

**Architecture:** Delete the existing two-column `Hero.tsx`. Add a new, much smaller `EditorHeroHeader.tsx` headline strip. Widen and re-height `StampStudioSection.tsx`'s editor chrome so it spans most of the page width and fills the viewport height below the header/headline on desktop. Apply Tailwind color-utility `className` overrides to the existing `IconButton` calls inside `Toolbar.tsx` — no changes to `IconButton` itself, no new dependencies.

**Tech Stack:** React, TypeScript, Vite, Tailwind CSS (existing stack, unchanged).

**Spec:** `docs/superpowers/specs/2026-09-10-editor-as-hero-redesign.md`

## Global Constraints

- No new dependencies, no new fonts (system fonts only, per the original project spec still in force).
- No changes to editor logic/behavior — this is a layout/visual change only. Drag/resize/rotate/zoom/pan, undo/redo, export, autosave, templates loading must all keep working exactly as before.
- The editor must be visible in full, without scrolling, on typical desktop/laptop viewport heights (1366×768, 1440×900, 1920×1080 and taller) immediately on page load. A small scroll is acceptable only on very short windows (below ~700px tall).
- Mobile layout (bottom toolbar + bottom sheets) is unchanged by this plan — only the desktop chrome's width/height and the toolbar's icon styling change.
- `IconButton.tsx` itself must not be modified to add toolbar-specific coupling — color styling is applied via `className` at each call site in `Toolbar.tsx`.
- Everything below the editor (Templates, How It Works, Features, Export, Use Cases, FAQ, Final CTA) stays in its current order and content, untouched by this plan.

---

## File Structure

```
src/
  components/
    home/
      Hero.tsx                    # DELETE
      EditorHeroHeader.tsx        # CREATE — slim headline strip replacing Hero
      StampStudioSection.tsx      # MODIFY — full-width, viewport-height editor chrome
    editor/
      Toolbar.tsx                 # MODIFY — colored className per icon-button category
  pages/
    HomePage.tsx                  # MODIFY — swap <Hero /> for <EditorHeroHeader />
```

---

## Task 1: Replace the Marketing Hero with a Slim Headline Strip

**Files:**
- Create: `src/components/home/EditorHeroHeader.tsx`
- Delete: `src/components/home/Hero.tsx`
- Modify: `src/pages/HomePage.tsx`

**Interfaces:**
- Produces: `EditorHeroHeader()` — no props, no exports beyond the default component. Renders the eyebrow badge + `<h1>{BRAND.tagline}</h1>` + one-line supporting copy from `src/config/brand.ts`'s existing `BRAND` export (`BRAND.tagline`, `BRAND.supportingCopy`), no buttons, no decorative graphic, no two-column grid.
- Consumes: `BRAND` from `../../config/brand` (already exists, unchanged).

- [ ] **Step 1: Create the new slim headline component**

Create `src/components/home/EditorHeroHeader.tsx`:
```tsx
import { BRAND } from '../../config/brand'

export default function EditorHeroHeader() {
  return (
    <div className="bg-paper-fade border-b border-line">
      <div className="mx-auto max-w-6xl px-6 py-6 text-center">
        <span className="inline-block rounded-full border border-line bg-paper px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent shadow-card">
          Free · No login required
        </span>
        <h1 className="mt-2 text-2xl font-semibold leading-tight tracking-tight md:text-3xl">
          {BRAND.tagline}
        </h1>
        <p className="mt-1 text-sm text-ink/60 md:text-base">{BRAND.supportingCopy}</p>
      </div>
    </div>
  )
}
```

This is deliberately compact (small padding, small heading size, one line of supporting copy) — it must leave as much vertical space as possible for the editor below it on desktop, since Task 2's viewport-fit calc accounts for a specific height budget for this strip.

- [ ] **Step 2: Delete the old Hero component**

```bash
rm src/components/home/Hero.tsx
```

- [ ] **Step 3: Wire the new component into HomePage**

Modify `src/pages/HomePage.tsx` — replace the `Hero` import and usage:
```tsx
import PageShell from '../components/layout/PageShell'
import { BRAND } from '../config/brand'
import EditorHeroHeader from '../components/home/EditorHeroHeader'
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
      <EditorHeroHeader />
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

- [ ] **Step 4: Verify build**

```bash
npx tsc --noEmit
npm run build
```
Expected: both succeed. Grep to confirm nothing else imports the deleted `Hero`:
```bash
grep -rn "from '.*home/Hero'" src/
```
Expected: no matches.

- [ ] **Step 5: Manual verification**

Run `npm run dev`, load `/`, confirm the old two-column hero with the decorative stamp graphic is gone, replaced by a compact centered headline strip with the eyebrow badge, headline, and one line of supporting copy — no buttons in this strip (the editor immediately below it is now the call to action).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: replace marketing hero with slim headline strip above the editor"
```

---

## Task 2: Widen and Re-height the Embedded Editor to Fill the Viewport

**Files:**
- Modify: `src/components/home/StampStudioSection.tsx`

**Interfaces:**
- No interface changes — same component, same props (none), same store subscriptions and effects as before. Only the returned JSX's className values for width/height change.

- [ ] **Step 1: Read the current file in full**

Read `src/components/home/StampStudioSection.tsx` to confirm its exact current structure before editing (it should match the version shown below, but confirm — later tasks in prior plans may have touched it).

- [ ] **Step 2: Widen and re-height the editor's outer chrome**

Modify `src/components/home/StampStudioSection.tsx` — replace the section's returned JSX. The two key changes: (a) the section's heading area collapses to a minimal top margin (most of the "Stamp Studio" heading text is now redundant with the new `EditorHeroHeader` above it, but keep a very small label for anchor-scroll context since `#editor` is still a nav target); (b) the editor's bounding box widens from `max-w-6xl` to a much wider container, and its height changes from a fixed pixel height to a viewport-relative height on desktop:

```tsx
  return (
    <section id="editor" className="scroll-mt-0 bg-paper">
      <div className="mx-auto max-w-[1600px] px-3 pt-3 md:px-6 md:pt-4">
        <div
          className="flex min-h-0 flex-col overflow-hidden rounded-xl3 border border-line shadow-card"
          style={{ height: 'min(800px, calc(100vh - 160px))' }}
        >
          <EditorTopBar />
          <div className="flex min-h-0 flex-1 flex-col md:grid md:grid-cols-[72px_1fr_320px]">
            <aside className="hidden min-h-0 overflow-y-auto border-r border-line md:block">
              <Toolbar />
            </aside>
            <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-line/20 p-4 md:p-8">
              <div className="aspect-square w-full max-w-sm md:max-w-2xl">
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
      </div>
    </section>
  )
```

Notes on the specific values chosen, and what to verify/adjust empirically:
- `style={{ height: 'min(800px, calc(100vh - 160px))' }}` — this uses an inline style (rather than an arbitrary Tailwind class) because CSS `min()` with a `calc()` mixing a fixed value and a viewport unit needs a real CSS `min()` function, which is more readable written directly than escaped inside a Tailwind arbitrary-value class. The `160px` offset is an estimate for "header height (~68px) + headline strip height (~90px after Task 1's compact version) + small breathing room" — this is a starting point, not a guarantee. Task 4 (verification) explicitly checks real screens and tells you to adjust this `160px` (and/or the `800px` cap) if the editor doesn't actually fit or if it leaves an awkward gap.
- `max-w-[1600px]` on the wrapping div — much wider than the old `max-w-6xl` (which is 1152px), giving the "full width tool" feel without going completely edge-to-edge (some breathing room on very wide monitors is intentional, matching the spec's "much wider than 6xl, with small edge padding" definition of "full width" for this project).
- The heading text ("Stamp Studio" / "Design your stamp right here...") from the old version is removed since `EditorHeroHeader` (Task 1) now carries the primary headline — keeping a redundant sub-heading here would eat into the vertical space budget this task is trying to preserve for the editor itself. The `id="editor"` anchor target moves to the `<section>` itself (unchanged) so the header nav's `#editor` link still scrolls to the right place.
- `scroll-mt-0` (was `scroll-mt-20` in the old version) — since this section is now effectively at the top of the page (right after the slim header/headline), it doesn't need the old scroll-margin offset that was compensating for a sticky header when scrolling to a mid-page anchor from far below; verify in Task 4 whether `scroll-mt-0` or a small positive value (e.g. `scroll-mt-16` to clear the sticky header when someone clicks the "Stamp Studio" nav link while scrolled down the page) is visually correct, and adjust if needed.
- `md:max-w-2xl` (was `md:max-w-xl`) on the canvas's inner sizing wrapper — slightly larger since there's more horizontal room now; this is a minor proportional adjustment, not load-bearing, adjust visually if it looks off.

- [ ] **Step 3: Verify build**

```bash
npx tsc --noEmit
npm run build
```
Expected: both succeed.

- [ ] **Step 4: Manual verification — viewport fit and layout**

Run `npm run dev`, use browser automation (Playwright, if available) or manual resizing to check at these viewport sizes: 1366×768, 1440×900, 1920×1080. At each, load `/` fresh and measure whether the editor's bottom edge is at or above `window.innerHeight` without any scrolling (e.g. via `document.querySelector('#editor').getBoundingClientRect().bottom <= window.innerHeight`, or a screenshot). If the editor's bottom edge exceeds the viewport height (requiring a scroll) on any of these three common sizes, adjust the `160px` offset and/or `800px` cap in the inline `style` from Step 2 until it fits — iterate empirically, this is expected per the spec's "best-effort, tune during implementation" guidance. Confirm no horizontal scroll is introduced by the wider `max-w-[1600px]` container at 1366px width (1366 > 1600 is false, so at 1366px width the container will actually be full-width minus padding, not clipped — this is fine and expected, `max-w-[1600px]` only caps growth on wider screens). Also verify at 375px mobile width that the mobile bottom-sheet layout is completely unaffected (still full functional, since this task didn't touch the mobile-specific classNames).

- [ ] **Step 5: Manual verification — golden path unaffected**

Confirm the full editor still works after the layout change: add a text element, drag it, add a curved text element, change the stamp shape, undo/redo, export PNG and SVG, use a template from the Templates section below and confirm it still loads into this now-repositioned editor correctly with a smooth scroll from the Templates section back up to `#editor`.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: widen stamp studio editor to full width and fit it above the fold"
```

---

## Task 3: Colored Icon Backgrounds for Toolbar Buttons

**Files:**
- Modify: `src/components/editor/Toolbar.tsx`

**Interfaces:**
- No interface changes — `IconButton` itself is not modified. Each existing `<IconButton>` call in `Toolbar.tsx` gains a `className` prop value (or an addition to its existing `className`, where one is already passed) carrying Tailwind background/text/border color utilities.

- [ ] **Step 1: Read the current file in full**

Read `src/components/editor/Toolbar.tsx` to confirm its exact current JSX (shown in this plan's context, but confirm nothing has drifted).

Also read `src/components/ui/IconButton.tsx` to confirm its `className` prop is appended (not replacing) the component's own base classes — per its current implementation, `className` is concatenated after the base/active classes (`` `${...base classes...} ${className}` ``), so passing color utilities via `className` will layer on top of the existing border/sizing classes correctly, though a color utility like `bg-sky-100` will need to visually override the default `border-line`/plain background — verify this renders correctly in Step 3, and if the base classes' specificity or ordering causes a passed background color not to show, that's a real conflict to resolve (e.g. the component may need the override classes to come after the base ones in the final class string, which the current template literal already does — `${base} ${className}` — so a later Tailwind class of the same property generally wins when Tailwind's own CSS ordering agrees, but confirm this visually rather than assuming).

- [ ] **Step 2: Apply category colors to each toolbar button**

Modify `src/components/editor/Toolbar.tsx`'s returned JSX — add a `className` to each `IconButton` call per this category mapping (text-family = sky, icon/decoration = amber, shapes = violet, image = emerald):

```tsx
  return (
    <div className="flex flex-col gap-2 p-3">
      <IconButton
        icon={<Type size={18} />}
        label="Add text"
        onClick={handleAddText}
        className="border-sky-200 bg-sky-100 text-sky-700 hover:border-sky-400"
      />
      <IconButton
        icon={<TextCursorInput size={18} />}
        label="Add curved text"
        onClick={handleAddCurvedText}
        className="border-sky-200 bg-sky-100 text-sky-700 hover:border-sky-400"
      />
      <IconButton
        icon={<ArrowUpToLine size={18} />}
        label="Add top text"
        onClick={handleAddTopText}
        className="border-sky-200 bg-sky-100 text-sky-700 hover:border-sky-400"
      />
      <IconButton
        icon={<ArrowDownToLine size={18} />}
        label="Add bottom text"
        onClick={handleAddBottomText}
        className="border-sky-200 bg-sky-100 text-sky-700 hover:border-sky-400"
      />
      <IconButton
        ref={iconTriggerRef}
        icon={<Sparkle size={18} />}
        label="Add icon"
        onClick={() => setIconPickerOpen((v) => !v)}
        className="border-amber-200 bg-amber-100 text-amber-700 hover:border-amber-400"
      />
      <IconPickerPopover
        open={iconPickerOpen}
        onClose={() => setIconPickerOpen(false)}
        onSelect={handleSelectIcon}
        triggerRef={iconTriggerRef}
      />
      <IconButton
        icon={<Circle size={18} />}
        label="Add circle"
        onClick={() => handleAddShape('circle')}
        className="border-violet-200 bg-violet-100 text-violet-700 hover:border-violet-400"
      />
      <IconButton
        icon={<RectangleHorizontal size={18} />}
        label="Add rectangle"
        onClick={() => handleAddShape('rectangle')}
        className="border-violet-200 bg-violet-100 text-violet-700 hover:border-violet-400"
      />
      <IconButton
        icon={<Square size={18} />}
        label="Add rounded rectangle"
        onClick={() => handleAddShape('roundedRectangle')}
        className="border-violet-200 bg-violet-100 text-violet-700 hover:border-violet-400"
      />
      <IconButton
        icon={<Minus size={18} />}
        label="Add line"
        onClick={() => handleAddShape('line')}
        className="border-violet-200 bg-violet-100 text-violet-700 hover:border-violet-400"
      />
      <IconButton
        icon={<ImageIcon size={18} />}
        label="Upload image"
        onClick={() => fileInputRef.current?.click()}
        className="border-emerald-200 bg-emerald-100 text-emerald-700 hover:border-emerald-400"
      />
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

Note the `ref={iconTriggerRef}` on the "Add icon" button is preserved exactly as it exists in the current file (this ref is load-bearing for the icon picker popover's outside-click-detection logic from a prior round of work — do not remove it).

- [ ] **Step 3: Verify build**

```bash
npx tsc --noEmit
npm run build
```
Expected: both succeed.

- [ ] **Step 4: Manual verification**

Run `npm run dev`, open the Stamp Studio editor (now at the top of the page per Tasks 1-2), visually confirm each toolbar button shows its category color as a background tint behind the icon (sky-blue for the four text-related buttons, amber for the icon-insert button, violet for the four shape buttons, emerald for the image-upload button), confirm the icons themselves remain legible against their tinted backgrounds, confirm hovering each button still shows a visible interaction state (border color shift), and confirm the `active` state (when a state uses `IconButton`'s `active` prop elsewhere, e.g. `EditorTopBar`'s undo/redo disabled states) is unaffected since this task only touches `Toolbar.tsx`'s call sites. Also verify all buttons still function correctly (clicking each one still adds the correct element type to the canvas) — this task is styling-only, but confirm no functional regression.

Also verify at mobile width (375px): the same `Toolbar` component is reused inside the mobile "Add element" bottom sheet — confirm the colored buttons render correctly there too (same component, so this should be automatic, but visually confirm).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add colored category backgrounds to toolbar icon buttons"
```

---

## Task 4: Final Verification Pass

**Files:** none created; this task only verifies and, if needed, makes small inline fixes to files from Tasks 1-3.

- [ ] **Step 1: Full type-check and build**

```bash
npx tsc --noEmit
npm run build
```
Expected: zero errors.

- [ ] **Step 2: Full golden-path walkthrough with the new layout**

Using browser automation if available: load `/` fresh, confirm the editor is the first substantial thing visible below a slim header/headline (no large marketing block above it), confirm it's usable immediately (add text, add a shape, add a top/bottom text shortcut, add an icon via the picker, drag an element, undo/redo, change stamp shape, export PNG and SVG) — the full golden path from prior rounds of work must still be intact. Scroll down and confirm Templates/How It Works/Features/Export/Use Cases/FAQ/Final CTA sections are all still present, in order, unchanged. Use a template and confirm it loads into the now-repositioned editor with a smooth scroll to `#editor`. Refresh mid-edit and confirm autosave/restore still works.

- [ ] **Step 3: Above-the-fold verification at common desktop sizes**

At 1366×768, 1440×900, and 1920×1080 (or as close to these as your tooling allows), confirm on a fresh page load that the editor's full bounding box (from `EditorTopBar` down through the bottom of the toolbar/canvas/properties row) is visible without scrolling. If any of these sizes still requires a scroll, go back to Task 2's inline `style` height calc and adjust the offset/cap values, then re-verify. Document the final chosen values and why.

- [ ] **Step 4: Responsiveness check**

At 375px and 768px, confirm no horizontal scroll anywhere on the page, confirm the mobile bottom-sheet editor layout still works correctly (Add/Edit/Export sheets all open and function, colored toolbar buttons render correctly inside the "Add" sheet).

- [ ] **Step 5: No fake/non-functional controls check**

```bash
grep -rn "TODO\|FIXME\|not implemented\|coming soon" src/
```
Expected: no matches.

- [ ] **Step 6: Commit (if any fixes were needed)**

```bash
git add -A
git commit -m "chore: final verification and tuning pass for editor-as-hero redesign"
```

If everything passes with zero changes needed beyond what Tasks 1-3 already did, skip this commit and note that explicitly in the report.

---

## Self-Review Notes (completed during plan authoring)

- **Spec coverage:** Decision 1 (slim headline strip replacing marketing hero) → Task 1. Decision 2 (full page width) → Task 2. Decision 3 (viewport-fit, single-screen visibility) → Task 2 + Task 4 Step 3. Decision 4 (colored toolbar icons) → Task 3. Decision 5 (everything below unchanged) → explicitly not touched by any task, verified in Task 4 Step 2.
- **Placeholder scan:** no TBD/TODO in any task step; the empirically-tuned height offset in Task 2 is explicitly flagged as "verify and adjust," which is a sanctioned, spec-permitted pattern (not a placeholder) — the spec itself says this is best-effort and to tune during implementation.
- **Type consistency:** no new types/interfaces introduced by this plan; `EditorHeroHeader` takes no props, `StampStudioSection` and `Toolbar` keep their existing zero-prop signatures untouched.
