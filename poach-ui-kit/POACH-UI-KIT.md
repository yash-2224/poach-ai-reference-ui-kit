# Poach UI Kit — complete design reference

> **To any AI agent or developer reading this:** this document describes the exact visual language of
> **Poach AI** ("Porcelain & Royal Blue"). You are building a *different* product with *its own* content,
> but its interface must look and feel **identical** to Poach: same colours, fonts, icons, surfaces,
> buttons, popups, motion, spacing, phone layout and tone. Follow every rule literally. When something
> isn't covered, copy the closest pattern here — never invent a new style.
>
> The kit ships with `poach-theme.css` (drop-in stylesheet with every token, utility and animation) and
> `reference-components/` (the real source of every primitive). Use them as-is.

---

## Contents

1. How to use this kit
2. Tech stack the kit assumes
3. Personality in one minute
4. Hard rules (never break)
5. Colour system (light + dark)
6. Typography
7. Icons
8. Shape, depth and surfaces
9. Motion system
10. Components — exact recipes
11. App shell and layout
12. Page patterns
13. AI assistant / chat interface
14. Data visualisation
15. Theme switch (light/dark)
16. Phone layout (its own design)
17. Copy and tone
18. Accessibility
19. QA checklist before shipping
20. Appendix A — full theme stylesheet
21. Appendix B — prompt to give a new agent

---

## 1. How to use this kit

1. Copy `poach-theme.css` to your global stylesheet (Tailwind v4: `src/styles.css`). Do not edit token values.
2. Add the font `<link>` from §6 to your document head.
3. Install: `tailwindcss@4`, `tw-animate-css`, `@phosphor-icons/react`, `motion` (Framer Motion), `sonner`,
   `class-variance-authority`, `clsx`, `tailwind-merge`, Radix UI primitives (shadcn/ui), `recharts`.
4. Copy `reference-components/` into your project (`components/ui/*`, `components/kit/*`, `lib/*`). They
   import `cn` from `@/lib/utils` (included).
5. Build every screen from these pieces. Use semantic Tailwind classes (`bg-card`, `text-muted-foreground`,
   `bg-primary`) — never raw colours.
6. Before shipping, run the checklist in §19 in **both themes** at **394 px** and **1280 px** wide.

---

## 2. Tech stack the kit assumes

- React 19 + TypeScript (strict). Any React framework works (TanStack Start, Next.js, Vite SPA).
- Tailwind CSS **v4**, CSS-first config (no `tailwind.config.js`). Dark mode = `.dark` class on `<html>`
  via `@custom-variant dark (&:is(.dark *));`.
- shadcn/ui primitives on Radix, **already restyled** in `reference-components/ui`.
- `motion/react` for component motion; CSS keyframes for popups and page reveals.
- `sonner` for toasts; `recharts` for charts; `@phosphor-icons/react` for icons.

---

## 3. Personality in one minute

Calm, premium, airy, soft — Apple + Linear + Lovable.dev, but **light**.

- **Porcelain canvas**: a very light, slightly blue-tinted off-white page.
- **White engraved cards** sit on it: hairline outer edge, white inner top highlight, faint inner bottom
  shade — they look pressed *into* the surface, not floating above it.
- **Royal-blue header band** across the top of every screen except the marketing home page.
- **Graphite (ink)** is the only dark colour in light mode, used sparingly: the main call-to-action button
  and the user's chat bubble. It never glows.
- **Liquid glass** for floating things (composer, popovers, floating cards): frosted, blurring what's
  behind so it is never readable.
- Everything is rounded and gentle ("baby-like"). No sharp corners, harsh borders or heavy shadows.
- Motion is quick and smooth: things **rise and come into focus** (opacity + small rise + de-blur).
- Data is shown visually — pills, meters, stacked bars, rings, small charts, tidy tables — not paragraphs.
- Dark theme ("Graphite & Royal Blue") is the same design re-coloured: deep blue-graphite canvas,
  slightly lifted cards, softer blue. Still no glow.

---

## 4. Hard rules (never break)

| Never | Always instead |
|---|---|
| Hardcoded colours: `text-white`, `bg-black`, `bg-gray-100`, `#2563eb`, `bg-blue-600` | Semantic tokens: `text-primary-foreground`, `bg-card`, `bg-muted`, `bg-primary` |
| Neon glow, coloured halos, glowing text, `drop-shadow` glows | `shadow-engraved`, `shadow-soft`, `shadow-float` only |
| Dark sections inside the light theme; per-component `dark:` overrides | Tokens re-theme everything from the `.dark` block |
| Purple→pink / rainbow gradients | `bg-primary-gradient`, `bg-ink-gradient`, `bg-band`, `bg-aurora` (marketing only) |
| Inter, Poppins, Roboto, Arial, system default fonts | **Satoshi** (body) + **General Sans** (headings) |
| lucide-react, heroicons, Font Awesome, emoji as icons | `@phosphor-icons/react` |
| Visible scrollbars, sideways page scroll | Scrollbars hidden globally; layouts wrap/stack |
| Hand-rolled borders + shadows on cards | `surface`, `surface-soft`, `well`, `glass`, `glass-solid` utilities |
| A big opaque panel behind a floating composer/card | Only the floating element itself is `glass-solid` |
| See-through glass where text behind stays readable | `glass-solid` (behind looks only blurred) |
| Bouncy/springy/slow motion; page transitions > 400 ms | Ease-out curves and durations in §9 |
| Content hidden until an animation or JavaScript finishes | Content visible on first paint; motion is decoration |
| Browser `alert()` / `confirm()`, default-looking toasts | `AlertDialog` and the skinned `sonner` toast |
| `<button>` inside `<button>` | Row `<div>` with sibling buttons |
| Desktop layout squeezed onto phones | Dedicated phone layout (§16) |
| Dropdown wider/narrower than its trigger | Dropdowns/selects match the trigger width; rows match trigger height |
| The AI's avatar = generic "sparkles" stock logo with a glow | A solid round `bg-primary-gradient` mark with a white glyph, no glow |
| Pie charts with > 5 slices, 3D charts, chart borders | Area/line with soft fill, rounded bars, stacked bars, rings |

