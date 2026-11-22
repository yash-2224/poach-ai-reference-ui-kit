/**
 * Light / dark theme (client only).
 *
 * - First visit follows the computer's system setting (prefers-color-scheme)
 *   and keeps following it until the user picks a theme with the toggle.
 * - The choice is remembered in localStorage.
 * - The `.dark` class lives on <html>; a tiny inline script in __root sets it
 *   before first paint so there is never a flash of the wrong theme.
 * - Switching pours the new theme down the screen as a moving water wave
 *   (View Transitions API), falling back to a soft colour cross-fade where
 *   that API is missing.
 */
import { useSyncExternalStore } from "react";

export type Theme = "light" | "dark";
export const THEME_KEY = "poach.theme";

/** Inline, pre-paint script (stringified into <head>). Keep it dependency-free. */
export const THEME_INIT_SCRIPT = `(function(){try{var s=localStorage.getItem("${THEME_KEY}");var d=s?s==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;var r=document.documentElement;r.classList.toggle("dark",d);r.style.colorScheme=d?"dark":"light";}catch(e){}})();`;

const listeners = new Set<() => void>();
let watching = false;

function read(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function apply(t: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", t === "dark");
  root.style.colorScheme = t;
  listeners.forEach((l) => l());
}

function watchSystem() {
  if (watching || typeof window === "undefined") return;
  watching = true;
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", (e) => {
    try {
      if (localStorage.getItem(THEME_KEY)) return; // user picked one — respect it
    } catch {
      /* ignore */
    }
    switchTheme(e.matches ? "dark" : "light");
  });
}

function subscribe(cb: () => void) {
  watchSystem();
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, read, () => "light");
}

/** Change theme with the wave animation. `origin` is kept for callers but the wave always flows top → bottom. */
export function switchTheme(next: Theme, origin?: { x: number; y: number }) {
  if (typeof document === "undefined" || read() === next) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const doc = document as Document & {
    startViewTransition?: (cb: () => void) => { ready: Promise<void> };
  };

  if (!doc.startViewTransition || reduce) {
    const root = document.documentElement;
    root.classList.add("theme-fade");
    apply(next);
    window.setTimeout(() => root.classList.remove("theme-fade"), 420);
    return;
  }

  void origin;
  const w = window.innerWidth;
  const h = window.innerHeight;
  const frames = waveKeyframes(w, h);
  const vt = doc.startViewTransition(() => apply(next));
  vt.ready
    .then(() => {
      document.documentElement.animate(frames, {
        duration: 1150,
        easing: "linear", // easing is baked into the keyframes so the wave keeps moving evenly
        pseudoElement: "::view-transition-new(root)",
      });
    })
    .catch(() => {
      /* transition skipped — theme is still applied */
    });
}

/**
 * Keyframes for the theme "water wave": the new theme pours down from the top
 * edge to the bottom. The front is a live wave — three sine layers with
 * different wavelengths drift sideways at different speeds, so crests and
 * troughs are uneven (taller in some places, shallower in others) and keep
 * changing as it falls. Amplitude swells mid-screen and calms at the ends.
 */
function waveKeyframes(w: number, h: number): Keyframe[] {
  const FRAMES = 56;
  const POINTS = 72;
  const amp0 = Math.min(64, Math.max(26, h * 0.05));
  const p1 = Math.random() * Math.PI * 2;
  const p2 = Math.random() * Math.PI * 2;
  const p3 = Math.random() * Math.PI * 2;
  const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const out: Keyframe[] = [];
  for (let f = 0; f <= FRAMES; f++) {
    const t = f / FRAMES;
    const base = -amp0 * 2.6 + ease(t) * (h + amp0 * 5.2);
    const amp = amp0 * (0.5 + 0.65 * Math.sin(Math.PI * t));
    const pts: string[] = [`0px 0px`, `${w}px 0px`];
    for (let i = POINTS; i >= 0; i--) {
      const x = (w * i) / POINTS;
      const u = x / w;
      // Uneven envelope: some stretches of the wave run higher than others.
      const env = 0.75 + 0.35 * Math.sin(u * Math.PI * 1.3 + p3 + t * 2.2);
      const y =
        base +
        amp *
          env *
          (0.58 * Math.sin(u * Math.PI * 2 * 1.6 + p1 + t * 9) +
            0.28 * Math.sin(u * Math.PI * 2 * 3.7 - t * 15 + p2) +
            0.14 * Math.sin(u * Math.PI * 2 * 7.3 + t * 24 + p3));
      pts.push(`${x.toFixed(1)}px ${y.toFixed(1)}px`);
    }
    out.push({ clipPath: `polygon(${pts.join(",")})` });
  }
  return out;
}

export function toggleTheme(origin?: { x: number; y: number }) {
  const next: Theme = read() === "dark" ? "light" : "dark";
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch {
    /* private mode */
  }
  switchTheme(next, origin);
}
