import { motion } from "motion/react";
import { useId, type ReactNode } from "react";
import { Segmented } from "./Segmented";
import { cn } from "@/lib/utils";

export interface ResponsiveTab<T extends string> {
  value: T;
  label: string;
  /** Shorter label for the phone tile grid. */
  short?: string;
  icon: ReactNode;
}

/**
 * Tabs that are always fully visible: an engraved segmented control on wider
 * containers, an evenly divided icon-tile row when space is tight (no sideways scrolling).
 */
export function ResponsiveTabs<T extends string>({
  value,
  onChange,
  options,
  size = "md",
  className,
}: {
  value: T;
  onChange: (v: T) => void;
  options: ResponsiveTab<T>[];
  size?: "sm" | "md";
  className?: string;
}) {
  const id = useId();
  return (
    <div className={cn("@container min-w-0", className)}>
      <div
        role="tablist"
        className="well relative grid gap-0.5 rounded-2xl p-1 @2xl:hidden"
        style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
      >
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={o.value}
              role="tab"
              aria-selected={active}
              onClick={() => onChange(o.value)}
              className={cn(
                "relative z-0 flex min-h-14 min-w-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl px-1 text-[11px] leading-tight font-medium transition-colors [&_svg]:size-[18px]",
                active ? "text-foreground [&_svg]:text-primary" : "text-muted-foreground",
              )}
            >
              {active && (
                <motion.span
                  layoutId={`rtab-${id}`}
                  className="absolute inset-0 -z-10 rounded-xl bg-card shadow-[var(--tab-pill)]"
                  transition={{ type: "spring", stiffness: 520, damping: 38 }}
                />
              )}
              {o.icon}
              <span className="w-full truncate text-center">{o.short ?? o.label}</span>
            </button>
          );
        })}
      </div>
      <div className="hidden justify-center @2xl:flex">
        <Segmented value={value} onChange={onChange} size={size} options={options.map(({ value, label, icon }) => ({ value, label, icon }))} />
      </div>
    </div>
  );
}