---

## 5. Colour system

All colours are OKLCH CSS variables in `:root` (light) and `.dark`, exposed to Tailwind via `@theme inline`.
**Use the Tailwind class, never the value.** Full values are in Appendix A.

| Role | Classes | Light look | Dark look | Use for |
|---|---|---|---|---|
| Canvas | `bg-background` | porcelain off-white (blue tint) | deep blue-graphite | page background |
| Text | `text-foreground` | deep graphite-navy | near-white | body, titles |
| Card | `bg-card` | pure white | lifted graphite | panels, rows, inputs |
| Popover | `bg-popover` | white | slightly lighter than card | menus, popovers |
| Muted | `bg-muted`, `text-muted-foreground` | soft grey / grey-blue text | | wells, meta text, hovers |
| Secondary | `bg-secondary`, `text-secondary-foreground` | light grey / dark grey text | | quiet buttons, secondary text |
| Primary | `bg-primary`, `text-primary`, `bg-primary-soft` | royal blue / pale blue tint | softer blue / deep blue tint | links, active, focus, charts |
| Accent | `bg-accent`, `text-accent-foreground` | pale blue / deep blue text | | soft chips, selected rows |
| Ink | `bg-ink`, `text-ink-foreground`, `bg-ink-gradient` | graphite | **flips to porcelain** | main CTA, user chat bubble, tooltips |
| Band | `bg-band`, `text-band-foreground`, `text-band-muted`, `glass-band` | royal-blue gradient | deeper blue | top header bar only |
| Success | `text-success`, `bg-success-soft`, `text-success-foreground` | calm green | | positive status |
| Warning | `text-warning`, `bg-warning-soft`, `text-warning-foreground` | amber | | needs attention |
| Destructive | `text-destructive`, `bg-destructive-soft` | soft red | | errors, delete |
| Info | `text-info`, `bg-info-soft` | sky | | neutral info |
| Lines | `border-border`, `border-border-strong`, `ring-ring` | hairlines | white 8–16 % | separators, focus |
| Charts | `var(--chart-1…5)` | blue, light blue, pale blue, green, amber | | chart series, in that order |

Rules
- Status = **soft background + matching foreground** pair (`bg-success-soft text-success-foreground`),
  usually via the `Pill` component, often with a small dot.
- Opacity modifiers on tokens are fine: `bg-card/70`, `bg-muted/40`, `text-band-foreground/80`.
- Theme-aware helper variables (use in arbitrary values instead of white): `--hi` (inner top highlight),
  `--hairline`, `--glass-*`, `--surface-soft-bg`, `--tab-pill`, `--ink-ring`, `--band-edge`.
- New colour? Add it to `:root` **and** `.dark` **and** `@theme inline`. Never inline it in a component.
- Selection colour: royal blue at 18 %.

---

## 6. Typography

```html
<link rel="preconnect" href="https://api.fontshare.com" />
<link rel="preconnect" href="https://cdn.fontshare.com" crossorigin="anonymous" />
<link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&f[]=general-sans@400,500,600&display=swap" />
```
Load fonts with `<link>`, never `@import url(...)` in CSS.

| | Font | Weight | Letter-spacing | Line-height |
|---|---|---|---|---|
| Body (`font-sans`) | **Satoshi** | 400 / 500 / 700 | `0.012em` | 1.6 |
| Headings h1–h4 (`font-display`) | **General Sans** | 600 | `-0.012em` | 1.2 |
| Buttons | Satoshi 500 | | `0.01em` | |
| Numbers | add `tabular` utility (tabular figures, 0 tracking) | | | |

Body font-size is **14.5px**; feature settings `"ss01", "ss02"`; antialiased.

Size scale (stick to it):

| Use | Size / style |
|---|---|
| Section label / eyebrow | 10.5–11px, uppercase, `tracking-[0.08em]`–`[0.09em]`, semibold, muted (or tone colour) |
| Meta, timestamps, helper text | 11.5–12.5px, `text-muted-foreground` |
| Secondary text, list rows, buttons, menu items | 13–13.5px |
| Body / chat text | 14.5px, line-height 1.7 in chat |
| Panel title | 14.5–15px semibold |
| Card title in AI cards | 15px `font-display` semibold |
| Page title | 22–26px `font-display` semibold |
| Empty-chat greeting | 26–30px semibold, centred |
| Marketing hero | large `clamp()` display, balanced wrapping |

Medium, comfortable spacing — never cramped, never ultra-wide. Don't change body letter-spacing.

---

## 7. Icons

- Package `@phosphor-icons/react`; import names ending in `Icon` (`HouseIcon`, `PaperPlaneTiltIcon`).
- Weights: `regular` for nav and toolbars; `duotone` inside icon tiles and cards (soft, rounded,
  "baby-like"); `fill` for active states, status, badges, primary-button glyphs; `bold` for tiny
  caret/check/arrow glyphs.
- Sizes: 17px inside buttons (set by Button), 18–19px in nav/top bar, 22px in phone bottom tabs, 13px in
  pills, 11–14px tiny glyphs.
