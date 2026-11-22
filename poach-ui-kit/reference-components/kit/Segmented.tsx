import { motion } from "motion/react";
import type { ReactNode } from "react";
import { useId } from "react";
import { cn } from "@/lib/utils";

export interface SegmentedOption<T extends string> {
  value: T;
  label: ReactNode;
  icon?: ReactNode;
  count?: number;
}

/** Engraved segmented control with a sliding "liquid" pill. */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  className,
  size = "md",
}: {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
  size?: "sm" | "md";
}) {
  const id = useId();
  return (
    <div
      role="tablist"
      className={cn(
        "well relative inline-flex items-center gap-0.5 rounded-xl p-[3px]",
        className,
      )}
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
              "relative z-0 inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-[9px] font-medium transition-colors duration-200 [&_svg]:size-4",
              size === "sm" ? "h-7 px-2.5 text-[12.5px]" : "h-8 px-3.5 text-[13px]",
              active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {active && (
              <motion.span
                layoutId={`seg-${id}`}
                className="absolute inset-0 -z-10 rounded-[9px] bg-card shadow-[var(--tab-pill)]"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            {o.icon}
            {o.label}
            {o.count !== undefined && (
              <span
                className={cn(
                  "tabular rounded-full px-1.5 text-[11px] leading-[18px]",
                  active ? "bg-primary-soft text-accent-foreground" : "bg-border/70 text-muted-foreground",
                )}
              >
                {o.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
