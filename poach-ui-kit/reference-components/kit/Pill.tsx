import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const pillVariants = cva(
  "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full font-medium tracking-[0.01em] [&_svg]:size-[13px] [&_svg]:shrink-0",
  {
    variants: {
      tone: {
        neutral: "bg-muted text-secondary-foreground shadow-[inset_0_0_0_1px_oklch(0.23_0.02_265/0.06)]",
        blue: "bg-primary-soft text-accent-foreground shadow-[inset_0_0_0_1px_oklch(0.49_0.17_262/0.12)]",
        green: "bg-success-soft text-success-foreground shadow-[inset_0_0_0_1px_oklch(0.6_0.12_158/0.18)]",
        amber: "bg-warning-soft text-warning-foreground shadow-[inset_0_0_0_1px_oklch(0.74_0.14_72/0.25)]",
        red: "bg-destructive-soft text-destructive shadow-[inset_0_0_0_1px_oklch(0.6_0.19_25/0.15)]",
        sky: "bg-info-soft text-info shadow-[inset_0_0_0_1px_oklch(0.64_0.11_232/0.18)]",
        white: "bg-card text-foreground shadow-engraved",
        ink: "bg-ink text-ink-foreground",
      },
      size: {
        sm: "h-[22px] px-2 text-[11.5px]",
        md: "h-6 px-2.5 text-xs",
        lg: "h-7 px-3 text-[13px]",
      },
    },
    defaultVariants: { tone: "neutral", size: "md" },
  },
);

const dotColor: Record<string, string> = {
  neutral: "bg-muted-foreground",
  blue: "bg-primary",
  green: "bg-success",
  amber: "bg-warning",
  red: "bg-destructive",
  sky: "bg-info",
  white: "bg-primary",
  ink: "bg-ink-foreground",
};

export interface PillProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof pillVariants> {
  dot?: boolean;
  pulse?: boolean;
}

export function Pill({ className, tone, size, dot, pulse, children, ...props }: PillProps) {
  return (
    <span className={cn(pillVariants({ tone, size }), className)} {...props}>
      {dot && (
        <span
          className={cn("size-1.5 rounded-full", dotColor[tone ?? "neutral"], pulse && "animate-breathe")}
        />
      )}
      {children}
    </span>
  );
}

export { pillVariants };
