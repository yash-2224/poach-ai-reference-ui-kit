import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-xl bg-card px-3.5 py-1 text-sm shadow-engraved transition-[box-shadow,background] duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground/80 focus-visible:outline-none focus-visible:shadow-[0_0_0_1px_var(--color-ring),0_0_0_4px_oklch(0.6_0.13_262/0.14)] disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:shadow-[0_0_0_1px_var(--color-destructive),0_0_0_4px_oklch(0.6_0.19_25/0.12)]",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