- When an icon represents a thing, put it in a tile: `grid size-9 place-items-center rounded-full
  bg-primary-soft text-primary` or `size-10 rounded-[14px]` tiles with an inner highlight
  `shadow-[inset_0_1px_0_oklch(1_0_0/0.5),inset_0_0_0_1px_oklch(0_0_0/0.04)]`.
- Spinner: `CircleNotchIcon` with `animate-spin`.

---

## 8. Shape, depth and surfaces

Base radius `--radius: 0.75rem`.

| Element | Radius |
|---|---|
| Small buttons, menu items, inputs (sm) | `rounded-lg` |
| Buttons, inputs, selects, icon tiles, segmented controls | `rounded-xl` |
| Cards / panels (`surface`) | `rounded-2xl` |
| AI cards, composer, floating cards | `rounded-[22px]` |
| Modals, side sheets | `rounded-3xl` |
| Bottom sheets (phone) | `rounded-t-[28px]` |
| Pills, chips, avatars, dots, badges | `rounded-full` |
| Content sheet under the blue band | `rounded-t-[20px]` (top corners only) |

Surface utilities (defined in the theme stylesheet — never hand-roll):

| Utility | What it is | Use for |
|---|---|---|
| `surface` | `bg-card` + `rounded-2xl` + engraved shadow | every card/panel |
| `surface-soft` | 70 % card, hairline + top highlight | secondary cards on tinted areas |
| `engraved` / `shadow-engraved` | the engraved edge alone | buttons, chips, inputs, active rows |
| `well` | inset pressed-in muted area | segmented-control track, meters, stat tiles, number badges |
| `glass` | liquid glass, blur 22px + saturate | marketing nav, glass buttons |
| `glass-solid` | frosted, nearly opaque, blur 28px | floating composer, floating cards over content |
| `glass-band` | translucent white on the blue band | search field and buttons inside the header |
| `shadow-soft` | gentle elevation | hover lift |
| `shadow-float` | popover/modal elevation (hairline + long soft drop) | menus, popovers, dialogs, toasts |
| `bg-primary-gradient` / `bg-ink-gradient` / `bg-band` / `bg-aurora` | the only gradients | blue CTA / graphite CTA / header / marketing backdrop |
| `dotted-grid` | 18px hairline dot grid | subtle backgrounds |
| `hairline-x` | vertical hairlines between children | stat strips |
| `tabular` | tabular numerals | all numbers that change or align |
| `shimmer-text` | moving grey→foreground gradient text | "thinking…" / loading labels |

Engraved recipe (light): `0 0 0 1px ink/7%, 0 1px 2px ink/5%, inset 0 1px 0 white/90%, inset 0 -1px 0 ink/3.5%`.

**Glass rule:** only the floating element is glass. Nothing solid behind it. Behind = blurred, never readable.

**Soft tone wash:** cards that carry a tone (AI cards, heads-up messages) get a top wash:
`absolute inset-x-0 top-0 h-20–24 bg-gradient-to-b from-primary-soft/70 to-transparent` (swap
`primary-soft` for `success-soft` / `warning-soft` / `destructive-soft` / `muted`).

---

## 9. Motion system

Libraries: `motion/react` for component motion; CSS utilities for popups/reveals.

**Easing** — enter/move: `cubic-bezier(0.22, 1, 0.36, 1)` (`ease: [0.22, 1, 0.36, 1]`).
Exit: `cubic-bezier(0.4, 0, 1, 1)`, always shorter than the enter. No visible bounce/overshoot.
Allowed springs only for "sliding pill" indicators: `{ type: "spring", stiffness: 420–700, damping: 34–48 }`
(critically damped, no wobble).

**Signature move — "rise into focus":** `opacity 0→1`, `y 6–12px→0`, `filter blur(3–8px)→0`.

| Thing | Spec |
|---|---|
| Hover / colour / press | 150–200 ms; buttons `active:scale-[0.98]` (chips `0.97`) |
| Route change | 160 ms: opacity 0→1, y 4→0 (only after hydration) |
| Section reveal (`reveal-in` / `<Reveal>`) | 240 ms rise + de-blur, CSS so it plays before JS |
| List rows / chat messages entering | 200–220 ms, y 10→0, blur 6→0 |
| Popover / dropdown / select (`pop-motion`) | in 240 ms: y −6px (+6 when opening upward), scale .965, blur 4→0; out 150 ms |
| Modal (`modal-motion`) | in 320 ms: y 14, scale .96, blur 8→0; out 180 ms |
| Backdrop (`veil-motion`) | 260 ms fade in, 180 ms out; overlay `bg-foreground/15 backdrop-blur-[3px]` |
| Expanding status pill | 340 ms width reveal (grid `0fr→1fr`) |
| Sidebar collapse/expand | 380 ms width; icons fixed in a 44px slot and never move; labels fade/blur |
| Phone bottom bar hide/show | 300 ms translateY(100 %) + fade |
| Collapsible sections in cards | 280 ms height auto + opacity |
| Status icon swaps | 260 ms scale .6→1, rotate −20°→0 |
| Theme switch | 1150 ms "water wave" (§15) |
| AI words appearing | 560 ms per word, blur 7px→0, opacity 0→1 (§13) |
| Indeterminate progress line | 2px line, 1/3 width segment sliding, 1.1 s loop |
| Toast life line | 2px hairline shrinking left→right over 3.6 s, pauses on hover |
| Loading dots | 3 dots, opacity .3→1→.3 and y 0→−3→0, 1 s loop, 150 ms stagger |

Rules
- The clicked thing responds instantly; new content is visible in the first frame. Never stagger a page's
  main content by more than ~75 ms total.
