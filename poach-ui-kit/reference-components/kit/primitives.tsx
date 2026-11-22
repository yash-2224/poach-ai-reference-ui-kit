import { motion } from "motion/react";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ---------- Panel: the engraved white surface ---------- */
export function Panel({
  title,
  description,
  actions,
  children,
  className,
  bodyClassName,
}: {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={cn("surface overflow-hidden", className)}>
      {(title || actions) && (
        <header className="flex flex-col gap-3 px-4 pt-4 pb-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4 sm:px-5">
          <div className="min-w-0">
            {title && <h3 className="text-[14.5px] font-semibold text-foreground">{title}</h3>}
            {description && <p className="mt-0.5 text-[13px] text-muted-foreground">{description}</p>}
          </div>
          {actions && <div className="flex min-w-0 shrink-0 items-center gap-2 overflow-x-auto">{actions}</div>}
        </header>
      )}
      <div className={cn("px-4 pb-4 sm:px-5 sm:pb-5", !title && !actions && "pt-4 sm:pt-5", bodyClassName)}>{children}</div>
    </section>
  );
}

/* ---------- Reveal: soft rise + blur-in ----------
 * Pure CSS (`reveal-in` in styles.css) so sections are visible straight from the
 * server-rendered HTML — nothing stays hidden while the page is still loading.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  style,
  ...rest
}: { children: ReactNode; delay?: number; className?: string } & HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("reveal-in", className)}
      style={{ animationDelay: `${Math.min(delay, 0.25) * 300}ms`, ...style }}
      {...rest}
    >
      {children}
    </div>
  );
}

/* ---------- Avatar with soft hashed tint ---------- */
const TINTS = [
  "bg-primary-soft text-accent-foreground",
  "bg-success-soft text-success-foreground",
  "bg-warning-soft text-warning-foreground",
  "bg-info-soft text-info",
  "bg-destructive-soft text-destructive",
  "bg-muted text-secondary-foreground",
];
export function Avatar({
  name,
  src,
  size = 36,
  className,
}: {
  name: string;
  src?: string | null;
  size?: number;
  className?: string;
}) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const tint = TINTS[[...name].reduce((a, c) => a + c.charCodeAt(0), 0) % TINTS.length];
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center overflow-hidden rounded-full font-semibold shadow-[inset_0_0_0_1px_oklch(0.23_0.02_265/0.06)]",
        !src && tint,
        className,
      )}
      style={{ width: size, height: size, fontSize: Math.max(10, size * 0.36) }}
    >
      {src ? <img src={src} alt={name} className="size-full object-cover" /> : initials}
    </span>
  );
}

/* ---------- Confidence ring ---------- */
export function ConfidenceRing({
  value,
  size = 38,
  label,
  stroke = 3.5,
}: {
  value: number;
  size?: number;
  label?: string;
  stroke?: number;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const tone = value >= 90 ? "text-success" : value >= 80 ? "text-primary" : "text-warning";
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} className="fill-none stroke-border" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          strokeLinecap="round"
          className={cn("fill-none stroke-current", tone)}
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - (c * value) / 100 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <span className="leading-tight">
        <span className="tabular block text-[13.5px] font-semibold text-foreground">{value}%</span>
        {label && <span className={cn("block text-[11.5px] font-medium", tone)}>{label}</span>}
      </span>
    </span>
  );
}

/* ---------- Bars ---------- */
export function Meter({
  value,
  max = 100,
  className,
  tone = "primary",
}: {
  value: number;
  max?: number;
  className?: string;
  tone?: "primary" | "success" | "warning" | "band";
}) {
  const pct = Math.min(100, (value / max) * 100);
  const color = {
    primary: "bg-primary-gradient",
    success: "bg-success",
    warning: "bg-warning",
    band: "bg-band-foreground",
  }[tone];
  return (
    <div className={cn("well h-1.5 w-full overflow-hidden rounded-full", className)}>
      <motion.div
        className={cn("h-full rounded-full", color)}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}

export function StackedBar({
  segments,
  className,
}: {
  segments: { value: number; className: string; label?: string }[];
  className?: string;
}) {
  const total = segments.reduce((a, s) => a + s.value, 0) || 1;
  return (
    <div className={cn("well flex h-2 w-full gap-[2px] overflow-hidden rounded-full p-0", className)}>
      {segments.map((s, i) => (
        <motion.div
          key={i}
          title={s.label}
          className={cn("h-full first:rounded-l-full last:rounded-r-full", s.className)}
          initial={{ width: 0 }}
          animate={{ width: `${(s.value / total) * 100}%` }}
          transition={{ duration: 0.9, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}
    </div>
  );
}

/* ---------- Misc ---------- */
export function Kbd({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <kbd
      className={cn(
        "inline-grid h-5 min-w-5 place-items-center rounded-md px-1 font-sans text-[11px] font-medium",
        className,
      )}
    >
      {children}
    </kbd>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <span className="surface grid size-12 place-items-center rounded-2xl text-primary [&_svg]:size-6">
        {icon}
      </span>
      <h4 className="mt-4 text-[15px] font-semibold">{title}</h4>
      {description && <p className="mt-1 max-w-sm text-[13px] text-muted-foreground">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function SectionLabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase", className)}>
      {children}
    </p>
  );
}

export function Row({
  label,
  description,
  children,
  className,
}: {
  label: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-4", className)}>
      <div className="min-w-[min(100%,12rem)] flex-1">
        <p className="text-[14px] font-medium text-foreground">{label}</p>
        {description && <p className="mt-0.5 text-[12.5px] text-muted-foreground">{description}</p>}
      </div>
      <div className="flex w-full max-w-full shrink-0 items-center justify-end gap-2 sm:ml-auto sm:w-auto">{children}</div>
    </div>
  );
}
