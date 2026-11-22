import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * A status chip that rests as a single round icon and slides open to show its
 * text — on hover with a mouse, on tap with a finger (auto-closes after a few
 * seconds), and on keyboard focus.
 */
export function ExpandPill({
  icon,
  children,
  label,
  className,
}: {
  icon: ReactNode;
  children: ReactNode;
  /** Accessible name, read even while collapsed. */
  label: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const pointer = useRef<string>("mouse");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const clear = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };

  return (
    <button
      type="button"
      aria-label={label}
      aria-expanded={open}
      onPointerDown={(e) => {
        pointer.current = e.pointerType;
      }}
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") setOpen(true);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === "mouse") setOpen(false);
      }}
      onClick={() => {
        if (pointer.current === "mouse") return; // hover already handles mouse users
        clear();
        setOpen((o) => {
          if (!o) timer.current = setTimeout(() => setOpen(false), 3200);
          return !o;
        });
      }}
      onFocus={(e) => {
        if (e.currentTarget.matches(":focus-visible")) setOpen(true);
      }}
      onBlur={() => {
        clear();
        setOpen(false);
      }}
      className={cn(
        "inline-flex h-8 shrink-0 cursor-pointer items-center rounded-full bg-card px-[5px] text-[13px] font-medium text-foreground shadow-engraved outline-none transition-[background-color,box-shadow] duration-200 hover:bg-card focus-visible:ring-3 focus-visible:ring-ring/25",
        className,
      )}
    >
      <span className="grid size-[22px] shrink-0 place-items-center">{icon}</span>
      <span
        className="grid transition-[grid-template-columns] duration-[340ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ gridTemplateColumns: open ? "1fr" : "0fr" }}
      >
        <span className="overflow-hidden">
          <span
            className={cn(
              "block whitespace-nowrap pr-2 pl-1.5 transition-[opacity,filter,transform] duration-[340ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
              open ? "translate-x-0 opacity-100 [filter:blur(0)]" : "-translate-x-1 opacity-0 [filter:blur(3px)]",
            )}
          >
            {children}
          </span>
        </span>
      </span>
    </button>
  );
}

/** Thin progress ring wrapped around an icon — shows "how much is left" while the pill is closed. */
export function RingIcon({ value, max, children }: { value: number; max: number; children: ReactNode }) {
  const r = 9.5;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, value / max));
  return (
    <span className="relative grid size-[22px] place-items-center">
      <svg viewBox="0 0 22 22" className="absolute inset-0 size-full -rotate-90" aria-hidden>
        <circle cx="11" cy="11" r={r} fill="none" strokeWidth="1.6" className="stroke-border" />
        <circle
          cx="11"
          cy="11"
          r={r}
          fill="none"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          className="stroke-primary transition-[stroke-dashoffset] duration-500"
        />
      </svg>
      {children}
    </span>
  );
}