- **Never hide server-rendered content until JavaScript loads.** Page-level entrances use CSS (`reveal-in`)
  or `initial={hydrated ? {...} : false}`.
- Width/height reveals: CSS grid `0fr→1fr` or motion `height: "auto"` — not `display` toggles.
- Respect `prefers-reduced-motion` (global rule in the stylesheet cuts all durations).

---

## 10. Components — exact recipes

All of these exist in `reference-components/`. Class strings below are the source of truth.

### 10.1 Button (`ui/button.tsx`, cva)
Base: `relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium tracking-[0.01em] cursor-pointer transition-[background,box-shadow,transform,color,opacity] duration-200 ease-out active:scale-[0.98] focus-visible:ring-3 focus-visible:ring-ring/25 disabled:opacity-45 [&_svg]:size-[17px]`

| Variant | Look | Use |
|---|---|---|
| `default` | graphite `bg-ink-gradient`, inset top highlight, 1px `--ink-ring` edge, small drop | THE main action of an area (max one) |
| `primary` | royal-blue `bg-primary-gradient`, inset highlight, darker blue edge | main action in blue contexts (AI approve, send) |
| `outline` | `bg-card shadow-engraved hover:bg-muted/60` | secondary actions |
| `secondary` | `bg-secondary` + engraved | quiet actions |
| `soft` | `bg-primary-soft text-accent-foreground` | gentle highlighted action |
| `ghost` | text only, `hover:bg-muted` | cancel, "Not now", toolbar icons |
| `glass` | `glass` | over imagery / marketing |
| `band` | `glass-band text-band-foreground` | buttons inside the blue header |
| `success` / `destructive` | soft tinted bg + matching text + inset ring | confirm / delete |
| `link` | blue text, underline on hover | inline links |

Sizes: `xs` h-7, `sm` h-8 `rounded-lg text-[13px]`, `default` h-9 px-4, `lg` h-11 px-6 `text-[15px]`,
`icon` size-9, `icon-sm` size-8. On phones, primary actions are ≥ 44px tall and often full width.

### 10.2 Inputs
- Input: `h-10 rounded-xl bg-card px-3.5 text-sm shadow-engraved placeholder:text-muted-foreground/80`;
  focus: `shadow-[0_0_0_1px_var(--color-ring),0_0_0_4px_oklch(0.6_0.13_262/0.14)]`; invalid: same with
  destructive. No visible border lines — the engraved shadow *is* the border.
- Textarea: same, `min-h-[72px] py-2.5`.
- Label above field: 12px medium `text-secondary-foreground`, required star `text-destructive`.
- Error under field: 11.5px `text-destructive`. Hint: 11.5px muted.
- Checkbox: `size-[18px] rounded-[6px] bg-card shadow-engraved`, checked `bg-primary`, check zooms in.
- Switch: `h-[22px] w-[38px]` track `bg-border-strong` → `bg-primary`; white thumb with soft shadow,
  slides with a gentle overshoot curve `cubic-bezier(0.34,1.56,0.64,1)` 300ms.
- Slider: thin track `bg-primary/20`, range `bg-primary`, round thumb; show the value right-aligned
  above it (13px semibold tabular) and min/max under it (10.5px muted).
- Chips (single/multi choice): `h-8 rounded-full px-3.5 text-[12.5px] font-medium`; off = `bg-card
  shadow-engraved hover:bg-muted/60`; on = `bg-primary text-primary-foreground` (+ small check for multi).
- Choice tiles: `rounded-2xl p-3 bg-card shadow-engraved`, icon tile 32px, title 13px semibold,
  description 12px muted, optional green badge; selected = `bg-primary-soft/60` +
  `shadow-[inset_0_0_0_1.5px_var(--color-primary)]` + filled round check top-right.

### 10.3 Select & dropdown menu
- Trigger: `h-9 w-full rounded-xl bg-card px-3 shadow-engraved hover:bg-muted/40`, caret right.
- Content: `rounded-xl bg-popover p-1 shadow-float pop-motion`, **width = trigger width**
  (`w-(--radix-select-trigger-width)`), 4px offset.
- Item: `rounded-lg py-1.5 pl-2.5 pr-8 text-[13px] focus:bg-muted`, row height ≈ trigger height − 4px,
  check icon on the right for the selected one. Long text truncates.
- Dropdown menu: `rounded-xl bg-popover p-1.5 shadow-float pop-motion`, width
  `max(8rem, trigger width)`; icon-only triggers use a fixed width (`w-44`–`w-52`).
  Items `rounded-lg px-2.5 py-2 text-sm gap-2 [&>svg]:size-4 focus:bg-muted`. Destructive item in
  `text-destructive`. Separators are hairlines.

### 10.4 Popover, tooltip, dialogs, sheets
- Popover: `w-72 min-w-[trigger] max-w-[calc(100vw-16px)] rounded-2xl bg-popover p-4 shadow-float pop-motion`.
- Tooltip: `rounded-lg bg-ink px-2.5 py-1 text-xs font-medium text-ink-foreground shadow-soft`.
- Dialog / AlertDialog: centred, `max-w-lg rounded-3xl bg-card p-6 shadow-float modal-motion`; overlay
  `bg-foreground/15 backdrop-blur-[3px] veil-motion`; close button = round `size-8 bg-muted/80`.
  Footer buttons right-aligned on desktop, stacked (primary on top) on phone. Destructive confirm:
  "Keep it" (cancel) + "Delete" (destructive), then a toast.
- Side sheet: floating `inset-y-3 right-3 rounded-3xl`, `sm:max-w-md`.
- Bottom sheet (phone): `rounded-t-[28px] max-h-[88dvh]`, grabber `mx-auto h-1.5 w-10 rounded-full
  bg-border-strong`, safe-area bottom padding.

