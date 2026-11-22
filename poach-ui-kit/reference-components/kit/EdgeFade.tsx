import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

/**
 * Progressive "lens" blur at the edge of a scroll area: content scrolling under
 * it gets blurrier and fades into the page colour towards the edge.
 * Stack of backdrop-blur layers, each masked to a shorter band (stronger blur
 * closest to the edge), plus a soft colour fade. Purely decorative.
 */
const LAYERS = [
  { blur: 1, reach: 100 },
  { blur: 2, reach: 78 },
  { blur: 4, reach: 56 },
  { blur: 8, reach: 36 },
  { blur: 14, reach: 18 },
];

export function EdgeFade({ side, className }: { side: "top" | "bottom"; className?: string }) {
  const dir = side === "top" ? "to bottom" : "to top";
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-x-0", side === "top" ? "top-0" : "bottom-0", className)}
    >
      {LAYERS.map((l) => {
        const mask = `linear-gradient(${dir}, black 0%, black ${l.reach * 0.35}%, transparent ${l.reach}%)`;
        const style: CSSProperties = {
          backdropFilter: `blur(${l.blur}px)`,
          WebkitBackdropFilter: `blur(${l.blur}px)`,
          maskImage: mask,
          WebkitMaskImage: mask,
        };
        return <div key={l.blur} className="absolute inset-0" style={style} />;
      })}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(${dir}, color-mix(in oklab, var(--color-background) 92%, transparent) 0%, color-mix(in oklab, var(--color-background) 55%, transparent) 45%, transparent 100%)`,
        }}
      />
    </div>
  );
}
