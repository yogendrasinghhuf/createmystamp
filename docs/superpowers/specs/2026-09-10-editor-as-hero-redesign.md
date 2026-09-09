# Editor-as-Hero Redesign Design Spec

## Context

The user shared a screenshot comparison: our current home page's embedded Stamp Studio (a ~640-720px-tall boxed card, mid-page, below a large two-column marketing hero) looks noticeably less polished than a reference competitor site (stamps-maker.com), whose editor is full-width, immediately below the header, colorful in its toolbar, and reads as the main event of the page rather than an afterthought.

Per the original project spec's originality rules, this redesign studies the reference site for general UI *structure* only (full-width editor-first layout is a common, uncopyrightable pattern) — no branding, copy, colors, icons, or exact visual styling are copied. MarkForge keeps its own brand, palette, copy, and component design throughout.

## Decisions (confirmed with the user)

1. **Editor becomes the page's hero.** The existing large two-column marketing hero (headline + supporting paragraph + decorative stamp SVG, in `Hero.tsx`) is removed. In its place: a slim one-line headline strip (eyebrow badge + short headline, no large decorative graphic, no two-column layout) directly above the editor.
2. **Editor spans full page width**, breaking out of the site's `max-w-6xl` content container (matching the reference's edge-to-edge tool feel), rather than staying boxed at 6xl width.
3. **The editor must be fully visible on load, above the fold, without scrolling, on typical desktop/laptop viewport heights.** Concretely: header + headline strip + the full editor (top bar through canvas/toolbar/properties) must fit within one viewport-height on common screens (e.g. 1366×768, 1440×900, 1920×1080 and taller). This is a best-effort fit, not an absolute guarantee — very short windows (below roughly 700px tall) may require a small scroll to see the bottom of the editor, which is acceptable. Achieved by sizing the editor's height relative to the viewport (e.g. a `calc(100vh - <header+headline height>)`-style height) rather than a fixed pixel height, combined with keeping the headline strip and header both compact so they don't eat into the editor's available vertical space.
4. **Toolbar icons get colored backgrounds.** Keep the existing lucide-react icon library (no new dependency) — each toolbar button gets a small colored rounded-square swatch behind its icon (grouped by category: text-family actions one color, shape actions another, image/icon actions another), rather than the current plain bordered squares.
5. Everything below the editor (Templates section, How It Works, Features, Export, Use Cases, FAQ, Final CTA) is unchanged in order and content — this redesign is scoped to the top of the page only.

## Architecture

**File changes, no new routes, no new dependencies:**

- `src/components/home/Hero.tsx` → deleted. Its "Free · No login required" eyebrow badge concept and `BRAND.tagline` headline move into a new, much smaller component.
- New `src/components/home/EditorHeroHeader.tsx`: the slim headline strip — eyebrow badge + `<h1>{BRAND.tagline}</h1>` + one-line supporting copy, no CTA buttons (the editor right below it *is* the CTA), no decorative graphic, no two-column grid. Renders inside the normal `max-w-6xl` padding (only the editor itself breaks out to full width, not this text strip).
- `src/components/home/StampStudioSection.tsx`: modified so its outer wrapping element drops the `max-w-6xl` constraint on the editor's bounding box specifically (the section's own padding/background can stay full-bleed or `max-w-6xl` for the heading text above it, but the actual editor chrome — the bordered `EditorTopBar`+3-column grid box — expands to a wider max-width, e.g. `max-w-[1600px]` or a small-percentage-padded full width, "full width" here meaning "much wider than 6xl, with small edge padding," not literally `100vw` with zero margin). Height changes from the current fixed `h-[720px]`/`md:h-[640px]` to a viewport-relative height on desktop (e.g. `md:h-[calc(100vh-<offset>px)]` where `<offset>` accounts for the header height plus the compact headline strip height, tuned during implementation/verification so the editor's bottom edge lands at or near the viewport's bottom edge on a 1440×900-class screen) so the "single screen, no scroll" requirement is met on typical screens; mobile keeps a fixed height suited to the bottom-sheet layout (mobile was never expected to fit an entire desktop-style 3-column editor in one screen, and the existing mobile-canvas-plus-bottom-toolbar pattern already works — no viewport-height change needed there).
- `src/components/editor/Toolbar.tsx`: each `IconButton` call gets a new prop for a background color swatch. Rather than changing `IconButton`'s own component contract in a way that couples it to "toolbar color categories" (a leaky abstraction — `IconButton` is used elsewhere too, e.g. `EditorTopBar`, `LayerList`, `MobileToolbar`, and those call sites shouldn't need to think about toolbar-specific color categories), the color swatch is applied via `className` prop overrides at each `Toolbar.tsx` call site (e.g. `className="bg-sky-100 text-sky-700 border-sky-200"` for text actions), keeping `IconButton` itself unchanged and reusable.
- `src/pages/HomePage.tsx`: replace `<Hero />` with `<EditorHeroHeader />`, keep everything else in the same order.

**Color category assignment** (Tailwind utility colors, chosen for variety without introducing new hex values into the design-token system — using Tailwind's built-in palette, not new brand tokens):
- Text-family actions (Add text, Add curved text, Add top text, Add bottom text): sky/blue tone
- Icon/decoration actions (Add icon): amber/orange tone
- Shape actions (circle, rectangle, rounded rectangle, line): violet/purple tone
- Image actions (Upload image): emerald/green tone

**Data flow**: no changes — `StampStudioSection` still owns the same store subscriptions, autosave, and mount-restore logic exactly as before; only its layout width/height and the `Hero`→`EditorHeroHeader` swap change. `Toolbar.tsx`'s button handlers are unchanged; only the `className` passed to each `IconButton` changes.

**Testing**: same as prior rounds in this project — no automated test suite; verification is manual/Playwright-driven per task (confirm full golden path still works, confirm layout looks correct at 375/768/1440px, confirm the wider editor doesn't cause horizontal scroll, confirm colored icon swatches render and are legible in both light backgrounds, and specifically confirm at common desktop heights — e.g. 900px, 1080px viewport height — that the entire editor is visible without scrolling immediately on page load, i.e. `document.documentElement.scrollHeight` for the above-the-fold content roughly matches or is less than `window.innerHeight` before the Templates section begins).

## Scope check

This is a single, focused UI change (remove one component, add one small component, widen/heighten one existing section, restyle one existing component's call sites) — not decomposed further. It's bounded enough for a single implementation plan.