### 10.5 Toast (sonner, unstyled + skin)
Card `rounded-2xl bg-card py-3 pr-4 pl-3 shadow-float sm:w-[360px]`, inner top highlight; default toasts
show a 32px round `bg-primary-soft` disc with a blue centre dot on the left; title 13.5px semibold,
description 12.5px muted; action button = small `bg-ink` pill; a 2px primary hairline at the bottom shrinks
over the toast's life. Position bottom-right desktop, top-centre phone.

### 10.6 Pill (status / tag / count)
`inline-flex items-center gap-1.5 rounded-full font-medium tracking-[0.01em] [&_svg]:size-[13px]`
Tones: `neutral` (muted), `blue` (primary-soft), `green`, `amber`, `red`, `sky`, `white` (card + engraved),
`ink`. Each soft tone has a 1px inset ring of its own colour at 12–25 %. Sizes `sm` h-22px 11.5px,
`md` h-6 12px, `lg` h-7 13px. Options: leading `dot` (6px), `pulse` (dot breathes).

### 10.7 Panel (standard card)
`<section class="surface overflow-hidden">` → header `px-4 pt-4 pb-3 sm:px-5` with title 14.5px semibold,
description 13px muted, actions right (stack under title on phone) → body `px-4 pb-4 sm:px-5 sm:pb-5`.

### 10.8 Segmented control / tabs
Track `well rounded-xl p-[3px]`; options `h-8 px-3.5 text-[13px] rounded-[9px]` muted → active
foreground; active indicator = `bg-card shadow-[var(--tab-pill)]` sliding via shared layout animation.
Optional count bubble (`bg-primary-soft` active / `bg-border/70` idle). On phones tabs must never scroll
sideways: switch to icon tiles or a grid ("ResponsiveTabs").

### 10.9 Expanding status pill
Rests as a 32px round icon (e.g. a progress ring with a lightning glyph). Hover (desktop) or tap (phone)
slides it open sideways to reveal the text ("7 of 10 daily actions left") in 340 ms, closes on leave /
outside tap.

### 10.10 Small pieces
- **SectionLabel**: 11px semibold uppercase `tracking-[0.08em]` muted.
- **EmptyState**: centred, `surface size-12 rounded-2xl` icon tile in blue, 15px title, 13px muted line, one action.
- **Row** (settings): label 14px medium + 12.5px muted description left, controls right; wraps on phone; rows separated by hairlines.
- **Avatar**: round, initials on a soft tint chosen from the name (primary/success/warning/info/destructive/muted soft), 1px inner hairline.
- **Kbd**: `h-5 min-w-5 rounded-md px-1 text-[11px]`.
- **Meter**: `well h-1.5 rounded-full`, fill `bg-primary-gradient` (or success/warning), animates width 900 ms.
- **StackedBar**: `well h-2 rounded-full gap-[2px]`, segments in chart colours, staggered 60 ms.
- **ConfidenceRing**: 38px ring, 3.5px stroke, track `stroke-border`, value stroke green ≥ 90, blue ≥ 80, amber below; value 13.5px semibold next to it.
- **Badge counts on icons**: `h-4 min-w-4 rounded-full bg-destructive text-[9.5px] font-semibold` with a 2px ring in the surface colour.
- **Edge fade (lens blur)**: scroll areas under floating bars get a progressive blur at the edge —
  5 stacked `backdrop-filter: blur(1/2/4/8/14px)` layers each masked to a shorter band toward the edge,
  plus a gradient from the canvas colour (92 % → 55 % → 0). See `EdgeFade.tsx`.

---

## 11. App shell and layout

```text
┌──────────────────────── royal-blue band (h-14 / 56px) ────────────────────────┐
│ ☰  Logo        [ glass search  "Search or ask the Assistant…"  ⌘ K ]   ☀ ? 🔔 Company ▾ │
├──────────┬────────────────────────────────────────────────────────────────────┤
│ Sidebar  │  rounded-top content sheet (bg-background, rounded-t-[20px])        │
│ 244px    │    Page header (title + actions)                                     │
│ ↔ 68px   │    Panels / tables / charts                                          │
└──────────┴────────────────────────────────────────────────────────────────────┘
Phone (< 768px): compact band on top, bottom tab bar (5 tabs, last = "More" sheet)
```

**Top band** (every screen except the marketing home page)
- Outer page background = band colour; the content area is a sheet with rounded top corners and a 1px
  white-8 % top highlight, so the band appears to wrap the app.
- Left: sidebar toggle (`size-8 rounded-lg text-band-muted hover:bg-band-foreground/10`), logo.
- Centre: search/command field `glass-band h-9 max-w-[520px] rounded-xl px-3 text-[13.5px]
  text-band-muted` with magnifier and `⌘` `K` keycaps (`bg-band-foreground/10`). Opens the command palette.
- Right: theme toggle (sun/moon), help, notifications (popover `w-[min(380px,100vw-16px)]`), account chip
  showing the **company/workspace name only** (avatar + name + caret).
- Icon buttons in the band: `size-9 rounded-xl text-band-muted hover:bg-band-foreground/10 hover:text-band-foreground`.

**Sidebar** (desktop)
- 244px open, 68px rail. Background `bg-sidebar` (= canvas), right hairline.
- Groups with 10.5px uppercase labels (fade out in rail mode).
- Item: `h-9 rounded-xl text-[13.5px] font-medium`; icon in a fixed 44px slot (never moves on collapse);
  idle `text-sidebar-foreground/75 hover:bg-card/70`; active = a white `bg-card shadow-engraved` pill that
  slides between items (shared layout animation), icon turns `text-primary`.
