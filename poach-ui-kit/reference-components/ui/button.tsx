import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium tracking-[0.01em] cursor-pointer transition-[background,box-shadow,transform,color,opacity] duration-200 ease-out active:scale-[0.98] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/25 disabled:pointer-events-none disabled:opacity-45 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-[17px] [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Graphite engraved CTA (the reference "Continue →" button)
        default:
          "bg-ink-gradient text-ink-foreground shadow-[inset_0_1px_0_oklch(1_0_0/0.14),0_0_0_1px_var(--ink-ring),0_2px_6px_-2px_oklch(0.2_0.01_265/0.45)] hover:opacity-[0.93]",
        primary:
          "bg-primary-gradient text-primary-foreground shadow-[inset_0_1px_0_oklch(1_0_0/0.2),0_0_0_1px_oklch(0.4_0.16_263),0_2px_6px_-2px_oklch(0.4_0.16_263/0.45)] hover:opacity-[0.93]",
        outline: "bg-card text-foreground shadow-engraved hover:bg-muted/60",
        secondary: "bg-secondary text-secondary-foreground hover:bg-muted engraved",
        soft: "bg-primary-soft text-accent-foreground hover:bg-accent",
        ghost: "text-muted-foreground hover:bg-muted hover:text-foreground",
        glass: "glass text-foreground hover:bg-card/80",
        band: "glass-band text-band-foreground hover:bg-band-foreground/15",
        success:
          "bg-success-soft text-success-foreground shadow-[inset_0_0_0_1px_oklch(0.6_0.12_158/0.2)] hover:bg-success-soft/70",
        destructive:
          "bg-destructive-soft text-destructive shadow-[inset_0_0_0_1px_oklch(0.6_0.19_25/0.18)] hover:bg-destructive-soft/70",
        link: "text-primary underline-offset-4 hover:underline active:scale-100",
      },
      size: {
        default: "h-9 px-4",
        sm: "h-8 rounded-lg px-3 text-[13px]",
        xs: "h-7 rounded-lg px-2.5 text-xs [&_svg]:size-[15px]",
        lg: "h-11 rounded-xl px-6 text-[15px]",
        icon: "size-9",
        "icon-sm": "size-8 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
