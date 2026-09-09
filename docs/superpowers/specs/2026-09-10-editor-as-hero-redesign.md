# Editor-as-Hero Redesign Design Spec

## Context

The user shared a screenshot comparison: our current home page's embedded Stamp Studio (a ~640-720px-tall boxed card, mid-page, below a large two-column marketing hero) looks noticeably less polished than a reference competitor site (stamps-maker.com), whose editor is full-width, immediately below the header, colorful in its toolbar, and reads as the main event of the page rather than an afterthought.

Per the original project spec's originality rules, this redesign studies the reference site for general UI *structure* only (full-width editor-first layout is a common, uncopyrightable pattern) — no branding, copy, colors, icons, or exact visual styling are copied. MarkForge keeps its own brand, palette, copy, and component design throughout.

## Decisions (confirmed with the user)

1. **Editor becomes the page's hero.** The existing large two-column marketing hero (headline + supporting paragraph + decorative stamp SVG, in `Hero.tsx`) is removed. In its place: a slim one-line headline strip (eyebrow badge + short headline, no large decorative graphic, no two-column layout) directly above the editor.
2. **Editor spans full page width**, breaking out of the site's `max-w-6xl` content container (matching the reference's edge-to-edge tool feel), rather than staying boxed at 6xl width.
3. **Toolbar icons get colored backgrounds.** Keep the existing lucide-react icon library (no new dependency) — each toolbar button gets a small colored rounded-square swatch behind its icon (grouped by category: text-family actions one color, shape actions another, image/icon actions another), rather than the current plain bordered squares.
4. Everything below the editor (Templates section, How It Works, Features, Export, Use Cases, FAQ, Final CTA) is unchanged in order and content — this redesign is scoped to the top of the page only.

## Architecture

**File changes, no new routes, no new dependencies:**

- `src/components/home/Hero.tsx` → deleted. Its "Free · No login required" eyebrow badge concept and `BRAND.tagline` headline move into a new, much smaller component.
- New `src/components/home/EditorHeroHeader.tsx`: the slim headline strip — eyebrow badge + `<h1>{BRAND.tagline}</h1>` + one-line supporting copy, no CTA buttons (the editor right below it *is* the CTA), no decorative graphic, no two-column grid. Renders inside the normal `max-w-6xl` padding (only the editor itself breaks out to full width, not this text strip).
- `src/components/home/StampStudioSection.tsx`: modified so its outer wrapping element drops the `max-w-6xl` constraint on the editor's bounding box specifically (the section's own padding/background can stay full-bleed or `max-w-6xl` for the heading text above it, but the actual editor chrome — the bordered `EditorTopBar`+3-column grid box — expands to a wider max-width, e.g. `max-w-[1600px]` or a small-percentage-padded full width, "full width" here meaning "much wider than 6xl, with small edge padding," not literally `100vw` with zero margin). Height also increases from the current bounded `h-[720px]`/`md:h-[640px]` to something taller (e.g. `h-[800px]`/`md:h-[720px]`) to give the properties panel more breathing room, matching the reference's fuller vertical presence.
- `src/components/editor/Toolbar.tsx`: each `IconButton` call gets a new prop for a background color swatch. Rather than changing `IconButton`'s own component contract in a way that couples it to "toolbar color categories" (a leaky abstraction — `IconButton` is used elsewhere too, e.g. `EditorTopBar`, `LayerList`, `MobileToolbar`, and those call sites shouldn't need to think about toolbar-specific color categories), the color swatch is applied via `className` prop overrides at each `Toolbar.tsx` call site (e.g. `className="bg-sky-100 text-sky-700 border-sky-200"` for text actions), keeping `IconButton` itself unchanged and reusable.
- `src/pages/HomePage.tsx`: replace `<Hero />` with `<EditorHeroHeader />`, keep everything else in the same order.

**Color category assignment** (Tailwind utility colors, chosen for variety without introducing new hex values into the design-token system — using Tailwind's built-in palette, not new brand tokens):
- Text-family actions (Add text, Add curved text, Add top text, Add bottom text): sky/blue tone
- Icon/decoration actions (Add icon): amber/orange tone
- Shape actions (circle, rectangle, rounded rectangle, line): violet/purple tone
- Image actions (Upload image): emerald/green tone

**Data flow**: no changes — `StampStudioSection` still owns the same store subscriptions, autosave, and mount-restore logic exactly as before; only its layout width/height and the `Hero`→`EditorHeroHeader` swap change. `Toolbar.tsx`'s button handlers are unchanged; only the `className` passed to each `IconButton` changes.

**Testing**: same as prior rounds in this project — no automated test suite; verification is manual/Playwright-driven per task (confirm full golden path still works, confirm layout looks correct at 375/768/1440px, confirm the wider editor doesn't cause horizontal scroll, confirm colored icon swatches render and are legible in both light backgrounds).

## Scope check

This is a single, focused UI change (remove one component, add one small component, widen/heighten one existing section, restyle one existing component's call sites) — not decomposed further. It's bounded enough for a single implementation plan.