- Count badges: `rounded-full bg-primary-soft px-1.5 text-[11px] font-semibold text-accent-foreground`.
- Footer block: usage meter (label + `used / limit` tabular + Meter) and an upgrade link.

**Focus mode** — immersive screens (an open conversation, a record's detail, the AI assistant) hide the
desktop sidebar (hovering the left edge peeks it back as a floating panel with a soft shadow) and slide
the phone bottom bar away. One shell-level switch, not per-page hacks.

**Page content**: max width `max-w-6xl`/`7xl`, padding `px-4 md:px-6`, vertical rhythm `space-y-4`–`6`.
Full-height pages: `h-[calc(100dvh-56px-var(--mnav))]` on phone (`--mnav` = bottom bar height, 0 when
hidden), `md:h-[calc(100dvh-3.5rem)]` desktop.

**Page header**: title 22–26px `font-display`, one muted line under it, actions on the right (one
`default` CTA + `outline` secondaries); on phone actions wrap under the title.

**Command palette** (⌘K / Ctrl+K): centred `rounded-3xl` dialog, big search input, grouped results with
icons, keyboard hints; typing a question offers "Ask the Assistant" which opens a new chat with it.

**Right-click**: a custom app context menu (same style as dropdown menus) replaces the browser menu on app
pages: text actions (cut/copy/paste/select all, "Ask the assistant about this"), page-specific actions,
back/forward/reload, theme, copy link.

**Public (signed-out) pages** (legal, about, etc.) use the same blue band + rounded sheet, logo → home,
a centred page switcher listing only public pages, theme toggle, "Sign in" (or account chip if signed in).

**Marketing home page** (no band): one constant soft background (`bg-aurora` / porcelain), glass nav,
large display hero animated with CSS (`hero-rise`, `word-up`) so it plays before hydration, vertical scroll
reveals only (no carousels), sections of engraved cards, light FAQ accordion, calm footer.

---

## 12. Page patterns

- **Dashboard**: KPI strip of 4 compact cards (label 12px muted, value 22–26px semibold tabular, delta pill
  green/red, tiny sparkline), then 2-column grid of Panels with charts and short ranked lists. No dead
  space: columns stretch evenly, panels align.
- **Tables / databases**: inside a `surface`; header row `bg-muted/50 text-[11–12px] font-semibold
  uppercase muted`; rows `py-2.5–3` with hairline dividers, hover `bg-muted/40`; numbers `tabular`;
  status as Pill with dot; scores as Meter. Show only scan-friendly columns; everything else in a detail
  panel. Row checkboxes: selecting rows **replaces the header row** with a bulk-action bar (count +
  actions like Assign, Change, Pause, Delete).
- **Detail side panel**: slides in from the right (floating `rounded-3xl` sheet), calm and mostly
  monochrome: header (avatar, name, company, status pill, close), sections with SectionLabels, key–value
  rows (label muted left, value right), timeline of activity, actions pinned at the bottom. Phone: bottom sheet.
- **Lists with actions**: row is a `<div className="group">` with a main button and a sibling `⋯`
  dropdown that appears on hover (always visible on touch).
- **Inbox / two-pane**: list left (avatar, name, one-line preview, time, status dot), conversation right;
  nothing selected by default — show an EmptyState asking to pick one. Phone: list first, tap opens full screen.
- **Settings**: Panels containing Rows; save via sticky bottom bar or per-row controls; toasts confirm.
- **Onboarding / setup**: centred card (`surface rounded-3xl`, max-w ~560px) with a step indicator
  (thin segmented progress), title, short helper line, fields, footer with **Back** (ghost, left) and
  **Continue** (`default`, right). Optional steps have "Skip". Progress through steps with rise-into-focus.
- **Auth**: same centred card on porcelain, logo above, social buttons `outline` full width, divider "or",
  inputs, `default` CTA full width, tiny legal line under.
- **Empty / loading / error**: EmptyState; skeletons `bg-muted animate-pulse rounded-lg` or loading dots +
  `shimmer-text`; error pages = centred title, one muted line, "Try again" (`default`) + "Go home" (`outline`).

---

## 13. AI assistant / chat interface

Layout: optional history column (260px, `bg-card/50`, right hairline) + conversation column
(`max-w-[46rem]` centred). The page is a focus-mode screen.

- **Floating top row** over the conversation: history toggle left, conversation title centred (13px
  medium muted, truncates), status pill right. Under it an **edge fade** (progressive lens blur from the top,
  ~80–96px) so messages blur out as they scroll beneath.
- **Composer**: floating `glass-solid rounded-[22px] p-2`, no panel behind it; `+` menu (attach/context) on
  the left, auto-growing textarea, mic and round send button (`bg-primary-gradient`, disabled = muted).
  Above it an **edge fade from the bottom** (~128–160px). Hint under it: "Press ⌘K anywhere to summon …" 11.5px muted.
- **Empty chat**: only a centred greeting with the AI mark ("Hey Yash, what's on your mind?") that changes
  per day/new chat. No suggestion chips, no boxed prompts.
- **User message**: right-aligned bubble `bg-ink text-ink-foreground rounded-[20px] rounded-br-md px-4
  py-2.5 text-[14px] max-w-[86%]`; attachments as file cards above it.
- **AI message (reply)**: no bubble. Header row: 26px round `bg-primary-gradient` mark with a white glyph,
  name 13px semibold, time 11.5px muted. Body = rich Markdown at 14.5px/1.7: bold, italics, headings
  (17–19px), lists with muted markers, blockquotes (blue left rule on `bg-primary-soft/40`), inline code
  (`bg-muted rounded-md`), code blocks in a `surface` with header + copy, tables in a `surface` with muted
  header row and copy-as-CSV, task lists with custom checkboxes, Mermaid diagrams in a card.
- **Writing effect**: while the AI writes, text streams **word by word**; each new word comes into focus
  through a lens — opacity 0→1 and `blur(7px)→0` over 560 ms (only on live replies, never on
  proactive messages or user text). Unclosed `**`/`` ` `` are auto-closed during streaming so raw symbols
  never flash.
- **Thinking**: AI mark + three soft dots + "… is thinking" in `shimmer-text`.
- **Copy bar**: under each message, appears on hover (always on touch): "Copy" + caret menu (plain text /
  Markdown / with formatting).
- **Proactive message** (AI reached out on its own): header row "Name · reached out · 9:12 AM"; body in a
  `rounded-[22px] bg-card shadow-engraved` card with a soft tone wash at the top, a 32px duotone
  lightning tile (with a small blue "new" dot) + eyebrow "HEADS-UP" in blue + muted subline "… spotted
  something worth acting on", then the Markdown text. Warning variant uses amber. Any action card sits
  **below** this card, never nested inside.
- **Notification row**: centred pill `rounded-full bg-card shadow-engraved` with a round bell tile, bold
  label, muted one-line text, time.
- **Interactive cards** (approvals, questions, choices) — one fixed template filled by data, never custom
  markup from the AI:
  - Shell `rounded-[22px] bg-card shadow-engraved ring-1 ring-{tone}/15`, top tone wash.
  - Header: 40px duotone icon tile in the tone's soft colour; eyebrow (10.5px uppercase tone colour);
    status chip right (*Waiting for you* amber pulsing dot → *Working* blue spinner → *Done* green →
    *Skipped* grey); title 15px `font-display` semibold; short muted description.
  - Optional stat tiles (`well rounded-xl`, label 11px muted, value 17px semibold tabular, ↗/↘ trend).
  - Optional draft preview: label "DRAFT", `rounded-2xl bg-muted/45` box with From/To/Subject rows and a
    blue left rule, then the body.
  - Optional steps "WHAT … WILL DO": vertical timeline, 23px numbered dots joined by a hairline; while
    working, steps tick to green checks one by one and the line fills green.
  - Optional fields: text, textarea, email, number, date, time, select, chips, multi-chips, choice tiles,
    toggle row, slider — in a 2-column grid (wide types span both).
  - Footer `border-t bg-muted/30`: shield icon + reassurance line ("Nothing is sent until you approve")
    left; up to 3 buttons right (ghost, secondary, primary/danger — main button rightmost). Phone: buttons
    stack full width, main on top. Danger actions need a second tap ("Tap again to confirm").
  - Working: a 2px indeterminate line slides along the top edge. Done: footer becomes a green result line
    with time; fields collapse into a summary grid. Skipped: body collapses, card dims.
- **Files**: file cards (icon tile by type, name, size, origin) open a preview dialog (PDF, CSV table,
  text/Markdown, JSON, diagram, image) with download.

---

## 14. Data visualisation

- `recharts`; colours `var(--chart-1…5)` in order (blue family first, then green, amber).
- Prefer: area/line with soft gradient fill (primary at 25 % → 0), rounded bars (radius 6), stacked bars,
  rings, meters, sparklines. Pie/donut only with ≤ 5 slices and a thick ring.
- Gridlines very light (`var(--border)`, horizontal only, dashed or solid hairline), no axis lines, axis
  text 11px muted, no chart borders, no 3D, no glow.
- Tooltip: small card `rounded-xl bg-popover shadow-float px-3 py-2`, label 11px muted, values 12.5px
  tabular with colour dots.
- Legends: inline Pills or small dots + 12px labels above the chart.
- Every number gets `tabular`; deltas as green/red Pills with ↗/↘.

---

## 15. Theme switch (light/dark)

- One icon button (sun = light on, moon = dark on) in the header and on the marketing nav. One click, no
  menu. Icons rotate + de-blur into each other (480 ms).
- First visit follows the OS setting; a click saves the choice (localStorage). An inline script in `<head>`
  sets `.dark` on `<html>` **before first paint** (no flash).
- Animation: View Transitions API; the new theme **pours down the screen as a living water wave** —
  the boundary is a clip-path polygon built from three sine waves with different wavelengths drifting at
  different speeds, so crests/troughs are uneven and keep changing; amplitude swells mid-screen; 1150 ms.
  Fallback: 360 ms colour cross-fade. Reduced motion: instant. Reference: `lib/theme.ts`.

---

## 16. Phone layout (≤ 767px) — its own design

Breakpoint Tailwind `md` (768px). Not a squeezed desktop.

- Compact blue band (menu button `size-9 rounded-xl bg-band-foreground/10`, logo mark, short search
  "Search or ask…", bell, avatar).
- **Bottom tab bar**: `fixed bottom-0 bg-card/95 backdrop-blur-xl border-t`, height 64px + safe area,
  5 tabs (icons 22px + 10.5px labels); active tab has a `h-8 w-14 rounded-full bg-primary-soft` pill
  behind the icon that slides between tabs; last tab "More" opens a bottom sheet grid of the other modules.
  The bar slides away in focus mode.
- Lists become cards; details open as bottom sheets; tables become stacked cards with the key fields.
- Two-pane screens become list → full-screen detail with a back button.
- Hit areas ≥ 44px (`min-h-11`, `size-10/11`). Hover-revealed things are always visible on touch
  (`[@media(hover:none)]:opacity-100`).
- Only chip rows may scroll sideways (`-mx-4 px-4 overflow-x-auto`). Nothing else.
- Respect `env(safe-area-inset-*)`. Dialog widths `max-w-[min(420px,calc(100vw-24px))]`.

---

## 17. Copy and tone

- Short, plain, friendly, confident. One idea per line. Sentence case everywhere (no Title Case Buttons).
- Buttons are verbs: "Send nudge", "Book it", "Keep running", "Not now".
- Prefer a number or a pill over a sentence ("7 opens" not "This lead has opened your email seven times").
- Reassure on risky actions: "Nothing happens until you choose". Confirm destructive actions plainly:
  "Delete this conversation? … This can't be undone." → "Keep it" / "Delete".
- Empty states say what to do next in one line.

---

## 18. Accessibility

- Contrast: tokens already pass; don't put muted text on muted backgrounds.
- Every icon-only button has `aria-label`. Chips/tiles use `role="radio"`/`"checkbox"` with `aria-checked`.
- Focus visible: `focus-visible:ring-3 ring-ring/25` (buttons) or the input focus shadow.
- Dialogs trap focus (Radix). Esc closes popups. Keyboard shortcuts shown with `Kbd`.
- Respect reduced motion. Never rely on hover alone.

---

## 19. QA checklist before shipping

- [ ] Light **and** dark theme look right; nothing invisible, no hand-made dark blocks, no glow.
- [ ] 394px phone and 1280px desktop: no overlap, no sideways scroll, no visible scrollbars.
- [ ] Only semantic colour classes; only Satoshi + General Sans; only Phosphor icons.
- [ ] Cards use `surface`/`well`/`glass-solid`; floating things are glass with nothing solid behind.
- [ ] Popups use `pop-motion` / `modal-motion` / `veil-motion`; dropdowns match trigger width.
- [ ] Content visible on first paint; animations ≤ 400ms (except theme wave); ease-out; no bounce.
- [ ] Touch targets ≥ 44px; hover affordances visible on touch.
- [ ] Data shown as pills, meters, bars, charts, tidy tables.
- [ ] One main CTA per area; destructive actions confirmed; toasts for feedback.
- [ ] Copy short and plain; sentence case.

---

## 20. Appendix A — full theme stylesheet

The complete file is `poach-theme.css` in this kit (identical to the Poach production stylesheet).
Copy it verbatim as your global CSS. It contains: Tailwind v4 imports, `@theme inline` token mapping,
`:root` light tokens, `.dark` tokens, base layer (hidden scrollbars, body type, headings, selection),
surface utilities (`surface`, `surface-soft`, `engraved`, `well`, `glass`, `glass-band`, `glass-solid`,
`bg-band`, `bg-aurora`, `bg-ink-gradient`, `bg-primary-gradient`, `hairline-x`, `tabular`, `dotted-grid`,
`text-balance-safe`), motion (`rise`, `shimmer`, `breathe`, `shimmer-text`, `hero-rise`, `word-up`,
`reveal-in`, `pop-motion`, `modal-motion`, `veil-motion`), theme-switch helpers, reduced-motion rule,
toast skin, AI card progress line and the AI word-reveal animation.

Key token values (light → dark) for quick reference:

| Token | Light | Dark |
|---|---|---|
| `--background` | `oklch(0.975 0.004 260)` | `oklch(0.165 0.012 265)` |
| `--foreground` | `oklch(0.23 0.018 265)` | `oklch(0.95 0.005 260)` |
| `--card` | `oklch(1 0 0)` | `oklch(0.205 0.014 265)` |
| `--primary` | `oklch(0.49 0.17 262)` | `oklch(0.64 0.15 262)` |
| `--primary-soft` | `oklch(0.95 0.028 262)` | `oklch(0.29 0.06 263)` |
| `--muted` | `oklch(0.962 0.005 260)` | `oklch(0.245 0.014 265)` |
| `--muted-foreground` | `oklch(0.53 0.018 262)` | `oklch(0.7 0.016 262)` |
| `--ink` | `oklch(0.27 0.012 265)` | `oklch(0.93 0.006 260)` |
| `--band` / `--band-2` | `oklch(0.4 0.15 263)` / `oklch(0.45 0.16 261)` | `oklch(0.3 0.11 264)` / `oklch(0.345 0.12 262)` |
| `--success` | `oklch(0.6 0.12 158)` | `oklch(0.72 0.13 158)` |
| `--warning` | `oklch(0.74 0.14 72)` | `oklch(0.8 0.13 78)` |
| `--destructive` | `oklch(0.6 0.19 25)` | `oklch(0.68 0.17 25)` |
| `--border` | `oklch(0.915 0.006 260)` | `oklch(1 0 0 / 0.085)` |
| `--radius` | `0.75rem` | same |

---

## 21. Appendix B — prompt to give a new agent

> Build the UI for **[your product]** using the attached **Poach UI Kit** (`POACH-UI-KIT.md`,
> `poach-theme.css`, `reference-components/`). The content, pages and features are mine (described
> below), but the interface must look exactly like Poach: same colours and tokens, Satoshi + General Sans,
> Phosphor icons (duotone in tiles), engraved white cards on a porcelain canvas, the royal-blue top band on
> every screen except the home page, liquid-glass floating elements, rise-into-focus motion, hidden
> scrollbars, a dedicated phone layout with a bottom tab bar, and light + dark themes with the water-wave
> switch. Use `poach-theme.css` verbatim and the reference components as-is. Never use hardcoded colours,
> other fonts, other icon packs, neon glows or purple gradients. Before finishing, run the QA checklist in
> §19 in both themes at 394px and 1280px.
>
> My product: …
