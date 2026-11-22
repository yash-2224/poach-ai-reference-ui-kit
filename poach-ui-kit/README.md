# Poach UI Kit

A portable copy of the Poach AI interface style, for building **other** products that should look exactly
like Poach.

| File | What it is |
|---|---|
| `POACH-UI-KIT.md` | The full design reference: rules, colours, fonts, icons, surfaces, every component, motion, shell, page patterns, AI chat, charts, theme switch, phone layout, tone, QA checklist and a ready-made prompt. **Give this to any agent first.** |
| `poach-theme.css` | Drop-in Tailwind CSS v4 stylesheet with every token (light + dark), utility and animation. Use verbatim. |
| `reference-components/ui` | Restyled shadcn/Radix primitives (button, inputs, select, dropdown, popover, dialogs, sheet, tooltip, toast, checkbox, switch, slider, tabs). |
| `reference-components/kit` | Poach pieces: Pill, Panel/Reveal/Avatar/Meter/StackedBar/ConfidenceRing/EmptyState/Row, Segmented, ResponsiveTabs, ExpandPill, EdgeFade (lens blur), ChartTip, Sparkline, ThemeToggle. |
| `reference-components/ai` | AI chat pieces: Markdown renderer with word-by-word reveal, interactive approval/question card. |
| `reference-components/hooks` | `useIsMobile()` — the phone/desktop switch (≤ 767 px) the responsive components read. |
| `reference-components/lib` | `cn()` helper, theme switch with the water-wave animation, the AI card schema. |

## How to use it with another agent

1. Upload `POACH-UI-KIT.md` (and, if the agent accepts more files, `poach-theme.css` and `reference-components/`).
2. Paste the prompt from **Appendix B** at the end of `POACH-UI-KIT.md` and describe your product under it.

Notes
- Components import with the `@/` alias (pointing at your `src/`). Put the folders here: `ui/` → `src/components/ui`,
  `kit/` → `src/components/kit`, `ai/` → `src/components/ai` (or `ava`), `lib/` → `src/lib`, `hooks/` → `src/hooks` —
  or adjust the imports.
- Add the pre-paint theme script (the exact one Poach uses) as the first thing in your document `<head>`, so the
  right theme shows before the first paint and there is no light flash:
  `<script>(function(){try{var s=localStorage.getItem("poach.theme");var d=s?s==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;var r=document.documentElement;r.classList.toggle("dark",d);r.style.colorScheme=d?"dark":"light";}catch(e){}})();</script>`
  Rename the `poach.theme` key to your own app name if you like — change it in `lib/theme.ts` too.
- `poach-theme.css` contains `@source "../src";` — change that path so it points from wherever you put the
  stylesheet to your own source folder (Tailwind v4 scans it for class names). Keep all `@import` lines at the top.
- Fonts: load Satoshi and General Sans with a `<link>` tag in your `<head>` (not a CSS `@import`):
  `https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&f[]=general-sans@400,500,600&display=swap`
- Packages the reference components expect: `@radix-ui/*` (per component), `class-variance-authority`, `clsx`,
  `tailwind-merge`, `motion`, `@phosphor-icons/react`, `lucide-react` (a few primitives use its small check/chevron icons), `sonner`, `react-markdown`, `remark-gfm`, `tw-animate-css`.
- This folder is reference material; the Poach app itself does not import from it. If Poach's design changes,
  refresh this kit from `DESIGN.md`, `src/styles.css` and the components.
